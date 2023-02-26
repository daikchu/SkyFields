const admin = require("firebase-admin");
const serviceAccount = require(root + "/env/skyfields-f9129-firebase-adminsdk-8succ-6409074ccc.json");
// const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://skyfields-f9129-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

// const bucket = app.storage().bucket();

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
    data.id = generateId(table);
    // db.doc().update();
    const res = await db.collection(table).add(data);
    return res;
}

async function Update(table, data) {
    const snapshot = await db.collection(table).where("id", "=", data.id).get();
    let list = [];
    snapshot.forEach((d) => {
        list.push({id: d.id, data: d.data()});
    });
    if(list.length > 0) {
       return await db.collection(table).doc(list[0].id).update(data);
    } else return null;
}

async function Delete(table, filters) {
    let query = await db.collection(table);
    if (filters) {
        filters.forEach((filter) => {
            query = query.where(filter.name, filter.operator, filter.value);
        });
    }
    let snapshot = await query.get();
    const batch = db.batch();
    snapshot.forEach(async function (d) {
        await batch.delete(d.ref);
    });
    await batch.commit();
}

async function Fetch(table) {
    const snapshot = await db.collection(table).get();
    return snapshot.docs.map(doc => doc.data());
}

async function FetchPage(table, filters, offset, limit) {
    let query = db.collection(table);
    let list = [];
    if (filters) {
        filters.forEach((filter) => {
            query = query.where(filter.name, filter.operator, filter.value);
        });
    }
    const snapshot = await query.offset(offset).limit(limit).get();
    snapshot.forEach((d) => {
        list.push(d.data());
    });
    return list;
}

async function FetchFilter(table, filters) {
    let list = [];
    let query = admin.firestore().collection(table);
    if (filters) {
        filters.forEach((filter) => {
            query = query.where(filter.name, filter.operator, filter.value);
        });
    }
    const snapshot = await query.get();
    snapshot.forEach((d) => {
        list.push(d.data());
    });

    return list;
}

async function GetCount(table, filters) {
    let query = db.collection(table);
    if (filters) {
        filters.forEach((filter) => {
            query = query.where(filter.name, filter.operator, filter.value);
        });
    }
    const snapshotCount = await query.count().get();
    return snapshotCount._data.count;
}

function generateId(table) {
    return table + "_" + getRandomArbitrary(100, 900) + "_" + new Date().getTime();
}

//get random by range
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
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

module.exports = {Update, Delete, Fetch, FetchFilter, FetchPage, GetCount, Execute, VerifyUser, GetUserInfoByUID};