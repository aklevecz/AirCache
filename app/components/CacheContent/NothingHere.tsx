import Button from "../Button";
import Sad from "../Icons/Sad";

type Props = {
  toggleModal: () => void;
  data: any;
};

export default function NothingHere({ toggleModal, data }: Props) {
  return (
    <>
      <div className="text-3xl font-bold text-center pb-5">
        Nothing here... Someone got here first!{" "}
        {process.env.NODE_ENV === "development" ? data.cache.id : ""}
      </div>
      <div className="w-3/4 m-auto p-10">
        <Sad />
      </div>
      <Button
        onClick={() => {
          toggleModal();
        }}
        className="m-auto w-28 block mt-5 py-3"
      >
        Ok
      </Button>
    </>
  );
}
