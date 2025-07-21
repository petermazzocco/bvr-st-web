import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LastPaymentInfo } from "@/lib/types";

export function AccountPaymentHistoryCard({
  paymentHistory,
}: {
  paymentHistory: LastPaymentInfo[];
}) {
  return (
    <Card className="mt-2 ">
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>Recent payment transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentHistory.map((payment, index) => (
              <TableRow key={index}>
                <TableCell>
                  {new Date(payment.paid_at).toLocaleDateString()}
                </TableCell>
                <TableCell>${payment.amount / 100} </TableCell>
                <TableCell>
                  <Badge variant={"outline"}>
                    {payment.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{payment.payment_method}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
