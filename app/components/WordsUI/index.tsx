import AlphabetCTA from "../Modals/AlphabetCTA";

type Props = {
    letters:string;
    word:string;
    isWordHunt:boolean;
    ctaModal: any
}

export default function WordsUI({letters, word, isWordHunt, ctaModal}:Props) {
    return (<>
          <div className="absolute bottom-44 w-full text-center z-50 text-xl pointer-events-none flex justify-center">
        {Array.from(letters).map((letter) => {
          return (
            <div className="bg-red-500 w-10 h-10 font-fatfrank text-2xl tracking-widest uppercase m-2 flex justify-center items-center">
              {letter}
            </div>
          );
        })}
      </div>
      {word && (
        <div className="absolute bottom-28 w-full text-center z-50 text-xl pointer-events-none w-full text-white font-fatfrank">
          {/* <span className="bg-black p-5 font-fatfrank w-full"> */}
          <div className="underline">Solve</div>
          <div style={{ fontSize: "2rem" }}>{word}</div>
          {/* </span> */}
        </div>
      )}
            {isWordHunt && (
        <AlphabetCTA open={ctaModal.open} toggleModal={ctaModal.toggleModal} />
      )}
    </>)
}