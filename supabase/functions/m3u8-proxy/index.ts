import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const targetUrl = url.searchParams.get("url");
    if (!targetUrl) {
      return new Response(JSON.stringify({ error: "Missing 'url' parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse optional custom headers
    const headersParam = url.searchParams.get("headers");
    const customHeaders: Record<string, string> = {};
    if (headersParam) {
      try {
        const parsed = JSON.parse(headersParam);
        Object.assign(customHeaders, parsed);
      } catch {
        // ignore invalid headers
      }
    }

    // Fetch the target URL with custom headers
    const fetchHeaders: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      ...customHeaders,
    };

    const response = await fetch(targetUrl, {
      headers: fetchHeaders,
      redirect: "follow",
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Upstream returned ${response.status}` }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Determine content type
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    // For M3U8 playlists, rewrite relative URLs to absolute
    if (
      contentType.includes("mpegurl") ||
      contentType.includes("x-mpegurl") ||
      targetUrl.endsWith(".m3u8")
    ) {
      let text = await response.text();

      // Build base URL for resolving relative paths
      const lastSlash = targetUrl.lastIndexOf("/");
      const baseUrl = lastSlash > 8 ? targetUrl.substring(0, lastSlash + 1) : targetUrl;

      // Rewrite relative segment/playlist URLs to absolute
      const lines = text.split("\n");
      const rewritten = lines.map((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) {
          // Rewrite URI= inside tags like #EXT-X-MAP
          if (trimmed.includes('URI="')) {
            return trimmed.replace(/URI="([^"]+)"/g, (_match, uri) => {
              if (uri.startsWith("http://") || uri.startsWith("https://")) return `URI="${uri}"`;
              try {
                return `URI="${new URL(uri, baseUrl).toString()}"`;
              } catch {
                return `URI="${baseUrl}${uri}"`;
              }
            });
          }
          return line;
        }
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
          return line;
        }
        try {
          return new URL(trimmed, baseUrl).toString();
        } catch {
          return `${baseUrl}${trimmed}`;
        }
      });

      return new Response(rewritten.join("\n"), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/vnd.apple.mpegurl",
          "Cache-Control": "no-cache",
        },
      });
    }

    // For binary segments (.ts, .mp4, etc.), stream through
    const body = await response.arrayBuffer();
    return new Response(body, {
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
        "Content-Length": body.byteLength.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Proxy error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
