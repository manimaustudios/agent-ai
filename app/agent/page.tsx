import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";

async function Page() {
  // const welcomeMessage = await getWelcomeMessages() // need default message
  const welcomeMessage = "Hi, how are you today?";

  return (
    <div className="flex h-screen">
      <Sidebar />
      <Chat welcomeMessage={welcomeMessage} />
    </div>
  );
}

export default Page;
