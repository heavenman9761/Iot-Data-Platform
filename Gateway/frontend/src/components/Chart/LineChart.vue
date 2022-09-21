<template>
  <div class="example">
    <!-- <p>
      <label><b>Select Theme Palette</b> </label> &nbsp;
      <select @change="updateTheme">
        <option value="palette1">palette1</option>
        <option value="palette2">palette2</option>
        <option value="palette3">palette3</option>
        <option value="palette4">palette4</option>
        <option value="palette5">palette5</option>
        <option value="palette6">palette6</option>
        <option value="palette7">palette7</option>
        <option value="palette8">palette8</option>
        <option value="palette9">palette9</option>
        <option value="palette10">palette10</option>
      </select>
    </p> -->
    <apexcharts
      width="100%"
      height="350"
      type="line"
      :options="chartOptions"
      :series="series"
    ></apexcharts>
  </div>
</template>

<script>
import ApexCharts from "vue-apexcharts";
import config from '@/config';

export default {
  name: "LineChart",
  components: {
    apexcharts: ApexCharts
  },
  data: function() {
    return {
      chartOptions: {
        chart: {
          width: '100%',
          toolbar: {
            show: false
          },
        },
        dataLabels: {
          enabled: false
        },
        grid: {
          xaxis: {
            lines: {
              show: false,
            }
          },
          yaxis: {
            lines: {
              show: false,
            },
          }
        },
        markers: {
          size: [5, 0, 0]
        },
        stroke: {
          width: [3, 3, 0],
          curve: ['smooth']
        },
        fill: {
          type: 'linear',
        },
        legend: {
          show: false

        },
        colors: [config.light.warning, config.light.primary, '#f3f5ff'],
        yaxis: {
          axisBorder: {
            show: true,
            color: '#B9B9B980'
          },
          labels: {
            style: {
              colors: ['#B9B9B980','#B9B9B980','#B9B9B980','#B9B9B980','#B9B9B980', '#B9B9B980','#B9B9B980','#B9B9B980'],
              fontSize: '12px',
            },
          },
          tickAmount: 5
        },
        xaxis: {
          labels: {
            style: {
              fontSize: '12px',
              colors: ['#B9B9B980', '#B9B9B980','#B9B9B980','#B9B9B980','#B9B9B980','#B9B9B980', '#B9B9B980','#B9B9B980','#B9B9B980', '#B9B9B980','#B9B9B980', '#B9B9B980','#B9B9B980','#B9B9B980'],
            }
          },
          tickAmount: 10,
        }
      },
      series: [
        {
          name: 'LineChartSeries',
          type: 'line',
          data: [3100, 4000, 2800, 5100, 4200, 6090, 5100, 3100, 4000, 2800, 5100, 4200, 6090, 5100]
        },
      ],
    };
  },
  methods: {
    updateTheme(e) {
      this.chartOptions = {
        theme: {
          palette: e.target.value
        }
      };
    }
  }
};
</script>
