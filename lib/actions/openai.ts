"use server";

import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { reserveMessage, releaseMessage } from "@/lib/usage";

const chatModel = process.env.NEXT_PUBLIC_OPENAI_MODEL;

type ChatMessage = {
  role: string;
  content: string;
};

export async function getAiResponse(
  text: string,
  formattedChatHistory: ChatMessage[],
): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Please sign in.");
  const apiKey = process.env.OPENAI_SECRET;
  if (!apiKey) throw new Error("AI chat is not configured on this server.");
  const openai = new OpenAI({ apiKey });
  if (
    !text.trim() ||
    text.length > 1000 ||
    formattedChatHistory.length > 1000 ||
    formattedChatHistory.some((message) => typeof message.content !== "string")
  ) {
    throw new Error("Invalid chat message.");
  }
  const reservation = await reserveMessage(userId);
  try {
    const response = await openai.chat.completions.create({
      messages:
        formattedChatHistory as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      model: chatModel as string,
    });

    const answer = response.choices[0].message.content;

    if (!answer) throw new Error("Error getting answer from openai");

    return answer;
  } catch (error) {
    await releaseMessage(reservation);
    throw new Error("Error getting answer from openai");
  } finally {
    revalidatePath("/agent");
  }
}
