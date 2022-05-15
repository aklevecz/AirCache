import Big from "../Button/Big";
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
          Fill egg #{cacheId}?
        </div>
        <div className="flex items-center justify-around">
          <Big onClick={confirm}>Yes</Big>
          <Big onClick={toggleModal}>NO</Big>
        </div>
      </div>
    </Container>
  );
}
