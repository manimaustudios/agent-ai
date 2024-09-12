import BackgroundGradient from "@/components/BackgroundGradient";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// export const runtime = "edge";

const NotFound = () => {
  return (
    <>
      {/* <BackgroundGradient /> */}
      <section className="flex min-h-screen items-center bg-background">
        <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-primary lg:text-9xl">
              404
            </h1>
            <p className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Something&apos;s missing.
            </p>
            <p className="mb-4 text-lg font-light text-slate-400">
              Sorry, we can&apos;t find that page. You&apos;ll find lots to
              explore on the home page.
            </p>
            <Button asChild>
              <Link href="/">Back to Homepage</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
