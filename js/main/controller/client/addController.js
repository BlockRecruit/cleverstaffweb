controller.controller('ClientAddController', ["FileInit", "$scope", "Service", "Client", "$location", "notificationService", "$filter", "$localStorage", "$cookies", "$window", "serverAddress", "$rootScope", "Person", "CustomField", "$translate",
    function(FileInit, $scope, Service, Client, $location, notificationService, $filter, $localStorage, $cookies, $window, serverAddress, $rootScope, Person, CustomField, $translate) {
        if ($localStorage.isExist("clientForSave")) {
            $scope.client = angular.fromJson($localStorage.get("clientForSave"));
            $localStorage.remove("clientForSave");
        } else {
            $scope.client = {logoId: null};
        }
        $scope.objType = 'client';
        $scope.fieldValues = {
            objType: "client",
            value: '',
            dateTimeValue: '',
            field : {
                fieldId: ''
            }
        };
        $scope.client.fieldValues = [];
        $scope.clickedSaveClient = false;
        $scope.serverAddress = serverAddress;
        $scope.event = 'Add';
        $location.hash('');
        $scope.errorMessage = {
            show: false,
            message: ""
        };
        $scope.addPhoto = function() {
            $('#photoFile').click();
        };
        $scope.cancel = function() {
            $location.path("/clients");
        };
        FileInit.initFileOption($scope, "client");
        $scope.callbackFile = function(resp, names) {
            $rootScope.loading = false;
            $scope.client.logoId = resp;
            $scope.hideModalAddPhoto();
        };
        $scope.addPhotoByReference = function (photoUrl) {
            $rootScope.loading = true;
            FileInit.addPhotoByReference(photoUrl, $scope.callbackFile);
        };        $scope.removePhoto = function() {
            $scope.client.logoId = undefined;
            $scope.progressUpdate();
        };


        $scope.industries = Service.getIndustries();
        $scope.state = Client.getState().splice(0, 2);


        $scope.editCustomField = function(text, id){
            console.log('in edit', text, id);
            $scope.client.fieldValues.push({
                objType: "client",
                value: text,
                field : {
                    fieldId: id
                }
            });
        };
        $scope.addCustomFieldParams = function(text, id){
            $scope.client.fieldValues.push({
                objType: "client",
                value: text,
                field : {
                    fieldId: id
                }
            });
        };

        $scope.sendCustomFieldId = function(id){
            $scope.editCustomId = id;
            console.log(id);
        };


        console.log($scope.client);
        if ($scope.client.fieldValues) {
            angular.forEach($scope.client.fieldValues, function(val) {
                console.log(val);
                if (angular.equals(val.type, "string")) {
                    $scope.fieldValues.value = val.value;
                }
                if (angular.equals(val.type, "select")) {
                    $scope.fieldValues.value = val.value;
                }
                if (angular.equals(val.type, "date")) {
                    $scope.fieldValues.dateTimeValue = val.dateTimeValue;
                }
                if (angular.equals(val.type, "datetime")) {
                    $scope.fieldValues.dateTimeValue = val.dateTimeValue;
                }
            });
        }
        console.log($scope.client);

        $scope.save = function() {
            if ($scope.clientForm.$valid && !$scope.clickedSaveClient) {
                $scope.clickedSaveClient = true;
                if ($scope.client.site) {
                    $scope.client.site = $scope.client.site.replace(/^(https?:\/\/)/, "");
                }

                if ($("#pac-input").val().length == 0) {
                    $scope.client.region = null;
                } else if ($("#pac-input").val().length > 0) {
                    $scope.client.region = $scope.region;
                }

                Client.add($scope.client, function(resp) {
                    $scope.errorMessage.show = false;
                    if (angular.equals(resp.status, "ok")) {
                        Client.all(Client.searchOptions(), function (response) {
                            $rootScope.clientsForInvite = response.objects;
                            console.log('a');
                        });
                        notificationService.success($filter('translate')("client_save_1") + " " + $scope.client.name + $filter('translate')("client_save_2"));
                        $location.path("/clients/" + resp.object.localId);
                    } else {
                        notificationService.error(resp.message);
                        $scope.errorMessage.show = true;
                        $scope.clickedSaveClient = false;
                        $scope.errorMessage.message = resp.message;
                        $scope.errorMessage.clientName = resp.object.name;
                        $scope.errorMessage.localId = resp.object.localId;
                        $scope.errorMessage.clientRegion = resp.object.region.displayFullName;
                    }
                }, function() {
                    $localStorage.set("clientForSave", $scope.client);
                    $cookies.url = $location.$$url;
                    $scope.clickedSaveClient = false;
                    $cookies.cfauth = 'false';
                    $window.location.replace('/');

                });
            } else {
                console.log($scope.clientForm);
                $scope.clickedSaveClient = false;
                $scope.clientForm.name.$pristine = false;
            }
        };

        $scope.deleteDate = function(id){
            angular.forEach($('.editDate'), function (nval) {
                if(id == nval.name){
                    nval.placeholder = '';
                    nval.value = '';
                }
            });
        };

        $scope.getFullCustomFields = function(){
            CustomField.getFullFields({
                objectType: 'client'
            }, function(resp) {
                if (resp.status == "ok") {
                    $scope.allObjCustomField = resp.objects;
                } else {
                    notificationService.error(resp.message);
                }
            });
        };


        // $scope.getClientsAmount = function() {
        //     Client.all(Client.searchOptions(), function (response) {
        //         $rootScope.objectSize = response['objects'] ? response['total'] : 0;
        //     });
        // };

        $scope.getFullCustomFields();
        // $scope.getClientsAmount();
    }]);
