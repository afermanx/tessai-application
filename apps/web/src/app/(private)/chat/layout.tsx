export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen flex flex-col flex-1 overflow-hidden bg-background text-foreground">
      {children}
    </div>
  );
}
