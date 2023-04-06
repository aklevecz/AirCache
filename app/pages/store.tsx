import Button from "../components/Button";

export default function Store() {
  return (
    <div className="h-full flex flex-col justify-center content-center items-center p-10">
      <img
        src="/temp-store-header.png"
        alt="Probably nothing."
        className="-mt-36"
      />
      <h1 className="mb-6 -mt-12 fw-5 font-bold text-center text-5xl">
        Probably nothing.
      </h1>
      <form action="" className="my-4 flex flex-row justify-center ">
        <input
          type="email"
          placeholder="gm@your.email"
          className="py-2 px-4 rounded-xl"
        />
        <Button type="submit" variant="secondary">
          Get notified
        </Button>
      </form>
      <p className="text-center my-2">
        No spam, ever. Pinky-promise.{" "}
        <span aria-label="fingers crossed" aria-role="img">
          🤞
        </span>
        <br />
        ETA ~2 weeks.
      </p>
    </div>
  );
}
