/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol:'https',
                hostname:'res.cloudinary.com',
                port:'',
                pathname:'/**',
                search:'',
            }
        ]
    },
    ...(process.env.ANALYZE === 'true' ? bundleAnalyzer({ enabled: true }) : {}),
     webpack(config) {
    config.watchOptions = {
      ignored: [
        "**/.git/**",
        "**/node_modules/**",
        "**/.next/**",
      ],
    }
    return config
  },
  experimental: {
    preloadEntriesOnStart: false,
  },
  
   reactStrictMode: false,
};

export default nextConfig;
