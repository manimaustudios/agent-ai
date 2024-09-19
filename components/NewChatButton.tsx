"use client";

import { FaRegMessage } from "react-icons/fa6";
import { Button } from "./ui/button";
import { useChat } from "@/lib/providers/ChatProvider";
import { useSidebar } from "@/lib/providers/SidebarProvider";

type Props = {};

function NewChatButton({}: Props) {
  const { setChatHistory } = useChat();
  const { closeSidebarOnMobile } = useSidebar();

  const handleStartNewChat = () => {
    closeSidebarOnMobile();
    setChatHistory([], "", "", false);
  };
  return (
    <Button
      className="flex items-center justify-center gap-2"
      variant="outline"
      size="sm"
      onClick={() => handleStartNewChat()}
    >
      New Chat
      <FaRegMessage className="size-3" />
    </Button>
  );
}

export default NewChatButton;
