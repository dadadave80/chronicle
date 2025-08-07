/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import Logo from "../shared/logo";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterInputValues } from "@/types";
import ErrorDisplay from "../shared/error-msg";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const RegisterForm = () => {
  return (
    <>
      <header className="w-full fixed top-[20px] flex justify-between md:justify-end items-center px-4 inset-x-0 ">
        <div className="md:hidden flex justify-center items-center ">
          <Logo
            classname="md:w-[140px] w-[140px]"
            href="/"
            image="/white-logo-nobg.png"
          />
        </div>
        <button
          type="button"
          className="md:w-[160px] w-[130px] md:h-[45px] h-[40px] flex justify-center items-center bg-[#000000E5] rounded-[8px] cursor-pointer md:text-base text-[14px] font-[500] font-nunitoSans text-white"
        >
          Connect Wallet
        </button>
      </header>

      <div className="shadow-authCardShadow md:w-[450px] w-full rounded-[16px] bg-white border border-[#E5E7EB] flex flex-col items-center py-8 px-6">
        <h4 className="font-semibold font-ibm text-[#000000E5] text-center text-xl my-6 md:text-2xl">
          Welcome to Chronify
        </h4>

        <FormInputs />
      </div>
    </>
  );
};

export default RegisterForm;

const FormInputs = () => {
  const [isSending, setIsSending] = useState<boolean>(false);

  const router = useRouter();

  //initial form values
  const initialValues: RegisterInputValues = {
    name: "",
    role: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    role: Yup.string()
      .required("Role is required")
      .oneOf(["Supplier", "Transporter", "Retailer"], "Invalid role selected"),
  });

  const onSubmit = async (
    values: RegisterInputValues,
    { resetForm }: FormikHelpers<RegisterInputValues>,
  ) => {
    setIsSending(true);
    try {
      console.log(values);
      resetForm();
      router.push("/dashboard");
    } catch (error) {
      setIsSending(false);
      console.error(error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnChange={true}
    >
      {(formik) => {
        const { dirty, isValid, errors, touched } = formik;
        return (
          <Form className="w-full flex flex-col gap-4 mt-6">
            {/* Name Field */}
            <div className="w-full flex flex-col">
              <label
                htmlFor="name"
                className="font-nunitoSans font-medium text-base md:text-lg text-[#58556A] mb-1"
              >
                Enter Your Name
              </label>

              <Field
                type="text"
                name="name"
                id="name"
                placeholder="Adams"
                className={`w-full rounded-[8px] border bg-[#F9FAFB] h-[48px] font-nunitoSans text-base placeholder:text-base placeholder:text-[#8E8C9C] text-[#333] px-4 outline-none transition duration-300 ${
                  errors.name && touched.name
                    ? "border-red-500"
                    : "border-[#E5E7EB]"
                }`}
              />

              <ErrorMessage
                name="name"
                component={({ children }: any) => (
                  <ErrorDisplay message={children} />
                )}
              />
            </div>

            {/* Role Field */}
            <div className="w-full flex flex-col">
              <label
                htmlFor="role"
                className="font-nunitoSans font-medium text-base md:text-lg text-[#58556A] mb-1"
              >
                Choose Your Role
              </label>

              <Field name="role">
                {({ field, form, meta }: any) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      form.setFieldValue("role", value);
                      form.setFieldTouched("role", true);
                    }}
                  >
                    <SelectTrigger
                      id="role"
                      className={`w-full rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow h-[48px] font-marcellus text-base px-4 outline-none transition duration-300 ${
                        meta.error && meta.touched
                          ? "border-red-500"
                          : "border-[#E5E7EB]"
                      } ${field.value ? "text-[#333]" : "text-[#8E8C9C]"}`}
                    >
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Supplier">Supplier</SelectItem>
                      <SelectItem value="Transporter">Transporter</SelectItem>
                      <SelectItem value="Retailer">Retailer</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </Field>

              <ErrorMessage
                name="role"
                component={({ children }: any) => (
                  <ErrorDisplay message={children} />
                )}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!(dirty && isValid) || isSending}
              className="w-full h-[48px] mt-6 flex justify-center items-center rounded-[8px] bg-black text-gray-100 font-nunitoSans font-[600] text-[16px] disabled:opacity-80 disabled:cursor-not-allowed transition-opacity duration-200"
            >
              {isSending ? (
                <span className="flex items-center text-gray-200 gap-2">
                  <AiOutlineLoading3Quarters className="animate-spin text-gray-200" />
                  Submitting...
                </span>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};
