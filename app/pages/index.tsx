import { useRouter } from "next/router";
import db from "../libs/db";
import { seoConfig } from "../libs/config";
type Props = {
  groups: { name: string }[];
};
const Home = ({ groups }: Props) => {
  const router = useRouter();

  if (!groups) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <div className="text-center text-5xl mt-5 font-blackbeard">
        BLACKBEARD
      </div>
      <div className="text-center text-2xl mt-5">Pick a hunt to begin</div>
      <div className="flex flex-col justify-center mt-5">
        {groups.map((group) => (
          <button
            className="text-lg bg-white text-black py-2 px-4 mt-4 font-bold"
            onClick={() => router.push(`/eggs/${group.name}`)}
            key={group.name}
          >
            {seoConfig[group.name].title}
          </button>
        ))}
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
