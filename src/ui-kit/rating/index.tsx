import { mdiStar, mdiStarHalfFull, mdiStarOutline } from "@mdi/js";

import { Icon } from "../icon";
import { Typography } from "../typography";

interface RatingProps {
  value?: number;
  reviewCount?: number;
  hideText?: boolean;
}

export const Rating = ({ value = 0, reviewCount = 0, hideText = false }: RatingProps) => {
  const getIcon = (index: number) => {
    if (value >= index) {
      return mdiStar;
    } else {
      if (Math.round(value) === index) {
        return mdiStarHalfFull;
      } else {
        return mdiStarOutline;
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-x-2">
      <div className="text-amber-400">
        <Icon name={getIcon(1)} dense color="current" />
        <Icon name={getIcon(2)} dense color="current" />
        <Icon name={getIcon(3)} dense color="current" />
        <Icon name={getIcon(4)} dense color="current" />
        <Icon name={getIcon(5)} dense color="current" />
      </div>

      <Typography variant="body-sm" className="mt-0.5">
        {reviewCount ? `(${reviewCount})` : hideText ? null : "No reviews yet"}
      </Typography>
    </div>
  );
};
