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

export const formatCurrency = (value: number, currency: string = "AMD", locale: string = "hy-AM") => {
  if (currency === "AMD") {
    const absValue = Math.abs(value);
    const sign = value < 0 ? "-" : "";

    const numberFormatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true,
    });

    const parts = numberFormatter.formatToParts(1000);
    const groupSeparator = parts.find((p) => p.type === "group")?.value ?? ",";

    const formattedNumber = numberFormatter
      .format(absValue)
      .split(groupSeparator)
      .join(" ")
      .replace(/[\u00A0\u202F]/g, " ");

    return `${sign}${formattedNumber} ֏`;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};
