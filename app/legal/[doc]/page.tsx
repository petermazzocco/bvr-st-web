export default async function Page(props: {
  params: Promise<{ doc: string }>;
}) {
  const { doc } = await props.params;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Legal Document: {doc}</h1>
    </div>
  );
}
