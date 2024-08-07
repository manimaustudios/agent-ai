import BackgroundGradient from "@/components/BackgroundGradient";

export default function Home() {
  return (
    <>
      <header className="mx-auto max-w-screen-xl">Header</header>
      <main className="mx-auto max-w-screen-xl border-4 border-red-400 px-2 text-white md:px-6 lg:px-12">
        <h1 className="text-3xl">Font test</h1>
        <h1 className="text-3xl font-medium">Font test</h1>
        <h1 className="text-3xl font-semibold">Font test</h1>
        <h1 className="text-3xl font-bold">Font test</h1>
      </main>
      <footer className="mx-auto max-w-screen-xl">Footer</footer>
      <BackgroundGradient />
    </>
  );
}
