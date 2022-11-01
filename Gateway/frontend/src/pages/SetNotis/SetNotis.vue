<template>
  <v-container fluid>
    <div class="tables-basic">
      <h1 class="page-title mt-10 mb-6">Set Notis</h1>
      <v-row>
        <v-col cols="12">
          <v-card class="employee-list mb-1">
            <!--           <v-card-title class="pa-6 pb-3">
              <p>Device List</p>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                clearable
                single-line
                hide-details
              ></v-text-field>
            </v-card-title> -->

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
                  <!--                  <v-toolbar-title>My CRUD</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider> -
                  <v-spacer></v-spacer> -->
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    clearable
                    single-line
                    hide-details
                    sm="3"
                  ></v-text-field>
                  <v-spacer></v-spacer>
                  <v-spacer></v-spacer>
                  <v-spacer></v-spacer>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        dark
                        small
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                      >
                        New Item
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-combobox
                                v-model="editedItem.device"
                                :items="deviceNameList"
                                label="Select Device"
                                required
                                @change="updateDatakeys(`${editedItem.device}`)"
                              ></v-combobox>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-combobox
                                v-model="editedItem.datakey"
                                :items="deviceDatakeyList"
                                label="Data"
                                required
                              ></v-combobox>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="6" sm="6" md="6">
                              <v-text-field
                                v-model="editedItem.threshold"
                                label="설정값"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col cols="3" sm="3" md="3">
                              <v-checkbox
                                v-model="editedItem.morethan"
                                label="이상"
                              ></v-checkbox>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-combobox
                                v-model="actionItemsSelect"
                                :items="actionItems"
                                label="동작"
                                required
                                @change="updateAction(`${actionItemsSelect}`)"
                              ></v-combobox>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-checkbox
                                v-model="editedItem.realchart"
                                label='실시간챠트'
                              ></v-checkbox>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">
                          Cancel
                        </v-btn>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="save"
                        >
                          Save
                        </v-btn>
                        <!-- <v-btn disabled text>
                          SSave
                        </v-btn> -->
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                      <v-card-title class="text-h5"
                        >Are you sure you want to delete this
                        item?</v-card-title
                      >
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeDelete"
                          >Cancel</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="deleteItemConfirm"
                          >OK</v-btn
                        >
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:[`item.morethan`]="{ item }">
                <v-simple-checkbox
                  v-model="item.morethan"
                  disabled
                ></v-simple-checkbox>
              </template>
              <template v-slot:[`item.action`]="{ item }">
                {{ getAction(item.action) }}
              </template>
              <template v-slot:[`item.realchart`]="{ item }">
                <v-simple-checkbox
                  v-model="item.realchart"
                  disabled
                ></v-simple-checkbox>
              </template>
              <!-- <template v-slot:item.actions="{ item }"> -->
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'

export default {
    name: "Devices",
    data() {
      return {
        actionItemSelect: [],
        actionItems: ['알림', '경고','위험'],
        dialog: false,
        dialogDelete: false,
        deviceList: [],
        deviceNameList: [],
        deviceDatakeyList: [],
        items: [],
        editedItem: {
            id: "",
            device: "",
            datakey: "",
            threshold: "",
            morethan: "",
            action: "",
            realchart: "",
        },
        defaultItem: {
            id: "",
            device: "",
            datakey: "",
            threshold: "",
            morethan: "",
            action: "",
            realchart: "",
        },
        editedIndex: -1,
        selected: [],
        search: "",
        headers: [
          {
            text: "Device",
            align: "start",
            sortable: true,
            value: "device"
          },
          { text: "Datakey", value: "datakey" },
          { text: "설정값", value: "threshold" },
          { text: "이상", value: "morethan" },
          { text: "동작", value: "action" },
          { text: "실시간챠트", value: "realchart" },
          { text: 'Actions', value: 'actions', sortable: false }
        ]
      };
    },
    created() {
        this.getItems();
    },
    methods: {
        ...mapActions(["timeoutSession"]),
        getItems() {
            var path = `/api/devicedata/getdeviceinfo`;
            const d = {
                deviceName: "all"
            };
            axios
                .post(path, d)
                .then(res => {
                if (res.status === 200) {
                    this.deviceList = res.data;
                    this.fillDeviceNameList();
                    path = `/api/setnoti`;
                    axios
                        .get(path)
                        .then(res => {
                        if (res.status === 200) {
                            this.items = res.data;
                        }
                    })
                        .catch(error => {
                        this.errorHandler(error);
                    });
                }
            })
                .catch(error => {
                this.errorHandler(error);
            });
        },
        fillDeviceNameList() {
            this.deviceNameList = [];
            this.deviceNameListSelect = [];
            this.deviceList.forEach((d, index) => {
                this.$set(this.deviceNameList, index, d.name);
            });
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
      updateAction(value) {
        if (value === '알림') {
          this.editedItem.action = '1'
        } else if (value === '경고') {
          this.editedItem.action = '2'
        } else if (value === '위험') {
          this.editedItem.action = '3'
        }
        console.log(this.editedItem)
      },
      addItem(obj) {
          var path = `/api/setnoti/addnoti`;
          axios
            .post(path, obj)
            .then(() => {
              path = `/api/setnoti`;
              axios
                .get(path)
                .then(res => {
                if (res.status === 200) {
                  this.items = res.data;
                  this.$toast.success("등록이 완료되었습니다.");
                }
              })
                  .catch(error => {
                  this.errorHandler(error);
              });
              
          })
              .catch(error => {
              this.errorHandler(error);
          });
      },
      updateItem(obj) {
          var path = `/api/setnoti/editnoti`;
          axios
            .put(path, obj)
            .then(() => {
              path = `/api/setnoti`;
              axios
                .get(path)
                .then(res => {
                if (res.status === 200) {
                  this.items = res.data;
                  this.$toast.success("수정이 완료되었습니다.");
                }
              })
                  .catch(error => {
                  this.errorHandler(error);
              });
          })
              .catch(error => {
              this.errorHandler(error);
          });
      },
      removeItem(id) {
        var path = `/api/setnoti/remove/${id}`;
        axios
          .delete(path)
          .then(() => {
            path = `/api/setnoti`;
            axios
              .get(path)
              .then(res => {
              if (res.status === 200) {
                this.items = res.data;
                this.$toast.success("삭제가 완료되었습니다.");
              }
            })
              .catch(error => {
              this.errorHandler(error);
            });
        })
        .catch(error => {
          this.errorHandler(error);
        });
              
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
      editItem(item) {
          this.editedIndex = this.items.indexOf(item);
          this.editedItem = Object.assign({}, item);
          this.dialog = true;
      },
      deleteItem(item) {
          this.editedIndex = this.items.indexOf(item);
          this.editedItem = Object.assign({}, item);
          this.dialogDelete = true;
      },
      deleteItemConfirm() {
          this.removeItem(this.editedItem.id);
          this.closeDelete();
          this.close();
      },
      close() {
          this.dialog = false;
          this.$nextTick(() => {
              this.editedItem = Object.assign({}, this.defaultItem);
              this.editedIndex = -1;
          });
      },
      closeDelete() {
          this.dialogDelete = false;
          this.$nextTick(() => {
              this.editedItem = Object.assign({}, this.defaultItem);
              this.editedIndex = -1;
          });
      },
      getAction(value) {
        if (value === '1') {
          return '알림'
        } else if (value === '2') {
          return '경고'
        } else if (value === '3') {
          return '위험'
        }
      },  
      save() {
        console.log(this.editedItem)
        if (this.editedIndex > -1) {
            //수정
            const obj = {
              id: this.editedItem.id,
              device: this.editedItem.device,
              datakey: this.editedItem.datakey,
              threshold: this.editedItem.threshold,
              morethan: this.editedItem.morethan === '' ? '0' : this.editedItem.morethan,
              action: this.editedItem.action,
              realchart: this.editedItem.realchart === '' ? '0' : this.editedItem.realchart
            };
            this.updateItem(obj);
        }
        else {
            //새로이 등록
            const obj = {
              device: this.editedItem.device,
              datakey: this.editedItem.datakey,
              threshold: this.editedItem.threshold,
              morethan: this.editedItem.morethan === '' ? '0' : this.editedItem.morethan,
              action: this.editedItem.action,
              realchart: this.editedItem.realchart === '' ? '0' : this.editedItem.realchart
            };
            this.addItem(obj);
        }
        this.close();
      }
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? "New Device" : "Edit Device";
        }
    },
    watch: {
        dialog(val) {
            val || this.close();
        },
        dialogDelete(val) {
            val || this.closeDelete();
        }
    },
}
</script>

<!-- <style src="./Basic.scss" lang="scss"></style> -->
