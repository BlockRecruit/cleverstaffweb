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
        $scope.contacts = {skype: "", mphone: "", email: ""};
        $scope.contacts2 = {skype: "", mphone: "", email: ""};
        $scope.src = {salary: '1', education: '1', fullName: '1', education: '1', coreSkills: '1'};
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
            //console.log(resp);
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
                    $scope.objectId = $scope.candidate.candidateId;
                    if(resp.object.languages!=undefined){
                        $scope.setSelect2Lang(resp.object.languages.split(","));
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
                    // if (resp.object.region != undefined && resp.object.region.lat != undefined && resp.object.region.lng != undefined) {
                    //     $scope.region = resp.object.region;
                    //     $scope.map.center.latitude = resp.object.region.lat;
                    //     $scope.map.center.longitude = resp.object.region.lng;
                    //     $scope.marker.coords.latitude = resp.object.region.lat;
                    //     $scope.marker.coords.longitude = resp.object.region.lng;
                    //
                    //     $scope.regionInput = resp.object.region.displayFullName;
                    //     $('#pac-input').val(resp.object.region.displayFullName);
                    //
                    // }
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
                    // if(resp.object.languages!=undefined){
                    //     $scope.setSelect2Lang(resp.object.languages.split(","));
                    // }

                    // if (resp.object.employmentType != undefined) {
                    //     $scope.setSelect2EmploymentType(resp.object.employmentType.split(","));
                    // }
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
                } else {
                    notificationService.error($filter('translate')('candidate not found'));
                    $location.path('/candidates');
                }
            }, function(err) {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });
        };
        $scope.updateCandidate2();

        $scope.selectSource = function (src, isContact, type) {
            var sourceForRegion = function () {
                var source;
                if(src == '1') {
                    source = $scope.candidateBeforeMerge;
                } else if(src == '2') {
                    source = $scope.candidate2;
                } else {
                    $scope.candidate.region = undefined;
                    source = $scope.candidate;
                }
                if (source.region != undefined && source.region.lat != undefined && source.region.lng != undefined) {
                    $scope.region = source.region;
                    $scope.map.center.latitude = source.region.lat;
                    $scope.map.center.longitude = source.region.lng;
                    $scope.marker.coords.latitude = source.region.lat;
                    $scope.marker.coords.longitude = source.region.lng;

                    $scope.regionInput = source.region.displayFullName;
                    $('#pac-input').val(source.region.displayFullName);
                }else {
                    $scope.region = undefined;
                    $scope.map.center.latitude = undefined;
                    $scope.map.center.longitude = undefined;
                    $scope.marker.coords.latitude = undefined;
                    $scope.marker.coords.longitude = undefined;

                    $scope.regionInput = undefined;
                    $('#pac-input').val(undefined);
                }
            };
            var sourceForLanguage = function () {
                if(src === '1') {
                    if($scope.candidateBeforeMerge.languages !== undefined){
                        $scope.setSelect2Lang($scope.candidateBeforeMerge.languages.split(","));
                    }else {
                        $scope.setSelect2Lang($scope.candidateBeforeMerge.languages);
                    }
                }else if(src === '2') {
                    if($scope.candidate2.languages !== undefined){
                        $scope.setSelect2Lang($scope.candidate2.languages.split(","));
                    }else {
                        $scope.setSelect2Lang($scope.candidate2.languages);
                    }
                } else {
                    $scope.setSelect2Lang(undefined);
                }
            };
            var sourceForPosition = function () {
                if(src === '1') {
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.setPositionAutocompleterValue($scope.candidateBeforeMerge.position);
                }else if(src === '2') {
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.setPositionAutocompleterValue($scope.candidate2.position);
                }else {
                    $scope.candidate[type] = undefined;
                    $scope.setPositionAutocompleterValue(undefined);
                }
            };
            var sourceForEmploymentType = function () {
                if(src === '1') {
                    $scope.setSelect2EmploymentType($scope.candidateBeforeMerge.employmentType.split(","));
                }else if(src === '2') {
                    $scope.setSelect2EmploymentType($scope.candidate2.employmentType.split(","));
                }else {
                    $scope.setPositionAutocompleterValue(undefined);
                }
            };
            var sourceForSalary = function () {
                    if(src === '1') {
                        $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                        $scope.candidate['currency'] = $scope.candidateBeforeMerge['currency'];
                    }else if(src === '2') {
                        $scope.candidate[type] = $scope.candidate2[type];
                        $scope.candidate['currency'] = $scope.candidate2['currency'];
                    }else {
                        $scope.candidate[type] = undefined;
                        $scope.candidate['currency'] = undefined;
                    }
            };
            var sourceForOrigin = function () {
                if(src === '1') {
                    $scope.setOriginAutocompleterValue($scope.candidateBeforeMerge.origin);
                }else if(src === '2') {
                    $scope.setOriginAutocompleterValue($scope.candidate2.origin);
                }else {
                    $scope.setOriginAutocompleterValue(undefined);
                }
            };
            var sourceForCoreSkills = function () {
                if(src === '1') {
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.coreSkills = '1';
                }else if(src === '2') {
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.coreSkills = '2';
                }
            };
            var sourceForDescription = function () {
                if(src === '1') {
                    $scope.candidate[type] = $scope.candidateBeforeMerge[type];
                    $scope.src.descr = '1';
                }else if(src === '2') {
                    $scope.candidate[type] = $scope.candidate2[type];
                    $scope.src.descr = '2';
                }
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
            if ($scope.candidateForm.$valid && salaryBol && !$scope.saveButtonIsPressed) {
                $scope.saveButtonIsPressed = true;
                var candidate = $scope.candidate;
                candidate.languages = $scope.getSelect2Lang();
                candidate.employmentType = $scope.getSelect2EmploymentType();
                candidate.position=$scope.getPositionAutocompleterValue();
                if ($scope.candidate.source) {
                    candidate.source = $scope.candidate.source;
                }
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
                } else if ($("#pac-input").val().length > 0 && (candidate.region == undefined || $("#pac-input").val() != candidate.region.fullName)) {
                    if ($scope.region)
                        candidate.region = $scope.region;
                }
                candidate.db = $('.datepickerOfBirth').datetimepicker('getDate') != null ? $('.datepickerOfBirth').datetimepicker('getDate').getTime() : null;
                deleteUnnecessaryFields(candidate);
                candidate.relatedRegions = $scope.regionToRelocate;
                candidate.origin = $scope.getOriginAutocompleterValue();
                var mergeData  = $scope.candidate2.candidateId;

                $http.put(serverAddress + '/candidate/' + 'mergeCandidates?duplicateId=' + mergeData, candidate).then(function (val) {
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
                $scope.candidateForm.name.$pristine = false;
                $scope.candidateForm.position.$pristine = false;
                $('html, body').animate({scrollTop: 0}, 'fast');
                $scope.candidateForm.salary.$pristine = false;
                $scope.candidateForm.education.$pristine = false;
                $scope.candidateForm.currentWorkPlace.$pristine = false;
                $scope.candidateForm.currentPosition.$pristine = false;
//            $scope.candidateForm.region.$pristine = false;
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
