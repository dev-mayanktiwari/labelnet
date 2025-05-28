import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}

export function formatDate(date: Date | string): string {
  const formattedDate = dayjs(date).format("DD MMMM YYYY");
  return formattedDate;
}
