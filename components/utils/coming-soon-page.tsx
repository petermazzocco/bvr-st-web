import { CountdownTimer } from "./countdown-timer";
import { addToNewsletter } from "@/server/user/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Form from "next/form";

interface ComingSoonPageProps {
  searchParams?: {
    newsletter?: string;
  };
}

export function ComingSoonPage({ searchParams }: ComingSoonPageProps = {}) {
  const isSubmitted = searchParams?.newsletter === "true";

  return (
    <>
      <nav className="fixed top-0 z-50 bg-transparent text-background grid grid-cols-3 items-center p-2 w-full mix-blend-difference">
        <div className="flex items-center"></div>
        <div className="flex items-center justify-center">
          <span className="text-lg font-bold">BVR ST CO.</span>
        </div>
        <div className="flex items-center justify-end gap-4"></div>
      </nav>
      <div className="h-screen bg-[url('https://cloudfront-us-east-1.images.arcpublishing.com/advancelocal/IUVSISAT7FGOLD7NFU6X22GVZQ.jpg')] bg-cover bg-center bg-no-repeat flex items-end justify-center pb-[10vh]">
        <div className="z-10 gap-4 flex flex-col text-center items-center text-background max-w-md mx-auto px-4">
          <h2 className="text-lg font-base tracking-wider">Coming Soon</h2>
          <h1 className="text-3xl font-bold tracking-wider">BVR ST CO</h1>
          <CountdownTimer />

          {isSubmitted ? (
            <div className="bg-background text-foreground rounded-md p-4">
              <p className="font-semibold">Thanks for signing up!</p>
              <p className="text-muted-foreground text-sm">
                We&apos;ll notify you when we launch.
              </p>
            </div>
          ) : (
            <Dialog>
              <DialogTrigger asChild className="  cursor-pointer">
                <Button variant="outline" className="w-full">
                  NOTIFY ME
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-md">
                <DialogHeader>
                  <DialogTitle>Ready for a new experience?</DialogTitle>
                  <DialogDescription>
                    Get notified when we launch
                  </DialogDescription>
                </DialogHeader>
                <Form action={addToNewsletter} className="space-y-3">
                  <Input
                    type="text"
                    name="fullName"
                    className="text-foreground"
                    placeholder="Enter your full name"
                    required
                  />
                  <Input
                    type="email"
                    name="email"
                    className="text-foreground"
                    placeholder="Enter your email"
                    required
                  />
                  <Button type="submit" className="w-full">
                    Get Notified
                  </Button>
                </Form>
                <DialogFooter>
                  <p className="text-[0.5rem] text-muted-foreground">
                    By subscribing, you agree to allow us to send you emails
                    about new products, promotions, and updates up to the date
                    and time of launch.
                  </p>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </>
  );
}
