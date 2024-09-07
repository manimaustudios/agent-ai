import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/providers/ThemeProvider";
import { PHProvider } from "@/lib/providers/PHProvider";
import { ClerkProvider } from "@clerk/nextjs";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Free Online AI Therapist Chatbot | Mental Health & Self-Help Support",
  description:
    "Experience free therapy online with our AI therapist chatbot, designed to support your mental well-being and self-help journey. Whether you're seeking guidance for mental health, or looking for a virtual therapist, our platform offers personalized support to help you manage stress, anxiety, and emotional challenges. Prioritize your mental health with convenient and confidential conversations, anytime, anywhere.",
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
            <ClerkProvider
              appearance={{
                variables: {
                  colorPrimary: "hsl(262.1 83.3% 57.8%)",
                },
              }}
            >
              {children}
            </ClerkProvider>
          </ThemeProvider>
        </body>
      </PHProvider>
    </html>
  );
}
