import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const ALGRANO_API_BASE = "https://api.algrano.com/v1";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path") || "";
    const method = req.method || "GET";

    const apiKey = Deno.env.get("ALGRANO_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "ALGRANO_API_KEY not configured. Add it in App Settings → Secrets to activate real-time origin cost streaming.",
          data: null,
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    // Forward request to Algrano API
    const algranoUrl = `${ALGRANO_API_BASE}/${path}`;
    const headers = {
      "Authorization": `Bearer ${apiKey}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
    };

    let body = undefined;
    if (method !== "GET" && method !== "HEAD") {
      body = await req.text();
    }

    const response = await fetch(algranoUrl, { method, headers, body });
    const data = await response.json();

    return new Response(
      JSON.stringify({
        status: response.ok ? "success" : "error",
        statusCode: response.status,
        data: response.ok ? data : null,
        error: response.ok ? null : data,
      }),
      { status: response.status, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: error.message || "Algrano API proxy error",
        data: null,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});