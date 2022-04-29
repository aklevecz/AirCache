import NextDocument, { Html, Head, Main, NextScript } from "next/document";

type Props = {};

class Document extends NextDocument<Props> {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" type="image/x-icon" href="/egg.png" />
          <link href="https://use.typekit.net/lfx3jsx.css" rel="stylesheet" />
          <script src="twitter.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
