"use client";

import { useState } from "react";
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
        className={`${isOpen ? "flex" : "hidden"} h-screen w-56 flex-col bg-slate-900 p-2`}
      >
        <div className="space-y-4">
          <div className="ml-3 flex items-center justify-between">
            Logo
            <button
              onClick={() => setIsOpen(false)}
              className="-mr-2 flex size-6 items-center justify-center rounded-l-full bg-slate-800"
            >
              <FaChevronLeft className="size-4" />
            </button>
          </div>
          <NewChatButton />

          {isAuthenticated && <ChatHistory />}
        </div>
        <div className="mt-auto space-y-2">
          {/* server components */}
          {children}
        </div>
      </div>
      <button
        onClick={() => setIsOpen(true)}
        className={`${!isOpen ? "flex" : "hidden"} absolute left-0 top-3 size-6 items-center justify-center rounded-r-full bg-slate-800`}
      >
        <FaChevronRight className="size-4" />
      </button>
    </>
  );
}

export default Sidebar;
