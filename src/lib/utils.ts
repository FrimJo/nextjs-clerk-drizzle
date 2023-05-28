import { User } from "@clerk/nextjs/dist/types/server";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPrimaryEmailAddress = (user: User) => {
  const { primaryEmailAddressId } = user;
  if (primaryEmailAddressId === null) return undefined;
  const primaryEmailAddress = user.emailAddresses.find((emailAddress) => emailAddress.id === primaryEmailAddressId);
  return primaryEmailAddress?.emailAddress;
};
