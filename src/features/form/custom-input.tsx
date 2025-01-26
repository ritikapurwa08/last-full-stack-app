import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
import {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
} from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import Image, { StaticImageData } from "next/image";

interface CustomInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  placeholder?: string;
  icon?: IconType | LucideIcon;
  disabled?: boolean;
  className?: string;
  error?: string;
  iconSrc?: string | StaticImageData;
  defaultValue?: PathValue<T, FieldPath<T>>;
  iconClassName?: string;
  labelClassName?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export default function CustomInput<T extends FieldValues>({
  name,
  className,
  error,
  icon: Icon,
  disabled,
  label,
  control,
  onChange,
  iconSrc,
  defaultValue,
  iconClassName,
  labelClassName,
}: Readonly<CustomInputProps<T>>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control, defaultValue });

  return (
    <FormItem className="relative flex  flex-col gap-y-0.5">
      <div className="relative group">
        <FormControl>
          <div className="relative flex items-center">
            {Icon && (
              <div className="absolute left-3 text-gray-400 group-hover:text-primary transition-colors duration-200">
                <Icon
                  size={20}
                  className={cn(
                    "transition-transform duration-200 group-hover:scale-110",
                    iconClassName
                  )}
                />
              </div>
            )}
            {iconSrc && (
              <div className="absolute left-3">
                <Image
                  src={iconSrc}
                  height={20}
                  width={20}
                  alt="Field icon"
                  className="transition-transform duration-200 group-hover:scale-110"
                />
              </div>
            )}

            <Input
              id={`${name}-input`}
              {...field}
              disabled={disabled}
              placeholder={label}
              className={cn(
                "w-full px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700",
                "text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500",
                "transition-all duration-200 ease-in-out",
                "hover:border-gray-300 dark:hover:border-gray-600",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary",
                "disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed",
                Icon || iconSrc ? "pl-10" : "pl-4",
                className
              )}
              onChange={(e) => {
                field.onChange(e);
                onChange?.(e);
              }}
            />

            <FormLabel
              htmlFor={`${name}-input`}
              className={cn(
                "absolute -top-2 left-2 px-1 text-xs font-medium",
                "bg-white dark:bg-gray-800",
                "text-gray-600 dark:text-gray-400",
                "transition-all duration-200",
                "group-hover:text-primary",
                labelClassName
              )}
            >
              {label}
            </FormLabel>
          </div>
        </FormControl>

        {(error || fieldError?.message) && (
          <FormMessage className="mt-1.5 text-xs font-medium text-red-500 dark:text-red-400 animate-slideDown">
            {error || fieldError?.message}
          </FormMessage>
        )}
      </div>
    </FormItem>
  );
}
