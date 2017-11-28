angular.module('services.reportAll', [
    'ngResource',
    'ngCookies'
]).factory('Stat', ['$resource', 'serverAddress', '$filter', '$localStorage','$rootScope', function($resource, serverAddress, $filter, $localStorage, $rootScope) {

    var stat = $resource(serverAddress + '/stat/:param', {param: "@param"}
        , {
            getActualVacancyStatistic: {
                method : "POST",
                headers: {'Content-type':'application/json; charset=UTF-8'},
                params: {
                    param: 'getActualVacancyStatistic'
                }
            },
            getActualVacancyStatistic2: {
                method : "POST",
                headers: {'Content-type':'application/json; charset=UTF-8'},
                params: {
                    param: 'getActualVacancyStatistic2'
                }
            },
            createVacancyStatisticExcel: {
                method : "POST",
                headers: {'Content-type':'application/json; charset=UTF-8'},
                params: {
                    param: 'createVacancyStatisticExcel'
                }
            },
            getRecruiterNowStatistic: {
                method : "POST",
                headers: {'Content-type':'application/json; charset=UTF-8'},
                params: {
                    param: 'getRecruiterNowStatistic'
                }
            },
            getCountVacancyForActualVacancyStatistic: {
                method : "POST",
                headers: {'Content-type':'application/json; charset=UTF-8'},
                params: {
                    param: 'getCountVacancyForActualVacancyStatistic'
                }
            },
            getCountInterviewForActualVacancyStatistic: {
                method : "POST",
                headers: {'Content-type':'application/json; charset=UTF-8'},
                params: {
                    param: 'getCountInterviewForActualVacancyStatistic'
                }
            },
            getVacancyListInAccount: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params : {
                    param : "getVacancyListInAccount"
                }
            },
            getStatisticsByVacancies: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params : {
                    param : "getStatisticsByVacancies"
                }
            },
            saveCustomVacancyReport: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params : {
                    param : "saveCustomVacancyReport"
                }
            },
            getCustomVacancyReports: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params : {
                    param : "getCustomVacancyReports"
                }
            },
            deleteCustomVacancyReport: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params : {
                    param : "deleteCustomVacancyReport"
                }
            },
            editCustomVacancyReport: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params : {
                    param : "editCustomVacancyReport"
                }
            }
        }),
        data = false;


        stat.requestSaveCustomVacancyReport = function (params){
            $rootScope.loading = true;
            return new Promise((resolve, reject) => {
                stat.saveCustomVacancyReport(params, resp => resolve(resp),error => reject(error));
            });
        };
        stat.requestEditCustomVacancyReport = function (params){
            $rootScope.loading = true;
            return new Promise((resolve, reject) => {
                stat.editCustomVacancyReport(params, resp => resolve(resp),error => reject(error));
            });
        };
        stat.requestGetCustomVacancyReports= function (){
            $rootScope.loading = true;
            return new Promise((resolve, reject) => {
                stat.getCustomVacancyReports(resp => resolve(resp),error => reject(error));
            });
        };
        stat.requestGetActualVacancyStatistic2 = function (params, update){
            $rootScope.loading = true;
            return new Promise((resolve, reject) => {
                if(update && data) return resolve(data);
                stat.getActualVacancyStatistic2(params, resp => {
                    if(resp.object.entryList && resp.object.entryList.length > 0){
                        data = resp;
                        resolve(resp, resp['request'] = 'Statistic2');
                    }else{
                        resp.object.entryList = [];
                        resolve(resp, resp['request'] = 'Statistic2');
                    }
                },error => reject(error));
            });
        };
        stat.requestDeleteCustomVacancyReport = function (params){
            $rootScope.loading = true;
            return new Promise((resolve, reject) => {
                stat.deleteCustomVacancyReport(params, resp => resolve(resp),error => reject(error));
            });
        };
    stat.requestGetCountVacancyForActualVacancyStatistic = function (params){
        $rootScope.loading = true;
        return new Promise((resolve, reject) => {
            stat.getCountVacancyForActualVacancyStatistic(params, resp => resolve(resp,resp['request'] = 'statusesOrCount'),error => reject(error));
        });
    };

    stat.requestGetCountInterviewForActualVacancyStatistic = function (params){
        $rootScope.loading = true;
        return new Promise((resolve, reject) => {
            stat.getCountInterviewForActualVacancyStatistic(params, resp => resolve(resp, resp['request'] = 'stagesOrCount'),error => reject(error));
        });
    };


    return stat;
}]);