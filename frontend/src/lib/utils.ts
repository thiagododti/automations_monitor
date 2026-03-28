import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Remove todos os caracteres não-dígitos de uma string.
 * Ex: "12.345-67" → "1234567"
 */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}
