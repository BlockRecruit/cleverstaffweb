controller.controller('excelHistoryController', ["$localStorage", "frontMode", "googleService", "serverAddress", "$rootScope",
    "$scope", "$routeParams", "Vacancy", "$location", "Candidate", "notificationService", "$translate", "$filter", "$window", "$http",
    function ($localStorage, frontMode, googleService, serverAddress, $rootScope, $scope, $routeParams, Vacancy,
              $location, Candidate, notificationService, $translate, $filter, $window, $http) {
        $scope.serverAddress = serverAddress;
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
        //$scope.getMoreHistoryArchive = function() {
        //    Candidate.getSearchHistoryAdmin({
        //        types: ["cleverstaff_excel", "backup"],
        //        page: {number: 0, count: $scope.historyLimitExcel + 30}
        //    }, function(res) {
        //        if(res.status == 'ok'){
        //            $scope.history = res.objects;
        //            $scope.historyLimitExcel = res.size;
        //            $scope.historyTotalExcel = res.total;
        //        } else{
        //            notificationService.error(res.message);
        //        }
        //    });
        //};
        if($localStorage.get("archive_excel") == 'archive'){
            Candidate.getSearchHistoryAdmin({types: ["cleverstaff_excel", "backup"]}, function (resp) {
                if (angular.equals(resp.status, "ok")) {
                    console.log(resp);
                    $scope.history = resp.objects;
                    $scope.historyLimitExcel = resp.size;
                    $scope.historyTotalExcel = resp.total;
                }
            });
        }else if($localStorage.get("archive_excel") == 'excel'){
            $location.path("excelHistory");
            Candidate.getSearchHistoryAdmin({type: 'cleverstaff_excel'}, function (resp) {
                if (angular.equals(resp.status, "ok")) {
                    $scope.history = resp.objects;
                    $scope.historyLimitExcel = resp.size;
                    $scope.historyTotalExcel = resp.total;
                }
            });
        }else if($localStorage.get("archive_excel") == 'null'){
            Candidate.getSearchHistoryAdmin({types: ["cleverstaff_excel", "backup"]}, function (resp) {
                if (angular.equals(resp.status, "ok")) {
                    $scope.history = resp.objects;
                    $scope.historyLimitExcel = resp.size;
                    $scope.historyTotalExcel = resp.total;
                }
            });
        }
        $scope.downloadArchive = function(fileId){
            $rootScope.loading = true;
            $http({
                url: serverAddress + '/candidate/downloadBackUpCandidates?filename=' + fileId,
                method: "GET",
                responseType: "blob",
                headers: {
                    'Content-Type': 'application/zip; charset=utf-8',
                    'Accept': 'application/zip',
                    'Content-Encoding': 'gzip'
                }
            }).success(function(data) {
                $rootScope.loading = false;
                var blob = data;
                var fileURL = URL.createObjectURL(blob);
                if(data.type == 'application/json'){
                    notificationService.error($filter('translate')('You cannot download more than three resume archives per week in your account'));
                }else{
                    window.open(fileURL);
                }
                if (data.status == "ok") {
                    //callback(data.object);
                } else if (data.status == "error") {
                    notificationService.error(data.message);
                }
            });
        };
    }]);
