import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export const useCheckEmail = ({ email }: { email: string }) => {
  const checkEmail = useQuery(api.users.checkEmail, { email });
  const isCheckingEmail = checkEmail === undefined;
  return {
    checkEmail,
    isCheckingEmail,
  };
};
