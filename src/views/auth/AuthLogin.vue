<template>
    <div  class="account-page">

    <div class="main-wrapper">
        <div class="account-content">
            <div class="container">
                <div class="account-logo">
                    <a href="#"><img src="../../assets/images/logo2.png" alt="Dreamguy's Technologies"></a>
                </div>

                <div class="account-box">
                    <div class="account-wrapper">
                        <h3 class="account-title">Login</h3>
                        <p class="account-subtitle">Access to our dashboard</p>

                        <div>
                            <div class="form-group">
                                <label>Email Address</label>
                                <input v-model="user.email"
                                       class="form-control"
                                       type="text" >
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col">
                                        <label>Password</label>
                                    </div>
                                    <div class="col-auto">
                                        <a class="text-muted" href="/forgot-password">
                                            Forgot password?
                                        </a>
                                    </div>
                                </div>
                                <div class="position-relative">
                                    <input v-model="user.password"
                                           class="form-control" type="password">
                                    <span class="fa fa-eye-slash" id="toggle-password"></span>
                                </div>
                            </div>
                            <div class="form-group text-center">
                                <button class="btn btn-primary account-btn" type="button" @click="login()">Login</button>
                            </div>
                            <div class="account-footer">
                                <p>Don't have an account yet? <a href="/register">Register</a></p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <!--<%- include("../components/notification.ejs") %>-->

    </div>

    <!--<script src="/assets/js/app.js"></script>-->

    </div>
</template>

<script>
    import Vue from 'vue';
    import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
    import { getAuth, signInWithEmailAndPassword, getIdToken, onAuthStateChanged } from 'firebase/auth';
    import { initializeApp } from 'firebase/app';
    import "bootstrap/dist/css/bootstrap.min.css";
    import "bootstrap";
   /* import "../../assets/css/style.css";
    import "../../assets/css/styles.css";*/
    const firebaseConfig = {
        apiKey: "AIzaSyAPZmmLYmU9mu5sfAJVEeS242gkIhJ8IvI",
        authDomain: "skyfields-f9129.firebaseapp.com",
        databaseURL: "https://skyfields-f9129-default-rtdb.firebaseio.com",
        projectId: "skyfields-f9129",
        storageBucket: "skyfields-f9129.appspot.com",
        messagingSenderId: "322279528188",
        appId: "1:322279528188:web:831c95e3c078e56f93e979",
        measurementId: "G-DYQCEJZ7Q3"
    };
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    export default {
        name: "AuthLogin",
        components: {

        },
        props: {
            name: {
                type: String,
                default: () => '',
            }
        },
        data() {
            return {
                user: {
                    email: 'zlynxzinnia@gmail.com',
                    password: '123456'
                }
            }
        },
        computed: {
            isDisable() {
                return false;
            }
        },
        created() {

        },
        mounted() {

        },
        methods: {
            login() {
                signInWithEmailAndPassword(auth, this.user.email, this.user.password)
                    .then((data) => {
                        const user = data.user;
                        console.log('user = ', user);
                        debugger;
                        this.$router.push({name:'ListJob'})
                    })
            }
        }

    }
</script>

<style scoped>

</style>
<style>
    @import '../../assets/css/styles.css';
    @import '../../assets/css/style.css';
</style>