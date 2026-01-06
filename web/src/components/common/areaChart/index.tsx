import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

type Props = {
    data: {
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
}

echarts.use([
    GridComponent, 
    LineChart, 
    CanvasRenderer, 
    UniversalTransition,
]);



const AreaChartComponent = ({ data, height = 400, showLegend = true, horizontal = false }: Props) => {
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
        bottom: showLegend ? "15%" : "3%",
        top: "8%",
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          areaStyle: {}
        }
      ],
    //   series: data.series.map((s) => ({
    //     name: s.name,
    //     type: "line",
    //     areaStyle: {
    //       color: s.color,
    //     },
    //     data: s.data,
    //   })),
    };

    chartInstance.current.setOption(option);
  }, [data]);


  useEffect(() => {
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={chartRef} style={{ width: '100%', height: height }} />
  )
}

export default AreaChartComponent