"use server";
import { TAGS } from "@/lib/constants";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
  applyDiscountCode,
  setCartAttribute,
} from "@/lib/shopify";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getUserDetails,
  getAuthTokenServer,
  getUserIdFromTokenServer,
} from "@/server/user/actions";
import { getAffiliates } from "@/server/sanity/actions";

// Member discount code configuration
const MEMBER_DISCOUNT_CODE =
  process.env.MEMBER_DISCOUNT_CODE || "1340709601393";

/**
 * Validates if an affiliate code is valid by checking against active affiliates
 * @param affiliateCode - The affiliate code to validate
 * @returns Promise<boolean> indicating if the code is valid
 */
async function validateAffiliateCode(
  affiliateCode: string | null | undefined,
): Promise<boolean> {
  if (!affiliateCode) {
    return false;
  }

  try {
    const affiliatesResult = await getAffiliates();

    if (!affiliatesResult.success || !affiliatesResult.data) {
      return false;
    }

    const affiliates = affiliatesResult.data;

    const validAffiliate = affiliates.find(
      (affiliate) =>
        affiliate.isActive &&
        affiliate.code.toString() === affiliateCode.toString(),
    );

    if (validAffiliate) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

/**
 * Checks if a customer is eligible for the member discount by querying the price rule
 * @param shopifyCustomerId - The customer's Shopify ID
 * @returns Promise<{isEligible: boolean, discountCode?: string}> indicating if the customer is eligible and the actual discount code to use
 */
async function isEligibleForMemberDiscount(
  shopifyCustomerId: string | null | undefined,
): Promise<{ isEligible: boolean; discountCode?: string }> {
  if (!shopifyCustomerId) {
    return { isEligible: false };
  }

  try {
    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN?.replace(/\/$/, ""); // Remove trailing slash

    // The MEMBER_DISCOUNT_CODE is actually the price rule ID from the Shopify admin URL
    const priceRuleId = MEMBER_DISCOUNT_CODE;
    const priceRuleUrl = `${shopifyDomain}/admin/api/2023-10/price_rules/${priceRuleId}.json`;

    // Get the price rule directly using the discount code as the price rule ID
    const priceRuleResponse = await fetch(priceRuleUrl, {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
        "Content-Type": "application/json",
      },
    });

    if (!priceRuleResponse.ok) {
      return { isEligible: false };
    }

    const priceRuleData = await priceRuleResponse.json();

    // Now let's get the actual discount codes for this price rule
    const discountCodesUrl = `${shopifyDomain}/admin/api/2023-10/price_rules/${priceRuleId}/discount_codes.json`;
    const discountCodesResponse = await fetch(discountCodesUrl, {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
        "Content-Type": "application/json",
      },
    });

    let actualDiscountCode = MEMBER_DISCOUNT_CODE; // fallback to price rule ID

    if (discountCodesResponse.ok) {
      const discountCodesData = await discountCodesResponse.json();

      // Use the first discount code if available
      if (
        discountCodesData.discount_codes &&
        discountCodesData.discount_codes.length > 0
      ) {
        actualDiscountCode = discountCodesData.discount_codes[0].code;
      }
    }

    const prerequisiteCustomerIds =
      priceRuleData.price_rule?.prerequisite_customer_ids || [];

    // Convert shopifyCustomerId to the format used in prerequisite_customer_ids (remove gid prefix if present)
    const cleanCustomerId = shopifyCustomerId.replace(
      "gid://shopify/Customer/",
      "",
    );

    // Convert to number since Shopify stores customer IDs as numbers in prerequisite_customer_ids
    const customerIdAsNumber = parseInt(cleanCustomerId, 10);

    const isEligible = prerequisiteCustomerIds.includes(customerIdAsNumber);

    return {
      isEligible,
      discountCode: isEligible ? actualDiscountCode : undefined,
    };
  } catch (error) {
    return { isEligible: false };
  }
}

/**
 * Adds an item to the user's shopping cart
 * @param prevState - Previous state from form action (unused but required for Next.js form actions)
 * @param selectedVariantId - The variant ID of the product to add to cart
 * @returns Error message string if operation fails, undefined if successful
 */
export async function addItem(prevState: any, formData: FormData) {
  const selectedVariantId = formData.get("selectedVariantId") as
    | string
    | undefined;
  const affiliate = formData.get("affiliate") as string | null;

  let cartId = (await cookies()).get("cartId")?.value;
  if (!cartId || !selectedVariantId) {
    return "Error adding item to cart";
  }
  try {
    await addToCart(cartId, [
      { merchandiseId: selectedVariantId, quantity: 1 },
    ]);

    // Set affiliate metafield if affiliate is provided and valid
    if (affiliate) {
      const isValidAffiliate = await validateAffiliateCode(affiliate);

      if (isValidAffiliate) {
        try {
          await setCartAttribute(cartId, affiliate);
        } catch (attributeError) {}
      } else {
      }
    } else {
    }

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
          address: user.address
            ? {
                ...user.address,
                country: "US", // Default to US since user address doesn't include country
              }
            : undefined,
        });

        if (updatedCart) {
          cart = updatedCart;
        }

        // Check if user is a member and eligible for member discount

        if (user.isMember && user.shopifyCustomerID) {
          const eligibilityResult = await isEligibleForMemberDiscount(
            user.shopifyCustomerID,
          );

          if (eligibilityResult.isEligible && eligibilityResult.discountCode) {
            try {
              const cartWithDiscount = await applyDiscountCode(cartId, [
                eligibilityResult.discountCode,
              ]);
              if (cartWithDiscount) {
                cart = cartWithDiscount;
              }
            } catch (error) {
              // Continue with checkout even if discount application fails
            }
          }
        }
      }
    } catch (error) {
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
