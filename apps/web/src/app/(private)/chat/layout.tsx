import ChatHeader from "@src/components/chat/ChatHeader";
export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1 w-screen h-screen overflow-hidden bg-background text-foreground">
      <ChatHeader />
      {children}
    </div>
  );
}
