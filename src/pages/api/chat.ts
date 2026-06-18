import type { APIRoute } from 'astro';
import { KNOWLEDGE_BASE } from '../../data/knowledgeBase';

export const prerender = false;

// In-memory cache for chunk embeddings across serverless warm-starts
let cachedEmbeddings: { id: string; embedding: number[] }[] | null = null;

// Vector Similarity Utilities
function dotProduct(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

function magnitude(a: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * a[i];
  }
  return Math.sqrt(sum);
}

function cosineSimilarity(a: number[], b: number[]): number {
  const magA = magnitude(a);
  const magB = magnitude(b);
  if (magA === 0 || magB === 0) return 0;
  return dotProduct(a, b) / (magA * magB);
}

// Gemini Embedding API helper
async function getEmbedding(text: string, apiKey: string): Promise<number[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'models/gemini-embedding-2',
      content: { parts: [{ text }] }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding API failed (Status: ${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.embedding.values;
}

// Gemini Batch Embedding API helper using Promise.all parallel embedding calls
async function getBatchEmbeddings(texts: string[], apiKey: string): Promise<number[][]> {
  const promises = texts.map(t => getEmbedding(t, apiKey));
  return Promise.all(promises);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages } = await request.json();
    const geminiKey = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      return new Response(
        JSON.stringify({
          error: 'No active GEMINI_API_KEY found. Please configure it in your .env file.',
          fallback: true,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const latestUserMessageObj = [...messages].reverse().find(m => m.role === 'user');
    const userQuery = latestUserMessageObj ? latestUserMessageObj.content : '';

    const thinkingSteps = [
      "Cognitive Router: Directing query to Gemini core routing node.",
      "Embedding Node: Generating vector query representation via text-embedding-004."
    ];

    // 1. Lazy load / initialize Knowledge Base Embeddings
    if (!cachedEmbeddings) {
      try {
        thinkingSteps.push("Index Parser: Initializing website knowledge index...");
        const textsToEmbed = KNOWLEDGE_BASE.map(chunk => `${chunk.title}\n${chunk.content}`);
        const embeddingsResult = await getBatchEmbeddings(textsToEmbed, geminiKey);
        
        cachedEmbeddings = KNOWLEDGE_BASE.map((chunk, index) => ({
          id: chunk.id,
          embedding: embeddingsResult[index]
        }));
        thinkingSteps.push(`Index Parser: Successfully indexed ${KNOWLEDGE_BASE.length} website chunks.`);
      } catch (embErr: any) {
        console.error("Failed to generate knowledge base embeddings:", embErr);
        thinkingSteps.push(`Index Parser Error: Embedding generation failed. Falling back to keyword-matching logic.`);
      }
    }

    let retrievedContext = '';
    let highestSim = 0;
    let selectedChunksCount = 0;

    // 2. Vector Retrieval (Or keyword fallback if embedding fails)
    if (userQuery && cachedEmbeddings) {
      try {
        thinkingSteps.push("Vector Store: Searching ChromaDB index matching query...");
        const queryEmbedding = await getEmbedding(userQuery, geminiKey);
        
        // Calculate Cosine Similarity against all cached chunks
        const scoredChunks = KNOWLEDGE_BASE.map((chunk) => {
          const cached = cachedEmbeddings?.find(e => e.id === chunk.id);
          const score = cached ? cosineSimilarity(queryEmbedding, cached.embedding) : 0;
          return { chunk, score };
        });

        // Sort by similarity score descending
        scoredChunks.sort((a, b) => b.score - a.score);

        // Keep top matching chunks with similarity score above 0.3
        const topMatches = scoredChunks.filter(item => item.score > 0.35).slice(0, 4);
        
        if (topMatches.length > 0) {
          highestSim = topMatches[0].score;
          selectedChunksCount = topMatches.length;
          retrievedContext = topMatches.map(item => `[Category: ${item.chunk.category}] ${item.chunk.content}`).join('\n\n');
          thinkingSteps.push(`Vector Similarity: Found ${selectedChunksCount} matching chunks. Best match similarity: ${(highestSim * 100).toFixed(1)}%.`);
        } else {
          // If no good match, grab top 2 by score as fallback
          const defaultTop = scoredChunks.slice(0, 2);
          highestSim = defaultTop[0].score;
          selectedChunksCount = defaultTop.length;
          retrievedContext = defaultTop.map(item => `[Category: ${item.chunk.category}] ${item.chunk.content}`).join('\n\n');
          thinkingSteps.push(`Vector Similarity: Low similarity score. Defaulted to top ${selectedChunksCount} related chunks. (Best match similarity: ${(highestSim * 100).toFixed(1)}%)`);
        }
      } catch (retrievalErr: any) {
        console.error("Vector retrieval error, falling back to keywords:", retrievalErr);
        thinkingSteps.push("Vector Store Error: Cosine similarity search failed. Falling back to keyword scan...");
      }
    }

    // Keyword scan fallback if context is empty
    if (!retrievedContext && userQuery) {
      const qLower = userQuery.toLowerCase();
      const matched = KNOWLEDGE_BASE.filter(chunk => 
        chunk.content.toLowerCase().includes(qLower) || 
        chunk.tags.some(tag => qLower.includes(tag.toLowerCase()))
      );
      if (matched.length > 0) {
        retrievedContext = matched.slice(0, 3).map(chunk => chunk.content).join('\n\n');
        selectedChunksCount = Math.min(matched.length, 3);
        thinkingSteps.push(`Keyword Index: Located ${selectedChunksCount} matched sections based on tag tokens.`);
      } else {
        // Final fallback: feed general sections to the LLM
        const defaultChunks = KNOWLEDGE_BASE.filter(c => c.id === 'bio_about' || c.id === 'skills_core');
        retrievedContext = defaultChunks.map(c => c.content).join('\n\n');
        thinkingSteps.push("Keyword Index: No matches found. Loading core biography & skillsets for routing context.");
      }
    }

    // 3. Assemble RAG Prompt
    const dynamicSystemPrompt = `You are ARES, the advanced cognitive AI representative for Bhuvanesh Chinthala.
Your tone is highly professional, technical, precise, and analytical. You are representing Bhuvanesh, an elite AI & Computer Vision Research Engineer.

Bhuvanesh's Portfolio Information Context:
===
${retrievedContext}
===

System Instructions:
1. Act as Bhuvanesh's personal AI representative.
2. Use the Portfolio Information Context above as your primary, absolute source of truth.
3. Answer professionally, concisely, and structure your responses using bullet points or monospace markdown where applicable.
4. **Strict Hallucination Control**:
   - If the answer to the user's query cannot be found, verified, or reasonably derived directly from the Portfolio Information Context provided above, you MUST respond EXACTLY with:
     "I couldn't find that information in Bhuvanesh's portfolio."
   - Do not make up facts. Never invent details about Bhuvanesh's background, education, experience, projects, or links.
5. If the user greets you (e.g. "Hi", "Hello", "How are you", "Who are you", "What can you do"), greet them professionally, identify yourself as ARES, explain that you are Bhuvanesh's AI representative, and mention that you can audit and answer queries about Bhuvanesh's projects, skills, education, experience, resume, or contact details. Keep it brief.
6. When the user asks about Bhuvanesh's resume, you should summarize his background briefly and let them know they can view or download it by typing '/resume' in the chat, which triggers the secure system download pipeline, or by visiting the '/pdf-viewer' subpage.`;

    thinkingSteps.push("Model Engine: Rebuilding dynamic RAG context graph.");
    thinkingSteps.push("Model Engine: Querying gemini-2.5-flash generation node.");

    // 4. Query Gemini 2.5 Flash
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
    
    // Prepare contents payload
    const contents = [
      {
        role: 'user',
        parts: [{ text: dynamicSystemPrompt }]
      },
      {
        role: 'model',
        parts: [{ text: "Understood. I am ARES, Bhuvanesh's AI Representative. I will answer queries professionally and strictly use Bhuvanesh's portfolio context. If information is not in the context, I will reply with: \"I couldn't find that information in Bhuvanesh's portfolio.\"" }]
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
    
    thinkingSteps.push("Verification Node: Decrypting response token packets.");

    return new Response(
      JSON.stringify({
        content: assistantMessage,
        provider: 'gemini',
        thinking: thinkingSteps,
        toolCall: `chromadb.query({ query: "${userQuery.slice(0, 30)}...", top_k: 4 })`
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error', fallback: true }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
