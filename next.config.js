/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/chat',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:8000/api/chat'
            : '/chat/',
      },
      {
        source: '/docs',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:8000/docs'
            : '/api/docs',
      },
      {
        source: '/openapi.json',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:8000/openapi.json'
            : '/api/openapi.json',
      },
    ];
  },
};

module.exports = nextConfig;
