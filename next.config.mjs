/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },

  // Evita que se envíe "X-Powered-By: Next.js"
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/(.*)', // Aplica a todas las rutas
        headers: [
          // Anti-Clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Evitar "mime sniffing"
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Control de caché
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, private',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value:
              process.env.NODE_ENV === 'development'
                ? "default-src 'self' data:; connect-src 'self' http://localhost:3000 https://surprise1-2back.onrender.com http://localhost:4000 https://api.pwnedpasswords.com https://www.google.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.google.com/recaptcha/api2/clr; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com; frame-src 'self' https://www.google.com https://www.gstatic.com;" // Agregado reCAPTCHA y localhost
                : "default-src 'self' data:; connect-src 'self' https://api.pwnedpasswords.com https://surprise1-2back.onrender.com https://www.google.com; script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://www.google.com/recaptcha/api2/clr; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com; frame-src 'self' https://www.google.com https://www.gstatic.com;", // Agregado reCAPTCHA
          },
        ],
      },
    ];
  },
};

export default nextConfig;