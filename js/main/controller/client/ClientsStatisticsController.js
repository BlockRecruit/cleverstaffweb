controller.controller('ClientsStatisticsController', ['$scope', 'Company', '$rootScope', 'Service', function($scope, Company, $rootScope, Service) {
    Service.getOrgLogoId({orgId: $rootScope.me.orgId}, function(logoResp) {
        if (logoResp.status === 'ok') {
            $scope.companyLogo = logoResp.object;
        }
    });
}]);