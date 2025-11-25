import { Typography } from "@ui-kit";

interface NotesCardProps {
  notes: string;
}

export const NotesCard = (props: NotesCardProps) => {
  const { notes } = props;

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="heading-4" color="secondary">
        Notes
      </Typography>

      <Typography>{notes}</Typography>
    </div>
  );
};
