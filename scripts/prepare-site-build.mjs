import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('dist/server', { recursive: true });
await writeFile('dist/server/index.js', `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;
    const url = new URL(request.url);
    url.pathname = '/index.html';
    return env.ASSETS.fetch(new Request(url, request));
  }
};\n`);
await writeFile('dist/server/wrangler.json', JSON.stringify({
  name: 'lim-cheng-yang-portfolio',
  main: 'index.js',
  compatibility_date: '2026-08-01',
  assets: { directory: '../', binding: 'ASSETS', not_found_handling: 'single-page-application' },
}, null, 2));
