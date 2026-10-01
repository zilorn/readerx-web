import type { APIEvent } from "@solidjs/start/server";
import { loadReleasePayload } from "~/lib/release.server";
import { serveDownload } from "~/lib/download.server";

export async function GET({ request }: APIEvent): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const tag = params.get("tag");
  const name = params.get("name");
  if (!tag || !name) return new Response("Missing tag or name", { status: 400 });
  try {
    const { release } = await loadReleasePayload();
    // Only GitHub API-approved assets can be fetched; arbitrary proxy URLs are forbidden.
    const asset = release.tag === tag && release.assets.find(item => item.name === name);
    if (!asset) return new Response("Release asset unavailable; refresh the download page", { status: 404 });
    return await serveDownload({ ...asset, url: asset.sourceUrl ?? asset.url }, request);
  } catch (error) {
    console.error("[download] Download failed", error);
    return new Response("Download temporarily unavailable; please retry", { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
