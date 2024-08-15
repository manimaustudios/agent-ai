"use client";

import { useChat } from "@/lib/providers/ChatProvider";
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
    <div className="space-y-2 py-3 text-sm text-slate-400">
      {sessions.map((session, i) => (
        <div
          key={`chat-${i}`}
          className="group flex cursor-pointer items-center justify-between rounded-md px-2 py-1 hover:bg-slate-800"
          onClick={() =>
            handleShowChatHistory(session.chatType, session.sessionId)
          }
        >
          <p>{session.chatName}</p>
          <div className="hidden size-4 group-hover:block">
            <FaTimes
              className="size-4 hover:text-red-700"
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
    </div>
  );
}

export default ChatHistory;
