"use client";

import { useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import ChatHistory from "./ChatHistory";
import NewChatButton from "./NewChatButton";

type SidebarProps = {
  isAuthenticated: boolean;
  userId: string | null;
  children: React.ReactNode;
};

function Sidebar({ isAuthenticated, userId, children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <div
        className={`${isOpen ? "flex" : "hidden"} h-screen w-60 flex-col bg-secondary/50 p-2`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-start gap-2">
            <div>
              <Image src="/logo.png" alt="logo" width={40} height={40} />
            </div>
            <span className="text-muted-foreground">AITherapistFree</span>
          </div>
          <div className="flex items-center justify-between">
            <NewChatButton />
            <button
              onClick={() => setIsOpen(false)}
              className="-mr-2 flex size-6 items-center justify-center rounded-l-full border-y border-l bg-background"
            >
              <FaChevronLeft className="size-4" />
            </button>
          </div>

          {isAuthenticated && <ChatHistory userId={userId} />}
        </div>
        <div className="mt-auto space-y-2">
          {/* server components */}
          {children}
        </div>
      </div>
      <button
        onClick={() => setIsOpen(true)}
        className={`${!isOpen ? "flex" : "hidden"} absolute left-0 top-3 size-6 items-center justify-center rounded-r-full border bg-background`}
      >
        <FaChevronRight className="size-4" />
      </button>
    </>
  );
}

export default Sidebar;
