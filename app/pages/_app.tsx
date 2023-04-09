import "../styles/globals.css";
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import Nav from "../components/Nav";
import Header from "../components/Header/Header";

import { motion, MotionConfig, AnimatePresence } from "framer-motion";
import { easeOut } from "../motion/ease";

function MyApp({ Component, pageProps, router }: AppProps) {
  const [isFirstMount, setIsFirstMount] = useState(true);

  useEffect(() => {
    const handleRouteChange = () => {
      isFirstMount && setIsFirstMount(false);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, []);

  return (
    <>
      <Header />
      <MotionConfig
        reducedMotion="user"
        transition={{ ease: easeOut, duration: 0.7 }}
      >
        <AnimatePresence mode="wait">
          <Component
            {...pageProps}
            key={router.route}
            isFirstMount={isFirstMount}
          />
        </AnimatePresence>
      </MotionConfig>
      <Nav />
    </>
  );
}

export default MyApp;
