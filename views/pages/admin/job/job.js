skyApp.controller('jobController', myController);

function myController($scope, $http, $filter, genPageShowing, isNotEmpty) {
    /**variable*/
    $scope.isLoading = false;
    $scope.job = {};
    $scope.jobId = $('#jobId').val();
    $scope.milestoneNew = {};
    /**methods*/
    $scope.getJobById = async function () {//same jobs
        const jobId = $('#jobId').val();
        if (!jobId) return;
        $scope.isLoading = true;
        await $http.get(API_PREFIX + "/skyfields/admin/job/" + jobId)
            .then(function (response) {
                if (response != null && response !== 'undefined' && response.status === 200) {
                    $scope.job = response.data.data;
                } else {
                    $.notification("warning", response.data.message, 3000);
                }
            }, function (error) {
                $.notification("warning", error.data.message, 3000);
            }).finally(function () {
                $scope.isLoading = false;
            });
    };
    //Open
    //Inprogress
    //Completed
    $scope.calProcessMilestone = function (milestones) {//same jobs
        if(!milestones) return 30;
        const countCompleted = milestones.filter(el => el.status === 'Completed').length;
        if (!countCompleted || countCompleted === 0) return 0;
        else return countCompleted / milestones.length * 100;
    };

    $scope.actionCreateMilestone = async function(){
        $scope.milestoneNew.job_id = $scope.jobId;

        $scope.isLoading = true;
        await $http.post(API_PREFIX + "/skyfields/admin/job/milestones", $scope.milestoneNew)
            .then(
                function (response) {
                    if (response && response.status === 200) {
                        $.notification("success", response.data.message, 3000);
                        $('#create_milestone').modal('hide');
                        $scope.milestoneNew = {};
                        $scope.getJobById();
                    } else {
                        $.notification("warning", response.data.message, 3000);
                    }
                }, function (error) {
                    $.notification("warning", error.data.message, 3000);
                }).finally(function () {
                $scope.isLoading = false;
            });
    };

    /*$scope.processStyle = {
        width: $scope.calProcessMilestone($scope.job.milestones)+'%',
    };*/

    /**init*/

    $scope.getJobById();
}