"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordConfirmation() {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Check Your Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            We have sent a password reset link to your email address. Please
            check your inbox and follow the instructions to reset your password.
          </p>
          <div className="flex justify-center">
            <Link href="/login">
              <Button variant="outline">Back to Login</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
