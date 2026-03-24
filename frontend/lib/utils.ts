import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split("; ");
  const authToken = cookies.find((row) => row.startsWith(`${name}=`));
  return authToken ? authToken.split("=")[1]?.split(",")[0] : null;
};
