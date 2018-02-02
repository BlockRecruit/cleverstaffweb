controller.controller('vacancyAddController', ["FileInit", "$scope", "Vacancy", "Service", "Client", "$location", "$rootScope", "notificationService", "$filter", "$translate", "$localStorage", "$cookies", "$window", "Person", "Company","Candidate","CustomField",
    function(FileInit, $scope, Vacancy, Service, Client, $location, $rootScope, notificationService, $filter, $translate, $localStorage, $cookies, $window, Person, Company,Candidate, CustomField) {
        $scope.addedLang = [];
        $scope.objType = 'vacancy';
        $scope.showStatus = true;
        $scope.type = "Vacancy add";
        $scope.employmentType = Service.employmentType();
        $scope.numberPosition = Service.numberPosition();
        $scope.paymentDate = null;
        $scope.clickedAddVacancy = false;
        $scope.fieldValues = {
            objType: "vacancy",
            value: '',
            dateTimeValue: '',
            field : {
                fieldId: ''
            }
        };
        Client.init();
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
//    $location.hash('');
        if ($localStorage.isExist("vacancyForSave")) {
            $scope.vacancy = angular.fromJson($localStorage.get("vacancyForSave"));
            $localStorage.remove("vacancyForSave");
            $('.select2-lang').val($scope.vacancy.langs);
            $('.select2-lang').select2({
                tags: $scope.langs,
                tokenSeparators: [",", " "]
            });
            $scope.paymentDate = $scope.vacancy.datePayment ? new Date($scope.vacancy.datePayment) : null;
            $scope.finishDate = $scope.vacancy.dateFinish ? new Date($scope.vacancy.dateFinish) : null;
            $scope.vacancy.datePayment = null;
            $scope.vacancy.finishDate = null;
        } else {
            $scope.vacancy = {
                datePayment: "",
                accessType: 'public',
                dateFinish: "",
                clientId: {
                    clientId: $rootScope.addVacancyClientId
                }
            };
            $rootScope.addVacancyClientId = null;
        }
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
        $scope.fileForSave = [];
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


        FileInit.initFileOption($scope, "");
        $scope.callbackFile = function(resp, names) {
            $scope.fileForSave.push({"attId": resp, "fileName": names});
        };

        $scope.removeFile = function(id) {
            angular.forEach($scope.fileForSave, function(val, ind) {
                if (val.attId === id) {
                    $scope.fileForSave.splice(ind, 1);
                }
            });
        };

        $scope.errorMessage = {
            show: false,
            message: ""
        };
        $scope.lang = $translate;

        Service.genderTwo($scope);

        $scope.accessTypeObject = [
            {name: "Public", value: 'public'},
            {name: "Private", value: 'private'}
        ];
        $scope.cancel = function() {
            $location.path("/vacancies");
        };
        $scope.toAddClient = function() {
            var params = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
            window.open("#/client/add", "ClientAdd", params);
        };

        $scope.finishDate = null;


        $scope.status = Vacancy.status();
        delete $scope.status[5];

        $scope.currency = Service.currency();
        Client.all(Client.searchOptions(), function(response) {
            $scope.clients = response.objects;
            var optionsHtml = '<option ng-selected="true" value="" selected style="color:#999">'+$filter('translate')('chose_customer')+'</option>';
            angular.forEach($scope.clients, function (value) {
                optionsHtml += "<option style='color: #000000' value='" + value.clientId + "'>" + value.name + "</option>";
            });
            $('#client-select').html(optionsHtml);
            if($rootScope.me.recrutRole=='client'){
                if(response.objects){
                    $scope.vacancy.clientId=response.objects[0];
                }else{
                    notificationService.error($filter('translate')('Your company removed'));
                    $window.location.replace('!#/vacancies');
                }
            }
        });
        $scope.vacancy.fieldValues = [];
        $scope.editCustomField = function(text, id){
            $scope.vacancy.fieldValues.push({
                objType: "vacancy",
                value: text,
                field : {
                    fieldId: id
                }
            });
        };
        $scope.addCustomFieldParams = function(text, id){
            $scope.vacancy.fieldValues.push({
                objType: "vacancy",
                value: text,
                field : {
                    fieldId: id
                }
            });
        };

        $scope.sendCustomFieldId = function(id){
            $scope.editCustomId = id;
        };
        if ($scope.vacancy.fieldValues) {
            angular.forEach($scope.vacancy.fieldValues, function(val) {
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

        $scope.save = function() {
            $localStorage.set("vacancy_currency", $scope.vacancy.currency);
            $scope.clientError = false;
            $scope.vacancy.clientId.clientId = $("#clientAutocompleater").select2('data') !== null ? $("#clientAutocompleater").select2('data').id : null;
            if ($scope.vacancyForm.$valid && !$scope.clickedAddVacancy && $scope.vacancy.clientId.clientId != null) {
                $scope.vacancy.dateFinish = $('.deadLinePicker').datetimepicker('getDate') != null ? $('.deadLinePicker').datetimepicker('getDate').getTime() : null;
                $scope.vacancy.datePayment = $('.paymentPicker').datetimepicker('getDate') != null ? $('.paymentPicker').datetimepicker('getDate').getTime() : null;
                $scope.vacancy.languages = [];
                if($scope.addedLang != undefined){
                    angular.forEach($scope.addedLang, function (val) {
                        if(val.level != undefined && val.level != ''){
                            $scope.vacancy.languages.push({ name: val.text, level: val.level});
                        }
                    });
                }
                $scope.vacancy.langs = $('.select2-lang').select2('val').toString();
                if ($scope.vacancy.fieldValues.dateTimeValue != undefined) {
                    $(".datepickerOfCustom").datetimepicker("setDate", new Date($scope.editCustomValue));
                }
                if ($scope.vacancy.fieldValues.dateTimeValue != undefined) {
                    $(".datepickerOfCustomTime").datetimepicker("setDate", new Date($scope.editCustomValue));
                }
                if ($("#pac-input").val().length == 0) {
                    $scope.vacancy.region = null;
                } else if ($("#pac-input").val().length > 0) {
                    $scope.vacancy.region = $scope.region;
                }
                deleteUnnecessaryFields($scope.vacancy);
                console.log($scope.vacancy);
                $scope.clickedAddVacancy = true;
                Vacancy.add($scope.vacancy, function(resp) {
                    if (angular.equals(resp.status, "ok")) {
                        $scope.errorMessage.show = false;
                        if ($scope.fileForSave.length > 0) {
                            angular.forEach($scope.fileForSave, function(valI, i) {
                                Vacancy.addFileFromCache({
                                    "attId": valI.attId,
                                    "vacancyId": resp.object.vacancyId,
                                    "fileName": valI.fileName
                                }, function(resp) {
                                });
                                if ($scope.fileForSave.length - 1 == i) {
                                    $scope.clickedAddVacancy = false;
                                    notificationService.success($filter('translate')('vacancy_save_1') + $scope.vacancy.position + $filter('translate')('vacancy_save_2'));
                                    $location.path("vacancies/" + resp.object.localId);
                                }
                            });
                        } else {
                            $scope.clickedAddVacancy = false;
                            $location.path("vacancies/" + resp.object.localId);
                        }
                    } else {
                        $scope.clickedAddVacancy = false;
                        $scope.errorMessage.show = true;
                        $scope.errorMessage.message = resp.message;
                    }

                }, function(err) {
                    $scope.clickedAddVacancy = false;
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                    $localStorage.set("vacancyForSave", $scope.vacancy);
                    $cookies.url = $location.$$url;
                    $cookies.cfauth = 'false';
                    $window.location.replace('/');
                });
            } else {
                $scope.vacancyForm.position.$pristine = false;
                if(!$scope.vacancy.clientId.clientId){
                    $scope.clientError = true;
                }
                $scope.vacancyForm.regionInput.$pristine = false;
            }
        };
        //$('.select2-lang').select2({
        //    tags: $scope.langs,
        //    tokenSeparators: [",", " "]
        //});

        if ($localStorage.isExist("vacancy_currency")) {
            $scope.vacancy.currency = $localStorage.get("vacancy_currency");
        } else {
            $scope.vacancy.currency = "USD";
        }
        Vacancy.all(Vacancy.searchOptions(), function(response) {
            $rootScope.objectSize = response['objects'] != undefined ? response['total'] : 0;
        });
        $scope.getCompanyParams = function(){
            Company.getParams(function(resp){
                $scope.companyParams = resp.object;
                $rootScope.publicLink = $location.$$protocol + "://" + $location.$$host + "/i#/" + $scope.companyParams.nameAlias + "-vacancies";
            });
        };
        $scope.getCompanyParams();
        $scope.getFullCustomFields = function(){
            CustomField.getFullFields({
                objectType: 'vacancy'
            }, function(resp) {
                if (resp.status == "ok") {
                    $scope.allObjCustomField = resp.objects;
                } else {
                    notificationService.error(resp.message);
                }
            });
        };
        $scope.getFullCustomFields();
        $scope.deleteDate = function(id){
            $scope.editCustomId = id;
            angular.forEach($('.editDate'), function (nval) {
                if(id == nval.name){
                    nval.placeholder = '';
                    nval.value = '';
                }
            });
        };
        $scope.validSalary = function (event) {
            if(event.keyCode == 43 || event.keyCode == 45 || event.keyCode == 101 || event.keyCode == 69 )
                event.preventDefault();

        };

    }
]);
