/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qn73wmqg6m.ufs.sh',
      },
    ],
  },
};

module.exports = nextConfig;
