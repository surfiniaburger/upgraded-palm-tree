import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";

export function HomePage() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 bg-background text-foreground">
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-primary to-primary/70 text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        MedZK, <br /> Secure Healthcare, Smarter Care
      </h2>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-muted-foreground text-center">
        Access cutting-edge healthcare solutions with medZK—secure medical record verification, AI-driven insights, and privacy-first patient care, all at your fingertips.
      </p>
    </BackgroundLines>
  );
}