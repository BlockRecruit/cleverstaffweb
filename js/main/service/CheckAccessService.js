angular.module('services.checkAccess', [
    'ngResource',
    'ngCookies',
    'services.person'
]).factory('CheckAccess', ['Person', '$location', '$cookies', '$rootScope','notificationService', 'frontMode', '$filter', '$uibModal',
    function(Person, $location, $cookies, $rootScope, notificationService, frontMode, $filter, $uibModal) {
        var timer = 0;
    var access = {
        check: function($window, route, params) {
            timer = 0;
            Person.authPing(function success(data) {
                if (data.status === 'ok') {
                    if($rootScope.modalLoginForm){
                        $rootScope.modalLoginForm.close();
                        delete $rootScope.modalLoginForm;
                        location.reload();
                    }
                }
                if (data.status === 'error') {
                    $cookies.url = $location.$$url;
                    if (route && route.originalPath == '/vacancies/:id') {
                        $window.location.replace($location.$$protocol + "://" + $location.$$host + "/i#/pv/" + params.id);
                    } else {
                        //$window.location.replace('/');
                    }
                } else {
                    $rootScope.i = 0;
                    PNotify.removeAll();
                    $cookies.cfauth = 'true';
                    $cookies.lasturl = $location.$$url;
                    //$rootScope.me = data;
                }

            }, function err(status) {
                $cookies.url = $location.$$url;
                $cookies.cfauth = 'false';

                if (route && route.originalPath == '/vacancies/:id') {
                    if (frontMode == 'demo') {
                        $window.location.replace($location.$$protocol + "://" + $location.$$host + "/di#/pv/" + params.id);
                    } else {
                        $window.location.replace($location.$$protocol + "://" + $location.$$host + "/i#/pv/" + params.id);
                    }
                } else if(status.status == 403) {
                    if(!$rootScope.modalLoginForm){
                        $rootScope.modalLoginForm = $uibModal.open({
                            animation: true,
                            templateUrl: '../partials/modal/no-access-modal.html',
                            size: '',
                            backdrop: 'static',
                            keyboard: false,
                            resolve: function () {

                            }
                        });
                    }
                   if(timer == 0){
                       setTimeout(function(){
                           access.check();
                           timer++;
                       },30000)
                   }
                    //$window.location.replace('/');
                }else{
                    $rootScope.i++;
                    if( $rootScope.i == '1'){
                        new PNotify({
                            text: $filter('translate')('No connection to the server, check the Internet connection'),
                            hide: false,
                            type: 'error'
                        });
                    }
                }
            });
        }
    };
        return access;
}]);
