<template>
  <v-container fluid>
    <div class="tables-basic">
      <h1 class="page-title mt-10 mb-6">Domain 정보 설정</h1>
      <v-row>
        <v-col cols="12">
          <v-card class="employee-list mb-1">
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="items"
              :search="search"
              item-key="saupjaid"
              show-select
            >
              <template v-slot:top>
                <v-toolbar flat>
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
                    <template v-if="items.length === 0" v-slot:activator="{ on, attrs }">
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
                              <v-text-field
                                v-model="editedItem.saupjaid"
                                :rules="saupjaRules"
                                label="사업자 번호"
                                required
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field
                                v-model="editedItem.saupjaname"
                                label="사업자명"
                                required
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field
                                v-model="editedItem.addr"
                                label="주소"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field
                                v-model="editedItem.tel"
                                label="전화번호"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field
                                v-model="editedItem.fax"
                                label="팩스번호"
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
                            editedItem.saupjaid === '' ||
                              editedItem.saupjaname === ''
                          "
                        >
                          Save
                        </v-btn>
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
  name: 'DomainInfo',
  data () {
    return {
      saupjaRules: [
        v => !!v || 'Saupja ID is required',
        v =>
          /([0-9]{3})-?([0-9]{2})-?([0-9]{5})/.test(v) ||
          'Saupja ID must be valid'
      ],
      dialog: false,
      dialogDelete: false,
      deviceTypes: [],
      items: [],
      editedItem: {
        id: '',
        saupjaid: '',
        saupjaname: '',
        addr: '',
        tel: '',
        fax:''
      },
      defaultItem: {
        id: '',
        devicetype: '',
        name: '',
        address: '',
        datakeys: '',
        onom2mkeys: ''
      },
      editedIndex: -1,
      selected: [],
      search: '',
      headers: [
        {
          text: '사업자번호',
          align: 'start',
          sortable: true,
          value: 'saupjaid'
        },
        { text: '사업자명', value: 'saupjaname' },
        { text: '주소', value: 'addr' },
        { text: '전화번호', value: 'tel' },
        { text: '팩스', value: 'fax' },
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
      const path = `/api/domaininfo`
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
    },

    updateItem (obj) {
      const path = `/api/domaininfo/setdomain`
      axios
        .post(path, obj)
        .then(() => {
          this.getItems()
          this.$toast.success('수정이 완료되었습니다.')
        })
        .catch(error => {
          this.errorHandler(error)
        })
    },

    errorHandler (error) {
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
      const obj = {
        id: this.editedItem.id,
        saupjaid: this.editedItem.saupjaid,
        saupjaname: this.editedItem.saupjaname,
        addr: this.editedItem.addr,
        tel: this.editedItem.tel,
        fax: this.editedItem.fax
      }
      console.log(obj)
      this.updateItem(obj)
      this.close()
    }
  },

  computed: {
    formTitle () {
      return 'Domain 정보 설정'
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
