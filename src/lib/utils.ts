import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatChf(value: number) {
  const [integer, decimals] = value.toFixed(2).split(".");
  const withApostrophes = integer.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return `CHF ${withApostrophes}.${decimals}`;
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)} %`;
}

