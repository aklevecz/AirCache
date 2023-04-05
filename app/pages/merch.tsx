import clsx from "clsx";
import Button from "../components/Button";
import NotifyModal from "../components/Modals/Notify";
import useModal from "../hooks/useModal";

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
  const modal = useModal();

  return (
    <>
      <div
        className={clsx(
          `relative bg-white text-black rounded-3xl flex-1 flex flex-col overflow-auto`,
          className
        )}
      >
        <figure className="relative w-full sticky top-0">
          <img
            src={image || "/egg.png"}
            alt={title || "Music Explorers"}
            className="w-full object-cover h-[300px]"
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

        <article
          className="relative px-2 pt-4 pb-12 grow-1 bg-white"
          style={{ flexGrow: 1 }}
        >
          <div>
            <h1 className="text-base font-bold">{title}</h1>
            <p className="m-0">{description}</p>
            {list && list.length > 0 && (
              <ul className="mb-2 pl-4 list-disc">
                {list.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          <Button
            className="z-50 absolute b-0 l-0 w-full py-1 font-semibold bg-black text-white capitalize"
            style={{
              position: "absolute",
              bottom: "12px",
              left: 0,
              margin: "0 12px",
              width: "calc(100% - 24px)",
            }}
            onClick={() => disabled && modal.toggleModal()}
          >
            {disabled ? "Get notified ✉️" : buttonLabel}
          </Button>

          {disabled && (
            <div className="absolute left-0 top-0 w-full h-full bg-black opacity-50 z-20" />
          )}
        </article>
      </div>

      {disabled && (
        <NotifyModal
          open={modal.open}
          toggleModal={modal.toggleModal}
          center={true}
        />
      )}
    </>
  );
};

export default function Merch() {
  return (
    <div className="flex flex-col gap-4 justify-center px-4 pb-[80px] md:flex-row relative md:h-[calc(100vh-80px-54px-20px)] md:top-[54px] md:pb-0">
      <Card
        key={"1"}
        disabled={false}
        title="Music Explorers – NFTNYC 2023 Egg Hunt Poster"
        description="Bespoke 1-of-1 poster customized to your NFTNYC experience"
        image="/poster-teaser.gif"
        imageLabel="Free"
        buttonLabel="download"
        list={[
          "18”x24” museum-quality print",
          "thick matte paper + water-based inks",
        ]}
      />
      <Card
        key={"2"}
        disabled={false}
        title="Music Explorers – NFTNYC 2023 Egg Hunt Hoodie"
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
        key={"3"}
        disabled={true}
        title="Music Explorers – NFTNYC 2023 Egg Hunt Shirt"
        description="Bespoke 1-of-1 festival t-shirt customized to your NFTNYC experience"
        image="/shirt-teaser.gif"
        imageLabel="Soon"
        buttonLabel="buy"
        list={["unisex long sleeve tee", "100% combed ring-spun cotton"]}
      />
    </div>
  );
}
