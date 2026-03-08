import type { Metadata } from "next";
import { Funnel_Display } from "next/font/google";
import "./globals.css";
import { ReactQueryClientProvider } from "@/hooks/react-query-client-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo App",
  description: "Digital Task Manager to improve your productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${funnelDisplay.className} antialiased`}>
        <ReactQueryClientProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
