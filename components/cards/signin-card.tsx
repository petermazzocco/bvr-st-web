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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhoneInput } from "../utils/phone-input";
import { toast } from "sonner";
import { setAuthToken } from "@/lib/utils";
import { signInWithEmail, signInWithPhone } from "@/server/user/actions";
import { useMutation } from "@tanstack/react-query";

const signInSchema = z
  .object({
    authMethod: z.enum(["email", "phone"]),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
    password: z.string().min(1, "Password is required"),
  })
  .refine(
    (data) => {
      if (data.authMethod === "email") {
        return data.email && data.email.length > 0;
      } else {
        return data.phone && data.phone.length > 0;
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
      phone: "",
      password: "",
    },
  });


  const { mutate: signInEmailMutation, isPending: isSigningInWithEmail } =
    useMutation({
      mutationFn: async (data: {
        email: string;
        password: string;
        callbackUrl: string;
      }) => {
        const response = await signInWithEmail(
          data.email,
          data.password,
          data.callbackUrl,
        );
        return response;
      },
    });

  const { mutate: signInPhoneMutation, isPending: isSigningInWithPhone } =
    useMutation({
      mutationFn: async (data: {
        phone: string;
        password: string;
        callbackUrl: string;
      }) => {
        const response = await signInWithPhone(
          data.phone,
          data.password,
          data.callbackUrl,
        );
        return response;
      },
    });

  const onSubmit = (data: SignInFormValues) => {
    if (data.authMethod === "email" && data.email) {
      signInEmailMutation(
        {
          email: data.email,
          password: data.password,
          callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/account`,
        },
        {
          onSuccess: (response) => {
            if (response.token) {
              setAuthToken(response.token);
            }
            if (response.callbackUrl) {
              router.push(response.callbackUrl);
            }
          },
          onError: (error) => {
            toast.error(error.message);
            console.error("Error signing in with email:", error);
          },
        },
      );
    } else if (data.authMethod === "phone" && data.phone) {
      signInPhoneMutation(
        {
          phone: data.phone,
          password: data.password,
          callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/account`,
        },
        {
          onSuccess: (response) => {
            if (response.token) {
              setAuthToken(response.token);
            }
            if (response.callbackUrl) {
              router.push(response.callbackUrl);
            }
          },
          onError: (error) => {
            toast.error("Error signing in with phone");
            console.error("Error signing in with phone:", error);
          },
        },
      );
    }
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
              name="authMethod"
              render={({ field }) => (
                <FormItem>
                  <Tabs
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="email">Email</TabsTrigger>
                      <TabsTrigger value="phone">Phone</TabsTrigger>
                    </TabsList>
                    <TabsContent value="email" className="space-y-2">
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
                    </TabsContent>
                    <TabsContent value="phone" className="space-y-2">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <PhoneInput
                                value={field.value || ""}
                                setValue={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
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
              disabled={isSigningInWithEmail || isSigningInWithPhone}
            >
              {isSigningInWithEmail || isSigningInWithPhone
                ? "Signing In..."
                : "Sign In"}
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
