"use client";

import { CiChat1, CiMail, CiUser } from "react-icons/ci";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ErrorDisplay from "./error-msg";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid Email Format"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const [isSending, setIsSending] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSending(true);
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSending(false);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-auto flex flex-col items-center gap-4"
    >
      {/* Name */}
      <div className="w-full">
        <div className="w-full h-[48px] relative">
          <input
            {...register("name")}
            type="text"
            id="name"
            placeholder="Your name"
            className={`w-full rounded-[12px] border bg-[#F9FAFB] h-full font-nunitoSans text-[16px] placeholder:text-[16px] placeholder:text-[#8E8C9C] text-[#8E8C9C] px-9 outline-none transition duration-300 ${
              errors.name ? "border-red-500" : "border-[#E5E7EB]"
            }`}
          />
          {/* icon */}
          <CiUser className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-3 text-[#8E8C9C]" />
        </div>
        {/* error */}
        {errors.name && <ErrorDisplay message={errors.name.message || ""} />}
      </div>

      {/* Email */}
      <div className="w-full">
        <div className="w-full h-[48px] relative">
          <input
            {...register("email")}
            type="email"
            id="email"
            placeholder="Email address"
            className={`w-full rounded-[12px] border bg-[#F9FAFB] font-nunitoSans h-full text-[16px] placeholder:text-[16px] placeholder:text-[#8E8C9C] text-[#8E8C9C] px-9 outline-none transition duration-300 ${
              errors.email ? "border-red-500" : "border-[#E5E7EB]"
            }`}
          />
          {/* icon */}
          <CiMail className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-3 text-[#8E8C9C]" />
        </div>
        {/* error */}
        {errors.email && <ErrorDisplay message={errors.email.message || ""} />}
      </div>

      {/* Message */}
      <div className="w-full">
        <div className="w-full relative">
          <textarea
            {...register("message")}
            id="message"
            placeholder="Message"
            className={`w-full resize-y rounded-[12px] border bg-[#F9FAFB] h-[120px] font-nunitoSans text-[16px] placeholder:text-[16px] placeholder:text-[#8E8C9C] text-[#8E8C9C] px-9 py-4 outline-none transition duration-300 ${
              errors.message ? "border-red-500" : "border-[#E5E7EB]"
            }`}
          />
          {/* icon */}
          <CiChat1 className="w-5 h-5 absolute top-4.5 left-3 text-[#8E8C9C]" />
        </div>
        {/* error */}
        {errors.message && (
          <ErrorDisplay message={errors.message.message || ""} />
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!(isDirty && isValid) || isSending}
        className="w-full h-[45px] mt-4 flex justify-center items-center rounded-[8px] bg-black text-gray-100 font-poppins font-[600] font-nunitoSans text-base disabled:opacity-80 disabled:cursor-not-allowed transition-opacity duration-200"
      >
        {isSending ? (
          <span className="flex items-center text-[#FFFFFF] gap-1">
            <AiOutlineLoading3Quarters className="animate-spin text-[#FFFFFF]" />
            Sending...
          </span>
        ) : (
          <span>Submit</span>
        )}
      </button>
    </form>
  );
};

export default ContactForm;
