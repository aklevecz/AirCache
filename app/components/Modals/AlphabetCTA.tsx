import { useEffect } from "react";
import Big from "../Button/Big";
import EgglineIcon from "../Icons/Eggline";
import Container from "./Container";
import { ModalProps } from "./types";
interface Props extends ModalProps {}
export default function AlphabetCTA({ open, toggleModal }: Props) {
  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      const seenModal = localStorage.getItem("seenModal");
      if (!seenModal) {
        toggleModal();
        localStorage.setItem("seenModal", "1");
      }
    }
  }, []);
  return (
    <Container open={open} toggleModal={toggleModal}>
      <div>
        <div className="text-3xl font-bold text-center pb-5">
          Time to win a pizza!
        </div>
        <div className=" m-auto my-6 mb-12">
          Collect letters to spell pizza. You must collect letters in order!
        </div>
        <div className=" m-auto my-6 mb-12">
          Find a letter closeby and use the map to get within 10 meters of it.
          Once you are within 10 meters you can claim it.
        </div>
        <div className="flex items-center justify-around w-3/4 m-auto mt-8">
          <Big className="w-20 text-2xl" onClick={toggleModal}>
            Ok!
          </Big>
        </div>
      </div>
    </Container>
  );
}
