import Big from "../Button/Big";
import EgglineIcon from "../Icons/Eggline";
import Container from "./Container";
import { ModalProps } from "./types";
interface Props extends ModalProps {
  cacheId: number | null;
  confirm: () => void;
}
export default function PickCache({
  open,
  toggleModal,
  cacheId,
  confirm,
}: Props) {
  return (
    <Container open={open} toggleModal={toggleModal}>
      <div>
        <div className="text-3xl font-bold text-center pb-5">
          Pick egg #{cacheId}?
        </div>
        <div className="w-1/4 m-auto my-6 mb-12">
          <EgglineIcon />
        </div>
        <div className="flex items-center justify-around w-3/4 m-auto mt-8">
          <Big className="text-2xl" onClick={toggleModal}>
            Nevermind
          </Big>
          <Big className="w-20 text-2xl" onClick={confirm}>
            Ok!
          </Big>
        </div>
      </div>
    </Container>
  );
}
