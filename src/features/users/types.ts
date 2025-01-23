import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const SignUpZodSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required." }),
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Please enter a valid email address." })
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address."
      ),
    password: z
      .string()
      .min(1, { message: "Password is required." })
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // This ensures the error is attached to the confirmPassword field
  });
export type SignUpZodType = z.infer<typeof SignUpZodSchema>;

const SignInZodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type SignInZodType = z.infer<typeof SignInZodSchema>;

export const UseSignUpZodForm = () => {
  const form = useForm<SignUpZodType>({
    resolver: zodResolver(SignUpZodSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return form;
};

export const UseSignInZodForm = () => {
  const form = useForm<SignInZodType>({
    resolver: zodResolver(SignInZodSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return form;
};
