export default function AgentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex h-screen max-w-screen-xl flex-col bg-slate-950 px-2">
      <div className="py-6 text-center">AI Chat Agent</div>
      {children}
    </div>
  );
}
