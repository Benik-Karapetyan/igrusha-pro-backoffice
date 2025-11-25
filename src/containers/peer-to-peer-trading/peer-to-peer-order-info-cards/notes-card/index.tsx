import { TextCell, Typography } from "@ui-kit";

interface NotesCardProps {
  notes: string;
}

export const NotesCard = (props: NotesCardProps) => {
  const { notes } = props;

  return (
    <div className="flex flex-col gap-4 border-b border-dashed pb-4">
      <Typography variant="heading-4" color="secondary">
        Offer info
      </Typography>

      <TextCell title="Notes:" value={notes} hasBorder={false} />
    </div>
  );
};
