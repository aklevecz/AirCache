import "../styles/globals.css";
import type { AppProps } from "next/app";
import Nav from "../components/Nav";
import Header from "../components/Header/Header";
import { MotionConfig, AnimatePresence } from "framer-motion";
import { easeOut } from "../motion/ease";

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Header />
      <MotionConfig
        reducedMotion="user"
        transition={{ ease: easeOut, duration: 0.7 }}
      >
        <AnimatePresence mode="wait">
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </MotionConfig>
      <Nav />
    </>
  );
}

export default MyApp;
