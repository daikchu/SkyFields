const urls = require(root + "/views/pages/routes.js").urls;
const services = require(root + "/data/services.js");
const Util = require(root + "/server/common/Utils.js");

module.exports = function(app) {
  app.route(urls.admin.job + "/:id")
  .get((request, response) => {
    const user = request.session.user;
    if(user) {
      if(user.role === Util.ROLE_ADMIN) {
        const id = request.params.id;
        const $1 = async function() {
          // console.log('job by id 1 = ',job);
          response.render("pages/admin/job/job", {
            urls: urls,
            menu: {
              parent: "jobs"
            },
            title: "Job Detail",
            layout: "./layouts/admin/master-page",
            script: urls.admin.job,
            id: id,
          });
        };
        $1();
      }
    }
    else {
      response.redirect("/");
      // response.status(401).send(`<!DOCTYPE html><pre>Cannot GET ${urls.admin.job}</pre>`);
    }
  })
  .post((request, response) => {
    
  });

  app.route(Util.API_PREFIX + urls.admin.job + "/:id")
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

  app.route(Util.API_PREFIX + urls.admin.job + "/milestones")
      .post((request, response) => {
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
            const result = await createMilestone(data);
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

  app.route("/ff" + urls.admin.job)
  .post((request, response) => {
    response.sendFile(root + "/views/pages/admin/job/job.js");
  });

  app.route("/ss" + urls.admin.job)
  .post((request, response) => {
    response.sendFile(root + "/views/pages/admin/job/job.css");
  });

  async function get(id) {
    const filters = [{name: 'id', operator: '=', value: id}];
    const jobs = await services.FetchFilter("jobs", filters);
    const job = jobs.length > 0 ? jobs[0] : null;
    if(job) {
      //todo get milestones

    }
    return jobs.length > 0 ? jobs[0] : null;
  }

  async function getJob(jobId) {
    const filters = [{name: 'id', operator: '=', value: jobId}];
    const jobs = await services.FetchFilter("jobs", filters);
    return jobs.length > 0 ? jobs[0] : null;
  }

  async function getJobDetail(jobId) {
    const job = await getJob(jobId);
    if(!job) return null;
    const filters = [{name: 'job_id', operator: '=', value: jobId}];
    const jobDetail = {
      job_id: jobId,
      milestones: [],
      daily_reports: [],
      job_issues: []
    };

    console.log('filter get job detail = ',filters);
    //get milestones
    const milestones = await services.FetchFilter('jobmilestones', filters);
    if (milestones && milestones.length > 0) {
      for(let i = 0; i < milestones.length; i++) {
        const jobTasks = await getTasksByMilestone(milestones[i].id);
        milestones[i].job_tasks = jobTasks;
      }
      job.milestones = milestones;
    }
    //get reports
    const dailyReports = await services.FetchFilter('dailyreports', filters);
    if (dailyReports && dailyReports.length > 0) {
      job.daily_reports = dailyReports;
    }
    //TODO get job issues
    const jobIssues = await services.FetchFilter('jobissues', filters);
    if (jobIssues && jobIssues.length > 0) {
      job.job_issues = jobIssues;
    }

    return job;
  }

  async function getTasksByMilestone(milestone_id) {
    const filters = [{name: 'milestone_id', operator: '=', value: milestone_id}];
    return await services.FetchFilter('jobtasks', filters);
  }

  async function createMilestone(data) {
    data.status = "Open";
    return await services.Execute("jobmilestones", data);
  }

  function validate(milestone){
    let fields = [];
    if(!milestone.name) {
      fields.push("name");
    }
    if(!milestone.end_date) {
      fields.push("end_date");
    }
    if(!milestone.start_date) {
      fields.push("start_date");
    }
    if(!milestone.job_id) {
      fields.push("project_id");
    }
    return fields;
  }
};