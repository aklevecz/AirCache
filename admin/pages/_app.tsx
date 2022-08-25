import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { WalletProvider } from "../contexts/WalletContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </SessionProvider>
  );
}

export default MyApp;
