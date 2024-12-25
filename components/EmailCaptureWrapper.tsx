"use client";

import { useEffect, useState } from "react";
import { EmailCapture } from "./EmailCapture";
import { usePathname } from "next/navigation";

export function EmailCaptureWrapper() {
  const [shouldShow, setShouldShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage for subscription status
    const checkSubscriptionStatus = () => {
      const hasSubscribed = localStorage.getItem("hasSubscribed");
      const lastShown = localStorage.getItem("lastPopupShown");
      const lastSubmission = localStorage.getItem("lastSubmissionDate");
      const now = new Date().getTime();

      // If user has subscribed, never show again
      if (hasSubscribed === "true") {
        return false;
      }

      // Don't show on excluded paths
      const excludedPaths = [
        "/login",
        "/signup",
        "/checkout",
        "/api",
        "/admin",
        "/settings",
      ];
      if (excludedPaths.some((path) => pathname.startsWith(path))) {
        return false;
      }

      // If user submitted form recently (within 30 days), don't show
      if (lastSubmission) {
        const daysSinceSubmission =
          (now - parseInt(lastSubmission)) / (1000 * 60 * 60 * 24);
        if (daysSinceSubmission < 30) {
          return false;
        }
      }

      // If popup was shown recently (within 3 days), don't show
      if (lastShown) {
        const daysSinceLastShown =
          (now - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
        if (daysSinceLastShown < 3) {
          return false;
        }
      }

      return true;
    };

    // Only set up timer if we should show the popup
    if (checkSubscriptionStatus()) {
      const timer = setTimeout(() => {
        setShouldShow(true);
        localStorage.setItem("lastPopupShown", new Date().getTime().toString());
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleSubscribe = () => {
    // Mark as subscribed
    localStorage.setItem("hasSubscribed", "true");
    // Record submission date
    localStorage.setItem("lastSubmissionDate", new Date().getTime().toString());
    setShouldShow(false);
  };

  const handleClose = () => {
    // Record when user dismissed the popup
    localStorage.setItem("lastPopupShown", new Date().getTime().toString());
    setShouldShow(false);
  };

  if (!shouldShow) return null;
  return <EmailCapture onSubscribe={handleSubscribe} onClose={handleClose} />;
}
