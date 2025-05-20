export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-background text-foreground ">
      <main className="w-full max-w-md">{children}</main>
    </div>
  );
}
