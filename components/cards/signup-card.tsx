"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PhoneInput } from "../utils/phone-input";
import { signUp } from "@/server/user/actions";
import { toast } from "sonner";
import { setAuthToken } from "@/lib/utils";
import { UserSignUp } from "@/lib/types";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

const signUpSchema = z
  .object({
    firstName: z.string().min(1, "Name is required"),
    lastName: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    phone: z.string().optional(),
    address: z.string().min(1, "Street address is required"),
    apt: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "ZIP code is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
    optInMarketing: z.boolean().optional(),
    optInRewards: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";

  const [firstName, lastName] = name.split(" ", 2);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: firstName || "",
      lastName: lastName || "",
      email: email,
      phone: "",
      address: "",
      apt: "",
      city: "",
      state: "",
      zipCode: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
      optInMarketing: true,
      optInRewards: true,
    },
  });

  useEffect(() => {
    if (name) {
      const [first, ...rest] = name.split(" ");
      form.setValue("firstName", first || "");
      form.setValue("lastName", rest.join(" ") || "");
    }
    if (email) {
      form.setValue("email", email);
    }
  }, [name, email, form]);

  const { mutate: signUpMutation, isPending: isSigningUp } = useApiMutation(
    (data: UserSignUp) => signUp(data),
    {
      onSuccess: (response) => {
        if (response?.token) {
          setAuthToken(response.token);
        }
        router.push(`/account`);
        toast.success(
          "Account created successfully! Please check your email for a verification code.",
        );
      },
      onError: (error) => {
        console.error(error);
        toast.error("An error occurred, please try again!");
      },
    },
  );

  const onSubmit = (data: SignUpFormValues) => {
    const userData: UserSignUp = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || "",
      address: {
        street: data.address,
        city: data.city,
        state: data.state,
        apt: data.apt,
        zip: data.zipCode,
      },
      password: data.password,
    };

    signUpMutation(userData);
  };

  const watchedFields = form.watch();
  const isFormValid =
    watchedFields.firstName &&
    watchedFields.lastName &&
    watchedFields.email &&
    watchedFields.address &&
    watchedFields.city &&
    watchedFields.state &&
    watchedFields.zipCode &&
    watchedFields.password &&
    watchedFields.confirmPassword &&
    watchedFields.termsAccepted;

  return (
    <Card className="mx-auto min-w-md max-w-lg shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Create your free BVR STR Collective account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apt/Unit/Building (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="#130" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="NY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input placeholder="10001" {...field} />
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
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
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
                        id="signup-button"
                        data-umami-event="Signup button"
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
                    watchedFields.password && watchedFields.password.length >= 8
                      ? "text-green-600"
                      : ""
                  }
                >
                  At least 8 characters long
                </li>
                <li
                  className={
                    watchedFields.password === watchedFields.confirmPassword &&
                    watchedFields.confirmPassword
                      ? "text-green-600"
                      : ""
                  }
                >
                  Passwords match
                </li>
              </ul>
            </div>

            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the{" "}
                      <Link
                        href="/legal/terms"
                        target="_blank"
                        className="underline"
                      >
                        Terms and Conditions.
                      </Link>
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="optInMarketing"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 max-w-lg">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I would like to receive marketing communications about the
                      latest products and services offered by BVR STR CO.
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="optInRewards"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I would like to earn BVR STR CO rewards.
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSigningUp || !isFormValid}
            >
              Sign Up
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-left text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
