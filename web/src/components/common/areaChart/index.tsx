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
        }[];
    };
    height?: number | string;
    showLegend?: boolean;
}

echarts.use([
    GridComponent, 
    LineChart, 
    CanvasRenderer, 
    UniversalTransition,
]);



const AreaChartComponent = ({ data, height = 500, showLegend = true }: Props) => {
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
        data: data.categories,
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: data.series[0].data,
          type: 'line',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(99, 102, 241, 0.5)',
            }, {
              offset: 1,
              color: 'rgba(99, 102, 241, 0)',
            }]),
          },
        }
      ],
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