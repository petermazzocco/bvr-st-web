"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { changeUserPassword } from "@/server/user/actions";
import { Lock, Eye, EyeOff } from "lucide-react";
import Form from "next/form";

interface ChangePasswordModalProps {
  userId: number;
  trigger?: React.ReactNode;
}

export function ChangePasswordModal({
  userId,
  trigger,
}: ChangePasswordModalProps) {
  const [open, setOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleFormAction = async (formData: FormData) => {
    try {
      // Get form values for validation
      const newPassword = formData.get("newPassword") as string;
      const confirmPassword = formData.get("confirmPassword") as string;
      const currentPassword = formData.get("currentPassword") as string;

      // Client-side validation
      if (!currentPassword) {
        throw new Error("Current password is required");
      }
      if (!newPassword || newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters long");
      }
      if (newPassword !== confirmPassword) {
        throw new Error("New passwords do not match");
      }
      if (currentPassword === newPassword) {
        throw new Error("New password must be different from current password");
      }

      await changeUserPassword(formData);
      setOpen(false);
    } catch (error) {
      console.error("Change password error:", error);
      // Error handling will be shown via server action error boundary
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Lock className="w-4 h-4 mr-2" />
            Change Password
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new password. Your new
            password must be at least 8 characters long.
          </DialogDescription>
        </DialogHeader>
        <Form action={handleFormAction}>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 py-4">
              {/* Current Password */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Current</label>
                <div className="col-span-3 relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    placeholder="Enter current password"
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() =>
                      setShowCurrentPassword(!showCurrentPassword)
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* New Password */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">New</label>
                <div className="col-span-3 relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter new password"
                    className="pr-10"
                    minLength={8}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Confirm</label>
                <div className="col-span-3 relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    className="pr-10"
                    minLength={8}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="col-span-4 text-sm text-muted-foreground">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>At least 8 characters long</li>
                  <li>Different from current password</li>
                  <li>Passwords match</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                id="user-change-password-button"
                data-umami-event="User change password button"
              >
                Change Password
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}