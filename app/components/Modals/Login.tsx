import ModalCommonLogin from "../ModalCommon/Login";
import Container from "./Container";
import { ModalProps } from "./types";
interface Props extends ModalProps {}
export default function LoginModal({ open, toggleModal }: Props) {
  return (
    <Container open={open} toggleModal={toggleModal}>
      <ModalCommonLogin toggleModal={toggleModal} />
    </Container>
  );
}
