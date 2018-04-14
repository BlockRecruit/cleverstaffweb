controller.controller('excelHistoryController', ["$localStorage", "frontMode", "googleService", "serverAddress", "$rootScope",
    "$scope", "$stateParams", "Vacancy", "$location", "Candidate", "notificationService", "$translate", "$filter", "$window",
    function ($localStorage, frontMode, googleService, serverAddress, $rootScope, $scope, $stateParams, Vacancy,
              $location, Candidate, notificationService, $translate, $filter, $window) {
        $scope.serverAddress = serverAddress;
        Candidate.getSearchHistoryAdmin({type: 'cleverstaff_excel'}, function (resp) {
            if (angular.equals(resp.status, "ok")) {
                $scope.history = resp.objects;
                $scope.historyLimitExcel = resp.size;
                $scope.historyTotalExcel = resp.total;
            }
        });
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
    }]);
