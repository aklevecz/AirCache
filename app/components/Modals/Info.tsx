import Container from "./Container";
import { ModalProps } from "./types";

interface Props extends ModalProps {
  center?: boolean;
}

export default function InfoModal({
  open,
  toggleModal,
  center = false,
}: Props) {
  return (
    <Container open={open} toggleModal={toggleModal} center={center}>
      <h1>Music Explorers </h1>
      <p>Tell me more</p>
      <p>
        Product by <a href="https://hifilabs.co">HIFI Labs</a>.
      </p>
    </Container>
  );
}
