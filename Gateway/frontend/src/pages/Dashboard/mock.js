import config from '@/config';

const realChartCount = 10;

export default {
  realChartCount: realChartCount,
  apexArea1: {
    options: {
      chart: {
        sparkline: {
          enabled: true
        },
        animations: {
          enabled: true,
          easing: "linear",
          dynamicAnimation: {
            speed: 500
          }
        },
      },
      colors: [config.light.secondary],
      fill: {
        type: 'solid',
        opacity: 0.3,
      },
      stroke: {
        width: 2,
        curve: 'smooth'
      },
      legend: {
        show: false
      },
      xaxis: {
        range: realChartCount - 1
      }
    },
    series: [
      {
        data: [50, 50, 50, 50, 50, 50, 50]
      }
    ],
  },
};
