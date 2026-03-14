import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { medicationName, dose, frequency } = await request.json();

  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  if (!apiKey) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const prompt = `You are a patient education specialist. A patient has been prescribed ${medicationName} (${dose}, ${frequency}).

Write a brief, friendly patient education summary. Respond ONLY with valid JSON:
{
  "whatIsIt": "1-2 sentences explaining what this medication is and what it treats in plain language",
  "howToTake": "1-2 sentences on best practices for taking it",
  "commonSideEffects": ["side effect 1", "side effect 2", "side effect 3"],
  "whatToAvoid": "1 sentence on key things to avoid (food, activities, other medications)",
  "whenToCallDoctor": "1 sentence on warning signs to watch for"
}`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a patient education specialist. Respond with valid JSON only, no markdown." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 512,
      }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return NextResponse.json(JSON.parse(cleaned));
  } catch {
    return NextResponse.json({ error: "AI unavailable" }, { status: 502 });
  }
}
