"use client";

import { useState } from "react";
import { z } from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import { UpdateUser } from "@/lib/types";
import { updateUserDetails } from "@/server/user/actions";
import { Edit } from "lucide-react";
import Form from "next/form";
import { useActionState } from "react";
import { AddressAutofillInput } from "../utils/address-autofill-input";

// Zod validation schema
const updateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  addressLine2: z.string().optional(),
  addressLine3: z.string().optional(),
  optInMarketing: z.boolean().optional(),
  optInRewards: z.boolean().optional(),
});

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

interface UpdateUserModalProps {
  user: UpdateUser | undefined;
}

export function UpdateUserModal({ user }: UpdateUserModalProps) {
  const [message, formAction, pending] = useActionState(
    updateUserDetails,
    null,
  );
  const [formData, setFormData] = useState<Partial<UpdateUserFormData>>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    addressLine2: "",
    addressLine3: "",
    optInMarketing: user?.optInMarketing || false,
    optInRewards: user?.optInRewards || false,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof UpdateUserFormData, string>>
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
    if (errors[name as keyof UpdateUserFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle checkbox changes specifically for shadcn/ui Checkbox component
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));

    // Clear error for this field when user interacts
    if (errors[name as keyof UpdateUserFormData]) {
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
      updateUserSchema.parse(formData);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof UpdateUserFormData, string>> =
          {};
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            const fieldName = issue.path[0] as keyof UpdateUserFormData;
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

    // Remove addressLine2 and addressLine3 from form submission by clearing their names
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

    // If validation passes, allow form to submit normally
    setErrors({});
  };

  // Check if form is valid for button state
  const isFormValid = () => {
    const result = updateUserSchema.safeParse(formData);
    return result.success;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-fit">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Update User Details</DialogTitle>
          <DialogDescription>
            Make changes to your profile information here. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form action={formAction} onSubmit={handleSubmit}>
          <div className="space-y-4 w-full">
            <div className="grid gap-4 py-4 items-start justify-between">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-left text-sm font-medium">
                  First Name
                </label>
                <div className="col-span-3 space-y-1">
                  <Input
                    name="firstName"
                    value={formData.firstName || ""}
                    onChange={handleInputChange}
                    className={errors.firstName ? "border-destructive" : ""}
                    required
                  />
                  {errors.firstName && (
                    <p className="text-xs text-destructive">
                      {errors.firstName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-left text-sm font-medium">
                  Last Name
                </label>
                <div className="col-span-3 space-y-1">
                  <Input
                    name="lastName"
                    value={formData.lastName || ""}
                    onChange={handleInputChange}
                    className={errors.lastName ? "border-destructive" : ""}
                    required
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-left text-sm font-medium">Email</label>
                <div className="col-span-3 space-y-1">
                  <Input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className={errors.email ? "border-destructive" : ""}
                    required
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-left text-sm font-medium">Phone</label>
                <div className="col-span-3 space-y-1">
                  <Input
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-left text-sm font-medium">Address</label>
                <div className="col-span-3 space-y-1">
                  <AddressAutofillInput
                    name="address"
                    value={formData.address || ""}
                    onChangeAction={handleInputChange}
                    onAddressSelect={handleAddressSelect}
                    placeholder="123 Main St"
                    className={errors.address ? "border-destructive" : ""}
                  />
                  {errors.address && (
                    <p className="text-xs text-destructive">{errors.address}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-left text-sm font-medium">
                  Apt/Suite
                </label>
                <div className="col-span-3 space-y-1">
                  <Input
                    name="addressLine2"
                    value={formData.addressLine2 || ""}
                    onChange={handleInputChange}
                    placeholder="Apt 4B, Suite 200, Unit 5"
                    autoComplete="shipping address-line2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-left text-sm font-medium">
                  City/State/ZIP
                </label>
                <div className="col-span-3 space-y-1">
                  <Input
                    name="addressLine3"
                    value={formData.addressLine3 || ""}
                    onChange={handleInputChange}
                    placeholder="Beaverton, OR 97008"
                    autoComplete="shipping address-level2"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-left text-sm font-medium">
                  Marketing Emails
                </label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox
                    name="optInMarketing"
                    checked={formData.optInMarketing || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("optInMarketing", checked as boolean)
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    Receive promotional emails and updates
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-left text-sm font-medium">
                  Rewards Program
                </label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox
                    name="optInRewards"
                    checked={formData.optInRewards || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("optInRewards", checked as boolean)
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    Receive rewards and exclusive offers
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-col gap-2">
              {message?.error && (
                <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {message.error}
                </div>
              )}
              <Button
                disabled={pending || !isFormValid()}
                type="submit"
                id="update-user-button"
                data-umami-event="Update user button"
              >
                {pending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
