import storage from "../../libs/storage";
import Button from "../Button";
import MapIcon from "../Icons/Map";
import BlackWrappedSpinner from "../Loading/BlackWrappedSpinner";
import ModalCommonLogin from "../ModalCommon/Login";

type Props = {
  error: { message: string; error: string };
  toggleModal: () => void;
};

export default function Error({ error, toggleModal }: Props) {
  return (
    <>
      <div className="text-3xl font-bold text-center pb-5">{error.message}</div>
      <div className="max-w-xs px-2 m-auto">
        {error.error === "TOO_FAR" && (
          <div className="w-1/2 m-auto">
            <MapIcon />
          </div>
        )}
        {error.error === "TOO_FAR" && (
          <Button onClick={toggleModal} className="w-20 font-bold m-auto block text-2xl mt-10">
            Ok
          </Button>
        )}
        {error.error === "NO_AUTH" && <ModalCommonLogin toggleModal={toggleModal} />}
      </div>
    </>
  );
}
