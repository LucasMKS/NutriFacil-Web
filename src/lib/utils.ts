import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function saoPreferenciasIguais(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b);
}
