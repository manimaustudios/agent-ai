"use client";

import { FaRegMessage } from "react-icons/fa6";
import { Button } from "./ui/button";
import { useChat } from "@/lib/providers/ChatProvider";

type Props = {};

function NewChatButton({}: Props) {
  const { setChatHistory } = useChat();

  const handleStartNewChat = () => {
    setChatHistory([], "", "", false);
  };
  return (
    <Button
      className="flex items-center justify-center gap-2 border bg-background"
      variant="secondary"
      size="sm"
      onClick={() => handleStartNewChat()}
    >
      New Chat
      <FaRegMessage className="size-3" />
    </Button>
  );
}

export default NewChatButton;
