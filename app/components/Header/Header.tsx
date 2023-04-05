import Link from "next/link";
import Logo from "./icons/logo.svg";
import Info from "./icons/info.svg";

export default function Header() {
  const openInfo = () => console.log("info");
  return (
    <header
      className="z-[100] fixed px-6 py-3 top-0 left-0 right-0 flex backdrop-blur-sm justify-between items-center md:justify-start"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
    >
      <Link href="/" className="flex items-center cursor-pointer">
        <a>
          <img src={Logo.src} alt="Music explorers" />
        </a>
      </Link>
      <a className="ml-4 scale-50 cursor-pointer" onClick={openInfo}>
        <img src={Info.src} alt="info" title="Music Explorers info" />
      </a>
    </header>
  );
}
