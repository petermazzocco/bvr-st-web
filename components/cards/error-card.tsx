import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowLeft, Home } from "lucide-react";

type Error = {
  status: number;
  message: string;
  details?: string;
};

export function ErrorCard({ error }: { error: Error }) {
  return (
    <Card className="w-full max-w-md text-center shadow-none border-none">
      <CardHeader className="pb-4">
        <span className="text-3xl font-bold text-destructive">
          {error.status}
        </span>
        <h1 className="text-2xl font-bold text-muted-foreground">
          {error.message}
        </h1>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="space-y-3">
          <p className="text-muted-foreground mt-2">
            {error.details ||
              "Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL."}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-4">
        <Button className="w-full" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={() => (window.location.href = "/")}
        >
          <Home className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </CardFooter>
    </Card>
  );
}
