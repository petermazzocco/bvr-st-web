"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { verifyUserEmail } from "@/server/user/actions";
import { getUserIdFromToken, getAuthToken } from "@/lib/utils";
import { useApiMutation } from "@/hooks/use-api-mutation";

const otpSchema = z.object({
  code: z
    .string()
    .min(8, "Code must be 8 digits")
    .max(8, "Code must be 8 digits"),
});

type OTPFormValues = z.infer<typeof otpSchema>;

export function OTPCard() {
  const router = useRouter();
  const token = getAuthToken();
  const userId = getUserIdFromToken();

  const form = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: "",
    },
  });

  const { mutate: verifyOTP, isPending: isVerifyingOTP } = useApiMutation(
    (data: { code: string }) => verifyUserEmail(userId!, data.code, token!),
    {
      onSuccess: () => {
        router.push("/account");
      },
      onError: (error) => {
        toast.error(error);
        console.error("Error verifying OTP:", error);
      },
    },
  );

  if (!token || !userId) {
    router.push("/signin");
    return null;
  }

  const onSubmit = (data: { code: string }) => {
    verifyOTP(data);
  };

  return (
    <Card className="mx-auto min-w-md max-w-lg shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Verify Email</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={8}
                      value={field.value}
                      className="w-full"
                      onChange={(value) => {
                        field.onChange(value);
                        if (value.length === 8) {
                          form.handleSubmit(onSubmit)();
                        }
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isVerifyingOTP}>
              {isVerifyingOTP ? "Verifying..." : "Verify Code"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          The verification code will expire in 30 minutes. Please verify your
          code within this time frame. Also, check your spam folder for any
          verification messages. If you haven&apos;t received one, please
          contact us.
        </p>
      </CardFooter>
    </Card>
  );
}
