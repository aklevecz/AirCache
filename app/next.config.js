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
              value: "app.acme.com",
            },
          ],
          destination: "/app/:path*",
        },
      ],
    };
  },
};

module.exports = nextConfig;
