import { Fetch, Delete, documentId } from "/app.js";

$(document).ready(function () {
  $(".owl-carousel").owlCarousel({
    loop:true,
    nav:true,
    navText: ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
    margin:10,
    responsiveClass:true,
    responsive:{
      0:{
        items:2,
        nav:true
      },
      600:{
        items:2,
        nav:false
      },
      1000:{
        items:3,
        nav:true,
        loop:false
      }
    }
  })

  $("#create_milestone .start_date, #create_milestone .end_date").datetimepicker({
    format: "MM/DD/YYYY"
  });

  $(".topic_select").on("change", function () {
    var value = $(this).val();f
    $(".type_select").addClass("off");
    $(`.type_select[topic=${value}]`).removeClass("off");
  });

  $(".datatable").DataTable({
    dom: '<"table_header"<"left"lf><"right"B>>t<"table_footer"ip>',
  });

  // const filters = [
  //   { name: "firebase_uid", operator: "==", value: "HapatE1OXVdyAuiSiYJArQ4ppaB2" },
  //   { name: "role", operator: "==", value: "admin" },
  // ];

  const filters = [
    { name: "name", operator: "in", value: ["A", "C"] }
  ];

  var test;

  const $1 = async function() {
    test = await Fetch("customers");
    console.log(test);
  }
  
  $1();

  /*const getJobById = async function() {
    debugger;
    const filters = [
      { name: "id", operator: "==", value: "jobs_1676824983961" }
    ];
    const result = await Fetch('jobs', filters);
    console.log('result get job by id = ',result);
  }
  getJobById();*/


});