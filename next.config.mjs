/** @type {import('next').NextConfig} */
// import path from "path";
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "unsplash.com", "images.unsplash.com"],
  },
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.alias["yjs"] = path.resolve(__dirname, "node_modules/yjs");
  //   }
  //   return config;
  // },
};

export default nextConfig;
