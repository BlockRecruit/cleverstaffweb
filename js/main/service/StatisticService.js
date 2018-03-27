 angular.module('services.statistic', [
    'ngResource'
]).factory('Statistic', ['$resource', 'serverAddress', '$rootScope', function($resource, serverAddress, $rootScope) {
    var service = $resource(serverAddress + '/stat/:action', {action: "@action"}, {
        getOrgInfo: {
            method: "GET",
            params: {
                action: "getOrgInfo"
            }
        },
        getOrgInfoWithParams: {
            method: "POST",
            params: {
                action: "getOrgInfo"
            }
        },
        getSalesFunnel: {
            method: "POST",
            params: {
                action: "getSalesFunnel"
            }
        },
        getGroupActionInterviewForStateNew: {
            method: "POST",
            params: {
                action: "getGroupActionInterviewForStateNew"
            }
        },
        getVacancyInterviewDetalInfo: {
            method: "POST",
            params: {
                action: "getVacancyInterviewDetalInfo"
            }
        },
        getVacancyInterviewDetalInfoFile: {
            method: "POST",
            params: {
                action: "getVacancyInterviewDetalInfoFile"
            }
        },
        getDailyReport: {
            method: "POST",
            params: {
                action: "getDailyReport"
            }
        }
    });

    service.parameters = {};

    service.setParam = function (key, value) {
        if(key)
        service.parameters[key] = value;
    };

    service.getParam = function (key) {
        if(key)
            return service.parameters[key];
    };

     service.getVacancyDetailInfo = function(params) {
         $rootScope.loading = true;

         return new Promise((resolve, reject) => {
             service.getVacancyInterviewDetalInfo(params, resp => {
                 if(resp.vacancyInterviewDetalInfo) {
                     let vacancyInterviewDetalInfo = [];
                     angular.forEach(resp.vacancyInterviewDetalInfo, function(value, key) {
                         vacancyInterviewDetalInfo.push({
                             key: key,
                             value: value
                         });
                     });
                     $rootScope.loading = false;
                     resolve(vacancyInterviewDetalInfo);
                 } else {
                     $rootScope.loading = false;
                     reject(resp);
                 }
             }, error => {
                 $rootScope.loading = false;
                 reject(error);
             });
         });
     };

    return service;
}]);
