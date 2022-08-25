<template>
  <v-container fluid>
    <div class="tables-basic">
      <h1 class="page-title mt-10 mb-6">Device List</h1>
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
                              <!--<v-text-field
                                v-model="editedItem.devicetype"
                                label="Device Type"
                              ></v-text-field>-->
                              <v-combobox
                                v-model="editedItem.devicetype"
                                :items="deviceTypes"
                                label="Select device type"
                                required
                              ></v-combobox>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field
                                v-model="editedItem.name"
                                label="Name"
                                :rules="nameRules"
                                required
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field
                                v-model="editedItem.address"
                                :rules="macAddressRules"
                                label="MAC address"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field
                                v-model="editedItem.datakeys"
                                label="Data Keys"
                                required
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field
                                v-model="editedItem.onem2mkeys"
                                label="oneM2M Keys"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field
                                v-model="editedItem.ae_name"
                                label="oneM2M Name"
                              ></v-text-field>
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
                          :disabled="
                            editedItem.devicetype === '' ||
                              editedItem.name === '' ||
                              editedItem.datakeys === ''
                          "
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
  name: 'Devices',
  data() {
    return {
      macAddressRules: [
        // v => !v || 'MacAddress is required',
        // v =>
        //   /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/.test(v) ||
        //   'MacAddress must be valid'
      ],
      nameRules: [
        // v => !!v || 'Name is required',
        // v => /^[0-9a-zA-Z]$/.text(v) ||
        // 'Name is required'
        v => !!v || '이름은 필수 입력사항입니다.',
        v => !(v && v.length >= 30) || '이름은 30자 이상 입력할 수 없습니다.',
        // v => !/[~!@#$%^&*()_+|<>?:{}]/.test(v) || '이름에는 특수문자를 사용할 수 없습니다.'
      ],
      dialog: false,
      dialogDelete: false,
      deviceTypes: [],
      items: [],
      editedItem: {
        id: '',
        devicetype: '',
        name: '',
        address: '',
        datakeys: '',
        onom2mkeys: '',
        ae_name: '',
      },
      defaultItem: {
        id: '',
        devicetype: '',
        name: '',
        address: '',
        datakeys: '',
        onom2mkeys: '',
        ae_name: '',
      },
      editedIndex: -1,
      selected: [],
      search: '',
      headers: [
        {
          text: 'Type',
          align: 'start',
          sortable: true,
          value: 'devicetype'
        },
        { text: 'Name', value: 'name' },
        { text: 'MacAddress', value: 'address' },
        { text: 'Data Keys', value: 'datakeys' },
        { text: 'oneM2M Keys', value: 'onem2mkeys' },
        { text: 'oneM2M Name', value: 'ae_name' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
  },
  created () {
    this.getItems()
  },
  methods: {
    ...mapActions([ 'timeoutSession' ]),
    getItems () {
      this.deviceTypes = []
      var path = `/api/devicetypes`
      axios
        .get(path)
        .then(res => {
          if (res.status === 200) {
            const datas = res.data
            datas.forEach(data => {
              this.deviceTypes.push(data.devicetype)
            })
            path = `/api/devices`
            axios
              .get(path)
              .then(res => {
                if (res.status === 200) {
                  this.items = res.data
                }
              })
              .catch(error => {
                this.errorHandler(error)
              })
          }
        })
        .catch(error => {
          this.errorHandler(error)
        })
    },

    addItem (obj) {
      const path = `/api/devices/addDevice`
      axios
        .post(path, obj)
        .then(() => {
          this.getItems()
          this.$toast.success('등록이 완료되었습니다.')
        })
        .catch(error => {
          this.errorHandler(error)
        })
    },

    updateItem (obj) {
      const path = `/api/devices/editDevice`
      axios
        .put(path, obj)
        .then(() => {
          this.getItems()
          this.$toast.success('수정이 완료되었습니다.')
        })
        .catch(error => {
          this.errorHandler(error)
        })
    },

    removeItem (id) {
      const path = `/api/devices/remove/${id}`
      axios
        .delete(path)
        .then(() => {
          this.getItems()
          this.$toast.success('삭제가 완료되었습니다.')
        })
        .catch(error => {
          this.errorHandler(error)
        })
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

    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.removeItem(this.editedItem.id)
      this.closeDelete()
      this.close()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        //수정
        const obj = {
          id: this.editedItem.id,
          devicetype: this.editedItem.devicetype,
          name: this.editedItem.name,
          address: this.editedItem.address,
          datakeys: this.editedItem.datakeys,
          onem2mkeys: this.editedItem.onem2mkeys,
          ae_name: this.editedItem.ae_name
        }
        this.updateItem(obj)
      } else {
        //새로이 등록
        const obj = {
          devicetype: this.editedItem.devicetype,
          name: this.editedItem.name,
          address: this.editedItem.address,
          datakeys: this.editedItem.datakeys,
          onem2mkeys: this.editedItem.onem2mkeys,
          ae_name: this.editedItem.ae_name
        }
        this.addItem(obj)
      }
      this.close()
    }
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Device' : 'Edit Device'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    }
  }
}
</script>

<!-- <style src="./Basic.scss" lang="scss"></style> -->
