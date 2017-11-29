controller.controller('userInfoController',["$scope", "Person", function($scope, Person) {
    Person.getMe(function(resp) {
        $scope.me = resp;
    });
}]);
