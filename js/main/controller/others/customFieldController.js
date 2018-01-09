controller.controller('CustomFieldController',["$localStorage", "$rootScope", "$scope", "$filter", "CustomField", "notificationService", "$timeout", "$uibModal",
    function($localStorage, $rootScope, $scope, $filter, CustomField, notificationService, $timeout, $uibModal) {
        var _setFildid;
        $scope.showCancelBtn = false;
        $scope.showDropDownSelect = false;
        $scope.inputRadioShow = true;
        $scope.inputRadioSelectShow = true;
        $scope.showText = true;
        $scope.showDropdown = true;
        $scope.showDate = true;
        $scope.showDateTime = true;
        $scope.tabsForFields = 'Vacancies';
        $rootScope.tabsForFields = 'Vacancies';
        $scope.locationBeforeCustomFields = $localStorage.get('previousHistoryCustomFields');

        $rootScope.closeModal = function(){
            $rootScope.modalInstance.close();
        };


        $scope.tabsForCustomFields = function(tabs){
            $scope.tabsForFields = tabs;
            $rootScope.tabsForFields = tabs;


            if($scope.tabsForFields == 'Candidates'){
                $scope.getFullFields();
            }else if($scope.tabsForFields == 'Clients'){
                $scope.getFullFields();
            }else if($scope.tabsForFields == 'Vacancies'){
                $scope.getFullFields();
            }
        };



        if($scope.locationBeforeCustomFields == 'candidates'){
            $scope.tabsForFields = 'Candidates';
            $localStorage.remove("previousHistoryCustomFields");
        } else if($scope.locationBeforeCustomFields == 'clients'){
            $scope.tabsForFields = 'Clients';
            $localStorage.remove("previousHistoryCustomFields");
        } else if($scope.locationBeforeCustomFields == 'vacancies'){
            $scope.tabsForFields = 'Vacancies';
            $localStorage.remove("previousHistoryCustomFields");
        }
        $scope.typeField = function(type){
            $scope.typeCustomField = type;
            if(type == 'select'){
                $scope.showDropDownSelect = true;
                $("#customFullField").select2("val", "");
            }else{
                $scope.showDropDownSelect = false;
            }
        };

        $scope.addCustomField = function(){
            $scope.count = 0;
            angular.forEach($scope.allObjCustomField, function(val) {
                if(val.orderIndex != undefined && $scope.count <= val.orderIndex){
                    $scope.count = val.orderIndex;
                }
            });
            CustomField.addField({
                objType:  $scope.tabsForFields == 'Vacancies' ? 'vacancy' : 'vacancy' &&  $scope.tabsForFields == 'Candidates' ? 'candidate' : 'candidate' && $scope.tabsForFields == 'Clients' ? 'client' : 'client',
                type: $scope.typeCustomField == null ? notificationService.error($filter('translate')('Choose the field type')) : $scope.typeCustomField,
                title: $scope.fieldTitle == undefined ||  $scope.fieldTitle == '' ? notificationService.error($filter('translate')('Enter the field title')) :  $scope.fieldTitle,
                orderIndex: ++$scope.count
            }, function(resp) {
                if (resp.status == "ok") {
                    $scope.objCustomField = resp.object;
                    console.log($scope.objCustomField);
                    $scope.fieldTitle = '';
                    $scope.typeCustomField = null;
                    $scope.getFullFields();
                    notificationService.success($filter('translate')('New field added'));
                } else {
                    //notificationService.error(resp.message);
                }
            });
        };
        $scope.getFullFields = function(){
            CustomField.getFullFields({
                objectType: $scope.tabsForFields == 'Vacancies' ? 'vacancy' : 'vacancy' &&  $scope.tabsForFields == 'Candidates' ? 'candidate' : 'candidate' && $scope.tabsForFields == 'Clients' ? 'client' : 'client'
            }, function(resp) {
                if (resp.status == "ok") {
                    console.log( resp.objects, ' resp.objects');
                    $scope.allObjCustomField = resp.objects;
                } else {
                    notificationService.error(resp.message);
                }
            });
        };
        $scope.getFullFields();



        $scope.removeCustomField = function(fieldId){

            $rootScope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/questionToDeleteFilds.html',
                backdrop: 'static'
            });

            $rootScope.setAccess = function (value) {
                var access = value;
                if(access) {
                    CustomField.removeField({
                        fieldId: fieldId
                    }, function (resp) {
                        if (resp.status == "ok") {
                            notificationService.success($filter('translate')('The field was deleted'));
                            $scope.getFullFields();
                            $rootScope.closeModal();
                        } else {
                            notificationService.error(resp.message);
                        }
                    });
                }else{
                    $rootScope.closeModal();
                }
            };
        };

        $scope.editCustomField = function (fieldId, type) {
            $('.backdrop-custom-fields').css('display', 'block');
            $('.marginTop').css({'z-index': '1041', 'position': 'absolute', 'left': '65%', 'width': '65%'});
            $scope.showCancelBtn = true;
            $scope.editTypeField = type;
            $scope.fieldId = fieldId;
            $scope.oldState = $scope.getSelect2Group().split(",");

            if(type == 'select'){
                CustomField.getFullField({
                    fieldId: fieldId
                }, function(resp) {
                    if (resp.status == "ok") {
                        $scope.oneFullCustomField = resp.object;
                        $scope.fieldTitle =  $scope.oneFullCustomField.title;
                        $scope.typeCustomField = $scope.oneFullCustomField.type;
                        $scope.showDropDownSelect = true;
                        $scope.inputRadioShow = false;
                        $scope.inputRadioSelectShow = true;

                        console.log($scope.oneFullCustomField.params, '$scope.oneFullCustomField.params');
                        var groupNameList = [];
                        angular.forEach($scope.oneFullCustomField.params, function(val) {
                            groupNameList.push(val.value);
                        });
                        $scope.setSelect2Group(groupNameList);

                        if($scope.typeCustomField == 'select'){
                            $scope.showText = false;
                            $scope.showDropdown = true;
                            $scope.showDate = false;
                            $scope.showDateTime = false;
                        }
                    } else {
                        notificationService.error(resp.message);
                    }
                });
            }else{
                CustomField.getField({
                    fieldId: fieldId
                }, function(resp) {
                    if (resp.status == "ok") {
                        $scope.oneCustomField = resp.object;
                        $scope.fieldTitle =  $scope.oneCustomField.title;
                        $scope.typeCustomField =  $scope.oneCustomField.type;
                        //$scope.typeCustomField = null;
                        $scope.showDropDownSelect = false;
                        $scope.inputRadioShow = false;
                        $scope.inputRadioSelectShow = false;
                        if($scope.typeCustomField == 'string'){
                            $scope.showText = true;
                            $scope.showDropdown = false;
                            $scope.showDate = false;
                            $scope.showDateTime = false;
                        }else if($scope.typeCustomField == 'date'){
                            $scope.showText = false;
                            $scope.showDropdown = false;
                            $scope.showDate = true;
                            $scope.showDateTime = false;
                        }else if($scope.typeCustomField == 'datetime'){
                            $scope.showText = false;
                            $scope.showDropdown = false;
                            $scope.showDate = false;
                            $scope.showDateTime = true;
                        }
                    } else {
                        notificationService.error(resp.message);
                    }
                });



            }
        };
        $scope.cancelEditCustomField = function () {
            $('.backdrop-custom-fields').css('display', 'none');
            $('.marginTop').css({'z-index': 'inherit', 'position': 'inherit', 'left': '0', 'width': '100%'});
            $scope.showCancelBtn = false;
            $scope.fieldTitle = '';
            $scope.typeCustomField = null;
            $scope.inputRadioShow = true;
            $scope.inputRadioSelectShow = true;
            $scope.showDropDownSelect = false;
            $scope.showText = true;
            $scope.showDropdown = true;
            $scope.showDate = true;
            $scope.showDateTime = true;




        };
        $scope.saveEditCustomField = function(){
             var value = '',
                 array = [];

             if($scope.editTypeField == 'select'){
                 var newGroupList = ($scope.getSelect2Group().split(",")[0] == "" && $scope.getSelect2Group().split(",").length == 1)?[]:$scope.getSelect2Group().split(","),
                     oldGroupeList = $scope.oneFullCustomField.params;
             }



            if(!$scope.fieldTitle.length){
                notificationService.error($filter('translate')('Enter the field title'));
                return
            } else if(newGroupList && newGroupList.length  < 1 ){
                notificationService.error($filter('translate')('Enter a value for the drop-down list'));
                return;
            }
            CustomField.editField({
                title: $scope.fieldTitle,
                fieldId: $scope.editTypeField == 'select' ? $scope.oneFullCustomField.fieldId : $scope.oneCustomField.fieldId
            }, function(resp) {
                if (resp.status == "ok") {
                    //$scope.saveEditedCustomField = resp.object;
                    //$scope.fieldTitle =  $scope.saveEditedCustomField.title;
                    console.log(resp.object);

                    $scope.getFullFields();
                    $('.backdrop-custom-fields').css('display', 'none');
                    $('.marginTop').css({'z-index': 'inherit', 'position': 'inherit', 'left': '0', 'width': '100%'});
                    notificationService.success($filter('translate')('The field is saved'));
                    $scope.showCancelBtn = false;
                    $scope.fieldTitle = '';
                    $scope.inputRadioSelectShow = true;
                    $scope.inputRadioShow = true;
                    $scope.typeCustomField = null;
                    $scope.showDropDownSelect = false;
                    $scope.showText = true;
                    $scope.showDropdown = true;
                    $scope.showDate = true;
                    $scope.showDateTime = true;
                } else {
                    notificationService.error(resp.message);
                }
            });

            if($scope.editTypeField == 'select'){
                angular.forEach(newGroupList, function (item) {
                    array.push({
                        name: 'defaultValue',
                        value: item,
                        orgId: $rootScope.me.orgId
                    });
                });
                CustomField.addFieldParams({
                    fieldParams:array,
                    fieldId: $scope.fieldId
                }, function (resp) {
                    console.log(resp, 'resp!!')
                });

            }
        };
        console.log($scope.tabsForFields, '$scope.tabsForFields');
        $scope.tabsForCustomFields($scope.tabsForFields);
    }]);

/**
 * Created by вик on 19.04.2017.
 */
