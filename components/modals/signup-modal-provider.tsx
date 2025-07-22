"use client";

import { useState, useEffect } from "react";
import { SignupModal } from "./signup-modal";

interface SignupModalProviderProps {
  shouldShow: boolean;
}

export function SignupModalProvider({ shouldShow }: SignupModalProviderProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (shouldShow) {
      // Sleep for 2 seconds before showing modal
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [shouldShow]);

  if (!shouldShow) {
    return null;
  }

  return <SignupModal open={showModal} onOpenChange={setShowModal} />;
}