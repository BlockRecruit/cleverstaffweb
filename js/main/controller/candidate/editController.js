controller.controller('CandidateEditController', ["$http", "$rootScope", "$scope", "FileInit", "$translate", "$routeParams", "$location", "Service", "Candidate", "CacheCandidates", "notificationService", "$filter", "serverAddress", "$window", "$uibModal", "$document",
    function($http, $rootScope, $scope, FileInit, $translate, $routeParams, $location, Service, Candidate, CacheCandidates, notificationService, $filter, serverAddress, $window, $uibModal, $document) {
        Service.toEditCandidate($routeParams.id, "/candidates/" + $routeParams.id);
        $scope.test = {date: new Date()};
        $scope.type = "edit";
        $scope.saveButtonIsPressed = false;
        $scope.serverAddress = serverAddress;
        $scope.addLinkErrorShow = false;
        $scope.showAddedLinks = false;
        $scope.showAddedFiles = false;
        $scope.photoUrl = '';
        $scope.showAddLink = false;
        $scope.btnToAddPhone = true;
        $scope.secondPhoneInput = false;
        $scope.thirdPhoneInput = false;
        $scope.phoneError = true;
        $scope.phoneError2 = true;
        $scope.phoneError3 = true;
        $scope.objType = 'candidate';
        $scope.currency = Service.currency();
        $scope.candidateOrigin = '';
        $scope.experience = Service.experience();
        $scope.industries = Service.getIndustries();
        $scope.contacts = {skype: "", mphone: "", email: "",telegram: ""};
        $scope.fieldValues = {
            objType: "candidate",
            fieldValueId: '',
            value: '',
            dateTimeValue: '',
            field : {
                fieldId: ''
            }
        };
        $scope.objType = 'candidate';

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
                scope: $scope,
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

        FileInit.initCandFileOption($scope, "candidate", "", false, $filter);
        FileInit.initFileOptionForEditFromResume($scope, "candidate");
        $scope.callbackFile = function(resp, name) {
            if (!$scope.candidate.files) {
                $scope.candidate.files = [];
            }
            $scope.candidate.files.push(resp);
            if ($scope.candidate.files.length > 0) {
                Candidate.progressUpdate($scope, false);
            }
            $scope.progressUpdate();
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
            if(resp.object){
                //resp.object.splice(0, 1);
                $scope.setLangs(resp.object);
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

        $scope.deleteDate = function(id, fieldValueId){
            $scope.editCustomId = id;
            $scope.editCustomFieldValueId = fieldValueId;
            angular.forEach($scope.candidate.fieldValues, function (val, ind) {
                if(val.fieldValueId == fieldValueId){
                    $scope.candidate.fieldValues.splice(ind, 1);
                    angular.forEach($('.editDate'), function (nval) {
                        console.log(nval.name);
                        if(id == nval.name){
                            nval.placeholder = '';
                            nval.value = '';
                        }
                    });
                }
            });
        };

        $scope.removeFile = function(id) {
            Candidate.removeFile({"candidateId": $scope.candidate.candidateId, "fileId": id}, function(resp) {
            });
            angular.forEach($scope.candidate.files, function(val, ind) {
                if (val.fileId === id) {
                    $scope.candidate.files.splice(ind, 1);
                }
            });
            if ($scope.candidate.files.length === 0) {
                delete $scope.candidate.files;
                Candidate.progressUpdate($scope, false);
            }
            $scope.progressUpdate();
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
                format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
                startView: 4,
                minView: 2,
                autoclose: true,
                language: $translate.use(),
                weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                initialDate:  new Date(1167609600000),
                startDate: new Date(-1262304000000),
                endDate: new Date(1199134800000)
            })
            .on('hide', function(val) {
                if (val.date != undefined) {
                    $scope.candidate.db = val.date.getTime();
                }
                $('.datepickerOfBirth').blur();
                $scope.progressUpdate();
            });

        $('#pac-input').blur(function() {
            if (!$(this).val()) {
                $scope.progressUpdate();
            }
        });
        $scope.updateCandidate = function(){
            Candidate.one({"localId": $routeParams.id}, function(resp) {
                if (angular.equals(resp.status, "ok")) {

                    $scope.setOriginAutocompleterValue(resp.object.origin);
                    $scope.candidateOrigin = resp.object.origin;
                    $scope.setPositionAutocompleterValue(resp.object.position);
                    if (resp.object.region != undefined && resp.object.region.lat != undefined && resp.object.region.lng != undefined) {
                        $scope.region = resp.object.region;
                        $scope.map.center.latitude = resp.object.region.lat;
                        $scope.map.center.longitude = resp.object.region.lng;
                        $scope.marker.coords.latitude = resp.object.region.lat;
                        $scope.marker.coords.longitude = resp.object.region.lng;

                        $scope.regionInput = resp.object.region.displayFullName;
                        $('#pac-input').val(resp.object.region.displayFullName);

                        $scope.progressUpdate();
                    }
                    $scope.photoLink = $scope.serverAddress + "/getapp?id=" + resp.object.photo + "&d=true";
                    $scope.regionToRelocate = resp.object.relatedRegions != undefined ? resp.object.relatedRegions : [];
                    var name = "";
                    resp.object.fullName != undefined ? name + resp.object.fullName.replace(/\W+/g, '_') : "";
                    resp.object.position != undefined ? name + resp.object.position.replace(/\W+/g, '_') : "";
                    resp.object.salary == 0 ? resp.object.salary = null : null;
                    if (name.length > 0) {
                        $location.hash($filter('transliteration')(name)).replace();
                    }

                    $scope.candidate = resp.object;

                    $scope.checkDuplicatesByNameAndContacts();
                    if(!$scope.candidate.customFields){
                        $scope.candidate.customFields = [];
                    }

                    $rootScope.localIdOfMerged = $scope.candidate.localId;
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

                    if (resp.object.employmentType != undefined) {
                        $scope.setSelect2EmploymentType(resp.object.employmentType.split(","));
                    }
                    if (resp.object.industry) {
                        $scope.setSelect2Industry(resp.object.industry)
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
                                $scope.contacts.mphone = val.valueList[0];
                                if(val.valueList[1]){
                                    $scope.contacts.mphone2 = val.valueList[1];
                                    $scope.secondPhoneInput = true;
                                }
                                if(val.valueList[2]){
                                    $scope.contacts.mphone3 = val.valueList[2];
                                    $scope.btnToAddPhone = false;
                                    $scope.thirdPhoneInput = true;
                                }
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
                            if (angular.equals(val.type, "telegram")) {
                                $scope.contacts.telegram = val.value;
                            }
                            console.log( $scope.contacts.telegram, ' $scope.contacts.telegram')
                        });
                    }
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
                    console.log($scope.candidate);
                    $scope.progressUpdate();
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


        $scope.progressUpdate = function() {
            Candidate.progressUpdate($scope, true);
        };

        $scope.imgWidthFunc = function(){
            var img = new Image();
            img.onload = function() {
                var width = this.width;
                var height = this.height;
                var minus = width - height;
                if(width >= height && minus > 40 && minus <=100){
                    $('#page-avatar').css({'width': '100%', 'height': 'auto', 'margin': 'inherit'});
                }else if((width >= 300 && width <= 349) || width == height){
                    $('#page-avatar').css({'width': '100%', 'object-fit': 'fill', 'margin': 'inherit'});
                }else if(width >= 350){
                    $('#page-avatar').css({'width': '100%', 'height': 'auto', 'margin': 'inherit'});
                }else{
                    $('#page-avatar').css({'width': 'inherit', 'height': 'inherit', 'display': 'block', 'margin': '0 auto'});
                }
            };
            if($location.$$host == '127.0.0.1'){
                img.src = $location.$$protocol + '://' + $location.$$host + ':8080' + $scope.serverAddress + '/getapp?id=' + $scope.candidate.photo + '&d=' + $rootScope.me.personId;
            }else{
                img.src = $location.$$protocol + '://' + $location.$$host + $scope.serverAddress + '/getapp?id=' + $scope.candidate.photo + '&d=' + $rootScope.me.personId;
            }
        };
        $scope.callbackAddPhoto = function(photo) {
            $rootScope.loading = false;
            if(photo != 'error') {
                $scope.candidate.photo = photo;
                $scope.photoLink = $scope.serverAddress + "/getapp?id=" + $scope.candidate.photo + "&d=true";
                $scope.imgWidthFunc();
                //$scope.hideModalAddPhoto();
                $rootScope.closeModal();
                Candidate.progressUpdate($scope, true);
            }
        };


        $scope.addPhotoByReference = function (photoUrl) {
            $rootScope.loading = true;
            FileInit.addPhotoByReference(photoUrl, $scope.callbackAddPhoto);
        };

        $scope.callbackErr = function(err) {
            notificationService.error(err);
        };
        Candidate.setPhoto($scope);

        $scope.removePhoto = function() {
            $scope.candidate.photo = "";
            $scope.progressUpdate();
        };
        $scope.editCustomField = function(value, id, fieldValueId){
            if(fieldValueId != undefined){
                console.log(1);
                if(value == ''){
                    console.log(3);
                    angular.forEach($scope.candidate.fieldValues, function(val, ind) {
                        if (val.fieldValueId === fieldValueId) {
                            $scope.candidate.fieldValues.splice(ind, 1);
                        }
                    });
                }else{
                    console.log(4);
                    angular.forEach($scope.candidate.fieldValues, function(val) {
                        if (val.fieldValueId === fieldValueId) {
                            val.value = value;
                        }
                    });
                }
            }else{
                console.log(2);
                $scope.candidate.fieldValues.push({
                    objType: "candidate",
                    // fieldValueId: fieldValueId,
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
                    angular.forEach($scope.candidate.fieldValues, function(val, ind) {
                        if (val.fieldValueId === fieldValueId) {
                            $scope.candidate.fieldValues.splice(ind, 1);
                        }
                    });
                }else{
                    console.log(4);
                    angular.forEach($scope.candidate.fieldValues, function(val) {
                        if (val.fieldValueId === fieldValueId) {
                            val.value = value;
                        }
                    });
                }
            }else{
                console.log(2);
                $scope.candidate.fieldValues.push({
                    objType: "candidate",
                    //fieldValueId: fieldValueId,
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
        // setTimeout(function(){
        //     $(".datepickerOfCustomEdit").datetimepicker({
        //         format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
        //         startView: 4,
        //         minView: 2,
        //         autoclose: true,
        //         language: $translate.use(),
        //         weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
        //         initialDate: new Date(),
        //         startDate: new Date()
        //     }).on('changeDate', function (val) {
        //         if (val.date != undefined) {
        //             $scope.editCustomValueDate = val.date.getTime();
        //             console.log(val.date.getTime());
        //             if($scope.editCustomFieldValueId != undefined){
        //                 console.log(1);
        //                 angular.forEach($scope.candidate.fieldValues, function(val) {
        //                     if (val.fieldValueId === $scope.editCustomFieldValueId) {
        //                         val.dateTimeValue = $scope.editCustomValueDate;
        //                     }
        //                 });
        //             }else{
        //                 console.log(2);
        //                 $scope.candidate.fieldValues.push({
        //                     objType: "candidate",
        //                     dateTimeValue: $scope.editCustomValueDate,
        //                     field : {
        //                         fieldId:  $scope.editCustomId
        //                     }
        //                 });
        //             }
        //         }
        //     }).on('hide', function() {
        //         if ($('.datepickerOfCustomEdit').name == $scope.editCustomId) {
        //             angular.forEach($scope.candidate.fieldValues, function (nval) {
        //                 if($('.datepickerOfCustomEdit').value != ''){
        //                     if($scope.editCustomId == nval.field.fieldId){
        //                         nval.dateTimeValue = "";
        //                     }
        //                 }
        //             });
        //         }
        //         $(".datepickerOfCustomEdit").blur();
        //     });
        // },850);

        $scope.roundMinutes = function(date) {
            var date2 = new Date();

           angular.copy(date, date2);

            date2.setHours(date2.getHours() - 3 + Math.round(date2.getMinutes()/60));
            date2.setMinutes(0);

            return date2;
        };
        // setTimeout(function(){
        //     $(".datepickerOfCustomEditTime").datetimepicker({
        //         format: "dd/mm/yyyy hh:00",
        //         startView: 2,
        //         minView: 1,
        //         autoclose: true,
        //         language: $translate.use(),
        //         weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
        //         initialDate: new Date(),
        //         startDate: new Date()
        //     }).on('changeDate', function (val) {
        //         if (val.date != undefined) {
        //             $scope.editCustomValueDate = val.date;
        //             $scope.editCustomValueDate = $scope.editCustomValueDate - $scope.editCustomValueDate.getMinutes()* 60000 - $scope.editCustomValueDate.getSeconds()*1000 - 3600000*3;
        //             console.log( $scope.editCustomValueDate, '$scope.editCustomValueDate');
        //
        //             if($scope.editCustomFieldValueId != undefined){
        //                 console.log(1);
        //                 if($('.editDate').placeholder != undefined){
        //                     angular.forEach($scope.candidate.fieldValues, function(val) {
        //                         if (val.fieldValueId === $scope.editCustomFieldValueId) {
        //                             val.dateTimeValue = $scope.editCustomValueDate;
        //                         }
        //                     });
        //                 }else{
        //                     $scope.candidate.fieldValues.push({
        //                         objType: "candidate",
        //                         dateTimeValue: $scope.editCustomValueDate,
        //                         field : {
        //                             fieldId:  $scope.editCustomId
        //                         }
        //                     });
        //                 }
        //             }else{
        //                 console.log(2);
        //                 $scope.candidate.fieldValues.push({
        //                     objType: "candidate",
        //                     dateTimeValue: $scope.editCustomValueDate,
        //                     field : {
        //                         fieldId:  $scope.editCustomId
        //                     }
        //                 });
        //             }
        //         }
        //     }).on('hide', function() {
        //         if ($('.datepickerOfCustomEditTime').name == $scope.editCustomId) {
        //             angular.forEach($scope.candidate.fieldValues, function (nval) {
        //                 if($('.datepickerOfCustomEditTime').value != ''){
        //                     if($scope.editCustomId == nval.field.fieldId){
        //                         nval.dateTimeValue = "";
        //                     }
        //                 }
        //             });
        //         }
        //         $(".datepickerOfCustomEditTime").blur();
        //     });
        // },850);

        $scope.deleteDate = function(id, fieldValueId, elem){
            $scope.editCustomId = id;
            $scope.editCustomFieldValueId = fieldValueId;
            var flag = false,
                index = 0;

                angular.forEach($scope.candidate.fieldValues, function (val, ind) {
                    if (val.fieldValueId == fieldValueId) {
                        $scope.candidate.fieldValues.splice(ind, 1);
                        angular.forEach($('.editDate'), function (nval) {
                            if (id == nval.name) {
                                nval.placeholder = '';
                                nval.value = '';
                            }
                        });
                    }
                });
        };
        $rootScope.closeModal = function(){
            $scope.modalInstance.close();
        };
        $rootScope.mergedCandidate = $routeParams.id;
        $rootScope.toMerge = function (id) {
            $rootScope.closeModal();
            if($rootScope.me.recrutRole != 'client'){
                if($scope.candidate.status != 'archived'){
                    Service.toMergeCandidate(id);
                }else{
                    notificationService.error($filter('translate')('Remote candidates can not be edited.'));
                }
            }else{
                notificationService.error($filter('translate')('Only recruiters, admins and freelancers can editing candidates'));
            }
        };
        $scope.toMergeModal = function (id){
        $rootScope.candidateForMerge = undefined;
            if($rootScope.me.recrutRole != 'client' && $rootScope.me.recrutRole != 'salesmanager'){
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../partials/modal/candidate-merge-modal.html',
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });
            }else{
                notificationService.error($filter('translate')('Only recruiters, admins and freelancers can adding candidates in vacancy'));
            }
        };
        $rootScope.closeModal = function(){
            $scope.modalInstance.close();
        };
        $rootScope.mergedCandidate = $routeParams.id;
        $rootScope.toMerge = function (id) {
            $rootScope.closeModal();
            if($rootScope.me.recrutRole != 'client'){
                if($scope.candidate.status != 'archived'){
                    Service.toMergeCandidate(id);
                }else{
                    notificationService.error($filter('translate')('Remote candidates can not be edited.'));
                }
            }else{
                notificationService.error($filter('translate')('Only recruiters, admins and freelancers can editing candidates'));
            }
        };
        $scope.toMergeModal = function (id){
        $rootScope.candidateForMerge = undefined;
            if($rootScope.me.recrutRole != 'client' && $rootScope.me.recrutRole != 'salesmanager'){
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../partials/modal/candidate-merge-modal.html',
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });
            }else{
                notificationService.error($filter('translate')('Only recruiters, admins and freelancers can adding candidates in vacancy'));
            }
        };
        setTimeout(function(){
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
        $scope.saveCandidate = function() {
            var salaryBol;
            $scope.candidate.position=$scope.getPositionAutocompleterValue();
            if ($scope.candidate.salary && $scope.candidate.salary >= 2147483647) {
                salaryBol = false;
            } else {
                salaryBol = true;
            }
            if($scope.contacts.mphone == undefined || $scope.contacts.mphone == "" || /^[+0-9]{6,20}$/.test($scope.contacts.mphone)){
                $scope.phoneError = true;
            }else{
                $scope.phoneError = false;
            }
            if($scope.contacts.mphone2 == undefined || $scope.contacts.mphone2 == "" || /^[+0-9]{6,20}$/.test($scope.contacts.mphone2)){
                $scope.phoneError2 = true;
            }else{
                $scope.phoneError2 = false;
            }
            if($scope.contacts.mphone3 == undefined || $scope.contacts.mphone3 == "" || /^[+0-9]{6,20}$/.test($scope.contacts.mphone3)){
                $scope.phoneError3 = true;
            }else{
                $scope.phoneError3 = false;
            }

            if ($scope.candidateForm.$valid && salaryBol && !$scope.saveButtonIsPressed && $scope.phoneError && $scope.phoneError2 && $scope.phoneError3) {
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
                if ($scope.contacts.mphone && ($scope.contacts.mphone2 == undefined || $scope.contacts.mphone2 == '') && ($scope.contacts.mphone3 == undefined || $scope.contacts.mphone3 == '')) {
                    candidate.contacts.push({type: "mphone", value: $scope.contacts.mphone});
                }
                if($scope.contacts.mphone2 != undefined && $scope.contacts.mphone2 != '' && ($scope.contacts.mphone3 == undefined || $scope.contacts.mphone3 == '')){
                    candidate.contacts.push({type: "mphone", value: $scope.contacts.mphone.concat(", ", $scope.contacts.mphone2)});
                }
                if($scope.contacts.mphone3 && $scope.contacts.mphone && ($scope.contacts.mphone2 == undefined || $scope.contacts.mphone2 == '')){
                    candidate.contacts.push({type: "mphone", value: $scope.contacts.mphone.concat(", ", $scope.contacts.mphone3)});
                }
                if($scope.contacts.mphone3 != undefined && $scope.contacts.mphone3 != '' && $scope.contacts.mphone2 != undefined && $scope.contacts.mphone2 != ''){
                    candidate.contacts.push({type: "mphone", value: $scope.contacts.mphone.concat(", ", $scope.contacts.mphone2).concat(", ", $scope.contacts.mphone3)});
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
                if ($scope.contacts.telegram) {
                    candidate.contacts.push({type: "telegram", value: $scope.contacts.telegram});
                }
                if ($("#pac-input").val().length == 0) {
                    candidate.region = null;
                } else if ($("#pac-input").val().length > 0 && (candidate.region == undefined || $("#pac-input").val() != candidate.region.fullName)) {
                    if ($scope.region)
                        candidate.region = $scope.region;
                }
                candidate.db = $('.datepickerOfBirth').datetimepicker('getDate') != null ? $('.datepickerOfBirth').datetimepicker('getDate').getTime() + 43200000 : null;
                if ($scope.fieldValues.dateTimeValue != undefined) {
                    $(".datepickerOfCustom").datetimepicker("setDate", new Date($scope.editCustomValueDate));
                }
                if ($scope.fieldValues.dateTimeValue != undefined) {
                    $(".datepickerOfCustomTime").datetimepicker("setDate", new Date($scope.editCustomValueDate));
                }
                candidate.relatedRegions = $scope.regionToRelocate;
                candidate.origin = $scope.getOriginAutocompleterValue();

                deleteUnnecessaryFields(candidate);
                console.log(candidate);
                Candidate.edit(candidate, function(val) {
                    if (angular.equals(val.status, "ok")) {
                        notificationService.success($filter('translate')('Candidate saved'));
                        CacheCandidates.update(val.object);
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
                        $location.path("/candidates/" + val.object.localId);
                    } else {
                        $scope.saveButtonIsPressed = false;
                    }
                }, function(err) {
                    $scope.saveButtonIsPressed = false;
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
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

        //$scope.checkDuplicatesByName = function() {
        //    Candidate.checkDuplicatesByName($scope);
        //};
        $scope.checkDuplicatesByNameAndContacts = function() {
            Candidate.checkDuplicatesByNameAndContacts($scope);
        };

        $scope.removeLink = function(id) {
            angular.forEach($scope.linksForSave, function(val, ind) {
                console.log(val);
                if (val.fileName === id) {
                    $scope.linksForSave.splice(ind, 1);
                }
            });
            $scope.progressUpdate();
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


        $scope.removeSource = function () {
            $scope.removableSource = $scope.getOriginAutocompleterValue();
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/origin-remove.html',
                scope: $scope,
                size: '',
                resolve: {

                }
            });
        };

        $scope.confirmDeleteOrigin = function () {
            Candidate.removeOriginAll({
                origin: $scope.removableSource
            },function (resp) {
                if(resp.status != "error") {
                    $scope.modalInstance.close();
                    notificationService.success($filter("translate")("Origin removed"));
                    $scope.setOriginAutocompleterValue();
                } else {
                    $scope.modalInstance.close();
                    notificationService.error(resp.message);
                }
            }, function (err) {
                $scope.modalInstance.close();
                notificationService.error(err);
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
        $scope.showModalConfirmationResumeUpdate = function(){
            $('.confirmationResumeUpdate.modal').modal('show');
        };

        $scope.resetBirthDate = function () {
            $('.datepickerOfBirth').val('');
        };

        $rootScope.changeSearchType = function(param){
            $window.location.replace('/!#/candidates');
            $rootScope.changeSearchTypeNotFromCandidates = param;
        };

        $scope.selectFavoriteContacts = function ($scope, type, event) {
            Candidate.setSelectFavoriteContacts($scope, type, event );
        };

        var i = 0;
        $scope.addInputPhone = function(){
            i++;
            if(i == 1){
                $scope.secondPhoneInput = true;
            }else if(i == 2){
                $scope.thirdPhoneInput = true;
                $scope.btnToAddPhone = false;
            }else{
                return false;
            }
        };

    }]);
