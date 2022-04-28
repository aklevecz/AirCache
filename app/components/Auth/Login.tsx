import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "../Button";
import Spinner from "../Loading/Spinner";
import eggImg from "../../assets/icons/egg.png";

export default function Login({
  login,
  logout,
  mutate,
  goHome,
  fetching,
}: any) {
  const [email, setEmail] = useState("");
  const onChange = (e: FormEvent<HTMLInputElement>) =>
    setEmail(e.currentTarget.value);
  useEffect(() => {
    logout();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <img src={eggImg.src} />
      <div className="text-3xl font-bold w-3/4 text-center mb-10">Login</div>

      <input
        autoComplete="email"
        name="email"
        type="email"
        placeholder="Email"
        className="h-10 p-2 w-64"
        onChange={onChange}
        value={email}
      />
      <motion.div
        style={{ fontSize: email ? 14 : 0 }}
        layout
        className="text-1xl font-bold w-4/5 text-center m-4"
      >
        You will be sent a verification link
      </motion.div>
      <Button
        className="w-32 mt-4 font-bold"
        onClick={() => {
          login(email);
        }}
      >
        {fetching ? (
          <div id="button" className="bg-black rounded-full">
            <Spinner />
          </div>
        ) : (
          "Login"
        )}
      </Button>

      {/* <Button className="w-32" onClick={logout}>
        Logout
      </Button> */}
    </div>
  );
}
