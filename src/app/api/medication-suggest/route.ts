import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { condition, patientAge, existingMedications } = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

    if (!apiKey) {
      return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
    }

    const existingList =
      existingMedications?.length > 0
        ? existingMedications.join(", ")
        : "None";

    const prompt = `You are a clinical AI assistant. A doctor needs medication suggestions.

Patient profile:
- Age: ${patientAge || "Unknown"}
- Current medications: ${existingList}
- Condition/Symptom to treat: ${condition || "General"}

Suggest 3-5 appropriate medications considering the patient's existing medications and age.

Respond ONLY with valid JSON (no markdown):
{
  "suggestions": [
    {
      "name": "string",
      "category": "string",
      "typicalDose": "string",
      "whySuitable": "string (1 sentence)",
      "caution": "string or null"
    }
  ]
}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a clinical AI. Respond with valid JSON only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (error) {
    console.error("medication-suggest error:", error);
    return NextResponse.json({ error: "Failed to get suggestions" }, { status: 500 });
  }
}
