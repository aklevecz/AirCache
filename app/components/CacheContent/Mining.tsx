import AxeAnimation from "../Animations/Axe";

export default function Mining() {
  return (
    <>
      <div className="text-3xl font-bold text-center pb-5">You got it! The ticket is on its way to you...</div>
      <AxeAnimation />
      {/* <div className="text-center">
            <a
              target={"_blank"}
              className="text-polygon"
              href={`https://mumbai.polygonscan.com/tx/${txHash}`}
            >
              Polyscan Tx
            </a>
          </div> */}
    </>
  );
}
