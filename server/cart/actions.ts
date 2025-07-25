"use server";
import { TAGS } from "@/lib/constants";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "@/lib/shopify";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserDetails, getAuthTokenServer, getUserIdFromTokenServer } from "@/server/user/actions";

/**
 * Adds an item to the user's shopping cart
 * @param prevState - Previous state from form action (unused but required for Next.js form actions)
 * @param selectedVariantId - The variant ID of the product to add to cart
 * @returns Error message string if operation fails, undefined if successful
 */
export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined,
) {
  let cartId = (await cookies()).get("cartId")?.value;
  if (!cartId || !selectedVariantId) {
    return "Error adding item to cart";
  }
  try {
    await addToCart(cartId, [
      { merchandiseId: selectedVariantId, quantity: 1 },
    ]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return "Error adding item to cart";
  }
}

/**
 * Removes an item completely from the user's shopping cart
 * @param prevState - Previous state from form action (unused but required for Next.js form actions)
 * @param merchandiseId - The merchandise ID of the item to remove from cart
 * @returns Error message string if operation fails, undefined if successful
 */
export async function removeItem(prevState: any, merchandiseId: string) {
  let cartId = (await cookies()).get("cartId")?.value;
  if (!cartId) {
    return "Missing cart ID";
  }
  try {
    const cart = await getCart(cartId);
    if (!cart) {
      return "Error fetching cart";
    }
    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );
    if (lineItem && lineItem.id) {
      await removeFromCart(cartId, [lineItem.id]);
      revalidateTag(TAGS.cart);
    } else {
      return "Item not found in cart";
    }
  } catch (e) {
    return "Error removing item from cart";
  }
}

/**
 * Updates the quantity of an item in the user's shopping cart
 * Will add the item if it doesn't exist and quantity > 0
 * Will remove the item if quantity is set to 0
 * @param prevState - Previous state from form action (unused but required for Next.js form actions)
 * @param payload - Object containing merchandiseId and new quantity
 * @param payload.merchandiseId - The merchandise ID of the item to update
 * @param payload.quantity - The new quantity (0 will remove the item)
 * @returns Error message string if operation fails, undefined if successful
 */
export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  },
) {
  let cartId = (await cookies()).get("cartId")?.value;
  if (!cartId) {
    return "Missing cart ID";
  }
  const { merchandiseId, quantity } = payload;
  try {
    const cart = await getCart(cartId);
    if (!cart) {
      return "Error fetching cart";
    }
    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );
    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart(cartId, [lineItem.id]);
      } else {
        await updateCart(cartId, [
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart(cartId, [{ merchandiseId, quantity }]);
    }
    revalidateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return "Error updating item quantity";
  }
}

/**
 * Redirects the user to the checkout page for their current cart
 * Automatically prepopulates user data if authenticated
 * Redirects to home page if no cart exists or cart is invalid
 * @returns Next.js redirect response to checkout URL or home page
 */
export async function redirectToCheckout() {
  let cartId = (await cookies()).get("cartId")?.value;
  if (!cartId) {
    return redirect("/");
  }
  
  let cart = await getCart(cartId);
  if (!cart) {
    return redirect("/");
  }

  // Try to get authenticated user data
  const authToken = await getAuthTokenServer();
  const userId = await getUserIdFromTokenServer();
  
  if (authToken && userId) {
    try {
      const userResult = await getUserDetails(authToken, userId);
      if (userResult.success && userResult.data) {
        const user = userResult.data;
        
        // Update cart with buyer identity for checkout prepopulation
        const updatedCart = await updateCart(cartId, [], {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          address: user.address ? {
            ...user.address,
            country: "US" // Default to US since user address doesn't include country
          } : undefined
        });
        
        if (updatedCart) {
          cart = updatedCart;
        }
      }
    } catch (error) {
      console.error("Error prepopulating user data for checkout:", error);
      // Continue with checkout even if user data prepopulation fails
    }
  }
  
  redirect(cart.checkoutUrl);
}

/**
 * Creates a new shopping cart and stores the cart ID in cookies
 * Used when a user doesn't have an existing cart
 * @returns Promise that resolves when cart is created and cookie is set
 */
export async function createCartAndSetCookie() {
  let cart = await createCart();
  (await cookies()).set("cartId", cart.id!);
}
