"use client";

import Link from "next/link";
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
import { toast } from "sonner";
import { setAuthToken } from "@/lib/utils";
import { signInWithEmail } from "@/server/user/actions";
import { useApiMutation } from "@/hooks/use-api-mutation";

const signInSchema = z
  .object({
    authMethod: z.enum(["email", "phone"]),
    email: z.email("Invalid email address").optional(),
    password: z.string().min(1, "Password is required"),
  })
  .refine(
    (data) => {
      if (data.authMethod === "email") {
        return data.email && data.email.length > 0;
      }
    },
    {
      message: "Email or phone is required",
      path: ["email"],
    },
  );

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInCard() {
  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      authMethod: "email",
      email: "",
      password: "",
    },
  });

  const { mutate: signInEmailMutation, isPending: isSigningInWithEmail } =
    useApiMutation(
      (data: { email: string; password: string; callbackUrl: string }) =>
        signInWithEmail(data.email, data.password, data.callbackUrl),
      {
        onSuccess: (data) => {
          // data is guaranteed to be defined here and is the actual response data
          if (data?.token) {
            setAuthToken(data.token);
          }
          if (data?.callbackUrl) {
            router.push(data.callbackUrl);
          }
        },
        onError: (error) => {
          toast.error(error);
          console.error("Error signing in with email:", error);
        },
      },
    );

  const onSubmit = (data: SignInFormValues) => {
    // Simply call the mutation - all success/error handling is done in useApiMutation
    signInEmailMutation({
      email: data.email!,
      password: data.password,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/account`,
    });
  };

  return (
    <Card className="mx-auto min-w-md shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Sign into your BVR STR Collective account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSigningInWithEmail}
            >
              {isSigningInWithEmail ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          {"Don't have an account? "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
          {" | "}
          <Link
            href="/forgot-password"
            className="ml-auto inline-block text-sm underline"
          >
            Forgot your password?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
