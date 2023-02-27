<template>
<!--  <img alt="Vue logo" src="./assets/logo.png">-->
  <auth-login></auth-login>
</template>

<script>
import AuthLogin from './views/auth/AuthLogin.vue'
// import firebase from "./firebaseInit";
// const db = firebase.firestore();
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap";
// import "./assets/css/style.css";
// import "./assets/css/styles.css";
export default {
  name: 'App',
  components: {
    AuthLogin
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
