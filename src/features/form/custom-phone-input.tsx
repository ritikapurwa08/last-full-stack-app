// import { E164Number } from "libphonenumber-js/core";
// import PhoneInput from "react-phone-number-input";
// import "react-phone-number-input/style.css";
// import {
//   Control,
//   FieldPath,
//   FieldValues,
//   PathValue,
//   useController,
// } from "react-hook-form";
// import {
//   FormControl,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { cn } from "@/lib/utils";

// interface CustomPhoneInputProps<T extends FieldValues> {
//   control: Control<T>;
//   name: FieldPath<T>;
//   label: string;
//   placeholder?: string;
//   disabled?: boolean;
//   className?: string;
//   defaultValue?: PathValue<T, FieldPath<T>>;
// }

// export default function CustomPhoneInput<T extends FieldValues>({
//   name,
//   className,
//   placeholder,
//   disabled,
//   label,
//   control,
//   defaultValue,
// }: Readonly<CustomPhoneInputProps<T>>) {
//   const {
//     field,
//     fieldState: { error },
//   } = useController({
//     name,
//     control,
//     defaultValue,
//   });

//   return (
//     <FormItem className={cn("flex flex-col gap-y-1", className)}>
//       {/* Form Label */}
//       <FormLabel className="text-sm -mb-2 text-light-200">{label}</FormLabel>

//       {/* Phone Input */}
//       <FormControl>
//         <div
//           className={cn(
//             "relative",
//             disabled && "opacity-50 cursor-not-allowed"
//           )}
//         >
//           <PhoneInput
//             defaultCountry="IN"
//             placeholder={placeholder}
//             international
//             withCountryCallingCode
//             value={field.value as E164Number | undefined}
//             onChange={field.onChange}
//             disabled={disabled}
//             className="input-phone"
//           />
//         </div>
//       </FormControl>

//       {/* Error Message */}
//       <FormMessage className="text-xs text-red-600">
//         {error?.message && <span>{error.message}</span>}
//       </FormMessage>
//     </FormItem>
//   );
// }
