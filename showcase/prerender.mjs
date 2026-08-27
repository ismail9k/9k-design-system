import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = resolve('showcase-dist');
const { version } = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));

const server = await import(pathToFileURL(resolve('showcase/.ssr/entry-server.js')).href);

const html = await server.render();
const { manifest, llmsTxt } = server.artifacts(version);

const shell = readFileSync(resolve(dist, 'index.html'), 'utf8');
if (!shell.includes('<!--app-html-->')) {
  throw new Error('showcase-dist/index.html lost its <!--app-html--> marker');
}

writeFileSync(resolve(dist, 'index.html'), shell.replace('<!--app-html-->', html));
writeFileSync(resolve(dist, 'components.json'), JSON.stringify(manifest, null, 2));
writeFileSync(resolve(dist, 'llms.txt'), llmsTxt);

console.log(`Prerendered ${manifest.components.length} components.`);
