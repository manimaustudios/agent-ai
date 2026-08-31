import { ChatProvider } from "@/lib/providers/ChatProvider";
import { AppClerkProvider } from "@/lib/providers/AppClerkProvider";

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppClerkProvider>
      <ChatProvider>
        <div className="fixed bottom-0 left-0 top-0 flex h-screen bg-background md:static">
          {children}
        </div>
      </ChatProvider>
    </AppClerkProvider>
  );
}
