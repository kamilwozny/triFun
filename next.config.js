/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
  },
};

module.exports = nextConfig;
