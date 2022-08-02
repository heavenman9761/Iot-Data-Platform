import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from '../Routes'

Vue.use(Vuex);

export default new Vuex.Store({

  namespace: true,
  state: {
    drawer: true,
    userInfo: null,
    isLogin: false,
    isLoginError: false,
    joinError: false,
    errorMessage: "",
  },
  mutations: {
    toggleDrawer(state) {
      state.drawer = !state.drawer;
    },
    // 로그인이 성공했을때,
    loginSuccess(state, payload) {
      state.isLogin = true;
      state.isLoginError = false;
      state.userInfo = payload;
      state.errorMessage = '';
    },
    // 로그인이 실패했을때
    loginError(state, msg) {
      state.isLogin = false;
      state.isLoginError = true;
      state.errorMessage = msg;
    },
    logout(state) {
      state.isLogin = false;
      state.isLoginError = false;
      state.userInfo = null;
      state.errorMessage = '';
    },
    joinError(state, msg) {
      state.errorMessage = msg;
    }
  },
  actions: {
    TOGGLE_DRAWER({ commit }) {
      commit('toggleDrawer');
    },
    // 로그인 시도
    login({ commit }, loginObj) {
      const path = `/api/auth/login`;
      axios.post(path, loginObj)
        .then((res) => { // this를 쓰기위해 콜백을 이렇게 써야 한다.
          if (res.status === 200) {
            const userInfo = {
              userid: res.data.email,
              name: res.data.name,
            };

            commit('loginSuccess', userInfo);
            window.localStorage.setItem('authenticated', true);
            console.log('login success');
            router.push('/devices');

          } else if (res.status === 201) { //패스워드가 틀리거나 사용자가 없거나
            commit('loginError', res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    join({ commit }, joinObj) {
      const path = `/api/auth/join`;
      axios.post(path, joinObj)
        .then((res) => { 
          if (res.status === 200) {
            router.go();

          } else if (res.status === 201) { //이미 가입된 이메일입니다.
            commit('joinError', res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });   
    },
    logout({ commit }) {
      const path = `/api/auth/logout`;
      axios.get(path)
        .then(() => { // this를 쓰기위해 콜백을 이렇게 써야 한다.
          commit('logout');
          window.localStorage.setItem('authenticated', false);
          router.push('/');
        })
        .catch((err) => {
          console.log(err);
        });
    },
    timeoutSession({ commit }) {
      commit('logout');
      window.localStorage.setItem('authenticated', false);
      router.push('/');
    }
  },
  getters: {
    DRAWER_STATE(state) {
      return state.drawer;
    },
  }
});
