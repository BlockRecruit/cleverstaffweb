controller.controller('excelHistoryController', ["$localStorage", "frontMode", "googleService", "serverAddress", "$rootScope",
    "$scope", "$routeParams", "Vacancy", "$location", "Candidate", "notificationService", "$translate", "$filter", "$window",
    function ($localStorage, frontMode, googleService, serverAddress, $rootScope, $scope, $routeParams, Vacancy,
              $location, Candidate, notificationService, $translate, $filter, $window) {
        $scope.serverAddress = serverAddress;
        Candidate.getSearchHistoryAdmin({type: 'cleverstaff_excel'}, function (resp) {
            if (angular.equals(resp.status, "ok")) {
                $scope.history = resp.objects;
            }
        });
        $rootScope.changeSearchType = function(param){
            $window.location.replace('/!#/candidates');
            $rootScope.changeSearchTypeNotFromCandidates = param;
        }
    }]);
