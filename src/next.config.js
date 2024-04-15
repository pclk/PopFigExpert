/** @type {import('next').NextConfig} */
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const nextConfig = {
    reactStrictMode: false, // React Strict Mode is off
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.plugins.push(new NodePolyfillPlugin());
      }
      return config;
    },
  }
  
  module.exports = nextConfig