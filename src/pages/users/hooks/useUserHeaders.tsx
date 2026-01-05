import { TableActionsCell } from "@containers";
import { ProductFormValues } from "@forms";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { HeaderItem, Icon, TableItem } from "@ui-kit";
import { checkIcon } from "@utils";

export const useUserHeaders = () => {
  const setDialogs = useStore((s) => s.setDialogs);
  const setDrawerType = useStore((s) => s.setDrawerType);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setProduct = useStore((s) => s.setProduct);

  const handleEdit = (item: TableItem) => {
    setProduct({
      ...item,
      relatedProducts: Array.isArray(item.relatedProducts) ? item.relatedProducts.map((product) => product._id) : [],
      ageRange: item.ageRange || { from: "", to: "" },
    } as unknown as ProductFormValues);
    setDialogMode("update");
    setDrawerType("product");
  };

  const handleDelete = (item: TableItem) => {
    setProduct({
      ...item,
    } as unknown as ProductFormValues);
    setDialogs(["delete"]);
  };

  const headers: HeaderItem[] = [
    { text: "first name", value: "firstName", width: "20%", maxWidth: "20%" },
    {
      text: "last name",
      value: "lastName",
      width: "20%",
      maxWidth: "20%",
    },
    {
      text: "email",
      value: "email",
      width: "20%",
      maxWidth: "20%",
    },
    {
      text: "address",
      value: (item) =>
        typeof item.address === "object" ? (
          <div className="py-2">
            {(item.address.street as string) || ""} {(item.address.building as string) || ""}, app.{" "}
            {(item.address.apartment as string) || ""}
            <div>{(item.address.zip as string) || ""}</div>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: "20%",
      maxWidth: "20%",
    },
    {
      text: "is admin",
      value: (item) => (item.isAdmin ? <Icon name={checkIcon} color="icon-success" /> : <Icon name={mdiMinus} dense />),
      width: "20%",
      maxWidth: "20%",
    },
    {
      text: "",
      value: (item) => (
        <TableActionsCell actions={["edit", "delete"]} item={item} onEdit={handleEdit} onDelete={handleDelete} />
      ),
      width: 80,
    },
  ];

  return {
    headers,
  };
};
