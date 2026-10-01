import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';

const source = (await readFile(new URL('../src/lib/download.server.ts', import.meta.url), 'utf8'))
  .replace('import { REPO } from "~/data/site";', 'const REPO = "zilorn/readerx";');
const { precacheRelease, serveDownload, downloadUrl } = await import(
  `data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source) + "\n//# sourceURL=download-under-test.js").toString('base64')}`
);
const asset = { name: 'ReaderX arm64.apk', size: 7, url: 'https://github.com/zilorn/readerx/releases/download/v1/readerx.apk' };
const release = { tag: 'v1', assets: [asset] };

function setup() {
  const entries = new Map();
  let fetches = 0;
  globalThis.caches = { default: {
    async match(request) { return entries.get(request.url)?.clone(); },
    async put(request, response) {
      // Consume the stream, as Cloudflare does before completing cache.put.
      const body = await response.arrayBuffer();
      entries.set(request.url, new Response(body, { headers: response.headers }));
    },
  } };
  globalThis.fetch = async () => {
    fetches++;
    return new Response('package', { headers: { 'Content-Length': '7' } });
  };
  return { entries, fetches: () => fetches };
}

test('precache stores installer; subsequent downloads do not contact GitHub', async () => {
  const state = setup();
  await precacheRelease(release);
  const response = await serveDownload(asset, new Request('https://readerx.example/api/download'));
  assert.equal(await response.text(), 'package');
  assert.equal(state.fetches(), 1);
  assert.match(response.headers.get('content-disposition'), /ReaderX%20arm64.apk/);
});

test('cold concurrent downloads share a complete cache fill', async () => {
  const state = setup();
  const responses = await Promise.all([1, 2, 3].map(() => serveDownload(asset, new Request('https://readerx.example/api/download'))));
  assert.deepEqual(await Promise.all(responses.map(response => response.text())), ['package', 'package', 'package']);
  assert.equal(state.fetches(), 1);
});

test('upstream errors are never cached and a later request retries', async () => {
  const state = setup();
  globalThis.fetch = async () => new Response('bad gateway', { status: 502 });
  await assert.rejects(serveDownload(asset, new Request('https://readerx.example')), /GitHub download 502/);
  assert.equal(state.entries.size, 0);
  globalThis.fetch = async () => new Response('package');
  assert.equal(await (await serveDownload(asset, new Request('https://readerx.example'))).text(), 'package');
});

test('arbitrary external URLs are rejected', async () => {
  setup();
  await assert.rejects(serveDownload({ ...asset, url: 'https://example.com/private' }, new Request('https://readerx.example')), /Invalid release asset URL/);
});

test('local development streams downloads without Cloudflare cache', async () => {
  const state = setup();
  delete globalThis.caches;
  assert.equal(await (await serveDownload(asset, new Request('https://readerx.example'))).text(), 'package');
  assert.equal(state.fetches(), 1);
});

test('download URLs safely encode tag and filename', () => {
  const params = new URL(downloadUrl('v1+test', '安装包 arm64.apk'), 'https://readerx.example').searchParams;
  assert.equal(params.get('tag'), 'v1+test');
  assert.equal(params.get('name'), '安装包 arm64.apk');
});
