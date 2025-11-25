import { TableStatusCell } from "@containers";
// import { RegionFormValues } from "@forms";
// import { useStore } from "@store";
import { HeaderItem } from "@ui-kit";

export const useRegionHeaders = () => {
  // const setDialogs = useStore((s) => s.setDialogs);
  // const setDialogMode = useStore((s) => s.setDialogMode);
  // const setRegion = useStore((s) => s.setRegion);
  // const setSelectedIds = useStore((s) => s.setSelectedIds);

  // const handleEdit = (item: TableItem) => {
  //   setRegion({ ...item, regulated: item.regulated ? +item.regulated : 0 } as RegionFormValues);
  //   setDialogMode("update");
  //   setDialogs(["region"]);
  // };

  // const handleDelete = (id: number) => {
  //   setSelectedIds([id]);
  //   setDialogs(["delete"]);
  // };

  const headers: HeaderItem[] = [
    { text: "country name", value: "countryName" },
    { text: "iso3 country code", value: "iso3CountryCode" },
    { text: "iso3 numeric code", value: "iso3NumericCode" },
    {
      text: "status",
      value: (item) => typeof item?.status === "number" && <TableStatusCell status={item.status} />,
    },
    // {
    //   text: "enabled",
    //   value: (item) =>
    //     typeof item?.status === "number" && <TableSwitchCell status={item.status} id={item.id as number} />,
    // },
    // {
    //   text: "",
    //   value: (item) => (
    //     <TableActionsCell actions={["edit", "delete"]} item={item} onEdit={handleEdit} onDelete={handleDelete} />
    //   ),
    //   width: 80,
    // },
  ];

  return {
    headers,
  };
};
