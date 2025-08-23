"use server";

/**
 * Contact form submission
 * @param formData - FormData containing name, email, subject, and message
 * @returns Promise that returns JSON string with success message or error
 */
export async function contactSubmission(initialState: any, formData: FormData) {
  try {
    const requestData = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/contact`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      },
    );

    const responseText = await response.text();

    if (!response.ok) {
      console.error(
        "Contact submission failed:",
        response.status,
        responseText,
      );

      if (response.status === 400) {
        return JSON.stringify({
          message: "Please provide all required information with valid formats",
          success: false,
        });
      }

      if (response.status >= 500) {
        return JSON.stringify({
          message: "Server error. Please try again later.",
          success: false,
        });
      }

      return JSON.stringify({
        message: "Contact submission failed. Please try again.",
        success: false,
      });
    }

    // Parse the JSON response from the Go API
    let body: { message: string; success: boolean };
    try {
      body = JSON.parse(responseText);
      return responseText; // Return the original JSON response
    } catch (error) {
      console.error("Invalid JSON response:", responseText);
      return JSON.stringify({
        message: "Invalid response from server. Please try again.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Contact submission error:", error);
    return JSON.stringify({
      message: "Network error. Please check your connection and try again.",
      success: false,
    });
  }
}

/**
 * Add a user to the newsletter using server action pattern
 * @param formData - FormData containing email and fullName
 * @returns Promise that redirects with success message or throws error on failure
 */
export async function addToNewsletter(initialState: any, formData: FormData) {
  try {
    const requestData = {
      email: formData.get("email"),
      fullName: formData.get("fullName"),
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/newsletter`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      },
    );
    const responseText = await response.text();
    if (!response.ok) {
      console.error(
        "Newsletter subscription failed:",
        response.status,
        responseText,
      );
      if (response.status === 400) {
        return JSON.stringify({
          message: "Please provide all required information with valid formats",
          success: false,
        });
      }
      if (response.status >= 500) {
        return JSON.stringify({
          message: "Server error. Please try again later.",
          success: false,
        });
      }
      return JSON.stringify({
        message: "Newsletter subscription failed. Please try again.",
        success: false,
      });
    }
    // Parse the JSON response from the Go API
    let body: { message: string; success: boolean };
    try {
      body = JSON.parse(responseText);
      return responseText; // Return the original JSON response
    } catch (error) {
      console.error("Invalid JSON response:", responseText);
      return JSON.stringify({
        message: "Invalid response from server. Please try again.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return JSON.stringify({
      message: "Network error. Please check your connection and try again.",
      success: false,
    });
  }
}
