import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "../Button";
import Spinner from "../Loading/Spinner";
import eggImg from "../../assets/icons/egg.png";
import storage from "../../libs/storage";

export default function LoginRaptor({
  login,
  logout,
  mutate,
  goHome,
  fetching,
  cacheId,
  claim,
}: any) {
  console.log(claim);
  const [email, setEmail] = useState("");
  const onChange = (e: FormEvent<HTMLInputElement>) =>
    setEmail(e.currentTarget.value);

  return (
    <div className="flex flex-col justify-center items-center">
      {/* <img src={eggImg.src} /> */}
      <div className="text-4xl font-bold w-3/4 text-center mb-4">
        signin
      </div>
      <div className="mb-4 max-w-md text-center">
        punch in your phone number & I'll send you an text
      </div>
      <input
        autoComplete="email"
        name="email"
        type="tel"
        placeholder="##########"
        className="h-10 p-2 w-64"
        onChange={onChange}
        value={email}
      />
      <motion.div
        style={{ fontSize: email ? 14 : 0 }}
        layout
        className="text-1xl font-bold w-4/5 text-center m-4"
      >
        You will be sent a verification code
      </motion.div>
      <Button
        className="w-32 mt-4 font-bold"
        onClick={() => {
          // let destination = cacheId ? `/cache-${cacheId}` : "/";

          // if (claim) {
          //   destination = `/claim-${claim}`;
          // }
          // console.log(destination);
          let destination = "/";
          if (typeof localStorage !== "undefined") {
            const currentGroup = storage.getItem(storage.keys.current_group);
            if (currentGroup) {
              destination = "/" + currentGroup;
            }
          }
          login(email, destination);
        }}
      >
        {fetching ? (
          <div id="button" className="bg-black rounded-full">
            <Spinner />
          </div>
        ) : (
          "Claim"
        )}
      </Button>

      {/* <Button className="w-32" onClick={logout}>
        Logout
      </Button> */}
    </div>
  );
}
