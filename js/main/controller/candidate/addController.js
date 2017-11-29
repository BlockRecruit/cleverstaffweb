controller.controller('CandidateAddController', ["$rootScope", "$http", "$scope", "$translate", "FileInit", "$location", "Service", "Candidate", "notificationService", "$filter",
    "$localStorage", "$cookies", "$window", "serverAddress","$routeParams", "$uibModal", "CustomField",
    function($rootScope, $http, $scope, $translate, FileInit, $location, Service, Candidate, notificationService, $filter, $localStorage,
             $cookies, $window, serverAddress,$routeParams, $uibModal, CustomField) {
    Service.toAddCandidate("/candidates/");


    $scope.serverAddress = serverAddress;
    $scope.type = "add";
    $scope.objType = 'candidate';
    $scope.candidate = {};
    $scope.addedFromResume = false;
    $scope.addLinkErrorShow = false;
    $scope.showAddedLinks = false;
    $scope.showAddedFiles = false;
    $scope.showAddLink = false;
    $scope.currency = Service.currency();
    $scope.industries = Service.getIndustries();
    $scope.experience = Service.experience();
    $scope.lang = Service.lang();
    $scope.googleMapOption = false;
    $location.hash('');
    $scope.regionToRelocate = [];
    $scope.duplicatesByEmail = [];
    $scope.duplicatesByPhone = [];
    $scope.duplicatesBySkype = [];
    $scope.duplicatesByLinkedin = [];
    $scope.candidate = {
        customFields: [{
            fieldValue: {
                objType: "candidate",
                fieldValueId: '',
                value: '',
                field : {
                    fieldId: ''
                }
            }
        }]
    };
    $scope.showResumeFromLinkSiteErrorFlag = false;
    $scope.showResumeFromLinkErrorFlag = false;
    $scope.saveButtonIsPressed = false;
    // $scope.candidate.fieldValues = [];
        $scope.getFullCustomFields = function(){
            CustomField.getFullFields({
                objectType: 'candidate'
            }, function(resp) {
                if (resp.status == "ok") {
                    $scope.allObjCustomField = resp.objects;
                } else {
                    notificationService.error(resp.message);
                }
            });
        };

        $scope.getFullCustomFields();

        setTimeout(function(){
            if(!$rootScope.resumeToSave && !$rootScope.resumeFromText && !$rootScope.resumeFromLink) {
                $scope.addedFromResume = true;
            }
            if($rootScope.resumeToSave){
                Candidate.convert($scope, $rootScope.resumeToSave.data.object);
                if ($rootScope.resumeToSave.data.object.position) {
                    $scope.setPositionAutocompleterValue($rootScope.resumeToSave.data.object.position);
                }
                $scope.candidate.source = 'cvfile';
                $scope.callbackFile($rootScope.resumeToSave.data.objects[0],  $rootScope.file.filename);
                $rootScope.resumeToSave = undefined;
                $rootScope.file = undefined;
            }
            if($rootScope.resumeFromText){
                Candidate.convert($scope, $rootScope.resumeFromText);
                if ($rootScope.resumeFromText.position) {
                    $scope.setPositionAutocompleterValue($rootScope.resumeFromText.position);
                }
                $rootScope.fastCandResumeText = undefined;
                $rootScope.resumeFromText = undefined;
            }
            if($rootScope.resumeFromLink){
                Candidate.convert($scope, $rootScope.resumeFromLink);
                if (res.object.employmentType != undefined) {
                    $scope.setSelect2EmploymentType(res.object.employmentType.split(", "));
                }
                if (res.object.position) {
                    $scope.setPositionAutocompleterValue(res.object.position);
                }
                $rootScope.resumeFromLink = undefined;
                $rootScope.fastCandResumeLinkSite = undefined;
            }
        },0);

    $scope.addLinkToCandidate = {
        name: '',
        url: ''
    };

    $scope.deleteRegion2ToRelocate = function(index) {
        $scope.regionToRelocate.splice(index, 1);
    };

    $scope.contacts = {
        skype: "",
        mphone: "",
        email: "",
        linkedin: "",
        facebook: "",
        googleplus: "",
        homepage: ""
    };

    $scope.map = {
        center: {
            latitude: 48.379433,
            longitude: 31.165579999999977
        },
        zoom: 6,
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

    $scope.showResumeError =function(){
        $scope.showResumeFromLinkSiteErrorFlag = true;
    };
    $scope.showResumeLinkError =function(){
        $scope.showResumeFromLinkErrorFlag = true;
    };

    $scope.getPlugin = function () {
        if (navigator.saysWho.indexOf("Chrome") != -1) {
            $window.open("https://chrome.google.com/webstore/detail/cleverstaff-extension/komohkkfnbgjojbglkikdfbkjpefkjem");
        } else if (navigator.saysWho.indexOf("Firefox") != -1) {
            //$window.open("https://addons.mozilla.org/firefox/addon/cleverstaff_extension");
            $window.open("/extension/CleverstaffExtension4Firefox.xpi");
        } else {
            $("#bad-browser-modal").modal("show");
        }
    };
    $scope.getBrowser = function () {
        if (navigator.saysWho.indexOf("Chrome") != -1) {
            $scope.resumeBrowser = "Chrome";
        } else if (navigator.saysWho.indexOf("Firefox") != -1) {
            $scope.resumeBrowser = "Firefox";
        } else {
            $scope.resumeBrowser = $filter("translate")("browser");
        }
    };
    $scope.getBrowser();
    $scope.fromLinkSite = function(value) {
        var link;
        if ($("#fastCandResumeLinkSite").val()) {
            link = $("#fastCandResumeLinkSite").val();
        } else if (value) {
            link = value;
            $scope.fastCandResumeLinkSite = value;
        }
        if ($scope.fastCandResumeLinkSite === undefined && (link.indexOf('http://') === -1 || link.indexOf('https://') === -1 || link.indexOf('ftp://') === -1)) {
            $scope.fastCandResumeLinkSite = 'http://' + link;
        }
        if ($scope.fastCandResumeLinkSite !== undefined) {
            if ($scope.fastCandResumeLinkSite.indexOf("docs.google.com") === -1 && $scope.fastCandResumeLinkSite.indexOf("drive.google.com") === -1) {
                if ($scope.fastCandResumeLinkSite.indexOf("linkedin.com/profile/view") === -1) {
                    $scope.fastCandLoading = true;
                    Candidate.fromLinkSite({url: $scope.fastCandResumeLinkSite}, function(res) {
                        if (angular.equals(res.status, "ok")) {
                            Candidate.convert($scope, res.object);
                            if (res.object.employmentType != undefined) {
                                $scope.setSelect2EmploymentType(res.object.employmentType.split(", "));
                            }
                            if (res.object.position) {
                                $scope.setPositionAutocompleterValue(res.object.position);
                            }
                        } else if (angular.equals(res.status, "error")) {
                            notificationService.error(res.message);
                        } else {
                            //notificationService.error($filter('translate')('service temporarily unvailable'));
                        }
                        $scope.fastCandLoading = false;
                    }, function(val) {
                        //notificationService.error($filter('translate')('service temporarily unvailable'));
                        $scope.fastCandLoading = false;
                    });
                } else {
                    notificationService.error($filter('translate')('Incorrect link of LinkedinIn public profile. You can get correct link at the Contact Info.'));
                }
            }else {
                notificationService.error($filter('translate')('Candidate data will be uploaded incorrectly if you use Google Drive links. Please upload resumes from your PC/Mac after you save them from Google Drive.'));
            }

        } else {
            notificationService.error($filter('translate')('Enter a valid url'));
        }
    };
        $scope.imgWidthFunc = function(){
            var width = $('#page-avatar')[0].naturalWidth;
            var height = $('#page-avatar')[0].naturalHeight;
            var minus = width - height;
            if(width >= height && minus > 40 && minus <=100){
                $('#page-avatar').css({'width': '100%', 'height': 'auto', 'margin': 'inherit'});
            }else if(width >= 300 && width <= 349 && width != height){
                $('#page-avatar').css({'width': '100%', 'height': '385px', 'margin': 'inherit'});
            }else if(width >= 350){
                $('#page-avatar').css({'width': '100%', 'height': 'auto', 'margin': 'inherit'});
            }else{
                $('#page-avatar').css({'width': 'inherit', 'height': 'inherit', 'display': 'block', 'margin': '0 auto'});
            }
        };
    $scope.callbackAddPhoto = function(photo) {
        $scope.candidate.photo = photo;
        $scope.photoLink = $scope.serverAddress + "/getapp?id=" + photo + "&d=true";
        $scope.imgWidthFunc();
        Candidate.progressUpdate($scope, true);
        $rootScope.closeModal();
    };
    FileInit.addPhotoByReference($scope, $rootScope, $scope.callbackAddPhoto);
    if ($rootScope.candidateExternalLink) {
        $scope.fromLinkSite($rootScope.candidateExternalLink);
        $rootScope.candidateExternalLink = null;
    } else if ($localStorage.isExist("candidateForSave")) {
        $scope.candidate = angular.fromJson($localStorage.get("candidateForSave"));
        if ($scope.candidate.photoUrl) {
            $scope.photoUrl = $scope.candidate.photoUrl;
            $scope.addPhotoByReference();
        }
        $localStorage.remove("candidateForSave");
        if ($scope.candidate.db) {
            $scope.data = new Date($scope.candidate.db);
        }
        $scope.candidate.db = null;
        if ($scope.candidate.contacts) {
            angular.forEach($scope.candidate.contacts, function(val) {
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
        $scope.candidate.contacts = null;
    } else {
        $scope.candidate = {
            status: "active_search",
            relatedRegions: null,
            skills: []
        };

    }

    $scope.errorMessage = {
        show: false,
        message: ""
    };
    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '1930:-0',
        initialDate: "01/01/1990"
    };
    $scope.fileForSave = [];
    $scope.linksForSave = [];


    FileInit.initCandFileOption($scope, "", "", false);
    $scope.callbackFile = function(resp, names) {
        $scope.fileForSave.push({"attId": resp, "fileName": names});
    };

    $scope.removeFile = function(id) {
        angular.forEach($scope.fileForSave, function(val, ind) {
            if (val.attId === id) {
                $scope.fileForSave.splice(ind, 1);
            }
        });
        $scope.progressUpdate();
    };
    $scope.removeLink = function(id) {
        angular.forEach($scope.linksForSave, function(val, ind) {
            if (val.fileName === id) {
                $scope.linksForSave.splice(ind, 1);
            }
        });
        $scope.progressUpdate();
    };
        $('.datepickerOfBirth').datetimepicker({
            format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
            startView: 4,
            minView: 2,
            autoclose: true,
            language: $translate.use(),
            weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
            initialDate:  new Date(1167609600000),
            startDate: new Date(-1262304000000),
            endDate: new Date(1199134800000)
        });

    $scope.status = Candidate.getStatus();
    $scope.employmentType = Service.employmentType();

    $scope.cancel = function() {
        $location.path("/candidates/");
    };

    $scope.progressUpdate = function() {
        Candidate.progressUpdate($scope, true);
    };

    $rootScope.addPhoto = function() {
        $('#photoFile').click();
    };

    $scope.callbackErr = function(err) {
        notificationService.error(err);
    };
    Candidate.setPhoto($scope);
    Candidate.fromFile($scope,$rootScope, $location);

    $scope.removePhoto = function() {
        $scope.candidate.photo = "";
        $scope.progressUpdate();
    };
        $scope.candidate.fieldValues = [];
        $scope.editCustomField = function(text, id) {
            $scope.candidate.fieldValues.push({
                objType: "candidate",
                value: text,
                field: {
                    fieldId: id
                }
            });
        };
        $scope.editCustomField = function (e, id) {
            $scope.editCustomValue = e.currentTarget.value;
            $scope.editCustomId = id;
        };
        $scope.addCustomFieldParams = function (text, id) {
            $scope.candidate.fieldValues.push({
                objType: "candidate",
                value: text,
                field: {
                    fieldId: id
                }
            });
        };

        $scope.sendCustomFieldId = function (id) {
            $scope.editCustomId = id;
        };

        $scope.roundMinutes = function(date) {
            var date2 = new Date();

            angular.copy(date, date2);

            date2.setHours(date2.getHours() - 3 + Math.round(date2.getMinutes()/60));
            date2.setMinutes(0);

            return date2;
        };

        if ($scope.candidate.fieldValues) {
            angular.forEach($scope.candidate.fieldValues, function (val) {
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
        $scope.addedLang = [];
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
    $scope.saveCandidate = function() {
        $localStorage.set("candidate_currency", $scope.candidate.currency);
        var salaryBol = true;
        $scope.candidate.position=$scope.getPositionAutocompleterValue();
        if ($scope.candidate.salary != undefined && $scope.candidate.salary != "" && /[^[0-9]/.test($scope.candidate.salary)) {
            $scope.errorMessage.show = true;
            $scope.errorMessage.message = $filter("translate")("desired_salary_should_contains_only_numbers");
            salaryBol = false;
        }
        if ($scope.candidateForm.$valid && salaryBol && !$scope.saveButtonIsPressed) {
            $scope.saveButtonIsPressed = true;
            var candidate = $scope.candidate;
            candidate.languages = [];
            if($scope.addedLang != undefined){
                angular.forEach($scope.addedLang, function (val) {
                    if(val.level != undefined && val.level != ''){
                        candidate.languages.push({ name: val.text, level: val.level});
                    }
                });
            }
            candidate.employmentType = $scope.getSelect2EmploymentType();
            if ($scope.candidate.photo) {
                candidate.photo = $scope.candidate.photo;
            }
            candidate.contacts = [];
            if ($scope.contacts.email) {
                candidate.contacts.push({type: "email", value: $scope.contacts.email});
            }
            if ($scope.contacts.mphone) {
                candidate.contacts.push({type: "mphone", value: $scope.contacts.mphone});
            }
            if ($scope.contacts.skype) {
                candidate.contacts.push({type: "skype", value: $scope.contacts.skype});
            }
            if ($scope.contacts.linkedin) {
                candidate.contacts.push({type: "linkedin", value: $scope.contacts.linkedin});
            }
            if ($scope.contacts.facebook) {
                candidate.contacts.push({type: "facebook", value: $scope.contacts.facebook});
            }
            if ($scope.contacts.googleplus) {
                candidate.contacts.push({type: "googleplus", value: $scope.contacts.googleplus});
            }
            if ($scope.contacts.github) {
                candidate.contacts.push({type: "github", value: $scope.contacts.github});
            }
            if ($scope.contacts.homepage) {
                candidate.contacts.push({type: "homepage", value: $scope.contacts.homepage});
            }
            if ($("#pac-input").val().length == 0) {
                candidate.region = null;
            } else if ($("#pac-input").val().length > 0) {
                candidate.region = $scope.region;
            }


            candidate.db = $('.datepickerOfBirth').datetimepicker('getDate') != null ? $('.datepickerOfBirth').datetimepicker('getDate').getTime() : null;
            candidate.relatedRegions = $scope.regionToRelocate;
            candidate.origin = $scope.getOriginAutocompleterValue();
            deleteUnnecessaryFields(candidate);
            Candidate.add(candidate, function(val) {
                if (angular.equals(val.status, "ok")) {
                    $scope.saveButtonIsPressed = false;
                    notificationService.success($filter('translate')('Candidate saved'));
                    if ($scope.fileForSave.length > 0) {
                        angular.forEach($scope.fileForSave, function(valI, i) {
                            Candidate.addFile({
                                "attId": valI.attId,
                                "candidateId": val.object.candidateId,
                                "fileName": valI.fileName
                            }, function(resp) {
                            });
                            if ($scope.fileForSave.length - 1 == i) {
                                $location.path("/candidates/" + val.object.localId);
                            }
                        });
                    } else {
                        $location.path("/candidates/" + val.object.localId);
                    }
                    if ($scope.linksForSave.length > 0) {
                        angular.forEach($scope.linksForSave, function(valI, i) {
                            Candidate.addLink({
                                "url": valI.url,
                                "candidateId": val.object.candidateId,
                                "name": valI.fileName
                            }, function(resp) {
                            });
                            if ($scope.linksForSave.length - 1 == i) {
                                $location.path("/candidates/" + val.object.localId);
                            }
                        });
                    } else {
                        $location.path("/candidates/" + val.object.localId);
                    }


                } else {
                    $scope.saveButtonIsPressed = false;
                    $scope.errorMessage.show = true;
                    $scope.errorMessage.message = val.message;
                }
            }, function() {
                $scope.saveButtonIsPressed = false;
                //notificationService.error($filter('translate')('service temporarily unvailable'));
                $localStorage.set("candidateForSave", candidate);
                $cookies.url = $location.$$url;
                $cookies.cfauth = 'false';
                $window.location.replace('/');
            });
        } else {
            $scope.candidateForm.name.$pristine = false;
            $('html, body').animate({scrollTop: 0}, 'fast');
            $scope.candidateForm.position.$pristine = false;
            $scope.candidateForm.salary.$pristine = false;
        }
    };
    $scope.checkDuplicatesByNameAndContacts = function() {
        Candidate.checkDuplicatesByNameAndContacts($scope);
    };
    //$scope.checkDuplicatesByEmail = function() {
    //    Candidate.checkDuplicatesByEmail($scope);
    //};
    //$scope.checkDuplicatesByPhone = function() {
    //    Candidate.checkDuplicatesByPhone($scope);
    //};
    //$scope.checkDuplicatesByName = function() {
    //    Candidate.checkDuplicatesByName($scope);
    //};
    //$scope.checkDuplicatesBySkype = function() {
    //    Candidate.checkDuplicatesBySkype($scope);
    //};
    //$scope.checkDuplicatesByLinkedin = function() {
    //    Candidate.checkDuplicatesByLinkedin($scope);
    //};
    $('.ui.dropdown').dropdown();

    $('#pac-input').blur(function() {
        if (!$(this).val()) {
            $scope.progressUpdate();
        }
    });

    $scope.fromLinkFile = function() {
        if ($scope.fastCandResumeLinkFile !== undefined) {
            $scope.fastCandLoading = true;
            Candidate.fromLinkFile({url: $scope.fastCandResumeLinkFile}, function(res) {
                if (angular.equals(res.status, "ok")) {
                    Candidate.convert($scope, res.object);
                    if (res.object.position) {
                        $scope.setPositionAutocompleterValue(res.object.position);
                    }
                } else if (angular.equals(res.status, "error")) {
                    notificationService.error(res.message);
                } else {
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                }
                $scope.fastCandLoading = false;
            }, function(val) {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
                $scope.fastCandLoading = false;
            });
        } else {
            notificationService.error($filter('translate')('Enter a valid url'));
        }
    };


    $scope.fromText = function() {
        $scope.fastCandLoading = true;
        Candidate.fromText({text: $scope.fastCandResumeText}, function(res) {
            if (angular.equals(res.status, "ok")) {
                Candidate.convert($scope, res.object);
                if (res.object.position) {
                    $scope.setPositionAutocompleterValue(res.object.position);
                }
            } else if (angular.equals(res.status, "error")) {
                notificationService.error(res.message);
            } else {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            }
            $scope.fastCandLoading = false;
        }, function(val) {
            //notificationService.error($filter('translate')('service temporarily unvailable'));
            $scope.fastCandLoading = false;
        });
    };

    $scope.fastCandResumeClick = function() {
        if ($scope.fastCandResume) {
            $scope.fastCandResume = false;
            $scope.imgWidthFunc();
        } else {
            $scope.fastCandResume = true;
            $scope.fastCandText = false;
            $scope.fastCandSite = false;
        }

    };
    $scope.fastCandTextClick = function() {
        if ($scope.fastCandText) {
            $scope.fastCandText = false;
        } else {
            $scope.fastCandResume = false;
            $scope.fastCandText = true;
            $scope.fastCandSite = false;
        }
    };
    $scope.fastCandSiteClick = function() {
        if ($scope.fastCandSite) {
            $scope.fastCandSite = false;
        } else {
            $scope.fastCandResume = false;
            $scope.fastCandText = false;
            $scope.fastCandSite = true;
        }
    };
    $scope.langs = Candidate.getLangInOrg(function (resp){
        if(resp.object){
            //resp.object.splice(0, 1);
            $scope.setLangs(resp.object);
        } else {
            $scope.setLangs([]);
        }
    });


    if ($localStorage.isExist("candidate_currency")) {
        $scope.candidate.currency = $localStorage.get("candidate_currency");
    } else {
        $scope.candidate.currency = "USD";
    }
    Candidate.ZIP($scope);

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
            $scope.linksForSave.push({"url": $scope.addLinkToCandidate.url, "fileName": $scope.addLinkToCandidate.name});
            $scope.addLinkToCandidate.name = '';
            $scope.addLinkToCandidate.url = '';
            $scope.showAddLink = false;
        } else{
            $scope.addLinkErrorShow = true;
        }
    };

    $scope.editOriginName = function () {
        $scope.originOldName = $scope.getOriginAutocompleterValue();
        $rootScope.originName = $scope.originOldName;
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '../partials/modal/origin-name-edit.html',
            size: '',
            resolve: {

            }
        });
    };
    $rootScope.saveOriginName = function () {
        Candidate.editOriginAll({originOld: $scope.originOldName, originNew: $rootScope.originName}, function (resp) {
            if(resp.status == "ok") {
                notificationService.success($filter('translate')('Origin_name_saved'));
            }
        });
        $scope.setOriginAutocompleterValue($rootScope.originName);
        $rootScope.closeModal();
    };

    $scope.changeRating = function(skill,rating){
        skill.level = rating;
    };
    $scope.deleteSkill = function(skill){
        $scope.candidate.skills.splice($scope.candidate.skills.indexOf(skill), 1);
    };

    $scope.resetBirthDate = function () {
        $('.datepickerOfBirth').val('');
    };

    $scope.showModalAddPhoto = function(){
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '../partials/modal/add-photo-candidate.html',
            size: '',
            resolve: function(){

            }
        });
    };

        $scope.deleteDate = function(id){
            angular.forEach($('.editDate'), function (nval) {
                if (id == nval.name) {
                    nval.placeholder = '';
                    nval.value = '';
                }
            });
        };

    $rootScope.closeModal = function(){
        $scope.modalInstance.close();
    };
    $rootScope.changeSearchType = function(param){
        $window.location.replace('/!#/candidates');
        $rootScope.changeSearchTypeNotFromCandidates = param;
    }
}]);
