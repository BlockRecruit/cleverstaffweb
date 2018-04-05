controller.controller('excelHistoryController', ["$localStorage", "frontMode", "googleService", "serverAddress", "$rootScope",
    "$scope", "$routeParams", "Vacancy", "$location", "Candidate", "notificationService", "$translate", "$filter", "$window",
    function ($localStorage, frontMode, googleService, serverAddress, $rootScope, $scope, $routeParams, Vacancy,
              $location, Candidate, notificationService, $translate, $filter, $window) {
        $scope.serverAddress = serverAddress;

        $scope.buildListExecl = function () {
            $rootScope.loading = true;
            Candidate.getSearchHistoryAdmin({type: 'cleverstaff_excel'}, function (resp) {
                if (angular.equals(resp.status, "ok")) {
                    $scope.history = resp.objects;
                    $scope.historyLimitExcel = resp.size;
                    $scope.historyTotalExcel = resp.total;
                    $rootScope.loading = false;
                }
            });
        };

        $scope.buildListExecl();

        $rootScope.changeSearchType = function(param){
            $window.location.replace('/!#/candidates');
            $rootScope.changeSearchTypeNotFromCandidates = param;
        };

        $scope.getMoreHistoryExcel = function() {
            Candidate.getSearchHistoryAdmin({
                type: 'cleverstaff_excel',
                page: {number: 0, count: $scope.historyLimitExcel + 30}
            }, function(res) {
                if(res.status == 'ok'){
                    $scope.history = res.objects;
                    $scope.historyLimitExcel = res.size;
                    $scope.historyTotalExcel = res.total;
                } else{
                    notificationService.error(res.message);
                }
            });
        };

        function downloadExel(id, button) {
            var sr = $rootScope.frontMode == "war" ? "/hr/" : "/hrdemo/";

            if(id){
                $('#export_in_excel')[0].href = sr + 'getapp?id=' + id;
                $('#export_in_excel')[0].click();
            }
        }

        $scope.downloadExel = downloadExel;
    }]);
