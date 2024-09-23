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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import LoadingSpinner from "./LoadingSpinner";
import { getAiResponse } from "@/lib/actions/openai";
import SignInDialog from "./SignInDialog";
import { updateMsgAmount } from "@/lib/actions/users";
import PaymentButton from "./PaymentButton";
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
}: ChatTextareaProps) {
  const [isLoading, setIsLoading] = useState(false);

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

  const resetFormValues = async () => {
    form.setValue("content", "");
  };

  const onSubmit = async (data: z.infer<typeof ChatTextareaLimits>) => {
    if (!canSendMessage) return;

    setIsLoading(true);
    const newQuestion = { type: "question", text: data.content };
    const updatedHistoryWithQuestion = [...chatHistory, newQuestion];
    setChatHistory(updatedHistoryWithQuestion, chatType, sessionId);

    const formattedChatHistory = getFormattedChatHistory(
      chatHistory,
      newQuestion,
      currentPrompt,
    );

    const response = await getAiResponse(data.content, formattedChatHistory);

    const newAnswer = { type: "answer", text: response };
    const updatedHistoryWithAnswer = [...updatedHistoryWithQuestion, newAnswer];
    setChatHistory(updatedHistoryWithAnswer, chatType, sessionId);

    await resetFormValues();

    await updateMsgAmount(userId, hasPremium);

    setIsLoading(false);
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
                />
              </FormControl>
              <FormMessage />
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
            />
          ) : (
            // Logto sign in dialog
            // <SignInDialog />
            <AuthDialog buttonIcon={<FaChevronRight />} />
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
        <Dialog>
          <DialogTrigger>
            <Button size="icon" asChild>
              <div className="h-10 w-10">
                <FaChevronRight className="h-4 w-4" />
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md py-10">
            <DialogHeader className="space-y-6">
              <DialogTitle className="text-center">
                You&#39;ve been chatting a lot.
              </DialogTitle>
              <DialogDescription className="space-y-3 text-center">
                {isMonthlyLimitReached ? (
                  <>
                    <span>
                      You&#39;ve sent more than {monthlyLimit} messages in the
                      last 30 days.
                    </span>
                  </>
                ) : (
                  <>
                    <span className="inline-block py-2">
                      You&#39;ve sent more than {messageLimit} messages in the
                      last {hoursToWait} hours. To keep this service free, we
                      have to limit free usage.
                    </span>
                    <span className="inline-block py-2">
                      Subscribe to the unlimited plan for just ${price}/month to
                      continue chatting. Cancel anytime and save 90-95% compared
                      to a single human therapist session!
                    </span>
                    <span className="inline-block py-2">
                      You can also come back in a few hours and chat for free.
                    </span>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mx-auto flex-row gap-2 pt-3">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              {!isMonthlyLimitReached && (
                <PaymentButton userId={userId} cta="Subscribe" />
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
