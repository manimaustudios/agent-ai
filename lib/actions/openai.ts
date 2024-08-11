"use server";

import OpenAI from "openai";

const apiKey = process.env.OPENAI_SECRET;

if (!apiKey) throw new Error("apiKey is missing");

const openai = new OpenAI({ apiKey });

export async function getAiResponse(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: text }],
      model: "gpt-4o-mini",
    });

    const answer = response.choices[0].message.content;

    if (!answer) throw new Error("Error getting answer from openai");

    return answer;
  } catch (error) {
    throw new Error("Error getting answer from openai");
  }
}
