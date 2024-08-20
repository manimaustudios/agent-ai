import { FaChevronLeft, FaTimes } from "react-icons/fa";
import AccesButton from "./AccesButton";
import { auth } from "@/lib/logto/auth";
import ChatHistory from "./ChatHistory";
import PaymentButton from "./PaymentButton";
import NewChatButton from "./NewChatButton";
import CreateUserButton from "./CreateUserButton";
import SubscriptionStatus from "./SubscriptionStatus";

async function Sidebar() {
  const { isAuthenticated, userId } = await auth();

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
        {/* <CreateUserButton userId={userId} /> */}
        {/* {isAuthenticated && <PaymentButton userId={userId} />} */}
        {isAuthenticated && <SubscriptionStatus userId={userId} />}
        <AccesButton isAuth={isAuthenticated} />
      </div>
    </div>
  );
}

export default Sidebar;
