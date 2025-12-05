import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@utils/api";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact: NextPage = () => {
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

  const submitMutation = api.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setError(null);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    },
    onError: (error) => {
      setError(error.message || "Failed to submit form. Please try again.");
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setError(null);
    await submitMutation.mutateAsync(data);
  };

  return (
    <>
      <Head>
        <title>Contact - Mr. Nwosu</title>
        <meta name="description" content="Get in touch with Ike Nwosu" />
      </Head>
      <main className="min-h-screen bg-black py-20 px-4 md:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12">
            <h1 className="font-gravitas text-5xl font-bold text-white md:text-6xl">
              Get in Touch
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Have a question or want to work together? I&apos;d love to hear from you.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              void handleSubmit(onSubmit)(e);
            }}
            className="space-y-6 rounded-lg border border-white/10 bg-white/5 p-8 backdrop-blur"
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
              <label htmlFor="name" className="block text-sm font-medium text-white">
                Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder-white/40 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder-white/40 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white">
                Message
              </label>
              <textarea
                id="message"
                {...register("message")}
                rows={6}
                className="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder-white/40 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="Your message here..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || submitMutation.isLoading}
              className="w-full rounded-lg bg-cyan-600 px-6 py-2 font-medium text-white transition hover:bg-cyan-700 disabled:opacity-50"
            >
              {isSubmitting || submitMutation.isLoading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Contact;
