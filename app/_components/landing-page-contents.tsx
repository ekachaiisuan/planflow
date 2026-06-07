'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

const LandingPageContent = () => {
  return (
    <div className="flex flex-col justify-between items-center min-h-screen">
      This Landing Page No count exists.
      <Link href="/login">
        <Button>Login</Button>
      </Link>
    </div>
  );
};

export default LandingPageContent;
