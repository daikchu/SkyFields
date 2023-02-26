skyApp.controller('jobsController', myController);

function myController($scope, $http, $filter, genPageShowing, isNotEmpty) {
    /**variable*/
    $scope.projects = [];
    $scope.teams = [];
    $scope.jobs = [];
    $scope.page = page;
    $scope.pageShowing = {from: 1, to: 10};
    $scope.searchCondition = {};
    $scope.deleteId = "";
    $scope.jobDetail = {};
    $scope.jobTemplate = {};
    $scope.isLoading = false;
    $scope.jobNew = {
        id: "",
        project_id: PROJECT_ID_FIX,
        name: "",
        description: "",
        status: "Start",
        priority: "High",
        scope_of_work: "",
        sitelocation_id: "",
        start_date: "",
        end_date: "",
        team_id: "",
        type: ""
    };
    $scope.jobNew = {
        id: "",
        project_id: PROJECT_ID_FIX,
        name: "",
        description: "",
        status: "Start",
        priority: "High",
        scope_of_work: "",
        sitelocation_id: "",
        start_date: "",
        end_date: "",
        team_id: "",
        type: ""
    };


    /**method*/
    $scope.resetJobNew = function() {
        $scope.jobNew = {
            id: "",
            project_id: PROJECT_ID_FIX,
            name: "",
            description: "",
            status: "Start",
            priority: "High",
            scope_of_work: "",
            sitelocation_id: "",
            start_date: "",
            end_date: "",
            team_id: "",
            type: ""
        };
    };
    $scope.getAllProjects = async function() {
        await $http.get(API_PREFIX + "/skyfields/admin/projects").then(function (response) {
            if (response != null && response !== 'undefined' && response.status === 200) {
                $scope.projects = response.data.data;
            }
        }, function (error) {
            $.notification("warning", error.data.message, 3000);
        });
    };

    $scope.getJobTemplateByProjectId = async function (projectId) {
        if(!projectId) return;
        $scope.isLoading = true;
        await $http.get(API_PREFIX + "/skyfields/admin/jobs/dataTemplateByProject/" + projectId).then(function (response) {
            if (response != null && response !== 'undefined' && response.status === 200) {
                $scope.jobTemplate = response.data.data;
            } else {
                $.notification("warning", response.data.message, 3000);
            }
            $scope.isLoading = false;
        });

    };

    $scope.search = async function () {
        $scope.isLoading = true;
        await $http.get(API_PREFIX + "/skyfields/admin/jobs", {
            params: {
                pageNumber: $scope.page.pageNumber,
                numberPerPage: $scope.page.numberPerPage
            }
        }).then(function (response) {
            if (response != null && response !== 'undefined' && response.status === 200) {
                $.notification("success", response.data.message, 3000);
                $scope.page = response.data.data;
                $scope.page.pageCount = getPageCount($scope.page);
                $scope.page.pageList = getPageList($scope.page);
                // $scope.genPageShowing();
                genPageShowing($scope.page);
                $scope.showTask();
                $scope.isLoading = false;
            }
        });
    };
    $scope.loadPage = async function (pageNumber) {
        // $scope.page.items = [];
        if (pageNumber >= 1) {
            $scope.page.pageNumber = pageNumber;
            await $scope.search();
        }
    };
    $scope.getJobDetail = async function (jobId) {
        return await $http.get(API_PREFIX + "/skyfields/admin/jobs/" + jobId);
    };
    $scope.showJobDetail = async function (jobId, projectId) {
        $scope.jobDetail = {};
        $scope.isLoading = true;
        await $http.get(API_PREFIX + "/skyfields/admin/jobs/" + jobId).then(async function (response) {
            if (response != null && response !== 'undefined' && response.status === 200) {
                await $scope.getJobTemplateByProjectId(projectId);
                $scope.jobDetail = response.data.data;
                $scope.jobDetail.start_date = stringToDate($scope.jobDetail.start_date?.split("T")[0], "yyyy-mm-dd", "-");
                $scope.jobDetail.end_date = stringToDate($scope.jobDetail.end_date?.split("T")[0], "yyyy-mm-dd", "-");
                $.notification("success", response.data.message, 3000);
                $scope.isLoading = false;
            } else {
                $.notification("warning", response.data.message, 3000);
            }
        });
    };

    $scope.actionUpdate = async function () {
        //TODO validate client
        $scope.isLoading = true;
        await $http.put("/skyfields/admin/jobs", $scope.jobDetail).then(
            function (response) {
                if (response && response.status === 200) {
                    $.notification("success", response.data.message, 3000);
                    $('#edit_job').modal('hide');
                    $scope.loadPage(1);
                } else {
                    $.notification("warning", response.data.message, 3000);

                }
                $scope.isLoading = false;
            }, function (error) {
                $.notification("warning", error.data.message, 3000);
                $scope.isLoading = false;
            });
    };

    $scope.actionCreate = async function () {
        //TODO validate client
        $scope.jobNew.description = $('#editor').html();
        $scope.jobNew.team_id = $scope.jobTemplate.team.id;
        $scope.jobNew.sitelocation_id = "1";

        await $http.post("/skyfields/admin/jobs", $scope.jobNew)
            .then(
                function (response) {
                    if (response && response.status === 200) {
                        $.notification("success", response.data.message, 3000);
                        $('#create_job').modal('hide');
                        $scope.resetJobNew();
                        $scope.loadPage(1);
                    } else {
                        $.notification("warning", response.data.message, 3000);
                    }
                }, function (error) {
                    $.notification("warning", error.data.message, 3000);
                });
    };

    $scope.createJob = async function () {
        await $scope.getJobTemplateByProjectId(PROJECT_ID_FIX);
    };

    $scope.deleteJob = function (jobId) {
        $scope.deleteId = jobId;
    };
    $scope.actionDeleteJob = async function () {
        if (!$scope.deleteId) {
            $.notification("warning", "data is invalid", 3000);
            return;
        }
        await $http.delete("/skyfields/admin/jobs", {
            params: {
                jobId: $scope.deleteId
            }
        })
            .then(async function (response) {
                if (response != null && response !== 'undefined' && response.status === 200) {
                    $.notification("success", response.data.message, 3000);
                    $scope.deleteId = "";
                    $('#delete_job').modal('hide');
                    await $scope.loadPage(1);
                }
            });

    };
    // $scope.showTask = async function(jobId) {
    //     console.log('asdfa open close');
    //     await $http.get(API_PREFIX + "/skyfields/admin/jobs/"+jobId)
    //         .then(function (response) {
    //             if(response!=null && response!=='undefined' && response.status===200){
    //                 // $scope.generateTaskDetail(jobId, response.data.data);
    //             } else {
    //                 console.log('no data');
    //             }
    //         });
    // };

    $scope.calProcessMilestone = function (milestones) {
        if(!milestones) return 30;
        const countCompleted = milestones.filter(el => el.status === 'Completed').length;
        if (!countCompleted || countCompleted === 0) return 0;
        else return countCompleted / milestones.length * 100;
    };
    $scope.generateHtmlJobMilestones = function (milestones) {
        let htmlListMilestones = ``;
        for (let i = 0; i < milestones.length; i++) {
            const milestone = milestones[i];
            htmlListMilestones += `
                                <div class="item ">
                              <div><i class="fa ${milestone.status === 'Completed' ? 'fa-check-circle' : 'fa-spinner'} "></i> <name>MS ${i + 1}</name> <date>${milestone.end_date}</date></div>
                              <div>${milestone.name}</div>
                            </div>
                                `;
        }
        const processCal = $scope.calProcessMilestone(milestones);
        const htmlMileStones = `
                          <div class="milestones job-detail-tab">
                            ${htmlListMilestones}
                          </div>
                          <div class="milestones_progress">
                            <p class="m-b-5">Progress <span class="text-success float-end">${processCal}%</span></p>
                            <div class="progress progress-xs mb-0">
                              <div class="progress-bar bg-success" role="progressbar" data-bs-toggle="tooltip" title="${processCal}%"
                                style="width:${processCal}%"></div>
                            </div>
                          </div>`;
        return htmlMileStones;

    };

    $scope.generateHtmlJobReports = function (dailyReports) {
        let htmlListReportss = ``;
        for (let i = 0; i < dailyReports.length; i++) {
            const report = dailyReports[i];
            htmlListReportss += `
                                <div class="item">
                              <div><i class="fa fa-file"></i> <a href="#">Date ${report.date}</a></div>
                              <div>${report.description}</div>
                            </div>
                                `;
        }
        const htmlJobReports = `
                          <div class="reports job-detail-tab">
                            ${htmlListReportss}
                          </div>`;
        return htmlJobReports;
    };

    $scope.generateHtmlJobIssues = function (jobIssues) {
        //TODO
        let html = `<div class="issues">
                            <div class="item">
                              <div><name>Missing equipment</name> <div class="text-success">Resolved</div></div>
                              <div>Reported by: <span>John</span></div>
                            </div>
                            <div class="item">
                              <div><name>Antenna broken</name> <div class="text-success">Resolved</div></div>
                              <div>Reported by: <span>John</span></div>
                            </div>
                            <div class="item">
                              <div><name>Station water leak</name> <div class="text-danger">Reported</div></div>
                              <div>Reported by: <span>John</span></div>
                            </div>
                          </div>`;
        return html;
    };

    $scope.generateJobDetailBaseHTml = function (jobId) {
        let html = `<div class="project_progress">
                      <div>
                        <div class="title"><span>Job Milestones</span></div>
                       <content id="content-job-milestone-${jobId}"></content>
                      </div>
                      <div>
                        <div class="title"><span>Daily Reports</span></div>
                        <content id="content-job-reports-${jobId}"></content>
                      </div>
                      <div>
                        <div class="title"><span>Job Issues</span></div>
                        <content id="content-job-issues-${jobId}"></content>
                      </div>
                    </div>`;
        $('#' + jobId).closest("tr").after(`<tr class="view_tasks"><td colspan="11">${html}</td></tr>`);
    };
    $scope.showTask = function () {
        $(".show_tasks").removeClass("on");
        $(".show_tasks").unbind("click");
        $(".show_tasks").click(function (event) {
            if (!$(this).hasClass("on")) {
                $(this).addClass("on");
                const index = $(this).closest("tr").index();
                const jobId = event.target.id;
                $scope.generateJobDetailBaseHTml(jobId);
                $.ajax({
                    url: API_PREFIX + "/skyfields/admin/jobs/extra/" + jobId,
                    type: "get",
                    success: function (response) {
                        if (response.status) {
                            $.notification("success", response.message, 3000);
                            const jobDetail = response.data;
                            const htmlMileStones = $scope.generateHtmlJobMilestones(jobDetail?.milestones);
                            const htmlJobReports = $scope.generateHtmlJobReports(jobDetail?.dailyReports);
                            const htmlJobIssues = $scope.generateHtmlJobIssues(jobDetail?.jobIssues);
                            $('#content-job-milestone-' + jobId).html(htmlMileStones);
                            $('#content-job-reports-' + jobId).html(htmlJobReports);
                            $('#content-job-issues-' + jobId).html(htmlJobIssues);
                            // $(this).closest("tr").after(`<tr class="view_tasks"><td colspan="11">${html}</td></tr>`);
                        }
                    }
                });
            } else {
                $(this).removeClass("on");
                $(this).closest("tr").next().remove();
            }
        });
    };

    $scope.getTeamLeader = function (leaderId) {
        return $scope.jobTemplate?.team?.members?.find(el => el.firebase_uid === leaderId);
    };

    $scope.isNotEmpty = function (str) {
        return isNotEmpty(str);
    };

    /**init*/
    $scope.loadPage(1);
    $scope.getAllProjects();


}

skyApp.directive('jobList', function () {
    return {
        templateUrl: '/views/pages/admin/jobs/list.ejs'
    }
});
skyApp.directive('jobCreatePopup', function () {
    return {
        templateUrl: '/views/pages/admin/jobs/createPopup.ejs'
    }
});
skyApp.directive('jobEditPopup', function () {
    return {
        templateUrl: '/views/pages/admin/jobs/editPopup.ejs'
    }
});
skyApp.directive('jobDeletePopup', function () {
    return {
        templateUrl: '/views/pages/admin/jobs/deletePopup.ejs'
    }
});
