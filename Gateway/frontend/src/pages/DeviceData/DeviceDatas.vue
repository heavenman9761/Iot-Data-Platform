<template>
  <v-container fluid>
    <div class="tables-basic">
      <h1 class="page-title mt-10 mb-6">Data List</h1>
      <v-row>
        <v-col cols="12">
          <v-card
            elevation="6"
          >
          <v-row>
            <v-col cols="2.75">
              <v-combobox
                v-model="deviceNameListSelect"
                :items="deviceNameList"
                label="Select Device"
                @change="updateDatakeys(`${deviceNameListSelect}`)"
              ></v-combobox>
            </v-col>
            <v-col cols="2.75">
              <v-combobox
                v-model="deviceDatakeyListSelect"
                :items="deviceDatakeyList"
                label="Select Data"
              ></v-combobox>
            </v-col>
            <v-col cols="2.75">
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
            <v-col cols="2.75">
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
            <v-col cols="1">
              <v-btn
                color="primary"
                dark
                @click="getDeviceData()"
              >
                Get Data
              </v-btn>
            </v-col>
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
                  <p>Daily Line Chart</p>
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
                  <LineChart 
                    v-if="apexLoading"
                  ></LineChart>
                  <!-- <ApexChart
                    v-if="apexLoading"
                    type="line"
                    height="350"
                    :options="chartOptions"
                    :series="series"
                  ></ApexChart> -->
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
// import ApexChart from "vue-apexcharts";
import LineChart from '../../components/Chart/LineChart.vue'

export default {
  name: 'Devices',
  components: {
    LineChart,
  },
  props:{
    
  },
  data() {
    return {
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
    }
  },
  created () {
    this.getItems()
  },
  methods: {
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
      const obj = {
        device: this.deviceNameListSelect,
        datakey: this.deviceDatakeyListSelect,
        startDate: this.startDate,
        endDate: this.endDate,
      }
      const path = `/api/devicedata/getdata2`
      axios
        .post(path, obj)
        .then(res => {
          if (res.status === 200) {
            this.items = res.data

            this.chartDatas = []
            this.items.forEach(value => {
              this.chartDatas.push(value.data)
            })

            // this.chartOptions.series = [{
            //   data: this.chartDatas
            // }]

            this.apexLoading = true;
            // console.log(this.chartOptions.series)

            // var groubedByTeam = this.groupBy(this.items, 'data')
            // console.log(groubedByTeam);
          }
        })
        .catch(error => {
          this.errorHandler(error)
        })
    },

    groupBy(xs, key) {
      return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    },

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
  mounted() {
    setTimeout(() => {
      // this.apexLoading = true;
    });
  },
}
</script>

<!-- <style src="./Basic.scss" lang="scss"></style> -->
