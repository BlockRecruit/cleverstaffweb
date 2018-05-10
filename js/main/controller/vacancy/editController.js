controller.controller('vacancyEditController', ["$rootScope", "$scope", "FileInit", "Vacancy", "Service", "$location", "Client", "$routeParams",
    "notificationService", "$filter", "$translate", 'Person', '$uibModal', "Candidate",
    function($rootScope, $scope, FileInit, Vacancy, Service, $location, Client, $routeParams, notificationService, $filter, $translate, Person, $uibModal, Candidate) {
        $scope.showStatus = false;
        //$scope.langs = Service.lang();
        $scope.type = "Vacancy edit";
        $scope.clickedAddVacancy = false;
        $scope.numberPosition = Service.numberPosition();
        $scope.objType = 'vacancy';
        var myListener =  $scope.$on('addedLang', function (event, data) {
            if (data != undefined) {
                $scope.addedLang = data;
                $scope.changeLevel = function(level, id){
                    angular.forEach($scope.addedLang, function (val) {
                        if(val.id == id){
                            val.level = level;
                        }
                    });
                };
            }
        });
        $scope.$on('$destroy', myListener);
        $scope.langs = Candidate.getLangInOrg(function (resp){
            if(resp.object){
                //resp.object.splice(0, 1);
                $scope.setLangs(resp.object);
            } else {
                $scope.setLangs([]);
            }
        });
        $scope.errorMessage = {
            show: false,
            message: ""
        };

        $scope.accessTypeObject = [
            {name: "Public", value: 'public'},
            {name: "Private", value: 'private'}
        ];
        $rootScope.closeModal = function(){
            $scope.modalInstance.close();
        };
        Service.genderTwo($scope);
        $scope.map = {
            center: {
                latitude: 48.379433,
                longitude: 31.165579999999977
            },
            zoom: 5,
            options: {
                panControl: true,
                zoomControl: true,
                scaleControl: true,
                mapTypeControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
        };
        $scope.marker = {
            id: 1,
            title: "",
            coords: {
                latitude: null,
                longitude: null
            }
        };


        $rootScope.changeStateObject = {status: "", comment: "", position: null, placeholder: null};
        $scope.deleteVacancy = function() {
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/vacancy-edit-delete.html',
                size: '',
                resolve: function(){

                }
            });
            $rootScope.changeStateObject.status = "deleted";
            $rootScope.changeStateObject.position = $scope.vacancy.position;
            $rootScope.changeStateObject.placeholder = $filter('translate')("Write a comment why you want remove this vacancy");
        };
        $rootScope.saveVacancyStatus = function() {
            $scope.vacancy.status = $rootScope.changeStateObject.status;
            $rootScope.closeModal();
            Vacancy.changeState({
                vacancyId: $scope.vacancy.vacancyId,
                comment: $rootScope.changeStateObject.comment,
                vacancyState: $rootScope.changeStateObject.status
            }, function(resp) {
                if (resp.status == "ok") {
                    $rootScope.changeStateObject.comment = "";
                    $rootScope.changeStateObject.status = null;
                    notificationService.success($filter('translate')('vacancy') + " " + $scope.vacancy.position + " " + $filter('translate')('was_deleted_2'));
                    $location.path('/vacancies');
                }
            }, function(err) {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });

        };

        FileInit.initFileOption($scope, "vacancy");
        $scope.callbackFile = function(resp, name) {
            if (!$scope.vacancy.files) {
                $scope.vacancy.files = [];
            }
            $scope.vacancy.files.push(resp);
        };

        $scope.removeFile = function(id) {
            Vacancy.removeFile({"vacancyId": $scope.vacancy.vacancyId, "fileId": id}, function(resp) {
            });
            angular.forEach($scope.vacancy.files, function(val, ind) {
                if (val.fileId === id) {
                    $scope.vacancy.files.splice(ind, 1);
                }
            });
        };
        $(".paymentPicker").datetimepicker({
            format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
            startView: 2,
            minView: 1,
            autoclose: true,
            weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
            language: $translate.use(),
            initialDate: new Date(),
            startDate: new Date()
        });
        $(".deadLinePicker").datetimepicker({
            format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
            startView: 2,
            minView: 1,
            autoclose: true,
            weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
            language: $translate.use(),
            initialDate: new Date(),
            startDate: new Date()
        });

        $scope.lang = $translate;
        Vacancy.one({localId: $routeParams.id}, function(resp) {
            if (angular.equals(resp.status, "ok")) {
                $scope.objectId = resp.object.vacancyId;
                $scope.vacancy = resp.object;

                if(!$scope.vacancy.customFields){
                    $scope.vacancy.customFields = [];
                }
                $scope.setClientAutocompleterValue($scope.vacancy.clientId.name, $scope.vacancy.clientId.clientId);
                if($scope.vacancy.files){
                    if($scope.vacancy.files.length != undefined && $scope.vacancy.files.length != 0){
                        angular.forEach($scope.vacancy.files, function (val) {
                            initDocuments(val);
                        });
                    }
                }
                // if (resp.object.sex === undefined) {
                //     $scope.vacancy.sex = null;
                // }
                if (resp.object.accessType === undefined) {
                    $scope.vacancy.accessType = 'private';
                }

                if ($scope.vacancy.datePayment != undefined) {
                    $(".paymentPicker").datetimepicker("setDate", new Date($scope.vacancy.datePayment));
                }

                $scope.objectLang = [];
                if(resp.object.languages!=undefined){
                    angular.forEach(resp.object.languages, function (val) {
                        if(val.name != undefined){
                            $scope.objectLang.push({id: val.languageId, text: val.name, level: val.level});
                            setTimeout(function(){
                                $scope.setSelect2Lang($scope.objectLang);
                            },2000);
                        }
                    });
                }

                if ($scope.vacancy.dateFinish != undefined) {
                    $(".deadLinePicker").datetimepicker("setDate", new Date($scope.vacancy.dateFinish));
                }
                if (resp.object.region != undefined && resp.object.region.lat != undefined && resp.object.region.lng != undefined) {
                    $scope.map.center.latitude = resp.object.region.lat;
                    $scope.map.center.longitude = resp.object.region.lng;

                    $scope.marker.coords.latitude = resp.object.region.lat;
                    $scope.marker.coords.longitude = resp.object.region.lng;


                    $scope.regionInput = resp.object.region.displayFullName;
                }
                $scope.vacancy.fieldValues = [];
                if (resp.object.customFields != undefined) {
                    angular.forEach(resp.object.customFields, function(val) {
                        if(val.fieldValue != undefined){
                            if (angular.equals(val.type, "string")) {
                                $scope.vacancy.fieldValues.push({
                                    objType: "vacancy",
                                    fieldValueId: val.fieldValue.fieldValueId,
                                    value:  val.fieldValue.value,
                                    field: {
                                        fieldId: val.fieldId
                                    }
                                });
                            }
                            if (angular.equals(val.type, "select")) {
                                $scope.vacancy.fieldValues.push({
                                    objType: "vacancy",
                                    fieldValueId: val.fieldValue.fieldValueId,
                                    value:  val.fieldValue.value,
                                    field: {
                                        fieldId: val.fieldId
                                    }
                                });
                            }
                            if (angular.equals(val.type, "date")) {
                                $scope.vacancy.fieldValues.push({
                                    objType: "vacancy",
                                    fieldValueId: val.fieldValue.fieldValueId,
                                    dateTimeValue: val.fieldValue.dateTimeValue,
                                    field: {
                                        fieldId: val.fieldId
                                    }
                                });
                            }
                            if (angular.equals(val.type, "datetime")) {
                                $scope.vacancy.fieldValues.push({
                                    objType: "vacancy",
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
                console.log($scope.vacancy);

                Client.all(Client.searchOptions(), function(response) {
                    $scope.clients = response.objects;
                    var optionsHtml = '';
                    angular.forEach($scope.clients, function (value) {
                        if(value.clientId != $scope.vacancy.clientId.clientId){
                            optionsHtml += "<option style='color: #000000' value='" + value.clientId + "'>" + value.name + "</option>";
                        }else{
                            optionsHtml += "<option style='color: #000000' selected value='" + value.clientId + "'>" + value.name + "</option>";
                        }
                    });
                    $('#client-select').html(optionsHtml);
                });


                $location.hash($filter('transliteration')(resp.object.position.replace(/\W+/g, '_') + "_" + resp.object.clientId.name.replace(/\W+/g, '_'))).replace();
            } else {
                $location.path("vacancies");
                notificationService.error($filter('translate')('vacancy not found'));
            }
        }, function(err) {
            //notificationService.error($filter('translate')('service temporarily unvailable'));
        });

        $scope.cancel = function() {
            $location.path("/vacancies/" + $routeParams.id);
        };

        // $scope.sexObject = [
        //     {name: "Male", value: true},
        //     {name: "Female", value: false},
        //     {name: "Doesn't matter", value: null}
        // ];
        // $scope.sexObjectRU = [
        //     {name: "Мужчина", value: true},
        //     {name: "Женщина", value: false},
        //     {name: "Не имеет значения", value: null}
        // ];

        $scope.toAddClient = function() {
            var params = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
            window.open("#/client/add", "ClientAdd", params);
        };

        $scope.employmentType = Service.employmentType();
        $scope.paymentDate = null;
        $scope.finishDate = null;

        $('.ui.checkbox').checkbox();
        $('.toggle.button').
            on('click', function() {
                $(this)
                    .nextAll('.checkbox')
                    .checkbox('toggle')
                ;
            });
        $('.ui.dropdown')
            .dropdown();

        $scope.currency = Service.currency();
        $scope.editCustomField = function(value, id, fieldValueId){
            if(fieldValueId != undefined){
                console.log(1);
                if(value == ''){
                    console.log(3);
                    angular.forEach($scope.vacancy.fieldValues, function(val, ind) {
                        if (val.fieldValueId === fieldValueId) {
                            $scope.vacancy.fieldValues.splice(ind, 1);
                        }
                    });
                }else{
                    console.log(4);
                    angular.forEach($scope.vacancy.fieldValues, function(val) {
                        if (val.fieldValueId === fieldValueId) {
                            val.value = value;
                        }
                    });
                }
            }else{
                console.log(2);
                $scope.vacancy.fieldValues.push({
                    objType: "vacancy",
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
                    angular.forEach($scope.vacancy.fieldValues, function(val, ind) {
                        if (val.fieldValueId === fieldValueId) {
                            $scope.vacancy.fieldValues.splice(ind, 1);
                        }
                    });
                }else{
                    console.log(4);
                    angular.forEach($scope.vacancy.fieldValues, function(val) {
                        if (val.fieldValueId === fieldValueId) {
                            val.value = value;
                        }
                    });
                }
            }else{
                console.log(2);
                $scope.vacancy.fieldValues.push({
                    objType: "vacancy",
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
        };

        $scope.deleteDate = function(id, fieldValueId){
            $scope.editCustomId = id;
            $scope.editCustomFieldValueId = fieldValueId;
            angular.forEach($scope.vacancy.fieldValues, function (val, ind) {
                if(val.fieldValueId == fieldValueId){
                    $scope.vacancy.fieldValues.splice(ind, 1);
                    angular.forEach($('.editDate'), function (nval) {
                        if(id == nval.name){
                            nval.placeholder = '';
                            nval.value = '';
                        }
                    });
                }
            });
        };
        $scope.save = function() {
            $scope.clientError = false;
            $scope.vacancy.clientId.clientId = $("#clientAutocompleater").select2('data') !== null ? $("#clientAutocompleater").select2('data').id : null;
            if ($scope.vacancyForm.$valid && !$scope.clickedAddVacancy && $scope.vacancy.clientId.clientId != null) {
                $scope.vacancy.dateFinish = $('.deadLinePicker').datetimepicker('getDate') != null ? $('.deadLinePicker').datetimepicker('getDate').getTime() : null;
                $scope.vacancy.datePayment = $('.paymentPicker').datetimepicker('getDate') != null ? $('.paymentPicker').datetimepicker('getDate').getTime() : null;
                $scope.vacancy.languages = [];
                if($scope.addedLang != undefined){
                    angular.forEach($scope.addedLang, function (val) {
                        if(val.level != undefined && val.level != ''){
                            $scope.vacancy.languages.push({ name: val.text[0].toUpperCase() + val.text.slice(1).toLowerCase(), level: val.level});
                        }else if(val.level == undefined && val.id == val.text){
                            $scope.vacancy.languages.push({ name: val.text[0].toUpperCase() + val.text.slice(1).toLowerCase(), level: 'undefined'});
                        }
                    });
                }
                $scope.vacancy.clientId.clientId = $("#clientAutocompleater").select2('data') !== null ? $("#clientAutocompleater").select2('data').id : null;
                if ($("#pac-input").val().length == 0) {
                    $scope.vacancy.region = null;
                } else if ($("#pac-input").val().length > 0 && ($scope.vacancy.region == undefined || $("#pac-input").val() != $scope.vacancy.region.fullName)) {
                    if ($scope.region)
                        $scope.vacancy.region = $scope.region;
                }
                $scope.clickedAddVacancy = true;
                deleteUnnecessaryFields($scope.vacancy);
                console.log($scope.vacancy);
                Vacancy.edit($scope.vacancy, function(resp) {
                    if (angular.equals(resp.status, "ok")) {
                        notificationService.success($filter('translate')('vacancy_save_1') + $scope.vacancy.position + $filter('translate')('vacancy_save_2'));
                        $location.path("vacancies/" + resp.object.localId);
                        $scope.clickedAddVacancy = false;
                    } else {
                        notificationService.error(resp.message);
                        $scope.clickedAddVacancy = false;
                        $scope.errorMessage.show = true;
                        $scope.errorMessage.message = resp.message;
                    }
                }, function(err) {
                    $scope.clickedAddVacancy = false;
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                });
            } else {
                //$scope.vacancyForm.client.$pristine = false;
                if(!$scope.vacancy.clientId.clientId){
                    $scope.clientError = true;
                }
                $scope.vacancyForm.regionInput.$pristine = false;
                $scope.clickedAddVacancy = false;
            }
        };
        Vacancy.all(Vacancy.searchOptions(), function(response) {
            $rootScope.objectSize = response['objects'] != undefined ? response['total'] : 0;
        });

        $scope.validSalary = function (event) {
            if(event.keyCode == 43 || event.keyCode == 45 || event.keyCode == 101 || event.keyCode == 69 )
                event.preventDefault();

        };
    }
]);



