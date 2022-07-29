import { useRouter } from "next/router";
import db from "../libs/db";
import { seoConfig } from "../libs/config";
import { FormEvent, useState } from "react";
import trove from "../assets/icons/chest-filled.png";
import myosin from "../assets/icons/myosin.png";
import MapIcon from "../components/Icons/Map";
import { onEmailSignup } from "../libs/api";
import BlackWrappedSpinner from "../components/Loading/BlackWrappedSpinner";
import { motion } from "framer-motion";
type Props = {
  groups: { name: string }[];
};

const ContentBlock = ({ children }: any) => (
  <div className="flex justify-center md:justify-start align-center basis-10/12 md:basis-1/2 text-center">
    <div
      className="p-2 pt-5 text-4xl font-fatfrank tracking-widest md:text-7xl md:text-left md:pr-30 md:w-10/12"
      // style={{ fontSize: 40 }}
    >
      {children}
    </div>
  </div>
);

const Home = ({ groups }: Props) => {
  const [viewHunts, setViewHunts] = useState(false);
  const [email, setEmail] = useState("");
  const [fetching, setFetching] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const onEmailChange = (e: FormEvent<HTMLInputElement>) =>
    setEmail(e.currentTarget.value);
  const onSubmitEmail = async () => {
    setFetching(true);
    const res = await onEmailSignup(email);
    setFetching(false);
    console.log(res);
    if (res.status === 200) {
      setIsSignedUp(true);
    }
  };
  const router = useRouter();
  if (!groups) {
    return <div>loading...</div>;
  }
  return (
    <div className="pb-20">
      <div className="text-center text-5xl mt-5 font-fatfrank tracking-widest">
        BLACKBEARD
      </div>

      <div
        id="section-1"
        className="mt-5 flex flex-col md:flex-row md:flex-wrap md:align-center"
      >
        <div className="md:basis-1/2">
          <img src={trove.src} className="w-3/5 m-auto " />
        </div>
        <ContentBlock>HUNT FOR NFTS</ContentBlock>
        <div className="m-auto p-10 md:basis-1/2">
          <MapIcon dims={"200px"} margin="auto" />
        </div>
        <ContentBlock>EXPLORE THE WORLD</ContentBlock>
      </div>
      <motion.div layout>
        {!isSignedUp && (
          <div id="section-2">
            <div className="text-2xl font-fatfrank text-center mt-10">
              Sign up for more info
            </div>
            <input
              className="m-auto block mt-2 text-center p-2"
              style={{ borderRadius: 10 }}
              name="email"
              value={email}
              type="email"
              placeholder="email"
              onChange={onEmailChange}
            />
            <button
              onClick={onSubmitEmail}
              className="bg-white text-black px-5 py-2 font-fatfrank rounded-full text-xl m-auto block mt-4"
            >
              {fetching ? <BlackWrappedSpinner /> : "Signup"}
            </button>
          </div>
        )}
        {isSignedUp && (
          <div
            id="section-2"
            className="mt-10 p-5"
            style={{ border: "2px solid white" }}
          >
            <div className="text-5xl text-center font-fatfrank">
              You're all set!
            </div>
          </div>
        )}
      </motion.div>
      <div id="section-3" className="mt-10">
        <div className="flex justify-center align-center basis-10/12 md:basis-1/2 text-center">
          <div
            className="p-2 pt-5 text-4xl font-fatfrank tracking-widest md:text-7xl  md:pr-30 md:w-10/12"
            // style={{ fontSize: 40 }}
          >
            Powered by myosin
          </div>
        </div>
        <img className="block m-auto" src={myosin.src} />
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
{
  /* <div className="text-center text-2xl mt-5 font-bold">Available Hunts</div>
      <div className="flex flex-col justify-center mt-5 pb-4 px-4">
        {Object.keys(seoConfig)
          // .filter((group) => seoConfig[group.name])
          .map((key) => (
            <button
              className="text-lg bg-white text-black py-2 px-4 mt-4 font-bold"
              onClick={() => router.push(`/eggs/${key}`)}
              key={key}
              style={{ maxWidth: 400, margin: "10px auto" }}
            >
              {seoConfig[key].title}
            </button>
          ))}
      </div> */
}
