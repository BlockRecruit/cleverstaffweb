angular.module('services.mail', [
    'ngResource'
]).factory('Mail', ['$resource', 'serverAddress', '$uibModal', '$rootScope', function ($resource, serverAddress, $uibModal, $rootScope) {
     var service = $resource(serverAddress + '/mail/:param', {param: "@param"},
        {
            createTemplate: {
                method: 'POST',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "createTemplate"
                }
            },
            getTemplate: {
                method: 'GET',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getTemplate"
                }
            },
            getTemplateVacancy: {
                method: 'GET',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getTemplateVacancy"
                }
            },
            getTemplatesVacancy: {
                method: 'GET',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getTemplatesVacancy"
                }
            },
            removeTemplate: {
                method: 'GET',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "removeTemplate"
                }
            },
            getTemplatePost: {
                method: 'POST',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getTemplate"
                }
            },
            updateTemplate: {
                method: 'POST',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "updateTemplate"
                }
            },
            sendMailByTemplate: {
                method: "POST",
                params: {
                    param: "sendMailByTemplate"
                }
            },
            getDefaultTemplate: {
                method: "GET",
                params: {
                    param: "getDefaultTemplate"
                }
            }
        });
     service.sendMailByTemplateVerified = function (queryPrams, successCallback, errorCallback) {
         service.sendMailByTemplate(queryPrams, function (resp) {
             if(resp.status == 'error' && resp.code == 'errorSendFromGmail') {
                 $rootScope.closeModal();
                 $rootScope.modalInstance =  $uibModal.open({
                     animation: true,
                     templateUrl: '../partials/modal/reintegrate-gmail.html',
                     size: '',
                     resolve: function(){
                     }
                 });
                 $rootScope.closeModal = function () {
                     $rootScope.modalInstance.close();
                     delete $rootScope.modalInstance;
                 };
             }else if(resp.code == 'сouldNotGetRefreshTokenIntegration') {
                 $rootScope.closeModal();
                 $rootScope.modalInstance = $uibModal.open({
                     animation: true,
                     templateUrl: '../partials/modal/gmail-access.html',
                     resolve: {
                     }
                 });
                 $rootScope.closeModal = function () {
                     $rootScope.modalInstance.close();
                     delete $rootScope.modalInstance;
                 };
             } else {
                 successCallback(resp);
             }
         }, function (err) {
            if(errorCallback) {
                errorCallback(err);
            }
         });
     };
     return service;
}]);