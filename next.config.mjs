/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';
const nextConfig = withPWA({
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development', // Desativa o PWA no ambiente de desenvolvimento
    register: true,
    skipWaiting: true
  }
});

export default nextConfig;
