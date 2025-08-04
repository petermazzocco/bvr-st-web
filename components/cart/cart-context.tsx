"use client";

import type {
  Cart,
  CartItem,
  Product,
  ProductVariant,
} from "@/lib/shopify/types";
import React, {
  createContext,
  use,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useOptimistic,
  startTransition,
} from "react";

type UpdateType = "plus" | "minus" | "delete";

type CartAction =
  | {
      type: "UPDATE_ITEM";
      payload: { merchandiseId: string; updateType: UpdateType };
    }
  | {
      type: "ADD_ITEM";
      payload: { variant: ProductVariant; product: Product };
    }
  | {
      type: "CLEAR_CART";
    };

type CartContextType = {
  cart: Cart | undefined;
  updateCartItem: (merchandiseId: string, updateType: UpdateType) => void;
  addCartItem: (variant: ProductVariant, product: Product) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

function updateCartItem(
  item: CartItem,
  updateType: UpdateType,
): CartItem | null {
  if (updateType === "delete") return null;

  const newQuantity =
    updateType === "plus" ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;

  const singleItemAmount = Number(item.cost.totalAmount.amount) / item.quantity;
  const newTotalAmount = calculateItemCost(
    newQuantity,
    singleItemAmount.toString(),
  );

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      ...item.cost,
      totalAmount: {
        ...item.cost.totalAmount,
        amount: newTotalAmount,
      },
    },
  };
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product,
): CartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const totalAmount = calculateItemCost(quantity, variant.price.amount);

  return {
    id: existingItem?.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
      },
    },
  };
}

function updateCartTotals(
  lines: CartItem[],
): Pick<Cart, "totalQuantity" | "cost"> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0,
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "USD";

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

function createEmptyCart(): Cart {
  return {
    id: undefined,
    checkoutUrl: "",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0", currencyCode: "USD" },
      totalAmount: { amount: "0", currencyCode: "USD" },
      totalTaxAmount: { amount: "0", currencyCode: "USD" },
    },
  };
}

function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case "UPDATE_ITEM": {
      const { merchandiseId, updateType } = action.payload;
      const updatedLines = currentCart.lines
        .map((item) =>
          item.merchandise.id === merchandiseId
            ? updateCartItem(item, updateType)
            : item,
        )
        .filter(Boolean) as CartItem[];

      if (updatedLines.length === 0) {
        return {
          ...currentCart,
          lines: [],
          totalQuantity: 0,
          cost: {
            ...currentCart.cost,
            totalAmount: { ...currentCart.cost.totalAmount, amount: "0" },
          },
        };
      }

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    case "ADD_ITEM": {
      const { variant, product } = action.payload;
      const existingItem = currentCart.lines.find(
        (item) => item.merchandise.id === variant.id,
      );
      const updatedItem = createOrUpdateCartItem(
        existingItem,
        variant,
        product,
      );

      const updatedLines = existingItem
        ? currentCart.lines.map((item) =>
            item.merchandise.id === variant.id ? updatedItem : item,
          )
        : [...currentCart.lines, updatedItem];

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    case "CLEAR_CART": {
      return createEmptyCart();
    }
    default:
      return currentCart;
  }
}

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  const initialCart = use(cartPromise);
  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    initialCart,
    cartReducer,
  );

  // UpPromote cart tracking - send updates whenever cart changes
  useEffect(() => {
    if (optimisticCart && typeof window !== "undefined") {
      // Type-safe access to upTag function
      const upTag = (window as any).upTag;

      if (upTag && typeof upTag === "function") {
        // Only send tracking if cart has items or a valid ID
        if (optimisticCart.id || optimisticCart.totalQuantity > 0) {
          upTag("event", "cart_updated", {
            id: optimisticCart.id,
            checkoutUrl: optimisticCart.checkoutUrl,
            totalQuantity: optimisticCart.totalQuantity,
            cost: {
              totalAmount: {
                amount: optimisticCart.cost.totalAmount.amount,
                currencyCode: optimisticCart.cost.totalAmount.currencyCode,
              },
            },
            lines: optimisticCart.lines.map((line) => ({
              id: line.id,
              quantity: line.quantity,
              merchandise: {
                id: line.merchandise.id,
                product: {
                  id: line.merchandise.product.id,
                  handle: line.merchandise.product.handle,
                  title: line.merchandise.product.title,
                },
              },
            })),
          });
        }
      }
    }
  }, [optimisticCart]);

  const updateCartItem = useCallback(
    (merchandiseId: string, updateType: UpdateType) => {
      updateOptimisticCart({
        type: "UPDATE_ITEM",
        payload: { merchandiseId, updateType },
      });
    },
    [updateOptimisticCart],
  );

  const addCartItem = useCallback(
    (variant: ProductVariant, product: Product) => {
      updateOptimisticCart({ type: "ADD_ITEM", payload: { variant, product } });
    },
    [updateOptimisticCart],
  );

  const clearCart = useCallback(() => {
    updateOptimisticCart({ type: "CLEAR_CART" });
  }, [updateOptimisticCart]);

  const value = useMemo(
    () => ({
      cart: optimisticCart,
      updateCartItem,
      addCartItem,
      clearCart,
    }),
    [optimisticCart, updateCartItem, addCartItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
