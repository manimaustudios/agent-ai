import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ChatMessage = {
  type: string;
  text: string;
};

export function getFormattedChatHistory(
  chatHistory: ChatMessage[],
  newQuestion: ChatMessage,
  currentPrompt: string,
) {
  const fullHistory = [
    {
      type: "system",
      text: currentPrompt,
    },
    ...chatHistory,
    newQuestion,
  ];

  const formattedChatHistory = fullHistory.map((message) => {
    if (message.type === "answer") {
      return { role: "assistant", content: message.text };
    } else if (message.type === "question") {
      return { role: "user", content: message.text };
    } else {
      return { role: "system", content: message.text };
    }
  });

  console.log("formattedChatHistory: ", formattedChatHistory);

  return formattedChatHistory;
}
