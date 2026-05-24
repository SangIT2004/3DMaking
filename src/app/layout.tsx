import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
  title: "3D Room Studio",
  description: "Web-based 3D room editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans", inter.variable)}>
      <body>
        {children}
        <Toaster theme="dark" richColors position="bottom-right" duration={3000} />
      </body>
    </html>
  );
}
