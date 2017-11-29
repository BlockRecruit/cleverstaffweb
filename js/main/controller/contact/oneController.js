controller.controller('ContactsOneController', ["$scope", "Contacts", "$routeParams", "$location", "notificationService", "$filter", function($scope, Contacts, $routeParams, $location, notificationService, $filter) {
    Contacts.one({"localId": $routeParams.id}, function(resp) {
        if (resp.status === "error" || angular.equals(resp.object.status, "R")) {
            notificationService.error($filter('translate')('contact not found'));
            if (resp.object && resp.object.clientId && resp.object.clientId.localId) {
                $location.path('/clients/' + resp.object.clientId.localId);
            } else {
                $location.path('/clients');
            }
        } else {

            $scope.contact = resp.object;
            $location.hash($filter('transliteration')(resp.object.firstName + "_" + resp.object.lastName)).replace();
            $scope.contacts = {
                skype: null,
                email: null,
                phone: null,
                mphone: null,
                facebook: null,
                homepage: null,
                linkedin: null,
                googleplus: null,
                vk: null,
                other: null
            };
            if (resp.object.contacts) {
                angular.forEach(resp.object.contacts, function(val) {
                    switch (val.type) {
                        case "email":
                            $scope.contacts.email = val.value;
                            break;
                        case "mphone":
                            $scope.contacts.mphone = val.value;
                            break;
                        case "facebook":
                            $scope.contacts.facebook = val.value;
                            break;
                        case "homepage":
                            $scope.contacts.homepage = val.value;
                            break;
                        case "linkedin":
                            $scope.contacts.linkedin = val.value;
                            break;
                        case "googleplus":
                            $scope.contacts.googleplus = val.value;
                            break;
                        case "vk":
                            $scope.contacts.vk = val.value;
                            break;
                        case "other":
                            $scope.contacts.other = val.value;
                            break;
                        case "phone":
                            $scope.contacts.phone = val.value;
                            break;
                        case "skype":
                            $scope.contacts.skype = val.value;
                            break;
                    }
                });
            }
        }
    }, function() {
        //notificationService.error($filter('translate')('service temporarily unvailable'));
    });
}]);
