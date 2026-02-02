import { TableSwitchCell } from "@containers";
import { CategoryFormValues, categoryTypes } from "@forms";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { Button, HeaderItem, Icon, TableItem } from "@ui-kit";
import { deleteIcon, editIcon } from "@utils";

export const useCategoryHeaders = () => {
  const setDialogs = useStore((s) => s.setDialogs);
  const setDrawerType = useStore((s) => s.setDrawerType);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setCategory = useStore((s) => s.setCategory);
  const setSelectedCategoryId = useStore((s) => s.setSelectedCategoryId);

  const handleEdit = (item: TableItem) => {
    setCategory(item as unknown as CategoryFormValues);
    setDialogMode("update");
    setDrawerType("category");
  };

  const handleDelete = (item: TableItem) => {
    setSelectedCategoryId(item._id as string);
    setDialogs(["delete"]);
  };

  const headers: HeaderItem[] = [
    {
      text: "type",
      value: (item) =>
        Array.isArray(item.type) && item.type.length > 0 ? (
          <div className="flex flex-col">
            {item.type
              .map((type) => categoryTypes.find((t) => t.id === type)?.name)
              .map((name) => (
                <div key={name}>{name}</div>
              ))}
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "url name",
      value: "urlName",
    },
    {
      text: "name",
      value: (item) =>
        typeof item.name === "object" &&
        typeof item.name.am === "string" &&
        typeof item.name.ru === "string" &&
        typeof item.name.en === "string" ? (
          <div className="flex flex-col gap-2 py-2">
            <div>{item.name.am}</div>
            <div>{item.name.ru}</div>
            <div>{item.name.en}</div>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "title",
      value: (item) =>
        typeof item.title === "object" &&
        typeof item.title.am === "string" &&
        typeof item.title.ru === "string" &&
        typeof item.title.en === "string" ? (
          <div className="flex flex-col gap-2 py-2">
            <div>{item.title.am}</div>
            <div>{item.title.ru}</div>
            <div>{item.title.en}</div>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "description",
      value: (item) =>
        typeof item.description === "object" &&
        typeof item.description.am === "string" &&
        typeof item.description.ru === "string" &&
        typeof item.description.en === "string" ? (
          <div className="flex flex-col gap-2 py-2">
            <div>{item.description.am}</div>
            <div>{item.description.ru}</div>
            <div>{item.description.en}</div>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: 350,
      maxWidth: 350,
    },
    {
      text: "published",
      value: (item) =>
        typeof item.isPublished === "boolean" ? (
          <TableSwitchCell checked={item.isPublished} />
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: 95,
      maxWidth: 95,
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
      width: 100,
      maxWidth: 100,
    },
  ];

  return {
    headers,
  };
};
