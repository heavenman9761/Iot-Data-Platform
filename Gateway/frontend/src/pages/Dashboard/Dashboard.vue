<template>
  <v-container fluid>
    <div class="dashboard-page">
      <v-row no-gutters class="d-flex justify-space-between mt-10 mb-6">
        <h1 class="page-title">Dashboard</h1>
      </v-row>
      <v-row v-for="device in items" :key="device.device">
        <v-col cols="12">
          <v-card-title class="pa-6 pb-3">
            <p>{{device.device}}</p>
          </v-card-title>

          <v-row >
            <v-col lg="4" sm="6" md="4" cols="12" v-for="noti in device.noti" :key="noti.datakey">
              <v-card class="mx-1 mb-1" style="min-height: 150px">
                <v-card-title class="pa-6 pb-3">
                  <p>{{noti.datakey}}</p>
                  <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text class="pa-6 pt-0">
                  <v-row no-gutters class="py-5">
                    <v-col cols="6" md="5" lg="6" xl="4" class="my-auto text-truncate">
                      <span class="text-h6 card-dark-grey font-weight-regular" style="font-size: 30px">
                        value: {{noti.realdata}}
                      </span>
                    </v-col>
                    <v-col cols="6" md="7" lg="6" xl="8">
                      <ApexChart
                        :ref = "'chart_' + device.device + '_' + noti.datakey"
                        height="35"
                        type="area"
                        :options="mock.apexArea1.options"
                        :series="mock.apexArea1.series"
                      ></ApexChart>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import mock from "./mock";
import ApexChart from "vue-apexcharts";
import axios from 'axios'
import { mapActions } from 'vuex'

function getNewSeries(noti) {
  var newDate = new Date();
  var newTime = newDate.toLocaleTimeString();

  noti.realDatas.push({
    x: newTime,
    y: noti.realdata //Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
  });
}

function resetData(d) {
  if (d.length > mock.realChartCount) {
    d = d.slice(d.length - mock.realChartCount, d.length);
  }
}

export default {
  name: "Dashboard",
  components: {
    ApexChart
  },
  data() {
    return {
      mock,
      value: this.getRandomInt(10, 90),
      value2: this.getRandomInt(10, 90),
      mainApexAreaSelect: "Daily",
      items:[]
    };
  },
  methods: {
    ...mapActions(["timeoutSession"]),
    getItems() {
      const path = `/api/setnoti`;
      axios
        .post(path)
        .then(res => {
          if (res.status === 200) {
            this.items = res.data;
          }
          this.items.forEach((item) => {
            item.noti.forEach((e) => {
              e.realDatas = [];
            })
          });
        })
        .catch(error => {
          this.errorHandler(error);
        });
    },
    getRandomDataForTrends() {
      const arr = [];
      for (let i = 0; i < 12; i += 1) {
        arr.push(Math.random().toFixed(1) * 10);
      }
      return arr;
    },
    generatePieSeries() {
      let series = [];

      for (let i = 0; i < 4; i++) {
        let y = Math.floor(Math.random() * (500 - 100 + 100)) + 100;
        series.push(y);
      }
      return series;
    },
    getRandomInt(min, max) {
      let rand = min - 0.5 + Math.random() * (max - min + 1);
      return Math.round(rand);
    },
    errorHandler(error) {
      console.log(error);
      if (error.response.status === 403 && error.response.data === "로그인 필요") {
          this.$toast.error("세션이 만료되었습니다. 다시 로그인해주십시요.");
          this.timeoutSession();
      }
      else if (error.response.status === 500) {
          //Internal Server Error
          this.$toast.error("작업 중 오류가 발생하였습니다.");
      }
    },
  },
  created() {
    this.getItems();
  },
  beforeDestroy() {
    this.$socket.off('realData');
    clearInterval(this.timer);        
    this.timer = null;
  },
  mounted() {
    this.$socket.on('realData', (p) => {
      // console.log(p);
      this.items.forEach((item) => {
        // console.log("=====", item);
        if (item.device === p.schema.device) {
          item.noti.forEach((noti) => {
            if (noti.datakey === p.schema.datakey) {
              noti.realdata = p.realData;
              // if (noti.datakey === "wetness") {
                getNewSeries(noti);
                const chartName = 'chart_' + item.device + '_' + noti.datakey;
                this.$refs[`${chartName}`][0].updateSeries([{ data: noti.realDatas }]);
              }
            // }
          });
        }
      });
    });
    this.timer = setInterval(() => {
      this.items.forEach((item) => {
        item.noti.forEach((noti) => {
          console.log("timer");
          resetData(noti);
          const chartName = 'chart_' + item.device + '_' + noti.datakey;
          this.$refs[`${chartName}`][0].updateSeries([{ data: noti.realDatas }]);
        });
      });
    }, 60*1000)
  },
};
</script>

<style src="./Dashboard.scss" lang="scss"/>
