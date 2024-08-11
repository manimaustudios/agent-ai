"use client";

import { ChatTextarea } from "@/components/ChatTextarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

type Props = {};

// in state everything
// be careful of obects and updating state

const testList = [
  {
    type: "question",
    text: "What is the capital of France?",
  },
  {
    type: "answer",
    text: "This is Paris.",
  },
  {
    type: "question",
    text: "What is the capital of France? What is the capital of France? What is the capital of France? What is the capital of France?",
  },
  {
    type: "answer",
    text: "This is Paris. This is Paris. This is Paris. This is Paris. This is Paris. This is Paris. This is Paris.",
  },
  {
    type: "answer",
    text: "This is Paris.",
  },
  {
    type: "question",
    text: "What is the capital of France? What is the capital of France? What is the capital of France? What is the capital of France?",
  },
  {
    type: "answer",
    text: "This is Paris. This is Paris. This is Paris. This is Paris. This is Paris. This is Paris. This is Paris.",
  },
  {
    type: "answer",
    text: "This is Paris.",
  },
  {
    type: "question",
    text: "What is the capital of France? What is the capital of France? What is the capital of France? What is the capital of France?",
  },
  {
    type: "answer",
    text: "This is Paris. This is Paris. This is Paris. This is Paris. This is Paris. This is Paris. This is Paris.",
  },
  {
    type: "answer",
    text: "This is Paris.",
  },
];

function Page({}: Props) {
  const [chatHistory, setChatHistory] = useState([{ type: "", text: "" }]);

  return (
    <div className="mx-auto flex h-screen max-w-screen-xl flex-col bg-slate-950 px-2">
      <div className="py-6 text-center">AI Chat Agent</div>
      <ScrollArea className="flex-1 md:px-6">
        <div className="flex flex-col gap-8 overflow-y-auto">
          {chatHistory.map((item, i) => (
            <>
              {}
              {item.type && item.text && (
                <p
                  key={`text-${i}`}
                  className={`${
                    item.type === "answer"
                      ? "ml-auto bg-slate-800"
                      : "mr-auto bg-slate-600"
                  } inline-block max-w-[80%] rounded-md p-3 md:max-w-[65%]`}
                >
                  {item.text}
                </p>
              )}
            </>
          ))}
        </div>
      </ScrollArea>
      {/* <div className="h-20 py-3">input or textarea</div> */}
      <ChatTextarea setChatHistory={setChatHistory} />
    </div>
  );
}

export default Page;
