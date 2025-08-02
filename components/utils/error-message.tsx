export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className="mb-4 p-3 min-w-lg max-w-lg text-xs text-destructive bg-destructive/10 border border-destructive/20  rounded-md">
      {message}
    </div>
  );
};
