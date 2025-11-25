import { ICustomerNote } from "@types";
import { Typography } from "@ui-kit";
import { format } from "date-fns";

interface CustomerNoteItemProps {
  note: ICustomerNote;
}

export const CustomerNoteItem = (props: CustomerNoteItemProps) => {
  const { authorEmail, createdAt, note } = props.note;

  return (
    <div className="flex flex-col gap-2 rounded-md p-2">
      <div className="flex items-center justify-between">
        <Typography variant="heading-5">{authorEmail}</Typography>
        <Typography variant="body-sm" color="secondary">
          {format(new Date(createdAt), "dd.MM.yyyy hh:MM")}
        </Typography>
      </div>
      <Typography variant="body-sm">{note}</Typography>
    </div>
  );
};
