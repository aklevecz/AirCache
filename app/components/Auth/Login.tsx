import { FormEvent, useState } from "react";
import Button from "../Button";
import Spinner from "../Loading/Spinner";

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

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-3xl font-bold w-3/4 text-center mb-10">Login</div>
      <div className="text-1xl font-bold w-3/4 text-center mb-10">
        Type your email below, you will be send a verification link
      </div>

      <input
        autoComplete="email"
        name="email"
        type="email"
        placeholder="Email"
        className="h-10 p-2 w-64"
        onChange={onChange}
        value={email}
      />
      <Button className="w-32 mt-10 font-bold" onClick={() => login(email)}>
        {fetching ? (
          <div className="bg-black rounded-full">
            <Spinner />
          </div>
        ) : (
          "Login"
        )}
      </Button>
    </div>
  );
}
