"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

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
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import LoadingSpinner from "./LoadingSpinner";
import { getAiResponse } from "@/lib/actions/openai";
import { FaChevronRight } from "react-icons/fa";
import SignInDialog from "./SignInDialog";
import { updateMsgAmount } from "@/lib/actions/users";

type ChatTextareaProps = {
  setChatHistory: any;
  chatType: string;
  sessionId: string;
  chatHistory: any;
  isAuthenticated: boolean;
  hasLimit: boolean;
  hasPremium: boolean;
  userId: string | null;
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
}: ChatTextareaProps) {
  const [isLoading, setIsLoading] = useState(false);
  const canSendMessage = hasLimit || hasPremium;

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

    const response = await getAiResponse(data.content);

    const newAnswer = { type: "answer", text: response };
    const updatedHistoryWithAnswer = [...updatedHistoryWithQuestion, newAnswer];
    setChatHistory(updatedHistoryWithAnswer, chatType, sessionId);

    if (!hasPremium) {
      await updateMsgAmount(userId);
    }

    await resetFormValues();

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative w-full space-y-6 py-6"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="block pb-2 text-center font-normal text-slate-400">
                Type your message.
              </FormLabel>
              <FormControl>
                <Textarea
                  className="h-24 resize-none pr-16"
                  placeholder="Write your question here..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="absolute right-2 top-[44%] flex -translate-y-1/2 transform items-center gap-3">
          {isAuthenticated ? (
            // <Button type="submit" size="icon" disabled={isLoading}>
            //   {isLoading ? (
            //     <LoadingSpinner className="text-white" />
            //   ) : (
            //     <FaChevronRight className="h-4 w-4" />
            //   )}
            // </Button>
            <SubmitFormButton
              isLoading={isLoading}
              canSendMessage={canSendMessage}
            />
          ) : (
            <SignInDialog />
          )}
        </div>
      </form>
    </Form>
  );
}

type SubmitFormButtonProps = {
  isLoading: boolean;
  canSendMessage: boolean;
};

function SubmitFormButton({
  isLoading,
  canSendMessage,
}: SubmitFormButtonProps) {
  return (
    <>
      {canSendMessage ? (
        <Button type="submit" size="icon" disabled={isLoading}>
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
          <DialogContent>
            <DialogHeader className="space-y-6">
              <DialogTitle>You Reached the limit.</DialogTitle>
              <DialogDescription>
                You need to upgrade to premium to send unlimited messages or
                wait till your limit will be restored.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
