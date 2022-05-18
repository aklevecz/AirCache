import NextDocument, { Html, Head, Main, NextScript } from "next/document";

type Props = {};

class Document extends NextDocument<Props> {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" type="image/x-icon" href="/egg.png" />
          <link href="https://use.typekit.net/lfx3jsx.css" rel="stylesheet" />
          <script src="https://air.yaytso.art/twitter.js" />
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-48WHPVPCZT"
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag("js", new Date());
            
            gtag("config", "G-48WHPVPCZT");
            `,
            }}
          />
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
