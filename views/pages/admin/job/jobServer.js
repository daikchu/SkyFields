const urls = require(root + "/views/pages/routes.js").urls;
const services = require(root + "/data/jobService.js");

module.exports = function(app) {
  app.route(urls.admin.job + "/:id")
  .get((request, response) => {
    const user = request.session.user;
    if(user) {
      if(user.role == "admin") {
        const id = request.params.id;
        const $1 = async function() {
          const filters = [
            { name: "name", operator: "==", value: "Job by Daicq 123" }
          ];
          const job = await services.GetJobById(id);
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
            job: job
          });
        };
        $1();

      }
    }
    else {
      response.status(404).send(`<!DOCTYPE html><pre>Cannot GET ${urls.admin.job}</pre>`);
    }
  })
  .post((request, response) => {
    
  });

  app.route("/ff" + urls.admin.job)
  .post((request, response) => {
    response.sendFile(root + "/views/pages/admin/job/job.js");
  });

  app.route("/ss" + urls.admin.job)
  .post((request, response) => {
    response.sendFile(root + "/views/pages/admin/job/job.style");
  });
}