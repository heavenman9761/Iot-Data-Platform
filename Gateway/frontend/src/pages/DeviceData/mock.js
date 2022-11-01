export default {
  mainChartOptions: {
    chart: {
      chart: {
        id: 'chart',
        // type: 'line',
        animations: {
          enabled: false,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000
          }
        },
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      labels:[],
      stroke: {
        curve: 'smooth'
      },
      title: {
        // text: 'Dynamic Updating Chart',
        align: 'left'
      },
      markers: {
        size: 0
      },
      xaxis: {
        // range: 200
      },
      // xaxis: {
      //   type: 'datetime',
      //   // range: XAXISRANGE,
      // },
      // yaxis: {
      //   max: 100
      // },
      legend: {
        show: true
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100]
        }
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    markers: {
      size: 0
    },
    xaxis: {
      type: 'datetime',
      range: 100,
    },
    legend: {
      show: false
    },
  },
};
