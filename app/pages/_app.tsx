import "../styles/globals.css";
import type { AppProps } from "next/app";
import Nav from "../components/Nav";
import Header from "../components/Header/Header";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Nav />
    </>
  );
}

export default MyApp;
