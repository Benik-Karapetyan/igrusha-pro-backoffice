import { isAxiosError } from "axios";
import Big from "big.js";

export const getErrorMessage = (error: unknown) => {
  const message = isAxiosError(error) ? error.response?.data?.message || error.response?.data : "";

  return message && typeof message === "string" ? message : "Something went wrong. Please try again or contact support";
};

export const formatScientificToFullNumber = (value?: number | string) => {
  if (value === undefined || value === "") return "";

  if (value === 0) return value;

  return new Big(value).toFixed();
};

export function timeAgo(timestamp: number): string {
  const now = new Date();
  const givenDate = new Date(timestamp);

  const diffInMs = now.getTime() - givenDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays <= 6) return `${diffInDays} days ago`;
  if (diffInDays <= 13) return "1 week ago";

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks === 4) return "1 month ago"; // Fix: Treat 4 weeks as 1 month
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;

  // Instead of dividing by 30, check if the given date is in the previous month
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  if (givenDate >= oneMonthAgo) return "1 month ago";

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} months ago`;

  return givenDate.toLocaleDateString(); // Returns formatted date if older than a year
}

export const isDecimal = (num: number) => !Number.isInteger(num);

export const getDecimalPlaces = (value: number) => {
  const str = new Big(value).toFixed();
  const [, decimals] = str.split(".");

  return decimals?.length || 0;
};

export const trimTrailingZeros = (value: string | number) => {
  return new Big(value).toString();
};

export const formatAmount = (amount?: number) => {
  if (typeof amount === "number") {
    if (isDecimal(amount)) {
      if (getDecimalPlaces(amount) > 14) {
        return trimTrailingZeros(amount.toFixed(14));
      }

      return trimTrailingZeros(amount);
    }

    return amount.toFixed(2);
  }

  return null;
};

export const capitalizeFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const fillMissingNumbers = (arr: number[]): number[] =>
  !arr || arr.length === 0 ? [] : Array.from({ length: Math.max(...arr) + 1 }, (_, i) => i);

export function getPaginationRows(current: number, total: number): (number | string)[] {
  const center = [current - 2, current - 1, current, current + 1, current + 2],
    filteredCenter: (number | string)[] = center.filter((p) => p > 1 && p < total),
    includeThreeLeft = current === 5,
    includeThreeRight = current === total - 4,
    includeLeftDots = current > 5,
    includeRightDots = current < total - 4;
  if (includeThreeLeft) filteredCenter.unshift(2);
  if (includeThreeRight) filteredCenter.push(total - 1);
  if (includeLeftDots) filteredCenter.unshift("...");
  if (includeRightDots) filteredCenter.push("...");
  return [1, ...filteredCenter, total];
}

export function convertScientificToDecimal(input: string | number): string {
  const num = typeof input === "string" ? Number(input) : input;

  if (isNaN(num)) return "Invalid number";

  // Convert to full decimal using toFixed and remove trailing zeroes
  const parts = num.toExponential().split("e");
  const exponent = parseInt(parts[1], 10);

  if (exponent >= 0) {
    return num.toString(); // normal number
  }

  // Convert negative exponent manually
  const decimalPlaces = Math.abs(exponent) + (parts[0].split(".")[1]?.length || 0);
  return num.toFixed(decimalPlaces).replace(/\.?0+$/, "");
}

export const splitCamelCase = (text: string) => {
  return text.replace(/([a-z])([A-Z])/g, "$1 $2");
};

export const getTimeDuration = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  let result = "";
  if (hours) result += `${hours} hour${hours > 1 ? "s" : ""} `;
  if (minutes) result += `${minutes} minute${minutes > 1 ? "s" : ""}`;

  return result;
};
