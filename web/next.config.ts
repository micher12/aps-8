import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    cacheComponents: true,
    partialPrefetching: true,
    turbopack: {
        rules: {
            '*.css': {
                loaders: ['@tailwindcss/turbopack'],
                as: '*.css',
            },
        },
    },
    allowedDevOrigins: ["*.ngrok-free.app"],
    async rewrites() {
        return [
            // WebSocket (STOMP/SockJS) — o cookie httpOnly acompanha o handshake na mesma origem
            // (:path* é obrigatório: SockJS usa /ws/info, /ws/<srv>/<sessão>/xhr, /websocket…)
            { source: '/ws/:path*', destination: 'http://localhost:8080/ws/:path*' },
        ];
    },
};

export default nextConfig;
