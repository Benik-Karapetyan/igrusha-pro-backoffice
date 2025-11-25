import { HeaderItem, Icon } from "@ui-kit";
import { checkedIcon } from "@utils";

export const useApiKeyDetailsHeaders = () => {
  const headers: HeaderItem[] = [
    {
      text: "Usage Area",
      value: "name",
    },
    {
      text: "Read Only",
      value: () => <Icon name={checkedIcon} color="icon-success" className="h-6 w-6" />,
    },
    {
      text: "Action",
      value: "",
    },
  ];

  return { headers };
};
