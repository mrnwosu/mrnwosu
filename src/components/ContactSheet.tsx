"use client";

import { useState } from "react";
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../@/components/ui/sheet";
import { ContactMeForm } from "../@/components/contactMeForm";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircledIcon } from "@radix-ui/react-icons";

type FormStatus = "idle" | "success" | "error";

interface ContactSheetProps {
  side?: "left" | "right" | "top" | "bottom";
}

export function ContactSheet({ side = "right" }: ContactSheetProps) {
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSuccess = () => {
    setFormStatus("success");
    setErrorMessage("");
  };

  const handleError = (error: string) => {
    setFormStatus("error");
    setErrorMessage(error);
  };

  const handleReset = () => {
    setFormStatus("idle");
    setErrorMessage("");
  };

  return (
    <SheetContent
      className="border-l-2 border-l-warm-600 bg-warm-900/95 backdrop-blur-sm text-warm-100"
      side={side}
    >
      <SheetHeader>
        <SheetTitle className="font-gravitas text-2xl text-warm-100">
          Get in Touch
        </SheetTitle>
        <SheetDescription className="text-warm-300">
          Have a question or want to work together? Drop me a message and
          I&apos;ll get back to you soon.
        </SheetDescription>
      </SheetHeader>

      <div className="relative mt-6 min-h-[350px]">
        <AnimatePresence mode="wait">
          {formStatus === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center gap-4 py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1,
                }}
              >
                <CheckCircledIcon className="h-32 w-32 text-warm-500" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <p className="text-xl font-semibold text-warm-100">
                  Message Sent!
                </p>
                <p className="mt-2 text-warm-400">
                  Thanks for reaching out. I&apos;ll get back to you soon.
                </p>
              </motion.div>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={handleReset}
                className="mt-4 text-sm text-warm-400 underline underline-offset-4 hover:text-warm-300 transition"
              >
                Send another message
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {formStatus === "error" && errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400"
                >
                  {errorMessage}
                </motion.div>
              )}
              <ContactMeForm onSuccess={handleSuccess} onError={handleError} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SheetFooter />
    </SheetContent>
  );
}
