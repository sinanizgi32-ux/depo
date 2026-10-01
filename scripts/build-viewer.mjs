import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

await build({
  entryPoints: [fileURLToPath(new URL('./pofidik-viewer-source.js', import.meta.url))],
  outfile: fileURLToPath(new URL('../dist/pofidik-viewer.js', import.meta.url)),
  bundle: true, format: 'iife', target: 'es2020', minify: true,
});
console.log('Pofidik görüntüleyicisi dist/pofidik-viewer.js içine hazırlandı.');
