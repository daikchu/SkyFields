skyApp.controller('jobsController', myController);

function myController($scope, $http) {
    /**variable*/
    $scope.jobs = [];
    $scope.page = page;
    $scope.pageShowing = {from: 1, to: 10};
    $scope.searchCondition = {};

    /**method*/
    $scope.genPageShowing = function () {
        if (!$scope.page.items || $scope.page.items.length === 0) $scope.pageShowing = {from: 0, to: 0};
        else {
            const from = ($scope.page.pageNumber - 1) * Number($scope.page.numberPerPage) + 1;
            const to = $scope.page.items.length < Number($scope.page.numberPerPage)
                ? from + $scope.page.items.length - 1
                : $scope.page.pageNumber * Number($scope.page.numberPerPage);
            $scope.pageShowing.from = from;
            $scope.pageShowing.to = to;
        }
    };
    $scope.search = async function () {
        await $http.get("/data/skyfields/admin/jobs", {
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
                $scope.genPageShowing();
                $scope.showTask();
            }
        });
    };
    $scope.loadPage = function (pageNumber) {
        if (pageNumber >= 1) {
            $scope.page.pageNumber = pageNumber;
            $scope.search();
        }
    };
    $scope.getJobDetail = async function (jobId) {

        return await $http.get("/data/skyfields/admin/jobs/" + jobId);
    };
    // $scope.showTask = async function(jobId) {
    //     console.log('asdfa open close');
    //     await $http.get("/data/skyfields/admin/jobs/"+jobId)
    //         .then(function (response) {
    //             if(response!=null && response!=='undefined' && response.status===200){
    //                 // $scope.generateTaskDetail(jobId, response.data.data);
    //             } else {
    //                 console.log('no data');
    //             }
    //         });
    // };

    $scope.calProcessMilestone = function(milestones){
        const countCompleted = milestones.filter(el => el.data.status === 'Completed').length;
        if(!countCompleted || countCompleted === 0) return 0;
        else return countCompleted / milestones.length * 100;
    };
    $scope.generateHtmlJobMilestones = function(milestones){
        let htmlListMilestones = ``;
        for (let i = 0; i < milestones.length; i++) {
            const milestone = milestones[i];
            htmlListMilestones += `
                                <div class="item ">
                              <div><i class="fa ${milestone.data.status === 'Completed' ? 'fa-check-circle' : 'fa-spinner'} "></i> <name>MS ${i+1}</name> <date>${milestone.data.end_date}</date></div>
                              <div>${milestone.data.name}</div>
                            </div>
                                `;
        }
        const processCal = $scope.calProcessMilestone(milestones);
        const htmlMileStones = `<content>
                          <div class="milestones job-detail-tab">
                            ${htmlListMilestones}
                            ${htmlListMilestones}
                            ${htmlListMilestones}
                            ${htmlListMilestones}
                            ${htmlListMilestones}
                          </div>
                          <div class="milestones_progress">
                            <p class="m-b-5">Progress <span class="text-success float-end">${processCal}%</span></p>
                            <div class="progress progress-xs mb-0">
                              <div class="progress-bar bg-success" role="progressbar" data-bs-toggle="tooltip" title="${processCal}%"
                                style="width:${processCal}%"></div>
                            </div>
                          </div>
                        </content>`;
        return htmlMileStones;

    };

    $scope.generateHtmlJobReports = function(dailyReports) {
        let htmlListReportss = ``;
        for (let i = 0; i < dailyReports.length; i++) {
            const report = dailyReports[i];
            htmlListReportss += `
                                <div class="item">
                              <div><i class="fa fa-file"></i> <a href="#">Date ${report.data.date}</a></div>
                              <div>${report.data.description}</div>
                            </div>
                                `;
        }
        const htmlJobReports = `<content>
                          <div class="reports job-detail-tab">
                            ${htmlListReportss}
                          </div>
                        </content>`;
        return htmlJobReports;
    };

    $scope.generateHtmlJobIssues = function(jobIssues) {
        //TODO
    };

    $scope.showTask = function () {
        $(".show_tasks").removeClass("on");
        $(".show_tasks").unbind("click");
        $(".show_tasks").click(function (event) {
            if (!$(this).hasClass("on")) {
                $(this).addClass("on");
                const index = $(this).closest("tr").index();
                const jobId = event.target.id;
                $.ajax({
                    url: "/data/skyfields/admin/jobs/" + jobId,
                    type: "get",
                    success: function (response) {
                        if (response.status) {
                            $.notification("success", response.message, 3000);
                            const jobDetail = response.data;
                            const htmlMileStones = $scope.generateHtmlJobMilestones(jobDetail.milestones);
                            const htmlJobReports = $scope.generateHtmlJobReports(jobDetail.dailyReports);
                            var html = `<div class="project_progress">
                      <div>
                        <div class="title"><span>Job Milestones</span></div>
                       ${htmlMileStones}
                      </div>
                      <div>
                        <div class="title"><span>Daily Reports</span></div>
                        ${htmlJobReports}
                      </div>
                      <div>
                        <div class="title"><span>Job Issues</span></div>
                        <content>
                          <div class="issues">
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
                          </div>
                        </content>
                      </div>
                    </div>`;
                            $('#' + jobId).closest("tr").after(`<tr class="view_tasks"><td colspan="11">${html}</td></tr>`);
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
    /**init*/
    $scope.search();


}


//
//
// function actionCreateJob() {
//     console.log('create jobs client');
//     debugger;
//     const jobName = $("input[name='create_jobName']").val();
//     const startDate = $("input[name='create_startDate']").val();
//     const endDate = $("input[name='create_endDate']").val();
//     const rate = $("input[name='create_rate']").val();
//     const rateType = $("input[name='create_rate']").val();
//     const priority = $("select[name='create_priority']").val();
//     const description = $("div[id='editor']").html();
//     let dataCreate = {
//         name: jobName,
//         team_id: "Node",
//         status: "Start",
//         start_date: startDate,
//         end_date: endDate,
//         // rate: rate,
//         sitelocation_id: "None",
//         scope_of_work: "None",
//         project_id: "1",
//         description: description,
//         priority: priority
//     };
//     debugger;
//     $.ajax({
//         url: "/skyfields/admin/jobs",
//         type: "POST",
//         contentType: "application/json",
//         data: JSON.stringify(dataCreate),
//         success: function (response) {
//             response.status ? window.location.replace(response.redirect) : $.notification("warning", response.message, 3000);
//         }
//     });
//     debugger;
// }
//
//
// $(document).ready(function () {
//     var data = [];
//     function fetchData() {
//         console.log('fet jobs');
//         // debugger;
//         $.ajax({
//             url: "/data/skyfields/admin/jobs",
//             type: "GET",
//             success: function (response) {
//                 // debugger;
//                 data = response.data;
//                  /*$('#DataTables_Table_0').dataTable({
//                    destroy: true,
//                    aaData: response.data
//                  });*/
//                 // response.status ? window.location.replace(response.redirect) : $.notification("warning", response.message, 3000);
//             }
//         });
//     };
//
//     fetchData();
//     // const $1 = async () => {
//     //     await $.ajax({
//     //         url: "/data" + url,
//     //         type: "POST",
//     //         contentType: "application/json; charset=utf-8",
//     //         success: function (response) {
//     //             $data = response;
//     //         }
//     //     });
//     // };
//
//
//
//     /* $('#DataTables_Table_0').dataTable({
//        destroy: true,
//        aaData: response.data
//      });*/
//
//     // const $2 = async () => {
//     //   const data = await $1();
//     // };
//
//     $(".datatable").DataTable({
//         dom: '<"table_header"<"left"lf><"right"B>>t<"table_footer"ip>',
//         pageLength: 10,
//         lengthMenu: [10, 25, 50, 75, 100],
//         paging: true,
//         // buttons: {
//         //     buttons: [
//         //         {extend: 'pdf', className: 'btn btn-primary', text: '<i class="fa fa-file-pdf-o"></i> PDF'},
//         //         {extend: 'excel', className: 'btn btn-primary', text: '<i class="fa fa-file-excel-o"></i> Excel'}
//         //     ]
//         // },
//         columnDefs: [
//             {
//                 targets: 0,
//                 render: function (data, type, row) {
//                     return `<div class="form-check form-check-sm form-check-custom form-check-solid">
//                     <input class="form-check-input" type="checkbox" value="${data}" />
//                   </div>`;
//                 },
//                 orderable: false,
//             },
//         ],
//         data: data,
//         drawCallback: function () {
//             ShowTask();
//         },
//         scrollX:        true,
//         scrollCollapse: true,
//         fixedColumns: {
//             left: 1,
//             right: 1
//         }
//     });
//
// // $2();
//
//     function ShowTask() {
//         $(".show_tasks").removeClass("on");
//         $(".show_tasks").unbind("click");
//         $(".show_tasks").click(function () {
//             if (!$(this).hasClass("on")) {
//                 $(this).addClass("on");
//                 const index = $(this).closest("tr").index();
//
//                 var html = `<div class="project_progress">
//                       <div>
//                         <div class="title"><span>Job Milestones</span></div>
//                         <content>
//                           <div class="milestones">
//                             <div class="item precon">
//                               <div><i class="fa fa-check-circle"></i> <name>MS01</name> <date>Thu, 01/01/2022</date></div>
//                               <div>Precon Scoping</div>
//                             </div>
//                             <div class="item bom">
//                               <div><i class="fa fa-spinner"></i> <name>MS02</name> <date>Fri, 01/02/2022</date></div>
//                               <div>BOM Pick up</div>
//                             </div>
//                             <div class="item start">
//                               <div><i class="fa fa-check-circle"></i> <name>MS03</name> <date>Sat, 01/03/2022</date></div>
//                               <div>Construction Start</div>
//                             </div>
//                           </div>
//                           <div class="milestones_progress">
//                             <p class="m-b-5">Progress <span class="text-success float-end">40%</span></p>
//                             <div class="progress progress-xs mb-0">
//                               <div class="progress-bar bg-success" role="progressbar" data-bs-toggle="tooltip" title="40%"
//                                 style="width: 40%"></div>
//                             </div>
//                           </div>
//                         </content>
//                       </div>
//                       <div>
//                         <div class="title"><span>Daily Reports</span></div>
//                         <content>
//                           <div class="reports">
//                             <div class="item">
//                               <div><i class="fa fa-file"></i> <a href="#">Date 01/01</a></div>
//                               <div>6x octo antennas installed, 3x AHLOA RRU removed, 2x partial complete cabinet, and alpha sector frames is installed</div>
//                             </div>
//                             <div class="item">
//                               <div><i class="fa fa-file"></i> <a href="#">Date 01/02</a></div>
//                               <div>Off duty due to rainstorm</div>
//                             </div>
//                             <div class="item">
//                               <div><i class="fa fa-file"></i> <a href="#">Date 01/03</a></div>
//                               <div>Off duty due to missing materials</div>
//                             </div>
//                           </div>
//                         </content>
//                       </div>
//                       <div>
//                         <div class="title"><span>Job Issues</span></div>
//                         <content>
//                           <div class="issues">
//                             <div class="item">
//                               <div><name>Missing equipment</name> <div class="text-success">Resolved</div></div>
//                               <div>Reported by: <span>John</span></div>
//                             </div>
//                             <div class="item">
//                               <div><name>Antenna broken</name> <div class="text-success">Resolved</div></div>
//                               <div>Reported by: <span>John</span></div>
//                             </div>
//                             <div class="item">
//                               <div><name>Station water leak</name> <div class="text-danger">Reported</div></div>
//                               <div>Reported by: <span>John</span></div>
//                             </div>
//                           </div>
//                         </content>
//                       </div>
//                     </div>`;
//                 $(this).closest("tr").after(`<tr class="view_tasks"><td colspan="11">${html}</td></tr>`);
//             } else {
//                 $(this).removeClass("on");
//                 $(this).closest("tr").next().remove();
//             }
//         });
//     }
// //
// // });