"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { ScrollArea } from "@radix-ui/react-scroll-area";

import { ChatTextarea } from "./ChatTextarea";
import { useChat } from "@/lib/providers/ChatProvider";
import { updateCurrentChatId } from "@/lib/actions/users";
import { useSidebar } from "@/lib/providers/SidebarProvider";

type ChatSettings = {
  name: string;
  type: string;
  prompt: string;
  chatId: string;
  imgUrl: string;
  welcomeMsg: string;
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
  price: number;
};

function Chat({
  isAuthenticated,
  hasLimit,
  hasPremium,
  userId,
  messageLimit,
  hoursToWait,
  isMonthlyLimitReached,
  monthlyLimit,
  chatList,
  price,
}: ChatProps) {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const {
    chatHistory,
    setChatHistory,
    startNewSession,
    currentSessionId,
    sessions,
    currentChatType,
  } = useChat();
  const { isSidebarOpen, setIsSidebarOpen, closeSidebarOnMobile } =
    useSidebar();

  const currentSessionObject = sessions.find(
    (session) => session.sessionId === currentSessionId,
  );

  const currentChatFromList = chatList.find(
    (chat) => chat.chatId === currentSessionObject?.chatId,
  );

  const scrollToBottom = (container: HTMLElement | null, smooth = false) => {
    if (container?.children.length) {
      const lastElement = container?.lastChild as HTMLElement;

      lastElement?.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
        inline: "nearest",
      });
    }
  };

  useEffect(() => {
    scrollToBottom(scrollAreaRef.current, true);
  }, []);

  useEffect(() => {
    scrollToBottom(scrollAreaRef.current, true);
  }, [chatHistory]);

  const handleStartNewChat = (
    chatType: string,
    chatName: string,
    pickedChatId: string,
  ) => {
    closeSidebarOnMobile();
    const selectedChat = chatList.find((chat) => chat.chatId === pickedChatId);

    const welcomeText = {
      type: "answer",
      text: selectedChat?.welcomeMsg ?? "Hi, how are you today?",
    };
    const sessionId = startNewSession(chatType, chatName, pickedChatId);

    const updateChatId = async () => {
      await updateCurrentChatId(userId, pickedChatId);
    };
    updateChatId();
    setChatHistory([welcomeText], chatType, sessionId);
  };

  return (
    <>
      <div
        className={`fixed bottom-0 right-0 top-0 mx-auto flex ${isSidebarOpen ? "w-1/2" : "w-full"} z-10 flex-col bg-background px-2 md:static md:max-h-screen md:w-full md:max-w-screen-xl`}
      >
        <div className="mb-3 flex items-center justify-center gap-3 py-3">
          <div>
            <Image src="/logo.png" alt="logo" width={40} height={40} />
          </div>
          {currentChatFromList?.name ?? "AITherapistFree"}
        </div>

        {chatHistory?.length > 0 ? (
          // Chat history interface
          <ScrollArea className="flex-1 overflow-auto md:px-6">
            <div
              ref={scrollAreaRef}
              className="flex flex-col gap-8 overflow-y-auto whitespace-pre-line"
            >
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
          <ScrollArea className="mb-3 flex flex-1 justify-center overflow-auto md:px-6">
            <div className="grid flex-1 gap-5 pb-6 sm:grid-cols-2 md:grid-cols-4 md:gap-0 md:px-6">
              {chatList.map((chat, i) => (
                <div
                  key={`chatType-${i}`}
                  className="flex flex-col items-center justify-center gap-3"
                >
                  <button
                    className="relative size-16 rounded-full transition-transform ease-in-out hover:scale-105 focus:outline-none md:size-24"
                    onClick={() =>
                      handleStartNewChat(chat.type, chat.name, chat.chatId)
                    }
                  >
                    <Image
                      alt="person face"
                      priority
                      src={chat.imgUrl}
                      fill
                      sizes="12rem"
                      className="absoulute z-0 rounded-full object-cover"
                    />
                  </button>
                  <p className="text-center text-xs text-muted-foreground md:text-sm">
                    {chat.name}
                  </p>
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
            price={price}
          />
        )}
      </div>
    </>
  );
}

export default Chat;
