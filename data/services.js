const admin = require("firebase-admin");
const serviceAccount = require(root + "/env/skyfields-f9129-firebase-adminsdk-8succ-6409074ccc.json");
// const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://skyfields-f9129-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

async function VerifyUser(idToken) {
  return await admin.auth().verifyIdToken(idToken);
}

async function GetUserInfoByUID(firebase_uid) {
  const snapshot = await db.collection("users").where("firebase_uid", "==", firebase_uid).get();
  return snapshot.docs.map(doc => doc.data());
}

async function GetJobs() {
  const snapshot = await db.collection("jobs").get();
  return snapshot.docs.map(doc => doc.data());
}

async function Execute(table, data) {
  const res = await db.collection(table).add(data);
  return res.id;
}

async function Fetch(table) {
  const snapshot = await db.collection(table).get();
  return snapshot.docs.map(doc => doc.data());
}

async function FetchPage(table, filters, offset, limit) {
  let query = admin.firestore().collection(table);
  var list = [];
  if(filters) {
    filters.forEach((filter) => {
      query = query.where(filter.name, filter.operator, filter.value);
    });
  }
  const snapshot = await query.offset(offset).limit(limit).get();
  snapshot.forEach((d) => {
    list.push({id: d.id, data: d.data()});
  });

  return list;
}

async function FetchFilter(table, filters) {
  var list = [];
  let query = admin.firestore().collection(table);
  if(filters) {
    filters.forEach((filter) => {
      query = query.where(filter.name, filter.operator, filter.value);
    });
  }
  const snapshot = await query.get();
  snapshot.forEach((d) => {
    list.push({id: d.id, data: d.data()});
  });

  return list;
}

async function GetCount(table, filters) {
  let query = admin.firestore().collection(table);
  if(filters) {
    filters.forEach((filter) => {
      query = query.where(filter.name, filter.operator, filter.value);
    });
  }
  const snapshotCount = await query.count().get();
  return snapshotCount._data.count;
}

// function getJobs() {
//   var data = [];
//   let jobs = db.collection("Jobs");
//   jobs.get().then((snap) => {
//     snap.forEach(document => {
//       data.push(document.data());
//       //console.log(document.data());
//     });
//   });

//   console.log(data);
//   return data;
// }

// async function getUsers(firebase_uid) {
//   const snapshot = await db.collection("users").where("firebase_uid", "==", firebase_uid).get();
//   return snapshot.docs.map(doc => doc.data());
// }

// async function getMarker() {
//   const snapshot = await db.collection("Jobs").get();
//   return snapshot.docs.map(doc => doc.data());
// }

// async function getUserByLogin(username, password) {
//   const snapshot = await db.collection("Members").where("login.username", "==", username).where("login.password", "==", password).get();
//   return snapshot.docs.map(doc => doc.data());
// }

module.exports = { Fetch, FetchFilter, FetchPage, GetCount, Execute, VerifyUser, GetUserInfoByUID };