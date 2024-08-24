"use client";

import { useChat } from "@/lib/providers/ChatProvider";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { FaTimes } from "react-icons/fa";

function ChatHistory() {
  const { sessions, loadChatHistory, deleteChatHistory, setChatHistory } =
    useChat();

  const handleShowChatHistory = (chatType: string, sessionId: string) => {
    loadChatHistory(chatType, sessionId);
  };

  const handleDeleteChatHistory = (
    event: React.MouseEvent,
    chatType: string,
    sessionId: string,
  ) => {
    event.stopPropagation();
    deleteChatHistory(chatType, sessionId);
  };

  return (
    <>
      {sessions.length > 0 && (
        <div className="max-h-64 rounded-lg border p-2">
          <p className="text-sm text-muted-foreground">Previous Chats:</p>
          <div className="mt-1 border-t" />

          <ScrollArea className="mt-2 h-44 space-y-2 overflow-auto pb-1 pr-2 text-sm text-muted-foreground">
            {sessions.map((session, i) => (
              <div
                key={`chat-${i}`}
                className="group flex cursor-pointer items-center justify-between rounded-md px-1 py-1 hover:bg-foreground"
                onClick={() =>
                  handleShowChatHistory(session.chatType, session.sessionId)
                }
              >
                <p>{session.chatName}</p>
                <div className="hidden size-4 group-hover:block">
                  <FaTimes
                    className="size-4 hover:text-destructive"
                    onClick={(event) =>
                      handleDeleteChatHistory(
                        event,
                        session.chatType,
                        session.sessionId,
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
    </>
  );
}

export default ChatHistory;
