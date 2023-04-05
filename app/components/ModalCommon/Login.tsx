import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import storage from "../../libs/storage";
import Button from "../Button";
import BouncyEgg from "../Loading/BouncyEgg";

type Props = {
  toggleModal: () => void;
};

export default function ModalCommonLogin({ toggleModal }: Props) {
  const auth = useAuth();
  // email will be number now?
  const [email, setEmail] = useState("");
  const onChangeEmail = (e: React.FormEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };
  const message = auth.isConnect
    ? "Tap to connect!"
    : "Sign in with sms in order to claim";
  const buttonText = auth.isConnect ? "Connect" : "Sign in";
  return (
    <div>
      <div className="text-xl text-center pb-7">{message}</div>
      {!auth.isConnect && (
        <input
          autoComplete="tel"
          name="email"
          type="tel"
          placeholder="##########"
          className="h-10 p-2 w-full mb-6 text-center black-beard"
          style={{ fontSize: 18 }}
          onChange={onChangeEmail}
        />
      )}
      <Button
        className="m-auto w-32 block mt-0 py-2 px-4 font-bold text-lg"
        disabled={auth.fetching}
        onClick={async () => {
          let destination = "/";
          if (typeof localStorage !== "undefined") {
            const currentGroup = storage.getItem(storage.keys.current_group);
            if (currentGroup) {
              destination = "/" + currentGroup;
            }
          }
          await auth.logout();
          await auth.login(email, destination);
          toggleModal();
        }}
      >
        {auth.fetching ? <BouncyEgg /> : buttonText}
      </Button>
    </div>
  );
}
