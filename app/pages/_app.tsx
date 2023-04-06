import "../styles/globals.css";
import type { AppProps } from "next/app";
import Nav from "../components/Nav";
import Header from "../components/Header/Header";
import { MotionConfig } from "framer-motion";
import { easeOut } from "../motion/ease";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <MotionConfig
        reducedMotion="user"
        transition={{ ease: easeOut, duration: 0.85 }}
      >
        <Component {...pageProps} />
      </MotionConfig>
      <Nav />
    </>
  );
}

export default MyApp;
