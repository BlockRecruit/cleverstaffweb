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
        $scope.getMoreHistoryArchive = function() {
            Candidate.getSearchHistoryAdmin({
                types: ["cleverstaff_excel", "backup"],
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
                    console.log(resp);
                    $scope.history = resp.objects;
                    $scope.historyLimitExcel = resp.size;
                    $scope.historyTotalExcel = resp.total;
                }
            });
        }
        $scope.downloadArchive = function(fileId){
            console.log(fileId);
            //var FD  = new FormData();
            //var blobBin = atob(fileId.split(',')[1]);
            //var array = [];
            //for(var i = 0; i < blobBin.length; i++) {
            //    array.push(blobBin.charCodeAt(i));
            //}
            //var file=new Blob([new Uint8Array(array)], {type: 'application/zip'});
            //FD.append('application', file);
            //return $http({
            //    url: serverAddress + "/candidate/downloadBackUpCandidates?filename=" + fileId,
            //    method: 'GET',
            //    data: FD,
            //    withCredentials: true,
            //    headers: { 'Content-Type': undefined},
            //    transformRequest: angular.identity
            //});
            //$rootScope.loading = true;
            $http({
                url: serverAddress + '/candidate/downloadBackUpCandidates?filename=' + fileId,
                method: "GET"
                //responseType: "blob",
                //headers: {
                //    'Content-Type': 'application/zip; charset=utf-8',
                //    'Accept': 'application/zip',
                //    'Content-Encoding': 'gzip'
                //}
            }).success(function(data) {
                console.log(data);
                //var blob = data;
                //var contentType = blob.type("application/zip");
                //console.log(contentType);
                //var fileURL = URL.createObjectURL(blob);
                //window.open(fileURL);
                //var FileSaver = require('file-saver');
                //var blob = new Blob(["Hello, world!"], {type: "application/zip"});
                //FileSaver.saveAs(blob, "hello world.txt");
                //console.log(data);
                if (data.status == "ok") {
                    $rootScope.loading = false;
                    console.log('here');
                    callback(data.object);
                } else if (data.status == "error") {
                    $rootScope.loading = false;
                    notificationService.error(data.message);
                    $scope.showErrorAddPhotoMessage = true;
                }
            });
        };
    }]);
