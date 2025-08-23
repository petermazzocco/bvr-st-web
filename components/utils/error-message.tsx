import { cn } from "@/lib/utils";

export const ErrorMessage = ({
  message,
  className,
}: {
  message: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "mb-4 p-3 min-w-lg max-w-lg text-xs text-destructive bg-destructive/10 border border-destructive/20  rounded-md",
        className,
      )}
    >
      {message}
    </div>
  );
};
