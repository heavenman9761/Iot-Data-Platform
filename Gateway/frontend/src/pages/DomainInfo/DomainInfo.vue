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
                            <v-col cols="3" sm="3" md="3">
                              <v-text-field
                                v-model="editedItem.postcode"
                                label="우편번호"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="3" sm="3" md="3">
                              <v-btn color="blue darken-1" text @click="execDaumPostcode()">
                                주소찾기
                              </v-btn>
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
                                v-model="editedItem.extraAddr"
                                label="상세주소"
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
        postcode: '',
        addr:'',
        extraAddr:'',
        tel: '',
        fax: '',
      },
      defaultItem: {
        id: '',
        saupjaid: '',
        saupjaname: '',
        postcode: '',
        addr:'',
        extraAddr:'',
        tel: '',
        fax: '',
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
      ],
    }
  },
  created () {
    this.getItems()
  },
  methods: {
    execDaumPostcode() {
      console.log("execDaumPostcode()")
      new window.daum.Postcode({
        oncomplete: (data) => {
          if (this.editedItem.extraAddr !== "") {
            this.editedItem.extraAddr = "";
          }
          if (data.userSelectedType === "R") {
            // 사용자가 도로명 주소를 선택했을 경우
            this.editedItem.addr = data.roadAddress;
          } else {
            // 사용자가 지번 주소를 선택했을 경우(J)
            this.editedItem.addr = data.jibunAddress;
          }
 
          // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
          if (data.userSelectedType === "R") {
            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
            if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
              this.editedItem.extraAddr += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if (data.buildingName !== "" && data.apartment === "Y") {
              this.editedItem.extraAddr +=
                this.editedItem.extraAddr !== ""
                  ? `, ${data.buildingName}`
                  : data.buildingName;
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if (this.editedItem.extraAddr !== "") {
              this.editedItem.extraAddr = `(${this.editedItem.extraAddr})`;
            }
          } else {
            this.editedItem.extraAddr = "";
          }
          // 우편번호를 입력한다.
          this.editedItem.postcode = data.zonecode;

          console.log(this.editedItem.postcode, this.editedItem.addr, this.editedItem.extraAddr);
        },
      }).open();
    },
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
        saupjaid: this.editedItem.saupjaid,
        saupjaname: this.editedItem.saupjaname,
        postcode: this.editedItem.postcode,
        addr: this.editedItem.addr,
        extraAddr: this.editedItem.extraAddr,
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
