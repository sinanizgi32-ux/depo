import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

// Only the distributable application is exposed, never the project or user files.
const root = await realpath(fileURLToPath(new URL('../dist/', import.meta.url)));
const host = '127.0.0.1';
const port = Number(process.env.PORT || 4180);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT 1 ile 65535 arasında bir sayı olmalıdır.');
  process.exit(1);
}

const types = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.glb', 'model/gltf-binary'],
  ['.gltf', 'model/gltf+json'],
  ['.bin', 'application/octet-stream'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.svg', 'image/svg+xml'],
  ['.ico', 'image/x-icon'],
  ['.mp3', 'audio/mpeg'],
  ['.ogg', 'audio/ogg'],
  ['.wav', 'audio/wav'],
  ['.mp4', 'video/mp4'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

function isInside(filename) {
  const relative = path.relative(root, filename);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function reply(response, status, message, method) {
  const body = `${message}\n`;
  response.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...(status === 405 ? { Allow: 'GET, HEAD' } : {}),
  });
  response.end(method === 'HEAD' ? undefined : body);
}

const server = createServer(async (request, response) => {
  const method = request.method || 'GET';
  const route = new URL(request.url, `http://${host}:${port}`).pathname;
  if (route === '/api/status' || route === '/api/transcribe') {
    const statusRoute = route === '/api/status';
    if (method !== (statusRoute ? 'GET' : 'POST')) { reply(response, 405, 'Geçersiz yöntem.', method); return; }
    if (!statusRoute && request.headers.origin !== `http://${host}:${port}`) { reply(response, 403, 'Yalnızca yerel uygulama erişebilir.', method); return; }
    try {
      let body;
      if (!statusRoute) {
        if (request.headers['content-type'] !== 'audio/wav' || Number(request.headers['content-length']) > 500000) { reply(response, 400, 'Geçersiz ses.', method); return; }
        const chunks = []; let size = 0;
        for await (const chunk of request) { size += chunk.length; if (size > 500000) { reply(response, 413, 'Ses çok uzun.', method); return; } chunks.push(chunk); }
        body = Buffer.concat(chunks);
      }
      const upstream = await fetch(`http://127.0.0.1:4181${route}`, { method, body, headers: statusRoute ? {} : { 'Content-Type': 'audio/wav', Origin: 'http://127.0.0.1:4181' }, signal: AbortSignal.timeout(30000) });
      const result = await upstream.text();
      response.writeHead(upstream.status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); response.end(result);
    } catch {
      response.writeHead(statusRoute ? 200 : 503, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      response.end(JSON.stringify({ ready: false, message: 'Yerel dinleme hizmeti açılmadı. Mikrofon izni alınabilir; ses hizmetinin başlaması gerekiyor.', error: 'Yerel dinleme hizmetine ulaşılamadı.' }));
    }
    return;
  }
  if (method !== 'GET' && method !== 'HEAD') {
    reply(response, 405, 'Yalnızca GET ve HEAD desteklenir.', method);
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url, `http://${host}`).pathname);
    // Reject Windows separators, hidden files and encoded path traversal.
    const segments = pathname.split('/');
    if (pathname.includes('\0') || pathname.includes('\\') || segments.some((part) => part.startsWith('.'))) {
      reply(response, 403, 'Bu dosyaya erişim yok.', method);
      return;
    }
    let filename = path.resolve(root, `.${pathname}`);
    if (!isInside(filename)) {
      reply(response, 403, 'Bu dosyaya erişim yok.', method);
      return;
    }
    let info = await stat(filename);
    if (info.isDirectory()) {
      filename = path.join(filename, 'index.html');
      info = await stat(filename);
    }
    // Symlinks must also resolve within dist.
    filename = await realpath(filename);
    if (!isInside(filename) || !info.isFile()) {
      reply(response, 403, 'Bu dosyaya erişim yok.', method);
      return;
    }

    const headers = {
      'Content-Type': types.get(path.extname(filename).toLowerCase()) || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
      'Accept-Ranges': 'bytes',
    };
    let start = 0;
    let end = info.size - 1;
    let status = 200;
    if (request.headers.range) {
      const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
      if (!range || (!range[1] && !range[2]) || info.size === 0) {
        response.writeHead(416, { ...headers, 'Content-Range': `bytes */${info.size}` });
        response.end();
        return;
      }
      if (range[1]) {
        start = Number(range[1]);
        end = range[2] ? Math.min(Number(range[2]), end) : end;
      } else {
        start = Math.max(0, info.size - Number(range[2]));
      }
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end < start || start >= info.size) {
        response.writeHead(416, { ...headers, 'Content-Range': `bytes */${info.size}` });
        response.end();
        return;
      }
      status = 206;
      headers['Content-Range'] = `bytes ${start}-${end}/${info.size}`;
    }
    headers['Content-Length'] = info.size === 0 ? 0 : end - start + 1;
    response.writeHead(status, headers);
    if (method === 'HEAD' || info.size === 0) {
      response.end();
      return;
    }
    const stream = createReadStream(filename, { start, end });
    stream.on('error', () => response.destroy());
    response.on('close', () => stream.destroy());
    stream.pipe(response);
  } catch (error) {
    const status = error instanceof URIError || error.code === 'ERR_INVALID_URL' ? 400 :
      error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 404 : 500;
    reply(response, status, status === 404 ? 'Dosya bulunamadı.' : 'İstek işlenemedi.', method);
  }
});

server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE'
    ? `${port} numaralı kapı kullanımda. Önceki uygulama penceresini kapatın veya PORT değişkenini değiştirin.`
    : `Uygulama başlatılamadı: ${error.message}`);
  process.exitCode = 1;
});

server.listen(port, host, () => {
  const url = `http://${host}:${port}/`;
  console.log(`Dijital Erken Eğitim hazır: ${url}`);
  console.log('Bu pencere açık kalmalı. Kapatmak için Ctrl+C kullanabilirsiniz.');
  if (process.argv.includes('--open')) {
    const command = process.platform === 'win32'
      ? ['cmd.exe', ['/d', '/c', 'start', '', url]]
      : process.platform === 'darwin' ? ['open', [url]] : ['xdg-open', [url]];
    const opener = spawn(command[0], command[1], { detached: true, stdio: 'ignore', windowsHide: true });
    opener.on('error', () => console.log(`Tarayıcıda şu adresi açın: ${url}`));
    opener.unref();
  }
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
