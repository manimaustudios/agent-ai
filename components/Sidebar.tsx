import { FaChevronLeft, FaTimes } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import AccesButton from "./AccesButton";
import { auth } from "@/lib/logto/auth";
import ChatHistory from "./ChatHistory";
import { Button } from "./ui/button";

async function Sidebar() {
  const { isAuthenticated } = await auth();

  return (
    <div className="flex w-56 flex-col bg-slate-900 p-2">
      <div className="space-y-2">
        <div className="ml-3 flex items-center justify-between">
          Logo
          <FaChevronLeft className="size-4" />
        </div>
        <Button
          className="flex items-center justify-center gap-2"
          variant="ghost"
          size="sm"
        >
          New Chat
          <FaRegMessage className="size-3" />
        </Button>

        <ChatHistory />
      </div>
      <div className="mt-auto">
        <AccesButton isAuth={isAuthenticated} />
      </div>
    </div>
  );
}

export default Sidebar;
