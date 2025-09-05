import { UseFormReturn } from "react-hook-form";
import { PasswordField } from "./PasswordField";
import { useMemo } from "react";
import { ShieldX, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn, evaluatePasswordStrength } from "@/lib/utils";

interface CreatePasswordFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function CreatePasswordField({
  form,
  name,
  label,
  placeholder,
  className,
}: CreatePasswordFieldProps) {
  const value: string = form.watch(name) || "";

  const strength = useMemo(() => evaluatePasswordStrength(value), [value]);

  return (
    <PasswordField
      form={form}
      name={name}
      label={label}
      placeholder={placeholder}
      className={className}
      description={
        strength ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 px-[2px]">
              <span
                className={cn(
                  "w-full h-1 rounded-full",
                  strength === "weak" && "bg-red-500",
                  strength === "medium" && "bg-yellow-500",
                  strength === "strong" && "bg-blue-600"
                )}
              />
              <span
                className={cn(
                  "w-full h-1 rounded-full",
                  strength === "weak" && "bg-muted/50",
                  strength === "medium" && "bg-yellow-500",
                  strength === "strong" && "bg-blue-600"
                )}
              />
              <span
                className={cn(
                  "w-full h-1 rounded-full",
                  strength === "weak" && "bg-muted/50",
                  strength === "medium" && "bg-muted/50",
                  strength === "strong" && "bg-blue-600"
                )}
              />
            </div>
            <span
              className="flex justify-end items-center gap-1"
              aria-live="polite"
            >
              {strength === "weak" && (
                <ShieldX className="size-4 text-red-500" />
              )}
              {strength === "medium" && (
                <ShieldAlert className="size-4 text-yellow-500" />
              )}
              {strength === "strong" && (
                <ShieldCheck className="size-4 text-blue-600" />
              )}

              <span className="capitalize font-semibold">{strength}</span>
            </span>
          </div>
        ) : undefined
      }
    />
  );
}
