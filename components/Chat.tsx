"use client";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import React, { useState } from "react";
import { ChatTextarea } from "./ChatTextarea";
import { useChat } from "@/lib/providers/ChatProvider";
import Image from "next/image";
import SignInDialog from "./SignInDialog";

const imgSrc =
  "https://images.unsplash.com/photo-1579591919791-0e3737ae3808?q=80&w=1915&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const chatList = [
  {
    name: "General Chat",
    type: "general",
  },
  {
    name: "Support Chat",
    type: "support",
  },
  {
    name: "Sales Chat",
    type: "sales",
  },
];

type ChatProps = {
  welcomeMessage: string;
  isAuthenticated: boolean;
};

function Chat({ welcomeMessage, isAuthenticated }: ChatProps) {
  const {
    chatHistory,
    setChatHistory,
    startNewSession,
    currentSessionId,
    currentChatType,
  } = useChat();

  const handleStartNewChat = (chatType: string, chatName: string) => {
    const welcomeText = { type: "answer", text: welcomeMessage };
    const sessionId = startNewSession(chatType, chatName);
    setChatHistory([welcomeText], chatType, sessionId);
  };

  return (
    <>
      <div className="mx-auto flex h-screen w-full max-w-screen-xl flex-col bg-slate-950 px-2">
        <div className="py-6 text-center">AI Chat Agent</div>

        {chatHistory?.length > 0 ? (
          // Chat interface
          <ScrollArea className="flex-1 overflow-auto md:px-6">
            <div className="flex flex-col gap-8 overflow-y-auto whitespace-pre-line">
              {chatHistory.map((item, i) => (
                <React.Fragment key={`text-${i}`}>
                  {item.type && item.text && (
                    <p
                      className={`${
                        item.type === "question"
                          ? "ml-auto bg-slate-800"
                          : "mr-auto bg-slate-600"
                      } inline-block max-w-[80%] rounded-md p-3 md:max-w-[65%]`}
                    >
                      {item.text}
                    </p>
                  )}
                </React.Fragment>
              ))}
            </div>
          </ScrollArea>
        ) : (
          // Chats to pick from
          <div className="grid flex-1 grid-cols-3 md:px-6">
            {chatList.map((chat, i) => (
              <div
                key={`chatType-${i}`}
                className="flex flex-col items-center justify-center gap-3"
              >
                <button
                  className="relative size-36 rounded-full focus:outline-none"
                  onClick={() => handleStartNewChat(chat.type, chat.name)}
                >
                  <Image
                    alt=""
                    priority
                    src={imgSrc}
                    fill
                    className="absoulute z-0 rounded-full object-cover opacity-80 hover:opacity-100"
                  />
                </button>
                <p className="text-slate-300">{chat.name}</p>
              </div>
            ))}
          </div>
        )}

        {chatHistory?.length > 0 && (
          <ChatTextarea
            setChatHistory={setChatHistory}
            chatType={currentChatType}
            sessionId={currentSessionId}
            chatHistory={chatHistory}
            isAuthenticated={isAuthenticated}
          />
        )}
      </div>
    </>
  );
}

export default Chat;
