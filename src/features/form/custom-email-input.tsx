// components/custom-email-input.tsx
"use client";

import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
} from "react-hook-form";
import { IconType } from "react-icons";
import { useDebounce } from "use-debounce";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import { Input } from "@/components/ui/input";
import { useCheckEmail } from "../users/user-query-hooks";

interface CustomEmailInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  icon?: IconType | LucideIcon;
  disabled?: boolean;
  className?: string;
  defaultValue?: PathValue<T, FieldPath<T>>;
}

interface CustomEmailInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  icon?: IconType | LucideIcon;
  iconSrc?: string | StaticImageData;
  disabled?: boolean;
  className?: string;
  defaultValue?: PathValue<T, FieldPath<T>>;
  setIsEmailAvailable: (isAvailable: boolean) => void;
  labelClassName?: string;
}

export default function CustomEmailInput<T extends FieldValues>({
  name,
  className,
  icon: Icon,
  disabled,
  label,
  control,
  defaultValue,
  iconSrc,
  setIsEmailAvailable,
  labelClassName,
}: Readonly<CustomEmailInputProps<T>>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control, defaultValue });

  const [email, setEmail] = useState(field.value || "");
  const [debouncedEmail] = useDebounce(email, 100);

  const { checkEmail, isCheckingEmail } = useCheckEmail({
    email: debouncedEmail,
  });

  useEffect(() => {
    setEmail(field.value || "");
  }, [field.value]);

  useEffect(() => {
    if (debouncedEmail && checkEmail !== undefined) {
      setIsEmailAvailable(!checkEmail);
    }
  }, [checkEmail, debouncedEmail, setIsEmailAvailable]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    field.onChange(value);
  };

  return (
    <FormItem className="relative flex flex-col gap-y-0.5">
      <div className="relative">
        <FormControl className="m-0 p-0">
          <div className="relative">
            {Icon && (
              <div className="absolute flex justify-center items-center top-1/2 transform -translate-y-1/2 w-10">
                <Icon size={24} />
              </div>
            )}
            {iconSrc && (
              <div className="absolute top-1/2 transform -translate-y-1/2">
                <Image
                  src={iconSrc}
                  height={24}
                  width={24}
                  alt={"icon"}
                  className="ml-2"
                />
              </div>
            )}

            {Icon && (
              <div className="absolute flex  justify-center items-center top-1/2 transform -translate-y-1/2 w-10">
                <Icon size={24} className="text-black/60" />
              </div>
            )}

            <Input
              id={`${name}-input`}
              placeholder=" "
              value={email}
              onChange={handleChange}
              disabled={disabled}
              className={cn(
                "h-11 bg-transparent text-black placeholder:text-black/60 border-0 border-b-2 border-b-zink-700 rounded-none focus:border-0 focus:border-b-2 focus:border-b-black ring-0 focus:ring-0 focus:ring-offset-0 transition-all duration-200 focus:outline-none focus:border-none focus-visible:outline-none focus-visible:ring-0 peer",
                Icon && "pl-10",
                iconSrc && "pl-10",
                className
              )}
            />

            <FormLabel
              htmlFor={`${name}-input`}
              className={cn(
                "absolute left-0 text-black/60 transform transition-all duration-200 cursor-text",
                Icon || iconSrc ? "left-10" : "left-2",
                "peer-placeholder-shown:text-md peer-placeholder-shown:-translate-y-7 peer-focus:-translate-y-[3.5rem] peer-focus:text-md peer-focus:text-black -translate-y-6",
                "peer-[&:not(:placeholder-shown)]:hidden",
                labelClassName
              )}
            >
              {label}
            </FormLabel>

            {/* Loading and Validation Icons */}
            <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
              {isCheckingEmail ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : debouncedEmail && checkEmail !== undefined ? (
                checkEmail ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )
              ) : null}
            </div>
          </div>
        </FormControl>
      </div>

      <FormMessage className="m-0 -mb-4  p-0 text-xs text-red-600">
        {fieldError?.message && <span>{fieldError.message}</span>}
        {debouncedEmail && checkEmail && (
          <span>This email is already registered.</span>
        )}
      </FormMessage>
    </FormItem>
  );
}
