# SkyFields
I. Install and running
1. run npm i to install
2. run node.index to run project -> running with link localhost:5000
3. login with account: datnp.95@gmail.com/123456

II. Technical
1. Nodejs for BE
- folder data: DAO
- folder server: todo
- views/pages/*/*.Server.js
- .lynx files: convert to *Server.js file
- Adding new *Server.js file: must import url in index.js file

2. Express for FE + AngularJs to binding two way
- assets/js/common.js: common function for client
- views/pages/admin/jobs/*.ejs
- views/pages/admin/jobs/jobs.js: build logic for jobs client
+ Khai bao controller: skyApp.controller('jobsController', myController);
- views/pages/admin/jobs/jobs.style: jobs css -> convert to .css file and import static
- views/layouts

III. Reference:
- screen: jobs
- source: 
+ FE: 
	- views/pages/jobs: file jobs.ejs to generate html, 
	- views/pages/jobs.js to process logic for frontend
+ BE: 
	- views/pages/jobs/jobServer.js for server using to build api.
	- data/services.js using as a DAO layer, working with database.
IV: Documents
- bootstrap: https://getbootstrap.com/docs/5.1/layout/columns/
- AngularJs: https://docs.angularjs.org/api/ng/input/input%5Bdate%5D
