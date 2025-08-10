import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AdditionalDetails } from "@/lib/types";

export const CareInstructionsModal = ({
  details,
}: {
  details?: AdditionalDetails;
}) => {
  if (!details) return null;
  return (
    <Dialog>
      <DialogTrigger className="p-0 underline text-muted-foreground text-xs">
        Care Instructions
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Care Instructions</DialogTitle>
          <DialogDescription className="text-xs">
            Please follow these instructions to take the best care for your
            product.
          </DialogDescription>
        </DialogHeader>
        {details?.careInstructions && details.careInstructions.length > 0 && (
          <div className="flex flex-col space-y-10 py-10 lg:py-0">
            {details.careInstructions.map((item, index) => (
              <div key={index} className="flex justify-between items-start">
                <span className="w-1/2 text-muted-foreground text-xs font-semibold">
                  {item.title}
                </span>
                <span className="w-1/2 text-foreground text-xs leading-relaxed">
                  {item.description}
                </span>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
