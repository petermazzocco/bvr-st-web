"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { changeUserPassword } from "@/server/user/actions";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";
import { useAuthToken } from "@/components/auth/auth-context";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
  userId: string;
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

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const authToken = useAuthToken();

  const { mutate: changePasswordMutation, isPending } = useApiMutation(
    ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => {
      if (!authToken) {
        throw new Error("Authentication token is required");
      }
      return changeUserPassword(
        authToken,
        userId,
        currentPassword,
        newPassword,
      );
    },
    {
      onSuccess: () => {
        toast.success("Password changed successfully!");
        setOpen(false);
        form.reset();
      },
      onError: (error: string) => {
        toast.error(error || "Failed to change password");
        console.error("Change password error:", error);
      },
    },
  );

  const onSubmit = (data: ChangePasswordFormValues) => {
    if (!authToken) {
      toast.error("Please sign in to change your password");
      return;
    }

    changePasswordMutation({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  const handleCancel = () => {
    setOpen(false);
    form.reset();
  };

  const watchedFields = form.watch();

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-4 py-4">
              {/* Current Password */}
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Current</FormLabel>
                      <div className="col-span-3 relative">
                        <FormControl>
                          <Input
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter current password"
                            className="pr-10"
                            {...field}
                          />
                        </FormControl>
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
                    <FormMessage className="ml-[25%]" />
                  </FormItem>
                )}
              />

              {/* New Password */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">New</FormLabel>
                      <div className="col-span-3 relative">
                        <FormControl>
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            className="pr-10"
                            {...field}
                          />
                        </FormControl>
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
                    <FormMessage className="ml-[25%]" />
                  </FormItem>
                )}
              />

              {/* Confirm New Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Confirm</FormLabel>
                      <div className="col-span-3 relative">
                        <FormControl>
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            className="pr-10"
                            {...field}
                          />
                        </FormControl>
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
                    <FormMessage className="ml-[25%]" />
                  </FormItem>
                )}
              />

              {/* Password Requirements */}
              <div className="col-span-4 text-sm text-muted-foreground">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li
                    className={
                      watchedFields.newPassword &&
                      watchedFields.newPassword.length >= 8
                        ? "text-green-600"
                        : ""
                    }
                  >
                    At least 8 characters long
                  </li>
                  <li
                    className={
                      watchedFields.newPassword !==
                        watchedFields.currentPassword &&
                      watchedFields.newPassword
                        ? "text-green-600"
                        : ""
                    }
                  >
                    Different from current password
                  </li>
                  <li
                    className={
                      watchedFields.newPassword ===
                        watchedFields.confirmPassword &&
                      watchedFields.confirmPassword
                        ? "text-green-600"
                        : ""
                    }
                  >
                    Passwords match
                  </li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || !authToken}
                id="user-change-password-button"
                data-umami-event="User change password button"
              >
                {isPending ? "Changing..." : "Change Password"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
