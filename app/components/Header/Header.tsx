import Link from "next/link";
import Logo from "./icons/logo.svg";
import Info from "./icons/info.svg";
import InfoModal from "../Modals/Info";
import useModal from "../../hooks/useModal";

export default function Header() {
  const modal = useModal();

  return (
    <>
      <header
        className="z-[100] fixed px-6 py-3 top-0 left-0 right-0 flex backdrop-blur-sm justify-between items-center md:justify-start h-[54px]"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
      >
        <Link href="/" className="flex items-center cursor-pointer">
          <a>
            <img src={Logo.src} alt="Music explorers" />
          </a>
        </Link>
        <a
          className="ml-4 scale-50 cursor-pointer"
          onClick={() => modal.toggleModal()}
        >
          <img src={Info.src} alt="info" title="Music Explorers info" />
        </a>
      </header>
      <InfoModal
        open={modal.open}
        toggleModal={modal.toggleModal}
        center={true}
      />
    </>
  );
}
