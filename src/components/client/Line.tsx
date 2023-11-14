"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import ColorHash from "color-hash";
import { Line } from "react-chartjs-2";
const colours = new ColorHash();
ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  response: true,
  scales: {
    x: {
      type: "time",
      time: {
        unit: "day",
      },
    },
  },
};

export const LineChart: React.FC<{
  data: {
    outcome: string;
    oddsDecimal: number;
    timestamp: Date | string;
  }[];
}> = (props) => {
  const datasets = new Map<string, typeof props.data>();
  props.data.forEach((x) => {
    if (!datasets.has(x.outcome)) {
      datasets.set(x.outcome, [x]);
    } else {
      const existing = datasets.get(x.outcome);
      datasets.set(x.outcome, [...(existing !== undefined ? existing : []), x]);
    }
  });

  return (
    <Line
      data={{
        datasets: Array.from(datasets.entries()).map(([key, value]) => {
          return {
            label: key,
            backgroundColor: colours.hex(key),
            borderColor: colours.hex(key),
            data: value.map((z) => ({
              x: new Date(z.timestamp),
              y: z.oddsDecimal,
            })),
          };
        }),
      }}
      //@ts-ignore
      options={options}
    />
  );
};
