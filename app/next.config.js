/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites() {
    return {
      beforeFiles: [
        // if the host is `app.acme.com`,
        // this rewrite will be applied
        {
          source: "/:path*",
          has: [
            {
              type: "host",
              value: "ncss.onlygems.io",
            },
          ],
          destination: "/eggs/:path*",
        },
      ],
    };
  },
};

module.exports = nextConfig;
