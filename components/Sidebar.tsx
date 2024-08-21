import { FaChevronLeft } from "react-icons/fa";

import AccesButton from "./AccesButton";
import ChatHistory from "./ChatHistory";
import NewChatButton from "./NewChatButton";
import SubscriptionStatus from "./SubscriptionStatus";

type SidebarProps = {
  isAuthenticated: boolean;
  userId: string | null;
};

async function Sidebar({ isAuthenticated, userId }: SidebarProps) {
  return (
    <div className="flex h-screen w-56 flex-col bg-slate-900 p-2">
      <div className="space-y-4">
        <div className="ml-3 flex items-center justify-between">
          Logo
          <FaChevronLeft className="size-4" />
        </div>
        <NewChatButton />

        {isAuthenticated && <ChatHistory />}
      </div>
      <div className="mt-auto space-y-2">
        {/* For testing */}
        {/* <CreateUserButton userId={userId} /> */}
        {isAuthenticated && <SubscriptionStatus userId={userId} />}
        <AccesButton isAuth={isAuthenticated} />
      </div>
    </div>
  );
}

export default Sidebar;
