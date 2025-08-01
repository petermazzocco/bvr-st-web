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

interface UpdateUserModalProps {
  user: UpdateUser | undefined;
}

export function UpdateUserModal({ user }: UpdateUserModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-fit">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update User Details</DialogTitle>
          <DialogDescription>
            Make changes to your profile information here. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form action={updateUserDetails}>
          <div className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">
                  First Name
                </label>
                <div className="col-span-3">
                  <Input
                    name="firstName"
                    defaultValue={user?.firstName || ""}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">
                  Last Name
                </label>
                <div className="col-span-3">
                  <Input
                    name="lastName"
                    defaultValue={user?.lastName || ""}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Email</label>
                <div className="col-span-3">
                  <Input
                    type="email"
                    name="email"
                    defaultValue={user?.email || ""}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Phone</label>
                <div className="col-span-3">
                  <Input name="phone" defaultValue={user?.phone || ""} />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">
                  Address
                </label>
                <div className="col-span-3">
                  <Input
                    name="address"
                    defaultValue={user?.address || ""}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <label className="text-right text-sm font-medium">
                  Marketing Emails
                </label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox
                    name="optInMarketing"
                    defaultChecked={user?.optInMarketing || false}
                  />
                  <span className="text-sm text-muted-foreground">
                    Receive promotional emails and updates
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <label className="text-right text-sm font-medium">
                  Rewards Program
                </label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox
                    name="optInRewards"
                    defaultChecked={user?.optInRewards || false}
                  />
                  <span className="text-sm text-muted-foreground">
                    Receive rewards and exclusive offers
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                id="update-user-button"
                data-umami-event="Update user button"
              >
                Save changes
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
