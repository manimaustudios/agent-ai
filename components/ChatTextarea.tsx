"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FaChevronRight } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import LoadingSpinner from "./LoadingSpinner";
import { getAiResponse } from "@/lib/actions/openai";
import PremiumOffer from "./PremiumOffer";
import { getFormattedChatHistory } from "@/lib/utils";
import { AuthDialog } from "./AuthDialog";
import { useSidebar } from "@/lib/providers/SidebarProvider";

type ChatTextareaProps = {
  setChatHistory: any;
  chatType: string;
  sessionId: string;
  chatHistory: any;
  isAuthenticated: boolean;
  hasLimit: boolean;
  hasPremium: boolean;
  userId: string | null;
  messageLimit: number;
  hoursToWait: number;
  isMonthlyLimitReached: boolean;
  monthlyLimit: number;
  currentPrompt: string;
  price: number;
  setPendingAssistantText: (text: string | null) => void;
};

const ChatTextareaLimits = z.object({
  content: z
    .string()
    .min(2, { message: "Content must be at least 2 characters" })
    .max(1000, { message: "Content must be at max 1000 characters" }),
});

export function ChatTextarea({
  setChatHistory,
  chatType,
  sessionId,
  chatHistory,
  isAuthenticated,
  hasLimit,
  hasPremium,
  userId,
  messageLimit,
  hoursToWait,
  isMonthlyLimitReached,
  monthlyLimit,
  currentPrompt,
  price,
  setPendingAssistantText,
}: ChatTextareaProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  let canSendMessage = true;

  if (!hasPremium && !hasLimit) {
    canSendMessage = false;
  }
  if (hasPremium && isMonthlyLimitReached) {
    canSendMessage = false;
  }

  const form = useForm<z.infer<typeof ChatTextareaLimits>>({
    resolver: zodResolver(ChatTextareaLimits),
    defaultValues: {
      content: "",
    },
  });

  const revealAssistantResponse = async (response: string) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPendingAssistantText(response);
      return;
    }

    const characters = Array.from(response);
    const duration = Math.min(3200, Math.max(700, characters.length * 14));
    const frameDuration = 40;
    const charactersPerFrame = Math.max(
      1,
      Math.ceil(characters.length / (duration / frameDuration)),
    );

    for (
      let end = charactersPerFrame;
      end < characters.length;
      end += charactersPerFrame
    ) {
      setPendingAssistantText(characters.slice(0, end).join(""));
      await new Promise((resolve) => window.setTimeout(resolve, frameDuration));
    }

    setPendingAssistantText(response);
  };

  const onSubmit = async (data: z.infer<typeof ChatTextareaLimits>) => {
    if (!canSendMessage || isLoading) return;

    setIsLoading(true);
    setSubmitError(null);

    const content = data.content.trim();
    const newQuestion = { type: "question", text: content };
    const updatedHistoryWithQuestion = [...chatHistory, newQuestion];

    // Clear the submitted draft and display it in the conversation immediately.
    form.reset({ content: "" });
    setChatHistory(updatedHistoryWithQuestion, chatType, sessionId);
    setPendingAssistantText("");

    const formattedChatHistory = getFormattedChatHistory(
      chatHistory,
      newQuestion,
      currentPrompt,
    );

    try {
      const response = await getAiResponse(content, formattedChatHistory);
      await revealAssistantResponse(response);

      const newAnswer = { type: "answer", text: response };
      const updatedHistoryWithAnswer = [
        ...updatedHistoryWithQuestion,
        newAnswer,
      ];
      setChatHistory(updatedHistoryWithAnswer, chatType, sessionId);
      setPendingAssistantText(null);
    } catch {
      setPendingAssistantText(null);
      setSubmitError(
        "The AI therapist could not respond. Please try sending your message again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }

    if (isLoading) {
      event.preventDefault();
      return;
    }

    if (event.key === "Enter" && !canSendMessage) {
      event.preventDefault();
      setIsLimitDialogOpen(true); // Open the dialog if the user cannot send messages
    } else if (event.key === "Enter" && canSendMessage) {
      event.preventDefault();
      form.handleSubmit(onSubmit)(); // Submit the form if the user can send messages
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative mb-2 mt-4 w-full max-w-full space-y-6"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="">
              <FormControl>
                <Textarea
                  className="h-24 resize-none pr-16 text-base"
                  placeholder="Type your message"
                  {...field}
                  onKeyDown={handleKeyDown}
                />
              </FormControl>
              <FormMessage />
              {submitError && (
                <p
                  className="text-sm font-medium text-destructive"
                  role="alert"
                >
                  {submitError}
                </p>
              )}
            </FormItem>
          )}
        />
        <div className="absolute right-3 top-5 flex items-center gap-3">
          {isAuthenticated ? (
            <SubmitFormButton
              isLoading={isLoading}
              canSendMessage={canSendMessage}
              userId={userId}
              messageLimit={messageLimit}
              hoursToWait={hoursToWait}
              isMonthlyLimitReached={isMonthlyLimitReached}
              monthlyLimit={monthlyLimit}
              price={price}
              hasPremium={hasPremium}
              isLimitDialogOpen={isLimitDialogOpen}
              setIsLimitDialogOpen={setIsLimitDialogOpen}
            />
          ) : (
            // Logto sign in dialog
            // <SignInDialog />
            <AuthDialog buttonIcon={<FaChevronRight />} isTextarea={true} />
          )}
        </div>
      </form>
      <p className="block pb-2 text-center text-xs font-normal text-slate-400">
        You are chatting with AI Therapist. AI can make mistakes. This is not a
        medical advice.
      </p>
    </Form>
  );
}

type SubmitFormButtonProps = {
  isLoading: boolean;
  canSendMessage: boolean;
  userId: string | null;
  messageLimit: number;
  hoursToWait: number;
  isMonthlyLimitReached: boolean;
  monthlyLimit: number;
  price: number;
  hasPremium: boolean;
  isLimitDialogOpen: boolean;
  setIsLimitDialogOpen: (value: boolean) => void;
};

function SubmitFormButton({
  isLoading,
  canSendMessage,
  userId,
  messageLimit,
  hoursToWait,
  isMonthlyLimitReached,
  monthlyLimit,
  price,
  hasPremium,
  isLimitDialogOpen,
  setIsLimitDialogOpen,
}: SubmitFormButtonProps) {
  const { closeSidebarOnMobile } = useSidebar();
  return (
    <>
      {canSendMessage ? (
        <Button
          type="submit"
          size="icon"
          disabled={isLoading}
          onClick={() => closeSidebarOnMobile()}
        >
          {isLoading ? (
            <LoadingSpinner className="text-white" />
          ) : (
            <FaChevronRight className="h-4 w-4" />
          )}
        </Button>
      ) : (
        // Show dialog if user has free account and reached the limit
        <Dialog open={isLimitDialogOpen} onOpenChange={setIsLimitDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" size="icon" aria-label="View Premium plans">
              <FaChevronRight className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          {hasPremium ? (
            <DialogContent className="max-w-md rounded-xl">
              <DialogHeader>
                <DialogTitle>
                  Your Premium message allowance is used
                </DialogTitle>
                <DialogDescription>
                  Your plan includes {monthlyLimit.toLocaleString()} messages
                  per 30-day period. Your saved conversations remain available.
                </DialogDescription>
              </DialogHeader>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogContent>
          ) : (
            <PremiumOffer
              userId={userId}
              exhausted
              monthlyLimit={monthlyLimit}
            />
          )}
        </Dialog>
      )}
    </>
  );
}
