"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface BidConfirmationModalProps {
  bidAmount: string;
  onConfirm: () => void;
  isLoading: boolean;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BidConfirmationModal({
  bidAmount,
  onConfirm,
  isLoading,
  children,
  open,
  onOpenChange,
}: BidConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Confirm Your Bid
          </DialogTitle>
          <DialogDescription className="text-left text-xs">
            Are you sure you want to place this bid?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg border border-border">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Your bid amount:
              </p>
              <p className="text-2xl font-bold text-foreground">${bidAmount}</p>
            </div>
          </div>

          <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <div className="flex items-start gap-3">
              <div className="text-sm text-destructive">
                <p className="font-medium mb-2">Important Notice:</p>
                <ul className="space-y-1 text-xs">
                  <li>
                    • This bid is <strong>irreversible</strong> once placed
                  </li>
                  <li>
                    • If you win, you will be invoiced for the full amount
                  </li>
                  <li>
                    • Payment must be made within <strong>30 days</strong> after
                    the auction ends
                  </li>
                  <li>• No returns are accepted on auction items</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Placing Bid..." : "Confirm Bid"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
