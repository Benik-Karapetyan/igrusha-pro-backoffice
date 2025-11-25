import { CopyToClipboard } from "@containers";
import { TextCell, Typography } from "@ui-kit";

interface CustomerDetailsCardProps {
  cardTitle: string;
  customerId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  accountAge: string;
  completedOrTotalOrders: string;
  completionRate: string;
  attachments: number;
}

export const CustomerDetailsCard = (props: CustomerDetailsCardProps) => {
  const {
    cardTitle,
    customerId,
    fullName,
    email,
    phoneNumber,
    accountAge,
    completedOrTotalOrders,
    completionRate,
    attachments,
  } = props;

  return (
    <div className="flex flex-col gap-4 border-b border-dashed pb-4">
      <Typography variant="heading-4" color="secondary">
        {cardTitle}
      </Typography>

      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <TextCell
            title="Customer ID:"
            value={customerId}
            appendInner={<CopyToClipboard text={customerId} size="iconXSmall" />}
            className="w-[calc(25%_-_0.75rem)]"
          />
          <TextCell
            title="Full Name:"
            value={fullName}
            appendInner={<CopyToClipboard text={fullName} size="iconXSmall" />}
            className="w-[calc(25%_-_0.75rem)]"
          />
          <TextCell
            title="Email:"
            value={email}
            appendInner={<CopyToClipboard text={email} size="iconXSmall" />}
            className="w-[calc(25%_-_0.75rem)]"
          />
          <TextCell title="Phone Number:" value={phoneNumber} className="w-[calc(25%_-_0.75rem)]" hasBorder={false} />
        </div>

        <div className="flex gap-4">
          <TextCell title="Account Age:" value={accountAge} className="w-[calc(25%_-_0.75rem)]" />
          <TextCell
            title="Completed Orders / Total Orders:"
            value={completedOrTotalOrders}
            className="w-[calc(25%_-_0.75rem)]"
          />
          <TextCell title="Completion Rate:" value={completionRate} className="w-[calc(25%_-_0.75rem)]" />
          <TextCell title="Attachments:" value={attachments} className="w-[calc(25%_-_0.75rem)]" hasBorder={false} />
        </div>
      </div>
    </div>
  );
};
