"use client";

import { useId, useRef, useState } from "react";
import * as z from "zod";
import { FaChevronRight } from "react-icons/fa";

import { Button } from "@/components/ui/button";
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
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendingRef = useRef(false);

  let canSendMessage = true;

  if (!hasPremium && !hasLimit) {
    canSendMessage = false;
  }
  if (hasPremium && isMonthlyLimitReached) {
    canSendMessage = false;
  }

  const onSubmit = async () => {
    if (!isAuthenticated || !canSendMessage || sendingRef.current) return;
    const parsed = ChatTextareaLimits.safeParse({
      content: textareaRef.current?.value.trim() ?? "",
    });
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0].message);
      return;
    }

    sendingRef.current = true;
    setIsLoading(true);
    setSubmitError(null);
    setValidationError(null);

    const content = parsed.data.content;
    const newQuestion = { type: "question", text: content };
    const updatedHistoryWithQuestion = [...chatHistory, newQuestion];

    // Clear the submitted draft and display it in the conversation immediately.
    if (textareaRef.current) textareaRef.current.value = "";
    setPendingAssistantText("");

    try {
      // Let the browser paint submission feedback before serializing history,
      // writing browser storage, and dispatching the server action.
      await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
      setChatHistory(updatedHistoryWithQuestion, chatType, sessionId);
      const formattedChatHistory = getFormattedChatHistory(
        chatHistory,
        newQuestion,
        currentPrompt,
      );
      const response = await getAiResponse(content, formattedChatHistory);

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
      sendingRef.current = false;
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
      void onSubmit();
    }
  };

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void onSubmit();
        }}
        className="relative mb-2 mt-4 w-full max-w-full space-y-6"
      >
        <div className="space-y-2">
          <Textarea
            ref={textareaRef}
            id={inputId}
            name="content"
            aria-label="Your message"
            aria-invalid={!!validationError}
            aria-describedby={
              validationError || submitError ? `${inputId}-error` : undefined
            }
            className="h-24 resize-none pr-16 text-base"
            placeholder="Type your message"
            onKeyDown={handleKeyDown}
          />
          {(validationError || submitError) && (
            <p
              id={`${inputId}-error`}
              className="text-sm font-medium text-destructive"
              role="alert"
            >
              {validationError || submitError}
            </p>
          )}
        </div>
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
    </>
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
