import NextDocument, { Html, Head, Main, NextScript } from "next/document";

type Props = {};

class Document extends NextDocument<Props> {
  render() {
    return (
      <Html>
        <Head>
          <title>AIR EGGS</title>
          <link rel="icon" type="image/x-icon" href="/egg.png" />
          <link href="https://use.typekit.net/lfx3jsx.css" rel="stylesheet" />
          <meta property="og:description" content="Eggs in the air" />
          <meta property="og:image" content="/egg.png" />
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
