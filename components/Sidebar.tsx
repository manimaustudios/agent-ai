import { FaChevronLeft, FaTimes } from "react-icons/fa";
import AccesButton from "./AccesButton";
import { auth } from "@/lib/logto/auth";
import ChatHistory from "./ChatHistory";
import PaymentButton from "./PaymentButton";
import NewChatButton from "./NewChatButton";
import CreateUserButton from "./CreateUserButton";

async function Sidebar() {
  const { isAuthenticated, userId } = await auth();

  return (
    <div className="flex w-56 flex-col bg-slate-900 p-2">
      <div className="space-y-2">
        <div className="ml-3 flex items-center justify-between">
          Logo
          <FaChevronLeft className="size-4" />
        </div>
        <NewChatButton />

        <ChatHistory />
      </div>
      <div className="mt-auto space-y-2">
        <CreateUserButton userId={userId} />
        <PaymentButton userId={userId} />
        <AccesButton isAuth={isAuthenticated} />
      </div>
    </div>
  );
}

export default Sidebar;
