function CandidateAllController($localStorage, $translate, Service, $scope, ngTableParams, Candidate, $location,
                                $rootScope, $filter, $cookies, serverAddress, notificationService, googleService, $window,
                                ScopeService, frontMode, Vacancy, Company, vacancyStages, $sce, $analytics, Mail, FileInit, $uibModal, Person, $timeout, CandidateGroup, $anchorScroll, ) {
    $scope.experience = Service.experience();
    $rootScope.objectSize = null;
    $rootScope.isAddCandidates= true;
    localStorage.setItem("isAddCandidates", $rootScope.isAddCandidates);
    $rootScope.candidateLength = null;
    $scope.enableExcelUploadAll = 'N';
    $rootScope.setCurrent = true;
    $scope.a = {};
    $scope.a.searchNumber = 1;
    $scope.candidatesAddToVacancyIds = [];
    $scope.checkAllCandidates = false;
    $scope.showTagsForMass = false;
    $scope.previousFlag = true;
    $scope.placeholder = $filter('translate')('by position');
    $rootScope.candidatesAddToVacancyIds = $scope.candidatesAddToVacancyIds;
    $rootScope.currentElementPos = true;
    localStorage.setItem('currentPage', 'candidates');
    localStorage.removeItem('stageUrl');
    localStorage.removeItem('candidatesInStagesVac');
    localStorage.removeItem('getAllCandidates');
    Candidate.getCandidate = [];
    vacancyStages.get(function (resp) {
        $scope.customStages = resp.object.interviewStates;
        $rootScope.customStages = resp.object.interviewStates;
    });
    $scope.imgWidthFunc = function(id){
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
            }else if(width >= 266){
                $('#page-avatar').css({'width': '100%', 'height': 'auto'});
            }else{
                $('#page-avatar').css({'width': 'inherit', 'height': 'inherit', 'display': 'block', 'margin': '0 auto'});
            }
        };
        if($location.$$host == '127.0.0.1'){
            img.src = $location.$$protocol + '://' + $location.$$host + ':8080' + $scope.serverAddress + '/getapp?id=' + id + '&d=' + $rootScope.me.personId;
        }else{
            img.src = $location.$$protocol + '://' + $location.$$host + $scope.serverAddress + '/getapp?id=' + id + '&d=' + $rootScope.me.personId;
        }
    };
    $rootScope.closeModal = function(){
        $scope.modalInstance.close();
    };
    $rootScope.closeModalAfterActivity = function(){
        $rootScope.modalInstance?$rootScope.modalInstance.close():null;
    };
    Company.getParam({name: 'enableExcelUploadAll'}, function (resp) {
        if (angular.equals(resp.status, "ok")) {
            $scope.enableExcelUploadAll = resp.object;
        }
    });
    $scope.languageLevelData = Vacancy.languageLevelData;
    $scope.filterForChange = 'dm';
    $scope.filterSort = [{
        name: $filter('translate')('Relevancy'),
        values : 'relevance'
    }, {
        name: $filter('translate')('Date added to database'),
        values : 'dc'
    }, {
        name: $filter('translate')('Date of last activity'),
        values : 'dm'
    },{
        name: $filter('translate')('Alphabetically'),
        values : 'alphabetically'
    }, {
        name: $filter('translate')('Date of last comment'),
        values : 'lastCommentDate'
    }, {
        name: $filter('translate')('Employment start date'),
        values : 'hireDate'
    }];
    $rootScope.addCandidateInVacancy = {
        id: "",
        comment: "",
        status: "longlist",
        date: null,
        showSelect: "",
        showText: false,
        text: ""
    };

    $scope.currentDocPreviewPage = 0;

    $rootScope.addCandidateInVacancySelect2Obj = {
        status: null
    };
    Candidate.fromFile($scope, $rootScope, $location);
    $rootScope.errorMessageForAddCandidateInVacancy = {
        show: false,
        text: ""
    };
    setTimeout(function(){
        if($rootScope.me.recrutRole != 'client'){
            if ($rootScope.questStatus.growYourDatabasePopup == 'Y'){
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../partials/modal/HelloQuest/helloQuestCandidatesStart.html',
                    size: '',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: function(){

                    }
                });
                Person.changeUserParam({
                    name: 'letsCelebratePopup',
                    value: 'N'
                }, function (resp) {
                    if (resp.status == "ok") {
                        $rootScope.updateQuestStatus();
                        $rootScope.closeModalAfterActivity();
                    }else{
                        notificationService.error(resp.message);
                    }
                });
                $rootScope.continueQuest = function (key) {
                    Person.changeUserParam({
                        name: 'growYourDatabasePopup',
                        value: 'N'
                    }, function (resp) {
                        if (resp.status == "ok") {
                            $rootScope.updateQuestStatus();
                            $rootScope.closeModal();
                        }else{
                            notificationService.error(resp.message);
                        }
                    });
                };
                $rootScope.doItLater = function(){
                    Person.changeUserParam({
                        name: 'onboardingQuestPopup',
                        value: 'Y'
                    }, function (resp) {
                        if (resp.status == "ok") {
                            Person.changeUserParam({
                                name: 'growYourDatabasePopup',
                                value: 'N'
                            }, function (data) {
                                if(data.status == "ok"){
                                    $rootScope.updateQuestStatus();
                                    $timeout(function(){
                                        $rootScope.closeModal();
                                        $location.path("/organizer");
                                    },500)
                                }
                            });
                        }else{
                            notificationService.error(resp.message);
                        }
                    });
                };
            }
        }
    },0);
    $scope.menuOptions = [
        [$filter('translate')('Open in new tab'), function ($itemScope) {
            $window.open($location.absUrl() + "/" + $itemScope.user.localId, "_blank");
        }],
        [$filter('translate')('Add to vacancy'), function ($itemScope) {
            var state = null;
            var showSelect = true;
            var showText = false;
            $rootScope.clickedAddVacancyInCandidate = false;
            $scope.toAddVacancyForm = function (state, showSelect, showText, candidate) {
                $rootScope.candidateIdForVacancyId = candidate.candidateId;
                state = null;
                $rootScope.addCandidateInVacancy.showText = false;
                $rootScope.addCandidateInVacancy.showSelect = true;
                $rootScope.VacancyStatusFiltered = null;
                $rootScope.addCandidateInVacancy.inVacancy = false;
                $rootScope.addCandidateInVacancy.statusObject = null;
                $rootScope.addCandidateInVacancy.comment = '';
                $("#candidateAddToVacancy").select2("val", null);
                $rootScope.addCandidateInVacancy.status = state !== null ? state : {
                    value: "longlist",
                    withDate: false,
                    defaultS: true,
                    single: false,
                    added: true,
                    active_color: "longlist_color",
                    useAnimation: false,
                    count: 0,
                    forAdd: true
                };
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../partials/modal/candidate-add-in-vacancy.html',
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });
                $scope.modalInstance.opened.then(function() {
                    setTimeout(function(){
                        $(".addCandidateInvacancyPicker").datetimepicker({
                            format: "dd/mm/yyyy hh:ii",
                            startView: 2,
                            minView: 0,
                            autoclose: true,
                            weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                            language: $translate.use()
                        }).on('changeDate', function (data) {
                            $rootScope.addCandidateInVacancy.date = data.date;
                        }).on('hide', function () {
                            if ($('.addCandidateInvacancyPicker').val() == "") {
                                $rootScope.addCandidateInVacancy.date = null;
                            }else{
                                $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[interview date and time\]\]/g, $filter('dateFormat2')($('.addCandidateInvacancyPicker').datetimepicker('getDate').getTime(), true));
                                $rootScope.emailTemplateInModal.title = $rootScope.emailTemplateInModal.title.replace(/\[\[interview date and time\]\]/g, $filter('dateFormat2')($('.addCandidateInvacancyPicker').datetimepicker('getDate').getTime(), true));
                                tinyMCE.get('addCandidateInVacancyMCE').setContent($rootScope.emailTemplateInModal.text);
                            }
                            $('.addCandidateInvacancyPicker').blur();
                        });
                    },0)
                });
                $scope.modalInstance.closed.then(function() {
                    tinyMCE.remove()
                });
                $rootScope.candidateForUpdateResume = $itemScope.user;
                createEmailTemplateFunc($scope,$rootScope,'addCandidateInVacancyMCE', Mail);
                $rootScope.candnotify = {};
                Candidate.getContacts({"candidateId": $itemScope.user.candidateId}, function (resp) {
                    var email = "";
                    angular.forEach(resp.objects, function (c) {
                        if (c.type == "email") {
                            email = c.value;
                        }
                    });
                    $rootScope.candnotify.emails = email.replace(/ /gi, "").split(",");
                    $rootScope.candnotify.sendMail = $rootScope.candnotify.emails[0];
                });
                $rootScope.candnotify.show = false;
                $rootScope.candnotify.fullName = $itemScope.user.fullName;
                $rootScope.candnotify.send = $localStorage.get("candnotify") != "false";

            };

            $rootScope.addVacancyInCandidate = function ( sendTemplate) {
                if (!$rootScope.clickedAddVacancyInCandidate) {
                    $rootScope.clickedAddVacancyInCandidate = true;


                    if ($("#candidateAddToVacancy").select2('data') == null) {
                        $rootScope.errorMessageForAddCandidateInVacancy.show = true;
                        $rootScope.errorMessageForAddCandidateInVacancy.text = $filter('translate')('You must specify the position');
                        $rootScope.clickedAddVacancyInCandidate = false;
                        return;
                    }
                    var vacancyId = $("#candidateAddToVacancy").select2('data').id;
                    $rootScope.errorMessageForAddCandidateInVacancy.show = false;

                    $rootScope.addCandidateInVacancy.date = $('.addCandidateInvacancyPicker').datetimepicker('getDate') != null && ($rootScope.addCandidateInVacancy.status.withDate ||
                        $rootScope.addCandidateInVacancy.status.type == 'interview')
                        ? $('.addCandidateInvacancyPicker').datetimepicker('getDate') : null;
                    if ($rootScope.addCandidateInVacancy.status.customInterviewStateId) {
                        vacancyAddInterview(Vacancy, vacancyId, null,
                            $itemScope.user.candidateId,
                            $rootScope.addCandidateInVacancy.comment,
                            $rootScope.addCandidateInVacancy.status.customInterviewStateId,
                            $rootScope.addCandidateInVacancy.date, function (resp) {
                                resp.object.vacancyId.interviewStatusNotTouchable = resp.object.vacancyId.interviewStatus;
                                if (!$itemScope.user.interviews) {
                                    $itemScope.user.interviews = [];
                                }
                                $rootScope.clickedAddVacancyInCandidate = false;
                                $rootScope.addCandidateInVacancy.comment = "";
                                $rootScope.addCandidateInVacancy.id = null;
                                $itemScope.user.interviews.push(resp.object);
                                angular.forEach($itemScope.user.interviews, function (interview) {
                                    if (interview.vacancyId.interviewStatus == undefined) {
                                        interview.vacancyId.interviewStatus = "longlist,shortlist,interview,approved,notafit,declinedoffer";
                                        interview.vacancyId.interviewStatusNotTouchable = interview.vacancyId.interviewStatus
                                    }
                                });
                                angular.forEach($itemScope.user.interviews, function (value) {
                                    var array = value.vacancyId.interviewStatus.split(",");
                                    angular.forEach($scope.customStages, function (resp) {
                                        if (value.state == resp.customInterviewStateId) {
                                            value.state = resp.name
                                        }
                                        angular.forEach(array, function (res) {
                                            if (resp.customInterviewStateId == res) {
                                                array[array.indexOf(resp.customInterviewStateId)] = resp.name;
                                            }
                                        });
                                    });
                                    value.vacancyId.interviewStatus = array.toString();
                                });
                                $rootScope.addCandidateInVacancy.status = null;
                                $rootScope.addCandidateInVacancy.date = null;
                                $rootScope.VacancyStatusFiltered = '';
                                $rootScope.closeModal();
                            }, function (resp) {
                                $rootScope.clickedAddVacancyInCandidate = false;
                                $rootScope.errorMessageForAddCandidateInVacancy.show = true;
                                $rootScope.errorMessageForAddCandidateInVacancy.text = resp.message;
                            }, frontMode, notificationService, googleService, $scope.selectedCalendar != undefined ? $scope.selectedCalendar.id : null, $filter, $translate.use(), $rootScope);
                    } else {
                        vacancyAddInterview(Vacancy, vacancyId, null,
                            $itemScope.user.candidateId,
                            $rootScope.addCandidateInVacancy.comment,
                            $rootScope.addCandidateInVacancy.status.value,
                            $rootScope.addCandidateInVacancy.date, function (resp) {
                                resp.object.vacancyId.interviewStatusNotTouchable = resp.object.vacancyId.interviewStatus;
                                if (!$itemScope.user.interviews) {
                                    $itemScope.user.interviews = [];
                                }
                                $rootScope.clickedAddVacancyInCandidate = false;
                                $rootScope.addCandidateInVacancy.comment = "";
                                $rootScope.addCandidateInVacancy.id = null;
                                $itemScope.user.interviews.push(resp.object);
                                angular.forEach($itemScope.user.interviews, function (interview) {
                                    if (interview.vacancyId.interviewStatus == undefined) {
                                        interview.vacancyId.interviewStatus = "longlist,shortlist,interview,approved,notafit,declinedoffer";
                                        interview.vacancyId.interviewStatusNotTouchable = interview.vacancyId.interviewStatus;
                                    }
                                });
                                angular.forEach($itemScope.user.interviews, function (value) {
                                    var array = value.vacancyId.interviewStatus.split(",");
                                    angular.forEach($scope.customStages, function (resp) {
                                        if (value.state == resp.customInterviewStateId) {
                                            value.state = resp.name
                                        }
                                        angular.forEach(array, function (res) {
                                            if (resp.customInterviewStateId == res) {
                                                array[array.indexOf(resp.customInterviewStateId)] = resp.name;
                                            }
                                        });
                                    });
                                    value.vacancyId.interviewStatus = array.toString();
                                });
                                $rootScope.addCandidateInVacancy.status = null;
                                $rootScope.addCandidateInVacancy.date = null;
                                $rootScope.VacancyStatusFiltered = '';
                                $rootScope.closeModal();
                            }, function (resp) {
                                $rootScope.clickedAddVacancyInCandidate = false;
                                $rootScope.errorMessageForAddCandidateInVacancy.show = true;
                                $rootScope.errorMessageForAddCandidateInVacancy.text = resp.message;
                            }, frontMode, notificationService, googleService, $scope.selectedCalendar != undefined ? $scope.selectedCalendar.id : null, $filter, $translate.use(), $rootScope);
                    }
                    if($rootScope.candnotify.show && sendTemplate){
                        var candnotify = $rootScope.candnotify;
                        var changeObj = $rootScope.addCandidateInVacancy;
                        Mail.sendMailByTemplateVerified({
                            toEmails: candnotify.sendMail,
                            vacancyId: $rootScope.VacancyAddedInCandidate.vacancyId,
                            candidateId: $rootScope.candidateForUpdateResume.candidateId,
                            fullName: $rootScope.candidateForUpdateResume.fullName,
                            email: $rootScope.emailTemplateInModal.email,
                            date: $rootScope.addCandidateInVacancy.date,
                            lang: $scope.lang,
                            template: {
                                type: $rootScope.emailTemplateInModal.type,
                                title: $rootScope.emailTemplateInModal.title,
                                text: $rootScope.emailTemplateInModal.text,
                                fileId: $rootScope.fileForSave.length > 0 ? $rootScope.fileForSave[0].fileId : null,
                                fileName: $rootScope.fileForSave.length > 0 ? $rootScope.fileForSave[0].fileName : null
                            }
                        }, function (resp) {
                            if(resp.status == 'ok'){
                                notificationService.success($filter('translate')('Letter sent'));
                                $rootScope.closeModal();
                            }else{
                                notificationService.error($filter('translate')('Error connecting integrate with email. Connect it again'));
                            }
                        });
                    }
                }
            };
            $scope.toAddVacancyForm(state, showSelect, showText, $itemScope.user);

        }],
        [$filter('translate')('Edit candidate'), function ($itemScope) {
            if($rootScope.me.recrutRole != 'client'){
                $window.open($location.protocol() + "://" + $location.host() + "/!#/candidate/edit/" + $itemScope.user.localId, "_blank");
            }else{
                notificationService.error($filter('translate')('Only recruiters, admins and freelancers can editing candidates'));
            }
        }],
        [$filter('translate')('Remove candidate'), function ($itemScope) {
            $scope.deleteCandidate($itemScope.user);
        }]
    ];
    $rootScope.transferCandidateInOtherVacancyStatus = function () {
        var status = $("#candidateAddToVacancy").select2('data').status;
        if (status == 'approved' && $rootScope.me.recrutRole != 'admin') {
            $rootScope.errorMessageForAddCandidate.text = $filter('translate')('Transfer from the status of approved can only Admin');
            $rootScope.errorMessageForAddCandidate.show = true;
            return;
        }


        $rootScope.changeStatusOfInterviewInVacancy = $rootScope.addCandidateInVacancy;
        $rootScope.changeStatusOfInterviewInVacancy.vacancyId = $("#candidateAddToVacancy").select2('data').id;
        var data = $('.addCandidateInvacancyPicker').datetimepicker('getDate') != null && $rootScope.addCandidateInVacancy.status.withDate
            ? $('.addCandidateInvacancyPicker').datetimepicker('getDate') : null;
        $rootScope.saveStatusInterviewInVacancy(data);
        $('.addCandidateInVacancy').modal('hide');
        $rootScope.candidateAddedInVacancy = false;
        $('.addCandidateInvacancyPicker').val("");
    };
    $rootScope.saveStatusInterviewInVacancy = function (customDate) {
        if (!$rootScope.clickedSaveStatusInterviewInVacancy) {
            $rootScope.clickedSaveStatusInterviewInVacancy = true;
            $rootScope.changeStatusOfInterviewInVacancy.errorMessage = false;
            var changeObj = $rootScope.changeStatusOfInterviewInVacancy;
            if (changeObj.status.value == 'declinedoffer' && changeObj.comment == '') {
                $rootScope.changeStatusOfInterviewInVacancy.errorMessage = true;
                $rootScope.clickedSaveStatusInterviewInVacancy = false;
                return;
            }
            if ($rootScope.showEmployedFields) {
                changeObj.date = $('.changeStatusOfInterviewEmployed').datetimepicker('getDate') != null ? $('.changeStatusOfInterviewEmployed').datetimepicker('getDate') : customDate != undefined ? customDate : null;
            } else {
                changeObj.date = $('.changeStatusOfInterviewInVacancyPick').datetimepicker('getDate') != null ? $('.changeStatusOfInterviewInVacancyPick').datetimepicker('getDate') : customDate != undefined ? customDate : null;
            }
            if ($rootScope.showEmployedFields) {
                Vacancy.editInterview({
                    "personId": $scope.personId,
                    "vacancyId": $rootScope.changeStatusOfInterviewInVacancy.vacancyId,
                    "candidateId":  $rootScope.candidateForUpdateResume.candidateId,
                    "interviewId": changeObj.candidate.interviewId,
                    "interviewState": changeObj.status.customInterviewStateId ? changeObj.status.customInterviewStateId : changeObj.status.value,
                    "comment": changeObj.comment,
                    "lang": $translate.use(),
                    "probationaryPeriod": $rootScope.probationaryPeriod,
                    "dateEmployee": changeObj.date != null ? changeObj.date.getTime() : null
                }, function (resp) {
                    if (resp.status == "ok") {
                        if(changeObj.status.customInterviewStateId){
                            var id = resp.object.interviewId + changeObj.status.customInterviewStateId;
                        }else{
                            var id = resp.object.interviewId + changeObj.status.value;
                        }
                        $scope.showChangeStatusValue = null;
                        //angular.forEach($scope.candidate.interviews, function (i) {
                        //    if (i.vacancyId.vacancyId == $rootScope.changeStatusOfInterviewInVacancy.vacancyId) {
                        //        i.state = changeObj.status.value;
                        //    }
                        //});
                        $rootScope.clickedSaveStatusInterviewInVacancy = false;
                        if ($rootScope.candnotify.send && $rootScope.candnotify.sendMail.length > 1) {
                            var candnotify = $rootScope.candnotify;
                            var changeObj = $rootScope.changeStatusOfInterviewInVacancy;
                            Mail.sendMailByTemplate({
                                toEmails: candnotify.sendMail,
                                vacancyId: $rootScope.changedStatusVacancy ? $rootScope.changedStatusVacancy.vacancyId:$rootScope.VacancyAddedInCandidate.vacancyId,
                                candidateId: $rootScope.candidateForUpdateResume.candidateId,
                                fullName: $rootScope.candidateForUpdateResume.fullName,
                                email: $rootScope.emailTemplateInModal.email,
                                date: changeObj.date != null ? changeObj.date.getTime() : null,
                                lang: $scope.lang,
                                template: {
                                    type: $rootScope.emailTemplateInModal.type,
                                    title: $rootScope.emailTemplateInModal.title,
                                    text: $rootScope.emailTemplateInModal.text,
                                    fileId: $rootScope.fileForSave.length > 0 ? $rootScope.fileForSave[0].fileId : null,
                                    fileName: $rootScope.fileForSave.length > 0 ? $rootScope.fileForSave[0].fileName : null
                                }
                            }, function (resp) {
                                if(resp.status == 'ok'){
                                    notificationService.success($filter('translate')('Letter sent'));
                                    $rootScope.closeModal();
                                }else{
                                    notificationService.error($filter('translate')('Error connecting integrate with email. Connect it again'));
                                }
                            });
                        }
                        $rootScope.changeStatusOfInterviewInVacancy = {
                            candidate: {},
                            comment: "",
                            status: "",
                            date: null,
                            exportgoogle: false
                        };
                        $rootScope.addCandidateInInterviewbuttonClicked = false;
                        $rootScope.closeModal();
                        $('.changeStatusOfInterviewInVacancyPick').val("");
                        $scope.getLastEvent();
                        notificationService.success($filter('translate')('candidate was added to the stage'));
                    } else if (resp.status == "error") {
                        $rootScope.clickedSaveStatusInterviewInVacancy = false;
                        notificationService.error(resp.message);
                    }
                }, function (err) {
                    $scope.showChangeStatusValue = null;
                    $rootScope.clickedSaveStatusInterviewInVacancy = false;
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                    $rootScope.addCandidateInInterviewbuttonClicked = false;
                });
            }else{
                Vacancy.editInterview({
                    "personId": $scope.personId,
                    "vacancyId": $rootScope.changeStatusOfInterviewInVacancy.vacancyId,
                    "candidateId": $rootScope.candidateForUpdateResume.candidateId,
                    "interviewState": changeObj.status.name ? changeObj.status.customInterviewStateId : changeObj.status.value,
                    "comment": changeObj.comment,
                    "date": changeObj.date != null ? changeObj.date.getTime() : null,
                    "lang": $translate.use()
                }, function (resp) {
                    if (resp.status == "ok") {
                        var changeObj = $rootScope.changeStatusOfInterviewInVacancy;
                        if(changeObj.status.customInterviewStateId){
                            var id = resp.object.interviewId + changeObj.status.customInterviewStateId;
                        }else{
                            var id = resp.object.interviewId + changeObj.status.value;
                        }
                        if(changeObj.date){
                            if($rootScope.calendarShow){
                                googleCalendarCreateEvent(googleService, changeObj.date, changeObj.
                                        $scope.candidate.candidateId.fullName,
                                    $rootScope.changeStatusOfInterviewInVacancy.position,
                                    $scope.selectedCalendar != undefined ? $scope.selectedCalendar.id : null,
                                    changeObj.comment, id, $filter);
                            }
                        }
                        $scope.showChangeStatusValue = null;
                        //angular.forEach($scope.candidate.interviews, function (i) {
                        //    if (i.vacancyId.vacancyId == $rootScope.changeStatusOfInterviewInVacancy.vacancyId) {
                        //        i.state = changeObj.status.value;
                        //    }
                        //});
                        $rootScope.clickedSaveStatusInterviewInVacancy = false;
                        if ($rootScope.candnotify.send && $rootScope.candnotify.sendMail.length > 1) {
                            var candnotify = $rootScope.candnotify;
                            var changeObj = $rootScope.changeStatusOfInterviewInVacancy;
                            Mail.sendMailByTemplate({
                                toEmails: candnotify.sendMail,
                                vacancyId: $rootScope.changedStatusVacancy ? $rootScope.changedStatusVacancy.vacancyId:$rootScope.VacancyAddedInCandidate.vacancyId,
                                candidateId: $rootScope.candidateForUpdateResume.candidateId,
                                fullName: $rootScope.candidateForUpdateResume.fullName,
                                email: $rootScope.emailTemplateInModal.email,
                                date: changeObj.date != null ? changeObj.date.getTime() : null,
                                lang: $scope.lang,
                                template: {
                                    type: $rootScope.emailTemplateInModal.type,
                                    title: $rootScope.emailTemplateInModal.title,
                                    text: $rootScope.emailTemplateInModal.text,
                                    fileId: $rootScope.fileForSave.length > 0 ? $rootScope.fileForSave[0].fileId : null,
                                    fileName: $rootScope.fileForSave.length > 0 ? $rootScope.fileForSave[0].fileName : null
                                }
                            }, function (resp) {
                                if(resp.status == 'ok'){
                                    notificationService.success($filter('translate')('Letter sent'));
                                    $rootScope.closeModal();
                                }else{
                                    notificationService.error($filter('translate')('Error connecting integrate with email. Connect it again'));
                                }
                            });
                        }
                        $rootScope.changeStatusOfInterviewInVacancy = {
                            candidate: {},
                            comment: "",
                            status: "",
                            date: null,
                            exportgoogle: false
                        };
                        $rootScope.addCandidateInInterviewbuttonClicked = false;
                        $rootScope.closeModal();
                        $('.changeStatusOfInterviewInVacancyPick').val("");
                        notificationService.success($filter('translate')('candidate was added to the stage'));
                    } else if (resp.status == "error") {
                        $rootScope.clickedSaveStatusInterviewInVacancy = false;
                        notificationService.error(resp.message);
                    }
                }, function (err) {
                    $scope.showChangeStatusValue = null;
                    $rootScope.clickedSaveStatusInterviewInVacancy = false;
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                    $rootScope.addCandidateInInterviewbuttonClicked = false;
                });
            }
        }
    };
    $scope.serverAddress = serverAddress;
    $scope.candidateFound = false;
    $scope.regionId = null;
    $rootScope.changeStateInCandidate = {
        status: "",
        comment: "",
        fullName: null,
        placeholder: null,
        candidate: null
    };
    $scope.statusAssoc = Candidate.getStatusAssociative();
    $scope.employmentType = Service.employmentType();
    $scope.experience = Service.experience();
    $scope.extensionHas = false;
    //$scope.cities = [];
    Service.getRegions2(function (countries, cities) {
        console.log(countries);
        //console.log(cities);
        $scope.countries = countries;
        $scope.cities = cities;
        //var optionsHtml = '<option value="null" style="color:#999">'+$filter('translate')('region')+'</option>';
        //var optionsHtmlCity = '<option value="null" style="color:#999">'+$filter('translate')('city')+'</option>';
        //angular.forEach($scope.countries, function (value) {
        //    optionsHtml += "<option style='color: #000000' value='" + JSON.stringify(value).replace(/\'/gi,"") + "'>" + value.name + "</option>";
        //});
        //angular.forEach($scope.cities, function (value) {
        //    optionsHtmlCity += "<option style='color: #000000' value='" + JSON.stringify(value).replace(/\'/gi,"") + "'>" + value.name + "</option>";
        //});
        //$('#cs-region-filter-select, #cs-region-filter-select-for-linkedin').html(optionsHtml);
        //$('#cs-region-filter-select-cities, #cs-region-filter-select-for-linkedin-cities').html(optionsHtmlCity);
    });
    Service.getGroups(function (resp) {
        $scope.candidateGroups = resp.objects;
        var emptyList = [];
        $scope.setGroups($scope.candidateGroups, emptyList);
    });
    $scope.textSearchType = [
        {name: "words through AND", value: "AllWords"},
        {name: "words through OR", value: "any"},
        {name: "exact match", value: "whole"},
        {name: "Only by position", value: "byPosition"}
    ];
    $scope.textSearchTypeModel = $scope.textSearchType[0].value;
    // $scope.changeTextSearchType = function (val) {
    //     if (val == "any") {
    //         $scope.searchParam.searchFullTextType = 'or';
    //     } else if (val == "whole") {
    //         $scope.searchParam.searchFullTextType = 'full_match';
    //     } else if (val == "byPosition") {
    //         $scope.searchParam.searchFullTextType = 'position';
    //     } else if (val == "AllWords") {
    //         $scope.searchParam.searchFullTextType = 'and';
    //     }
    // };

    $scope.boxParam = {
        cs: {
            text_chooser: true,
            reserve: true,
            region: true,
            salary: true,
            type: true,
            industry: true,
            sex: true,
            status: true,
            age: true,
            language: true,
            skill:true
        }
    };
    $scope.box = $scope.boxParam.cs;
    $scope.lang = $translate;
    $scope.ageSearchFrom = [];
    $scope.ageSearchTo = [];
    Service.gender($scope);
    for (var i = 15; i <= 80; i++) {
        $scope.ageSearchFrom.push(i);
        $scope.ageSearchTo.push(i);
    }
    $rootScope.loading = false;
    $scope.isSearched = false;
    $rootScope.searchCheck = $rootScope.searchCheck == undefined ? false : $rootScope.searchCheck;
    $rootScope.searchCheckExternal = $rootScope.searchCheckExternal == undefined ? false : $rootScope.searchCheckExternal;
    $scope.industries = Service.getIndustries();


    function scope_update(val) {
        $scope.tableParams.reload();
    }

    ScopeService.setCurrentControllerUpdateFunc(scope_update);

    //listenerForScope($scope, $rootScope);

    $rootScope.clear = function () {
        Candidate.setOptions("sort", 'dm');
        $scope.searchParam.searchType = "AllWords";
        $scope.searchParam.name = null;
        $scope.searchParam.regionId = null;
        $scope.searchParam.regionIdCity = null;
        $scope.searchParam.salary = null;
        $scope.searchParam.status = 'null';
        $scope.searchParam.sex = 'null';
        $scope.searchParam.employmentType = 'null';
        $scope.searchParam.industry = 'null';
        $scope.searchParam.ageFrom = null;
        $scope.searchParam.ageTo = null;
        $scope.searchParam.words = null;
        $scope.searchParam.company = null;
        $scope.searchParam.position = null;
        $scope.searchParam.candidateGroups = null;
        $scope.searchParam.candidateGroupIds = 'null';
        $scope.searchParam.searchFullTextType = null;
        $scope.searchParam.responsibleId = 'null';
        $scope.searchParam.personId = Candidate.searchOptions().personId;
        $scope.searchParam.personNameWhoSearching = $rootScope.usernameThatIsSearching;
        $scope.searchParam.pages = {count: $scope.startPagesShown};
        $scope.searchParam.experience = 'null';
        $scope.searchParam.languages =  'null';
        $scope.searchParam.origin = null;
        $scope.searchParam.skills = [];
        $scope.setSkillAutocompleterValueForSearch('');
        $scope.setOriginAutocompleterValue("source");
        resetLanguagesSearCriterion();
    };
    $rootScope.clearSearchRegion = function(){
        $scope.searchParam.regionId = 'null';
    };
    if (localStorage.countCandidate) {
        $scope.startPagesShown = localStorage.countCandidate;
    } else {
        $scope.startPagesShown = 15;
    }
    $scope.initSearchParam = function () {
        $scope.searchParam = {
            searchType: "AllWords",
            salary: null,
            status: 'null',
            sex: 'null',
            employmentType: 'null',
            industry: 'null',
            ageFrom: null,
            ageTo: null,
            sort: 'dm',
            sortOrder: 'DESC',
            words: null,
            position: null,
            searchCs: true,
            candidateGroups: null,
            searchExternal: false,
            searchSocial: false,
            searchIn: false,
            regionId: 'null',
            candidateGroupIds: null,
            searchFullTextType: null,
            withPersonalContacts: 'null',
            responsibleId: null,
            personId: Candidate.searchOptions().personId,
            personNameWhoSearching: $rootScope.usernameThatIsSearching,
            pages: {count: $scope.startPagesShown},
            experience: null,
            languages: 'null',
            skills: []
        };
        $scope.staticSearchParam = [];
        $scope.staticSearchParam.push({
            searchType: "AllWords",
            salary: null,
            status: 'null',
            sex: 'null',
            employmentType: 'null',
            industry: 'null',
            ageFrom: null,
            ageTo: null,
            sort: 'dm',
            sortOrder: 'DESC',
            words: null,
            position: null,
            withPersonalContacts: 'null',
            searchCs: true,
            candidateGroups: null,
            searchExternal: false,
            searchSocial: false,
            searchIn: false,
            regionId: 'null',
            candidateGroupIds: null,
            searchFullTextType: null,
            responsibleId: 'null',
            personId: Candidate.searchOptions().personId,
            personNameWhoSearching: $rootScope.usernameThatIsSearching,
            pages: {count: $scope.startPagesShown},
            experience: null,
            languages: 'null',
            skills: []
        })
    };
    $scope.initSearchParam();

    $rootScope.excelExportType = 'candidates';
    $scope.loadingExcel = false;
    $scope.exportToExcel = function () {
        $scope.criteriaForExcel.withCommentsAndHistory = $rootScope.excelExportType === 'all';
        $rootScope.loading = true;
        if($scope.loadingExcel == false){
            $scope.loadingExcel = true;
            $rootScope.closeModal();
            if($scope.criteriaForExcel.words == null) {
                $scope.criteriaForExcel.searchFullTextType = null;
            }
            Candidate.createExcel($scope.criteriaForExcel, function (resp) {
                if (resp.status == 'ok') {
                    var sr = $rootScope.frontMode == "war" ? "/hr/" : "/hrdemo/";
                    $('#export_in_excel')[0].href = sr + 'getapp?id=' + resp.object;
                    $('#export_in_excel')[0].click();
                }
                if (resp.code == 'emptyExportExcel') {
                    notificationService.error($filter('translate')('No candidates for export according to criteria'));
                    $scope.loadingExcel = false;
                }
                $scope.loadingExcel = false;
                $rootScope.loading = false;

            });
        }
    };


    $scope.toExcelHistory = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '../partials/modal/candidate-excel-history.html',
            scope: $scope,
            resolve: {},
            size: ""
        });
    };

    $scope.viewExcelHistory = function() {
        $rootScope.closeModal();
        $location.path("excelHistory");
    };

    $scope.externalData = [];

    $scope.deleteSearchByUser = function () {
        $scope.searchParam.personId = null;
        $scope.searchParam.personNameWhoSearching = null;
        $scope.tableParams.reload();
    };
    $scope.hideDetailElement = function () {
        $scope.showMessageAboutChangeTypeOfOtherSiteSearch = false;
    };
    $scope.showDetail = function () {
        $scope.showMessageAboutChangeTypeOfOtherSiteSearch = true;
        $scope.showMessageAboutChangeTypeOfOtherSiteSearchmouseover = true
    };

    $scope.tableParams = new ngTableParams({
        page: 1,
        count: $scope.searchParam.pages.count
    }, {
        total: 0,
        getData: function ($defer, params) {
            $rootScope.loading = true;
            if ($rootScope.previousLocation == '/candidates/:id') {
                // if ($rootScope.searchParamInCandidate != undefined) {
                //     $scope.searchParam = $rootScope.searchParamInCandidate;
                //     console.log( $rootScope.searchParamInCandidate, ' $rootScope.searchParamInCandidate')
                //     $rootScope.searchParamInCandidate = null;
                // }

                if($scope.previousFlag){
                    $scope.tableParams.page($rootScope.previousSearchNumber);
                    $scope.previousFlag = !$scope.previousFlag;
                }
            }
            if (ScopeService.isInit()) {
                var activeParam = ScopeService.getActiveScopeObject();
                $scope.activeScopeParam = activeParam;
                Candidate.setOptions("personId", $scope.searchParam.personId != undefined ? $scope.searchParam.personId : activeParam.name == 'onlyMy' ? $rootScope.userId : null);
                Candidate.setOptions("page", {number: (params.$params.page - 1), count: params.$params.count});
                if( params.$params.count <= 120) {
                    localStorage.countCandidate = params.$params.count;
                } else {
                    localStorage.countCandidate = 15;
                }

                $scope.searchParam.pages.count = params.$params.count;
                if ($scope.searchParam['regionId'] == 'null') {
                    $scope.searchParam['regionId'] = null;
                }
                if ($scope.searchParam['regionIdCity'] == 'null') {
                    $scope.searchParam['regionIdCity'] = null;
                }
                if ($scope.searchParam['regionId']) {
                    if($scope.searchParam['regionIdCity']){
                        Candidate.setOptions("city", $scope.searchParam['regionIdCity']);
                    }else{
                        Candidate.setOptions("country", $scope.searchParam['regionId']);
                    }
                } else {
                    Candidate.setOptions("country", activeParam.name == 'region' && activeParam.value.type == "country" ? activeParam.value.value : null);
                    Candidate.setOptions("city", activeParam.name == 'region' && activeParam.value.type == "city" ? activeParam.value.value : null);
                }


                Candidate.setOptions("allContainsWords", $scope.searchParam.allContainsWords);
                Candidate.setOptions("name", $scope.searchParam.name);
                Candidate.setOptions("position", $scope.searchParam.position);
                Candidate.setOptions("experience", $scope.searchParam.experience);
                Candidate.setOptions("searchWordsInPosition", $scope.searchParam.searchWordsInPosition);
                Candidate.setOptions("requiredAllContainsWords", $scope.searchParam.requiredAllContainsWords);
                Candidate.setOptions("dateTo", isNotBlank($scope.searchParam['ageFrom']) ?
                    new Date(new Date().setFullYear(new Date().getFullYear() - $scope.searchParam['ageFrom'])).getTime() : null);
                Candidate.setOptions("dateFrom", isNotBlank($scope.searchParam['ageTo']) ?
                    new Date(new Date().setFullYear(new Date().getFullYear() - $scope.searchParam['ageTo'])).getTime() : null);
                Candidate.setOptions("state", isNotBlank($scope.searchParam['status']) ? $scope.searchParam['status'] : null);
                Candidate.setOptions("words", isNotBlank($scope.searchParam['words']) ? $scope.searchParam['words'] : null);
                Candidate.setOptions("salaryTo", $scope.searchParam['salary'] ? $scope.searchParam['salary'] : null);
                Candidate.setOptions("sex", isNotBlank($scope.searchParam['sex']) ? $scope.searchParam['sex'] : null);
                Candidate.setOptions("employmentType", isNotBlank($scope.searchParam['employmentType']) ? $scope.searchParam['employmentType'] : null);
                Candidate.setOptions("responsibleId", isNotBlank($scope.searchParam['responsibleId']) ? $scope.searchParam['responsibleId'] : null);
                Candidate.setOptions("industry", isNotBlank($scope.searchParam['industry']) ? $scope.searchParam['industry'] : null);
                Candidate.setOptions("candidateGroupIds", $scope.searchParam['candidateGroupIds'] ? $scope.searchParam['candidateGroupIds'] : null);
                Candidate.setOptions("experience", isNotBlank($scope.searchParam['experience']) ? $scope.searchParam['experience'] : null);
                Candidate.setOptions("languages", $scope.searchParam['languages'] !== 'null' && $scope.searchParam['languages'].length > 0 ? $scope.searchParam['languages'] : []);
                Candidate.setOptions("searchFullTextType", isNotBlank($scope.searchParam['searchFullTextType']) ? $scope.searchParam['searchFullTextType'] : null);
                Candidate.setOptions("sort", isNotBlank($scope.filterForChange) ? $scope.filterForChange : null);
                Candidate.setOptions("sortOrder", $scope.filterForChange == 'alphabetically' ? 'ASC' : 'DESC');
                Candidate.setOptions("withPersonalContacts", $scope.searchParam['withPersonalContacts'] == 'null' ? null: $scope.searchParam['withPersonalContacts'] == "true");
                Candidate.setOptions("skills",$scope.searchParam.skills.name ? [{name: $scope.getSkillAutocompleterValueForSearch(),type: $scope.searchParam.skills.type}] : null);
                Candidate.setOptions("origin", isNotBlank($scope.searchParam['origin']) ? $scope.searchParam['origin'] : null);
                $scope.criteriaForExcel = angular.copy(Candidate.searchOptions());
                $scope.candidateSearchOptions = Candidate.searchOptions();
                $rootScope.searchParamInCandidate = $scope.searchParam;

                function getCandidates(page, count) {
                    if(page || count) {
                        Candidate.setOptions("page", {number: page, count: count});
                        $scope.candidateSearchOptions.page.number = page;
                        $scope.candidateSearchOptions.page.count = count;
                    } else {
                        $scope.isShowMore = false;
                        if(document.getElementById('scrollup'))
                            document.getElementById('scrollup').style.display = 'none';
                        $timeout(function() {
                            $anchorScroll('mainTable');
                        });
                    }


                    Candidate.getAllCandidates($scope.candidateSearchOptions)
                        .then(response =>{
                            if(response.status === "error") {
                                notificationService.error(response.message);
                            } else {
                                console.log(response, 'responsegu');
                                $scope.searchParam['withPersonalContacts'] = $scope.searchParam['withPersonalContacts'].toString();
                                $rootScope.objectSize = response['objects'] ? response['total'] : 0;
                                localStorage.setItem('objectSize',  $rootScope.objectSize);
                                $rootScope.objectSizeCand = $rootScope.objectSize;
                                $rootScope.searchParam = $scope.searchParam;
                                params.total(response['total']);
                                $scope.paginationParams = {
                                    currentPage: $scope.candidateSearchOptions.page.number,
                                    totalCount: $rootScope.objectSize
                                };
                                let pagesCount = Math.ceil(response['total']/$scope.candidateSearchOptions.page.count);
                                if(pagesCount == $scope.candidateSearchOptions.page.number + 1) {
                                    $('#show_more').hide();
                                } else {
                                    $('#show_more').show();
                                }
                                $scope.candidateFound = response['total'] >= 1;
                                $scope.criteriaForExcel["page"] = {
                                    number: 0,
                                    count: $scope.objectSize
                                };
                                $scope.limitReached = response['limitReached'];
                                if(page) {
                                    $scope.candidates = $scope.candidates.concat(response['objects'])
                                } else {
                                    $scope.candidates = response['objects'];
                                }
                                $defer.resolve($scope.candidates);
                                // Candidate.init();
                                $scope.searchParam.searchCs = true;
                                $rootScope.loading = false;
                                $scope.$apply();
                            }
                        }, resp => $rootScope.loading = false);
                }

                getCandidates();
                $scope.showMore = function () {
                    $scope.isShowMore = true;
                    Service.dynamicTableLoading(params.total(), $scope.candidateSearchOptions.page.number, $scope.candidateSearchOptions.page.count, getCandidates)
                };
                $scope.a.searchNumber = $scope.tableParams.page();
                $rootScope.previousSearchNumber = $scope.a.searchNumber;
            }
        }
    });

    $scope.changeFilter = function(sort){
        if($scope.searchParam.words == null && sort == 'relevance'){
            notificationService.error($filter('translate')('Sort by relevance impossible until you enter a value in the Text Search'));
        }else{
            if(sort == 'alphabetically'){
                Candidate.setOptions("sort", sort);
                Candidate.setOptions("sortOrder", 'ASC');
                $scope.filterForChange = sort;
            }else{
                Candidate.setOptions("sort", sort);
                Candidate.setOptions("sortOrder", 'DESC');
                $scope.filterForChange = sort;
            }
            if(!$scope.clickBtnSort){
                $scope.tableParams.reload();
            }
        }
    };
    $scope.$watch('filterForChange', function (newVal, oldVal) {
        if(newVal != undefined && oldVal != newVal){
            $scope.changeFilter(newVal);
        }
    });
    Person.getAllPersons(function (resp) {
        $scope.persons = [];
        $rootScope.persons = [];
        $rootScope.personsNotChanged = [];
        $scope.associativePerson = resp.object;
        angular.forEach($scope.associativePerson, function (val, key) {
            $scope.persons.push($scope.associativePerson[key]);
            $rootScope.persons.push($scope.associativePerson[key]);
            $rootScope.personsNotChanged.push($scope.associativePerson[key]);
        });
    });

    $scope.changeInputPage = function(params,searchNumber){
        var searchNumber = Math.round(searchNumber);
        var maxValue = $filter('roundUp')(params.settings().total/params.count());
        if(searchNumber){
            if(searchNumber >= 1 && searchNumber <= maxValue){
                params.page(searchNumber);
                $scope.a.searchNumber = searchNumber;
            }
        }
    };

    $scope.clickExternalMenu = function () {
        $scope.showExternalMenu = !$scope.showExternalMenu;
        if (!$scope.source.openSettingsMenu) {
            $scope.source.openSettingsMenu = true;
            $localStorage.set("search_external", JSON.stringify($scope.source));
        }
    };

    $scope.showAdvancedSearchCandidateFunc = function() {
        $scope.showAdvancedSearchCandidate = !$scope.showAdvancedSearchCandidate;
        $(".AdvancedSearchCandidate").show("slide", { direction: "right" }, 10);
    };
    $scope.showAdvancedSearchCandidateFuncHide = function(){
        $scope.showAdvancedSearchCandidate = !$scope.showAdvancedSearchCandidate;
        $(".AdvancedSearchCandidate").hide("slide", { direction: "right" }, 10);
    };

    $(document).click(function (){
        if($(".AdvancedSearchCandidate").css('display') != 'none'){
            $scope.showAdvancedSearchCandidateFuncHide();
            $scope.$apply();
        }
    });
    $(".AdvancedSearchCandidate,.sortBy").click(function (e){
        e.stopPropagation();
    });

    $scope.clickedUser = null;

    $('body').bind('click', function(event) {
       if($scope.clickedUser && !$(event.target).hasClass('for-files')) {
           $scope.clickedUser = null;
           $scope.$apply();
       }
    });

    $scope.showUserFiles = function(user) {
        if($scope.clickedUser !== user) {
            var clickedUserIndex = $scope.candidates.indexOf(user);
            $scope.clickedUser = $scope.candidates[clickedUserIndex];
        } else {
            $scope.clickedUser = null;
        }
    };

    $scope.closeSearchTags = function (param){
        if(param == 'industry'){
            $scope.staticSearchParam[0].industry = 'null';
            $scope.searchParam.industry = null;
            $scope.searchParam[param] = 'null';
            $scope.setSelect2Industry('');
        }else if(param == 'skills.name'){
            $scope.staticSearchParam[0].skills.name = null;
            $scope.staticSearchParam[0].skills.type = '_all';
            $scope.searchParam.skills.name = null;
            $scope.searchParam.skills.type = '_all';
        }else if(param == 'skills.type'){
            $scope.staticSearchParam[0].skills.type = '_all';
            $scope.searchParam.skills.type = '_all';
        }else if(param == 'sex'){
            $scope.staticSearchParam[0].sex = 'null';
            $scope.searchParam.sex = 'null';
        }else if(param == 'salary'){
            $scope.staticSearchParam[0].salary = null;
            $scope.searchParam.salary = null;
        }else if(param == 'status'){
            $scope.staticSearchParam[0].status = 'null';
            $scope.searchParam.status = 'null';
        }else if(param == 'ageFrom'){
            $scope.staticSearchParam[0].ageFrom = null;
            $scope.searchParam.ageFrom = null;
        }else if(param == 'ageTo'){
            $scope.staticSearchParam[0].ageTo = null;
            $scope.searchParam.ageTo = null;
        }else if(param == 'lang'){
            resetLanguagesSearCriterion()
        }else if(param == 'experience'){
            $scope.staticSearchParam[0].experience = 'null';
            $scope.searchParam.experience = 'null';
        }else if(param == 'candidateGroupIds'){
            $scope.staticSearchParam[0].candidateGroupIds = null;
            $scope.searchParam.candidateGroupIds = null;
        }else if(param == 'words'){
            $scope.staticSearchParam[0].words = null;
            $scope.searchParam.words = null;
            $scope.searchParam.searchFullTextType = null;
        }else if(param == 'name'){
            $scope.staticSearchParam[0].name = null;
            $scope.searchParam.name = null;
        }else if(param == 'position'){
            $scope.staticSearchParam[0].position = null;
            $scope.searchParam.position = null;
            $scope.searhcForSure = true;
            $scope.setPositionAutocompleterValue('');
            $('#s2id_position-autocompleter .select2-chosen').html($scope.placeholder)
        }else if(param == 'sort'){
            $scope.staticSearchParam[0].sort = $scope.filterForChange;
            $scope.filterForChange = $scope.filterForChange;
        }else if(param == 'responsibleId'){
            $scope.staticSearchParam[0].responsibleId = 'null';
            $scope.searchParam.responsibleId = 'null';
        }else if(param == 'regionId'){
            $scope.staticSearchParam[0].regionId = 'null';
            $scope.searchParam.regionId = null;
            $scope.searchParam.regionIdCity = null;
        }else if(param == 'withPersonalContacts'){
            $scope.staticSearchParam[0].withPersonalContacts = 'null';
            $scope.searchParam.withPersonalContacts = 'null';
        }else if(param == 'origin'){
            $scope.staticSearchParam[0].origin = null;
            $scope.searchParam.origin = null;
            $scope.setOriginAutocompleterValue('source');
        }else if(param == 'skillsName'){
            $scope.staticSearchParam[0].skills = 'null';
            $scope.searchParam.skills = 'null';
            $scope.setSkillAutocompleterValueForSearch('');
        }else{
            $scope.staticSearchParam[0][param] = 'null';
            $scope.searchParam[param] = null;
        }
    };

    function isDuplicateLanguage(currentLang, level, indexLang) {
      return $scope.chosenLangs.some((item, index) =>  index !== indexLang && item.name === currentLang.name && item.level === level);
    }


    $scope.searchLevelLanguage = function (chosenLang, level, index) {
        let data = $scope.chosenLangs, indexLang = data.indexOf(chosenLang);

        if(isDuplicateLanguage(data[indexLang],level, indexLang)) {
            notificationService.error("Language with this level is already selected");
            document.querySelectorAll('.language-level')[index]['0'].selected = true;
            return;
        }

        if(data[indexLang] && level !== '_undefined'){
            data[indexLang].level = level;
        }
    };

    $scope.searchLangs = '';
    $scope.chosenLangs = ['null','null','null'];
    $scope.currentLang = 'null';
    $scope.addSearchLang = function (lang) {
        let i = 0, max = $scope.chosenLangs.length;

        if($scope.chosenLangs[0] != 'null' && $scope.chosenLangs[1] != 'null' && $scope.chosenLangs[2] != 'null' &&  max >= 3){
            notificationService.error($filter('translate')('Select no more than three languages'));
            $scope.currentLang = 'null';
        }else if($scope.chosenLangs[0] == lang || $scope.chosenLangs[1] == lang || $scope.chosenLangs[2] == lang){
            notificationService.error($filter('translate')('the language is already selected'));
            $scope.currentLang = 'null';
        }else{
            for(;i < max;i++){
                let elem = $scope.chosenLangs[i];

                if(elem == 'null' ){
                    $scope.chosenLangs[i] = {name:lang};
                    $scope.currentLang = 'null';
                    console.log($scope.chosenLangs, 'chosenLangs')
                    return;
                }
            }
            $scope.chosenLangs.push({name:lang});
            $scope.currentLang = 'null';
        }
    };

    $scope.deleteSearchLang = function (selectedLang, event) {
        let index = $scope.chosenLangs.indexOf(selectedLang);
        $scope.chosenLangs.splice(index, 1);
        $scope.currentLang = 'null';
    };

    $scope.inHover = function () {
        $scope.showRegionSearchInfoPop = true;
    };
    $scope.outHover = function () {
        $scope.showRegionSearchInfoPop = false;
    };
    $scope.cleanTags = function(){
        $scope.clear();
        $scope.clearTags();
        $rootScope.clickSearch(true);
    };
    $rootScope.clickSearch = function (isClean) {
        if(($scope.searchParam.salary != null || $scope.searchParam.status != 'null' ||
                $scope.searchParam.sex != 'null' || $scope.searchParam.employmentType != 'null' ||
                $scope.searchParam.industry != 'null' || $scope.searchParam.ageFrom != null ||
                $scope.searchParam.ageTo != null || $scope.filterForChange != 'dm' ||
                $scope.searchParam.sortOrder != 'DESC' || $scope.searchParam.words != null || $scope.searchParam.name != null ||
                $scope.searchParam.position != null || $scope.searchParam.candidateGroups != null ||
                $scope.searchParam.regionId != null || $scope.searchParam.regionIdCity != null ||
                $scope.searchParam.candidateGroupIds != null || $scope.searchParam.searchFullTextType != null ||
                $scope.searchParam.responsibleId != 'null' || $scope.searchParam.personId != null ||
                $scope.searchParam.experience != 'null' || $scope.searchParam.languages != 'null' ||
                $scope.searchParam.skills.type != '_all' || $scope.searchParam.withPersonalContacts != 'null') || ($scope.searhcForSure)||
                $scope.chosenLangs.some(item => item != 'null') || $scope.groupIdsForSearch){

            $scope.searhcForSure = false;
            $scope.showExternalMenu = false;
            $scope.clickBtnSort = true;
            $scope.searchParam.candidateGroupIds = $scope.groupIdsForSearch;
            if($scope.searchParam.words){
                Candidate.setOptions("searchFullTextType", 'booleanSearch');
                $scope.searchParam.searchFullTextType = 'booleanSearch';
                Candidate.setOptions("sort", 'relevance');
                $scope.filterForChange = 'relevance';
            }else{
                Candidate.setOptions("searchFullTextType", null);
                $scope.searchParam.searchFullTextType = null;
                Candidate.setOptions("sort", $scope.filterForChange = 'dm');
                //$scope.searchParam.sort = 'dm';
            }
            if($scope.getSelect2Group().length > 0 && $rootScope.searchParamInCandidate && $rootScope.searchParamInCandidate.candidateGroupIds && $rootScope.searchParamInCandidate.candidateGroupIds.length == 0){
                notificationService.error($filter('translate')('This tag is not added to any candidate'));
            }

            (!isClean)? $scope.searchParam['languages'] = $scope.chosenLangs.filter(item => item !== 'null'):null;


            if($scope.searchParam.words && !$scope.searchParam.words.length){
                notificationService.error($filter('translate')('Enter more data for search'));
                return
            }

            var array = [];
            array.push({
                searchType: '',
                salary: $scope.searchParam.salary,
                status: $scope.searchParam.status,
                sex: $scope.searchParam.sex,
                employmentType: $scope.searchParam.employmentType,
                industry: $scope.searchParam.industry,
                ageFrom: $scope.searchParam.ageFrom,
                ageTo: $scope.searchParam.ageTo,
                sort: $scope.filterForChange,
                sortOrder: $scope.searchParam.sortOrder,
                words: $scope.searchParam.words,
                name: $scope.searchParam.name,
                position: $scope.searchParam.position,
                searchCs: true,
                candidateGroups: $scope.searchParam.candidateGroups,
                searchExternal: false,
                searchSocial: false,
                searchIn: false,
                regionId: $scope.searchParam.regionId,
                regionIdCity: $scope.searchParam.regionIdCity,
                candidateGroupIds: $scope.searchParam.candidateGroupIds,
                searchFullTextType: $scope.searchParam.searchFullTextType,
                responsibleId: $scope.searchParam.responsibleId,
                personId: Candidate.searchOptions().personId,
                personNameWhoSearching: $rootScope.usernameThatIsSearching,
                pages: {count: $scope.startPagesShown},
                experience: $scope.searchParam.experience,
                languages: $scope.searchParam.languages,
                skills: $scope.searchParam.skills,
                origin: $scope.searchParam.origin,
                withPersonalContacts: $scope.searchParam.withPersonalContacts
            });
            $scope.staticSearchParam = array;
            if ($scope.searchParam['name'] ||
                $scope.searchParam['salary'] ||
                $scope.searchParam['status'] ||
                $scope.searchParam['words'] ||
                $scope.searchParam['ageTo'] ||
                $("#regionExternalSearchRegion").select2('data') ||
                $scope.searchParam['ageFrom'] ||
                $scope.searchParam['employmentType'] ||
                $scope.searchParam['candidateGroupIds'] ||
                $scope.searchParam['industry'] ||
                $scope.searchParam['sex'] ||
                $scope.searchParam['responsibleId'] ||
                $scope.searchParam['sort'] ||
                $scope.searchParam['regionId'] ||
                $scope.searchParam['regionIdCity']
            ) {
                $scope.tableParams.$params.page = 1;
                if ($scope.searchParam.searchCs) {
                    $scope.tableParams.reload();
                }
                //if ($scope.searchParam.sex == 'null') {
                //    $scope.searchParam.sex = null;
                //}
                $rootScope.searchCheck = true;
                if ($scope.searchParam.searchIn) {
                    $scope.clickSearchLink();
                }
            } else if ($rootScope.searchCheck) {
                $scope.tableParams.reload();
                $rootScope.searchCheck = false;
            }
            $scope.isSearched = true;
            setTimeout(function(){
                $scope.clickBtnSort = false;
            },0)
        }
        else{
            notificationService.error($filter('translate')('Enter the data'));
        }
    };

    $scope.toOneCandidate = function (candidate) {
        $location.path("candidates/" + candidate.localId);
    };
    $scope.toAdd = function () {
        Service.toAddCandidate();
    };
    $scope.toEdit = function (id) {
        if($rootScope.me.recrutRole != 'client'){
            Service.toEditCandidate(id);
        }else{
            notificationService.error($filter('translate')('Only recruiters, admins and freelancers can edit candidate info'));
        }
    };
    $scope.toParseEmail = function () {
        $location.path("candidate/add/email");
    };
    $scope.toZip = function () {
        $location.path("candidate/add/zip");
    };
    $scope.deleteCandidate = function (candidate) {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '../partials/modal/candidate-remove.html',
            size: ''
        });
        $rootScope.changeStateInCandidate.status = "archived";
        $rootScope.changeStateInCandidate.fullName = candidate.fullName;
        $rootScope.changeStateInCandidate.candidate = candidate;
        $rootScope.changeStateInCandidate.placeholder = $filter('translate')('Write a comment why you want remove this candidate');
    };
    $rootScope.saveStatusOfCandidate = function () {
        if ($rootScope.changeStateInCandidate.status != "") {
            Candidate.changeState({
                candidateId: $rootScope.changeStateInCandidate.candidate.candidateId,
                comment: $rootScope.changeStateInCandidate.comment,
                candidateState: $rootScope.changeStateInCandidate.status
            }, function (resp) {
                if (resp.status == "ok") {
                    $rootScope.changeStateInCandidate.candidate.status = resp.object.status;
                    notificationService.success($filter('translate')('candidate') + " " + $rootScope.changeStateInCandidate.candidate.fullName + " " + $filter('translate')('was_deleted'));
                    if($scope.candidates.length == 1 && $scope.a.searchNumber > 1) {
                        $scope.tableParams.page($scope.a.searchNumber - 1);
                    } else {
                        $scope.tableParams.reload();
                    }
                }
            });
            //    function (err) {
            //    //notificationService.error($filter('translate')('service temporarily unvailable'));
            //});
            $rootScope.closeModal();
            $rootScope.changeStateInCandidate.status = "";
            $rootScope.changeStateInCandidate.comment = "";
        }
    };
    $scope.selectRegion = function (val) {
        if ($scope.searchParam.regionId != null) {
            var json = JSON.parse($scope.searchParam.regionId);
            return json != null && val.value == json.value;
        }
    };
    $rootScope.addFromGmail = function () {
        googleService.gmailAuth("readonly", function (result) {
            if (result.status == 'ok') {
                $(".addEmailToParseQueue").modal("hide");
                Candidate.addToParserQueue({email: result.email, password: result.code, host: "gmail"},
                    function (resp) {
                        if (resp && resp.status == 'ok') {
                        } else if (resp.message) {
                            notificationService.error(resp.message);
                        }
                    },
                    function (resp) {
                    });
            }
        });
    };
    $scope.ageEmptyFieldAdd = function (whatAge) {
        if(whatAge == 'ageFrom') {
            if($scope.ageSearchFrom.indexOf(null) == -1) {
                $scope.ageSearchFrom.unshift(null);
            }
        } else {
            if($scope.ageSearchTo.indexOf(null) == -1) {
                $scope.ageSearchTo.unshift(null);
            }
        }
    };
    $scope.status = Candidate.getStatus();
    if ($localStorage.isExist("candidateSearchObject")) {
        var json = JSON.parse($localStorage.get("candidateSearchObject"));
        $scope.searchExternalObject = json.searchExternalObject;
        $scope.loadingExternal = false;
        $("#select_2_region").val(json.searchParam.regionId);
        $scope.searchParamVkRequestObject = json.searchParamVkRequestObject;
        $scope.searchParamVkReqest = json.searchParamVkReqest;
        //$scope.searchParam = json.searchParam;
        $scope.box = json.box;
    }
//    $localStorage.delete("candidateSearchObject")
    $scope.updateLinkHistorySearch = function () {
        Candidate.getSearchHistoryUniqueLink(function (resp) {
            var mas = {};
            var today = new Date();
            var yesterday = new Date().setDate(today.getDate() - 1);
            angular.forEach(resp, function (r, i) {
                if (r.words || r.position || r.company || r.country) {
                    var d = new Date(r.dc);
                    var key;
                    if (today.getFullYear() == d.getFullYear() && today.getMonth() == d.getMonth() && today.getDate() == d.getDate()) {
                        key = $filter("dateFormat")(r.dc) + "today";
                    } else if (today.getFullYear() == d.getFullYear() && today.getMonth() == d.getMonth() && today.getDate() - 1 == d.getDate()) {
                        key = $filter("dateFormat")(r.dc) + "yesterday";
                    } else {
                        key = $filter("dateFormat")(r.dc);
                    }
                    if (mas[key]) {
                        mas[key].push(r);
                    } else {
                        mas[key] = [r];
                    }
                }
            });
            $scope.linkHistorySearch = mas;
            $scope.linkHistorySearchKey = Object.keys(mas).sort().reverse();
            $scope.emptyLinkHistory = JSON.stringify($scope.linkHistorySearch) == '{}';
        });
    };
    $scope.updateLinkHistorySearch();

    if ($rootScope.eventListenerPing) {
        document.removeEventListener('cleverstaffExtensionPong', $rootScope.eventListenerPing);
    }
    $rootScope.eventListenerPing = function (event) {
        $scope.extensionHas = true;
    };
    document.addEventListener('cleverstaffExtensionPong', $rootScope.eventListenerPing);
    document.dispatchEvent(new CustomEvent('cleverstaffExtensionPing'));

    $scope.getPlugin = function () {
        if (navigator.saysWho.indexOf("Chrome") != -1) {
            $window.open("https://chrome.google.com/webstore/detail/cleverstaff-extension/mefmhdnojajocbdcpcajdjnbccggbnha");
        } else if (navigator.saysWho.indexOf("Firefox") != -1) {
            //$window.open("https://addons.mozilla.org/firefox/addon/cleverstaff_extension");
            $window.open("/extension/CleverstaffExtension4Firefox.xpi");
        } else {
            $("#bad-browser-modal").modal("show");
        }
    };
    $scope.getBrowser = function () {
        if (navigator.saysWho.indexOf("Chrome") != -1) {
            return "Chrome";
        } else if (navigator.saysWho.indexOf("Firefox") != -1) {
            return "Firefox";
        } else {
            return $filter("translate")("browser");
        }
    };
    $scope.isGoodBrowser = function () {
        return $scope.getBrowser() === "Chrome" || $scope.getBrowser() === "Firefox";
    };

    navigator.saysWho = (function () {
        var ua = navigator.userAgent, tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\bOPR\/(\d+)/);
            if (tem != null) return 'Opera ' + tem[1];
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    })();
    Candidate.ZIP($scope);

    $scope.langs = Candidate.getLangInOrg(function (resp) {
        if (resp.object) {
            $scope.langsReceived = resp.object;
            angular.forEach($scope.langsReceived, function (val) {
                if(val.name != undefined){
                    $scope.langsSearch = val;
                }
            });
        } else {
            $scope.setLangs([]);
        }
    });
    $scope.tofullinformation = function(event,user){
        if(event.button == 0){
            $location.path('candidates/' + user.localId);
        }
    };
    $scope.setSearchedRegion = function(){
        $scope.city = [];
        $scope.searchParam.regionIdCity = null;
        angular.forEach($scope.cities, function (nval) {
            if(nval.type == 'city' && (nval.country == $scope.searchParam.regionId || nval.countryRu == $scope.searchParam.regionId)){
                $scope.city.push(nval);
            }
        });
        var uniqueArray = removeDuplicates($scope.city, "id");
        $scope.city = uniqueArray;
        console.log($scope.city);
        //$scope.searchParam.regionIdCity = null;
        //var obj = JSON.parse($scope.searchParam.regionId);
        //if(obj.type == 'country'){
        //    $scope.searchedRegion = JSON.parse($scope.searchParam.regionId);
        //    $('#cs-region-filter-select-cities').find('option').remove();
        //    var optionsHtmlCity = '<option value="null" style="color:#999">'+$filter('translate')('city')+'</option>';
        //    angular.forEach($scope.cities, function (value) {
        //        if(value.type == 'city' && value.country == $scope.searchedRegion.country){
        //            optionsHtmlCity += "<option style='color: #000000' value='" + JSON.stringify(value).replace(/\'/gi,"") + "'>" + value.name + "</option>";
        //        }
        //    });
        //    $('#cs-region-filter-select-cities, #cs-region-filter-select-for-linkedin-cities').html(optionsHtmlCity);
        //}else{
        //    $scope.searchedRegionCity = JSON.parse($scope.searchParam.regionIdCity);
        //}
    };
    if($rootScope.changeSearchTypeNotFromCandidates){
        $scope.changeSearchType($rootScope.changeSearchTypeNotFromCandidates);
        $rootScope.changeSearchTypeNotFromCandidates = null;
    }
    $scope.parJson = function (json) {
        return JSON.parse(json);
    };
    $rootScope.setDocCounter = function(){
        $scope.currentDocPreviewPage = 0;
    };
    $scope.prevDoc = function(){
        $scope.currentDocPreviewPage -= 1;
    };
    $scope.nextDoc = function(){
        $scope.currentDocPreviewPage += 1;
    };
    $scope.fileForSave = [];
    $rootScope.fileForSave = [];    /*For modal window*/

    FileInit.initVacancyTemplateInCandidateFileOption($scope, $rootScope, "", "", false, $filter);
    $scope.callbackFileTemplateInCandidate = function(resp, names) {
        $scope.fileForSave.push({"fileId": resp, "fileName": names});
        $rootScope.fileForSave.push({"fileId": resp, "fileName": names});
    };
    $scope.removeFile = function(id) {
        angular.forEach($scope.fileForSave, function(val, ind) {
            if (val.attId === id) {
                $scope.fileForSave.splice(ind, 1);
            }
        });
    };
    $rootScope.removeFile = function(id) {
        angular.forEach($rootScope.fileForSave, function(val, ind) {
            if (val.attId === id) {
                $rootScope.fileForSave.splice(ind, 1);
            }
        });
    };
    $scope.showCandidateFiles = function(id){
        $scope.candidateIdFiles = id;
        $('body').mouseup(function (e) {
            if ($(".saveCandidateFile").has(e.target).length === 0) {
                $scope.candidateIdFiles = null;
                $scope.$apply();
            }
        });
    };
    $scope.showAddResumeFromText = function(){
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '../partials/modal/add-resume-from-text.html',
            size: 'lg',
            resolve: function(){

            }
        });
    };
    $rootScope.checkTextForResume = function(){
        $rootScope.loading = true;
        Candidate.fromText({text: $rootScope.fastCandResumeText}, function(res) {
            if (angular.equals(res.status, "ok")) {
                //Candidate.convert($scope, res.object);
                //if (res.object.position) {
                //    $scope.setPositionAutocompleterValue(res.object.position);
                //}
                $rootScope.resumeFromText = res.object;
                $rootScope.loading = false;
                $location.path("candidate/add");
                $rootScope.closeModal();
            } else if (angular.equals(res.status, "error")) {
                notificationService.error(res.message);
            } else {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            }
            $scope.fastCandLoading = false;
        }, function(val) {
            //notificationService.error($filter('translate')('service temporarily unvailable'));
        });
    };
    $scope.showAddResumeFromLink = function(){
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '../partials/modal/add-resume-from-link.html',
            size: 'lg',
            resolve: function(){

            }
        });
    };
    $rootScope.checkTextForLink = function(){
        var link;
        if ($("#fastCandResumeLinkSite").val()) {
            link = $("#fastCandResumeLinkSite").val();
        } else if (value) {
            link = value;
            $rootScope.fastCandResumeLinkSite = value;
        }
        if ($rootScope.fastCandResumeLinkSite === undefined && (link.indexOf('http://') === -1 || link.indexOf('https://') === -1 || link.indexOf('ftp://') === -1)) {
            $rootScope.fastCandResumeLinkSite = 'http://' + link;
        }
        if ($rootScope.fastCandResumeLinkSite !== undefined) {
            if ($rootScope.fastCandResumeLinkSite.indexOf("docs.google.com") === -1 && $rootScope.fastCandResumeLinkSite.indexOf("drive.google.com") === -1) {
                if ($rootScope.fastCandResumeLinkSite.indexOf("linkedin.com/profile/view") === -1) {
                    $rootScope.loading = true;
                    $scope.fastCandLoading = true;
                    Candidate.fromLinkSite({url: $rootScope.fastCandResumeLinkSite}, function(res) {
                        if (angular.equals(res.status, "ok")) {
                            //Candidate.convert($scope, res.object);
                            //if (res.object.employmentType != undefined) {
                            //    $scope.setSelect2EmploymentType(res.object.employmentType.split(", "));
                            //}
                            //if (res.object.position) {
                            //    $scope.setPositionAutocompleterValue(res.object.position);
                            //}
                            $rootScope.resumeFromLink = res.object;
                            $location.path("candidate/add");
                            $rootScope.closeModal();
                        } else if (angular.equals(res.status, "error")) {
                            notificationService.error(res.message);
                        } else {
                            //notificationService.error($filter('translate')('service temporarily unvailable'));
                        }
                        $scope.fastCandLoading = false;
                        $rootScope.loading = false;
                    }, function(val) {
                        //notificationService.error($filter('translate')('service temporarily unvailable'));
                        $scope.fastCandLoading = false;
                        $rootScope.loading = false;
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
    $scope.getFirstLetters = function(string){
        return firstLetters(string)
    };
    $scope.pushCandidateToVacancy = function(candidate){
        if(candidate.added){
            var candidateAdded = false;
            for(var key in $scope.candidatesAddToVacancyIds){
                if(candidate.candidateId == $scope.candidatesAddToVacancyIds[key])
                    candidateAdded = true;
            }
            if(!candidateAdded){
                $scope.candidatesAddToVacancyIds.push(candidate.candidateId)
            }
        }else{
            $scope.candidatesAddToVacancyIds.splice($scope.candidatesAddToVacancyIds.indexOf(candidate.candidateId), 1);
        }
    };
    $scope.pushAllCandidatesToVacancy = function () {
        $scope.checkAllCandidates = !$scope.checkAllCandidates;
        angular.forEach($scope.candidates, function(resp){
            if($scope.checkAllCandidates){
                resp.added = true
            }else{
                resp.added = false;
            }
            if(!$scope.checkAllCandidates){
                $scope.candidatesAddToVacancyIds.splice(0, $scope.candidatesAddToVacancyIds.length-1);
            }
            $scope.pushCandidateToVacancy(resp);
        });
    };
    $scope.showAddCandidatesInVacancy = function(){
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '../partials/modal/candidates-add-in-vacancy.html',
            size: '',
            resolve: function(){
            }
        });
    };
    $rootScope.addCandidatesToVacancy = function(){
        Vacancy.setInterviewList({
            candidateIds: $scope.candidatesAddToVacancyIds,
            vacancyId: $("#candidatesAddToVacancy").select2('data').id,
            state: 'longList',
            status: 'in_process'
        },function(resp){
            if(resp.status == 'ok'){
                $rootScope.closeModal();
                if($scope.candidatesAddToVacancyIds.length == 1){
                    notificationService.success($filter('translate')('Candidate added in vacancy'));
                }else if($scope.candidatesAddToVacancyIds.length > 1){
                    notificationService.success($filter('translate')('Candidates added in vacancy'));
                }
            }else{
                notificationService.error(resp.message);
            }
        });
    };
    $scope.showTagsForMassModal = function(){
        $rootScope.candidatesAddToVacancyIds = $scope.candidatesAddToVacancyIds;
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '../partials/modal/candidates-add-tags-multiple.html',
            size: '',
            resolve: function(){
            }
        });
        $scope.modalInstance.opened.then(function() {
            setTimeout(function(){
                $rootScope.setGroupsForMass($scope.candidateGroups, [], $scope);
            },0)
        });
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
    $scope.editTagName = function (tagObject) {
        $rootScope.tagForEdit = {};
        var tagSelected = false;
        $rootScope.tagForEdit.name = $(tagObject).parent().children().first().html();
        $scope.oldTagName = $rootScope.tagForEdit.name;
        angular.forEach($scope.groupsForEdit, function (group) {
            if(group.name == $rootScope.tagForEdit.name && !tagSelected) {
                tagSelected = true;
                $rootScope.tagForEdit.id = group.candidateGroupId;
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../partials/modal/tag-name-edit.html',
                    size: '',
                    resolve: {

                    }
                });
            }
        });
    };
    $rootScope.saveEditTagName = function () {
        var oldId = $rootScope.tagForEdit.id;
        CandidateGroup.editGroup({candidateGroupId: $rootScope.tagForEdit.id, name: $rootScope.tagForEdit.name},function (resp) {
            if(resp.status == 'ok') {
                notificationService.success($filter('translate')('Tag_name_saved'));
                $('.select2-search-choice').each(function () {
                    if($(this).children().first().html() == $scope.oldTagName) {
                        $(this).children().first().text($rootScope.tagForEdit.name)
                    }
                    angular.forEach($scope.groupIdsForSearch, function (tagId, tagIndex) {
                        if(tagId == oldId) {
                            $scope.groupIdsForSearch[tagIndex] = resp.object.candidateGroupId;
                        }
                    });
                    angular.forEach($scope.groupsForEdit, function (group) {
                        if(group.name == $scope.oldTagName) {
                            group.name = $rootScope.tagForEdit.name;
                            group.candidateGroupId = resp.object.candidateGroupId;
                        }
                    });
                    // angular.forEach($scope.groupsForEdit, function (group) {
                    //     if(group.name == $rootScope.tagForEdit.name && !tagSelected) {
                    //         tagSelected = true;
                    //         $rootScope.tagForEdit.id = group.candidateGroupId;
                    //     }
                    //     });
                    angular.forEach($scope.candidateGroups, function (group) {
                        if(group.name == $scope.oldTagName) {
                            group.name = $rootScope.tagForEdit.name;
                            group.candidateGroupId = resp.object.candidateGroupId;
                        }
                    })
                })
            }else {
                notificationService.error()
            }
        });
        $rootScope.closeModal();
    };
    $rootScope.addTagsForMass = function(){
        CandidateGroup.addList({
            names: $scope.getSelect2GroupForMass().split(","),
            candidatesIds: $scope.candidatesAddToVacancyIds
        }, function (res) {
            if(res.status == 'ok'){
                $scope.candidatesAddToVacancyIds = [];
                $scope.checkAllCandidates = false;
                angular.forEach($scope.tableParams.data,function(candidate){
                    candidate.added = false;
                });
                notificationService.success($filter('translate')('Tags added'));
                $rootScope.closeModal();
            }else{
                notificationService.error(res.message);
            }
        });
    };
    FileInit.initFileExcellUpload($rootScope, $scope, "candidate", {allowedType: ["xls", "xlsx"]}, $filter);

    function resetLanguagesSearCriterion() {
        $scope.chosenLangs = ['null', 'null', 'null'];
        $scope.staticSearchParam[0].languages = 'null';
        $scope.searchParam.languages = [];
        $scope.currentLang = 'null';
        $scope.level = '_undefined';
    }
}
controller.controller('CandidateController', ["$localStorage", "$translate", "Service", "$scope", "ngTableParams",
    "Candidate", "$location", "$rootScope", "$filter", "$cookies", "serverAddress", "notificationService", "googleService",
    "$window", "ScopeService", "frontMode", "Vacancy", "Company", "vacancyStages", "$sce", "$analytics", "Mail", "FileInit",
    "$uibModal", "Person", "$timeout", "CandidateGroup", "$anchorScroll", CandidateAllController]);
