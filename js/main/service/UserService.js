angular.module('services.company', [
    'ngResource',
    'ngCookies'
]).factory('Company', ['$resource', 'serverAddress', '$filter', '$localStorage', 'notificationService', '$http', 'Service', "$rootScope",
    function ($resource, serverAddress, $filter, $localStorage, notificationService, $http, Service, $rootScope) {
    var options;

    var company = $resource(serverAddress + '/company/:param', {param: "@param"},
        {
            removeLogo: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "removeLogo"
                }
            },
            addLogo: {
                method: "POST",
                headers: {'Content-type': undefined, 'contentDisposition': 'form-data'},
                params: {
                    param: "addLogo"
                }
            },
            getParam: {
                method: "GET",
                params: {
                    param: "getParam"
                }
            },
            getParams: {
                method: "GET",
                params: {
                    param: "getParams"
                }
            },
            getInfo: {
                method: "GET",
                params: {
                    param: "getInfo"
                }
            },
            setDefaultInterviewStates: {
                method: "GET",
                params: {
                    param: "setDefaultInterviewStates"
                }
            },
            orgPages: {
                method: "GET",
                params: {
                    param: "orgPages"
                }
            },
            addFacebookPage: {
                method: "POST",
                params: {
                    param: "addFacebookPage"
                }
            },
            deleteFacebookPage: {
                method: "GET",
                params: {
                    param: "deleteFacebookPage"
                }
            },
            setParam: {
                method: "GET",
                params: {
                    param: "setParam"
                }
            }
        });

    company.init = function () {

        options = {
            "logo": null
        };
    };

        let openVacancies = {};

        company.uploadCompanyLogo = function(fileUp){
            var FD  = new FormData();
            var blobBin = atob(fileUp.split(',')[1]);
            var array = [];
            for(var i = 0; i < blobBin.length; i++) {
                array.push(blobBin.charCodeAt(i));
            }
            var file=new Blob([new Uint8Array(array)], {type: 'image/png'});
            FD.append('image', file);
            return $http({
                url: serverAddress + "/company/addLogo",
                method: 'POST',
                data: FD,
                headers: { 'Content-Type': undefined},
                transformRequest: angular.identity
            });
        };

        company.requestGetInfo = function (params) {
            $rootScope.loading = true;
            return new Promise((resolve, reject) => {
                company.getInfo(params, resp => resolve(resp), error => reject(error));
            });
        };


        company.getAllOpenVacancies = function(string) {
            return new Promise((resolve,reject) => {
                if(angular.equals(openVacancies, {})){
                    Service.getAllOpenVacancy({
                        alias: string
                    },(resp) => {
                        if(resp.vacancies){
                            openVacancies = resp;
                            resolve(resp);
                        } else {
                            reject(resp.messsage);
                        }
                    });
                } else {
                    resolve(openVacancies)
                }
            });
        };


        company.getVacanciesLocation = function() {
            let locations = [];
            openVacancies.vacancies.map((vacancy) => {
                if(vacancy.region && vacancy.region.country) {
                    if(locations.indexOf(vacancy.region.country) === -1) {
                        locations.push(vacancy.region.country);
                    }
                }
            });
            return locations;
        };

        company.getVacanciesPosition = function() {
            return openVacancies.vacancies.map((vacancy) => {
                return vacancy.position;
            });
        };

        company.positionAutoCompleteResult = function(string = "") {
            let data = [];
                openVacancies.vacancies.map((vacancy) => {
                    if(vacancy.position.toLowerCase().indexOf(string.toLowerCase()) !== -1) {
                        data.push(vacancy.position);
                    }
                });
            return data;
        };

    company.init();
    return company;
}]);
