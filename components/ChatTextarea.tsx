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
import { Textarea } from "@/components/ui/textarea";
import LoadingSpinner from "./LoadingSpinner";
import { getAiResponse } from "@/lib/actions/openai";
import { FaChevronRight } from "react-icons/fa";
// import { createActivity } from "@/lib/actions/activities.actions";
// import LoadingSpinner from "./ui/LoadingSpinner";
// import { showToastError, showToastSuccess } from "@/lib/utils";

const ChatTextareaLimits = z.object({
  content: z
    .string()
    .min(2, { message: "Content must be at least 2 characters" })
    .max(1000, { message: "Content must be at max 1000 characters" }),
});

export function ChatTextarea({ setChatHistory }: { setChatHistory: any }) {
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    setChatHistory((prev: any) => [
      ...prev,
      { type: "question", text: data.content },
    ]);
    const response = await getAiResponse(data.content);
    setChatHistory((prev: any) => [
      ...prev,
      { type: "answer", text: response },
    ]);
    // const analysis = await getAiResponse(data);
    // if (analysis?.error) {
    //   showToastError(analysis.error);
    //   setIsLoading(false);
    //   return;
    // }
    // await createActivity("analysis", "added");
    await resetFormValues();
    // showToastSuccess("Analysis created successfully");
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative my-6 w-full space-y-6"
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
                  placeholder="What is the capital of France?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="absolute bottom-7 right-2 flex items-center gap-3">
          <Button type="submit" size="icon" disabled={isLoading}>
            {isLoading ? (
              <LoadingSpinner className="text-white" />
            ) : (
              <FaChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
