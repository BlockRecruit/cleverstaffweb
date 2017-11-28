controller.controller('ContactAddController',["$scope", "$location", "$routeParams", "$cookies", "Contacts", "Client", "$rootScope", "notificationService", "$filter", "$localStorage", "$window", function($scope, $location, $routeParams, $cookies, Contacts, Client, $rootScope, notificationService, $filter, $localStorage, $window) {
    $scope.showAddClient = true;
    $scope.pageType = "add";

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
    $scope.saveType = false;

    if ($localStorage.isExist("contactForSave")) {
        $scope.contact = angular.fromJson($localStorage.get("contactForSave"));
        $localStorage.remove("contactForSave");
        if ($scope.contact.contacts) {
            angular.forEach($scope.contact.contacts, function(val) {
                if (angular.equals(val.type, "email")) {
                    $scope.contacts.email = val.value;
                }
                if (angular.equals(val.type, "mphone")) {
                    $scope.contacts.mphone = val.value;
                }
                if (angular.equals(val.type, "skype")) {
                    $scope.contacts.skype = val.value;
                }
                if (angular.equals(val.type, "linkedin")) {
                    $scope.contacts.linkedin = val.value;
                }
                if (angular.equals(val.type, "facebook")) {
                    $scope.contacts.facebook = val.value;
                }
                if (angular.equals(val.type, "googleplus")) {
                    $scope.contacts.googleplus = val.value;
                }
                if (angular.equals(val.type, "homepage")) {
                    $scope.contacts.homepage = val.value;
                }
            });
        }
        $scope.contact.contacts = null;
    } else {
        Client.one({"localId": $routeParams.id}, function(resp) {
            if (resp.status == "ok") {
                // console.log("RESP");
                // console.log( $scope.client);
                $scope.client = resp.object;
                $scope.contact = {
                    clientId: {
                        clientId: $scope.client.clientId
                    }
                };
            } else {

            }
        });

    }
    // console.log("INIT");
    $scope.cancel = function() {
        console.log($routeParams.id);
        $location.path("/clients/" + $routeParams.id);
    };
    $scope.errorMessage = {
        show: false,
        message: ""
    };
    $scope.contact = null;
    $scope.save = function() {
        $scope.buttonClicked = true;
        if ($scope.contactForm.$valid && ($scope.contacts.mphone || $scope.contacts.email || $scope.contacts.skype || $scope.contacts.linkedin || $scope.contacts.facebook || $scope.contacts.googleplus || $scope.contacts.homepage)) {
            $scope.buttonClicked = false;
            var contacts = [];
            if ($scope.contacts.email) {
                contacts.push({type: "email", value: $scope.contacts.email});
            }
            if ($scope.contacts.skype) {
                contacts.push({type: "skype", value: $scope.contacts.skype});
            }
            if ($scope.contacts.mphone) {
                contacts.push({type: "mphone", value: $scope.contacts.mphone});
            }
            if ($scope.contacts.facebook) {
                contacts.push({type: "facebook", value: $scope.contacts.facebook});
            }
            if ($scope.contacts.homepage) {
                contacts.push({type: "homepage", value: $scope.contacts.homepage});
            }
            if ($scope.contacts.linkedin) {
                contacts.push({type: "linkedin", value: $scope.contacts.linkedin});
            }
            if ($scope.contacts.googleplus) {
                contacts.push({type: "googleplus", value: $scope.contacts.googleplus});
            }
            $scope.contact.contacts = contacts;
           if($scope.saveType === false){
               Contacts.add($scope.contact, function(resp) {
                   $scope.errorMessage.show = false;
                   if (angular.equals(resp.status, "ok")) {
                       notificationService.success($filter('translate')("contact save"));
                       $location.path("/contacts/" + resp.object.localId);
                   } else {
                       $scope.errorMessage.show = true;
                       $scope.errorMessage.message = resp.message;
                   }
               }, function() {
                   //notificationService.error($filter('translate')('service temporarily unvailable'));
                   $localStorage.set("contactForSave", $scope.contact);
                   $cookies.url = $location.$$url;
                   $cookies.cfauth = 'false';
                   $window.location.replace('/');

               });
           }else{
               Contacts.addContactAndSignUp($scope.contact, function(resp) {
                   $scope.errorMessage.show = false;
                   if (angular.equals(resp.status, "ok")) {
                       notificationService.success($filter('translate')("contact save"));
                       $location.path("/contacts/" + resp.object.localId);
                   } else {
                       $scope.errorMessage.show = true;
                       $scope.errorMessage.message = resp.message;
                   }
               }, function() {
                   //notificationService.error($filter('translate')('service temporarily unvailable'));
                   $localStorage.set("contactForSave", $scope.contact);
                   $cookies.url = $location.$$url;
                   $cookies.cfauth = 'false';
                   $window.location.replace('/');

               });
           }
        } else {
            $scope.contactForm.name.$pristine = false;
            $scope.contactForm.lastName.$pristine = false;
            $scope.contactForm.position.$pristine = false;
            if($scope.contactForm.name.$invalid || $scope.contactForm.lastName.$invalid){
                $('html, body').animate({scrollTop: $('.AddingContact').offset().top}, 800);
            }
            //if($scope.contacts.mphone || $scope.contacts.email || $scope.contacts.skype || $scope.contacts.linkedin || $scope.contacts.facebook || $scope.contacts.googleplus || $scope.contacts.homepage){
            //    $('.please-fill').removeClass("errorTxt");
            //}else{
            //    $('.please-fill').addClass("errorTxt");
            //}
        }
    };

}]);
