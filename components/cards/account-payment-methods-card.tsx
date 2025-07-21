"use client";

import { CreditCard, ExternalLinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { PaymentMethodInfo } from "@/lib/types";

export function AccountPaymentMethodsCard({
  paymentMethods,
}: {
  paymentMethods: PaymentMethodInfo[];
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditPaymentMethods = () => {
    setIsEditing(true);
    // Add logic to open payment methods editor
    setTimeout(() => setIsEditing(false), 2000); // Simulate loading
  };
  if (!paymentMethods || paymentMethods.length === 0) {
    return null;
  }

  return (
    <div className="flex-1 w-full">
      <Card className="h-44">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods && paymentMethods.length > 0 ? (
            <>
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between  rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8  rounded flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {method.card?.brand.toUpperCase() ||
                          method.type.toUpperCase()}{" "}
                        ending in {method.card?.last4 || method.bank?.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {method.card
                          ? `Expires ${method.card.exp_month}/${method.card.exp_year}`
                          : method.bank?.account_type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.is_default && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditPaymentMethods}
                      disabled={isEditing}
                    >
                      {isEditing ? "Loading..." : "Edit"}{" "}
                      <ExternalLinkIcon className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No payment methods on file
              </p>
              <Button variant="outline" size="sm">
                Add New Card
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
