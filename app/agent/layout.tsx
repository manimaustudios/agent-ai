import { ChatProvider } from "@/lib/providers/ChatProvider";

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatProvider>{children}</ChatProvider>;
}
