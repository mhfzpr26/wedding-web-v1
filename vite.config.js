import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function weddingServerPlugin() {
  return {
    name: 'wedding-server-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 1. Simpan Config Pernikahan Permanen
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

        // 2. Baca Daftar File Audio di Folder public/audio
        if (req.url === '/api/audio-files' && req.method === 'GET') {
          try {
            const audioDir = path.resolve(__dirname, 'public/audio');
            if (!fs.existsSync(audioDir)) {
              fs.mkdirSync(audioDir, { recursive: true });
            }
            const files = fs
              .readdirSync(audioDir)
              .filter((file) => /\.(mp3|ogg|wav|m4a)$/i.test(file))
              .map((file) => {
                const stats = fs.statSync(path.join(audioDir, file));
                return {
                  filename: file,
                  url: `/audio/${file}`,
                  sizeBytes: stats.size,
                };
              });
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, files }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
          return;
        }

        // 3. Upload File Audio Langsung ke Folder public/audio
        if (req.url === '/api/upload-audio' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { filename, content } = JSON.parse(body);
              if (!filename || !content) {
                throw new Error('Nama file dan data konten audio wajib ada.');
              }
              const audioDir = path.resolve(__dirname, 'public/audio');
              if (!fs.existsSync(audioDir)) {
                fs.mkdirSync(audioDir, { recursive: true });
              }
              // Bersihkan nama file agar aman dari spasi dan karakter aneh
              const ext = path.extname(filename).toLowerCase();
              const base = path
                .basename(filename, ext)
                .toLowerCase()
                .replace(/[^a-z0-9_.-]/g, '-')
                .replace(/-+/g, '-');
              const cleanName = `${base}${ext}`;
              const targetPath = path.join(audioDir, cleanName);

              const buffer = Buffer.from(content, 'base64');
              fs.writeFileSync(targetPath, buffer);

              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  url: `/audio/${cleanName}`,
                  filename: cleanName,
                  sizeBytes: buffer.length,
                  message: `File ${cleanName} berhasil diunggah ke public/audio/`,
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

        // 4. Upload File Foto ke Folder public/photos
        if (req.url === '/api/upload-photo' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { filename, content } = JSON.parse(body);
              if (!filename || !content) {
                throw new Error('Nama file dan data konten foto wajib ada.');
              }
              const photosDir = path.resolve(__dirname, 'public/photos');
              if (!fs.existsSync(photosDir)) {
                fs.mkdirSync(photosDir, { recursive: true });
              }
              const ext = (path.extname(filename) || '.jpg').toLowerCase();
              const base = path
                .basename(filename, ext)
                .toLowerCase()
                .replace(/[^a-z0-9_.-]/g, '-')
                .replace(/-+/g, '-');
              const cleanName = `${Date.now()}-${base}${ext}`;
              const targetPath = path.join(photosDir, cleanName);

              const buffer = Buffer.from(content, 'base64');
              fs.writeFileSync(targetPath, buffer);

              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  url: `/photos/${cleanName}`,
                  filename: cleanName,
                  sizeBytes: buffer.length,
                  message: `Foto ${cleanName} berhasil diunggah ke public/photos/`,
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
  plugins: [react(), weddingServerPlugin()],
});
