//import { getFirestore, collection, query, documentId, doc, where, getDocs, deleteDoc } from "/assets/js/firebase-firestore.js";

const admin = require("firebase-admin");

const db = admin.firestore();

function generateId(prefix) {
    return prefix + '_' + new Date().getTime();
}

async function GetJobs() {
    const snapshot = await db.collection("jobs").get();
    return snapshot.docs.map(doc => doc.data());
}

async function Fetch(table) {
    const snapshot = await db.collection(table).get();
    return snapshot.docs.map(doc => doc.data());
}

async function FetchFilter(table, filters) {
    var collection = db.collection('jobs');
    var list = [];
    var q = query(collection(db, table));

    if(filters) {
        filters.forEach((filter) => {
            collection.where(filter.name, filter.operator, filter.value);
            // q = query(q, where(filter.name, filter.operator, filter.value));
        });
    }
    const snapshot = await collection.get();
    snapshot.forEach((d) => {
        list.push({id: d.id, data: d.data()});
    });
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((d) => {
    //   list.push({id: d.id, data: d.data()});
    // });

    return list;
}

async function Execute(table, data) {
    data.id = generateId(table);
    const res = await db.collection(table).add(data);
    return res.id;
}

async function GetJobById(id) {
    console.log('job by id param = ',id);
    const job = await db.collection("jobs").doc(id);
    const data = await job.get();
    console.log('job by id 1 = ',data);
    console.log('job by id 2 = ',data.data());
    return data.data();
    // const snapshot = await db.collection('jobs').doc(id).get();
    // console.log('job by id 1 = ',snapshot);
    // return snapshot.docs.map(doc => doc.data());
}

async function FetchJobMilstone(jobId) {
    const milestoneDatas = [{
        job_id: '1',
        name: '',
        start_date: '',
        end_date: '',
        description: '',
        status: '',
        task: [
            {
                milestone_id: '',
                name: '',
                description: '',
                start_date: '',
                end_date: '',
                status: '',
                topic: '',
                type: '',
                jobtasktemplate_id: '',
                address: '',
                team_id: '',
                jobTaskItems: [
                    {
                        jobtask_id: '',
                        jobsubtask_id: '',
                        name: '',
                        type: '',
                        value: '',
                        order: ''
                    }
                ]
            },
        ]
    }];
    const snapshot = await db.collection("jobmilestones").where("job_id", "==", jobId).get();
    snapshot.forEach((milestone) => {

        list.push({id: milestone.id, data: milestone.data()});
    });
    return snapshot.docs.map(doc => doc.data());
}

async function FetchJobTask(milestoneId) {

}

async function FetchJobTaskItems(jobTaskId) {

}
module.exports = { GetJobById, Fetch, FetchFilter, Execute };