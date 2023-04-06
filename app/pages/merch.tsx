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
          `relative overflow-hidden max-w-sm sm:max-w-[30%] flex-1 flex flex-col justify-center item-center bg-white text-black rounded-3xl`,
          className
        )}
      >
        <figure className="relative w-full h-[40%] shrink">
          <img
            src={image || "/egg.png"}
            alt={title || "Music Explorers"}
            className="w-full aspect-square	object-cover max-h-[250px]"
          />
          <figcaption
            className={clsx(
              "absolute left-2 bottom-2 rounded-full bg-white py-1 px-2 text-sm uppercase",
              imageLabel.toLowerCase() === "golden egg" && "bg-primary"
            )}
          >
            {imageLabel}
          </figcaption>
        </figure>

        <article
          className="relative px-3 py-4 grow-1 bg-white"
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
            className="z-50 w-full py-1 font-semibold bg-primary text-black capitalize"
            onClick={() => disabled && modal.toggleModal()}
          >
            {disabled ? "Get notified ✉️" : buttonLabel}
          </Button>
        </article>
        {disabled && (
          <div className="absolute left-0 top-0 w-full h-full bg-black opacity-50 z-20" />
        )}
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
    <div className="flex justify-center items-center pt-[54px] pb-[80px] sm:pb-0:pt-0:h-full">
      <div className="relative flex flex-col gap-4 justify-center items-start px-4 sm:flex-row">
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
          imageLabel="Golden egg"
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
    </div>
  );
}
