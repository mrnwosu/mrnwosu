"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@utils/trpc-provider";
import {
  PersonIcon,
  EnvelopeClosedIcon,
  ChatBubbleIcon,
} from "@radix-ui/react-icons";
import { motion } from "motion/react";

export const contactMeformScheuma = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(255),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
  website: z.string().max(0), // Honeypot field - must be empty
});

interface ContactMeFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function ContactMeForm({ onSuccess, onError }: ContactMeFormProps) {
  const [showEmail, setShowEmail] = useState(true);

  const form = useForm<z.infer<typeof contactMeformScheuma>>({
    resolver: zodResolver(contactMeformScheuma),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      website: "", // Honeypot field
    },
  });

  const submitMutation = api.contact.submit.useMutation({
    onSuccess: () => {
      form.reset();
      setShowEmail(true); // Reset email field visibility on success
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error.message || "Failed to send message. Please try again.");
    },
  });

  function onSubmit(values: z.infer<typeof contactMeformScheuma>) {
    submitMutation.mutate(values);
  }

  const toggleEmailField = () => {
    setShowEmail(!showEmail);
    if (showEmail) {
      // Clear email value when hiding
      form.setValue("email", "");
    }
  };

  const isPending = submitMutation.isPending;

  const formFieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <Form {...form}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={formFieldVariants}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-warm-100">Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <PersonIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-400" />
                    <Input
                      placeholder="Your name"
                      className="border-warm-600/50 bg-warm-900/50 pl-10 text-warm-100 placeholder-warm-500 focus:border-warm-400 focus:ring-warm-400/20"
                      disabled={isPending}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={formFieldVariants}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-warm-100">Email</FormLabel>
                  <button
                    type="button"
                    onClick={toggleEmailField}
                    disabled={isPending}
                    className="text-xs text-warm-400 hover:text-warm-300 underline underline-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showEmail ? "Make optional" : "Provide email"}
                  </button>
                </div>

                {showEmail ? (
                  <>
                    <FormControl>
                      <div className="relative">
                        <EnvelopeClosedIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-400" />
                        <Input
                          placeholder="your@email.com"
                          className="border-warm-600/50 bg-warm-900/50 pl-10 text-warm-100 placeholder-warm-500 focus:border-warm-400 focus:ring-warm-400/20"
                          disabled={isPending}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-warm-500 text-xs">
                      I&apos;ll use this to respond to your message
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </>
                ) : (
                  <div className="rounded-lg border border-warm-700/30 bg-warm-800/30 px-4 py-3">
                    <p className="text-sm text-warm-400">
                      Your message will be sent anonymously. I won&apos;t be able to respond, but I&apos;ll still receive your feedback.
                    </p>
                  </div>
                )}
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={formFieldVariants}
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-warm-100">Message</FormLabel>
                <FormControl>
                  <div className="relative">
                    <ChatBubbleIcon className="absolute left-3 top-3 h-4 w-4 text-warm-400" />
                    <Textarea
                      placeholder="What's on your mind?"
                      rows={4}
                      className="border-warm-600/50 bg-warm-900/50 pl-10 text-warm-100 placeholder-warm-500 focus:border-warm-400 focus:ring-warm-400/20"
                      disabled={isPending}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </motion.div>

        {/* Honeypot field - hidden from users, catches bots */}
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={formFieldVariants}
        >
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-warm-500 font-medium text-warm-950 transition hover:bg-warm-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              "Send Message"
            )}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}
