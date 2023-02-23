$(document).ready(function () {
  const $1 = async () => {
    await $.ajax({
      url: "/data" + url,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      success: function (response) {
        $data = response;
      }
    });
  };


 /* $('#DataTables_Table_0').dataTable({
    destroy: true,
    aaData: response.data
  });*/
  function fetchData() {
    $.ajax({
      url: "/skyfields/admin/jobs",
      type: "GET",
      success: function(response) {
        response.status ? window.location.replace(response.redirect) : $.notification("warning", response.message, 3000);
      }
    });
  }
  fetchData();


  function actionCreateJobs() {
    debugger;
    const jobName = $("input[name='create_jobName']").val();
    const startDate = $("input[name='create_startDate']").val();
    const endDate = $("input[name='create_endDate']").val();
    const rate = $("input[name='create_rate']").val();
    const rateType = $("input[name='create_rate']").val();
    const priority = $("input[name='create_priority']").val();
    const description = $("#editor").html();
    let dataCreate = {
        name: jobName,
      team_id: "None",
      status: "Start",
      start_date: startDate,
      end_date: endDate,
      // rate: rate,
      sitelocation_id: "None",
      scope_of_work: "None",
      project_id: "1",
      description: description
    };
    debugger;
    $.ajax({
      url: "/skyfields/admin/jobs",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(dataCreate),
      success: function(response) {
        debugger;
        response.status ? window.location.replace(response.redirect) : $.notification("warning", response.message, 3000);
      }
    });
    debugger;
  }
  $(".submitCreate_jobs").click(function () {
    debugger;
    const jobName = $("input[name='create_jobName']").val();
    const startDate = $("input[name='create_startDate']").val();
    const endDate = $("input[name='create_endDate']").val();
    const rate = $("input[name='create_rate']").val();
    const rateType = $("input[name='create_rate']").val();
    const priority = $("input[name='create_priority']").val();
    const description = $("#editor").html();
    let dataCreate = {
            name: jobName,
      team_id: "Node",
      status: "Start",
      start_date: startDate,
      end_date: endDate,
      // rate: rate,
      sitelocation_id: "None",
      scope_of_work: "None",
      project_id: "1",
      description: description,
      priority: priority
    };
    debugger;
    $.ajax({
      url: "/skyfields/admin/jobs",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(dataCreate),
      success: function(response) {
        debugger;
        response.status ? window.location.replace(response.redirect) : $.notification("warning", response.message, 3000);
      }
    });
    debugger;
  });

  const $2 = async () => {
    const data = await $1();
  };
  $(".datatable").DataTable({
    dom: '<"table_header"<"left"lf><"right"B>>t<"table_footer"ip>',
    pageLength: 10,
    lengthMenu: [ 10, 25, 50, 75, 100 ],
    paging: true,
    buttons: {
      buttons: [
          { extend: 'pdf', className: 'btn btn-primary', text: '<i class="fa fa-file-pdf-o"></i> PDF' },
          { extend: 'excel', className: 'btn btn-primary', text: '<i class="fa fa-file-excel-o"></i> Excel' }
      ]
    },
    // columnDefs: [
    //   {
    //     targets: 0,
    //     render: function (data, type, row) {
    //       return `<div class="form-check form-check-sm form-check-custom form-check-solid">
    //                 <input class="form-check-input" type="checkbox" value="${data}" />
    //               </div>`;
    //     },
    //     orderable: false,
    //   },
    // ],
    // data: data,
    drawCallback: function() {
      ShowTask();
    }
    // scrollX:        true,
    // scrollCollapse: true,
    // fixedColumns: {
    //   left: 1,
    //   right: 1
    // }
  });
  
  $2();
  
  function ShowTask() {
    $(".show_tasks").removeClass("on");
    $(".show_tasks").unbind("click");
    $(".show_tasks").click(function () {
      if(!$(this).hasClass("on")) {
        $(this).addClass("on");
        const index = $(this).closest("tr").index();
        
        var html = `<div class="project_progress">
                      <div>
                        <div class="title"><span>Job Milestones</span></div>
                        <content>
                          <div class="milestones">
                            <div class="item precon">
                              <div><i class="fa fa-check-circle"></i> <name>MS01</name> <date>Thu, 01/01/2022</date></div>
                              <div>Precon Scoping</div>
                            </div>
                            <div class="item bom">
                              <div><i class="fa fa-spinner"></i> <name>MS02</name> <date>Fri, 01/02/2022</date></div>
                              <div>BOM Pick up</div>
                            </div>
                            <div class="item start">
                              <div><i class="fa fa-check-circle"></i> <name>MS03</name> <date>Sat, 01/03/2022</date></div>
                              <div>Construction Start</div>
                            </div>
                          </div>
                          <div class="milestones_progress">
                            <p class="m-b-5">Progress <span class="text-success float-end">40%</span></p>
                            <div class="progress progress-xs mb-0">
                              <div class="progress-bar bg-success" role="progressbar" data-bs-toggle="tooltip" title="40%"
                                style="width: 40%"></div>
                            </div>
                          </div>
                        </content>
                      </div>
                      <div>
                        <div class="title"><span>Daily Reports</span></div>
                        <content>
                          <div class="reports">
                            <div class="item">
                              <div><i class="fa fa-file"></i> <a href="#">Date 01/01</a></div>
                              <div>6x octo antennas installed, 3x AHLOA RRU removed, 2x partial complete cabinet, and alpha sector frames is installed</div>
                            </div>
                            <div class="item">
                              <div><i class="fa fa-file"></i> <a href="#">Date 01/02</a></div>
                              <div>Off duty due to rainstorm</div>
                            </div>
                            <div class="item">
                              <div><i class="fa fa-file"></i> <a href="#">Date 01/03</a></div>
                              <div>Off duty due to missing materials</div>
                            </div>
                          </div>
                        </content>
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
        $(this).closest("tr").after(`<tr class="view_tasks"><td colspan="11">${html}</td></tr>`);
      }
      else {
        $(this).removeClass("on");
        $(this).closest("tr").next().remove();
      }
    });
  }
});