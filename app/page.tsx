import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { getAllChats } from "@/lib/actions/chats";
import Image from "next/image";
import Link from "next/link";

const imgSrc =
  "https://images.unsplash.com/photo-1579591919791-0e3737ae3808?q=80&w=1915&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const chats = [
  {
    name: "General Chat",
    type: "general",
  },
  {
    name: "Support Chat",
    type: "support",
  },
  {
    name: "Sales Chat",
    type: "sales",
  },
  {
    name: "Support Chat",
    type: "support",
  },
];

export default async function Home() {
  const chatList = await getAllChats();

  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-screen-lg flex-col items-center justify-center space-y-4 px-4 text-center">
        <ThemeToggle />
        <h1 className="text-5xl font-semibold leading-tight">
          AI Therapist{" "}
          <span className="relative ml-2 mt-4 inline-block px-2 py-1 before:absolute before:-inset-1 before:block before:-skew-y-2 before:rounded-xl before:bg-primary">
            <span className="relative text-white">Chatbot</span>
          </span>
        </h1>
        <p className="text-lg">
          Your mental helath matters. Get personalised support from our AI
          therapist.
        </p>
        <p className="text-sm text-muted-foreground">24 / 7 For FREE</p>
        <Button asChild className="px-6 py-6">
          <Link href="/agent" className="text-base">
            Start Chatting
          </Link>
        </Button>
        <p className="">Get Started With Your AI Therapist</p>
        <div className="flex w-full max-w-screen-sm flex-wrap justify-center gap-10 pt-6">
          {chatList.map((chat, i) => (
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
                  className="absolute z-0 rounded-full object-cover"
                />
              </Link>
              <p className="text-sm">{chat.name}</p>
            </div>
          ))}
        </div>
      </main>
      {/* <BackgroundGradient /> */}
    </>
  );
}
