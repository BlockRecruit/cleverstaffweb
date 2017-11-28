controller.controller('ContactEditController', ["$scope", "$rootScope", "$location", "$routeParams", "Contacts",
    "Client", "notificationService", "$filter", "$uibModal", function($scope, $rootScope, $location, $routeParams, Contacts, Client, notificationService, $filter, $uibModal) {
    $scope.contactId = $routeParams.contactId;
    $scope.showAddClient = false;
    $scope.pageType = "edit";
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
    $scope.errorMessage = {
        show: false,
        text: ""
    };
    $scope.cancel = function() {
        $location.path("/contacts/" + $routeParams.contactId);
    };
    Client.all(Client.searchOptions(), function(response) {
        $scope.clients = response.objects;
    });

    Contacts.one({"localId": $scope.contactId}, function(resp) {
        if (angular.equals(resp.status, "ok") && angular.equals(resp.object.status, "A")) {
            $scope.contact = resp.object;
            $scope.client = resp.object.clientId;
            $location.hash($filter('transliteration')(resp.object.firstName + "_" + resp.object.lastName)).replace();
            if (resp.object.contacts) {
                angular.forEach(resp.object.contacts, function(val) {
                    if (angular.equals(val.type, "email")) {
                        $scope.contacts.email = val.value;
                    } else if (angular.equals(val.type, "mphone")) {
                        $scope.contacts.mphone = val.value;
                    } else if (angular.equals(val.type, "skype")) {
                        $scope.contacts.skype = val.value;
                    }
                    else if (angular.equals(val.type, "facebook")) {
                        $scope.contacts.facebook = val.value;
                    }
                    else if (angular.equals(val.type, "homepage")) {
                        $scope.contacts.homepage = val.value;
                    }
                    else if (angular.equals(val.type, "linkedin")) {
                        $scope.contacts.linkedin = val.value;
                    }
                    else if (angular.equals(val.type, "googleplus")) {
                        $scope.contacts.googleplus = val.value;
                    }
                });
            }
        } else {
            notificationService.error($filter('translate')('contact not found'));
            $location.path("/contacts");
        }
    }, function() {
        //notificationService.error($filter('translate')('service temporarily unvailable'));
    });
    $scope.save = function() {
        $scope.buttonClicked = true;
        if ($scope.contactForm.$valid && ($scope.contacts.mphone || $scope.contacts.email || $scope.contacts.skype || $scope.contacts.linkedin || $scope.contacts.facebook || $scope.contacts.googleplus || $scope.contacts.homepage)) {
            $scope.buttonClicked = false;
            var contacts = [];
            if ($scope.contacts.mphone) {
                contacts.push({type: "mphone", value: $scope.contacts.mphone});
            }
            if ($scope.contacts.skype) {
                contacts.push({type: "skype", value: $scope.contacts.skype});
            }
            if ($scope.contacts.email) {
                contacts.push({type: "email", value: $scope.contacts.email});
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
            Contacts.edit($scope.contact, function(resp) {
                $scope.errorMessage.show = false;
                if (angular.equals(resp.status, "ok")) {
                    notificationService.success($filter('translate')("contact save"));
                    $location.path("/contacts/" + $scope.contact.localId);
                } else {
                    $scope.errorMessage.show = true;
                    $scope.errorMessage.message = resp.message;
                }
            }, function() {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });
        }else{
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

    $rootScope.changeStateInContact = {status: "", fullName: null};
    $scope.delete = function() {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '../partials/modal/contact-remove-confirmation.html',
            size: '',
            resolve: function(){

            }
        });
        $rootScope.changeStateInContact.fullName = $scope.contact.firstName;
    };

    $rootScope.saveStatusOfContact = function () {
        $rootScope.clickedSaveStatusOfContact = true;
        $scope.contact.status = "R";
        Contacts.edit($scope.contact, function(resp) {
            $rootScope.clickedSaveStatusOfContact = false;
            $rootScope.closeModal();
            if (angular.equals(resp.status, "ok")) {
                notificationService.success($filter('translate')("Contact has been deleted"));
                console.log($scope.contact.clientId);
                $location.path("/clients/" + $scope.contact.clientId.localId);
            }
        }, function() {
            //notificationService.error($filter('translate')('service temporarily unvailable'));
        });


    };
        $rootScope.closeModal = function(){
            $scope.modalInstance.close();
        };
}]);
