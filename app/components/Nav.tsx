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

  const hideNavPaths = ["/login", "/manager"];
  return (
    <div
      style={{
        display: hideNavPaths.includes(router.asPath) ? "none" : "flex",
        height: 80,
      }}
      className="fixed bottom-0 left-0 w-full justify-around pointer-events-none"
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
            className="capitalize text-white font-bold text-2xl p-2 items-center justify-center flex rounded-full pointer-events-auto"
          >
            {link.icon}
          </div>
        </Link>
      ))}
    </div>
  );
}
