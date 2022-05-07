import Link from "next/link";
import { useRouter } from "next/router";
import EgglineIcon from "./Icons/Eggline";
import MapIcon from "./Icons/Map";

const links = [
  { name: "Map", path: "/", icon: <MapIcon /> },

  { name: "Wallet", path: "/wallet", icon: <EgglineIcon /> },
];

const ICON_DIMS = 60;
export default function Nav() {
  const router = useRouter();

  return (
    <div
      style={{
        display: router.asPath === "/login" ? "none" : "flex",
        height: 80,
      }}
      className="fixed bottom-0 left-0 w-full justify-around"
    >
      {links.map((link) => (
        <Link key={link.name} href={`${link.path}`}>
          <div
            style={{
              width: ICON_DIMS,
              height: ICON_DIMS,
              padding: 17,
              boxSizing: "border-box",
              backgroundColor: "#f97dff",
            }}
            className="capitalize text-white font-bold text-2xl p-2 items-center justify-center flex rounded-full"
          >
            {link.icon}
          </div>
        </Link>
      ))}
    </div>
  );
}
