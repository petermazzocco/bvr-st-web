"use client";
import dynamic from "next/dynamic";
import { Input } from "../ui/input";

// Dynamically import AddressAutofill with SSR disabled
const AddressAutofillComponent = dynamic(
  () =>
    import("@mapbox/search-js-react").then((mod) => ({
      default: mod.AddressAutofill as React.ComponentType<any>,
    })),
  { ssr: false },
);

interface AddressAutofillInputProps {
  name: string;
  value: string;
  onChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddressSelect?: (addressLine3: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function AddressAutofillInput({
  name,
  value,
  onChangeAction,
  onAddressSelect,
  placeholder = "123 Main St",
  required = false,
  className = "",
}: AddressAutofillInputProps) {
  const handleRetrieve = (result: any) => {
    if (result && result.features && result.features[0]) {
      const feature = result.features[0];
      const context = feature.context || [];
      
      // Extract street address (without city, state, zip)
      const streetAddress = feature.text || feature.place_name?.split(',')[0] || "";
      
      // Extract city, state, zip from context
      const city = context.find((c: any) => c.id?.includes('place'))?.text || "";
      const state = context.find((c: any) => c.id?.includes('region'))?.short_code?.replace('US-', '') || "";
      const postcode = context.find((c: any) => c.id?.includes('postcode'))?.text || "";
      
      // Build city, state, zip string
      const cityStateZip = [city, state, postcode].filter(Boolean).join(", ");

      // Create a synthetic event for the street address
      const syntheticEvent = {
        target: {
          name,
          value: streetAddress,
          type: "text",
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChangeAction(syntheticEvent);
      
      // Call the callback with city, state, zip if provided
      if (onAddressSelect && cityStateZip) {
        onAddressSelect(cityStateZip);
      }
    }
  };

  return (
    <div className="relative">
      <AddressAutofillComponent
        accessToken={process.env.NEXT_PUBLIC_MAP_ACCESS_TOKEN}
        onRetrieve={handleRetrieve}
        options={{
          // Set high z-index for dropdown to appear above modals
          zIndex: 9999
        }}
      >
        <Input
          type="text"
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChangeAction}
          className={className}
          autoComplete="shipping address-line1"
        />
      </AddressAutofillComponent>
    </div>
  );
}
