const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const path = require("path");
const session = require("express-session");
global.root = __dirname;
global.token = "";
app.use(expressLayouts);
app.use(express.json());
app.use('/assets',express.static( 'assets'));
app.use('/css',express.static( 'assets/css'));
app.use('/js',express.static( 'assets/js'));
app.use('/fonts',express.static( 'assets/fonts'));
app.use('/images',express.static( 'assets/images'));
app.use('/server',express.static( 'server'));
app.use('/views',express.static( 'views'));
app.use('/data',express.static( 'data'));
app.use('/',express.static( global.root));
app.use('/env',express.static( 'env'));
// app.use('/css',express.static('assets/css'));
// app.use('*/js', express.static("assets/js"));
// app.use('*/png', express.static("assets/images"));
// app.use('*/woff', express.static("assets/fonts"));
// app.use('*/woff2', express.static("assets/fonts"));
app.use(session({secret: "Lynx"}));
app.set("view engine", "ejs");

require("./views/pages/loginServer")(app);
require("./views/pages/logoutServer")(app);
require("./views/pages/profile.lynx")(app);
require("./server/projectServer")(app);
require("./server/teamsServer")(app);
require("./views/pages/admin/customer/customer.lynx")(app);
require("./views/pages/admin/customers/customers.lynx")(app);
require("./views/pages/admin/dashboard/dashboard.lynx")(app);
require("./views/pages/admin/employee/employee.lynx")(app);
require("./views/pages/admin/employees/employees.lynx")(app);
require("./server/jobServer")(app);
require("./server/jobsServer")(app);
require("./views/pages/admin/task/task.lynx")(app);
require("./views/pages/admin/team/team.lynx")(app);
require("./views/pages/admin/teams/teams.lynx")(app);
require("./views/pages/admin/settings/job/templates.lynx")(app);
require("./views/pages/admin/settings/job/create-template.lynx")(app);
require("./views/pages/admin/settings/task/templates.lynx")(app);
require("./views/pages/admin/settings/task/create-template.lynx")(app);

// Database connection
// const mysql = require("mysql"); 
// const con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "phptest"
// });

// con.connect((err) => {
//   if (err) throw err;
//   console.log("Connected!");
// });

const port = process.env.PORT || 5000;
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on("connection", (socket) => {
  //io.emit("connected", "An user has connected to this page");

  socket.on("message", (message) => {
    io.emit("message", message);
  });
});

server.listen(port, () => console.log("Node server is running..."));