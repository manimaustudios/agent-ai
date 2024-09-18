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
      <main className="relative mx-auto flex min-h-screen max-w-screen-lg flex-col items-center justify-start px-4 text-center">
        <Navbar />
        <div className="my-auto space-y-4">
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Free Online AI Therapist{" "}
            <span className="relative ml-2 mt-4 inline-block px-2 py-1 before:absolute before:-inset-1 before:block before:-skew-y-2 before:rounded-xl before:bg-primary">
              <span className="relative text-white">Chatbot</span>
            </span>
          </h1>
          <p className="text-lg">
            Your mental helath matters. Get personalised support from our AI
            therapist.
          </p>
          <p className="text-sm text-muted-foreground">24 / 7 For FREE</p>
          <CallToActionButton />
          <p className="">Get Started With Your AI Therapist</p>
          <div className="mx-auto flex w-full max-w-screen-sm flex-wrap justify-center gap-10 pt-6">
            {chats.map((chat, i) => (
              <div
                key={`chatType-${i}`}
                className="flex flex-col items-center justify-center gap-2"
              >
                <Link href="/agent" className="relative size-20 rounded-full">
                  <Image
                    alt=""
                    priority
                    src={chat.imgUrl}
                    fill
                    sizes="10rem"
                    className="absolute z-0 rounded-full object-cover"
                  />
                </Link>
                <p className="text-sm">{chat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* <BackgroundGradient /> */}
    </>
  );
}
