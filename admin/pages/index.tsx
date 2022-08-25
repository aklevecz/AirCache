import type { NextPage } from "next";
import db from "../libs/db";
import { useWallet } from "../contexts/WalletContext";
import { useSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";
import Signin from "../components/Auth/Signin";
import UserInfo from "../components/UserInfo";
import Layout from "../components/Layout";
import TheirHunts from "../components/TheirHunts";
import CreateHuntForm from "../components/Forms/CreateHunt";
import { useEffect, useState } from "react";
import { getHuntMetadata } from "../libs/api";
import SectionHeading from "../components/Layout/SectionHeading";
import Link from "next/link";

// {
// ["coindesk-austin"]: {
//   title: "Coindesk Egg Hunt",
//   description: "Find eggs filled with NFT Longhorns scattered around Austin!",
//   image: `${host}/coindesk-austin-banner.png`,
//   map_center: cityCenters.austin,
//   icon: { useNFT: false, image: { empty: hornEgg, filled: hornEgg } },
// }
// }

type HuntMetadata = {
  name: string;
  description: string;
  location: string;
  icons: {
    markerEmpty: string;
    markerFilled: string;
  };
};

type Group = {
  name: string;
};

type Props = {
  groups: Group[];
};

// Should be able to edit a hunts assets and metadata

const Home: NextPage<Props> = ({ groups }) => {
  const { data: session } = useSession();
  const [selectedHuntMetadata, setSelectedHuntMetadata] =
    useState<HuntMetadata | null>(null);
  const [showCreateHunt, setShowCreateHunt] = useState(false);

  const toggleCreateHunt = () => {
    setSelectedHuntMetadata(null);
    setShowCreateHunt(!showCreateHunt);
  };

  const fetchHuntMetadata = (name: string) => {
    setShowCreateHunt(false);
    getHuntMetadata(name).then(setSelectedHuntMetadata);
  };

  if (!session) {
    return <Signin />;
  }
  if (!groups) {
    return <div>loading...</div>;
  }

  const metadata = selectedHuntMetadata;

  return (
    // <div className="flex flex-col text-white">
    <Layout>
      {session && <UserInfo />}
      <div className="grid grid-cols-3 justify-center p-5 mt-10">
        <TheirHunts
          groups={groups}
          toggleCreateHunt={toggleCreateHunt}
          fetchHuntMetadata={fetchHuntMetadata}
          selectedHunt={metadata && metadata.name}
        />
        {showCreateHunt && <CreateHuntForm />}
        {metadata && (
          <div>
            <SectionHeading>Hunt Details</SectionHeading>
            <div>{metadata.name}</div>
            <div>{metadata.description}</div>
            <div>{metadata.location}</div>
            <div className="flex">
              <img src={metadata.icons.markerEmpty} />{" "}
              <img src={metadata.icons.markerFilled} />
            </div>
            <Link href={`/hunt/${metadata.name}`}>
              <button>Go to Hunt Map</button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;

export async function getServerSideProps(context: any) {
  const authOptions = { providers: [] };
  const session = await unstable_getServerSession(
    context.req as any,
    context.res as any,
    authOptions as any
  );
  let groups: any[] = [];
  if (session && session.user) {
    const params = {
      TableName: "air-yaytso-groups",
    };
    const dbRes = await db.scan(params).promise();
    const email = session.user.email;
    groups = dbRes.Items!.filter((item) => item.creator === email);
  }

  return {
    props: {
      groups,
    },
  };
}

// export const getStaticProps = async () => {
//   const params = {
//     TableName: "air-yaytso-groups",
//   };
//   const dbRes = await db.scan(params).promise();
//   const token = await getToken();
//   const groups = dbRes.Items!.filter((item) => item.creator === token?.email);
//   console.log(groups);
//   return { props: { groups } };
// };
