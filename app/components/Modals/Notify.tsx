import Container from "./Container";
import { ModalProps } from "./types";

interface Props extends ModalProps {
  center?: boolean;
}

export default function NotifyModal({
  open,
  toggleModal,
  center = false,
}: Props) {
  return (
    <Container open={open} toggleModal={toggleModal} center={center}>
      <h1>Notify my bebeh </h1>
      <p>Tell me more</p>
      <p>
        Product by <a href="https://hifilabs.co">HIFI Labs</a>.
      </p>
    </Container>
  );
}
