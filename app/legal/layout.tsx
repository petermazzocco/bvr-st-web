export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2  pt-16">
      <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
        {children}
      </main>
    </div>
  );
}
