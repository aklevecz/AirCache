import axios from "axios";
import { useEffect, useState } from "react";
import { ipfstoIO, isIpfs } from "../libs/utils";
import BlackWrappedSpinner from "./Loading/BlackWrappedSpinner";
import Nfts from "./Manager/Nfts";

type Props = {
  className: string;
  uri: string;
};
export default function Img(props: Props) {
  const [loaded, setLoaded] = useState(false);
  const [src, setSrc] = useState("");
  const { className, uri } = props;

  useEffect(() => {
    if (uri) {
      const url = isIpfs(uri) ? ipfstoIO(uri) : uri;
      // THis could try to fetch and if there is cors then it switches to the proxy
      axios
        .get(isIpfs(uri) ? url : `/api/img-fetch?uri=${url}`, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          const blob = new Blob([res.data], {
            type: res.headers["content-type"],
          });
          setSrc(URL.createObjectURL(blob));
          setLoaded(true);
        });
    }
  }, [uri]);
  if (!loaded) {
    return <BlackWrappedSpinner />;
  }
  return <img className={className} src={src} />;
}
