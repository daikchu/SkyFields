const project = "skyfields";
module.exports = {
  project: project,
  urls: {
    login: "/",
    logout: "/logout",
    admin: {
      dashboard: "/" + project + "/admin/dashboard",
      jobs: "/" + project + "/admin/jobs",
      job: "/" + project + "/admin/job",
      task: "/" + project + "/admin/task",
      employees: "/" + project + "/admin/employees",
      employee: "/" + project + "/admin/employee",
      teams: "/" + project + "/admin/teams",
      team: "/" + project + "/admin/team",
      customers: "/" + project + "/admin/customers",
      customer: "/" + project + "/admin/customer",
      jobTemplates: "/" + project + "/admin/settings/job/templates",
      jobTemplate: "/" + project + "/admin/settings/job/template",
      jobCreateTemplate: "/" + project + "/admin/settings/job/create-template",
      taskTemplates: "/" + project + "/admin/settings/tasks/templates",
      taskTemplate: "/" + project + "/admin/settings/task/template",
      taskCreateTemplate: "/" + project + "/admin/settings/task/create-template"
    },
    employee: {
      dashboard: "/" + project + "/employee/dashboard"
    },
    profile: "/" + project + "/profile",
    chat: "/" + project + "/chat"
  }
}