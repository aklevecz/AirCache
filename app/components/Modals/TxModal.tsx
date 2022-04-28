import { TxState } from "../../libs/types";
import AxeAnimation from "../Animations/Axe";
import Container from "./Container";
import { ModalProps } from "./types";
interface Props extends ModalProps {
  txState: TxState;
}
export default function TxModal({ open, toggleModal, txState }: Props) {
  return (
    <Container open={open} toggleModal={toggleModal}>
      <>{txState === TxState.Idle && <Waiting />}</>
      <>{txState === TxState.Mining && <Mining />}</>
      <>{txState === TxState.Complete && <Complete />}</>
      <>{txState === TxState.Error && <Error />}</>
    </Container>
  );
}

const Waiting = () => <div>Waiting...</div>;

const Mining = () => (
  <div>
    <div className="text-3xl font-bold text-center pb-5">Mining...</div>
    <AxeAnimation />
  </div>
);

const Complete = () => (
  <div>
    <div className="text-3xl font-bold text-center pb-5">Done!</div>
  </div>
);

const Error = () => (
  <div>
    <div className="text-3xl font-bold text-center pb-5 text-red-500">
      Something went wrong...
    </div>
  </div>
);
