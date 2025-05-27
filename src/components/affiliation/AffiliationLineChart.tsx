'use client';

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type DataPoint = {
  date: string;
  affiliateCount: number;
  challengeCount: number;
};

export default function AffiliationLineChart({ data }: { data: DataPoint[] }) {
  const fullData = useMemo(() => {
    return data
      .map(d => ({ ...d, fullDate: new Date(d.date) }))
      .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
  }, [data]);

  const categories = fullData.map((d) => d.date);
  const affiliateSeries = fullData.map((d) => d.affiliateCount);
  const challengeSeries = fullData.map((d) => d.challengeCount);

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: true },
    },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.55, opacityTo: 0 },
    },
    stroke: { curve: "smooth", width: [2, 2] },
    markers: { size: 0 },
    grid: {
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: {
        shared: true,
        custom: function({
            series,
            dataPointIndex,
            w,
        }: {
            series: number[][];
            seriesIndex: number;
            dataPointIndex: number;
            w: {
            globals: {
                categoryLabels: string[];
                seriesNames: string[];
                colors: string[];
            };
            };
        }) {
            const date = w.globals.categoryLabels[dataPointIndex];

            const names = series.map((serieData, i) => {
            const value = serieData[dataPointIndex];
            const color = w.globals.colors[i];
            const label = w.globals.seriesNames[i];

            return `
                <div style="display: flex; align-items: center; margin-top: 4px;">
                <div style="width: 10px; height: 10px; border-radius: 50%; background: ${color}; margin-right: 8px;"></div>
                <span>${label}: <b>${value}</b></span>
                </div>`;
            });

            return `
            <div style="padding: 8px;">
                <div style="margin-bottom: 6px; font-weight: bold;">${date}</div>
                ${names.join("")}
            </div>`;
        }
        },
    xaxis: {
      type: "category",
      categories,
      labels: {
        rotate: -45,
        style: { fontSize: "10px" },
      },
    },
    yaxis: {
      min: 0,
      floating: false,
      forceNiceScale: false,
      tickAmount: 5,
      labels: {
        formatter: (val: number) => Math.round(val).toString(),
        style: { fontSize: '12px' },
      },
    },
  };

  const series = [
    { name: "Affiliés", data: affiliateSeries },
    { name: "Challenges", data: challengeSeries },
  ];

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartAffiliates" className="min-w-[1000px] xl:min-w-full">
        <ReactApexChart options={options} series={series} type="area" height={310} />
      </div>
    </div>
  );
}
