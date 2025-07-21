export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1>Store Documentation</h1>
      <p>Welcome to the store documentation page.</p>
      {children}
    </div>
  );
}
