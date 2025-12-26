"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@utils/trpc-provider";
import { FadeInSection } from "@components/FadeInSection";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters"),
  website: z.string().max(0), // Honeypot field
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmail, setShowEmail] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const submitMutation = api.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setError(null);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      setError(error.message || "Failed to submit form. Please try again.");
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setError(null);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await submitMutation.mutateAsync(data);
  };

  const toggleEmailField = () => {
    setShowEmail(!showEmail);
    if (showEmail) {
      // Clear email value when hiding
      setValue("email", "");
    }
  };

  const isPending = submitMutation.isPending || isSubmitting;

  return (
    <main className="min-h-screen bg-warm-950 py-16 px-4 sm:py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-2xl">
        <FadeInSection direction="up">
          <div className="mb-8 sm:mb-12">
            <h1 className="font-gravitas text-3xl text-warm-100 sm:text-4xl md:text-5xl lg:text-6xl">
              Get in Touch
            </h1>
            <div className="my-3 h-0.5 w-16 rounded-full bg-warm-500 sm:my-4 sm:h-1 sm:w-24" />
            <p className="text-base text-warm-300 sm:text-lg">
              Have a question or want to work together? I&apos;d love to hear from you.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection direction="up" delay={100}>
          <form
            onSubmit={(e) => {
              void handleSubmit(onSubmit)(e);
            }}
            className="space-y-5 rounded-xl border border-warm-700/30 bg-warm-800/50 p-6 sm:space-y-6 sm:rounded-2xl sm:p-8"
          >
            {submitted && (
              <div className="rounded-lg bg-green-500/10 p-4 text-green-400">
                Thank you for your message! I&apos;ll get back to you soon.
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-500/10 p-4 text-red-400">
                {error}
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-warm-100">
                Name
              </label>
              <Input
                type="text"
                id="name"
                {...register("name")}
                disabled={isPending}
                className="mt-2 border-warm-600/50 bg-warm-900/50 text-warm-100 placeholder-warm-500 focus:border-warm-400 focus:ring-warm-400/20"
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="email" className="block text-sm font-medium text-warm-100">
                  Email
                </label>
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
                  <Input
                    type="email"
                    id="email"
                    {...register("email")}
                    disabled={isPending}
                    className="border-warm-600/50 bg-warm-900/50 text-warm-100 placeholder-warm-500 focus:border-warm-400 focus:ring-warm-400/20"
                    placeholder="your@email.com"
                  />
                  <p className="mt-1 text-xs text-warm-500">
                    I&apos;ll use this to respond to your message
                  </p>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                  )}
                </>
              ) : (
                <div className="rounded-lg border border-warm-700/30 bg-warm-800/30 px-4 py-3">
                  <p className="text-sm text-warm-400">
                    Your message will be sent anonymously. I won&apos;t be able to respond, but I&apos;ll still receive your feedback.
                  </p>
                </div>
              )}
            </div>

            {/* Honeypot Field - Hidden from users */}
            <Input
              type="text"
              {...register("website")}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-warm-100">
                Message
              </label>
              <Textarea
                id="message"
                {...register("message")}
                disabled={isPending}
                rows={6}
                className="mt-2 border-warm-600/50 bg-warm-900/50 text-warm-100 placeholder-warm-500 focus:border-warm-400 focus:ring-warm-400/20"
                placeholder="Your message here..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-warm-500 font-medium text-warm-950 hover:bg-warm-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </form>
        </FadeInSection>
      </div>
    </main>
  );
}
