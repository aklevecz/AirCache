import { FormEvent, useState } from "react";
import Button from "../Button";
import Spinner from "../Loading/Spinner";

export default function Logout({ login, logout, fetching }: any) {
  const [email, setEmail] = useState("");
  const onChange = (e: FormEvent<HTMLInputElement>) =>
    setEmail(e.currentTarget.value);

  return (
    <div className="flex flex-col justify-center items-center">
      <Button className="w-32" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}
