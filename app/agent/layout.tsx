import { ChatProvider } from "@/lib/providers/ChatProvider";

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatProvider>
      <div className="flex h-screen bg-background">{children}</div>
    </ChatProvider>
  );
}
