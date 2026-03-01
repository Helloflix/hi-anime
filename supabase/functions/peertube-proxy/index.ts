import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const PEERTUBE_URL = Deno.env.get("PEERTUBE_URL");
    if (!PEERTUBE_URL) {
      return new Response(JSON.stringify({ error: "PEERTUBE_URL not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const path = url.searchParams.get("path");
    if (!path) {
      return new Response(JSON.stringify({ error: "Missing 'path' parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build the full PeerTube API URL
    const baseUrl = PEERTUBE_URL.replace(/\/$/, "");
    const targetUrl = new URL(path, baseUrl);

    // Forward all other query params except 'path'
    for (const [key, value] of url.searchParams.entries()) {
      if (key !== "path") {
        targetUrl.searchParams.set(key, value);
      }
    }

    console.log(`Proxying to: ${targetUrl.toString()}`);

    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: {
        "User-Agent": "PeerTubeProxy/1.0",
        "ngrok-skip-browser-warning": "true",
        "Accept": "application/json",
      },
    });

    const contentType = response.headers.get("content-type") || "";
    
    // For JSON responses
    if (contentType.includes("application/json")) {
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // For other responses (video files, etc.), stream them through
    const body = await response.arrayBuffer();
    return new Response(body, {
      status: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type": contentType || "application/octet-stream",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
