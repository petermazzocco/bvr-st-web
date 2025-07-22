import { AdditionalDetails } from "@/lib/types";
import { Separator } from "../ui/separator";

export function AdditionalDetailsSection({
  details,
}: {
  details: AdditionalDetails;
}) {
  return (
    <div className="mx-auto max-w-screen">
      <Separator />
      <div className="flex flex-col-reverse md:flex-row justify-between  items-center">
        {/* Left Column - Text Content */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2">
          {details.fabricDetails && details.fabricDetails.length > 0 && (
            <div className="space-y-10">
              {details.fabricDetails.map((item, index) => (
                <div key={index}>
                  <p className="text-foreground text-lg font-semibold">
                    {item.title}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Hero Image */}
        {details.additionalImages && details.additionalImages.length > 0 && (
          <div className="lg:sticky lg:top-8 w-full md:w-1/2">
            <div className="aspect-[4/5] overflow-hidden bg-background">
              <img
                src={details.additionalImages[0].url}
                alt="Product hero image"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        )}
      </div>
      <Separator />
      {/* Additional Images Gallery */}
      {details.additionalImages && details.additionalImages.length > 1 && (
        <div className="">
          <div className="overflow-x-auto">
            <div className="flex" style={{ minWidth: "fit-content" }}>
              {details.additionalImages.slice(1).map((image, index) => (
                <div
                  key={index + 1}
                  className="flex-shrink-0 w-2/4 h-full overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt={`Additional view ${index + 2}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
