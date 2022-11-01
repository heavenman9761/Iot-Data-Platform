<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  methods: {
    removeUser() {
      window.localStorage.setItem('authenticated', false);
    }
  },
  created() {
    window.addEventListener('beforeunload', this.removeUser),
    this.$socket.on('deviceNoti', (data) => {
      console.log('1', data)
      
    })  
  }
};
</script>

<style src="./styles/app.scss" lang="scss"/>


