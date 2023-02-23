const urls = require(root + "/views/pages/routes.js").urls;
const execute = require(root + "/data/services.js").Execute;
const services = require(root + "/data/services.js");
const Util = require(root + "/server/common/Utils.js");

module.exports = function (app) {
    console.log('admin jobs api url = ', urls.admin.jobs);
    app.route(urls.admin.jobs)
        .get((request, response) => {
            const $1 = async function () {
                console.log('admin jobs api url GET = ', urls.admin.jobs);
                const user = request.session.user;
                console.log('admin jobs api url GET user role = ', user.role);
                if (user) {
                    if (user.role == "admin") {
                        // const result = await services.FetchFilter('jobs');
                        // console.log('admin jobs api url GET fetch data jobs = ', result);
                        response.render("pages/admin/jobs/jobs", {
                            urls: urls,
                            menu: {
                                parent: "jobs"
                            },
                            title: "Jobs",
                            layout: "./layouts/admin/master-page",
                            script: urls.admin.jobs,
                            // jobs: result
                        });
                    }
                } else {
                    response.status(404).send(`<!DOCTYPE html><pre>Cannot GET ${urls.admin.jobs}</pre>`);
                }
            };
            $1();

            const getTeams = async function (project_id) {
                //get project by project_id -> get team_id
                //get teams by team_id
                //get users by teams_id
            }
        })
        .post((request, response) => {
            console.log('admin jobs api url POST = ', urls.admin.jobs);
            const $1 = async function () {
                request.body.created_date = new Date();
                request.body.modified_date = new Date();
                const result = await services.Execute('jobs', request.body);
                response.send({
                    status: true,
                    message: "Created successfully",
                    data: result,
                    redirect: "/skyfields/admin/jobs",
                });
            };
            $1();
        });

    app.route("/data" + urls.admin.jobs)
        .get((request, response) => {
            const $1 = async function () {
                const pageNumber = request.query.pageNumber;
                const numberPerPage = request.query.numberPerPage;
                const user = request.session.user;
                if (user) {
                    if (user.role == "admin") {
                        const page = await fetchPage(pageNumber, numberPerPage);
                        response.send({
                            status: true,
                            message: "Get successfully",
                            data: page,
                        });
                    }
                } else {
                    response.status(404).send(`<!DOCTYPE html><pre>Cannot GET ${urls.admin.jobs}</pre>`);
                }
            };
            $1();
        });

    app.route("/data" + urls.admin.jobs + "/:id")
        .get((request, response) => {
            const $1 = async function () {
                const jobId = request.params.id;
                const user = request.session.user;
                if (user) {
                    if (user.role == "admin") {
                        const detail = await getJobDetail(jobId);
                        response.send({
                            status: true,
                            message: "Get successfully",
                            data: detail,
                        });
                    }
                } else {
                    response.status(404).send(`<!DOCTYPE html><pre>Cannot GET ${urls.admin.jobs}</pre>`);
                }
            };
            $1();
        });

    app.route("/ff" + urls.admin.jobs)
        .post((request, response) => {
            response.sendFile(root + "/views/pages/admin/jobs/jobs.js");
        });

    app.route("/ss" + urls.admin.jobs)
        .post((request, response) => {
            response.sendFile(root + "/views/pages/admin/jobs/jobs.style");
        });

    async function fetchPage(pageNumber, numberPerPage) {
        let page = {items: [], rowCount: 0, numberPerPage: '10', pageNumber: 1, pageList: [], pageCount: 0};
        if (pageNumber) page.pageNumber = Number(pageNumber);
        if (numberPerPage) page.numberPerPage = numberPerPage;
        const numPerPage = Number(numberPerPage);
        const offset = page.pageNumber > 0 ? (page.pageNumber - 1) * numPerPage : 0;
        const list = await services.FetchPage('jobs', null, offset, numPerPage);
        const count = await services.GetCount('jobs', null);
        if (count > 0) {
            page.items = list;
            page.rowCount = count;
        }
        return page;
    }

    async function getJobDetail(jobId) {
        const filters = [{name: 'job_id', operator: '=', value: jobId}];
        const jobDetail = {
            jobId: jobId,
            milestones: [],
            dailyReports: [],
            jobIssues: []
        };
        let jobIssues = [];
        console.log('filter get job detail = ',filters);
        //get milestones
        const milestones = await services.FetchFilter('jobmilestones', filters);
        if (milestones && milestones.length > 0) {
            jobDetail.milestones = milestones;
        }
        //get reports
        const dailyReports = await services.FetchFilter('dailyreports', filters);
        if (dailyReports && dailyReports.length > 0) {
            jobDetail.dailyReports = dailyReports;
        }
        console.log('job detail milestones = ',milestones);
        console.log('job detail report = ',dailyReports);
        const milestonesAll = await services.Fetch('jobmilestones');
        console.log('job detail all milestones = ',milestonesAll);
        //TODO get job issues

        return jobDetail;

    }
};