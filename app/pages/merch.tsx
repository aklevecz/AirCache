import clsx from "clsx";
import Button from "../components/Button";

type CardProps = {
  disabled: boolean;
  className?: string;
  title: string;
  description: string;
  image: string;
  imageLabel: string;
  buttonLabel: string;
  list?: string[];
};

const Card: React.FC<CardProps> = ({
  className = "",
  disabled = false,
  title,
  description,
  image,
  imageLabel,
  buttonLabel,
  list,
}: any) => {
  return (
    <div
      className={clsx(
        `relative bg-white text-black rounded-3xl flex-1 flex flex-col overflow-hidden`,
        className
      )}
    >
      <figure className="relative w-full">
        <img
          src={image || "/egg.png"}
          alt={title || "Music Explorers"}
          className="w-full"
        />
        <figcaption
          className={clsx(
            "absolute left-2 bottom-2 rounded-full bg-white py-1 px-2 text-sm uppercase",
            imageLabel === "golden egg" && "bg-primary"
          )}
        >
          {imageLabel}
        </figcaption>
      </figure>

      <article className="px-3 py-6 md:overflow-auto grow">
        <h1 className="text-base font-bold">{title}</h1>
        <p className="m-0">{description}</p>
        {list && list.length > 0 && (
          <ul className="mb-2 pl-4 list-disc">
            {list.map((item: string) => (
              <li>{item}</li>
            ))}
          </ul>
        )}

        <Button
          className={clsx(
            "relative w-full py-1 font-semibold bg-black text-white capitalize ",
            disabled && "z-50 absolute center"
          )}
          onClick={() => disabled && alert("Coming soon!")}
        >
          {disabled ? "Get notified ✉️" : buttonLabel}
        </Button>
        {disabled && (
          <div className="absolute left-0 top-0 w-full h-full bg-black opacity-50 z-20" />
        )}
      </article>
    </div>
  );
};

export default function Merch() {
  return (
    <div className="h-full flex flex-col gap-4 justify-center mt-2 py-14 px-4 md:flex-row">
      <Card
        disabled={false}
        title="Music Explorers – NFTNYC 2023 Egg Hunt Poster"
        description="Bespoke 1-of-1 festival poster customized to your NFTNYC experience"
        image="https://placehold.co/472x437"
        imageLabel="Free"
        buttonLabel="download"
        list={[
          "18”x24” museum-quality print",
          "thick matte paper + water-based inks",
        ]}
      />
      <Card
        disabled={false}
        title="Music Explorers – NFTNYC 2023 Egg Hunt Poster"
        description="1-of-3 festival package customized to your NFTNYC experience"
        image="https://placehold.co/472x437"
        imageLabel="golden egg"
        buttonLabel="Claim"
        list={[
          "includes bespoke festival poster and tshirt",
          "plus gifts, NFTs, + more from our partners and promoters",
        ]}
      />
      <Card
        disabled={true}
        title="Music Explorers – NFTNYC 2023 Egg Hunt Poster"
        description="Bespoke 1-of-1 festival t-shirt customized to your NFTNYC experience"
        image="https://placehold.co/472x437"
        imageLabel="Soon"
        buttonLabel="buy"
        list={["unisex long sleeve tee", "100% combed ring-spun cotton"]}
      />
    </div>
  );
}
