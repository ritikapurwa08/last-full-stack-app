import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";

interface CustomSwitchProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
}

export default function CustomSwitch<T extends FieldValues>({
  name,
  className,
  label,
  control,
}: Readonly<CustomSwitchProps<T>>) {
  const {
    field: { onChange, value, ...field },
  } = useController({ name, control });

  return (
    <FormItem className="flex flex-row items-center justify-between">
      <div className="space-y-0.5">
        <FormLabel className="text-white">{label}</FormLabel>
      </div>
      <FormControl>
        <Switch
          checked={!!value}
          onCheckedChange={(checked: boolean) => {
            onChange(checked);
          }}
          aria-label={label}
          className={cn("bg-pink-500 ", className)}
          {...field}
        />
      </FormControl>
    </FormItem>
  );
}
