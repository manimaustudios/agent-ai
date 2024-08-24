import { ChatProvider } from "@/lib/providers/ChatProvider";
import { ThemeProvider } from "@/lib/providers/ThemeProvider";

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatProvider>
      <div className="flex h-screen bg-background" suppressHydrationWarning>
        {children}
      </div>
    </ChatProvider>
  );
}
