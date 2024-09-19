"use server";

import OpenAI from "openai";

const apiKey = process.env.OPENAI_SECRET;
const chatModel = process.env.NEXT_PUBLIC_OPENAI_MODEL;

if (!apiKey) throw new Error("apiKey is missing");

const openai = new OpenAI({ apiKey });

type ChatMessage = {
  role: string;
  content: string;
};

export async function getAiResponse(
  text: string,
  formattedChatHistory: ChatMessage[],
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      // @ts-ignore
      messages: formattedChatHistory,
      // model: "gpt-4o-mini",
      model: chatModel as string,
    });

    const answer = response.choices[0].message.content;

    if (!answer) throw new Error("Error getting answer from openai");

    return answer;
  } catch (error) {
    throw new Error("Error getting answer from openai");
  }
}
