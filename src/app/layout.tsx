import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "medZK",
  description: "-Powered by Circom and AI",
  openGraph: {
    images: [
      {
        url: "https://i.postimg.cc/NffF6Sm0/Gemini-scaled.webp",
        width: 1000,
        height: 600,
      },
    ],
  },
  icons: {
    icon: "./favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head/>
      
      <body className={inter.className}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        {children}
        </ThemeProvider>
        </body>
    </html>
  );
}