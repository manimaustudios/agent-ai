import { ChatProvider } from "@/lib/providers/ChatProvider";

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatProvider>
      <div className="fixed bottom-0 left-0 top-0 flex h-screen bg-background md:static">
        {children}
      </div>
    </ChatProvider>
  );
}
