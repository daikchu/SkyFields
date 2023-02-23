const project = require("./routes.lynx").project;
const services = require(root + "/data/services.lynx");

module.exports = function(app) {
  app.route("/")
  .get((request, response) => { 
    response.render("pages/login", { project: project, title: "Skyfields", layout: false});
  })
  .post((request, response) => {
    const idToken = request.body.accessToken;

    const $1 = async function() {
      const result = await services.VerifyUser(idToken);
      const user = await services.GetUserInfoByUID(result.uid);

      if(user[0].role == "admin") {
        request.session.user = user[0];

        response.send({
          status: true,
          message: "Successfully logged in",
          redirect: "/" + project + "/admin/dashboard",
          user: request.session.user
        });
      }
      else if(user[0].role == "employee") {
        request.session.user = user[0];

        response.send({
          status: true,
          message: "Successfully logged in",
          redirect: "/" + project + "/employee/dashboard"
        });
      }
      else{
        response.send({
          status: false,
          message: "No role",
          redirect: "/",
        });
      }
    }

    $1();
  });

  app.route("/sessionClear")
  .post((request, response) => {
    request.session.destroy();
    response.send({
      status: "success",
      message: "Session cleared",
      redirect: "/",
    });
  });
}