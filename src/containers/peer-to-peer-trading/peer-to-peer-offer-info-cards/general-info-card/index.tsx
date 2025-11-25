import { ChipTypes, TextCell, Typography } from "@ui-kit";

interface GeneralInfoCardProps {
  offerId: string;
  offerType: string;
  chipType: ChipTypes;
  chipTitle: string;
  timeActive: string;
  creationTime: string;
  lastModified: string;
}

export const GeneralInfoCard = (props: GeneralInfoCardProps) => {
  const { offerId, offerType, chipType, chipTitle, timeActive, creationTime, lastModified } = props;

  return (
    <div className="flex flex-col gap-4 border-b border-dashed pb-4">
      <Typography variant="heading-4" color="secondary">
        General Info
      </Typography>

      <div className="flex flex-col gap-3">
        <TextCell
          variant="row"
          title="Offer ID:"
          value={offerId}
          className="w-full"
          restrictWidth={false}
          hasBorder={false}
        />
        <TextCell
          variant="row"
          title="Offer Type:"
          value={offerType}
          className="w-full"
          restrictWidth={false}
          hasBorder={false}
        />
        <TextCell
          variant="row"
          title="Status:"
          chipType={chipType}
          chipTitle={chipTitle}
          className="w-full"
          restrictWidth={false}
          hasBorder={false}
        />
        <TextCell
          variant="row"
          title="Time Active:"
          value={timeActive}
          className="w-full"
          restrictWidth={false}
          hasBorder={false}
        />
        <TextCell
          variant="row"
          title="Creation Time:"
          value={creationTime}
          className="w-full"
          restrictWidth={false}
          hasBorder={false}
        />
        <TextCell
          variant="row"
          title="Last Modified:"
          value={lastModified}
          className="w-full"
          restrictWidth={false}
          hasBorder={false}
        />
      </div>
    </div>
  );
};
