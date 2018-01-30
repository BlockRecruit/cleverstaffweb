controller.controller('ClientEditController', ["$rootScope", "serverAddress", "FileInit", "$scope", "$routeParams", "$location", "Client", "Service", "notificationService", "$filter",'Person', '$uibModal', '$localStorage', "$translate",
    function($rootScope, serverAddress, FileInit, $scope, $routeParams, $location, Client, Service, notificationService, $filter,Person, $uibModal, $localStorage, $translate) {
        $scope.clickedSaveClient = false;
        $scope.fieldValues = {
            objType: "client",
            fieldValueId: '',
            value: '',
            dateTimeValue: '',
            field : {
                fieldId: ''
            }
        };

        $scope.objType = 'client';

        Client.one({"localId": $routeParams.id}, function(resp) {
            if (angular.equals(resp.status, "ok")) {
                if (resp.object.region && resp.object.region.fullName != undefined) {
                    $scope.regionInput = resp.object.region.displayFullName;
                }

                $location.hash($filter('transliteration')(resp.object.name.replace(/\W+/g, '_'))).replace();
                $scope.client = resp.object;
                if(!$scope.client.customFields){
                    $scope.client.customFields = [];
                }
                $scope.locationBeforeCustomFields = $location.$$path.replace('/client/edit/' + $scope.client.localId, 'clients');
                $localStorage.set('previousHistoryCustomFields', $scope.locationBeforeCustomFields);

                $scope.client.fieldValues = [];

                if (resp.object.customFields) {
                    angular.forEach(resp.object.customFields, function(val) {
                        if(val.fieldValue != undefined){
                            if (angular.equals(val.type, "string")) {
                                $scope.client.fieldValues.push({
                                    objType: "client",
                                    fieldValueId: val.fieldValue.fieldValueId,
                                    value:  val.fieldValue.value,
                                    field: {
                                        fieldId: val.fieldId
                                    }
                                });
                            }
                            if (angular.equals(val.type, "select")) {
                                $scope.client.fieldValues.push({
                                    objType: "client",
                                    fieldValueId: val.fieldValue.fieldValueId,
                                    value:  val.fieldValue.value,
                                    field: {
                                        fieldId: val.fieldId
                                    }
                                });
                            }
                            if (angular.equals(val.type, "date")) {
                                $scope.client.fieldValues.push({
                                    objType: "client",
                                    fieldValueId: val.fieldValue.fieldValueId,
                                    dateTimeValue: val.fieldValue.dateTimeValue,
                                    field: {
                                        fieldId: val.fieldId
                                    }
                                });
                            }
                            if (angular.equals(val.type, "datetime")) {
                                $scope.client.fieldValues.push({
                                    objType: "client",
                                    fieldValueId: val.fieldValue.fieldValueId,
                                    dateTimeValue: val.fieldValue.dateTimeValue,
                                    field: {
                                        fieldId: val.fieldId
                                    }
                                });
                            }
                        }
                    });
                }
                console.log($scope.client);
                angular.forEach($scope.client.vacancies.objects,function(val){
                    if(val.status =="open" || val.status == "inwork" || val.status == "expects"){
                        $scope.clientHaveActiveVacancy=true;
                    }
                });
                if (resp.object.industry) {
                    $scope.setSelect2Industry(resp.object.industry)
                }
                // console.log($scope.client);
            } else {
                notificationService.error($filter('translate')('client not found'));
                $location.path("clients");
            }
        });
        $scope.serverAddress = serverAddress;
        $scope.event = 'edit';
        $scope.errorMessage = {
            show: false,
            message: ""

        };

        $rootScope.changeStatusInClient = {
            "status": "deleted",
            comment: "",
            header: "",
            placeholder: ""
        };

        $scope.deleteClient = function() {
            if(!$scope.clientHaveActiveVacancy){
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../partials/modal/delete-client.html',
                    size: '',
                    resolve: function(){

                    }
                });
                $rootScope.changeStatusInClient.header = $filter('translate')("Are you sure want delete client") + " " + $scope.client.name + "?";
                $rootScope.changeStatusInClient.placeholder = $filter('translate')('Write a comment why you want remove this candidate');
            }else{
                notificationService.success($filter('translate')("This client has active vacancy"));
            }
        };
        $rootScope.saveClientStatus = function() {
            $scope.client.state = "deleted";
            $rootScope.closeModal();
            Client.changeState({
                clientId: $scope.client.clientId,
                comment: $rootScope.changeStatusInClient.comment,
                clientState: $scope.client.state
            }, function(resp) {
                if (resp.status == "ok") {
//                notificationService.success($filter('translate')("client change state"));
                    Client.all(Client.searchOptions(), function (response) {
                        $rootScope.clientsForInvite = response.objects;
                    });
                    $rootScope.changeStatusInClient.comment = "";
                    $rootScope.changeStatusInClient.status = null;

                    notificationService.success($filter('translate')('client') + " " + $scope.client.name + " " + $filter('translate')('was_deleted'));
                    $location.path('/clients');


                } else {
                    notificationService.error(resp.message);
                }
            }, function() {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });
        };


        $scope.cancel = function() {
            $location.path("/clients/" + $routeParams.id);
        };
        $scope.addPhoto = function() {
            $('#photoFile').click();
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
        };

        $scope.removePhoto = function() {
            $scope.client.logoId = undefined;
            $scope.progressUpdate();
        };
        $scope.industries = Service.getIndustries();
        $scope.state = Client.getState();

        $scope.editCustomField = function(value, id, fieldValueId){
            if(fieldValueId != undefined){
                if(value == ''){
                    angular.forEach($scope.client.fieldValues, function(val, ind) {
                        if (val.fieldValueId === fieldValueId) {
                            $scope.client.fieldValues.splice(ind, 1);
                        }
                    });
                }else{
                    angular.forEach($scope.client.fieldValues, function(val) {
                        if (val.fieldValueId === fieldValueId) {
                            val.value = value;
                        }
                    });
                }
            }else{
                $scope.client.fieldValues.push({
                    objType: "client",
                    fieldValueId: fieldValueId,
                    value: value,
                    field: {
                        fieldId: id
                    }
                });
            }
        };
        $scope.addCustomFieldParams = function(value, id, fieldValueId){
            if(fieldValueId != undefined){
                console.log(1);
                if(value == ''){
                    console.log(3);
                    angular.forEach($scope.client.fieldValues, function(val, ind) {
                        if (val.fieldValueId === fieldValueId) {
                            $scope.client.fieldValues.splice(ind, 1);
                        }
                    });
                }else{
                    console.log(4);
                    angular.forEach($scope.client.fieldValues, function(val) {
                        if (val.fieldValueId === fieldValueId) {
                            val.value = value;
                        }
                    });
                }
            }else{
                console.log(2);
                $scope.client.fieldValues.push({
                    objType: "client",
                    fieldValueId: fieldValueId,
                    value: value,
                    field: {
                        fieldId: id
                    }
                });
            }
        };
        $scope.sendCustomFieldId = function(id, fieldValueId){
            $scope.editCustomId = id;
            $scope.editCustomFieldValueId = fieldValueId;
            console.log(id);
            console.log(fieldValueId);
        };
        $scope.deleteDate = function(id, fieldValueId){
            $scope.editCustomId = id;
            $scope.editCustomFieldValueId = fieldValueId;
            angular.forEach($scope.client.fieldValues, function (val, ind) {
                if(val.fieldValueId == fieldValueId){
                    $scope.client.fieldValues.splice(ind, 1);
                    angular.forEach($('.editDate'), function (nval) {
                        console.log(nval.name);
                        if(id == nval.name){
                            nval.placeholder = '';
                            nval.value = '';
                        }
                    });
                }
            });
            console.log($scope.client.fieldValues);
        };
        $scope.save = function() {
            if (!$scope.clickedSaveClient) {


                deleteUnnecessaryFields($scope.client);
                if ($scope.clientForm.$valid) {
                    if ($scope.client.site) {
                        $scope.client.site = $scope.client.site.replace(/^(https?:\/\/)/, "");
                    }
                    if ($("#pac-input").val().length == 0) {
                        $scope.client.region = null;
                    } else if ($("#pac-input").val().length > 0 && ($scope.client.region == undefined || $("#pac-input").val() != $scope.client.region.fullName)) {
                        if ($scope.region)
                            $scope.client.region = $scope.region;
                    }
                    $scope.clickedSaveClient=true;
                    Client.edit($scope.client, function(resp) {
                        if (angular.equals(resp.status, "ok")) {
                            notificationService.success($filter('translate')("client_save_1") + " " + $scope.client.name + $filter('translate')("client_save_2"));
                            $location.path("/clients/" + resp.object.localId);
                        } else {
                            notificationService.error(resp.message);
                            $scope.clickedSaveClient=false;
                            $scope.errorMessage.show = true;
                            $scope.errorMessage.message = resp.message;
                        }
                    }, function() {
                        $scope.clickedSaveClient=false;
                        //notificationService.error($filter('translate')('service temporarily unvailable'));
                    });
                }
            }
            else {
                $scope.clientForm.name.$pristine = false;
                $scope.clientForm.state.$pristine = false;
                $scope.clientForm.region.$pristine = false;
            }
        };
        $rootScope.closeModal = function(){
            $scope.modalInstance.close();
        };
    }]);
