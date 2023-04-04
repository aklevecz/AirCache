const withTM = require("next-transpile-modules")(["@lens-protocol/widgets-react"]); // pass the modules you would like to see transpiled

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects() {
    return [
      // if the host is `app.acme.com`,
      // this rewrite will be applied
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "ncss.onlygems.io",
            // value: "chim.localhost",
          },
        ],
        permanent: false,
        destination: "/eggs/only-gems",
      },
    ];
  },
};

module.exports = withTM(nextConfig);
