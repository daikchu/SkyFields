import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.0/firebase-app.js"; 
import { getAuth, signInWithEmailAndPassword, getIdToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.17.0/firebase-firestore.js";

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

onAuthStateChanged(auth, (user) => {
  if (user) {
		console.log("logged in");
  } else {
    console.log("logged out");
  }
});

$(document).ready(function() {
	$(".account-btn").click(function () {
		$.notification("warning", "Authenticating, please wait...", 3000);
    const email = $("input[name='email']").val();
    const password = $("input[name='password']").val();

		signInWithEmailAndPassword(auth, email, password)
		.then((data) => {
			const user = data.user;

			// const storage_auth_user = JSON.stringify({
			// 	uid: user.uid,
			// 	displayName: user.displayName,
			// 	email: user.email,
			// 	emailVerified: user.emailVerified,
			// 	phoneNumber: user.phoneNumber,
			// 	photoUrl: user.photoUrl,
			// 	createdAt: user.metadata.createdAt,
			// 	lastLoginAt: user.metadata.lastLoginAt,
			// 	accessToken: user.accessToken,
			// 	refreshToken: user.stsTokenManager.refreshToken,
			// 	expirationTime: user.stsTokenManager.expirationTime
			// });

			// localStorage.setItem("auth_user", storage_auth_user);
			user.accessToken;

			$.ajax({
				url: "/",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify({
					uid: user.uid,
					accessToken: user.accessToken
				}),
				success: function(response) {
					response.status ? window.location.replace(response.redirect) : $.notification("warning", response.message, 3000);
				}
			});
		})
		.catch((e) => {
			$.notification("warning", "Invalid email or password", 3000);
		});
	});
});	
