import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/providers/ThemeProvider";
import { PHProvider } from "@/lib/providers/PHProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Your Online Therapy Chats",
  description:
    "Get personalized mental health support from our AI therapy chatbots. From cognitive-behavioral therapy to mindfulness coaching, our AI therapists provide accessible, confidential, and effective solutions for stress, anxiety, depression, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <PHProvider>
        <body className={`${poppins.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </PHProvider>
    </html>
  );
}
