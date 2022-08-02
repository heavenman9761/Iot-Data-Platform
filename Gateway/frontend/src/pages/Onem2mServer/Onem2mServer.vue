<template>
  <v-container fluid>
    <div class="tables-basic">
      <h1 class="page-title mt-10 mb-6">OneM2M Server 설정</h1>
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
                                v-model="editedItem.address"
                                :rules="saupjaRules"
                                label="서버 주소"
                                required
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
      dialog: false,
      dialogDelete: false,
      items: [],
      editedItem: {
        id: '',
        address: '',
      },
      defaultItem: {
        id: '',
        address: '',
      },
      editedIndex: -1,
      selected: [],
      search: '',
      headers: [
        {
          text: '서버 주소',
          align: 'start',
          sortable: true,
          value: 'address'
        },
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
      const path = `/api/onem2mserver`
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
      const path = `/api/onem2mserver/setonem2mserver`
      axios
        .post(path, obj)
        .then(res => {
          if (res.status === 200) {
            this.getItems()
            this.$toast.success('수정이 완료되었습니다.')
          }
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
        address: this.editedItem.address,
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
