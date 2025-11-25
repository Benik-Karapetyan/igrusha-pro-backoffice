import { formatAmount } from "@utils";
import { TooltipItem } from "chart.js";

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context: TooltipItem<"doughnut">) {
          const label = context.label || "";
          const value = context.parsed;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${formatAmount(value)} (${percentage}%)`;
        },
      },
    },
  },
  cutout: "80%",
};
