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
                const user = request.session?.user;
                console.log('admin jobs api url GET user role = ', user?.role);
                if (user) {
                    if (user.role === Util.ROLE_ADMIN) {
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
                    response.redirect("/");
                    //response.status(404).send(`<!DOCTYPE html><pre>Cannot GET ${urls.admin.jobs}</pre>`);
                }
            };
            $1();
        })
        .post((request, response) => {
            console.log('admin jobs api url POST = ', urls.admin.jobs);
            const $1 = async function () {
                const data = request.body;
                const user = request.session.user;
                if (user) {
                    if (user.role === Util.ROLE_ADMIN) {
                        const invalidFields = validate(data);
                        if(invalidFields.length > 0) {
                            response.status(500).send({
                                status: false,
                                message: "Created Fail. Invalid data!",
                                data: invalidFields
                            });
                        } else {
                            const result = await createJob(data);
                            if(result) {
                                response.send({
                                    status: true,
                                    message: "Created successfully",
                                    data: result
                                });
                            } else {
                                response.status(500).send({
                                    status: false,
                                    message: "Created Fail. Please contact Admin!"
                                });
                            }
                        }
                    }
                } else {
                    response.status(401).send({
                        status: false,
                        message: "Unauthorized!"
                    });
                }
            };
            $1();
        })
        .delete((request, response) => {
            console.log('admin jobs api url DELETE = ', urls.admin.jobs);
            const $1 = async function () {
                const jobId = request.query.jobId;
                const user = request.session.user;
                if (user) {
                    if (user.role === Util.ROLE_ADMIN) {
                        if(!jobId) {
                            response.send({
                                status: false,
                                message: "params are invalid!"
                            });
                        }
                        await deleteJob(jobId);
                        response.send({
                            status: true,
                            message: "Deleted successfully"
                        });
                    }
                } else {
                    response.status(404).send(`<!DOCTYPE html><pre>Cannot GET ${urls.admin.jobs}</pre>`);
                }
            };
            $1();
        })
        .put((request, response) => {
            console.log('admin jobs api url UPDATE = ', urls.admin.jobs);
            const $1 = async function () {
                const data = request.body;
                const user = request.session.user;
                if (user) {
                    if (user.role === Util.ROLE_ADMIN) {
                        const invalidFields = validateUpdate(data);
                        if(invalidFields.length > 0) {
                            response.status(500).send({
                                status: false,
                                message: "Update Fail. Invalid data!",
                                data: invalidFields
                            });
                        } else {
                            const result = await updateJob(data);
                            if(result) {
                                response.send({
                                    status: true,
                                    message: "Updated successfully",
                                    data: result
                                });
                            } else {
                                response.status(500).send({
                                    status: false,
                                    message: "Update Fail. Please contact Admin!"
                                });
                            }
                        }
                    }
                } else {
                    response.status(404).send(`<!DOCTYPE html><pre>Cannot GET ${urls.admin.jobs}</pre>`);
                }
            };
            $1();
        });

    app.route(Util.API_PREFIX + urls.admin.jobs)
        .get((request, response) => {
            const $1 = async function () {
                const pageNumber = request.query.pageNumber;
                const numberPerPage = request.query.numberPerPage;
                const user = request.session.user;
                if (user) {
                    if (user.role === Util.ROLE_ADMIN) {
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

    app.route(Util.API_PREFIX + urls.admin.jobs + "/:id")
        .get((request, response) => {
            const $1 = async function () {
                const jobId = request.params.id;
                const user = request.session.user;
                if (user) {
                    if (user.role === Util.ROLE_ADMIN) {
                        const detail = await getJob(jobId);
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

    app.route(Util.API_PREFIX + urls.admin.jobs + "/extra/:id")
        .get((request, response) => {
            const $1 = async function () {
                const jobId = request.params.id;
                const user = request.session.user;
                if (user) {
                    if (user.role === Util.ROLE_ADMIN) {
                        const detail = await getJobDetail(jobId);
                        response.send({
                            status: true,
                            message: "Get successfully",
                            data: detail,
                        });
                    }
                } else {
                    response.status(401).send({
                        status: false,
                        message: "Unauthorized!"
                    });
                }
            };
            $1();
        });

    app.route(Util.API_PREFIX + urls.admin.jobs + "/dataTemplateByProject/:projectId")
        .get((request, response) => {
            const $1 = async function () {
                const projectId = request.params.projectId;
                const user = request.session.user;
                if (user) {
                    if (user.role === Util.ROLE_ADMIN) {
                        const result = {
                            customer: [],
                            team: []
                        };
                        //TODO get list customers
                        const project = await getProject(projectId);
                        if(project) {
                            //TODO get list teams
                            const team = await getTeam(project.team_id);
                            result.customer = await getCustomer(project.customer_id);
                            if(team) {
                                team.members = await getUsers(team.id);
                                result.team = team;
                            }
                        }
                        response.send({
                            status: true,
                            message: "Get successfully",
                            data: result,
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
            response.sendFile(root + "/views/pages/admin/jobs/jobs.css");
        });

    async function createJob(job) {
        // await services.Delete("jobs", null);
        for(let i = 0; i<20; i++) {
            const job = {
                project_name: "Sky",
                created_date: new Date(),
                dailyreports: [],
                description: "Description "+i,
                end_date: new Date(),
                id: "",
                status: "Start",
                jobmilestones: [],
                modified_date: new Date(),
                name: "Job by daicq " +i,
                priority: (i % 2 === 0) ? "High" : "Low",
                project_id: "1",
                scope_of_work: "Construction",
                sitelocation_id: "1",
                start_date: new Date(),
                team_id: "1",
                type: "Guided Tower"
            };
        }
        //TODO set auto some fields like status = "Start"...
        job.status = "Start";
        job.created_date = new Date();
        job.modified_date = new Date();
        return await services.Execute("jobs", job);
    }

    async function fetchPage(pageNumber, numberPerPage) {
        let page = {items: [], rowCount: 0, numberPerPage: '10', pageNumber: 1, pageList: [], pageCount: 0};
        if (pageNumber) page.pageNumber = Number(pageNumber);
        if (numberPerPage) page.numberPerPage = numberPerPage;
        const numPerPage = Number(numberPerPage);
        const offset = page.pageNumber > 0 ? (page.pageNumber - 1) * numPerPage : 0;
        //call DAO
        const list = await services.FetchPage('jobs', null, offset, numPerPage);
        const count = await services.GetCount('jobs', null);
        if (count > 0) {
            page.items = list;
            page.rowCount = count;
        }
        return page;
    }

    async function getJob(jobId) {
        const filters = [{name: 'id', operator: '=', value: jobId}];
        const jobs = await services.FetchFilter("jobs", filters);
        return jobs.length > 0 ? jobs[0] : null;
    }

    async function getJobDetail(jobId) {
        const filters = [{name: 'job_id', operator: '=', value: jobId}];
        const jobDetail = {
            jobId: jobId,
            milestones: [],
            dailyReports: [],
            jobIssues: []
        };
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
        //TODO get job issues
        const jobIssues = await services.FetchFilter('jobissues', filters);
        if (jobIssues && jobIssues.length > 0) {
            jobDetail.jobIssues = jobIssues;
        }
        return jobDetail;
    }

    async function updateJob(job){
        job.modified_date = new Date();
        return await services.Update("jobs", job);
    }

    async function deleteJob(jobId) {
        await deleteMilestoneByJobId(jobId);
        await deleteDailyReportsByJobId(jobId);
        //delete jobs
        const filtersJob = [{name: 'id', operator: '=', value: jobId}];
        await services.Delete("jobs", filtersJob);
    }

    async function deleteDailyReportsByJobId(jobId) {
        const filters = [{name: 'job_id', operator: '=', value: jobId}];
        return await services.Delete("dailyreports", filters);
    }

    async function deleteMilestoneByJobId(jobId) {
        const filters = [{name: 'job_id', operator: '=', value: jobId}];
        const milestonesDeleted =
            await services.FetchFilter("jobmilestones", filters);
        let milestoneIds = [];
        milestonesDeleted.forEach(async function (el){
            milestoneIds.push(el.id);
        });
        if(milestoneIds.length > 0) {
            await deleteJobTask(milestoneIds);
        }
        //delete milestones
        return await services.Delete("jobmilestones", filters);
    }
    async function deleteJobTask(milestoneIds) {
        const filters = [{name: 'milestone_id', operator: 'in', value: milestoneIds}];
        const jobTasksDeleted =
            await services.FetchFilter("jobtasks", filters);
        let jobTaskIds = [];
        jobTasksDeleted.forEach(async function (el){
            jobTaskIds.push(el.id);
        });
        if(jobTaskIds.length > 0) {
            await deleteJobSubTask(jobTaskIds);
        }
        return await services.Delete("jobtasks", filters);
    }

    async function deleteJobSubTask(jobtaskIds) {
        const filters = [{name: 'jobtask_id', operator: 'in', value: jobtaskIds}];
        const jobSubTasksDeleted =
            await services.FetchFilter("jobsubtasks", filters);
        let jobSubTaskIds = [];
        jobSubTasksDeleted.forEach(async function (el){
            jobSubTaskIds.push(el.id);
        });
        if(jobSubTaskIds.length > 0) {
           //TODO
        }
    }

    async function getTeams(project_id) {
        //get project by project_id -> get team_id
        //get teams by team_id
        //get users by teams_id
    }
    async function getProject(id) {
        const filters = [{name: 'id', operator: '=', value: id}];
        const projects = await services.FetchFilter("projects", filters);
        return projects.length > 0 ? projects[0] : null;
    }
    async function getTeam(team_id) {
        const filters = [{name: 'id', operator: '=', value: team_id}];
        const teams = await services.FetchFilter("teams", filters);
        const team = teams.length > 0 ? teams[0] : null;
        if(team) {
            const teamMembers = await getUsers(team_id);
            team.members = teamMembers;
        }
        return team;
        //get project by project_id -> get team_id
        //get teams by team_id
        //get users by teams_id
    }
    async function getCustomer(customer_id) {
        const filters = [{name: 'id', operator: '=', value: customer_id}];
        const customers = await services.FetchFilter("customers", filters);
        return customers.length > 0 ? customers[0] : null;
    }

    async function getUsers(team_id) {
        const filters = [{name: 'team_id', operator: '=', value: team_id}];
        return await services.FetchFilter("users", filters);
    }

    function validate(job){
        let fields = [];
        if(!job.name) {
            fields.push("name");
        }
        if(!job.end_date) {
            fields.push("end_date");
        }
        if(!job.start_date) {
            fields.push("start_date");
        }
        if(!job.project_id) {
            fields.push("project_id");
        }
        if(!job.team_id){
            fields.push("team_id");
        }
        if(!job.priority){
            fields.push("priority");
        }
        return fields;
    }

    function validateUpdate(job){
        let fields = validate(job);
        if(!job.id) {
            fields.push("id");
        }
        return fields;
    }


};