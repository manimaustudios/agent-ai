import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ChatMessage {
  type: string;
  text: string;
}

interface ChatContextProps {
  chatHistory: ChatMessage[];
  setChatHistory: (
    messages: ChatMessage[],
    chatType: string,
    sessionId: string,
  ) => void;
  loadChatHistory: (chatType: string, sessionId: string) => void;
  deleteChatHistory: (chatType: string, sessionId: string) => void;
  startNewSession: (chatType: string) => string;
}

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
  const [currentChatType, setCurrentChatType] = useState<string>("");
  const [currentSessionId, setCurrentSessionId] = useState<string>("");

  useEffect(() => {
    // Load chat history from localStorage when component is mounted
    if (currentChatType && currentSessionId) {
      loadChatHistory(currentChatType, currentSessionId);
    }
  }, [currentChatType, currentSessionId]);

  const setChatHistory = (
    messages: ChatMessage[],
    chatType: string,
    sessionId: string,
  ) => {
    setChatHistoryState(messages);
    // Save the updated chat history to localStorage
    localStorage.setItem(`${chatType}-${sessionId}`, JSON.stringify(messages));
  };

  const loadChatHistory = (chatType: string, sessionId: string) => {
    const savedHistory = localStorage.getItem(`${chatType}-${sessionId}`);
    if (savedHistory) {
      setChatHistoryState(JSON.parse(savedHistory));
      setCurrentChatType(chatType);
      setCurrentSessionId(sessionId);
    } else {
      setChatHistoryState([]);
    }
  };

  const deleteChatHistory = (chatType: string, sessionId: string) => {
    localStorage.removeItem(`${chatType}-${sessionId}`);
    setChatHistoryState([]);
  };

  const startNewSession = (chatType: string) => {
    const newSessionId = Date.now().toString(); // Generate a unique session ID using timestamp
    setCurrentChatType(chatType);
    setCurrentSessionId(newSessionId);
    setChatHistoryState([]); // Clear chat history for the new session
    return newSessionId;
  };

  return (
    <ChatContext.Provider
      value={{
        chatHistory,
        setChatHistory,
        loadChatHistory,
        deleteChatHistory,
        startNewSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
