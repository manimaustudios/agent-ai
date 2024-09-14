import Navbar from "@/components/Navbar";

// export const runtime = "edge";

function Page() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-screen-lg flex-col items-start justify-start space-y-4 px-4 text-left">
      <Navbar />
      <div className="mx-auto max-w-screen-md space-y-4 pb-10 pt-6 text-sm text-muted-foreground">
        <h2 className="text-lg text-foreground">Contact Us</h2>
        <p>
          We&apos;re here to help and answer any questions you might have. Feel
          free to reach out to us, and we&apos;ll get back to you as soon as
          possible.
        </p>
        <p>
          For any inquiries, suggestions, or support, you can contact us
          directly via email at:{" "}
          <a
            href="mailto:info@aitherapistfree.com"
            className="text-foreground hover:text-primary hover:underline"
          >
            info@aitherapistfree.com
          </a>
          . We look forward to hearing from you!
        </p>
      </div>
    </main>
  );
}

export default Page;
