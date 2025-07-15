"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import {
  requestForgotPassword,
  confirmForgotPassword,
  isOTPExpired,
} from "@/server/user/actions";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const emailSchema = z.object({
  email: z.email("Invalid email address"),
});

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type EmailFormValues = z.infer<typeof emailSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

type Step = "email" | "otp" | "reset";

export function ForgotPasswordCard() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otpValue, setOtpValue] = useState(""); // Direct state for OTP
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const otpFormRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Reset forms when step changes to ensure clean state
  useEffect(() => {
    if (step === "email") {
      setOtpValue("");
      resetForm.reset();
    } else if (step === "otp") {
      setOtpValue(""); // Clear OTP state
      resetForm.reset();
    }
  }, [step, resetForm]);

  const { mutate: requestPasswordReset, isPending: isRequestingReset } =
    useApiMutation(
      (email: string) => requestForgotPassword(email),
      {
        onSuccess: (response) => {
          toast.success(
            response?.message || "Password reset code sent to your email",
          );
          // Clear OTP state before transitioning
          setOtpValue("");
          setStep("otp");
        },
        onError: (error) => {
          toast.error(error || "Failed to send password reset email");
          console.error("Error sending password reset email:", error);
        },
      },
    );

  const { mutate: handleVerifyOTP, isPending: isVerifyingOTP } = useApiMutation(
    async (code: string) => {
      const isExpired = await isOTPExpired(code, undefined, email);
      if (isExpired) {
        throw new Error("OTP has expired or is invalid");
      }
      return { success: true, data: { message: "OTP verified successfully", valid: true } };
    },
    {
      onSuccess: (response) => {
        toast.success(response.message || "OTP verified successfully");
        setStep("reset");
      },
      onError: (error) => {
        toast.error(error || "Failed to verify OTP");
        console.error("Error verifying OTP:", error);
      },
    },
  );

  const { mutate: confirmPasswordReset, isPending: isConfirmingReset } =
    useApiMutation(
      (data: {
        email: string;
        code: string;
        newPassword: string;
      }) => confirmForgotPassword(data.email, data.code, data.newPassword),
      {
        onSuccess: (response) => {
          toast.success(response?.message || "Password reset successfully");
          router.push("/account");
          // Reset all forms and state
          setStep("email");
          emailForm.reset({ email: "" });
          setOtpValue("");
          resetForm.reset({ newPassword: "", confirmPassword: "" });
          setEmail("");
          setShowPassword(false);
          setShowConfirmPassword(false);
        },
        onError: (error) => {
          toast.error(error || "Failed to reset password");
          console.error("Error resetting password:", error);
        },
      },
    );

  const onEmailSubmit = (data: EmailFormValues) => {
    setEmail(data.email);
    requestPasswordReset(data.email);
  };

  const onOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate that we have a proper 8-character code
    if (otpValue.length === 8) {
      handleVerifyOTP(otpValue);
    }
  };

  const onResetSubmit = (data: ResetPasswordFormValues) => {
    confirmPasswordReset({
      email,
      code: otpValue, // Use direct state instead of form value
      newPassword: data.newPassword,
    });
  };

  const handleBackToEmail = () => {
    setStep("email");
    setOtpValue("");
  };

  const handleBackToOTP = () => {
    setStep("otp");
    resetForm.reset({ newPassword: "", confirmPassword: "" });
  };

  const getStepContent = () => {
    switch (step) {
      case "email":
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Forgot Password</CardTitle>
              <CardDescription>
                Enter your email address and we&apos;ll send you a code to reset
                your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form
                  onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isRequestingReset}
                  >
                    {isRequestingReset ? "Sending..." : "Send Reset Code"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </>
        );

      case "otp":
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">
                Enter Verification Code
              </CardTitle>
              <CardDescription>
                We sent an 8-digit code to {email}. Enter it below to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                ref={otpFormRef}
                onSubmit={onOTPSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Verification Code
                  </label>
                  <InputOTP
                    maxLength={8}
                    value={otpValue}
                    onChange={(value) => {
                      console.log("OTP onChange:", value); // Debug log
                      setOtpValue(value);
                    }}
                  >
                    <InputOTPGroup className="flex-1 flex gap-0">
                      <InputOTPSlot
                        index={0}
                        className="flex-1 h-12 text-lg font-semibold"
                      />
                      <InputOTPSlot
                        index={1}
                        className="flex-1 h-12 text-lg font-semibold"
                      />
                      <InputOTPSlot
                        index={2}
                        className="flex-1 h-12 text-lg font-semibold"
                      />
                      <InputOTPSlot
                        index={3}
                        className="flex-1 h-12 text-lg font-semibold"
                      />
                    </InputOTPGroup>
                    <InputOTPSeparator className="text-2xl font-bold text-muted-foreground px-2">
                      -
                    </InputOTPSeparator>
                    <InputOTPGroup className="flex-1 flex gap-0">
                      <InputOTPSlot
                        index={4}
                        className="flex-1 h-12 text-lg font-semibold"
                      />
                      <InputOTPSlot
                        index={5}
                        className="flex-1 h-12 text-lg font-semibold"
                      />
                      <InputOTPSlot
                        index={6}
                        className="flex-1 h-12 text-lg font-semibold"
                      />
                      <InputOTPSlot
                        index={7}
                        className="flex-1 h-12 text-lg font-semibold"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                  {otpValue.length < 8 && otpValue.length > 0 && (
                    <p className="text-sm text-red-500">
                      OTP must be 8 characters
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={otpValue.length !== 8 || isVerifyingOTP}
                >
                  {isVerifyingOTP ? "Verifying..." : "Verify Code"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleBackToEmail}
                >
                  Back to Email
                </Button>
              </form>
            </CardContent>
          </>
        );

      case "reset":
        const watchedFields = resetForm.watch();
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Set New Password</CardTitle>
              <CardDescription>Enter your new password below</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...resetForm}>
                <form
                  onSubmit={resetForm.handleSubmit(onResetSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={resetForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              className="pr-10"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={resetForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              className="pr-10"
                              {...field}
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="text-sm text-muted-foreground">
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

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isConfirmingReset}
                  >
                    {isConfirmingReset ? "Resetting..." : "Reset Password"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleBackToOTP}
                  >
                    Back to Verification
                  </Button>
                </form>
              </Form>
            </CardContent>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="mx-auto min-w-md max-w-md shadow-none border-none">
      {getStepContent()}
    </Card>
  );
}
