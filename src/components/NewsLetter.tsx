"use client";

import { newsLetterSchema } from "@/utils/Schema";
import { subscribe } from "@/utils/Subscribe";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./Loader";
import LoadingState from "./LoadingState";

function NewsLetter() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof newsLetterSchema>>({
    resolver: zodResolver(newsLetterSchema),
  });

  const [notify, setNotify] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [loading]);

  const onSubmit = async (formData: z.infer<typeof newsLetterSchema>) => {
    setAdding(true);
    // Get the list of subscribed emails from localStorage (default to an empty array if not found)
    const emails = JSON.parse(window.localStorage.getItem("emails") || "[]");

    // Check if the user's email is already in the list
    if (emails.includes(formData.email)) {
      setMessage("You are already subscribed to our newsletter.");
      setNotify(true);
      setAdding(false);
      return; // Exit early since the email is already subscribed
    }

    // Proceed to subscribe if the email is not already in the list
    const { data, err } = await subscribe(formData.email);

    if (err) {
      setMessage(err.message);
      setNotify(true);
      setAdding(false);

      return;
    }

    // If the subscription is successful
    if (data?.id) {
      setMessage("You have been successfully added to our newsletter.");
      setNotify(true);
      setAdding(false);

      // Update the localStorage to include the new email
      emails.push(formData.email);
      window.localStorage.setItem("emails", JSON.stringify(emails));
    }
  };

  return (
    <div className="min-h-[600px] h-screen lg:max-h-[700px] xl:max-h-screen flex items-center justify-center">
      <AnimatePresence mode="wait">{loading && <Loader />}</AnimatePresence>
      <AnimatePresence mode="wait">
        {notify && (
          <motion.div
            initial={{
              y: "-100%",
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: "-100%",
              opacity: 0,
            }}
            className="absolute text-sm flex items-center justify-center gap-2 top-[10%] py-1 px-3 bg-black text-white rounded-full"
          >
            {message}
            <svg
              onClick={() => {
                setNotify(false);
                setAdding(false);
              }}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="cursor-pointer"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-[95%] h-[75%] md:h-[50%] md:w-[95%] lg:h-[75%] lg:w-[75%] md:border md:border-black md:rounded-full flex items-center justify-center">
        <div className="hidden md:flex items-center justify-center flex-[1] h-full">
          <div className="w-[75%] h-[75%] relative">
            <Image
              src="/eclipse.png"
              alt="eclipse"
              priority={true}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex-[1] h-full flex items-center justify-center">
          <form
            className="flex flex-col items-center md:items-start gap-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h1 className="uppercase font-semibold text-3xl tracking-tight  w-[90%] md:w-[70%]">
              nothing complicated here.
            </h1>
            <p className="font-medium text-sm  w-[90%] md:w-[75%]">
              Get our newsletter with the latest projects and trends. Anti-spam.
              Not Boring.
            </p>
            <div className="flex items-center gap-2  w-[90%] md:w-[75%]">
              <div className="relative flex flex-col gap-1 w-full">
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="Enter your Email Address"
                  className="relative w-full outline-none p-3 border-black border rounded-full"
                />

                <span className="absolute -bottom-5 text-red-500 text-xs font-[500]">
                  {errors.email?.message}
                </span>
              </div>
              <button
                disabled={notify || adding}
                type="submit"
                className="disabled:opacity-50 w-fit p-4 bg-black text-white rounded-[50%]"
              >
                {adding ? (
                  <LoadingState />
                ) : (
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewsLetter;
