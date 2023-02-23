const urls = require(root + "/views/pages/routes.lynx").urls;
const execute = require(root + "/data/services.lynx").Execute;
const services = require(root + "/data/services.lynx");

module.exports = function(app) {
  app.route(urls.admin.jobs)
  .get((request, response) => {
    const user = request.session.user;
    if(user) {
      if(user.role == "admin") {
        response.render("pages/admin/jobs/jobs", { 
          urls: urls, 
          menu: {
            parent: "jobs"
          }, 
          title: "Jobs", 
          layout: "./layouts/admin/master-page", 
          script: urls.admin.jobs 
        });
      }
    }
    else {
      response.status(404).send(`<!DOCTYPE html><pre>Cannot GET ${urls.admin.jobs}</pre>`);
    }
  })
  .post((request, response) => {
    debugger;
    const $1 = async function() {
          const result = await services.Execute(idToken);
            debugger;

        }
  });

  app.route("/ff" + urls.admin.jobs)
  .post((request, response) => {
    response.sendFile(root + "/views/pages/admin/jobs/jobs.script");
  });

  app.route("/ss" + urls.admin.jobs)
  .post((request, response) => {
    response.sendFile(root + "/views/pages/admin/jobs/jobs.style");
  });
};