/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CiChat1, CiMail, CiUser } from "react-icons/ci";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { ContactFormValues } from "@/types";
import ErrorDisplay from "./error-msg";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ContactForm = () => {
  const [isSending, setIsSending] = useState<boolean>(false);

  const initialValues: ContactFormValues = {
    name: "",
    email: "",
    message: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid Email Format")
      .required("Email is required"),
    message: Yup.string().required("Message is required"),
  });

  const onSubmit = async (
    values: ContactFormValues,
    { resetForm }: FormikHelpers<ContactFormValues>,
  ) => {
    setIsSending(true);
    console.log(values);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSending(false);
    resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnChange={true}
    >
      {(formik) => {
        const { dirty, isValid } = formik;
        return (
          <Form className="w-full h-auto flex flex-col items-center gap-4">
            {/* Name */}
            <div className="w-full">
              <div className="w-full h-[48px] relative">
                <Field
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your name"
                  className={`w-full rounded-[12px] border bg-[#F9FAFB] h-full font-nunitoSans text-[16px] placeholder:text-[16px] placeholder:text-[#8E8C9C] text-[#8E8C9C] px-9 outline-none transition duration-300 border-[#E5E7EB] `}
                />
                {/* icon */}
                <CiUser className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-3 text-[#8E8C9C]" />
              </div>
              {/* error */}
              <ErrorMessage
                name="name"
                component={({ children }: any) => (
                  <ErrorDisplay message={children} />
                )}
              />
            </div>
            {/* Email */}
            <div className="w-full">
              <div className="w-full h-[48px] relative">
                <Field
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email address"
                  className={`w-full rounded-[12px] border bg-[#F9FAFB] font-nunitoSans h-full text-[16px] placeholder:text-[16px] placeholder:text-[#8E8C9C] text-[#8E8C9C] px-9 outline-none transition duration-300 border-[#E5E7EB]`}
                />
                {/* icon */}
                <CiMail className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-3 text-[#8E8C9C]" />
              </div>
              {/* error */}
              <ErrorMessage
                name="email"
                component={({ children }: any) => (
                  <ErrorDisplay message={children} />
                )}
              />
            </div>

            {/* message */}
            <div className="w-full">
              <div className="w-full relative">
                <Field
                  name="message"
                  as="textarea"
                  id="message"
                  placeholder="Message"
                  className={`w-full resize-y rounded-[12px] border bg-[#F9FAFB] h-[120px] font-nunitoSans text-[16px] placeholder:text-[16px] placeholder:text-[#8E8C9C] text-[#8E8C9C] px-9 py-4 outline-none transition duration-300 border-[#E5E7EB]`}
                />
                {/* icon */}
                <CiChat1 className="w-5 h-5 absolute top-4.5 left-3 text-[#8E8C9C]" />
              </div>
              {/* error */}
              <ErrorMessage
                name="message"
                component={({ children }: any) => (
                  <ErrorDisplay message={children} />
                )}
              />
            </div>

            {/* btn */}
            <button
              type="submit"
              disabled={!(dirty && isValid)}
              className="w-full h-[45px] mt-4 flex justify-center items-center rounded-[8px] bg-black text-gray-100 font-poppins font-[600]  font-nunitoSans text-base disabled:opacity-80 disabled:cursor-not-allowed"
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
          </Form>
        );
      }}
    </Formik>
  );
};

export default ContactForm;
