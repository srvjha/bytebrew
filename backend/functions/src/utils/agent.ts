import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "AIzaSyAOBQEc9UsHa7mmWxi3DmE-k0LNQOBIZdk",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const system_prompt = `
You are an AI assistant specialized in analyzing civic issues using multimodal data.

Task:
1. Analyze citizen-submitted reports containing:
   - Text descriptions
   - Photos
   - Videos
   - Geo-coordinates
2. Provide a structured, actionable AI summary of the event.
3. Categorize the event, describe the scene, extract urgency level, and list any notable entities (e.g., pothole, tree fall, protest).

Return the following strict JSON format:
{
  "category": "string (e.g., Traffic, Infrastructure, Emergency, Event)",
  "summary": "string (one sentence summary)",
  "entities": ["string", ...],
  "urgency": "Low | Medium | High"
}

Do not include extra text or formatting.
`;

interface GeminiInput {
  text: string;
  photoMediaUrls: (string | null)[];
  videoMediaUrls: (string | null)[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export const getGeminiAnalysis = async ({
  text,
  photoMediaUrls,
  videoMediaUrls,
  coordinates,
}: GeminiInput) => {
  try {
    const content = `
Description: ${text}
Photos: ${photoMediaUrls.filter(Boolean).join(", ")}
Videos: ${videoMediaUrls.filter(Boolean).join(", ")}
Location: (${coordinates.latitude}, ${coordinates.longitude})
    `;

    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        { role: "system", content: system_prompt },
        { role: "user", content },
      ],
      temperature: 0.4,
    });

    const result = response.choices[0].message?.content;
    if (!result) throw new Error("Empty AI response");

    return JSON.parse(result);
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return {
      category: "Unknown",
      summary: "Could not analyze the report.",
      entities: [],
      urgency: "Low",
    };
  }
};
