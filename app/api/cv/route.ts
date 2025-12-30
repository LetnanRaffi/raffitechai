import { NextRequest, NextResponse } from "next/server";
import { callOpenRouter, ChatMessage } from "@/lib/openrouter";

const SYSTEM_PROMPT = `You are a professional HR Specialist and CV Writer expert in the Indonesian job market (ATS Friendly standards).
Your task is to convert the user's unstructured input (chat) into a structured Professional CV in JSON format.

RULES:
1. Output MUST be strict JSON. No conversational text before or after.
2. Language: Use formal, professional Indonesian (Ejaan Yang Disempurnakan).
3. Content Polish: Transform simple sentences into professional "Action Verbs" (e.g., "Jaga warnet" -> "Mengelola operasional harian warung internet dan troubleshooting jaringan").
4. If information is missing, use "N/A" or leave empty string, do not invent fake data.

JSON SCHEMA:
{
  "personalInfo": {
    "fullName": "String",
    "email": "String",
    "phone": "String",
    "linkedin": "String (optional)",
    "portfolio": "String (optional)"
  },
  "professionalSummary": "String (2-3 sentences, strong hook)",
  "workExperience": [
    {
      "role": "String",
      "company": "String",
      "period": "String",
      "achievements": ["String", "String", "String"]
    }
  ],
  "education": [
    {
      "degree": "String",
      "school": "String",
      "year": "String"
    }
  ],
  "skills": ["String", "String", "String"] // Technical & Soft Skills
}`;

export async function POST(req: NextRequest) {
  try {
    const { userDescription } = await req.json();

    if (!userDescription) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userDescription },
    ];

    // Using Qwen 2.5 7B Instruct as recommended for consistency with Indonesian language and JSON structure
    const response = await callOpenRouter("qwen/qwen-2.5-7b-instruct", messages);

    if (!response.success) {
      console.error("OpenRouter API Error:", response.error);
      return NextResponse.json(
        { error: "Failed to generate CV. Please try again." },
        { status: 500 }
      );
    }

    const content = response.data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 500 }
      );
    }

    try {
      // Clean up markdown code blocks if present
      const jsonString = content.replace(/```json\n?|\n?```/g, "").trim();
      const result = JSON.parse(jsonString);
      return NextResponse.json(result);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Content:", content);
      return NextResponse.json(
        { error: "Failed to parse generated CV. The AI output was not valid JSON." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
