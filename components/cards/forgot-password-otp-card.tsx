import Form from "next/form";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ForgotPasswordOTPCardProps {
  email: string;
}

export function ForgotPasswordOTPCard({ email }: ForgotPasswordOTPCardProps) {
  async function handleOTPSubmit(formData: FormData) {
    "use server";
    
    const code = formData.get("code") as string;
    
    if (code && code.length === 8) {
      redirect(`/forgot-password/reset?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
    } else {
      throw new Error("Please enter a valid 8-digit code");
    }
  }

  return (
    <Card className="mx-auto min-w-md max-w-md shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-2xl">
          Enter Verification Code
        </CardTitle>
        <CardDescription>
          We sent an 8-character code to {email}. Enter it below to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form action={handleOTPSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="code"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Verification Code
            </label>
            <Input
              type="text"
              name="code"
              placeholder="RGVMdHNP"
              maxLength={8}
              minLength={8}
              pattern="[A-Za-z0-9]{8}"
              className="text-center text-lg font-semibold tracking-widest"
              required
            />
            <p className="text-sm text-muted-foreground">
              Enter the 8-character code sent to your email
            </p>
          </div>
          <Button
            type="submit"
            className="w-full"
            id="forgot-password-verify-otp-button"
            data-umami-event="Forgot Password verify OTP"
          >
            Verify Code
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            asChild
          >
            <Link href="/forgot-password">
              Back to Email
            </Link>
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}