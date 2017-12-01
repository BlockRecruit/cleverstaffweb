controller.controller('CandidateMergeController', ["$http", "$rootScope", "$scope", "FileInit", "$translate", "$routeParams", "$location", "$localStorage", "Service", "Candidate", "CacheCandidates", "notificationService", "$filter", "serverAddress", "$window", "$uibModal",
    function($http, $rootScope, $scope, FileInit, $translate, $routeParams, $location, $localStorage, Service, Candidate, CacheCandidates, notificationService, $filter, serverAddress, $window, $uibModal) {
        Service.toMergeCandidate($routeParams.id, "/candidates/" + $routeParams.id);
        $scope.test = {date: new Date()};
        $scope.type = "merge";
        $scope.saveButtonIsPressed = false;
        $scope.serverAddress = serverAddress;
        $scope.addLinkErrorShow = false;
        $scope.showAddedLinks = false;
        $scope.showAddedFiles = false;
        $scope.showAddLink = false;
        $scope.currency = Service.currency();
        $scope.experience = Service.experience();
        $scope.industries = Service.getIndustries();
        $scope.contacts = {skype: "", mphone: "", email: "", linkedin: "", facebook: "", googleplus: "", github: "", homepage: ""};
        $scope.contacts2 = {skype: "", mphone: "", email: "", linkedin: "", facebook: "", googleplus: "", github: "", homepage: ""};
        $scope.src = {
            salary: '1',
            fullName: '1'
            //skype: '1',
            //mphone: '1',
            //email: '1'
        };
        $('.col-lg-4').css({'max-width': '455px', 'display': 'inline-block', 'width': '100%'});
        $scope.deleteRegion2ToRelocate = function(index) {
            $scope.regionToRelocate.splice(index, 1);
        };
        $scope.addLinkToCandidate = {
            name: '',
            url: ''
        };
        $scope.linksForSave = [];
        $rootScope.changeStateInCandidate = {status: "", comment: "", fullName: null, placeholder: null};
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
        setTimeout(function(){
            $scope.langs = Candidate.getLangInOrg(function (resp){
                if(resp.object){
                    $scope.setLangs(resp.object);
                } else {
                    $scope.setLangs([]);
                }
            });
            var myListener = $scope.$on('addedLang', function (event, data) {
                if (data != undefined) {
                    $('.addingLangs').show();
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
        },0);
        $scope.showModalAddPhoto = function(){
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/add-photo-candidate.html',
                size: '',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            $scope.modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.addPhoto = function() {
            $('#photoFile').click();
        };
        $scope.lang = Service.lang();

        $scope.errorMessage = {
            show: false,
            message: ""
        };
        FileInit.initCandFileOption($scope, "candidate", "", false, $filter);
        FileInit.initFileOptionForEditFromResume($scope, "candidate");
        $scope.callbackFile = function(resp, name) {
            if (!$scope.candidate.files) {
                $scope.candidate.files = [];
            }
            $scope.candidate.files.push(resp);
        };
        $rootScope.closeModal = function(){
            $scope.modalInstance.close();
        };
        $scope.deleteCandidate = function() {
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/delete-candidate.html',
                size: '',
                resolve: {

                }
            });
            //$('.changeStatusOfCandidate.modal').modal('show');
            $rootScope.changeStateInCandidate.status = "archived";
            $rootScope.changeStateInCandidate.fullName = $scope.candidate.fullName;
            $rootScope.changeStateInCandidate.placeholder = $filter('translate')('Write a comment why you want remove this candidate');
        };
        $scope.langs = Candidate.getLangInOrg(function (resp){
            if(resp.objects){
                resp.objects.splice(0, 1);
                $scope.setLangs(resp.objects);
            } else {
                $scope.setLangs([]);
            }
        });
        $rootScope.saveStatusOfCandidate = function() {
            if ($rootScope.changeStateInCandidate.status != "") {
                Candidate.changeState({
                    candidateId: $scope.candidate.candidateId,
                    comment: $rootScope.changeStateInCandidate.comment,
                    candidateState: $rootScope.changeStateInCandidate.status
                }, function(resp) {
                    if (resp.status == "ok") {
                        $scope.candidate.status = resp.object.status;
                        notificationService.success($filter('translate')('candidate') + " " + $scope.candidate.fullName + " " + $filter('translate')('was_deleted'));
                        $location.path('/candidates');

                    }
                }, function(err) {
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                });
                $rootScope.closeModal();
                //$('.changeStatusOfCandidate.modal').modal('hide');
                $rootScope.changeStateInCandidate.status = "";
                $rootScope.changeStateInCandidate.comment = "";
            }
        };


        $scope.removeFile = function(id, second) {
            if (second) {
                Candidate.removeFile({"candidateId": $scope.candidate2.candidateId, "fileId": id}, function(resp) {
                });
                angular.forEach($scope.candidate2.files, function(val, ind) {
                    if (val.fileId === id) {
                        $scope.candidate2.files.splice(ind, 1);
                    }
                });
                if ($scope.candidate2.files.length === 0) {
                    delete $scope.candidate2.files;
                }
            }else {
                Candidate.removeFile({"candidateId": $scope.candidate.candidateId, "fileId": id}, function(resp) {
                });
                angular.forEach($scope.candidate.files, function(val, ind) {
                    if (val.fileId === id) {
                        $scope.candidate.files.splice(ind, 1);
                    }
                });
                if ($scope.candidate.files.length === 0) {
                    delete $scope.candidate.files;
                }
            }

        };

        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1930:-0',
            defaultDate: "01/01/1990"
        };
        $scope.cancel = function() {
            $location.path("/candidates/" + $routeParams.id);
        };

        $(".datepickerOfBirth")
            .datetimepicker({
                format: "dd/mm/yyyy",
                startView: 4,
                minView: 2,
                autoclose: true,
                language: $translate.use(),
                weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                initialDate: new Date(315550800000)
            })
            .on('hide', function(val) {
                if (val.date != undefined) {
                    $scope.candidate.db = val.date.getTime();
                }
                $('.datepickerOfBirth').blur();
            });
        $scope.updateCandidate = function(){
            Candidate.one({"localId": $routeParams.id}, function(resp) {
                if (angular.equals(resp.status, "ok")) {
                    $scope.setOriginAutocompleterValue(resp.object.origin);
                    $scope.setPositionAutocompleterValue(resp.object.position);
                    if (resp.object.region != undefined && resp.object.region.lat != undefined && resp.object.region.lng != undefined) {
                        $scope.region = resp.object.region;
                        $scope.map.center.latitude = resp.object.region.lat;
                        $scope.map.center.longitude = resp.object.region.lng;
                        $scope.marker.coords.latitude = resp.object.region.lat;
                        $scope.marker.coords.longitude = resp.object.region.lng;

                        $scope.regionInput = resp.object.region.displayFullName;
                        $('#pac-input').val(resp.object.region.displayFullName);

                    }
                    $scope.photoLink = $scope.serverAddress + "/getapp?id=" + resp.object.photo + "&d=true";
                    $scope.regionToRelocate = resp.object.relatedRegions != undefined ? resp.object.relatedRegions : [];
                    var name = "";
                    resp.object.fullName != undefined ? name + resp.object.fullName.replace(/\s/g, '_') : "";
                    resp.object.position != undefined ? name + resp.object.position.replace(/\s/g, '_') : "";
                    resp.object.salary == 0 ? resp.object.salary = null : null;
                    if (name.length > 0) {
                        $location.hash($filter('transliteration')(name)).replace();
                    }
                    $scope.candidate = resp.object;
                    $scope.imgWidthFunc();
                    if($scope.candidate.files){
                        if($scope.candidate.files.length != undefined && $scope.candidate.files.length != 0){
                            angular.forEach($scope.candidate.files, function (val) {
                                initDocuments(val);
                            });
                        }
                    }
                    $scope.objectLang = [];
                    $scope.objectId = $scope.candidate.candidateId;
                    if($scope.candidate.languages!=undefined){
                        angular.forEach($scope.candidate.languages, function (val) {
                            if(val.name != undefined){
                                $scope.objectLang.push({id: val.languageId, text: val.name, level: val.level});
                                $scope.setSelect2Lang($scope.objectLang);
                            }
                        });
                    }
                    if (resp.object.employmentType != undefined) {
                        $scope.setSelect2EmploymentType(resp.object.employmentType.split(","));
                    }
                    if (resp.object.db) {
                        $scope.data = new Date(resp.object.db);
                    }
                    if (resp.object.db != undefined) {
                        $(".datepickerOfBirth").datetimepicker("setDate", new Date(resp.object.db));
                    }
                    if (resp.object.contacts) {
                        angular.forEach(resp.object.contacts, function(val) {
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
                            if (angular.equals(val.type, "github")) {
                                $scope.contacts.github = val.value;
                            }
                            if (angular.equals(val.type, "homepage")) {
                                $scope.contacts.homepage = val.value;
                            }
                        });
                        $scope.candidate.fieldValues = [];

                        if (resp.object.customFields) {
                            angular.forEach(resp.object.customFields, function(val) {
                                if(val.fieldValue != undefined){
                                    if (angular.equals(val.type, "string")) {
                                        $scope.candidate.fieldValues.push({
                                            objType: "candidate",
                                            fieldValueId: val.fieldValue.fieldValueId,
                                            value:  val.fieldValue.value,
                                            field: {
                                                fieldId: val.fieldId
                                            }
                                        });
                                    }
                                    if (angular.equals(val.type, "select")) {
                                        $scope.candidate.fieldValues.push({
                                            objType: "candidate",
                                            fieldValueId: val.fieldValue.fieldValueId,
                                            value:  val.fieldValue.value,
                                            field: {
                                                fieldId: val.fieldId
                                            }
                                        });
                                    }
                                    if (angular.equals(val.type, "date")) {
                                        $scope.candidate.fieldValues.push({
                                            objType: "candidate",
                                            fieldValueId: val.fieldValue.fieldValueId,
                                            dateTimeValue: val.fieldValue.dateTimeValue,
                                            field: {
                                                fieldId: val.fieldId
                                            }
                                        });
                                    }
                                    if (angular.equals(val.type, "datetime")) {
                                        $scope.candidate.fieldValues.push({
                                            objType: "candidate",
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
                        $scope.fieldValueFirstValue = false;
                        angular.forEach($scope.candidate.fieldValues, function (val) {
                            console.log(val);
                            if(val != undefined){
                                $scope.fieldValueFirstValue = true;
                            }
                        });
                        $scope.candidateBeforeMerge = angular.copy($scope.candidate);
                        $scope.contactsBeforeMerge = angular.copy($scope.contacts);
                    }
                } else {
                    notificationService.error($filter('translate')('candidate not found'));
                    $location.path('/candidates');
                }
            }, function(err) {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });
        };
        $scope.updateCandidate();
        $scope.status = Candidate.getStatus();
        $scope.employmentType = Service.employmentType();

        $scope.candidate2 = angular.fromJson($localStorage.get("candidateForMerge"));
        $scope.updateCandidate2 = function(){
            Candidate.one({"localId": $scope.candidate2.localId}, function(resp) {
                if (angular.equals(resp.status, "ok")) {
                    var name = "";
                    resp.object.fullName != undefined ? name + resp.object.fullName.replace(/\s/g, '_') : "";
                    resp.object.position != undefined ? name + resp.object.position.replace(/\s/g, '_') : "";
                    resp.object.salary == 0 ? resp.object.salary = null : null;
                    if (name.length > 0) {
                        $location.hash($filter('transliteration')(name)).replace();
                    }
                    $scope.candidate2 = resp.object;
                    if($scope.candidate2.files){
                        if($scope.candidate2.files.length != undefined && $scope.candidate2.files.length != 0){
                            angular.forEach($scope.candidate2.files, function (val) {
                                initDocuments(val);
                            });
                        }
                    }
                    $scope.objectId = $scope.candidate2.candidateId;

                    if (resp.object.contacts) {
                        angular.forEach(resp.object.contacts, function(val) {
                            if (angular.equals(val.type, "email")) {
                                $scope.contacts2.email = val.value;
                            }
                            if (angular.equals(val.type, "mphone")) {
                                $scope.contacts2.mphone = val.value;
                            }
                            if (angular.equals(val.type, "skype")) {
                                $scope.contacts2.skype = val.value;
                            }
                            if (angular.equals(val.type, "linkedin")) {
                                $scope.contacts2.linkedin = val.value;
                            }
                            if (angular.equals(val.type, "facebook")) {
                                $scope.contacts2.facebook = val.value;
                            }
                            if (angular.equals(val.type, "googleplus")) {
                                $scope.contacts2.googleplus = val.value;
                            }
                            if (angular.equals(val.type, "github")) {
                                $scope.contacts2.github = val.value;
                            }
                            if (angular.equals(val.type, "homepage")) {
                                $scope.contacts2.homepage = val.value;
                            }
                        });
                    }
                    $scope.candidate2.fieldValues = [];

                    if (resp.object.customFields) {
                        angular.forEach(resp.object.customFields, function(val) {
                            if(val.fieldValue != undefined){
                                if (angular.equals(val.type, "string")) {
                                    $scope.candidate2.fieldValues.push({
                                        objType: "candidate",
                                        fieldValueId: val.fieldValue.fieldValueId,
                                        value:  val.fieldValue.value,
                                        field: {
                                            fieldId: val.fieldId
                                        }
                                    });
                                }
                                if (angular.equals(val.type, "select")) {
                                    $scope.candidate2.fieldValues.push({
                                        objType: "candidate",
                                        fieldValueId: val.fieldValue.fieldValueId,
                                        value:  val.fieldValue.value,
                                        field: {
                                            fieldId: val.fieldId
                                        }
                                    });
                                }
                                if (angular.equals(val.type, "date")) {
                                    $scope.candidate2.fieldValues.push({
                                        objType: "candidate",
                                        fieldValueId: val.fieldValue.fieldValueId,
                                        dateTimeValue: val.fieldValue.dateTimeValue,
                                        field: {
                                            fieldId: val.fieldId
                                        }
                                    });
                                }
                                if (angular.equals(val.type, "datetime")) {
                                    $scope.candidate2.fieldValues.push({
                                        objType: "candidate",
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
                    $scope.fieldValueSecondValue = false;
                    angular.forEach($scope.candidate2.fieldValues, function (nval) {
                        console.log(nval);
                        if(nval != undefined){
                            $scope.fieldValueSecondValue = true;
                        }
                    });
                } else {
                    notificationService.error($filter('translate')('candidate not found'));
                    $location.path('/candidates');
                }
            }, function(err) {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });
        };
        $scope.updateCandidate2();
        $scope.secondRegion  = false;
        $scope.secondLanguages  = false;
        $scope.secondPosition  = false;
        $scope.secondSex  = false;
        $scope.secondCurrentWorkPlace  = false;
        $scope.secondSalary  = false;
        $scope.secondOrigin  = false;
        $scope.secondCoreSkills  = false;
        $scope.secondSkills  = false;
        $scope.secondDescr  = false;
        $scope.secondRelatedRegions  = false;
        $scope.secondEducation  = false;
        $scope.secondIndustry  = false;
        $scope.secondExpirence  = false;
        $scope.secondCurrentPosition  = false;
        $scope.secondMphone  = false;
        $scope.secondEmail  = false;
        $scope.secondSkype  = false;
        $scope.secondLinkedin  = false;
        $scope.secondFacebook  = false;
        $scope.secondGoogleplus  = false;
        $scope.secondGithub  = false;
        $scope.secondHomepage  = false;
        $scope.secondDb  = false;
        $scope.secondCustomFields  = false;
        $scope.fieldValues = [];
        $scope.selectSource = function (src, index, customField, isContact, type) {
            var sourceForRegion = function () {
                //var source;
                if(src == '1') {
                    $scope.secondRegion  = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.region = '1';
                    $('button.active').removeClass('region');
                    $('button.region').css('border', 'none');
                } else if(src == '2') {
                    $scope.secondRegion  = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.region = '2';
                    $('button.active').removeClass('region');
                    $('button.region').css('border', 'none');
                }
            };
            var sourceForLanguage = function () {
                if(src === '1') {
                    $scope.objectLang = [];
                    if($scope.candidateBeforeMerge.languages != undefined && $scope.candidateBeforeMerge.languages.length > 0){
                        //$scope.setSelect2Lang($scope.candidateBeforeMerge.languages.split(","));
                        angular.forEach($scope.candidateBeforeMerge.languages, function (val) {
                            if(val.name != undefined){
                                $scope.objectLang.push({id: val.languageId, text: val.name, level: val.level});
                                $scope.setSelect2Lang($scope.objectLang);
                                $scope.secondLanguages  = false;
                            }
                        });
                        $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                        $scope.src.languages = '1';
                        $('button.active').removeClass('languages');
                        $('button.languages').css('border', 'none');
                    }else{
                        $scope.setSelect2Lang($scope.objectLang);
                    }
                }else if(src === '2') {
                    $scope.objectLang2 = [];
                    if($scope.candidate2.languages != undefined && $scope.candidate2.languages.length > 0){
                        //$scope.setSelect2Lang($scope.candidate2.languages.split(","));
                        angular.forEach($scope.candidate2.languages, function (val) {
                            if(val.name != undefined){
                                $scope.objectLang2.push({id: val.languageId, text: val.name, level: val.level});
                                $scope.setSelect2Lang($scope.objectLang2);
                                $scope.secondLanguages  = true;
                            }
                        });
                        $scope.candidate[type] = $scope.candidate2[type];
                        $scope.src.languages = '2';
                        $('button.active').removeClass('languages');
                        $('button.languages').css('border', 'none');
                    }else{
                        $scope.setSelect2Lang($scope.objectLang2);
                    }
                } else {
                    $scope.objectLang = [];
                    $scope.setSelect2Lang($scope.objectLang);
                }
            };
            var sourceForPosition = function () {
                if(src === '1') {
                    $scope.secondPosition  = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.setPositionAutocompleterValue($scope.candidateBeforeMerge.position);
                    $scope.src.position = '1';
                    $('button.active').removeClass('position');
                    $('button.position').css('border', 'none');
                }else if(src === '2') {
                    $scope.secondPosition  = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.setPositionAutocompleterValue($scope.candidate2.position);
                    $scope.src.position = '2';
                    $('button.active').removeClass('position');
                    $('button.position').css('border', 'none');
                }
            };
            var sourceForEmploymentType = function () {
                if(src === '1') {
                    $scope.setSelect2EmploymentType($scope.candidateBeforeMerge.employmentType.split(","));
                    $scope.src.employmentType = '1';
                    $('button.active').removeClass('employmentType');
                    $('button.employmentType').css('border', 'none');
                }else if(src === '2') {
                    $scope.setSelect2EmploymentType($scope.candidate2.employmentType.split(","));
                    $scope.src.employmentType = '2';
                    $('button.active').removeClass('employmentType');
                    $('button.employmentType').css('border', 'none');
                }else {
                    $scope.setPositionAutocompleterValue(undefined);
                }
            };
            var sourceForSalary = function () {
                if(src === '1') {
                    $scope.secondSalary  = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.candidate['currency'] = $scope.candidateBeforeMerge['currency'];
                    $scope.src.salary = '1';
                    $('button.active').removeClass('salary');
                    $('button.salary').css('border', 'none');
                }else if(src === '2') {
                    $scope.secondSalary  = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.candidate['currency'] = $scope.candidate2['currency'];
                    $scope.src.salary = '2';
                    $('button.active').removeClass('salary');
                    $('button.salary').css('border', 'none');
                }
            };
            var sourceForOrigin = function () {
                if(src === '1') {
                    $scope.secondOrigin  = false;
                    $scope.setOriginAutocompleterValue($scope.candidateBeforeMerge.origin);
                    $scope.src.origin = '1';
                    $('button.active').removeClass('origin');
                    $('button.origin').css('border', 'none');
                }else if(src === '2') {
                    $scope.secondOrigin  = true;
                    $scope.setOriginAutocompleterValue($scope.candidate2.origin);
                    $scope.src.origin = '2';
                    $('button.active').removeClass('origin');
                    $('button.origin').css('border', 'none');
                }else {
                    $scope.setOriginAutocompleterValue(undefined);
                }
            };
            var sourceForCoreSkills = function () {
                if(src === '1') {
                    $scope.secondCoreSkills  = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.coreSkills = '1';
                    $('button.active').removeClass('coreSkills');
                    $('button.coreSkills').css('border', 'none');
                }else if(src === '2') {
                    $scope.secondCoreSkills  = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.coreSkills = '2';
                    $('button.active').removeClass('coreSkills');
                    $('button.coreSkills').css('border', 'none');
                }
            };
            var sourceForSkills = function () {
                if(src === '1') {
                    $scope.secondSkills  = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.skills = '1';
                    $('button.active').removeClass('skills');
                    $('button.skills').css('border', 'none');
                }else if(src === '2') {
                    $scope.secondSkills  = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.skills = '2';
                    $('button.active').removeClass('skills');
                    $('button.skills').css('border', 'none');
                }
            };
            var sourceForDescription = function () {
                if(src === '1') {
                    $scope.secondDescr  = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.descr = '1';
                    $('button.active').removeClass('descr');
                    $('button.descr').css('border', 'none');
                }else if(src === '2') {
                    $scope.secondDescr  = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.descr = '2';
                    $('button.active').removeClass('descr');
                    $('button.descr').css('border', 'none');
                }
            };
            var sourceForFullName = function () {
                if(src === '1') {
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.fullName = '1';
                    $('button.active').removeClass('fullName');
                    $('button.fullName').css('border', 'none');
                }else if(src === '2') {
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.fullName = '2';
                    $('button.active').removeClass('fullName');
                    $('button.fullName').css('border', 'none');
                }
            };
            var sourceForRelatedRegions = function () {
                if(src === '1') {
                    $scope.secondRelatedRegions  = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.relatedRegions = '1';
                }else if(src === '2') {
                    $scope.secondRelatedRegions  = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.relatedRegions = '2';
                }
            };
            var sourceForEducation = function () {
                if(src === '1') {
                    $scope.secondEducation  = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.education = '1';
                    $('button.active').removeClass('education');
                    $('button.education').css('border', 'none');
                }else if(src === '2') {
                    $scope.secondEducation  = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.education = '2';
                    $('button.active').removeClass('education');
                    $('button.education').css('border', 'none');
                }
            };
            var sourceForIndustry = function () {
                if(src === '1') {
                    $scope.secondIndustry  = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.industry = '1';
                    $('button.active').removeClass('industry');
                    $('button.industry').css('border', 'none');
                }else if(src === '2') {
                    $scope.secondIndustry  = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.industry = '2';
                    $('button.active').removeClass('industry');
                    $('button.industry').css('border', 'none');
                }
            };
            var sourceForExpirence = function () {
                if(src === '1') {
                    $scope.secondExpirence  = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.expirence = '1';
                    $('button.active').removeClass('expirence');
                    $('button.expirence').css('border', 'none');
                }else if(src === '2') {
                    $scope.secondExpirence  = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.expirence = '2';
                    $('button.active').removeClass('expirence');
                    $('button.expirence').css('border', 'none');
                }
            };
            var sourceForCurrentWorkPlace = function () {
                if(src === '1') {
                    $scope.secondCurrentWorkPlace = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.currentWorkPlace = '1';
                    $('button.active').removeClass('currentWorkPlace');
                    $('button.currentWorkPlace').css('border', 'none');
                }else if(src === '2') {
                    $scope.secondCurrentWorkPlace = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.currentWorkPlace = '2';
                    $('button.active').removeClass('currentWorkPlace');
                    $('button.currentWorkPlace').css('border', 'none');
                }
            };
            var sourceForCurrentPosition = function () {
                if(src === '1') {
                    $scope.secondCurrentPosition  = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.currentPosition = '1';
                    $('button.active').removeClass('currentPosition');
                    $('button.currentPosition').css('border', 'none');
                }else if(src === '2') {
                    $scope.secondCurrentPosition  = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.currentPosition = '2';
                    $('button.active').removeClass('currentPosition');
                    $('button.currentPosition').css('border', 'none');
                }
            };
            var sourceForMphone = function () {
                if(src === '1') {
                    $scope.secondMphone  = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.mphone = '1';
                    $('button.active').removeClass('mphone');
                    $('button.mphone').css('border', 'none');
                }else if(src === '2') {
                    $scope.secondMphone  = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.mphone = '2';
                    $('button.active').removeClass('mphone');
                    $('button.mphone').css('border', 'none');
                }
            };
            var sourceForEmail = function () {
                if(src === '1') {
                    $scope.secondEmail  = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.email = '1';
                    $('button.active').removeClass('email');
                    $('button.email').css('border', 'none');
                }else if(src === '2') {
                    $scope.secondEmail  = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.email = '2';
                    $('button.active').removeClass('email');
                    $('button.email').css('border', 'none');
                }
            };
            var sourceForSkype = function () {
                if(src === '1') {
                    $scope.secondSkype  = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.skype = '1';
                    $('button.active').removeClass('skype');
                    $('button.skype').css('border', 'none');
                }else if(src === '2') {
                    $scope.secondSkype  = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.skype = '2';
                    $('button.active').removeClass('skype');
                    $('button.skype').css('border', 'none');
                }
            };
            var sourceForLinkedin = function () {
                if(src === '1') {
                    $scope.secondLinkedin  = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.linkedin = '1';
                    $('button.active').removeClass('linkedin');
                    $('button.linkedin').css('border', 'none');
                }else if(src === '2') {
                    $scope.secondLinkedin  = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.linkedin = '2';
                    $('button.active').removeClass('linkedin');
                    $('button.linkedin').css('border', 'none');
                }
            };
            var sourceForFacebook = function () {
                if(src === '1') {
                    $scope.secondFacebook  = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.facebook = '1';
                    $('button.active').removeClass('facebook');
                    $('button.facebook').css('border', 'none');
                }else if(src === '2') {
                    $scope.secondFacebook  = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.facebook = '2';
                    $('button.active').removeClass('facebook');
                    $('button.facebook').css('border', 'none');
                }
            };
            var sourceForGoogleplus = function () {
                if(src === '1') {
                    $scope.secondGoogleplus  = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.googleplus = '1';
                    $('button.active').removeClass('googleplus');
                    $('button.googleplus').css('border', 'none');
                }else if(src === '2') {
                    $scope.secondGoogleplus  = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.googleplus = '2';
                    $('button.active').removeClass('googleplus');
                    $('button.googleplus').css('border', 'none');
                }
            };
            var sourceForGithub = function () {
                if(src === '1') {
                    $scope.secondGithub  = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.github = '1';
                    $('button.active').removeClass('github');
                    $('button.github').css('border', 'none');
                }else if(src === '2') {
                    $scope.secondGithub  = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.github = '2';
                    $('button.active').removeClass('github');
                    $('button.github').css('border', 'none');
                }
            };
            var sourceForHomepage = function () {
                if(src === '1') {
                    $scope.secondHomepage  = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.homepage = '1';
                    $('button.active').removeClass('homepage');
                    $('button.homepage').css('border', 'none');
                }else if(src === '2') {
                    $scope.secondHomepage  = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.homepage = '2';
                    $('button.active').removeClass('homepage');
                    $('button.homepage').css('border', 'none');
                }
            };
            var sourceForDb = function () {
                if(src === '1') {
                    $scope.secondDb  = false;
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.db = '1';
                }else if(src === '2') {
                    $scope.secondDb  = true;
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.db = '2';
                }
            };
            var sourceForCustomFields = function () {
                console.log(index);
                console.log(customField);
                if (index % 2 == 0){
                    //alert("2 - четное число");
                    $scope.sameCustomFieldId = true;
                    $('.customFieldBtn' + index).addClass('active');
                    var valueBtn = $('.customFirstCandidate').find('.customFieldBtn' + index).val();
                    console.log($scope.fieldValues);
                    angular.forEach($scope.fieldValues ,function(val){
                        console.log(val);
                        if(val.field.fieldId == valueBtn){
                            $scope.sameCustomFieldId = false;
                        }
                    });
                    if(src === '1' && $scope.fieldValues.length >= 0 && $scope.sameCustomFieldId) {
                        if (angular.equals(customField.type, "string")) {
                            $scope.fieldValues.push({
                                objType: "candidate",
                                fieldValueId: customField.fieldValue.fieldValueId,
                                value: customField.fieldValue.value,
                                field: {
                                    fieldId: customField.fieldValue.field.fieldId
                                }
                            });
                        }
                        if (angular.equals(customField.type, "select")) {
                            $scope.fieldValues.push({
                                objType: "candidate",
                                fieldValueId: customField.fieldValue.fieldValueId,
                                value: customField.fieldValue.value,
                                field: {
                                    fieldId: customField.fieldValue.field.fieldId
                                }
                            });
                        }
                        if (angular.equals(customField.type, "date")) {
                            $scope.fieldValues.push({
                                objType: "candidate",
                                fieldValueId: customField.fieldValue.fieldValueId,
                                dateTimeValue: customField.fieldValue.dateTimeValue,
                                field: {
                                    fieldId: customField.fieldValue.field.fieldId
                                }
                            });
                        }
                        if (angular.equals(customField.type, "datetime")) {
                            $scope.fieldValues.push({
                                objType: "candidate",
                                fieldValueId: customField.fieldValue.fieldValueId,
                                dateTimeValue: customField.fieldValue.dateTimeValue,
                                field: {
                                    fieldId: customField.fieldValue.field.fieldId
                                }
                            });
                        }
                        $scope.secondCustomFields  = false;
                        $scope.candidate[type] = $scope.fieldValues;
                        console.log($scope.candidate);
                        $scope.src.customFields = '1';
                        $('button.active').removeClass('fieldValues');
                        $('button.customFields').css('border', 'none');
                    }
                }else if (index % 2 == 1){
                    //alert("3 - не четное число");
                    $scope.sameCustomFieldId = true;
                    $('.customFieldSecondBtn' + index).addClass('active');
                    var valueBtn2 = $('.customSecondCandidate').find('.customFieldSecondBtn' + index).val();
                    console.log($scope.fieldValues);
                    angular.forEach($scope.fieldValues ,function(val){
                        console.log(val);
                        if(val.field.fieldId == valueBtn2){
                            $scope.sameCustomFieldId = false;
                        }
                    });
                    if(src === '2' && $scope.fieldValues.length >= 0 && $scope.sameCustomFieldId) {
                        if (angular.equals(customField.type, "string")) {
                            $scope.fieldValues.push({
                                objType: "candidate",
                                fieldValueId: customField.fieldValue.fieldValueId,
                                value: customField.fieldValue.value,
                                field: {
                                    fieldId: customField.fieldValue.field.fieldId
                                }
                            });
                        }
                        if (angular.equals(customField.type, "select")) {
                            $scope.fieldValues.push({
                                objType: "candidate",
                                fieldValueId: customField.fieldValue.fieldValueId,
                                value: customField.fieldValue.value,
                                field: {
                                    fieldId: customField.fieldValue.field.fieldId
                                }
                            });
                        }
                        if (angular.equals(customField.type, "date")) {
                            $scope.fieldValues.push({
                                objType: "candidate",
                                fieldValueId: customField.fieldValue.fieldValueId,
                                dateTimeValue: customField.fieldValue.dateTimeValue,
                                field: {
                                    fieldId: customField.fieldValue.field.fieldId
                                }
                            });
                        }
                        if (angular.equals(customField.type, "datetime")) {
                            $scope.fieldValues.push({
                                objType: "candidate",
                                fieldValueId: customField.fieldValue.fieldValueId,
                                dateTimeValue: customField.fieldValue.dateTimeValue,
                                field: {
                                    fieldId: customField.fieldValue.field.fieldId
                                }
                            });
                        }
                        $scope.secondCustomFields  = true;
                        $scope.candidate[type] = $scope.fieldValues;
                        console.log($scope.candidate);
                        $scope.src.customFields = '2';
                        $('button.active').removeClass('fieldValues');
                        $('button.customFields').css('border', 'none');
                    }
                }
                console.log($scope.fieldValues);
            };
            var sourceByDefault = function () {
                if(isContact) {
                    if(src === '1') {
                        $scope.contacts[type] = $scope.contactsBeforeMerge[type];
                    }else if(src === '2') {
                        $scope.contacts[type] = $scope.contacts2[type];
                    }else {
                        $scope.contacts[type] = undefined;
                    }
                }else {
                    if(src === '1') {
                        $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    }else if(src === '2') {
                        $scope.candidate[type] = $scope.candidate2[type];
                    }else {
                        $scope.candidate[type] = undefined;
                    }
                }
            };

            switch (type) {
                case  'fieldValues':
                    sourceForCustomFields();
                    break;
                case  'skills':
                    sourceForSkills();
                    break;
                case  'skype':
                    sourceForSkype();
                    break;
                case  'db':
                    sourceForDb();
                    break;
                case  'homepage':
                    sourceForHomepage();
                    break;
                case  'github':
                    sourceForGithub();
                    break;
                case  'googleplus':
                    sourceForGoogleplus();
                    break;
                case  'facebook':
                    sourceForFacebook();
                    break;
                case  'linkedin':
                    sourceForLinkedin();
                    break;
                case  'mphone':
                    sourceForMphone();
                    break;
                case  'email':
                    sourceForEmail();
                    break;
                case  'currentPosition':
                    sourceForCurrentPosition();
                    break;
                case  'currentWorkPlace':
                    sourceForCurrentWorkPlace();
                    break;
                case  'expirence':
                    sourceForExpirence();
                    break;
                case  'education':
                    sourceForEducation();
                    break;
                case  'industry':
                    sourceForIndustry();
                    break;
                case  'relatedRegions':
                    sourceForRelatedRegions();
                    break;
                case  'fullName':
                    sourceForFullName();
                    break;
                case  'position':
                    sourceForPosition();
                    break;
                case 'salary':
                    sourceForSalary();
                    break;
                case 'languages':
                    sourceForLanguage();
                    break;
                case 'region':
                    sourceForRegion();
                    break;
                case 'employmentType':
                    sourceForEmploymentType();
                    break;
                case 'origin':
                    sourceForOrigin();
                    break;
                case 'coreSkills':
                    sourceForCoreSkills();
                    break;
                case 'descr':
                    sourceForDescription();
                    break;
                default:
                    sourceByDefault();
            }
        };

        $scope.imgWidthFunc = function(){
            var img = new Image();
            img.onload = function() {
                var width = this.width;
                if(width >= 300){
                    $('.photoWidth').css({'width': '100%', 'height': 'auto'});
                }else{
                    $('.photoWidth').css({'width': 'inherit', 'display': 'block', 'margin': '0 auto'});
                }
            };
            if($location.$$host == '127.0.0.1'){
                img.src = $location.$$protocol + '://' + $location.$$host + ':8080' + $scope.serverAddress + '/getapp?id=' + $scope.candidate.photo + '&d=' + $rootScope.me.personId;
            }else{
                img.src = $location.$$protocol + '://' + $location.$$host + $scope.serverAddress + '/getapp?id=' + $scope.candidate.photo + '&d=' + $rootScope.me.personId;
            }
        };
        $scope.callbackAddPhoto = function(photo) {
            $scope.candidate.photo = photo;
            $scope.photoLink = $scope.serverAddress + "/getapp?id=" + $scope.candidate.photo + "&d=true";
            $scope.imgWidthFunc();
            //$scope.hideModalAddPhoto();
            $rootScope.closeModal();
        };
        FileInit.addPhotoByReference($scope, $scope.callbackAddPhoto);

        $scope.callbackErr = function(err) {
            notificationService.error(err);
        };
        Candidate.setPhoto($scope);

        $scope.removePhoto = function() {
            $scope.candidate.photo = "";
        };
        $scope.saveCandidate = function() {
            var salaryBol = true;
            if ($scope.candidate.salary != undefined && $scope.candidate.salary != "" && /[^[0-9]/.test($scope.candidate.salary)) {
                $scope.errorMessage.show = true;
                $scope.errorMessage.message = $filter("translate")("desired_salary_should_contains_only_numbers");
                salaryBol = false;
            }
            if($('.fullNames')[0].classList.value.indexOf('ng-hide') > -1){
                $scope.src.fullName = '1';
            }
            $scope.showCustomFields = true;
            if($('.customFieldss')[0].classList.value.indexOf('ng-hide') == -1){
                $scope.showCustomFields = false;
            }
            console.log($scope.src.fullName != 0);
            console.log($scope.src.salary != 0 || (!$scope.candidateBeforeMerge.salary || !$scope.candidate2.salary || ($scope.candidateBeforeMerge.salary == $scope.candidate2.salary)));
            console.log($scope.src.education != 0 || (!$scope.candidateBeforeMerge.education || !$scope.candidate2.education || ($scope.candidateBeforeMerge.education != undefined || $scope.candidate2.education != undefined)));
            console.log($scope.src.languages != 0 || (!$scope.candidateBeforeMerge.languages.length > 0 || !$scope.candidate2.languages.length > 0 || ($scope.candidateBeforeMerge.languages == $scope.candidate2.languages)));
            console.log($scope.src.customFields != 0 || (($scope.candidateBeforeMerge.customFields.length > 0 || $scope.candidate2.customFields.length > 0) && (!$scope.fieldValues.length > 0 || !$scope.fieldValues.length > 0)), 'custom');
            console.log($scope.src.customFields != 0);
            console.log(!$scope.fieldValues.length > 0);
            console.log(!$scope.fieldValues.length > 0);
            console.log($scope.candidateBeforeMerge.customFields.length > 0);
            console.log($scope.candidate2.customFields.length > 0);
            console.log($scope.src.region != 0 || (!$scope.candidateBeforeMerge.region || !$scope.candidate2.region || ($scope.candidateBeforeMerge.region.displayFullName == $scope.candidate2.region.displayFullName)));
            console.log($scope.src.position != 0 || (!($scope.candidateBeforeMerge.position && $scope.candidateBeforeMerge.position.length > 1) || !($scope.candidate2.position && $scope.candidate2.position.length > 1) || ($scope.candidateBeforeMerge.position == $scope.candidate2.position)));
            console.log($scope.src.industry != 0 || (!$scope.candidateBeforeMerge.industry || !$scope.candidate2.industry || ($scope.candidateBeforeMerge.industry == $scope.candidate2.industry)));
            console.log($scope.src.expirence != 0 || (!$scope.candidateBeforeMerge.expirence || !$scope.candidate2.expirence || ($scope.candidateBeforeMerge.expirence == $scope.candidate2.expirence)));
            console.log($scope.src.employmentType != 0 || (!$scope.candidateBeforeMerge.employmentType || !$scope.candidate2.employmentType || ($scope.candidateBeforeMerge.employmentType == $scope.candidate2.employmentType)));
            console.log($scope.src.currentWorkPlace != 0 || (!$scope.candidateBeforeMerge.currentWorkPlace || !$scope.candidate2.currentWorkPlace || ($scope.candidateBeforeMerge.currentWorkPlace == $scope.candidate2.currentWorkPlace)), 'currentWorkPlace');
            console.log($scope.src.currentPosition != 0 || (!$scope.candidateBeforeMerge.currentPosition || !$scope.candidate2.currentPosition || ($scope.candidateBeforeMerge.currentPosition == $scope.candidate2.currentPosition)));
            console.log($scope.src.origin != 0 || (!$scope.candidateBeforeMerge.origin || !$scope.candidate2.origin || ($scope.candidateBeforeMerge.origin == $scope.candidate2.origin)));
            console.log($scope.src.mphone != 0 || (!$scope.contacts.mphone || !$scope.contacts2.mphone || ($scope.contacts.mphone == $scope.contacts2.mphone)));
            console.log($scope.src.email != 0 || (!$scope.contacts.email || !$scope.contacts2.email || ($scope.contacts.email == $scope.contacts2.email)));
            console.log($scope.src.skype != 0 || (!$scope.contacts.skype || !$scope.contacts2.skype || ($scope.contacts.skype == $scope.contacts2.skype)));
            console.log($scope.src.linkedin != 0 || (!$scope.contacts.linkedin || !$scope.contacts2.linkedin || ($scope.contacts.linkedin == $scope.contacts2.linkedin)));
            console.log($scope.src.facebook != 0 || (!$scope.contacts.facebook || !$scope.contacts2.facebook || ($scope.contacts.facebook == $scope.contacts2.facebook)));
            console.log($scope.src.googleplus != 0 || (!$scope.contacts.googleplus || !$scope.contacts2.googleplus || ($scope.contacts.googleplus == $scope.contacts2.googleplus)));
            console.log($scope.src.github != 0 || (!$scope.contacts.github || !$scope.contacts2.github || ($scope.contacts.github == $scope.contacts2.github)));
            console.log($scope.src.homepage != 0 || (!$scope.contacts.homepage || !$scope.contacts2.homepage || ($scope.contacts.homepage == $scope.contacts2.homepage)));
            console.log($scope.src.skills != 0 || (!($scope.candidateBeforeMerge.skills && $scope.candidateBeforeMerge.skills.length > 0) || !($scope.candidate2.skills && $scope.candidate2.skills.length > 0)));
            console.log($scope.src.coreSkills != 0 || (!$scope.candidateBeforeMerge.coreSkills || !$scope.candidate2.coreSkills || ($scope.candidateBeforeMerge.coreSkills == $scope.candidate2.coreSkills)));
            console.log($scope.src.descr != 0 || (!$scope.candidateBeforeMerge.descr || !$scope.candidate2.descr || ($scope.candidateBeforeMerge.descr == $scope.candidate2.descr)));
            if ($scope.src.fullName != 0 && ($scope.src.salary != 0 || (!$scope.candidateBeforeMerge.salary || !$scope.candidate2.salary || ($scope.candidateBeforeMerge.salary == $scope.candidate2.salary))) && ($scope.src.education != 0 || (!$scope.candidateBeforeMerge.education || !$scope.candidate2.education || ($scope.candidateBeforeMerge.education == $scope.candidate2.education))) && ($scope.src.languages != 0 || (!$scope.candidateBeforeMerge.languages.length > 0 || !$scope.candidate2.languages.length > 0 || ($scope.candidateBeforeMerge.languages == $scope.candidate2.languages))) && ($scope.src.customFields != 0 || (($scope.candidateBeforeMerge.customFields.length > 0 || $scope.candidate2.customFields.length > 0) && (!$scope.fieldValues.length > 0 || !$scope.fieldValues.length > 0)) && $scope.showCustomFields) && ($scope.src.region != 0 || (!$scope.candidateBeforeMerge.region || !$scope.candidate2.region || ($scope.candidateBeforeMerge.region.displayFullName == $scope.candidate2.region.displayFullName))) && ($scope.src.position != 0 || (!($scope.candidateBeforeMerge.position && $scope.candidateBeforeMerge.position.length > 1) || !($scope.candidate2.position && $scope.candidate2.position.length > 1) || ($scope.candidateBeforeMerge.position == $scope.candidate2.position))) && ($scope.src.industry != 0 || (!$scope.candidateBeforeMerge.industry || !$scope.candidate2.industry || ($scope.candidateBeforeMerge.industry == $scope.candidate2.industry))) && ($scope.src.expirence != 0 || (!$scope.candidateBeforeMerge.expirence || !$scope.candidate2.expirence || ($scope.candidateBeforeMerge.expirence == $scope.candidate2.expirence))) && ($scope.src.employmentType != 0 || (!$scope.candidateBeforeMerge.employmentType || !$scope.candidate2.employmentType || ($scope.candidateBeforeMerge.employmentType == $scope.candidate2.employmentType))) && ($scope.src.currentWorkPlace != 0 || (!$scope.candidateBeforeMerge.currentWorkPlace || !$scope.candidate2.currentWorkPlace || ($scope.candidateBeforeMerge.currentWorkPlace == $scope.candidate2.currentWorkPlace))) && ($scope.src.currentPosition != 0 || (!$scope.candidateBeforeMerge.currentPosition || !$scope.candidate2.currentPosition || ($scope.candidateBeforeMerge.currentPosition == $scope.candidate2.currentPosition))) && ($scope.src.origin != 0 || (!$scope.candidateBeforeMerge.origin || !$scope.candidate2.origin || ($scope.candidateBeforeMerge.origin == $scope.candidate2.origin))) && ($scope.src.mphone != 0 || (!$scope.contacts.mphone || !$scope.contacts2.mphone || ($scope.contacts.mphone == $scope.contacts2.mphone))) && ($scope.src.email != 0 || (!$scope.contacts.email || !$scope.contacts2.email || ($scope.contacts.email == $scope.contacts2.email))) && ($scope.src.skype != 0 || (!$scope.contacts.skype || !$scope.contacts2.skype || ($scope.contacts.skype == $scope.contacts2.skype))) && ($scope.src.linkedin != 0 || (!$scope.contacts.linkedin || !$scope.contacts2.linkedin || ($scope.contacts.linkedin == $scope.contacts2.linkedin))) && ($scope.src.facebook != 0 || (!$scope.contacts.facebook || !$scope.contacts2.facebook || ($scope.contacts.facebook == $scope.contacts2.facebook))) && ($scope.src.googleplus != 0 || (!$scope.contacts.googleplus || !$scope.contacts2.googleplus || ($scope.contacts.googleplus == $scope.contacts2.googleplus))) && ($scope.src.github != 0 || (!$scope.contacts.github || !$scope.contacts2.github || ($scope.contacts.github == $scope.contacts2.github))) && ($scope.src.homepage != 0 || (!$scope.contacts.homepage || !$scope.contacts2.homepage || ($scope.contacts.homepage == $scope.contacts2.homepage))) && ($scope.src.skills != 0 || !($scope.candidateBeforeMerge.skills && $scope.candidateBeforeMerge.skills.length > 0) || !($scope.candidate2.skills && $scope.candidate2.skills.length > 0)) && ($scope.src.coreSkills != 0 || (!$scope.candidateBeforeMerge.coreSkills || !$scope.candidate2.coreSkills || ($scope.candidateBeforeMerge.coreSkills == $scope.candidate2.coreSkills))) && ($scope.src.descr != 0 || (!$scope.candidateBeforeMerge.descr || !$scope.candidate2.descr || ($scope.candidateBeforeMerge.descr == $scope.candidate2.descr))) &&
                $scope.candidateForm.$valid && salaryBol && !$scope.saveButtonIsPressed) {
                $scope.saveButtonIsPressed = true;
                var candidate = $scope.candidate;
                if ($scope.candidateBeforeMerge.files.length > 0) {
                    candidate.files = $scope.candidateBeforeMerge.files;
                    candidate.files = candidate.files.concat($scope.candidate2.files);
                }else if ($scope.candidate2.files.length > 0) {
                    candidate.files = $scope.candidate2.files;
                    candidate.files = candidate.files.concat($scope.candidateBeforeMerge.files);
                }
                if ($scope.candidateBeforeMerge.languages.length > 0 && !$scope.secondLanguages) {
                    candidate.languages = $scope.candidateBeforeMerge.languages;
                }else if ($scope.candidate2.languages.length > 0) {
                    candidate.languages = $scope.candidate2.languages;
                }
                //if ($scope.candidateBeforeMerge.fieldValues.length > 0 && !$scope.secondCustomFields && $scope.fieldValueFirstValue) {
                //    candidate.fieldValues = $scope.candidateBeforeMerge.fieldValues;
                //}else if ($scope.candidate2.fieldValues.length > 0 && $scope.candidate2.fieldValues && $scope.fieldValueSecondValue) {
                //    candidate.fieldValues = $scope.candidate2.fieldValues;
                //}
                if ($scope.candidateBeforeMerge.employmentType != undefined && $scope.candidateBeforeMerge.employmentType.length > 0) {
                    candidate.employmentType = $scope.candidateBeforeMerge.employmentType;
                }else if ($scope.candidate2.employmentType) {
                    candidate.employmentType = $scope.candidate2.employmentType;
                }
                if ($scope.candidateBeforeMerge.salary && !$scope.secondSalary) {
                    candidate.salary = $scope.candidateBeforeMerge.salary;
                    candidate.currency = $scope.candidateBeforeMerge.currency;
                }else if ($scope.candidate2.salary) {
                    candidate.salary = $scope.candidate2.salary;
                    candidate.currency = $scope.candidate2.currency;
                }
                if ($scope.candidateBeforeMerge.position && !$scope.secondPosition) {
                    candidate.position = $scope.candidateBeforeMerge.position;
                }else if ($scope.candidate2.position) {
                    candidate.position = $scope.candidate2.position;
                }
                if ($scope.candidateBeforeMerge.education && !$scope.secondEducation) {
                    candidate.education = $scope.candidateBeforeMerge.education;
                }else if ($scope.candidate2.education) {
                    candidate.education = $scope.candidate2.education;
                }
                if ($scope.candidate.source) {
                    candidate.source = $scope.candidate.source;
                }
                if ($scope.candidate.photo) {
                    candidate.photo = $scope.candidate.photo;
                }
                candidate.contacts = [];
                if ($scope.contacts.email && !$scope.secondEmail) {
                    candidate.contacts.push({type: "email", value: $scope.contacts.email});
                }else if ($scope.contacts2.email) {
                    candidate.contacts.push({type: "email", value: $scope.contacts2.email});
                }
                if ($scope.contacts.mphone && !$scope.secondMphone) {
                    candidate.contacts.push({type: "mphone", value: $scope.contacts.mphone});
                }else if ($scope.contacts2.mphone) {
                    candidate.contacts.push({type: "mphone", value: $scope.contacts2.mphone});
                }
                if ($scope.contacts.skype && !$scope.secondSkype) {
                    candidate.contacts.push({type: "skype", value: $scope.contacts.skype});
                }else if($scope.contacts2.skype){
                    candidate.contacts.push({type: "skype", value: $scope.contacts2.skype});
                }
                if ($scope.contacts.linkedin && !$scope.secondLinkedin) {
                    candidate.contacts.push({type: "linkedin", value: $scope.contacts.linkedin});
                }else if($scope.contacts2.linkedin){
                    candidate.contacts.push({type: "linkedin", value: $scope.contacts2.linkedin});
                }
                if ($scope.contacts.facebook && !$scope.secondFacebook) {
                    candidate.contacts.push({type: "facebook", value: $scope.contacts.facebook});
                }else if($scope.contacts2.facebook){
                    candidate.contacts.push({type: "facebook", value: $scope.contacts2.facebook});
                }
                if ($scope.contacts.googleplus && !$scope.secondGoogleplus) {
                    candidate.contacts.push({type: "googleplus", value: $scope.contacts.googleplus});
                }else if($scope.contacts2.googleplus){
                    candidate.contacts.push({type: "googleplus", value: $scope.contacts2.googleplus});
                }
                if ($scope.contacts.github && !$scope.secondGithub) {
                    candidate.contacts.push({type: "github", value: $scope.contacts.github});
                }else if($scope.contacts2.github){
                    candidate.contacts.push({type: "github", value: $scope.contacts2.github});
                }
                if ($scope.contacts.homepage && !$scope.secondHomepage) {
                    candidate.contacts.push({type: "homepage", value: $scope.contacts.homepage});
                }else if($scope.contacts2.homepage){
                    candidate.contacts.push({type: "homepage", value: $scope.contacts2.homepage});
                }
                //if ($("#pac-input").val().length == 0) {
                //    candidate.region = null;
                //} else if ($("#pac-input").val().length > 0 && (candidate.region == undefined || $("#pac-input").val() != candidate.region.fullName)) {
                //    if ($scope.region)
                //        candidate.region = $scope.region;
                //}
                if ($scope.candidateBeforeMerge.skills.length > 0 && !$scope.secondSkills) {
                    candidate.skills = $scope.candidateBeforeMerge.skills;
                }else if ($scope.candidate2.skills.length > 0) {
                    candidate.skills = $scope.candidate2.skills;
                }
                if ($scope.candidateBeforeMerge.region != undefined && !$scope.secondRegion) {
                    candidate.region = $scope.candidateBeforeMerge.region;
                }else if ($scope.candidate2.region != undefined) {
                    candidate.region = $scope.candidate2.region;
                }
                if ($scope.candidateBeforeMerge.db && !$scope.secondDb) {
                    candidate.db = $scope.candidateBeforeMerge.db;
                }else if ($scope.candidate2.db) {
                    candidate.db = $scope.candidate2.db;
                }
                //candidate.db = $('.datepickerOfBirth').datetimepicker('getDate') != null ? $('.datepickerOfBirth').datetimepicker('getDate').getTime() : null;
                deleteUnnecessaryFields(candidate, $rootScope);
                candidate.relatedRegions = $scope.regionToRelocate;
                //candidate.origin = $scope.getOriginAutocompleterValue();
                if ($scope.candidateBeforeMerge.relatedRegions != undefined && $scope.candidateBeforeMerge.relatedRegions.length > 0 && !$scope.secondRelatedRegions) {
                    candidate.relatedRegions = $scope.candidateBeforeMerge.relatedRegions;
                }else if ($scope.candidate2.relatedRegions) {
                    candidate.relatedRegions = $scope.candidate2.relatedRegions;
                }
                if ($scope.candidateBeforeMerge.expirence && !$scope.secondExpirence) {
                    candidate.expirence = $scope.candidateBeforeMerge.expirence;
                }else if ($scope.candidate2.expirence) {
                    candidate.expirence = $scope.candidate2.expirence;
                }
                if ($scope.candidateBeforeMerge.industry && !$scope.secondIndustry) {
                    candidate.industry = $scope.candidateBeforeMerge.industry;
                }else if ($scope.candidate2.industry) {
                    candidate.industry = $scope.candidate2.industry;
                }
                if ($scope.candidateBeforeMerge.currentPosition && !$scope.secondCurrentPosition) {
                    candidate.currentPosition = $scope.candidateBeforeMerge.currentPosition;
                }else if ($scope.candidate2.currentPosition) {
                    candidate.currentPosition = $scope.candidate2.currentPosition;
                }
                if ($scope.candidateBeforeMerge.currentWorkPlace && !$scope.secondCurrentWorkPlace) {
                    candidate.currentWorkPlace = $scope.candidateBeforeMerge.currentWorkPlace;
                }else if ($scope.candidate2.currentWorkPlace) {
                    candidate.currentWorkPlace = $scope.candidate2.currentWorkPlace;
                }
                if ($scope.candidateBeforeMerge.origin && !$scope.secondOrigin) {
                    candidate.origin = $scope.candidateBeforeMerge.origin;
                }else if ($scope.candidate2.origin) {
                    candidate.origin = $scope.candidate2.origin;
                }
                if ($scope.candidateBeforeMerge.coreSkills && !$scope.secondCoreSkills) {
                    candidate.coreSkills = $scope.candidateBeforeMerge.coreSkills;
                }else if ($scope.candidate2.coreSkills) {
                    candidate.coreSkills = $scope.candidate2.coreSkills;
                }
                if ($scope.candidateBeforeMerge.descr && !$scope.secondDescr) {
                    candidate.descr = $scope.candidateBeforeMerge.descr;
                }else if ($scope.candidate2.descr) {
                    candidate.descr = $scope.candidate2.descr;
                }
                if ($scope.candidateBeforeMerge.sex == undefined) {
                    candidate.sex = $scope.candidate2.sex;
                }
                var mergeData  = $scope.candidate2.candidateId;
                console.log(candidate);
                $http.put(
                    serverAddress + '/candidate/' + 'mergeCandidates?duplicateId=' + mergeData, candidate
                ).then(function (val) {
                    console.log(val);
                    if (angular.equals(val.data.status, "ok")) {
                        notificationService.success($filter('translate')('You successfully merged candidates’ profiles'));
                        CacheCandidates.update(val.data.object);
                        if ($scope.linksForSave.length > 0) {
                            angular.forEach($scope.linksForSave, function(valI, i) {
                                Candidate.addLink({
                                    "url": valI.url,
                                    "candidateId": val.data.object.candidateId,
                                    "name": valI.fileName
                                }, function(resp) {
                                });
                                if ($scope.linksForSave.length - 1 == i) {
                                    $location.path("/candidates/" + val.data.object.localId);
                                }
                            });
                        } else {
                            $location.path("/candidates/" + val.data.object.localId);
                        }

                        $location.path("/candidates/" + val.data.object.localId);
                    } else {
                        $scope.saveButtonIsPressed = false;
                        $scope.errorMessage.show = true;
                        $scope.errorMessage.message = val.data.message;
                    }
                    $localStorage.remove("candidateForMerge");
                }, function (error) {
                    $scope.saveButtonIsPressed = false;
                });

            } else {
                //$scope.candidateForm.name.$pristine = false;
                //$scope.candidateForm.position.$pristine = false;
                $('.fullName').css('border', '1px solid red');
                $('.salary').css('border', '1px solid red');
                $('.education').css('border', '1px solid red');
                $('.languages').css('border', '1px solid red');
                $('.fieldValues').css('border', '1px solid red');
                $('.region').css('border', '1px solid red');
                $('.position').css('border', '1px solid red');
                $('.industry').css('border', '1px solid red');
                $('.expirence').css('border', '1px solid red');
                $('.employmentType').css('border', '1px solid red');
                $('.currentWorkPlace').css('border', '1px solid red');
                $('.currentPosition').css('border', '1px solid red');
                $('.origin').css('border', '1px solid red');
                $('.mphone').css('border', '1px solid red');
                $('.email').css('border', '1px solid red');
                $('.skype').css('border', '1px solid red');
                $('.linkedin').css('border', '1px solid red');
                $('.facebook').css('border', '1px solid red');
                $('.googleplus').css('border', '1px solid red');
                $('.github').css('border', '1px solid red');
                $('.homepage').css('border', '1px solid red');
                $('.skills').css('border', '1px solid red');
                $('.coreSkills').css('border', '1px solid red');
                $('.descr').css('border', '1px solid red');
                notificationService.error($filter('translate')('Choose fields for Merge'));
                $('html, body').animate({scrollTop: 0}, 'fast');
                //$scope.candidateForm.salary.$pristine = false;
                //$scope.candidateForm.education.$pristine = false;
                //$scope.candidateForm.currentWorkPlace.$pristine = false;
                //$scope.candidateForm.currentPosition.$pristine = false;
            }
        };

        $scope.checkDuplicatesByName = function() {
            Candidate.checkDuplicatesByName($scope);
        };

        $scope.removeLink = function(id) {
            angular.forEach($scope.linksForSave, function(val, ind) {
                console.log(val);
                if (val.fileName === id) {
                    $scope.linksForSave.splice(ind, 1);
                }
            });
        };

        $scope.showAddLinkFunc = function(){
            $scope.showAddLink = true;
        };
        $scope.closeAddLinkFunc = function(){
            $scope.showAddLink = false;
            $scope.addLinkToCandidate.name = null;
            $scope.addLinkToCandidate.url = null;
            $scope.addLinkErrorShow = false;
        };
        $scope.addLinkInCandidateStart = function(){
            if($scope.addLinkToCandidate.name && $scope.addLinkToCandidate.url){
                Candidate.addLink({
                    "url": $scope.addLinkToCandidate.url,
                    "candidateId": $scope.candidate.candidateId,
                    "name": $scope.addLinkToCandidate.name
                }, function(resp) {
                    if(resp.status == 'ok'){
                        $scope.updateCandidate();
                        notificationService.success($filter('translate')('history_info.added_link'));
                    }else{
                        notificationService.error($filter('translate')(resp.message));
                    }
                });
                //$scope.linksForSave.push({"url": $scope.addLinkToCandidate.url, "fileName": $scope.addLinkToCandidate.name});
                $scope.addLinkToCandidate.name = '';
                $scope.addLinkToCandidate.url = '';
                $scope.showAddLink = false;
            } else{
                $scope.addLinkErrorShow = true;
            }
        };
        $scope.changeRating = function(skill,rating){
            skill.level = rating;
        };
        $scope.deleteSkill = function(skill){
            $scope.candidate.skills.splice($scope.candidate.skills.indexOf(skill), 1);
        };
        $scope.showModalConfirmationResumeUpdate = function(){
            $('.confirmationResumeUpdate.modal').modal('show');
        };
        $rootScope.changeSearchType = function(param){
            $window.location.replace('/!#/candidates');
            $rootScope.changeSearchTypeNotFromCandidates = param;
        }
    }]);
