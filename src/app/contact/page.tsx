"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@utils/trpc-provider";
import { FadeInSection } from "@components/FadeInSection";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
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
              <input
                type="text"
                id="name"
                {...register("name")}
                className="mt-2 w-full rounded-lg border border-warm-600/50 bg-warm-900/50 px-4 py-2.5 text-warm-100 placeholder-warm-500 transition focus:border-warm-400 focus:outline-none focus:ring-2 focus:ring-warm-400/20"
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-warm-100">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="mt-2 w-full rounded-lg border border-warm-600/50 bg-warm-900/50 px-4 py-2.5 text-warm-100 placeholder-warm-500 transition focus:border-warm-400 focus:outline-none focus:ring-2 focus:ring-warm-400/20"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-warm-100">
                Message
              </label>
              <textarea
                id="message"
                {...register("message")}
                rows={6}
                className="mt-2 w-full rounded-lg border border-warm-600/50 bg-warm-900/50 px-4 py-2.5 text-warm-100 placeholder-warm-500 transition focus:border-warm-400 focus:outline-none focus:ring-2 focus:ring-warm-400/20"
                placeholder="Your message here..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || (submitMutation as { isLoading?: boolean }).isLoading}
              className="w-full rounded-lg bg-warm-500 px-6 py-2.5 font-medium text-warm-950 transition hover:bg-warm-400 disabled:opacity-50"
            >
              {isSubmitting || (submitMutation as { isLoading?: boolean }).isLoading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </FadeInSection>
      </div>
    </main>
  );
}
