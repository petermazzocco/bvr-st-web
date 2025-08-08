"use client";
import { useActionState, useState } from "react";
import Form from "next/form";
import Link from "next/link";
import { z } from "zod";
import { signUp } from "@/server/user/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ErrorMessage } from "@/components/utils/error-message";
import { AddressAutofillInput } from "../utils/address-autofill-input";
import { SignInOAuthButton } from "../utils/signup-oauth-button";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";

// Zod validation schema
const signUpSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email("Please enter a valid email address"),
    phone: z.string().optional(),
    address: z.string().optional(),
    addressLine2: z.string().optional(),
    addressLine3: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number"),
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

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpCard() {
  const params = useSearchParams();
  const [message, formAction, pending] = useActionState(signUp, null);
  const [formData, setFormData] = useState<Partial<SignUpFormData>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    addressLine2: "",
    addressLine3: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    optInMarketing: true,
    optInRewards: true,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpFormData, string>>
  >({});

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof SignUpFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle checkbox changes for Radix UI Checkbox
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));

    // Clear error for this field when user changes it
    if (errors[name as keyof SignUpFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle address selection from Mapbox
  const handleAddressSelect = (cityStateZip: string) => {
    setFormData((prev) => ({
      ...prev,
      addressLine3: cityStateZip,
    }));
  };

  // Validate form using Zod
  const validateForm = () => {
    try {
      signUpSchema.parse(formData);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof SignUpFormData, string>> = {};
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            const fieldName = issue.path[0] as keyof SignUpFormData;
            fieldErrors[fieldName] = issue.message;
          }
        });
        return fieldErrors;
      }
      return {};
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      e.preventDefault();
      setErrors(validationErrors);
      return;
    }

    // Combine all address fields into a single address string
    const addressParts = [
      formData.address,
      formData.addressLine2,
      formData.addressLine3,
    ].filter(Boolean); // Remove empty/undefined values

    const combinedAddress = addressParts.join(", ");

    // Update the form data to include the combined address
    const form = e.target as HTMLFormElement;
    const addressInput = form.querySelector(
      'input[name="address"]',
    ) as HTMLInputElement;
    if (addressInput) {
      addressInput.value = combinedAddress || "";
    }

    // Remove addressLine2, addressLine3, and confirmPassword from form submission by clearing their names
    const addressLine2Input = form.querySelector(
      'input[name="addressLine2"]',
    ) as HTMLInputElement;
    if (addressLine2Input) {
      addressLine2Input.name = ""; // Remove the name so it doesn't get submitted
    }

    const addressLine3Input = form.querySelector(
      'input[name="addressLine3"]',
    ) as HTMLInputElement;
    if (addressLine3Input) {
      addressLine3Input.name = ""; // Remove the name so it doesn't get submitted
    }

    const confirmPasswordInput = form.querySelector(
      'input[name="confirmPassword"]',
    ) as HTMLInputElement;
    if (confirmPasswordInput) {
      confirmPasswordInput.name = ""; // Remove the name so it doesn't get submitted
    }

    // If validation passes, allow form to submit normally
    setErrors({});
  };

  // Check if form is valid for button state
  const isFormValid = () => {
    const result = signUpSchema.safeParse(formData);
    return result.success;
  };

  // Get password validation status for visual feedback
  const getPasswordValidation = (password: string) => {
    return {
      isLongEnough: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
    };
  };

  const passwordValidation = getPasswordValidation(formData.password || "");

  return (
    <Card className="mx-auto max-w-lg min-w-lg shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-lg">Welcome To BVR ST CO</CardTitle>
        <CardDescription className="text-sm">
          Create your free BVR ST CO account, earn 100 points and 10% off your
          first purchase immediately!
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col-reverse gap-2">
        <div className="flex flex-row justify-evenly items-center">
          <SignInOAuthButton provider="google" className="w-full h-10">
            <div className="flex flex-row justify-between items-center w-full">
              <p className="text-sm pr-2">Google</p>
              <Image
                src="/google.svg"
                alt="Google Logo"
                width={24}
                height={24}
              />
            </div>
          </SignInOAuthButton>
          <SignInOAuthButton provider="facebook" className="w-full h-10">
            <div className="flex flex-row justify-between items-center w-full">
              <p className="text-sm pr-2">Facebook</p>
              <Image
                src="/facebook.svg"
                alt="Facebook Logo"
                width={24}
                height={24}
              />
            </div>
          </SignInOAuthButton>
          <SignInOAuthButton provider="discord" className="w-full h-10">
            <div className="flex flex-row justify-between items-center w-full">
              <p className="text-sm pr-2">Discord</p>
              <Image
                src="/discord.svg"
                alt="Discord Logo"
                width={24}
                height={24}
              />
            </div>
          </SignInOAuthButton>
        </div>
        <div className="flex flex-row justify-between items-center">
          <Separator className="my-4 flex-1" />
          <span className="mx-2 text-xs font-muted">OR CONTINUE WITH</span>
          <Separator className="my-4 flex-1" />
        </div>
        <Form action={formAction} onSubmit={handleSubmit} className="space-y-4">
          <input
            type="hidden"
            name="redirect"
            value={params.get("redirect") || ""}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                First Name
              </label>
              <Input
                type="text"
                name="firstName"
                placeholder="Coach"
                required
                value={formData.firstName || ""}
                onChange={handleInputChange}
                className={errors.firstName ? "bored-destructive" : ""}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Last Name
              </label>
              <Input
                type="text"
                name="lastName"
                placeholder="Bray"
                required
                value={formData.lastName || ""}
                onChange={handleInputChange}
                className={errors.lastName ? "bored-destructive" : ""}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

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
              placeholder="gobeavs@email.com"
              required
              value={formData.email || ""}
              onChange={handleInputChange}
              className={errors.email ? "bored-destructive" : ""}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Phone Number (Optional)
            </label>
            <Input
              type="tel"
              name="phone"
              placeholder="+1 (555) 123-4567"
              value={formData.phone || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="address"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Address (Optional)
            </label>
            <AddressAutofillInput
              name="address"
              value={formData.address || ""}
              onChangeAction={handleInputChange}
              onAddressSelect={handleAddressSelect}
              placeholder="660 SW 26th St"
              className={errors.address ? "bored-destructive" : ""}
            />
            {errors.address && (
              <p className="text-xs text-destructive">{errors.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="addressLine2"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Apartment, Suite, Unit (Optional)
            </label>
            <Input
              type="text"
              name="addressLine2"
              placeholder="Section 222"
              value={formData.addressLine2 || ""}
              onChange={handleInputChange}
              autoComplete="shipping address-line2"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="addressLine3"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              City, State, ZIP Code (Optional)
            </label>
            <Input
              type="text"
              name="addressLine3"
              placeholder="Corvallis, OR 97331"
              value={formData.addressLine3 || ""}
              onChange={handleInputChange}
              autoComplete="shipping address-level2"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Password
            </label>
            <Input
              type="password"
              name="password"
              required
              value={formData.password || ""}
              onChange={handleInputChange}
              className={errors.password ? "bored-destructive" : ""}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Confirm Password
            </label>
            <Input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword || ""}
              onChange={handleInputChange}
              className={errors.confirmPassword ? "bored-destructive" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Password requirements:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li
                className={
                  passwordValidation.isLongEnough ? "text-green-600" : ""
                }
              >
                At least 8 characters long
              </li>
              <li
                className={
                  passwordValidation.hasUpperCase &&
                  passwordValidation.hasLowerCase
                    ? "text-green-600"
                    : ""
                }
              >
                Contains uppercase and lowercase letters
              </li>
              <li
                className={passwordValidation.hasNumber ? "text-green-600" : ""}
              >
                Contains at least one number
              </li>
              <li
                className={
                  formData.password &&
                  formData.confirmPassword &&
                  formData.password === formData.confirmPassword
                    ? "text-green-600"
                    : ""
                }
              >
                Passwords match
              </li>
            </ul>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="termsAccepted"
              name="termsAccepted"
              className="mt-1"
              checked={formData.termsAccepted || false}
              onCheckedChange={(checked) =>
                handleCheckboxChange("termsAccepted", checked === true)
              }
            />
            <input
              type="hidden"
              name="termsAccepted"
              value={formData.termsAccepted ? "on" : ""}
            />
            <div className="flex flex-col">
              <label
                htmlFor="termsAccepted"
                className="text-xs leading-none text-muted-foreground cursor-pointer"
              >
                I agree to the{" "}
                <Link href="/legal/terms" target="_blank" className="underline">
                  Terms and Conditions
                </Link>
              </label>
              {errors.termsAccepted && (
                <p className="text-xs text-destructive mt-1">
                  {errors.termsAccepted}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center  space-x-3">
            <Checkbox
              id="optInMarketing"
              name="optInMarketing"
              className="mt-1"
              checked={formData.optInMarketing || false}
              onCheckedChange={(checked) =>
                handleCheckboxChange("optInMarketing", checked === true)
              }
            />
            <input
              type="hidden"
              name="optInMarketing"
              value={formData.optInMarketing ? "on" : ""}
            />
            <label
              htmlFor="optInMarketing"
              className="text-xs leading-none text-muted-foreground cursor-pointer"
            >
              I would like to receive marketing communications about the latest
              products and services offered by BVR ST CO.
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="optInRewards"
              name="optInRewards"
              className="mt-1"
              checked={formData.optInRewards || false}
              onCheckedChange={(checked) =>
                handleCheckboxChange("optInRewards", checked === true)
              }
            />
            <input
              type="hidden"
              name="optInRewards"
              value={formData.optInRewards ? "on" : ""}
            />
            <label
              htmlFor="optInRewards"
              className="text-xs leading-none text-muted-foreground cursor-pointer"
            >
              I would like to earn BVR ST CO rewards.
            </label>
          </div>

          <Button
            disabled={pending || !isFormValid()}
            type="submit"
            className="w-full group"
            id="signup-button"
            data-umami-event="Signup button"
          >
            {pending ? "Signing up..." : "Sign Up"}
            <ArrowRightIcon
              className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
              size={16}
              aria-hidden="true"
            />
          </Button>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-start justify-center gap-2">
        {message?.error && <ErrorMessage message={message.error} />}
        <div className="text-left text-xs">
          Already have an account?{" "}
          <Link href="/signin" className="underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
