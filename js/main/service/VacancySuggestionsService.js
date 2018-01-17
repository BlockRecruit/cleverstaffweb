angular.module('services.vacancySuggestions', [
    'ngResource',
    'ngCookies'
]).factory('vacancySuggestions', ['$resource', 'serverAddress', '$filter', '$localStorage', 'notificationService','$rootScope', "Vacancy",
    function ($resource, serverAddress, $filter, $localStorage, notificationService, $rootScope, Vacancy) {

        var vacancySuggestions = $resource(serverAddress + '/candidate/:param', {param: "@param"},
            {
                getAdvices: {
                    method: "GET",
                    params: {
                        param: "getAdvices"
                    }
                },
            });

        vacancySuggestions.getSuggestions = function(params) {
            return new Promise((resolve, reject) => {
               vacancySuggestions.getAdvices(params, response => resolve(response),error => reject(error));
            });
        };

        vacancySuggestions.addCandidateToVacancy = function(params) {
          return new Promise((resolve, reject) => {
              Vacancy.addInterview(params, response => resolve(response), error => reject(error));
          })
        };

        return vacancySuggestions;
    }]);
