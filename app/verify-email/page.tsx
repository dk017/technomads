"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/app/utils/supabaseClient";

export default function VerifyEmail() {
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkVerification = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        setIsVerified(true);
        setTimeout(() => router.push("/"), 3000); // Redirect after 3 seconds
      }
    };

    const interval = setInterval(checkVerification, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Verify Your Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isVerified ? (
            <p className="text-center">
              Your email has been verified! You will be redirected to the
              homepage shortly.
            </p>
          ) : (
            <>
              <p className="text-center mb-4">
                Please check your email and click the verification link to
                complete your signup.
              </p>
              <Button onClick={() => router.push("/")} className="w-full">
                Return to Homepage
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
