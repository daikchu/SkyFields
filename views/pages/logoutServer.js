const urls = require("./routes.js").urls;

module.exports = function(app) {
  app.route(urls.logout)
  .get((request, response) => {
    response.redirect("/");
  })
  .post((request, response) => {
  });
}