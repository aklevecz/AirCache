import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

import Logo from "./icons/logo.svg";
import Info from "./icons/info.svg";
import InfoModal from "../Modals/Info";
import useModal from "../../hooks/useModal";

export default function Header() {
  const modal = useModal();
  const router = useRouter();
  const { pathname } = router;

  const isMap = pathname === "/eggs/[groupName]";
  const style = isMap ? {} : { backgroundColor: "rgba(0, 0, 0, 0.15)" };

  return (
    <>
      <header
        className={clsx(
          !isMap && "backdrop-blur-sm right-0",
          "z-[100] fixed top-0 left-0 px-6 py-3  flex items-center justify-start h-[54px]"
        )}
        style={style}
      >
        <Link href="/" className="flex items-center cursor-pointer">
          <a>
            <img src={Logo.src} alt="Music explorers" />
          </a>
        </Link>
        <a
          className="scale-50 cursor-pointer"
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
