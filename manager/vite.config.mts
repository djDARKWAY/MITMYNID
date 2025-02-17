import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgrPlugin()
  ],
  server: {
    port: 80,
    open: true, // this will open directly to your browser
    headers: {
      // 'Content-Security-Policy': `frame-ancestors 'none'; default-src 'self' localhost:13090 https://arm-api.mitmynid.com/; img-src 'self' localhost:13090 https://arm-api.mitmynid.com/; script-src 'self' 'sha256-8ZgGo/nOlaDknQkDUYiedLuFRSGJwIz6LAzsOrNxhmU='; style-src 'self' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='; form-action 'self'`,
      // 'Access-Control-Allow-Origin': 'localhost:13090',
      'Access-Control-Allow-Origin': 'https://arm-api.mitmynid.com/',
    }
  },
  build: {
    outDir: "build",
  },
});
