const urls = require(root + "/views/pages/routes.js").urls;
const execute = require(root + "/data/services.js").Execute;
const services = require(root + "/data/services.js");
const Util = require(root + "/server/common/Utils.js");

module.exports = function (app) {
    app.route(urls.admin.projects)
        .get((request, response) => {
        })
        .post((request, response) => {
        })
        .delete((request, response) => {
        })
        .put((request, response) => {
        });

    app.route(Util.API_PREFIX + urls.admin.teams)
        .get((request, response) => {
            const $1 = async function () {
                const user = request.session.user;
                if (user) {
                    if (user.role === Util.ROLE_ADMIN) {
                        const list = await fetchAll();
                        response.send({
                            status: true,
                            message: "Get successfully",
                            data: list,
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

    app.route(Util.API_PREFIX + urls.admin.projects + "/:id")
        .get((request, response) => {
            const $1 = async function () {
                const team_id = request.params.id;
                const user = request.session.user;
                if (user) {
                    if (user.role === Util.ROLE_ADMIN) {
                        const detail = await get(team_id);
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



    async function fetchPage(pageNumber, numberPerPage) {
        let page = {items: [], rowCount: 0, numberPerPage: '10', pageNumber: 1, pageList: [], pageCount: 0};
        if (pageNumber) page.pageNumber = Number(pageNumber);
        if (numberPerPage) page.numberPerPage = numberPerPage;
        const numPerPage = Number(numberPerPage);
        const offset = page.pageNumber > 0 ? (page.pageNumber - 1) * numPerPage : 0;
        //call DAO
        const list = await services.FetchPage('projects', null, offset, numPerPage);
        const count = await services.GetCount('projects', null);
        if (count > 0) {
            page.items = list;
            page.rowCount = count;
        }
        return page;
    }

    async function fetchFilter(project_id) {
        const filters = [];
        if(project_id) {
            filters.push({name: 'project_id', operator: '=', value: project_id})
        }
        const list = await services.FetchFilter("teams", filters);
        return list;
    }
    async function fetchAll() {
        //call DAO
        const list = await services.Fetch('projects');
        return list;
    }

    async function get(id) {
        const filters = [{name: 'id', operator: '=', value: jobId}];
        const jobs = await services.FetchFilter("teams", filters);
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