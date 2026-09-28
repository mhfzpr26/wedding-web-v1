import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function weddingConfigSaverPlugin() {
  return {
    name: 'wedding-config-saver',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/save-config' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const configPath = path.resolve(
                __dirname,
                'src/config/weddingConfig.js',
              );
              const fileContent = `/**
 * =======================================================================
 * INVATERA - WEDDING CONFIGURATION (SINGLE SOURCE OF TRUTH)
 * =======================================================================
 * File ini diperbarui secara otomatis melalui Admin Studio.
 */

export const weddingConfig = ${JSON.stringify(data, null, 2)};
`;
              fs.writeFileSync(configPath, fileContent, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  message:
                    'Konfigurasi berhasil disimpan permanen ke src/config/weddingConfig.js',
                }),
              );
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: false,
                  error: err.message,
                }),
              );
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), weddingConfigSaverPlugin()],
});
