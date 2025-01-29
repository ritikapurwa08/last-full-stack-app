"use client";

import React, { useState } from "react";
import {
  SignInZodType,
  SignUpZodType,
  UseSignInZodForm,
  UseSignUpZodForm,
} from "../types";
import { useToast } from "@/hooks/use-toast";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import CustomInput from "@/features/form/custom-input";
import { MailIcon, UserIcon, KeyRoundIcon } from "lucide-react";
import SubmitButton from "@/features/form/submit-button";
import CustomPasswordInput from "@/features/form/custom-password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import bgImage from "../../../../public/off-roading-girl-desert-jeep-wrangler-wallpaper-preview.jpg";
import CustomEmailInput from "@/features/form/custom-email-input";

type ShowPasswordCheckBoxProps = {
  showPassword: boolean;
  handlePassword: () => void;
};

const ShowPasswordCheckBox = ({
  handlePassword,
  showPassword,
}: ShowPasswordCheckBoxProps) => {
  return (
    <main onClick={handlePassword} className="flex items-center space-x-2">
      <Checkbox
        id="show-password"
        className="border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
      />
      <Label className="text-zinc-900">
        {showPassword ? "Hide Password" : "Show Password"}
      </Label>
    </main>
  );
};

const UserSignUp = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { signIn } = useAuthActions();
  const router = useRouter();
  const form = UseSignUpZodForm();
  const [showPassword, setShowPassword] = useState(true);
  const [, setIsEmailAvailable] = useState(false);
  const handelUserSignIn = (formValues: SignUpZodType) => {
    setLoading(true);
    setError("");
    signIn("password", {
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
      customImage:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      flow: "signUp",
    })
      .then(() => {
        toast({
          title: "Success 🎉",
          description: "Your account has been created!",
          duration: 1000,
        });
        router.push("/");
      })
      .catch((err) => {
        setError((err as Error).message);
        toast({
          title: "Error ❌",
          description: `${error}`,
        });
      });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handelUserSignIn)}
        className="space-y-2"
      >
        <CustomInput
          control={form.control}
          label="Enter Your Name"
          name="name"
          placeholder="Enter your name"
          icon={UserIcon}
          iconClassName="text-black/60"
          className="auth-input"
          labelClassName="text-zinc-900"
        />

        <CustomEmailInput
          control={form.control}
          label="Email"
          name="email"
          setIsEmailAvailable={setIsEmailAvailable}
          placeholder="Enter your email"
          icon={MailIcon}
          className="auth-input"
        />

        <CustomPasswordInput
          control={form.control}
          label="Password"
          name="password"
          placeholder="Enter your password"
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          icon={KeyRoundIcon}
          iconClassName="text-black/70"
          className="auth-input"
        />

        <CustomPasswordInput
          control={form.control}
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm your password"
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          icon={KeyRoundIcon}
          iconClassName="text-black/70"
          className="auth-input"
        />
        <ShowPasswordCheckBox
          handlePassword={handleShowPassword}
          showPassword={showPassword}
        />

        <SubmitButton
          isLoading={loading}
          className="w-full bg-pink-400/70 hover:bg-pink-400/90"
        >
          Sign Up
        </SubmitButton>
      </form>
    </Form>
  );
};

const UserSignIn = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { signIn } = useAuthActions();
  const router = useRouter();
  const form = UseSignInZodForm();
  const [showPassword, setShowPassword] = useState(true);

  const handleUserSignIn = (formValues: SignInZodType) => {
    setLoading(true);
    setError("");
    signIn("password", {
      email: formValues.email,
      password: formValues.password,
      flow: "signIn",
    })
      .then(() => {
        toast({
          title: "Success 🎉",
          description: "You are logged in!",
          duration: 1000,
        });
        router.push("/");
      })
      .catch((err) => {
        setError((err as Error).message);
        toast({
          title: "Error ❌",
          description: `${error}`,
        });
      });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUserSignIn)}
        className="space-y-6"
      >
        <CustomInput
          control={form.control}
          label="Enter Your Name"
          name="email"
          placeholder="Enter your email"
          icon={MailIcon}
          iconClassName="text-black/70"
          className="auth-input"
        />

        <CustomPasswordInput
          control={form.control}
          label="Password"
          name="password"
          placeholder="Enter your password"
          showPassword={showPassword}
          iconClassName="text-black/70"
          setShowPassword={setShowPassword}
          icon={KeyRoundIcon}
          className="auth-input"
        />

        <ShowPasswordCheckBox
          handlePassword={handleShowPassword}
          showPassword={showPassword}
        />

        <SubmitButton variant="primary" isLoading={loading} className="w-full ">
          Sign In
        </SubmitButton>
      </form>
    </Form>
  );
};

const UserRegister = () => {
  const [type, setType] = useState<"signUp" | "signIn">("signUp");

  const handleToggleType = () => {
    setType(type === "signUp" ? "signIn" : "signUp");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover  bg-center"
      style={{ backgroundImage: `url(${bgImage.src})` }}
    >
      <div className="bg-white backdrop-blur-md rounded-lg p-8 shadow-lg w-full max-w-md">
        <section className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900">
            {type === "signIn" ? "Welcome Back! 👋" : "Create an Account 🚀"}
          </h1>
          <p className="text-zinc-800  mt-2">
            {type === "signIn"
              ? "Sign in to continue your journey."
              : "Sign up to get started."}
          </p>
        </section>
        <section className="mt-6">
          {type === "signUp" ? <UserSignUp /> : <UserSignIn />}
        </section>
        <section className="text-center mt-4">
          <Button
            variant="link"
            type="button"
            onClick={handleToggleType}
            className="text-blue-600 dark:text-blue-400"
          >
            {type === "signUp"
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Button>
        </section>
      </div>
    </div>
  );
};

export default UserRegister;
