export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { scanType, input } = req.body || {};

    if (!scanType || !input) {
      return res.status(400).json({ error: "Missing scanType or input" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    const prompt = `
You are a crypto due-diligence risk analyst.

Your job is to assess the following user input and return a structured JSON response only.

Scan type: ${scanType}
Input: ${input}

Return valid JSON with exactly these keys:
{
  "score": number,
  "verdict": "Low Risk" | "Needs Verification" | "High Risk",
  "confidence": "Low" | "Medium" | "High",
  "keyInsight": string,
  "recommendedAction": string,
  "positives": string[],
  "risks": string[],
  "nextSteps": string[],
  "summary": string
}

Rules:
- Score must be between 0 and 100
- Be balanced and realistic
- Do not overclaim certainty
- If the input looks hype-driven, speculative, scammy, fake, or unverifiable, reflect that in the verdict
- Keep positives, risks, and nextSteps concise
- Return JSON only, no markdown
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "You are a precise crypto due-diligence agent that returns strict JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: errText });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: "Empty AI response" });
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      return res.status(500).json({
        error: "AI returned invalid JSON",
        raw: content,
      });
    }

    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Unknown server error",
    });
  }
}