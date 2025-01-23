import React from "react";
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CustomPasswordInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  icon?: LucideIcon;
  showPassword?: boolean;
  setShowPassword?: (showPassword: boolean) => void;
  iconClassName?: string;
  labelClassName?: string;
}

const CustomPasswordInput = <T extends FieldValues>({
  control,
  name,
  label,
  disabled,
  className,
  error,
  onChange,
  showPassword,
  icon: Icon,
  iconClassName,
  labelClassName,
}: CustomPasswordInputProps<T>) => {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control });

  return (
    <FormItem className="relative flex flex-col gap-y-0.5">
      <div className="relative">
        <FormControl className="m-0 p-0">
          <div className="relative">
            {Icon && (
              <div className="absolute flex justify-center items-center top-1/2 transform -translate-y-1/2 w-10">
                <Icon
                  size={24}
                  className={cn("text-black/60", iconClassName)}
                />
              </div>
            )}

            <Input
              id={`${name}-input`}
              type={showPassword ? "text" : "password"}
              placeholder=" "
              {...field}
              disabled={disabled}
              className={cn(
                "h-11 bg-transparent text-black [&:-webkit-autofill]:text-black [&:-webkit-autofill]:[background-color:transparent] [&:-webkit-autofill]:[-webkit-text-fill-color:black] placeholder:text-black/60 border-0 border-b-2 border-b-zink-700 rounded-none focus:border-0 focus:border-b-2 focus:border-b-black ring-0 focus:ring-0 focus:ring-offset-0 transition-all duration-200 focus:outline-none focus:border-none focus-visible:outline-none focus-visible:ring-0 peer",
                Icon && "pl-10",
                className
              )}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                field.onChange(e);
                onChange?.(e);
              }}
            />

            <FormLabel
              htmlFor={`${name}-input`}
              className={cn(
                "absolute left-0 text-black/60 transform transition-all duration-200 cursor-text",
                Icon ? "left-10" : "left-2",
                "peer-placeholder-shown:text-md peer-placeholder-shown:-translate-y-7 peer-focus:-translate-y-[3.5rem] peer-focus:text-md peer-focus:text-black -translate-y-6",
                "peer-[&:not(:placeholder-shown)]:hidden",
                labelClassName
              )}
            >
              {label}
            </FormLabel>
          </div>
        </FormControl>
      </div>
      <FormMessage className="m-0 -mb-4 p-0 text-xs text-red-600">
        {(error || fieldError?.message) && (
          <span>{error || fieldError?.message}</span>
        )}
      </FormMessage>
    </FormItem>
  );
};

export default CustomPasswordInput;
