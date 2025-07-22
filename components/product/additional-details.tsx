import { AdditionalDetails } from "@/lib/types";

export function AdditionalDetailsSection({
  details,
}: {
  details: AdditionalDetails;
}) {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Text Content */}
        <div className="space-y-8">
          {details.fabricDetails && details.fabricDetails.length > 0 && (
            <div>
              <div className="space-y-4">
                {details.fabricDetails.map((item, index) => (
                  <div key={index}>
                    <p className="text-foreground font-semibold">
                      {item.title}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Hero Image */}
        {details.additionalImages && details.additionalImages.length > 0 && (
          <div className="lg:sticky lg:top-8">
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

      {/* Additional Images Gallery */}
      {details.additionalImages && details.additionalImages.length > 1 && (
        <div className="mt-16">
          <div className="overflow-x-auto">
            <div
              className="flex gap-6 pb-4"
              style={{ minWidth: "fit-content" }}
            >
              {details.additionalImages.slice(1).map((image, index) => (
                <div
                  key={index + 1}
                  className="flex-shrink-0 w-full h-full overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt={`Additional view ${index + 2}`}
                    className="h-full w-full object-cover object-center"
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
