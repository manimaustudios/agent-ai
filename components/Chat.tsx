"use client";

import React from "react";
import Image from "next/image";
import { ScrollArea } from "@radix-ui/react-scroll-area";

import { ChatTextarea } from "./ChatTextarea";
import { useChat } from "@/lib/providers/ChatProvider";
import { updateCurrentChatId } from "@/lib/actions/users";

type ChatSettings = {
  name: string;
  type: string;
  prompt: string;
  chatId: string;
  imgUrl: string;
};

type ChatProps = {
  welcomeMessage: string;
  isAuthenticated: boolean;
  hasLimit: boolean;
  hasPremium: boolean;
  userId: string | null;
  messageLimit: number;
  hoursToWait: number;
  isMonthlyLimitReached: boolean;
  monthlyLimit: number;
  chatList: ChatSettings[];
};

function Chat({
  welcomeMessage,
  isAuthenticated,
  hasLimit,
  hasPremium,
  userId,
  messageLimit,
  hoursToWait,
  isMonthlyLimitReached,
  monthlyLimit,
  chatList,
}: ChatProps) {
  const {
    chatHistory,
    setChatHistory,
    startNewSession,
    currentSessionId,
    sessions,
    currentChatType,
  } = useChat();

  const currentSessionObject = sessions.find(
    (session) => session.sessionId === currentSessionId,
  );

  const currentChatFromList = chatList.find(
    (chat) => chat.chatId === currentSessionObject?.chatId,
  );

  const handleStartNewChat = (
    chatType: string,
    chatName: string,
    pickedChatId: string,
  ) => {
    const welcomeText = { type: "answer", text: welcomeMessage };
    const sessionId = startNewSession(chatType, chatName, pickedChatId);

    const updateChatId = async () => {
      await updateCurrentChatId(userId, pickedChatId);
    };
    updateChatId();
    setChatHistory([welcomeText], chatType, sessionId);
  };

  return (
    <>
      <div className="mx-auto flex h-screen w-full max-w-screen-xl flex-col bg-background px-2">
        <div className="py-3 text-center">AI Chat Agent</div>

        {chatHistory?.length > 0 ? (
          // Chat history interface
          <ScrollArea className="flex-1 overflow-auto md:px-6">
            <div className="flex flex-col gap-8 overflow-y-auto whitespace-pre-line">
              {chatHistory.map((item, i) => (
                <React.Fragment key={`text-${i}`}>
                  {item.type && item.text && (
                    <p
                      className={`${
                        item.type === "question"
                          ? "ml-auto bg-secondary"
                          : "mr-auto bg-secondary"
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
          <ScrollArea className="flex flex-1 justify-center overflow-auto md:px-6">
            <div className="grid flex-1 gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-0 md:px-6">
              {chatList.map((chat, i) => (
                <div
                  key={`chatType-${i}`}
                  className="flex flex-col items-center justify-center gap-3"
                >
                  <button
                    className="relative size-24 rounded-full focus:outline-none md:size-36"
                    onClick={() =>
                      handleStartNewChat(chat.type, chat.name, chat.chatId)
                    }
                  >
                    <Image
                      alt="person face"
                      priority
                      src={chat.imgUrl}
                      fill
                      className="absoulute z-0 rounded-full object-cover opacity-80 hover:opacity-100"
                    />
                  </button>
                  <p className="">{chat.name}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {chatHistory?.length > 0 && (
          <ChatTextarea
            setChatHistory={setChatHistory}
            chatType={currentChatType}
            sessionId={currentSessionId}
            chatHistory={chatHistory}
            isAuthenticated={isAuthenticated}
            hasLimit={hasLimit}
            hasPremium={hasPremium}
            userId={userId}
            messageLimit={messageLimit}
            hoursToWait={hoursToWait}
            isMonthlyLimitReached={isMonthlyLimitReached}
            monthlyLimit={monthlyLimit}
            currentPrompt={currentChatFromList?.prompt ?? ""}
          />
        )}
      </div>
    </>
  );
}

export default Chat;
