"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
});

interface ContactMeFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function ContactMeForm({ onSuccess, onError }: ContactMeFormProps) {
  const form = useForm<z.infer<typeof contactMeformScheuma>>({
    resolver: zodResolver(contactMeformScheuma),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const submitMutation = api.contact.submit.useMutation({
    onSuccess: () => {
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error.message || "Failed to send message. Please try again.");
    },
  });

  function onSubmit(values: z.infer<typeof contactMeformScheuma>) {
    submitMutation.mutate(values);
  }

  const isSubmitting = submitMutation.isLoading;

  const formFieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut",
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
                      disabled={isSubmitting}
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
                <FormLabel className="text-warm-100">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <EnvelopeClosedIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-400" />
                    <Input
                      placeholder="your@email.com"
                      className="border-warm-600/50 bg-warm-900/50 pl-10 text-warm-100 placeholder-warm-500 focus:border-warm-400 focus:ring-warm-400/20"
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
          custom={3}
          initial="hidden"
          animate="visible"
          variants={formFieldVariants}
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-warm-500 font-medium text-warm-950 transition hover:bg-warm-400 disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}
