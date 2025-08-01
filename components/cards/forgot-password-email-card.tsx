import Form from "next/form";
import { redirect } from "next/navigation";
import { requestForgotPassword } from "@/server/user/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ForgotPasswordEmailCard() {
  async function handleEmailSubmit(formData: FormData) {
    "use server";
    
    try {
      await requestForgotPassword(formData);
      const email = formData.get("email") as string;
      redirect(`/forgot-password/verify?email=${encodeURIComponent(email)}`);
    } catch (error) {
      throw error;
    }
  }

  return (
    <Card className="mx-auto min-w-md max-w-md shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a code to reset
          your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form action={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email Address
            </label>
            <Input
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Send Reset Code
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}