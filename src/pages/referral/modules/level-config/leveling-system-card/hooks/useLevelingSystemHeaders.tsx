import { Chip, HeaderItem } from "@ui-kit";

export const useLevelingSystemHeaders = () => {
  const headers: HeaderItem[] = [
    {
      text: "",
      value: (item) => typeof item.name === "string" && <Chip title={item.name} size="small" />,
      width: "33.3%",
    },
    {
      text: "min number of referred",
      value: "minReferrals",
      width: "33.3%",
    },
    {
      text: "referral reward",
      value: (item) => `${item.maxCommissionPercent}%`,
      width: "33.3%",
    },
  ];

  return {
    headers,
  };
};
