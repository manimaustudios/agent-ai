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
  title: "Free Online AI Therapist Chatbot | Mental Health Support`",
  description:
    "Free therapy online with our AI therapist chatbot, designed to support your mental well-being and self-help journey. You're guidance for mental health.",
  openGraph: {
    title: "Free Online AI Therapist Chatbot",
    description:
      "Experience free therapy online with our AI therapist chatbot, designed to support your mental well-being.",
    url: "https://www.aitherapistfree.com",
    siteName: "AITherapistFree",
    images: [
      {
        url: "https://www.aitherapistfree.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI Therapist Free",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const jsonLd = {
  "@context": "http://schema.org",
  "@type": "WebSite",
  name: "AITherapistFree",
  url: "https://www.aitherapistfree.com",
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
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
              />
              {children}
            </ClerkProvider>
          </ThemeProvider>
        </body>
      </PHProvider>
    </html>
  );
}
