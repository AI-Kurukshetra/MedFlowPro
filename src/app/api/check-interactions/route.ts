import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { newMedication, existingMedications, patientAge, patientName } =
      await request.json();

    if (!newMedication) {
      return NextResponse.json({ error: "newMedication is required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

    if (!apiKey) {
      return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
    }

    const existingList =
      existingMedications?.length > 0
        ? existingMedications.join(", ")
        : "None";

    const prompt = `You are a clinical pharmacology expert AI assistant embedded in a medical e-prescribing system.

A doctor is about to prescribe a new medication. Analyze for drug interactions and provide clinical guidance.

Patient Info:
- Name: ${patientName || "Unknown"}
- Age: ${patientAge ? `${patientAge} years` : "Unknown"}
- Currently active medications: ${existingList}

New medication being prescribed: ${newMedication}

Your task:
1. Identify any clinically significant drug interactions between "${newMedication}" and the existing medications.
2. For each interaction found, assess severity.
3. Suggest safer alternatives if high/medium risk interactions exist.
4. If no interactions found, confirm it is safe to prescribe.

Respond ONLY with a valid JSON object in this exact format (no markdown, no explanation outside JSON):
{
  "interactions": [
    {
      "medication1": "string",
      "medication2": "string",
      "severity": "high" | "medium" | "low",
      "warning": "string (1-2 sentence clinical explanation)",
      "mechanism": "string (brief pharmacological mechanism)"
    }
  ],
  "alternatives": [
    {
      "name": "string",
      "reason": "string (why this is safer)"
    }
  ],
  "overallRisk": "safe" | "low" | "medium" | "high",
  "clinicalSummary": "string (2-3 sentence overall assessment for the doctor)"
}

If there are no interactions, return interactions as an empty array and overallRisk as "safe".`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are a clinical pharmacology AI. Always respond with valid JSON only. No markdown code blocks. No explanation outside the JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1, // Low temperature for consistent medical analysis
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq API error:", err);
      return NextResponse.json(
        { error: "AI service unavailable", fallback: true },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "Empty response from AI" }, { status: 502 });
    }

    // Parse JSON — strip any accidental markdown fences
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (error) {
    console.error("check-interactions error:", error);
    return NextResponse.json(
      { error: "Failed to analyze interactions", fallback: true },
      { status: 500 }
    );
  }
}
