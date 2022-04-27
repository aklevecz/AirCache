import Spinner from "./Spinner";

export default function FullScreenSpinner() {
  return (
    <div className="w-full h-full absolute top-0 bg-red-500 opacity-30 flex items-center justify-center z-10">
      <Spinner />
    </div>
  );
}
