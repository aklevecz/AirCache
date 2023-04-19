import Link from "next/link";
import { useRouter } from "next/router";
import { colors } from "../libs/constants";
import storage from "../libs/storage";
import EgglineIcon from "./Icons/Eggline";
import Present from "./Icons/Present";
import MapIcon from "./Icons/Map";
import QuestionIcon from "./Icons/Question";

// To do: Some way of remembering what page they went to before
// Or just put the login in the modal instead of having its own designated page?
const links = [
  { name: "Map", path: "/eggs/myosin-yacht", icon: <MapIcon /> },
  { name: "Wallet", path: "/wallet", icon: <EgglineIcon /> },
];

const ICON_DIMS = 60;
export default function Nav() {
  const router = useRouter();

  const hideNavPaths = ["login", "manager", "claim", ""];
  return (
    <div
      style={{
        display: hideNavPaths.includes(router.asPath.split("/")[1].split("?")[0]) ? "none" : "flex",
      }}
      className="fixed z-50 bottom-2 left-0 w-full justify-around pointer-events-none"
    >
      <Link
        key={"Map"}
        href={
          typeof localStorage !== "undefined" && storage.getItem(storage.keys.current_group)
            ? `/eggs/${storage.getItem(storage.keys.current_group)}`
            : "/"
        }
      >
        <div
          style={{
            width: ICON_DIMS - 3,
            height: ICON_DIMS - 3,
          }}
          className="p-4 bg-primary justify-center flex rounded-full pointer-events-auto cursor-pointer box-border"
        >
          <MapIcon color="black" />
        </div>
      </Link>
      {/* <Link key={"merch"} href={`/merch`}>
        <div
          style={{
            width: ICON_DIMS,
            height: ICON_DIMS,
          }}
          className="p-4 bg-primary justify-center flex rounded-full pointer-events-auto cursor-pointer box-border"
        >
          <QuestionIcon />
        </div>
      </Link> */}
      <Link key={"wallet"} href={`/wallet`}>
        <div
          style={{
            width: ICON_DIMS + 2,
            height: ICON_DIMS + 2,
          }}
          className="p-4 bg-[#FFD432] justify-center flex rounded-full pointer-events-auto cursor-pointer box-border"
        >
          <EgglineIcon color="black" />
        </div>
      </Link>
      {/* {links.map((link) => (
        <Link key={link.name} href={`${link.path}`}>
          <div
            style={{
              width: ICON_DIMS,
              height: ICON_DIMS,
              padding: 17,
              boxSizing: "border-box",
              backgroundColor: colors.lavender,
            }}
            className="capitalize text-white font-bold text-2xl p-2 items-center justify-center flex rounded-full pointer-events-auto"
          >
            {link.icon}
          </div>
        </Link>
      ))} */}
    </div>
  );
}
