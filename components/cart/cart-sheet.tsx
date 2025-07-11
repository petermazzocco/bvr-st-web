"use client";

import { Price } from "@/components/product/product-price";
import { DEFAULT_OPTION } from "@/lib/constants";
import { createUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  createCartAndSetCookie,
  redirectToCheckout,
} from "@/server/cart/actions";
import { useCart } from "@/components/cart/cart-context";
import CloseCartButton from "@/components/cart/close-cart-button";
import { EditItemQuantityButton } from "@/components/cart/edit-item-quan-button";
import { OpenCartButton } from "@/components/cart/open-cart-button";
import { ShoppingCart } from "lucide-react";

export function CartSheet() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);

  const openCart = () => {
    setIsOpen(true);
  };

  const closeCart = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  return (
    <>
      {/* Move the trigger button OUTSIDE the Sheet component */}
      <Button
        aria-label="Open cart"
        onClick={(e) => {
          openCart();
        }}
        variant="ghost"
        className="px-2.5"
      >
        <OpenCartButton quantity={cart?.totalQuantity} />
      </Button>

      <Sheet
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
        }}
      >
        <SheetContent
          side="right"
          className="flex h-full w-full flex-col border-l border-neutral-200 bg-background p-6 text-foreground backdrop-blur-xl dark:border-neutral-700 dark:bg-black/80 dark:text-foreground md:w-[490px]"
        >
          <SheetHeader className="flex flex-row items-center justify-between"></SheetHeader>

          {!cart || cart.lines.length === 0 ? (
            <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
              <ShoppingCart className="h-16" />
              <p className="mt-6 text-center text-lg">Your cart is empty.</p>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-between overflow-hidden p-1">
              <ul className="flex-grow overflow-auto py-4">
                {cart.lines
                  .sort((a, b) =>
                    a.merchandise.product.title.localeCompare(
                      b.merchandise.product.title,
                    ),
                  )
                  .map((item, i) => {
                    const merchandiseSearchParams = {} as {
                      [key: string]: string;
                    };

                    item.merchandise.selectedOptions.forEach(
                      ({ name, value }) => {
                        if (value !== DEFAULT_OPTION) {
                          merchandiseSearchParams[name.toLowerCase()] = value;
                        }
                      },
                    );

                    const merchandiseUrl = createUrl(
                      `/product/${item.merchandise.product.handle}`,
                      new URLSearchParams(merchandiseSearchParams),
                    );

                    return (
                      <li
                        key={i}
                        className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                      >
                        <div className="relative flex w-full flex-col justify-between px-1 py-4">
                          <div className="flex flex-row">
                            <div className="relative h-44 w-44 overflow-hidden">
                              <Image
                                className="h-full w-full object-cover"
                                width={200}
                                height={200}
                                alt={
                                  item.merchandise.product.featuredImage
                                    .altText || item.merchandise.product.title
                                }
                                src={item.merchandise.product.featuredImage.url}
                              />
                            </div>
                            <Link
                              href={merchandiseUrl}
                              onClick={closeCart}
                              className="text-md z-30 ml-2 flex flex-row space-x-4"
                            >
                              <div className="flex flex-1 flex-col gap-2 text-base">
                                <span className="text-sm leading-tight">
                                  {item.merchandise.product.title}
                                </span>
                                {item.merchandise.title !== DEFAULT_OPTION ? (
                                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {item.merchandise.title}
                                  </p>
                                ) : null}
                              </div>
                            </Link>
                            <Price
                              className="flex justify-end space-y-2 text-right text-sm text-primary"
                              amount={item.cost.totalAmount.amount}
                              currencyCode={item.cost.totalAmount.currencyCode}
                            />
                          </div>
                          <div className="flex h-16 w-full flex-row items-center justify-between">
                            <div className="ml-auto flex h-9 flex-row items-center rounded-md">
                              <EditItemQuantityButton
                                item={item}
                                type="minus"
                                optimisticUpdate={updateCartItem}
                              />
                              <p className="w-6 text-center">
                                <span className="w-full text-sm">
                                  {item.quantity}
                                </span>
                              </p>
                              <EditItemQuantityButton
                                item={item}
                                type="plus"
                                optimisticUpdate={updateCartItem}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
              </ul>
              <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                  <p>Taxes</p>
                  <Price
                    className="text-right text-base text-foreground dark:text-foreground"
                    amount={cart.cost.totalTaxAmount.amount}
                    currencyCode={cart.cost.totalTaxAmount.currencyCode}
                  />
                </div>
                <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                  <p>Shipping</p>
                  <p className="text-right">Calculated at checkout</p>
                </div>
                <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                  <p>Total</p>
                  <Price
                    className="text-right text-base text-foreground dark:text-foreground"
                    amount={cart.cost.totalAmount.amount}
                    currencyCode={cart.cost.totalAmount.currencyCode}
                  />
                </div>
              </div>
              <form action={redirectToCheckout}>
                <CheckoutButton />
              </form>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      variant={"default"}
      className="w-full"
      type="submit"
      disabled={pending}
    >
      {pending ? "Adding To Cart..." : "Proceed to Checkout"}
    </Button>
  );
}
