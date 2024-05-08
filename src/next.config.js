const MillionLint = require("@million/lint");
/** @type {import('next').NextConfig} */
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const nextConfig = {
  reactStrictMode: false,
  // React Strict Mode is off
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(new NodePolyfillPlugin());
      config.externals = [...(config.externals || []), "os"];
    }
    config.resolve.fallback = {
      fs: false,
      path: false,
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
};
module.exports = MillionLint.next({
  rsc: true,
})(nextConfig);
