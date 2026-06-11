import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const apiKey = import.meta.env.GROK_API_KEY || process.env.GROK_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GROK_API_KEY is not configured in .env' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://api.x.ai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();
    return new Response(
      JSON.stringify(data, null, 2),
      { status: response.status, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
