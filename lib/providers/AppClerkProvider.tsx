import { ClerkProvider } from "@clerk/nextjs";

export function AppClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "hsl(262.1 83.3% 57.8%)",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
