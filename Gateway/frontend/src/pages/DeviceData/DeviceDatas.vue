<template>
  <v-container fluid>
    <div class="tables-basic">
      <h1 class="page-title mt-10 mb-6">Data List</h1>
      <v-row>
        <v-col cols="12">
          <v-card elevation="6">
            <v-row>
              <v-col cols="2.75">
                <v-combobox
                  v-model="deviceNameListSelect"
                  :items="deviceNameList"
                  label="Select Device"
                  @change="updateDatakeys(`${deviceNameListSelect}`)"
                ></v-combobox>
              </v-col>
              <v-col cols="2">
                <v-combobox
                  v-model="deviceDatakeyListSelect"
                  :items="deviceDatakeyList"
                  label="Select Data"
                ></v-combobox>
              </v-col>
              <v-col cols="2">
                <v-menu
                  ref="startDateMenu"
                  v-model="startDateMenu"
                  :close-on-content-click="false"
                  :return-value.sync="startDate"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="startDate"
                      label="Start Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="startDate"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="startDateMenu = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.startDateMenu.save(startDate)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="2">
                <v-menu
                  ref="endDateMenu"
                  v-model="endDateMenu"
                  :close-on-content-click="false"
                  :return-value.sync="endDate"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="endDate"
                      label="End Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="endDate"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="endDateMenu = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.endDateMenu.save(endDate)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="2">
                <v-text-field
                    light
                    id="limit"
                    ref="limit"
                    v-model="limit"
                    :rules="numberRules"
                    value="100"
                    label="Count"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-btn
                  color="primary"
                  dark
                  @click="getDeviceData()"
                >
                  Get Data
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card class="employee-list mb-1">
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="items"
              :search="search"
              item-key="name"
              show-select
            >
              <template v-slot:top>
                <v-toolbar flat>

                </v-toolbar>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card class="mx-1 mb-1">
            <v-card-title class="pa-6 pb-0">
              <v-row no-gutters>
                <v-col
                  cols="7"
                  sm="4"
                  md="4"
                  lg="5"
                  class="d-flex align-center"
                >
                  <p>Data Chart</p>
                </v-col>
                <v-col
                  sm="6"
                  md="6"
                  lg="5"
                  class="d-none d-sm-flex align-center"
                >
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text class="pa-6">
              <v-row>
                <v-col>
                  <apexchart 
                    ref="chart"
                    v-if="apexLoading"
                    type="area"
                    height="350"
                    :options="mock.mainChartOptions" 
                    :series="series"
                  ></apexchart>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card class="mx-1 mb-1">
            <v-card-title class="pa-6 pb-0">
              <v-row no-gutters>
                <v-col
                  cols="7"
                  sm="4"
                  md="4"
                  lg="5"
                  class="d-flex align-center"
                >
                  <p>Real Chart</p>
                </v-col>
                <v-col
                  sm="6"
                  md="6"
                  lg="5"
                  class="d-none d-sm-flex align-center"
                >
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text class="pa-6">
              <v-row>
                <v-col>
                  <apexchart 
                    ref="realchart"
                    type="line"
                    height="350"
                    :options="chartOptions" 
                    :series="series"
                  ></apexchart>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import VueApexCharts from "vue-apexcharts";
import mock from "./mock";

var realData = [];
const realChartCount = 100;

function getNewSeries(yrange) {
  var newDate = new Date();
  var newTime = newDate.toLocaleTimeString();

  realData.push({
    x: newTime,
    y: yrange //Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
  });
}

function resetData() {
  if (realData.length > realChartCount) {
    realData = realData.slice(realData.length - realChartCount, realData.length);
  }
}

export default {
  name: 'Devices',
  components: {
    apexchart: VueApexCharts,
  },
  props:{
    
  },
  data() {
    return {
      mock,
      limit: 100,
      numberRules: [
        v => Number.isInteger(Number(v)) || "The value must be an integer number",
      ],
      items: [],
      deviceList: [],
      deviceNameList: [],
      deviceNameListSelect:'',
      deviceDatakeyList: [],
      deviceDatakeyListSelect: '',
      startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      startDateMenu: false,
      endDate:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      endtDateMenu: false,
      apexLoading: false,
      chartDatas: [],
      chartLabels: [],
      timer: null, 
      headers: [
        {
          text: 'Device Name',
          align: 'start',
          sortable: false,
          value: 'devicename'
        },
        { text: 'Address', value: 'address' },
        { text: 'Data Key', value: 'field' },
        { text: 'Value', value: 'data' },
        { text: 'Update Time', value: 'createdAt' },
      ],
      series: [{ data: realData.slice() }],
      chartOptions: {
        chart: {
          id: 'realtime',
          animations: {
            enabled: true,
            easing: "linear",
            dynamicAnimation: {
              speed: 500
            }
          },
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth"
        },
        markers: {
          size: 0
        },
        xaxis: {
          // type: "datetime",
          range: realChartCount - 1 // 777600000
        },
        legend: {
          show: false
        }
      }
    }
  },
  created () {
    this.getItems()
  },
  beforeDestroy() {
    this.$socket.off('realData');
    clearInterval(this.timer);        
    this.timer = null;
    realData = [];
  },
  mounted() {
    this.$socket.on('realData', (p) => {    
      console.log(p);
      if (p.schema.realchart) {
        getNewSeries(p.realData);
        this.$refs.realchart.updateSeries([{ data: realData }]);
      }
    });
    this.timer = setInterval(() => {
      resetData();
      this.$refs.realchart.updateSeries([{ data: realData }], false, true);
    }, 60*1000)
  },
  methods: {
    sendMessage() {
      // this.$socket.emit('chat', {
      //   message: 'Vuejs에서 보낸 메세지',
      //   socketId: this.$socket.id
      // })
    },
    ...mapActions(['timeoutSession']),

    getItems() {
      this.deviceTypes = []
      var path = `/api/devicedata/getdeviceinfo`
      const d = {
        deviceName: 'all'
      }
      axios
        .post(path, d)
        .then(res => {
          if (res.status === 200) {
            this.deviceList = res.data
            this.fillDeviceNameList()
          }
        })
        .catch(error => {
          this.errorHandler(error)
        })
    },

    fillDeviceNameList() {
      this.deviceNameList = []
      this.deviceNameListSelect = []
      this.deviceList.forEach((d, index) => {
        this.$set(this.deviceNameList, index, d.name)
      })
    },

    updateDatakeys(value) {
      this.deviceList.forEach(d => {
        if (d.name === value) {
          const arr = d.datakeys.split(";")
          arr.forEach((dd, index) => {
            this.$set(this.deviceDatakeyList, index, dd)
          })
        }
      })
    },

    getDeviceData() {
      if (!this.limit) {
        this.limit = 10
      }
      const obj = {
        device: this.deviceNameListSelect,
        datakey: this.deviceDatakeyListSelect,
        startDate: this.startDate,
        endDate: this.endDate,
        limit: this.limit
      }
      const path = `/api/devicedata/getdata2`
      axios
        .post(path, obj)
        .then(res => {
          if (res.status === 200) {
            this.apexLoading = false;
            this.items = res.data

            this.chartDatas = []
            this.chartLabels = []
            this.items.forEach(value => {
              this.chartDatas.push(value.data)
              this.chartLabels.push(value.createdAt)
            })

            this.chartDatas.reverse()
            this.chartLabels.reverse()

            this.mock.mainChartOptions.xaxis = {
              categories: this.chartLabels,
              range: res.data.length,
              min: 0,
              max: res.data.length
            }
            this.series = [{
              data: []
            }]
            this.series = [{
              data: this.chartDatas
            }]
            // this.chartOptions.labels = this.chartLabels

            this.apexLoading = true;
          }
        })
        .catch(error => {
          this.errorHandler(error)
        })
    },

    // groupBy(xs, key) {
    //   return xs.reduce(function(rv, x) {
    //     (rv[x[key]] = rv[x[key]] || []).push(x);
    //     return rv;
    //   }, {});
    // },

    errorHandler (error) {
      console.log(error)
      if (error.response.status === 403 && error.response.data === '로그인 필요') {
        this.$toast.error('세션이 만료되었습니다. 다시 로그인해주십시요.')
        this.timeoutSession()
      } else if (error.response.status === 500) {
        //Internal Server Error
        this.$toast.error('작업 중 오류가 발생하였습니다.')
      }
    },
  },
}
</script>

<!-- <style src="./Basic.scss" lang="scss"></style> -->
