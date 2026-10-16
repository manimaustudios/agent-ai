"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

type ChatMessage = {
  type: string;
  text: string;
};

type ChatSession = {
  chatType: string;
  sessionId: string;
  chatName: string;
  chatId: string;
};

type ChatContextProps = {
  chatHistory: ChatMessage[];
  setChatHistory: (
    messages: ChatMessage[],
    chatType: string,
    sessionId: string,
    updateLocalStorage?: boolean,
  ) => void;
  loadChatHistory: (chatType: string, sessionId: string) => void;
  deleteChatHistory: (chatType: string, sessionId: string) => void;
  startNewSession: (
    chatType: string,
    chatName: string,
    chatId: string,
  ) => string;
  sessions: ChatSession[];
  deleteSession: (chatType: string, sessionId: string) => void;
  currentSessionId: string;
  currentChatType: string;
};

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [chatHistory, setChatHistoryState] = useState<ChatMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentChatType, setCurrentChatType] = useState<string>("");
  const [currentSessionId, setCurrentSessionId] = useState<string>("");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("chat_sessions") || "[]");
      if (Array.isArray(stored)) {
        const valid = stored.filter(
          (session) =>
            session &&
            typeof session.sessionId === "string" &&
            typeof session.chatType === "string",
        );
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSessions(valid);
        const active = localStorage.getItem("chat_active_session");
        const last =
          valid.find((session) => session.sessionId === active) || valid.at(-1);
        if (last) {
          const history = JSON.parse(
            localStorage.getItem(`${last.chatType}-${last.sessionId}`) || "[]",
          );
          setCurrentChatType(last.chatType);
          setCurrentSessionId(last.sessionId);
          if (Array.isArray(history)) setChatHistoryState(history);
        }
      }
    } catch {
      // Unavailable or invalid browser storage must not stop the chat UI.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("chat_sessions", JSON.stringify(sessions));
      if (currentSessionId)
        localStorage.setItem("chat_active_session", currentSessionId);
    } catch {
      // Browser storage can be unavailable or full.
    }
  }, [sessions, currentSessionId, hydrated]);

  const setChatHistory = (
    messages: ChatMessage[],
    chatType: string,
    sessionId: string,
    updateLocalStorage: boolean = true,
  ) => {
    setChatHistoryState(messages);
    // Save the updated chat history to localStorage
    if (updateLocalStorage) {
      localStorage.setItem(
        `${chatType}-${sessionId}`,
        JSON.stringify(messages),
      );
    }
  };

  const loadChatHistory = useCallback((chatType: string, sessionId: string) => {
    const savedHistory = localStorage.getItem(`${chatType}-${sessionId}`);
    if (savedHistory) {
      setChatHistoryState(JSON.parse(savedHistory));
      // Now that we have successfully loaded the history, update current session details
      setCurrentChatType(chatType);
      setCurrentSessionId(sessionId);
    } else {
      setChatHistoryState([]);
      setCurrentChatType(chatType); // Still set current chat if no history exists
      setCurrentSessionId(sessionId);
    }
  }, []);

  useEffect(() => {
    // Load chat history from localStorage when current session changes.
    if (currentChatType && currentSessionId) {
      // Chat history is synchronized from the browser's external localStorage.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadChatHistory(currentChatType, currentSessionId);
    }
  }, [currentChatType, currentSessionId, loadChatHistory]);

  const deleteChatHistory = (chatType: string, sessionId: string) => {
    localStorage.removeItem(`${chatType}-${sessionId}`);
    // Check if the deleted chat is the currently active one
    if (chatType === currentChatType && sessionId === currentSessionId) {
      setChatHistoryState([]); // Clear the chat history only if it's the active chat
    }
    deleteSession(chatType, sessionId);
  };

  const startNewSession = (
    chatType: string,
    chatName: string,
    chatId: string,
  ) => {
    const newSessionId = Date.now().toString(); // Generate a unique session ID using timestamp
    setChatHistoryState([]); // Clear chat history for the new session BEFORE setting session IDs
    setCurrentChatType(chatType);
    setCurrentSessionId(newSessionId);

    // Add the new session to the sessions list
    setSessions((prevSessions) => [
      ...prevSessions,
      { chatType, sessionId: newSessionId, chatName, chatId },
    ]);

    return newSessionId;
  };

  const deleteSession = (chatType: string, sessionId: string) => {
    setSessions((prevSessions) =>
      prevSessions.filter(
        (session) =>
          !(session.chatType === chatType && session.sessionId === sessionId),
      ),
    );
  };

  return (
    <ChatContext.Provider
      value={{
        chatHistory,
        setChatHistory,
        loadChatHistory,
        deleteChatHistory,
        startNewSession,
        sessions,
        deleteSession,
        currentSessionId,
        currentChatType,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
