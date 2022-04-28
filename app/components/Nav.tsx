import Link from "next/link";
import { useRouter } from "next/router";
import EgglineIcon from "./Icons/Eggline";
import MapIcon from "./Icons/Map";

const links = [
  { name: "Map", path: "/", icon: <MapIcon /> },

  { name: "Wallet", path: "/wallet", icon: <EgglineIcon /> },
];

export default function Nav() {
  const router = useRouter();

  return (
    <div
      style={{
        display: router.asPath === "/login" ? "none" : "flex",
        height: 50,
      }}
      className="fixed bottom-0 left-0 bg-black w-full justify-around"
    >
      {links.map((link) => (
        <Link key={link.name} href={`${link.path}`}>
          <div
            style={{
              width: 50,
              height: 50,
              padding: 12,
              boxSizing: "border-box",
            }}
            className="capitalize text-white font-bold text-2xl p-2 items-center justify-center flex"
          >
            {link.icon}
          </div>
        </Link>
      ))}
    </div>
  );
}
