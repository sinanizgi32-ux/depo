import {build} from 'esbuild';import {fileURLToPath} from 'node:url';
await build({entryPoints:[fileURLToPath(new URL('./pofidik-island-source.js',import.meta.url))],bundle:true,minify:true,format:'iife',target:['es2022'],outfile:fileURLToPath(new URL('../dist/pofidik-island.js',import.meta.url)),legalComments:'none'});
