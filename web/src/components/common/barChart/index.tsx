import * as echarts from "echarts/core";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { useEffect, useRef } from "react";

// Register ECharts components
echarts.use([
  GridComponent,
  LegendComponent,
  TooltipComponent,
  BarChart,
  CanvasRenderer,
]);

interface BarChartProps {
  data?: {
    categories: string[];
    series: {
      name: string;
      data: number[];
      color?: string;
    }[];
  };
  height?: number | string;
  showLegend?: boolean;
  horizontal?: boolean;
  color? : string;
}

const BarChartComponent = ({
  data,
  height = 500,
  showLegend = true,
  horizontal = false,
  color = "#4F46E5",
}: BarChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    // Initialize chart
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // Cleanup on unmount
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current || !data) return;

    const option: echarts.EChartsCoreOption = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        show: showLegend,
        data: data.series.map((s) => s.name),
        bottom: 0,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: showLegend ? "10%" : "3%",
        top: "8%",
        containLabel: true,
      },
      xAxis: {
        type: horizontal ? "value" : "category",
        data: horizontal ? undefined : data.categories,
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "#E2E8F0" } },
        axisLabel: { color: "#64748B", fontSize: 12, rotate: 90 },
      },
      yAxis: {
        type: horizontal ? "category" : "value",
        data: horizontal ? data.categories : undefined,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: "#E2E8F0", type: "dashed" } },
        axisLabel: { color: "#64748B" },
      },
      series: data.series.map((s) => ({
        name: s.name,
        type: "bar",
        barGap: "10%",
        barMaxWidth: 40,
        itemStyle: {
          borderRadius: horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0],
          color: s.color || color,
        },
        emphasis: {
          focus: "series",
        },
        data: s.data,
      })),
    };

    chartInstance.current.setOption(option);
  }, [data, showLegend, horizontal, color]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
};

export default BarChartComponent;
