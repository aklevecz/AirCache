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
    : "Sign in with SMS in order to claim";
  const buttonText = auth.isConnect ? "Connect" : "Send SMS";

  return (
    <div className="flex flex-col justify-center">
      <div className="text-xl text-center pb-7">{message}</div>
      {!auth.isConnect && (
        <input
          autoComplete="tel"
          name="email"
          type="tel"
          placeholder="##########"
          className="py-2 px-4 w-full mb-6 text-center text-gray-800 placeholder:text-gray-300 border-gray-800 border-solid border-2 rounded-3xl text-lg"
          onChange={onChangeEmail}
        />
      )}
      {auth.fetching ? (
        <BouncyEgg className="self-center" />
      ) : (
        <Button
          className="m-auto w-32 block mt-0 py-2 px-4"
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
          {buttonText}
        </Button>
      )}
    </div>
  );
}
