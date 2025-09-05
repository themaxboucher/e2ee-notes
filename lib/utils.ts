import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export function formatDate(timestamp: number | string | Date) {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export type PasswordStrength = "weak" | "medium" | "strong";

export function evaluatePasswordStrength(
  value: string | undefined | null
): PasswordStrength | null {
  const password = value ?? "";
  if (!password) return null;

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const lengthScore = password.length >= 12 ? 2 : password.length >= 8 ? 1 : 0;
  const variety = [hasLower, hasUpper, hasNumber, hasSymbol].filter(
    Boolean
  ).length;
  const score = lengthScore + Math.max(0, variety - 1);

  if (password.length < 8 || score <= 1) return "weak";
  if (score === 2) return "medium";
  return "strong";
}
