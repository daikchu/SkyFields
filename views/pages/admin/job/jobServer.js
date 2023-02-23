const urls = require(root + "/views/pages/routes.js").urls;

module.exports = function(app) {
  app.route(urls.admin.job + "/:id")
  .get((request, response) => {
    const user = request.session.user;
    if(user) {
      if(user.role == "admin") {
        const id = request.params.id;
        response.render("pages/admin/job/job", { 
          urls: urls, 
          menu: {
            parent: "jobs"
          }, 
          title: "Job Detail", 
          layout: "./layouts/admin/master-page", 
          script: urls.admin.job,
          id: id
        });
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
    response.sendFile(root + "/views/pages/admin/job/job.script");
  });

  app.route("/ss" + urls.admin.job)
  .post((request, response) => {
    response.sendFile(root + "/views/pages/admin/job/job.style");
  });
}