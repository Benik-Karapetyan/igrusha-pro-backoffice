import { TextCell, Typography } from "@ui-kit";

interface SummaryCardProps {
  min: string;
  max: string;
  available: string;
  completedOrdersCount: string;
  filledAmount: string;
}

export const SummaryCard = (props: SummaryCardProps) => {
  const { min, max, available, completedOrdersCount, filledAmount } = props;

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="heading-4" color="secondary">
        Summary
      </Typography>

      <div className="flex flex-col gap-3">
        <TextCell variant="row" title="Min:" value={min} className="w-full" restrictWidth={false} hasBorder={false} />
        <TextCell variant="row" title="Max:" value={max} className="w-full" restrictWidth={false} hasBorder={false} />
        <TextCell
          variant="row"
          title="Available:"
          value={available}
          className="w-full"
          restrictWidth={false}
          hasBorder={false}
        />
        <TextCell
          variant="row"
          title="Completed Orders Count:"
          value={completedOrdersCount}
          className="w-full"
          restrictWidth={false}
          hasBorder={false}
        />
        <TextCell
          variant="row"
          title="Filled Amount:"
          value={filledAmount}
          className="w-full"
          restrictWidth={false}
          hasBorder={false}
        />
      </div>
    </div>
  );
};
