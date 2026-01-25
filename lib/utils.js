import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";


export const sizes = ['S','M','L','XL','XXL']
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

