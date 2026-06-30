import { TableSwitchCell } from "@containers";
import { BrandFormValues } from "@forms";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { Button, HeaderItem, Icon, TableItem } from "@ui-kit";
import { deleteIcon, editIcon } from "@utils";

export const useBrandHeaders = () => {
  const setDialogs = useStore((s) => s.setDialogs);
  const setDrawerType = useStore((s) => s.setDrawerType);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setBrand = useStore((s) => s.setBrand);
  const setSelectedBrandId = useStore((s) => s.setSelectedBrandId);
  const setSelectedPublishBrand = useStore((s) => s.setSelectedPublishBrand);

  const handlePublishClick = (item: TableItem) => {
    setSelectedPublishBrand({
      _id: item._id as string,
      isPublished: item.isPublished as boolean,
    });
  };

  const handleEdit = (item: TableItem) => {
    setBrand(item as unknown as BrandFormValues);
    setDialogMode("update");
    setDrawerType("brand");
  };

  const handleDelete = (item: TableItem) => {
    setSelectedBrandId(item._id as string);
    setDialogs(["delete"]);
  };

  const headers: HeaderItem[] = [
    {
      text: "brand image",
      value: (item) =>
        item.image && typeof item.image === "string" ? (
          <div className="flex items-center justify-center p-5">
            <img
              src={item.image}
              alt={(item.name as { en: string }).en as string}
              className="h-auto w-[200px] min-w-[200px] object-cover"
            />
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: 250,
      maxWidth: 250,
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
          <TableSwitchCell checked={item.isPublished} onClick={() => handlePublishClick(item)} />
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
