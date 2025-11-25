import { useCallback, useEffect, useMemo, useState } from "react";
import { Doughnut } from "react-chartjs-2";

import { api } from "@services";
import { useParams } from "@tanstack/react-router";
import { IStatisticsFee } from "@types";
import { ProgressCircular, Typography } from "@ui-kit";
import { endOfDay } from "date-fns";

import { chartOptions } from "../fee-charts.consts";

interface EventChartProps {
  canFetch: boolean;
  dateValues: string[];
  assetIds: string[];
  events: string[];
}

export const EventChart = ({ canFetch, dateValues, assetIds, events }: EventChartProps) => {
  const { id } = useParams({ from: "/auth/customers/$id" });
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<IStatisticsFee[]>([]);

  const data = useMemo(() => {
    const labels = items.map((item) => item.groupValue);

    return {
      labels,
      datasets: [
        {
          data: items.map((item) => item.amounts[0].amount),
          backgroundColor: ["#FFD268", "#6C9CEE"],
          borderWidth: 0,
        },
      ],
    };
  }, [items]);

  const getFeeStatistics = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.post(`/bo/api/customers/${id}/fees/statistics`, {
        groupBy: "Event",
        ...(dateValues.length === 2
          ? { fromTimestamp: new Date(dateValues[0]), toTimestamp: endOfDay(dateValues[1]) }
          : {}),
        assetIds,
        events,
      });

      setItems(data.groups);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, dateValues, assetIds, events]);

  useEffect(() => {
    if (canFetch) {
      void getFeeStatistics();
    }
  }, [canFetch, getFeeStatistics]);

  return (
    <div className="flex w-1/2 flex-col gap-6 rounded-xl border bg-background-subtle p-4">
      <Typography variant="heading-4">Fee by Event</Typography>

      {loading ? (
        <div className="flex h-[200px] items-center justify-center text-primary">
          <ProgressCircular indeterminate />
        </div>
      ) : data.datasets[0].data.length ? (
        <div className="flex gap-10">
          <div className="h-[232px] w-[232px]">
            <Doughnut data={data} options={chartOptions} />
          </div>

          <div className="flex flex-col gap-2 pt-1">
            {data.labels.map((label, index) => (
              <div key={label} className="flex items-center gap-2 pl-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: data.datasets[0]?.backgroundColor[index] }}
                />
                <Typography>{label}</Typography>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 p-10">
          <img src="../../no-data.svg" alt="no-data" className="h-[90px] w-[90px] object-cover" />
          <Typography variant="body-lg" color="secondary" className="font-normal">
            No Data
          </Typography>
        </div>
      )}
    </div>
  );
};
