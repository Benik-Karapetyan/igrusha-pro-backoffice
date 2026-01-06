import { ExpenseFormValues } from "@forms";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { Button, HeaderItem, Icon, TableItem } from "@ui-kit";
import { deleteIcon, editIcon, formatCurrency } from "@utils";
import { format } from "date-fns";
import { omit } from "lodash";

export const useExpenseHeaders = () => {
  const setDrawerType = useStore((s) => s.setDrawerType);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setExpense = useStore((s) => s.setExpense);
  const setSelectedExpenseId = useStore((s) => s.setSelectedExpenseId);

  const handleEdit = (item: TableItem) => {
    setExpense({
      ...omit(item, "createdBy"),
      createdAt: format(new Date(item.createdAt as string), "yyyy-MM-dd"),
    } as ExpenseFormValues);
    setDialogMode("update");
    setDrawerType("expense");
  };

  const handleDelete = (item: TableItem) => {
    setSelectedExpenseId(item._id as string);
  };

  const headers: HeaderItem[] = [
    {
      text: "type",
      value: "type",
      width: "20%",
      maxWidth: "20%",
    },
    {
      text: "description",
      value: "description",
      width: "20%",
      maxWidth: "20%",
    },
    {
      text: "amount",
      value: (item) => (typeof item.amount === "number" ? formatCurrency(item.amount) : <Icon name={mdiMinus} dense />),
      width: "20%",
      maxWidth: "20%",
    },
    {
      text: "created by",
      value: (item) =>
        typeof item.createdBy === "object" &&
        typeof item.createdBy.firstName === "string" &&
        typeof item.createdBy.lastName === "string" ? (
          `${item.createdBy.firstName} ${item.createdBy.lastName}`
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: "20%",
      maxWidth: "20%",
    },
    {
      text: "created at",
      value: (item) =>
        typeof item.createdAt === "string" ? (
          format(new Date(item.createdAt), "dd.MM.yyyy")
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "",
      value: (item) => (
        <div className="flex justify-end gap-3 p-1">
          <Button variant="ghost" size="iconSmall" onClick={() => handleEdit(item)}>
            <Icon name={editIcon} color="icon-primary" />
          </Button>

          <Button variant="ghost" size="iconSmall" onClick={() => handleDelete(item)}>
            <Icon name={deleteIcon} color="icon-error" />
          </Button>
        </div>
      ),
      width: 80,
    },
  ];

  return {
    headers,
  };
};
