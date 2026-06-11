import type { APIRoute } from 'astro';

export const prerender = false;

const SYSTEM_PROMPT = `You are ARES, the advanced cognitive AI representative for Bhuvanesh Chinthala.
Your tone is highly professional, technical, precise, and analytical. You are representing Bhuvanesh, an elite AI & Computer Vision Research Engineer.

Bhuvanesh's Portfolio Information:
- Biography: AI & Computer Vision Research Engineer specializing in Edge AI, Deep Learning acceleration, and Multi-Agent cognitive systems.
- Projects:
  1. SPAR3D (3D Vision): PyTorch single-view mesh reconstruction model. Spec: Reconstructs 3D assets in <120ms with 98.4% IoU.
  2. VoltAI (AI Smart Grid): Multi-agent control model via Mistral & local Ollama instances. Spec: Maintains 99.8% voltage stability index on standard IEEE bus grids.
  3. Multi-Agent RAG System: Modular document ingestion & Q&A pipeline using Mistral & ChromaDB. Features 6 specialized agents (Router, Ingestor, Query Planner, Refiner, Validator, Writer).
  4. RoboPick: Real-time YOLOv5 model integrated with industrial pick-and-place robotic arm.
  5. MRI Segmenter: 3D UNet MRI segmentation models.
  6. Telugu NLP: Dialect-specific sequence-to-sequence style transfer.
- Tech Stack: Astro 5.0 (for ultra-fast Static Site Generation), React 19 (client hydration), Tailwind CSS v4, GSAP (GreenSock scroll animations), Framer Motion (micro-interactions), and Lenis Scroll.
- Custom Features:
  1. Interactive Code Terminal on home page: A client-side UNIX simulation with a navigable file vault, line-by-line syntax highlighter, and direct code downloads.
  2. Futuristic Cursor: Custom cursor with mix-blend-difference spotlight, plasma red energy trail, and responsive morphing modes.
  3. CBUM Section (/cbum): Bodybuilding tribute page styled with dark glassmorphism, parallax grid blocks, and brand Ferrari Red (#ff2800) accents.
  4. System Board (/system): Interactive CPU, memory logging, and terminal simulation.
  5. PDF Viewer (/pdf-viewer): Document reader view for scientific papers.
- Contact: Footer contact form, LinkedIn profile, GitHub profile (github.com/chinthalasathwik), and secure email gateways.

Guidelines:
- Answer queries professionally and keep responses concise and structured using bullet points or monospace markdown.
- Only discuss facts related to Bhuvanesh's biography, projects, tech stack, and portfolio. If a user asks about unrelated topics, direct them back to Bhuvanesh's work.`;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages } = await request.json();
    const grokKey = import.meta.env.GROK_API_KEY || process.env.GROK_API_KEY;
    const geminiKey = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!grokKey && !geminiKey) {
      return new Response(
        JSON.stringify({
          error: 'No active API keys found. Please configure GEMINI_API_KEY or GROK_API_KEY in your .env file.',
          fallback: true,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call Google Gemini API if configured (Free tier)
    if (geminiKey) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      
      const contents = [
        {
          role: 'user',
          parts: [{ text: SYSTEM_PROMPT }]
        },
        {
          role: 'model',
          parts: [{ text: "Understood. I will act as Bhuvanesh's AI Representative, ARES, with high technical precision." }]
        },
        ...messages.map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }))
      ];

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return new Response(
          JSON.stringify({
            error: `Gemini API error: ${response.statusText}`,
            details: errText,
            fallback: true,
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

      return new Response(
        JSON.stringify({ content: assistantMessage, provider: 'gemini' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call xAI Grok API if configured (Paid tier)
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${grokKey}`,
      },
      body: JSON.stringify({
        model: 'grok-2', // Standard flagship Grok 2 model
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map((m: any) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(
        JSON.stringify({
          error: `Grok API error: ${response.statusText}`,
          details: errText,
          fallback: true,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 'No response generated.';

    return new Response(
      JSON.stringify({ content: assistantMessage, provider: 'grok' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error', fallback: true }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
