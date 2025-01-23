import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
}

const SubmitButton = ({
  isLoading,
  className,
  children,
  disabled,
  variant = "primary",
}: ButtonProps) => {
  const buttonStyles = {
    primary: "bg-pink-400/70 hover:bg-pink-400/90 text-black",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    outline: "border-2 border-pink-400 text-pink-400 hover:bg-pink-400/10",
  };

  return (
    <Button
      type="submit"
      disabled={isLoading || disabled}
      className={cn(
        "w-full transition-colors duration-200",
        buttonStyles[variant],
        className
      )}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <LoaderIcon className="animate-spin" />
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
