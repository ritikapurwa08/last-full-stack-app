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
    customImage: z.string(),
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
      customImage:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
