/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['lucide-react'],
    images: {
      domains: ['utfs.io'], // Add 'utfs.io' to the list of allowed domains
    },
  };
  
  export default nextConfig; 