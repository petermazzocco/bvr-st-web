import Form from "next/form";
import Link from "next/link";
import { confirmForgotPassword } from "@/server/user/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ForgotPasswordResetCardProps {
  email: string;
  code: string;
}

export function ForgotPasswordResetCard({ email, code }: ForgotPasswordResetCardProps) {
  async function handleResetSubmit(formData: FormData) {
    "use server";
    
    formData.append("email", email);
    formData.append("code", code);
    await confirmForgotPassword(formData);
  }

  return (
    <Card className="mx-auto min-w-md max-w-md shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Set New Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <Form action={handleResetSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="newPassword"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              New Password
            </label>
            <Input
              type="password"
              name="newPassword"
              required
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Password requirements:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>At least 8 characters long</li>
              <li>Contains uppercase and lowercase letters</li>
              <li>Contains at least one number</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full"
            id="reset-forgotten-password-button"
            data-umami-event="Reset forgotten password button"
          >
            Reset Password
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            asChild
          >
            <Link href={`/forgot-password/verify?email=${encodeURIComponent(email)}`}>
              Back to Verification
            </Link>
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}