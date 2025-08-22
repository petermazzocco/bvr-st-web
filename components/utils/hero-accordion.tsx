import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight } from "lucide-react";

const AircraftSystemsAccordion = () => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white">
      <Accordion
        type="single"
        collapsible
        defaultValue="item-2"
        className="w-full"
      >
        <AccordionItem value="item-1" className="border-b border-gray-200">
          <AccordionTrigger className="py-6 px-6 text-left hover:no-underline hover:bg-gray-50 [&[data-state=open]>svg]:rotate-90">
            <span className="text-lg font-medium text-gray-900 tracking-wide">
              01 ENG OFF
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="pt-4">
              <p className="text-gray-600">
                Engine system content would go here.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border-b border-gray-200">
          <AccordionTrigger className="py-6 px-6 text-left hover:no-underline hover:bg-gray-50 [&[data-state=open]>svg]:rotate-90">
            <span className="text-lg font-medium text-gray-900 tracking-wide">
              02 APU OFF
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="pt-8 pb-6">
              {/* Aircraft diagram */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  {/* Main aircraft body */}
                  <svg
                    width="400"
                    height="200"
                    viewBox="0 0 400 200"
                    className="overflow-visible"
                  >
                    {/* Fuselage */}
                    <ellipse
                      cx="200"
                      cy="100"
                      rx="120"
                      ry="25"
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth="1.5"
                    />

                    {/* Nose */}
                    <path
                      d="M 80 100 Q 60 100 50 100"
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 50 90 Q 60 90 80 90"
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 50 110 Q 60 110 80 110"
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth="1.5"
                    />

                    {/* Wings */}
                    <line
                      x1="120"
                      y1="100"
                      x2="280"
                      y2="100"
                      stroke="#d1d5db"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="120"
                      y1="95"
                      x2="280"
                      y2="95"
                      stroke="#d1d5db"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="120"
                      y1="105"
                      x2="280"
                      y2="105"
                      stroke="#d1d5db"
                      strokeWidth="1.5"
                    />

                    {/* Engines */}
                    <circle
                      cx="140"
                      cy="100"
                      r="15"
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="260"
                      cy="100"
                      r="15"
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth="1.5"
                    />

                    {/* Tail */}
                    <line
                      x1="320"
                      y1="100"
                      x2="350"
                      y2="100"
                      stroke="#d1d5db"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="340"
                      y1="70"
                      x2="350"
                      y2="100"
                      stroke="#d1d5db"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="340"
                      y1="130"
                      x2="350"
                      y2="100"
                      stroke="#d1d5db"
                      strokeWidth="1.5"
                    />

                    {/* APU unit */}
                    <circle
                      cx="335"
                      cy="80"
                      r="8"
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="335"
                      cy="80"
                      r="4"
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />

                    {/* APU exhaust lines */}
                    <g stroke="#3b82f6" strokeWidth="2" opacity="0.7">
                      <line x1="325" y1="45" x2="325" y2="35" />
                      <line x1="325" y1="55" x2="325" y2="45" />
                      <line x1="325" y1="65" x2="325" y2="55" />

                      <line x1="335" y1="45" x2="335" y2="35" />
                      <line x1="335" y1="55" x2="335" y2="45" />
                      <line x1="335" y1="65" x2="335" y2="55" />

                      <line x1="345" y1="45" x2="345" y2="35" />
                      <line x1="345" y1="55" x2="345" y2="45" />
                      <line x1="345" y1="65" x2="345" y2="55" />
                    </g>

                    {/* Landing gear */}
                    <rect
                      x="155"
                      y="140"
                      width="8"
                      height="8"
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth="1"
                    />
                    <rect
                      x="195"
                      y="140"
                      width="8"
                      height="8"
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth="1"
                    />
                    <rect
                      x="235"
                      y="140"
                      width="8"
                      height="8"
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth="1"
                    />

                    {/* Landing gear struts */}
                    <line
                      x1="159"
                      y1="125"
                      x2="159"
                      y2="140"
                      stroke="#d1d5db"
                      strokeWidth="1"
                    />
                    <line
                      x1="199"
                      y1="125"
                      x2="199"
                      y2="140"
                      stroke="#d1d5db"
                      strokeWidth="1"
                    />
                    <line
                      x1="239"
                      y1="125"
                      x2="239"
                      y2="140"
                      stroke="#d1d5db"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              </div>

              {/* Status button */}
              <div className="flex justify-center mb-8">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full flex items-center space-x-2 text-sm font-medium transition-colors">
                  <span>WITHOUT</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Description */}
              <div className="text-gray-700 text-sm leading-relaxed max-w-lg mx-auto text-center">
                Even when stationary, aircraft continue to burn fuel through
                their auxiliary power units (APUs), generating noise and harmful
                emissions.
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AircraftSystemsAccordion;
