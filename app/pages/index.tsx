import { useRouter } from "next/router";
import db from "../libs/db";
import { seoConfig } from "../libs/config";
type Props = {
  groups: { name: string }[];
};

const ContentBlock = ({ children }: any) => (
  <div className="flex justify-center align-center basis-10/12 lg:basis-1/2 text-center">
    <div className="p-10 text-3xl font-fatfrank tracking-widest">
      {children}
    </div>
  </div>
);

const Home = ({ groups }: Props) => {
  const router = useRouter();
  if (!groups) {
    return <div>loading...</div>;
  }
  console.log(groups, seoConfig);
  return (
    <div>
      <div className="text-center text-5xl mt-5 font-fatfrank tracking-widest">
        BLACKBEARD
      </div>
      <div className="text-center text-2xl mt-5 font-bold">Available Hunts</div>
      <div className="flex flex-col justify-center mt-5 pb-4 px-4">
        {groups.map((group) => (
          <button
            className="text-lg bg-white text-black py-2 px-4 mt-4 font-bold"
            onClick={() => router.push(`/eggs/${group.name}`)}
            key={group.name}
            style={{ maxWidth: 400, margin: "10px auto" }}
          >
            {seoConfig[group.name].title}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center align-center">
        <ContentBlock>Claim NFTS</ContentBlock>
        <ContentBlock>Explore the world</ContentBlock>
      </div>
    </div>
  );
};

export default Home;

export const getStaticProps = async () => {
  const params = {
    TableName: "air-yaytso-groups",
  };
  const dbRes = await db.scan(params).promise();
  const groups = dbRes.Items;
  return { props: { groups } };
};
