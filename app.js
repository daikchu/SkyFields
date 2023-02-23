import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.0/firebase-app.js"; 
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.0/firebase-auth.js";
import { getFirestore, collection, query, documentId, doc, where, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/9.17.0/firebase-firestore.js";
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

function isUserLoggedIn() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // user.getIdToken().then(function(idToken) {
      //   console.log(idToken); 
      // });
      const uid = user.uid;
      // $("body").removeClass("opacity-0");
      // $("body").addClass("fadeIn");
      console.log("logged in");
    } else {
      window.location.replace("/");
    }
  });
}

function doSignOut() {
  signOut(auth).then(() => {
    console.log("Session cleared");
  }).catch((error) => {
    console.log(error);
  });
}

async function Fetch(table, filters = null) {
  var list = [];
  var q = query(collection(db, table));
  
  if(filters) {
    filters.forEach((filter) => {
      q = query(q, where(filter.name, filter.operator, filter.value));
    });
  }

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((d) => {
    list.push({id: d.id, data: d.data()});
  });

  return list;
}

async function Delete(table, id) {
  await deleteDoc(doc(db, table, id));
}

async function DeleteBulk(table, filters = null) {
  var list = [];
  var q = query(collection(db, table));
  
  if(filters) {
    filters.forEach((filter) => {
      q = query(q, where(filter.name, filter.operator, filter.value));
    });
  }

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (d) => {
    const id = d.id;
    await deleteDoc(doc(db, table, d.id))
    .then(() => {
      list.push(id);
    })
    .catch(error => {
      console.log(error);
    });
    
  });

  return list;
}

$(document).ready(function() {
  $(".logout_button").click(function () {
    $.ajax({
      url: "/sessionClear",
      type: "POST",
      contentType: "application/json",
      success: function(response) {
        //console.log(response);
        doSignOut();
      },
      error: function(response) {
        // console.log(response);
      }
    });
  });

  isUserLoggedIn();
});

export { Fetch, Delete, documentId };
