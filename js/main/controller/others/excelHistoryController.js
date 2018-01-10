controller.controller('excelHistoryController', ["$localStorage", "frontMode", "googleService", "serverAddress", "$rootScope",
    "$scope", "$routeParams", "Vacancy", "$location", "Candidate", "notificationService", "$translate", "$filter", "$window", "$http",
    function ($localStorage, frontMode, googleService, serverAddress, $rootScope, $scope, $routeParams, Vacancy,
              $location, Candidate, notificationService, $translate, $filter, $window, $http) {
        $scope.serverAddress = serverAddress;
        //Candidate.getSearchHistoryAdmin({type: 'cleverstaff_excel'}, function (resp) {
        //    if (angular.equals(resp.status, "ok")) {
        //        $scope.history = resp.objects;
        //        $scope.historyLimitExcel = resp.size;
        //        $scope.historyTotalExcel = resp.total;
        //    }
        //});
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
        console.log($localStorage.get("archive_excel"));
        console.log($localStorage.get("archive_excel") == 'null');
        if($localStorage.get("archive_excel") == 'archive'){
            //$location.path("ExportLog");
            Candidate.getSearchHistoryAdmin({types: ["cleverstaff_excel", "backup"]}, function (resp) {
                if (angular.equals(resp.status, "ok")) {
                    console.log(resp);
                    $scope.history = resp.objects;
                }
            });
        }else if($localStorage.get("archive_excel") == 'excel'){
            $location.path("excelHistory");
            Candidate.getSearchHistoryAdmin({type: 'cleverstaff_excel'}, function (resp) {
                if (angular.equals(resp.status, "ok")) {
                    $scope.history = resp.objects;
                }
            });
        }else if($localStorage.get("archive_excel") == 'null'){
            Candidate.getSearchHistoryAdmin({types: ["cleverstaff_excel", "backup"]}, function (resp) {
                if (angular.equals(resp.status, "ok")) {
                    console.log(resp);
                    $scope.history = resp.objects;
                }
            });
        }
        $scope.downloadArchive = function(fileId){
            console.log(fileId);
            $rootScope.loading = true;
            $http({
                url: serverAddress + '/candidate/downloadBackUpCandidates?filename=' + fileId,
                method: "GET"
            }).success(function(data) {
                if (data.status == "ok") {
                    $rootScope.loading = false;
                    console.log(data);
                    console.log('here');
                    callback(data.object);
                } else if (data.status == "error") {
                    $rootScope.loading = false;
                    $scope.showErrorAddPhotoMessage = true;
                }
            });
        };
        //$rootScope.exportResumeArchive = function () {
        //    $rootScope.loading = true;
        //    if($scope.loadingExcel == false){
        //        $scope.loadingExcel = true;
        //        if($scope.criteriaForExcel.words == null) {
        //            $scope.criteriaForExcel.searchFullTextType = null;
        //        }
        //        console.log($scope.criteriaForExcel);
        //        Candidate.createBackUpCandidates({}, function (resp) {
        //            console.log(resp);
        //            if (resp.status == 'ok') {
        //                var sr = $rootScope.frontMode == "war" ? "/hr/" : "/hrdemo/";
        //                $('#export_resume_archive')[0].href = sr + 'getapp?id=' + resp.object;
        //                $('#export_resume_archive')[0].click();
        //            }
        //            if (resp.code == 'emptyExportExcel') {
        //                notificationService.error($filter('translate')('No candidates for export according to criteria'));
        //                $scope.loadingExcel = false;
        //            }
        //            $scope.loadingExcel = false;
        //            $rootScope.loading = false;
        //
        //        });
        //    }
        //};
    }]);
