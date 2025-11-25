import { CopyToClipboard } from "@containers";
import { TextCell, Typography } from "@ui-kit";

interface UserInfoCardProps {
  makerId: string;
  verifiedName: string;
  nickname: string;
  email: string;
  accountNumber: string;
}

export const UserInfoCard = (props: UserInfoCardProps) => {
  const { makerId, verifiedName, nickname, email, accountNumber } = props;

  return (
    <div className="flex flex-col gap-4 border-b border-dashed pb-4">
      <Typography variant="heading-4" color="secondary">
        User Info
      </Typography>

      <div className="flex flex-col gap-3">
        <TextCell
          variant="row"
          title="Maker ID:"
          value={makerId}
          appendInner={<CopyToClipboard text={makerId} size="iconXSmall" />}
          className="w-full"
          restrictWidth={false}
          hasBorder={false}
        />
        <TextCell
          variant="row"
          title="Verified Name:"
          value={verifiedName}
          appendInner={<CopyToClipboard text={verifiedName} size="iconXSmall" />}
          className="w-full"
          restrictWidth={false}
          hasBorder={false}
        />
        <TextCell
          variant="row"
          title="Nickname:"
          value={nickname}
          appendInner={<CopyToClipboard text={nickname} size="iconXSmall" />}
          className="w-full"
          restrictWidth={false}
          hasBorder={false}
        />
        <TextCell
          variant="row"
          title="Email:"
          value={email}
          appendInner={<CopyToClipboard text={email} size="iconXSmall" />}
          className="w-full"
          restrictWidth={false}
          hasBorder={false}
        />
        <TextCell
          variant="row"
          title="Account Number:"
          value={accountNumber}
          appendInner={<CopyToClipboard text={accountNumber} size="iconXSmall" />}
          className="w-full"
          restrictWidth={false}
          hasBorder={false}
        />
      </div>
    </div>
  );
};
