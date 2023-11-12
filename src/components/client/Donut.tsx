"use client";
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ColorHash from "color-hash";

ChartJS.register(ArcElement, Tooltip, Legend);
const colours = new ColorHash();

export const Donut: React.FC<{
  label: string;
  data: {
    value: number;
    label: string;
  }[];
}> = (props) => {
  return (
    <div>
      <h2 className="text-center text-3xl mb-4">{props.label}</h2>
      <Doughnut
        data={{
          labels: props.data.map((x) => x.label),
          datasets: [
            {
              backgroundColor: props.data.map((x) => colours.hex(x.label)),
              label: `Implied propability %`,
              data: props.data.map((x) => x.value),
            },
          ],
        }}
      />
    </div>
  );
};
