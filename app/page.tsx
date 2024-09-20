import Image from "next/image";
import Link from "next/link";

import { getAllChats } from "@/lib/actions/chats";
import Navbar from "@/components/Navbar";
import CallToActionButton from "@/components/CallToActionButton";

// export const runtime = "edge";

export default async function Home() {
  const { chats } = await getAllChats();

  return (
    <>
      <main className="relative mx-auto flex min-h-screen max-w-screen-lg flex-col items-center justify-start px-2 text-center sm:px-4">
        <Navbar />
        <div className="my-auto space-y-4 py-10">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:mb-2 md:text-5xl">
            Free Online AI Therapist{" "}
          </h1>
          <span className="relative ml-2 inline-block px-2 py-1 text-3xl font-semibold before:absolute before:-inset-1 before:block before:-skew-y-2 before:rounded-xl before:bg-primary sm:text-4xl md:text-5xl">
            <span className="relative text-white">Chatbot</span>
          </span>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Your mental helath matters. Get personalised support from our AI
            therapist.
          </p>
          <p className="text-sm text-muted-foreground">24 / 7 For FREE</p>
          <CallToActionButton />
          <p className="text-sm text-muted-foreground">
            Get Started With Your AI Therapist
          </p>
          <div className="mx-auto flex w-full max-w-screen-lg flex-wrap items-start justify-center gap-3 pt-10 sm:gap-6">
            {chats.map((chat, i) => (
              <div
                key={`chatType-${i}`}
                className="group flex w-36 flex-col items-center justify-start gap-2 self-stretch rounded-md border border-foreground/10 px-2 py-1 shadow-sm shadow-primary/30 transition-transform ease-in-out hover:scale-105 hover:shadow-primary/50 sm:px-4 sm:py-2"
              >
                <Link
                  href="/agent"
                  className="relative size-20 rounded-full transition-transform ease-in-out group-hover:scale-105"
                >
                  <Image
                    alt={`{chat.name} animated avatar`}
                    priority
                    src={chat.imgUrl}
                    fill
                    sizes="10rem"
                    className="absolute z-0 rounded-full object-cover"
                  />
                </Link>
                <p className="text-xs text-muted-foreground">{chat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* <BackgroundGradient /> */}
    </>
  );
}
