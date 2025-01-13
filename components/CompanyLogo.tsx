import Image from "next/image";
import { useState } from "react";

interface CompanyLogoProps {
  companyName: string;
  logoUrl: string;
}

export const CompanyLogo = ({ companyName, logoUrl }: CompanyLogoProps) => {
  const [error, setError] = useState(false);

  return (
    <div className="w-16 h-16 relative">
      <Image
        src={error ? "/default-company-logo.png" : logoUrl}
        alt={`${companyName} logo`}
        width={100}
        height={100}
        className="rounded-lg object-contain"
        onError={() => setError(true)}
      />
    </div>
  );
};
