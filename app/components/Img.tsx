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
      console.log(url);
      axios
        .get(`/api/img-fetch?uri=${url}`, { responseType: "arraybuffer" })
        .then((res) => {
          const badType = "application/octet-stream";
          const givenType = res.headers["content-type"];
          const svgType = "image/svg+xml";
          let type = givenType === badType ? svgType : givenType;
          const blob = new Blob([res.data], {
            type,
          });
          console.log(blob);
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
