import { ArcElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from "chart.js";

import { AssetChart } from "./asset-chart";
import { EventChart } from "./event-chart";

ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip);

interface FeeChartsProps {
  canFetch: boolean;
}

interface FeeChartsProps {
  dateValues: string[];
  assetIds: string[];
  events: string[];
}

export const FeeCharts: React.FC<FeeChartsProps> = ({ canFetch, dateValues, assetIds, events }) => {
  return (
    <div className="flex gap-4">
      <EventChart canFetch={canFetch} dateValues={dateValues} assetIds={assetIds} events={events} />

      <AssetChart canFetch={canFetch} dateValues={dateValues} assetIds={assetIds} events={events} />
    </div>
  );
};
