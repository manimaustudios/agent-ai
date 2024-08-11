import BackgroundGradient from "@/components/BackgroundGradient";
import Footer from "@/components/Footer";
import GridCards from "@/components/GridCards";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-screen-xl px-2 text-slate-200 md:px-6 lg:px-12">
        <Hero />
        <GridCards type="medium" title="For You" />
        <GridCards type="small" title="New Ideas" />
      </main>
      <Footer />
      <BackgroundGradient />
    </>
  );
}
