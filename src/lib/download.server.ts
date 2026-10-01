import type { ReleaseAsset, ReleaseInfo } from "~/lib/release";
import { REPO } from "~/data/site";

// Cloudflare Cache API stores streams without buffering installers in Worker memory.
const MAX_BYTES = 512 * 1024 * 1024;
const pending = new Map<string, Promise<void>>();

function edgeCache(): Cache | undefined {
  return (globalThis as typeof globalThis & { caches?: CacheStorage & { default?: Cache } }).caches?.default;
}

export function downloadUrl(tag: string, name: string): string {
  return `/api/download?${new URLSearchParams({ tag, name })}`;
}

function key(asset: ReleaseAsset): Request {
  const url = new URL(asset.url);
  if (url.origin !== "https://github.com" || !url.pathname.startsWith(`/${REPO}/releases/download/`)) {
    throw new Error("Invalid release asset URL");
  }
  return new Request(url);
}

async function fetchFile(asset: ReleaseAsset): Promise<Response> {
  const response = await fetch(key(asset), { signal: AbortSignal.timeout(120_000) });
  if (response.status !== 200 || !response.body) {
    throw new Error(`GitHub download ${response.status}`);
  }
  const headers = new Headers({
    "Content-Type": "application/octet-stream",
    "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(asset.name)}`,
    "Cache-Control": "public, max-age=86400",
    "X-Content-Type-Options": "nosniff",
  });
  const length = response.headers.get("content-length") ?? (asset.size !== undefined ? String(asset.size) : null);
  if (length) headers.set("Content-Length", length);
  return new Response(response.body, { headers });
}

async function populate(asset: ReleaseAsset, cache: Cache): Promise<void> {
  const cacheKey = key(asset);
  if (await cache.match(cacheKey)) return;
  const response = await fetchFile(asset);
  const length = Number(response.headers.get("content-length"));
  if (length > MAX_BYTES) {
    await response.body?.cancel();
    throw new Error("Asset exceeds Cloudflare cache limit");
  }
  await cache.put(cacheKey, response);
}

function ensureCached(asset: ReleaseAsset, cache: Cache): Promise<void> {
  const id = asset.url;
  let task = pending.get(id);
  if (!task) {
    task = populate(asset, cache).finally(() => pending.delete(id));
    pending.set(id, task);
  }
  return task;
}

/** Warm independently: one failed installer must not prevent the others. */
export async function precacheRelease(release: ReleaseInfo): Promise<void> {
  const cache = edgeCache();
  if (!cache) return;
  // Bound simultaneous streams and subrequests on Workers Free.
  for (let index = 0; index < release.assets.length; index += 3) {
    await Promise.all(release.assets.slice(index, index + 3).map(async asset => {
      if (asset.size && asset.size > MAX_BYTES) return;
      try {
        await ensureCached(asset, cache);
      } catch (error) {
        console.warn(`[download] Precache failed: ${asset.name}`, error);
      }
    }));
  }
}

export async function serveDownload(asset: ReleaseAsset, request: Request): Promise<Response> {
  const cache = edgeCache();
  const range = request.headers.get("range");
  const cacheKey = new Request(key(asset), { headers: range ? { Range: range } : {} });
  if (cache && !(asset.size && asset.size > MAX_BYTES)) {
    const hit = await cache.match(cacheKey);
    if (hit) return hit;
    // Await the complete cache write, avoiding an unbounded clone/tee buffer.
    try {
      await ensureCached(asset, cache);
      const stored = await cache.match(cacheKey);
      if (stored) return stored;
    } catch (error) {
      console.warn(`[download] Cache fill failed: ${asset.name}`, error);
    }
  }
  // Local development or cache failure: still proxy through this server.
  if (range) {
    const response = await fetch(key(asset), { headers: { Range: range } });
    const headers = new Headers(response.headers);
    headers.set("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(asset.name)}`);
    headers.set("Cache-Control", "no-store");
    return new Response(response.body, { status: response.status, headers });
  }
  return fetchFile(asset);
}
