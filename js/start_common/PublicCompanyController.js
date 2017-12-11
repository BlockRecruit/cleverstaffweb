controller.controller('PublicCompanyController', ['$scope', '$rootScope', 'serverAddress', 'Service', 'Company',
    'notificationService', '$routeParams', '$window',
    function ($scope, $rootScope, serverAddress, Service, Company, notificationService, $routeParams, $window) {
        $scope.loaded = false;

        $scope.getAllVacancyForCompany = function(){
            var string = $routeParams.nameAlias.replace('-vacancies', '');
            Company.getAllOpenVacancies(string)
                .then((resp) => {
                    $scope.orgParams = resp;
                    $window.document.title = $scope.orgParams.orgName + ' ' + 'vacancies';
                    $scope.logoLink = '/hr/getlogo?id=' + $scope.orgParams.companyLogo + '';
                    $scope.serverAddress = serverAddress;
                    $scope.loaded = true;
                    $scope.$apply();
                }, (err) => {
                    console.error(err);
                });
        };


        $scope.getAllVacancyForCompany();
        $rootScope.addNewHistory = function(localId){
            console.log(localId);
            console.log($window);
            console.log($window.location);
            console.log(history);
            //$window.location.pathname = '/';
            //$window.location.hash = '';
            //console.log($window.location);
            //history.pushState(null, null, "vacancy-" + localId);
            //$window.location = $window.location.origin + "/" + "vacancy-" + localId
        };
        window.onpopstate = function(event) {
            console.log(event);
            window.setTimeout(function () {
                history.pushState("", "", $window.location.pathname);
            }, 3000);
            alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
        };
    }]
);
/*** Created by вик on 07.07.2016.*/
