"use client";

import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import ChatHistory from "./ChatHistory";
import NewChatButton from "./NewChatButton";
import { useSidebar } from "@/lib/providers/SidebarProvider";

type SidebarProps = {
  isAuthenticated: boolean;
  userId: string | null;
  children: React.ReactNode;
};

function Sidebar({ isAuthenticated, userId, children }: SidebarProps) {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  return (
    <>
      <div
        className={`${isSidebarOpen ? "flex" : "hidden"} fixed bottom-0 left-0 top-0 z-30 w-2/3 flex-col border-r-2 border-secondary-foreground/10 bg-background p-2 sm:w-1/2 md:relative md:w-72`}
      >
        <div className="relative space-y-4">
          <div className="flex items-center justify-start gap-2">
            <div>
              <Image src="/logo.png" alt="logo" width={40} height={40} />
            </div>
            <span className="text-muted-foreground">AITherapistFree</span>
          </div>
          <div className="flex items-center justify-between">
            <NewChatButton />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="z-30 -mr-2 flex size-6 items-center justify-center rounded-l-full border-y border-l bg-background"
            >
              <FaChevronLeft className="size-4" />
            </button>
          </div>

          {isAuthenticated && <ChatHistory userId={userId} />}
        </div>
        <div className="mt-auto space-y-2 pt-2 md:static">
          {/* server components */}
          {children}
        </div>
        {/* <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute right-0 top-4 z-20 flex size-6 items-center justify-center rounded-l-full border-y border-l bg-background"
        >
          <FaChevronLeft className="size-4" />
        </button> */}
      </div>
      <button
        onClick={() => setIsSidebarOpen(true)}
        className={`${!isSidebarOpen ? "flex" : "hidden"} fixed left-0 top-3 z-20 h-7 w-8 items-center justify-center rounded-r-full border-y border-r bg-background`}
      >
        <FaChevronRight className="size-5" />
      </button>
    </>
  );
}

export default Sidebar;
