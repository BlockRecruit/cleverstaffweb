angular.module('services.vacancyStages', [
    'ngResource',
    'ngCookies'
]).factory('vacancyStages', ['$resource', 'serverAddress', '$filter', '$localStorage', 'notificationService','$rootScope',
    function ($resource, serverAddress, $filter, $localStorage, notificationService, $rootScope) {

        var vacancyStages = $resource(serverAddress + '/interviewState/:param', {param: "@param"},
            {
                add: {
                    method: "POST",
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                    params: {
                        param: "add"
                    }
                },
                get: {
                    method: "GET",
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                    params: {
                        param: "get"
                    }
                },
                edit: {
                    method: "POST",
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                    params: {
                        param: "edit"
                    }
                }
            });

        vacancyStages.requestVacancyStages = function (params){
            $rootScope.loading = true;
            return new Promise((resolve, reject) => {
                vacancyStages.get(params, resp => resolve(resp, resp.request = 'stageFull'),error => reject(error));
            });
        };

        return vacancyStages;
    }]);
