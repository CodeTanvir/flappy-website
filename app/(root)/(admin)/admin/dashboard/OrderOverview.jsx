// OrderOverview.tsx
"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import useFetch from "@/hooks/useFetch";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "green",   // or use "hsl(var(--chart-1))" etc. if following shadcn theme
  },
};

export function OrderOverview() {
  const [chartData, setChartData] = useState([]);
  const { data: monthlySales } = useFetch("/api/dashboard/admin/monthly-sales");

  useEffect(() => {
    if (monthlySales?.success && Array.isArray(monthlySales.data)) {
      const formatted = months.map((month, index) => {
        const monthData = monthlySales.data.find(
          (item) => item._id?.month === index + 1
        );

        return {
          month,
          sales: monthData ? monthData.totalSales : 0,
        };
      });

      setChartData(formatted);
    }
  }, [monthlySales]);

  return (
    <div className=" h-[360px] w-full px-1"> {/* ← give explicit height here */}
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="2 2" opacity={1} />

            <XAxis
              dataKey="month"
              tickFormatter={(value) => value.slice(0, 3)}
              tickLine={false}
              axisLine={false}
              tickMargin={4}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent  />}
            />

            <Line
              dataKey="sales"
              type="monotone"
              stroke="var(--color-sales)"
              strokeWidth={4}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}