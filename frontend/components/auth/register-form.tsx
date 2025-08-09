"use client";

import Logo from "../shared/logo";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ErrorDisplay from "../shared/error-msg";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useRegister from "@/hooks/useRegister";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.enum(["Supplier", "Transporter", "Retailer"], {
    errorMap: () => ({ message: "Role is required" }),
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

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
        <appkit-button />
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

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    watch,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      role: undefined,
    },
    mode: "onChange",
  });

  const watchedRole = watch("role");

  const { registerUser } = useRegister();

  const onSubmit = async (data: RegisterFormData) => {
    setIsSending(true);
    try {
      const { name, role } = data;
      await registerUser(name, role);
      setIsSending(false);
    } catch (error) {
      setIsSending(false);
      console.error(error);
    }
  };

  const handleRoleChange = (value: string) => {
    setValue("role", value as "Supplier" | "Transporter" | "Retailer", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    trigger("role");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-4 mt-6"
    >
      {/* Name Field */}
      <div className="w-full flex flex-col">
        <label
          htmlFor="name"
          className="font-nunitoSans font-medium text-base md:text-lg text-[#58556A] mb-1"
        >
          Enter Your Name
        </label>

        <input
          {...register("name")}
          type="text"
          id="name"
          placeholder="Adams"
          className={`w-full rounded-[8px] border bg-[#F9FAFB] h-[48px] font-nunitoSans text-base placeholder:text-base placeholder:text-[#8E8C9C] text-[#333] px-4 outline-none transition duration-300 ${errors.name ? "border-red-500" : "border-[#E5E7EB]"
            }`}
        />

        {errors.name && <ErrorDisplay message={errors.name.message || ""} />}
      </div>

      {/* Role Field */}
      <div className="w-full flex flex-col">
        <label
          htmlFor="role"
          className="font-nunitoSans font-medium text-base md:text-lg text-[#58556A] mb-1"
        >
          Choose Your Role
        </label>

        <Select value={watchedRole || ""} onValueChange={handleRoleChange}>
          <SelectTrigger
            className={`w-full rounded-[8px] border bg-[#F9FAFB] h-[48px] font-nunitoSans text-base px-4 outline-none transition duration-300 ${errors.role ? "border-red-500" : "border-[#E5E7EB]"
              } ${watchedRole ? "text-[#333]" : "text-[#8E8C9C]"}`}
          >
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Supplier">Supplier</SelectItem>
            <SelectItem value="Transporter">Transporter</SelectItem>
            <SelectItem value="Retailer">Retailer</SelectItem>
          </SelectContent>
        </Select>

        {errors.role && <ErrorDisplay message={errors.role.message || ""} />}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!(isDirty && isValid) || isSending}
        className="w-full h-[48px] mt-6 flex justify-center cursor-pointer items-center rounded-[8px] bg-black text-gray-100 font-nunitoSans font-[600] text-[16px] disabled:opacity-80 disabled:cursor-not-allowed transition-opacity duration-200"
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
    </form>
  );
};
