controller.controller('CandidateOneController', ["CacheCandidates", "$localStorage", "$scope", "frontMode", "$translate", "googleService", "$location", "$routeParams", "Candidate",
    "Service", "$rootScope", "Person", "serverAddress", "FileInit", "notificationService", "$filter", "Vacancy",
    "Action", "vacancyStages", "Task", "File", "$sce", "$window", "Mail", "$uibModal", "$timeout", "$route", "Test", "CandidateGroup","sliderElements",
    function (CacheCandidates, $localStorage, $scope, frontMode, $translate, googleService, $location, $routeParams, Candidate, Service, $rootScope, Person, serverAddress, FileInit,
              notificationService, $filter, Vacancy, Action, vacancyStages, Task, File, $sce, $window, Mail, $uibModal, $timeout, $route, Test, CandidateGroup, sliderElements) {
        delete $rootScope.client;
        $scope.serverAddress = serverAddress;
        $rootScope.objectSize = null;
        $rootScope.isAddCandidates =  JSON.parse(localStorage.getItem("isAddCandidates"));
        $localStorage.remove("candidateForTest");
        $scope.loaders = {"history": false, "attachFile": false};

        if($location.$$absUrl.indexOf('&task=') != -1) {
            $scope.urlTaskId = $location.$$absUrl.split('&task=')[1];
        }
        if($localStorage.get('calendarShow') != undefined){
            $rootScope.calendarShow = $localStorage.get('calendarShow');
            if($rootScope.calendarShow == 'true'){
                $rootScope.calendarShow = true;
            }else if($scope.calendarShow == 'false'){
                $rootScope.calendarShow = false;
            }
        }else{
            $rootScope.calendarShow = true;
        }
        $scope.historyLimit = 20;
        $scope.lang = $translate.use();
        $scope.variableForTooltip = $sce.trustAsHtml($filter('translate')('Email log displays all your email correspondence with a candidate via email import')
            + $filter('translate')('This feature works only after you integrate your email with your CleverStaff account. If you did not integrate your email, do it here: https://cleverstaff.net/!#/email-integration')
            + $filter('translate')('CleverStaff updates the email history 1 time per 1 hour. The time and date of the last integration + the number of imported emails are listed below'));
        $rootScope.staticEmailTemplate = {
            candidateName: "John Dou",
            date: 1463749200000,
            recruiterName: $rootScope.me.fullName,
            recruiterEmail: $rootScope.me.emails.length > 0 ? $rootScope.me.emails[0].email : $rootScope.me.login
        };
        angular.forEach($rootScope.me.contacts, function (val) {
            if(val.contactType == 'phoneWork'){
                $rootScope.staticEmailTemplate.phoneWork = val.value;
            }
            if(val.contactType == 'skype'){
                $rootScope.staticEmailTemplate.skype = val.value;
            }
            if(val.contactType == 'linkedin'){
                $rootScope.staticEmailTemplate.linkedin = val.value;
            }
            if(val.contactType == 'facebook'){
                $rootScope.staticEmailTemplate.facebook = val.value;
            }
        });
        $scope.advicesLimit = 3;
        $scope.showAddLink = false;
        $scope.editCommentFlag = false;
        $scope.vacancy = null;
        $rootScope.inactiveVacancies = false;
        $scope.addLinkErrorShow = false;
        $scope.showAddedLinks = false;
        $scope.showAddedFiles = false;
        $scope.linked = false;
        $scope.currentTab = 'profile';
        $scope.showHistoryForPrint = false;
        $scope.showEditFileName = false;
        $rootScope.responsiblePersonsEdit =[];
        $scope.showMenuEdDelFile = false;
        $rootScope.showEmployedFields  = false;
        $rootScope.saveFromAdviceClicked = false;
        $scope.todayDate = new Date().getTime();
        $scope.onlyComments = false;
        $rootScope.showEditNameTask = false;
        $rootScope.editableTaskOuter = false;
        $rootScope.showEditTextTask = false;
        $scope.toggleDescription = true;
        $scope.todayDate = new Date().getTime();
        $rootScope.clickedSaveStatusOfCandidate = false;
        $rootScope.clickedAddVacancyInCandidate = false;
        $scope.deleteFromSystem = false;
        $rootScope.stageUrl = JSON.parse(localStorage.getItem('stageUrl'));

        function isDataForCandidatesEmpty(dataCandidates){
            var data;

            if(dataCandidates){
                data = dataCandidates;
            }else if(localStorage.getItem('getAllCandidates')){
                data = JSON.parse(localStorage.getItem('getAllCandidates'));
            }else if(localStorage.getItem('candidatesInStagesVac')){
                data = JSON.parse(localStorage.getItem('candidatesInStagesVac'));
            }

            if(!data){
                $rootScope.isAddCandidates = false;
                localStorage.setItem("isAddCandidates", false);
                data = [];
            }
        }

        isDataForCandidatesEmpty(Candidate.getCandidate);

        $('.showCommentSwitcher').prop("checked", !$scope.onlyComments);

        $rootScope.closeModal = function(){
            $scope.modalInstance.close();
        };

        $scope.closeModal = function (status) {
            $scope.changeStatus = status;
            $scope.modalInstance.close();
        };

        if($rootScope.me.recrutRole != 'client'){
            setTimeout(function(){
                if ($rootScope.questStatus && $rootScope.questStatus.addFirstCandidatePopup == 'Y'){
                    $scope.modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '../partials/modal/HelloQuest/helloQuestCandidateEnd.html',
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: false,
                        resolve: function(){

                        }
                    });
                }
            },0);
            $rootScope.continueQuest = function(){
                Person.changeUserParam({
                    name: 'onboardingQuestPopup',
                    value: 'Y'
                }, function (resp) {
                    if (resp.status == "ok") {
                        Person.changeUserParam({
                            name: 'addFirstCandidatePopup',
                            value: 'N'
                        }, function (resp){
                            $rootScope.updateQuestStatus();
                            $timeout(function(){
                                $rootScope.closeModal();
                                $location.path("/organizer");
                            },500)
                        });
                    }else{
                        notificationService.error(resp.message);
                    }
                });
            };
            //Person.changeUserParam({
            //    userId: 'userId',
            //    name: 'addFirstCandidatePopup',
            //    value: 'Y'
            //}, function (resp){});
        }
        $rootScope.newTask = {
            title: '',
            text: '',
            targetDate: '',
            candidateId: '',
            responsibleIds: [],
            type: 'Task'
        };
        $scope.addLinkToCandidate = {
            name: '',
            url: ''
        };
        $rootScope.changeStatusOfInterviewEmployed = {
            candidate: "",
            comment: "",
            status: "",
            date: null,
            exportgoogle: false
        };
        $scope.tests = [];
        $rootScope.changeStateInCandidate = {status: "", comment: "", placeholder: null, status_old: null};
        $scope.status = Candidate.getStatus();
        $scope.statusAssoc = Candidate.getStatusAssociative();
        Task.task($scope, $rootScope, $location, $translate, $uibModal, $route);
        $scope.showMap = $localStorage.get("vacancyShowMap") != undefined ? JSON.parse($localStorage.get("vacancyShowMap")) : true;
        $scope.showHideMap = function () {
            $scope.showMap = !$scope.showMap;
            $localStorage.set("vacancyShowMap", $scope.showMap)
        };

        $scope.candProgress = function () {
            Candidate.progressUpdate($scope, false);
        };
        $scope.addLinkToCandidate = {
            name: '',
            url: ''
        };
        if(google){
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
        }
        $rootScope.statusInter = Vacancy.getInterviewStatus();

        $rootScope.addCandidateInVacancySelect2Obj = {
            status: null
        };

        $rootScope.addCandidateInVacancy = {
            id: "",
            comment: "",
            status: "longlist",
            date: null,
            showSelect: "",
            showText: false,
            text: ""
        };
        $rootScope.errorMessageForAddCandidateInVacancy = {
            show: false,
            text: ""
        };

        //if (frontMode === 'war') {
        //    googleService.checkAuthTimeout();
        //}
        $scope.changeTab = function(tabs){
            $scope.currentTab = tabs;
        };

        $scope.toAddVacancyForm = function (state, showSelect, showText) {
            if ($scope.candidate.status != 'archived') {
                $rootScope.addCandidateInVacancy.showText = showText;
                $rootScope.addCandidateInVacancy.showSelect = showSelect;
                $rootScope.addCandidateInVacancy.inVacancy = false;
                $rootScope.addCandidateInVacancy.statusObject = null;
                $rootScope.VacancyStatusFiltered = null;
                $rootScope.candidateAddedInVacancy = null;
                $rootScope.addCandidateInVacancy.comment = '';
                $("#candidateAddToVacancy").select2("val", null);
                $rootScope.addCandidateInVacancy.status = state !== null ? state : {
                    value: "sent_offer",
                    withDate: false,
                    defaultS: true,
                    single: false,
                    added: true,
                    active_color: "longlist_color",
                    useAnimation: false,
                    count: 0,
                    forAdd: true
                };
                if($rootScope.me.recrutRole != 'client' && $rootScope.me.recrutRole != 'salesmanager'){
                    $scope.modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '../partials/modal/candidate-add-in-vacancy.html',
                        scope: $scope,
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
                        tinyMCE.remove();
                        delete $rootScope.vacancyForAddCandidate;
                    });
                }else{
                    notificationService.error($filter('translate')('Only recruiters, admins and freelancers can adding candidates in vacancy'));
                }
                $rootScope.candnotify = {};
                Candidate.getContacts({"candidateId": $scope.candidate.candidateId}, function (resp) {
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
                $rootScope.candnotify.fullName = $scope.candidate.fullName;
                //$rootScope.candnotify.send = $localStorage.get("candnotify") != "false";
                //Service.addCandidateInVacancy(state, showSelect, showText);
            } else {
                notificationService.error($filter('translate')('Remote candidates can not be added to the job'));
            }
            createEmailTemplateFunc($scope,$rootScope,'addCandidateInVacancyMCE', Mail, $location);

        };
        $rootScope.addVacancyInCandidate = function (sendTemplate, flag) {
            if(!$rootScope.candnotify.sendMail && flag){
                notificationService.error($filter('translate')("enter_email_candidate"));
                return;
            }
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
                $rootScope.addCandidateInVacancy.date = $('.addCandidateInvacancyPicker').datetimepicker('getDate') != null && ($rootScope.addCandidateInVacancy.status.withDate || $rootScope.addCandidateInVacancy.status.type == 'interview') ? $('.addCandidateInvacancyPicker').datetimepicker('getDate') : null;
                if($rootScope.addCandidateInVacancy.status){
                    vacancyAddInterview(Vacancy, vacancyId, null,
                        $scope.candidate.candidateId,
                        $rootScope.addCandidateInVacancy.comment,
                        ($rootScope.addCandidateInVacancy.status.customInterviewStateId)?$rootScope.addCandidateInVacancy.status.customInterviewStateId:$rootScope.addCandidateInVacancy.status.value,
                        $rootScope.addCandidateInVacancy.date, function (resp) {
                            resp.object.vacancyId.interviewStatusNotTouchable = resp.object.vacancyId.interviewStatus;
                            $scope.getLastEvent();
                            $scope.updateCandidate();
                            if (!$scope.candidate.interviews) {
                                $scope.candidate.interviews = [];
                            }
                            $rootScope.clickedAddVacancyInCandidate = false;
                            $rootScope.addCandidateInVacancy.comment = "";
                            $rootScope.addCandidateInVacancy.id = null;
                            $scope.candidate.interviews.push(resp.object);
                            angular.forEach($scope.candidate.interviews, function (interview) {
                                if (interview.vacancyId.interviewStatus == undefined) {
                                    interview.vacancyId.interviewStatus = "longlist,shortlist,interview,approved,notafit,declinedoffer";
                                    interview.vacancyId.interviewStatusNotTouchable = interview.vacancyId.interviewStatus
                                }
                            });
                            angular.forEach($scope.candidate.interviews, function(value){
                                var array = value.vacancyId.interviewStatus.split(",");
                                angular.forEach($scope.customStages, function(resp){
                                    if (value.state == resp.customInterviewStateId){
                                        value.state = resp.name
                                    }
                                    angular.forEach(array,function(res){
                                        if(resp.customInterviewStateId == res){
                                            array[array.indexOf(resp.customInterviewStateId)] = resp.name;
                                        }
                                    });
                                });
                                value.vacancyId.interviewStatus = array.toString();
                                if(value.vacancyId.status != 'completed' && value.vacancyId.status != 'deleted' && value.vacancyId.status != 'canceled'){
                                    $scope.participationInVacancy = true;
                                }
                            });
                            $rootScope.addCandidateInVacancy.status = null;
                            $rootScope.addCandidateInVacancy.date = null;
                            $rootScope.VacancyStatusFiltered = '';
                            $rootScope.candidateAddedInVacancy = null;
                            $rootScope.closeModal();
                        }, function (resp) {
                            $rootScope.clickedAddVacancyInCandidate = false;
                            $rootScope.errorMessageForAddCandidateInVacancy.show = true;
                            $rootScope.errorMessageForAddCandidateInVacancy.text = resp.message;
                        }, frontMode, notificationService, googleService, $scope.selectedCalendar != undefined ? $scope.selectedCalendar.id : null, $filter, $translate.use(), $rootScope);
                }else{
                    vacancyAddInterview(Vacancy, vacancyId, null,
                        $scope.candidate.candidateId,
                        $rootScope.addCandidateInVacancy.comment,
                        $rootScope.addCandidateInVacancy.status.value,
                        $rootScope.addCandidateInVacancy.date, function (resp) {
                            resp.object.vacancyId.interviewStatusNotTouchable = resp.object.vacancyId.interviewStatus;
                            $scope.getLastEvent();
                            $scope.updateCandidate();
                            if (!$scope.candidate.interviews) {
                                $scope.candidate.interviews = [];
                            }
                            $rootScope.clickedAddVacancyInCandidate = false;
                            $rootScope.addCandidateInVacancy.comment = "";
                            $rootScope.addCandidateInVacancy.id = null;
                            $scope.candidate.interviews.push(resp.object);
                            angular.forEach($scope.candidate.interviews, function (interview) {
                                if (interview.vacancyId.interviewStatus == undefined) {
                                    interview.vacancyId.interviewStatus = "longlist,shortlist,interview,approved,notafit,declinedoffer";
                                    interview.vacancyId.interviewStatusNotTouchable = interview.vacancyId.interviewStatus;
                                }
                            });
                            angular.forEach($scope.candidate.interviews, function(value){
                                var array = value.vacancyId.interviewStatus.split(",");
                                angular.forEach($scope.customStages, function(resp){
                                    if (value.state == resp.customInterviewStateId){
                                        value.state = resp.name
                                    }
                                    angular.forEach(array,function(res){
                                        if(resp.customInterviewStateId == res){
                                            array[array.indexOf(resp.customInterviewStateId)] = resp.name;
                                        }
                                    });
                                });
                                value.vacancyId.interviewStatus = array.toString();
                                if(value.vacancyId.status != 'completed' && value.vacancyId.status != 'deleted' && value.vacancyId.status != 'canceled'){
                                    $scope.participationInVacancy = true;
                                }
                            });
                            $rootScope.addCandidateInVacancy.status = null;
                            $rootScope.addCandidateInVacancy.date = null;
                            $rootScope.VacancyStatusFiltered = '';
                            $rootScope.candidateAddedInVacancy = null;
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
                        candidateId: $scope.candidate.candidateId,
                        fullName: $scope.candidate.fullName,
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
        $(".addFromAdvicePicker").datetimepicker({
            format: "dd/mm/yyyy hh:ii",
            startView: 2,
            minView: 0,
            weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
            autoclose: true,
            language: $translate.use()
        }).on('changeDate', function (data) {
            $rootScope.addFromAdvice.date = data.date;
        }).on('hide', function () {
            if ($('.addFromAdvicePicker').val() == "") {
                $rootScope.addFromAdvice.date = null;
            }
            $('.addFromAdvicePicker').blur();
        });
        $rootScope.addFromAdvice = {
            id: "",
            comment: "",
            status: "longlist",
            date: null,
            showSelect: "",
            showText: false,
            text: "",
            state: ""
        };
        $rootScope.errorAddFromAdvice = {
            show: false,
            text: ""
        };
        $scope.showFromAdvice = function (vacancyId, vacancyPosition) {
            var vacancyStatus = Vacancy.interviewStatusNew();
            $rootScope.addFromAdvice.statusObject = $filter('filter')(vacancyStatus[0].status, {forAdd: true});
            if (vacancyId.interviewStatus) {
                var array = vacancyId.interviewStatus.split(",");
                var sortedStages = [];
                angular.forEach(vacancyStatus, function (vStatus) {
                    if (vStatus.used) {
                        var statusNotDef = $filter('filter')(vStatus.status, {defaultS: false});
                        angular.forEach(statusNotDef, function(statusND) {
                            angular.forEach(array, function(statusA) {
                                if (statusND.value == statusA) {
                                    statusND.added = true;
                                } else if(statusND.value != statusA && (statusND.value == 'shortlist' || statusND.value == 'interview')){
                                    statusND.added = false;
                                }
                            })
                        })
                    }
                });
                var i = 0;
                angular.forEach(array, function(resp) {
                    angular.forEach(vacancyStatus, function(vStatus) {
                        if (vStatus.used) {
                            if(i == 0){
                                angular.forEach($scope.customStages, function(res) {
                                    res.value = res.name;
                                    res.movable = true;
                                    res.added = false;
                                    res.count = 0;
                                    vStatus.status.push(res);
                                    i = i+1;
                                });
                            }
                            angular.forEach(vStatus.status, function(vStatusIn) {
                                if(resp == vStatusIn.value){
                                    vStatusIn.added = true;
                                    sortedStages.push(vStatusIn);
                                } else if(resp == vStatusIn.customInterviewStateId){
                                    vStatusIn.added = true;
                                    sortedStages.push(vStatusIn);
                                }
                            })
                        }
                    })
                });
                $scope.VacancyStatusFiltered = sortedStages;
                $rootScope.addFromAdvice.statusObject = $scope.VacancyStatusFiltered;
            }
            $('.addFromAdvicePicker').val("");
            $rootScope.addFromAdvice.status = {
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
            $rootScope.addFromAdvice.vacancyId = vacancyId.vacancyId;
            $rootScope.addFromAdvice.title = vacancyPosition;
            $rootScope.addFromAdvice.state = "candidate";
            $('.addFromAdvice').modal('show');
            $rootScope.candnotify = {};
            Candidate.getContacts({"candidateId": $scope.candidate.candidateId}, function (resp) {
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
            $rootScope.candnotify.fullName = $scope.candidate.fullName;
            //if ($localStorage.get("candnotify") == "false") {
            //    $rootScope.candnotify.send = false;
            //} else {
            //    $rootScope.candnotify.send = true;
            //}
        };

        vacancyStages.get(function(resp){
            $scope.customStages = resp.object.interviewStates;
            $rootScope.customStages = resp.object.interviewStates;
            $scope.updateCandidate();
        });

        $scope.updateCandidate = function(){
            $scope.showAddedLinks = false;
            $scope.showAddedFiles = false;
            $rootScope.loading = true;
            Candidate.one({"localId": $routeParams.id}, function (resp) {
                if (angular.equals(resp.status, "error")) {
                    notificationService.error($filter('translate')('candidate not found'));
                    $location.path('/candidates');
                    return;
                }
                if($rootScope.me.recrutRole == 'client' || $rootScope.me.recrutRole == 'freelancer' || $rootScope.me.recrutRole == 'researcher'){
                    if(resp.object.access == false){
                        $scope.limitedAccessCandidate();
                    }
                }
                //var actions = resp.object.actions.objects;
                //if (actions) {
                //    angular.forEach(actions, function() {
                //        for (var i = 0; i <= actions.length - 1; i++) {
                //            var action = actions[i];
                //            if (action.descr.length > 0 && (action.type != 'candidate_add_to_group' && action.type != 'candidate_remove_from_group' && action.type != 'candidate_add_file' && action.type != 'candidate_remove_file')) {
                //                $scope.lastMessage = action;
                //                break;
                //            }
                //        }
                //    });
                //}
                if ($scope.lastMessage == null) {
                    Service.history({
                        "page": {"number": 0, "count": 1},
                        type: "candidate_message",
                        "candidateId": resp.object.candidateId
                    }, function (res) {
                        if (res.objects != undefined && res.objects.length != 0) {
                            $scope.lastMessage = res.objects[0];
                        }

                    });
                }

                if (resp.object.region != undefined && resp.object.region.lat != undefined && resp.object.region.lng != undefined) {
                    $scope.map.center.latitude = resp.object.region.lat;
                    $scope.map.center.longitude = resp.object.region.lng;

                    $scope.marker.coords.latitude = resp.object.region.lat;
                    $scope.marker.coords.longitude = resp.object.region.lng;
                }
                $scope.urlTaskId = getUrlVars($location.$$absUrl).task;
                //$location.hash('');
                var name = "";
                name = resp.object.fullName != undefined ? name + resp.object.fullName.replace(/\W+/g, '_') : "";
                if(resp.object.position.length > 1){
                    name = resp.object.position != undefined ? name + "_" + resp.object.position.replace(/\W+/g, '_') : "";
                }
                if (name.length > 0) {
                    $location.search($filter('transliteration')(name)).replace();
                }
                if (!resp.object.fullName && resp.object.source == 'add_from_hh') {
                    $rootScope.title = $filter('translate')("Hidden by hh") + " | CleverStaff";
                }
                else if (!resp.object.fullName) {
                    $rootScope.title = $filter('translate')("Hidden") + " | CleverStaff";
                }
                else {
                    $rootScope.title = resp.object.fullName + " | CleverStaff";
                }
                if (resp.object.interviews !== undefined) {
                    angular.forEach(resp.object.interviews, function (interview) {
                        if (interview.vacancyId.interviewStatus === undefined) {
                            interview.vacancyId.interviewStatus = "longlist,shortlist,interview,approved,notafit,declinedoffer"
                        }
                    })
                }
                $scope.candidate = resp.object;
                $rootScope.candidate = resp.object;
                $rootScope.localIdOfMerged = $scope.candidate.localId;
                //$localStorage.set('candidateForTest', $rootScope.candidate);
                $scope.locationBeforeCustomFields = $location.$$path.replace('/candidates/' + $scope.candidate.localId, 'candidates');
                $localStorage.set('previousHistoryCustomFields', $scope.locationBeforeCustomFields);
                $scope.changeStatus = $scope.candidate.status;
                cascadeStages();

                $scope.imgWidthFunc();
                $rootScope.newTask.candidateId = $scope.candidate.candidateId;
                angular.forEach($scope.candidate.interviews, function(value){
                    value.vacancyId.interviewStatusNotTouchable = value.vacancyId.interviewStatus;
                    var array = value.vacancyId.interviewStatus.split(",");
                    angular.forEach($scope.customStages, function(resp){
                        if (value.state == resp.customInterviewStateId){
                            value.state = resp.name;
                            value.customInterviewStateId = resp.customInterviewStateId
                        }
                        angular.forEach(array,function(res){
                            if(resp.customInterviewStateId == res){
                                array[array.indexOf(resp.customInterviewStateId)] = resp.name;
                            }
                        });
                    });
                    value.vacancyId.interviewStatus = array.toString();
                    if(value.vacancyId.status != 'completed' && value.vacancyId.status != 'deleted' && value.vacancyId.status != 'canceled'){
                        $scope.participationInVacancy = true;
                    }else {
                        $rootScope.inactiveVacancies = true;
                    }
                });
                $rootScope.candidateForUpdateResume = resp.object;
                if($scope.candidate.files){
                    if($scope.candidate.files.length != undefined && $scope.candidate.files.length != 0){
                        angular.forEach($scope.candidate.files, function (val) {
                            if(val.url){
                                $scope.showAddedLinks = true;
                            }
                            if(!val.url){
                                $scope.showAddedFiles = true;
                            }
                            initDocuments(val);
                        });
                    }
                } else{
                    $scope.showAddedLinks = false;
                    $scope.showAddedFiles = false;
                }

                var multipleContacts = {
                    homepage: [],
                    facebook: [],
                    linkedin: [],
                    googleplus: [],
                    github: [],
                    email: [],
                    telegram: []
                };
                $scope.countEmail = 0;
                angular.forEach($scope.candidate.contacts, function (contacts) {
                    switch (contacts.type){
                        case 'homepage':
                        case 'linkedin':
                        case 'facebook':
                        case 'googleplus':
                        case 'github':
                        case 'email':
                        case 'telegram':
                            multipleContacts[contacts.type] = contacts.value.split(/[\s,";"]+/);
                            break;
                    }
                    if(contacts.type == 'email'){
                        $scope.countEmail = 1;
                    }
                });

                $scope.multipleContacts = {
                    homepage: [],
                    facebook: [],
                    linkedin: [],
                    googleplus: [],
                    github: [],
                    email: [],
                    telegram: []
                };

                for(key in multipleContacts) {
                    multipleContacts[key].forEach((currentVal) => {
                        $scope.multipleContacts[key].push(currentVal.trim());
                    });
                }
                console.log($scope.multipleContacts, '$scope.multipleContacts')
                //getcandidateproperties start
                Candidate.getCandidateProperties({candidateId: $scope.candidate.candidateId}, function (res) {
                    if(res.status == 'ok' && res.object) {
                        $scope.candidateProperties = res.object;
                        //setGroups start
                        if ($scope.candidate.groups !== undefined) {
                            if ($scope.candidateProperties.candidateGroups !== undefined) {
                                $scope.setGroups($scope.candidateProperties.candidateGroups, $scope.candidate.groups);
                            } else {
                                var emptyList = [];
                                $scope.setGroups(emptyList, $scope.candidate.groups);
                            }
                        } else {
                            var emptyList = [];
                            if ($scope.candidateProperties.candidateGroups != undefined) {
                                $scope.setGroups($scope.candidateProperties.candidateGroups, emptyList);
                            } else {
                                $scope.setGroups(emptyList, emptyList);
                            }
                        }
                        //setGroups end
                        //testAppointments start
                        if($rootScope.me.recrutRole == 'admin' || $rootScope.me.recrutRole == 'recruter') {
                            if($scope.candidateProperties.testAppointmentContents !== undefined) {
                                $scope.totalTestsCount = $scope.candidateProperties.testTestTotaElementsl;
                                $scope.tests = [];
                                for(var iter = 0; iter < 3 && iter < $scope.candidateProperties.testAppointmentContents.length; iter++ ) {
                                    $scope.tests[iter] = $scope.candidateProperties.testAppointmentContents[iter];
                                }
                            }else if (angular.equals(resp.status, "error")){
                                notificationService.error(resp.message);
                            }
                        }
                        //testAppointments end
                        //updateCand links start
                        $scope.updateCandidateLinksNew = function(){
                            if ($scope.candidateProperties.candidateLinks !== undefined){
                                $scope.linkedCandidate = $scope.candidateProperties.candidateLinks;
                                angular.forEach($scope.linkedCandidate,function(res){
                                    $scope.linkedOneCandidate = res;
                                    if(res.resourseType == 'linkedin' ||
                                        res.resourseType == 'superJob' ||
                                        res.resourseType == 'workua' ||
                                        res.resourseType == 'trelloCardId' ||
                                        res.resourseType == 'rabotaua' ||
                                        res.resourseType == 'recruforce' ||
                                        res.resourseType == 'hh' ||
                                        res.resourseType == 'zoho_id' ||
                                        res.resourseType == 'firebird_id' ||
                                        res.resourseType == 'linkedin_d' ||
                                        res.resourseType == 'cvlv' ||
                                        res.resourseType == 'estaffId'){
                                        $scope.linked = true;
                                    }else if(res.resourseType == 'linkedinNew'){
                                        res.resourseType = 'linkedinNew' ? 'linkedin' : 'linkedin';
                                        $scope.linked = true;
                                    }
                                });
                            }
                        };
                        $scope.updateCandidateLinksNew();
                        //updateCand links end

                        //updateTasks start
                        $scope.candidateTasks = $scope.candidateProperties.taskContents;
                        if($scope.urlTaskId){
                            $rootScope.responsiblePersonsEdit = [];
                            angular.forEach($scope.candidateTasks, function(resp){
                                if(resp.taskId == $scope.urlTaskId){
                                    $rootScope.editableTask = resp;
                                    $scope.showModalEditTaskToCandidate($rootScope.editableTask);
                                    $location.$$absUrl = $location.$$absUrl.split("&")[0];
                                }
                            });
                            if($rootScope.editableTask && $location.$$absUrl.indexOf('&task=') == -1){
                                $location.$$absUrl = $location.$$absUrl + '&task=' + $scope.urlTaskId;
                                angular.forEach($rootScope.editableTask.responsiblesPerson,function(resp){
                                    angular.forEach($rootScope.persons,function(res){
                                        if(resp.responsible.userId == res.userId){
                                            $rootScope.responsiblePersonsEdit.push(res);
                                            res.notShown = true;
                                            //$rootScope.persons.splice($rootScope.persons.indexOf(res), 1);
                                        }
                                    });
                                });
                                $('.editTaskInCandidate').modal('setting',{
                                    onHide: function(){
                                        $scope.urlTaskId = null;
                                        $location.$$absUrl = $location.$$absUrl.split("&")[0];
                                        $scope.$apply();
                                    }
                                }).modal('show');
                            }
                        }
                        //updateTasks end
                    }
                    //setGroups start
                    if ($scope.candidate.groups != undefined) {
                        var groupNameList = [];
                        angular.forEach($scope.candidate.groups, function (val, key) {
                            groupNameList.push(val.name);
                        });
                        $scope.setSelect2Group(groupNameList);
                    }
                    //setGroups end
                });
                //getcandidateproperties end

                $('#candidateEducation').html($scope.candidate.education);
                $('.candidateCoreSkills').html($scope.candidate.coreSkills);


                Service.history({
                    "candidateId": $scope.candidate !== undefined ? $scope.candidate.candidateId : null,
                    "page": {"number": 0, "count": $scope.historyLimit},
                    "onlyWithComment": false
                }, function (res) {
                    historyButton($scope, res, Service, CacheCandidates);
                });


                $scope.objectId = resp.object.candidateId;
                $rootScope.candidateIdForVacancyId = resp.object.candidateId;
                $("#descr").html($scope.candidate.descr);
                //Candidate.progressUpdate($scope, false);
                $scope.candProgress();
                FileInit.initFileOption($scope, "candidate", undefined, $filter);
                FileInit.initFileOptionForEditFromResume($scope, "candidate");
                $scope.fileForSave = [];
                $scope.linksForSave = [];
                $rootScope.fileForSave = [];    /*For modal window*/

                FileInit.initVacancyTemplateInCandidateFileOption($scope, $rootScope, "", "", false, $filter);
                $scope.callbackFileTemplateInCandidate = function(resp, names) {
                    $scope.fileForSave.push({"fileId": resp, "fileName": names});
                    $rootScope.fileForSave.push({"fileId": resp, "fileName": names});
                };
                $scope.removeFile = function(id) {
                    Candidate.removeFile({"candidateId": $scope.candidate.candidateId, "fileId": id}, function (resp) {
                        if (resp.status == "ok") {
                            $scope.getLastEvent();
                        }
                    });
                    $scope.updateCandidate();
                    angular.forEach($scope.fileForSave, function(val, ind) {
                        if (val.attId === id) {
                            $scope.fileForSave.splice(ind, 1);
                        }
                    });
                    if ($scope.candidate.files.length === 0) {
                        delete $scope.candidate.files;
                        Candidate.progressUpdate($scope, false);
                    }
                };
                $rootScope.removeFile = function(id) {
                    angular.forEach($rootScope.fileForSave, function(val, ind) {
                        if (val.attId === id) {
                            $rootScope.fileForSave.splice(ind, 1);
                        }
                    });
                };
                $scope.updateCandidateLinks = function(){
                    Candidate.getCandidateLinks({
                        "id": $scope.candidate.candidateId
                    },function(resp){
                        $scope.linkedCandidate = resp.object;
                        angular.forEach($scope.linkedCandidate,function(res){
                            $scope.linkedOneCandidate = res;
                            if(res.resourseType == 'linkedin' ||
                                res.resourseType == 'superJob' ||
                                res.resourseType == 'workua' ||
                                res.resourseType == 'trelloCardId' ||
                                res.resourseType == 'rabotaua' ||
                                res.resourseType == 'recruforce' ||
                                res.resourseType == 'hh' ||
                                res.resourseType == 'zoho_id' ||
                                res.resourseType == 'firebird_id' ||
                                res.resourseType == 'linkedin_d' ||
                                res.resourseType == 'cvlv' ||
                                res.resourseType == 'estaffId'){
                                $scope.linked = true;
                            }else if(res.resourseType == 'linkedinNew'){
                                res.resourseType = 'linkedinNew' ? 'linkedin' : 'linkedin';
                                $scope.linked = true;
                            }
                        });
                    });
                };
                $scope.updateTasks = function(){
                    Task.get({
                        //'creator': $rootScope.me.userId,
                        'candidateId': $scope.candidate.candidateId
                    },function(resp){
                        $scope.candidateTasks = resp.objects;
                        if($scope.urlTaskId){
                            $rootScope.responsiblePersonsEdit = [];
                            angular.forEach($scope.candidateTasks, function(resp){
                                if(resp.taskId == $scope.urlTaskId){
                                    $rootScope.editableTask = resp;
                                }
                            });
                            if($rootScope.editableTask && $location.$$absUrl.indexOf('&task=') == -1){
                                $location.$$absUrl = $location.$$absUrl + '&task=' + $scope.urlTaskId;
                                angular.forEach($rootScope.editableTask.responsiblesPerson,function(resp){
                                    angular.forEach($rootScope.persons,function(res){
                                        if(resp.responsible.userId == res.userId){
                                            $rootScope.responsiblePersonsEdit.push(res);
                                            res.notShown = true;
                                            //$rootScope.persons.splice($rootScope.persons.indexOf(res), 1);
                                        }
                                    });
                                });
                                $('.editTaskInCandidate').modal('setting',{
                                    onHide: function(){
                                        $scope.urlTaskId = null;
                                        $location.$$absUrl = $location.$$absUrl.split("&")[0];
                                        $scope.$apply();
                                    }
                                }).modal('show');
                            }
                        }
                    })
                };
                $rootScope.loading = false;
            }, function (err) {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });

        };
        $scope.editTagName = function (tagObject) {
            $rootScope.tagForEdit = {};
            $rootScope.tagForEdit.name = $(tagObject).parent().children().first().html();
            $scope.oldTagName = $rootScope.tagForEdit.name;
            angular.forEach($scope.candidate.groups, function (group) {
                if(group.name == $rootScope.tagForEdit.name) {
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
            var newGroupList = $scope.getSelect2Group().split(",");
            if(newGroupList.indexOf($rootScope.tagForEdit.name) === -1) {
                CandidateGroup.editGroup({candidateGroupId: $rootScope.tagForEdit.id, name: $rootScope.tagForEdit.name},function (resp) {
                    if(resp.status == 'ok') {
                        notificationService.success($filter('translate')('Tag_name_saved'));
                        var beforeEdit = $scope.getSelect2Group().split(",");
                        angular.forEach(beforeEdit, function (tagName, index) {
                            if( tagName == $scope.oldTagName) {
                                beforeEdit[index] = $rootScope.tagForEdit.name;
                                $scope.setSelect2Group(beforeEdit);
                                angular.forEach($scope.candidate.groups, function (group) {
                                    if(group.name == $scope.oldTagName) {
                                        group.name = $rootScope.tagForEdit.name;
                                        group.candidateGroupId = resp.object.candidateGroupId;
                                    }
                                });
                                $('a.select2-search-choice-edit').attr("title", $filter('translate')('Edit tag for all candidates'));
                                $('a.select2-search-choice-edit').off().on('click',function (e) {
                                    $scope.editTagName(e.currentTarget);
                                });
                            }
                        });
                        // $('.select2-search-choice').each(function () {
                        //     if($(this).children().first().html() == $scope.oldTagName) {
                        //         $(this).children().first().text($rootScope.tagForEdit.name)
                        //     }
                        //
                        // })
                    }else {
                        notificationService.error(resp.message);
                    }
                });
            }else {
                notificationService.error($filter('translate')('This tag has already assigned'));
            }

            $rootScope.closeModal();
        };
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
            //$rootScope.persons = $scope.persons;
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
                }else if(width >= 201){
                    $('#page-avatar').css({'width': '100%', 'height': 'auto'});
                }else{
                    $('#page-avatar').css({'width': 'inherit', 'height': 'inherit', 'display': 'block', 'margin': '0 auto'});
                }
            };
            img.src = $location.$$protocol + '://' + $location.$$host + $scope.serverAddress + '/getapp?id=' + $scope.candidate.photo + '&d=' + $rootScope.me.personId;
        };
        $scope.pathName = "candidate";
        $scope.callbackFile = function (resp, name) {
            if (!$scope.candidate.files) {
                $scope.candidate.files = [];
            }
            $scope.candidate.files.push(resp);
            if ($scope.candidate.files.length > 0) {
                Candidate.progressUpdate($scope, false);
            }
            $scope.getLastEvent();
        };

        $scope.removeFile = function (id) {
            Candidate.removeFile({"candidateId": $scope.candidate.candidateId, "fileId": id}, function (resp) {
                if (resp.status == "ok") {
                    $scope.getLastEvent();
                }
            });
            $scope.updateCandidate();
            if ($scope.candidate.files.length === 0) {
                delete $scope.candidate.files;
                Candidate.progressUpdate($scope, false);
            }
        };

        $rootScope.changeResponsibleUserInCandidate = {
            id: "",
            comment: ""
        };

        //$scope.showModalAddCommentToCandidate = function () {
        //    $('.addMessageInCandidate').modal('show');
        //};
        $scope.showModalAddCommentToCandidate = function () {
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/add-comment-candidate.html',
                size: '',
                resolve: {

                }
            });
            $(document).unbind("keydown").keydown(function(e) {
                if (e.ctrlKey == true && e.which == 13) {
                    $rootScope.addCommentInCandidate();
                }
            });
        };

        $rootScope.commentCandidate = {
            comment: "",
            loading: false
        };
        $rootScope.addCommentInCandidate = function () {
            if ($rootScope.commentCandidate.comment != undefined && $rootScope.commentCandidate.comment.length > 0) {
                $rootScope.commentCandidate.loading = true;
                Candidate.setMessage({
                    comment: $rootScope.commentCandidate.comment,
                    candidateId: $scope.candidate.candidateId
                }, function (resp) {
                    //$scope.lastMessage = resp.object.actions.objects[0];
                    $rootScope.commentCandidate.loading = false;
                    //$('.addMessageInCandidate').modal('hide');
                    $rootScope.closeModal();
                    $rootScope.commentCandidate.comment = null;
                    if (resp.status == 'ok') {
                        $scope.getLastEvent();
                    }
                    notificationService.success($filter('translate')('Comment added'));
                }, function (error) {
                    $rootScope.commentCandidate.loading = false;
                    notificationService.error(error.message);
                });
            } else {
                notificationService.error($filter('translate')('enter a comment'));
            }
        };

        $scope.showAddResponsibleUser = function (id) {
            //$('.responsibleOfCandidate.modal').modal('show');
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/candidate-adding-responsible.html',
                size: '',
                resolve: function(){

                }
            });
            $rootScope.changeResponsibleUserInCandidate.id = id;
        };

        $rootScope.saveResponsibleUserInCandidate = function () {
            if (!$rootScope.clickedSaveResponsibleUserInCandidate) {
                $rootScope.clickedSaveResponsibleUserInCandidate = true;
                Candidate.setResponsible({
                    candidateId: $scope.candidate.candidateId,
                    personId: $rootScope.changeResponsibleUserInCandidate.id,
                    comment: $rootScope.changeResponsibleUserInCandidate.comment,
                    lang: $translate.use()
                }, function (resp) {
                    if (resp.status == "ok") {
                        $scope.candidate.responsible = resp.object.responsible;
                        $scope.responsibleName = $scope.candidate.responsible.fullName;
                        notificationService.success($filter('translate')('set responsible'));
                        $scope.getLastEvent();
                    }
                    $rootScope.closeModal();
                    //$('.responsibleOfCandidate.modal').modal('hide');
                    $rootScope.changeResponsibleUserInCandidate.id = "";
                    $rootScope.changeResponsibleUserInCandidate.commnet = "";
                    $rootScope.clickedSaveResponsibleUserInCandidate = false;

                }, function (err) {
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                });
            }
        };
        $scope.showChangeStatusOfCandidate = function (status) {
            //$('.changeStatusOfCandidate.modal').modal('show');
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/candidate-change-status-in-candidate.html',
                scope: $scope,
                size: '',
                scope: $scope,
                resolve: function(){

                }
            });

            $rootScope.changeStateInCandidate.status = status;
            $rootScope.changeStateInCandidate.status_old = $scope.candidate.status;
            $rootScope.changeStateInCandidate.placeholder = $filter('translate')('write_a_comment_why_do_you_change_candidate_status');

        };

        $rootScope.saveStatusOfCandidate = function () {
            if ($rootScope.changeStateInCandidate.status != "" && !$rootScope.clickedSaveStatusOfCandidate) {
                $rootScope.clickedSaveStatusOfCandidate = true;
                $rootScope.changeStateInCandidate.status === 'our employee'? $rootScope.changeStateInCandidate.status = 'work' : null;
                Candidate.changeState({
                    candidateId: $scope.candidate.candidateId,
                    comment: $rootScope.changeStateInCandidate.comment,
                    candidateState: $rootScope.changeStateInCandidate.status,
                }, function (resp) {
                    if (resp.status == "ok") {
                        $scope.candidate.status = resp.object.status;
                        $scope.changeStatusModel = $scope.candidate.status;
                        notificationService.success($filter('translate')('set_status_1') + $scope.candidate.fullName + $filter('translate')('set_status_2'));
                        if($scope.onlyComments){
                            $scope.showCommentsFirstTime();
                        }else{
                            $scope.showDetails();
                        }
                    }
                    $rootScope.clickedSaveStatusOfCandidate = false;
                    $rootScope.closeModal();
                    //$('.changeStatusOfCandidate.modal').modal('hide');
                    $rootScope.changeStateInCandidate.status = "";
                    $rootScope.changeStateInCandidate.comment = "";
                }, function (err) {
                    $('.changeStatusOfCandidate.modal').modal('hide');
                    $rootScope.clickedSaveStatusOfCandidate = false;
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                });
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
        $scope.toEdit = function (id) {
            if($rootScope.me.recrutRole != 'client'){
                if($scope.candidate.status != 'archived'){
                    Service.toEditCandidate(id);
                }else{
                    notificationService.error($filter('translate')('Remote candidates can not be edited.'));
                }
            }else{
                notificationService.error($filter('translate')('Only recruiters, admins and freelancers can editing candidates'));
            }
        };

        $rootScope.changeStatusOfInterviewInVacancy = {
            candidate: {},
            comment: "",
            status: "",
            date: null,
            exportgoogle: false
        };
        $rootScope.addCandidateInInterview = {
            id: "",
            comment: "",
            status: "longlist",
            buttonClicked: false,
            date: null,
            showSelect: "",
            showText: false,
            text: "",
            addedInVacancy: false,
            select2Obj: null
        };

        $scope.showChangeStatus = function (vacancyId) {
            var popWithstages = 'changeStatePop' + vacancyId,
                labelsPosition = ($('#' + popWithstages).children().length * 25)/2;

            $('#' + popWithstages).css({
                "top" : "-" + labelsPosition + "px"
            });


            if ($scope.showChangeStatusValue == vacancyId) {
                $scope.showChangeStatusValue = null;
            } else {
                $scope.showChangeStatusValue = vacancyId;
            }
        };

        $scope.toChangeStatusInterview = function (status, vacancyId, interviewStatusNotTouchable, vacancyPosition, vacancy) {
            var array = interviewStatusNotTouchable.split(",");
            var vacancyStatus = Vacancy.interviewStatusNew();
            if (vacancyStatus) {
                angular.forEach(vacancyStatus, function (v) {
                    if (v.status) {
                        angular.forEach(v.status, function (s) {
                            angular.forEach($scope.customStages, function(resp){
                                if(resp.name == status){
                                    angular.forEach(array, function(res){
                                        if(res == resp.customInterviewStateId){
                                            s = resp;
                                        }
                                    });
                                }
                            });
                            if (status == s.value) {
                                $rootScope.changeStatusOfInterviewInVacancy.status = s;
                            }
                        });
                    }
                });
            }
            if ($rootScope.changeStatusOfInterviewInVacancy.status == undefined) {
                $rootScope.changeStatusOfInterviewInVacancy.status = {
                    value: status,
                    withDate: false,
                    defaultS: true,
                    single: false,
                    added: true,
                    active_color: "longlist_color",
                    useAnimation: false,
                    count: 0,
                    forAdd: true
                };
            }

            $rootScope.changeStatusOfInterviewInVacancy.vacancyId = vacancyId;
            $rootScope.changeStatusOfInterviewInVacancy.position = vacancyPosition;
            $rootScope.changedStatusVacancy = vacancy;
            if ($scope.candidate.state == 'approved' && $rootScope.me.recrutRole != 'admin') {
                notificationService.error($filter('translate')('Transfer from the status of approved can only Admin'));
                return;
            }
            $rootScope.changeStatusOfInterviewInVacancy.candidate.candidateId = $scope.candidate;
            $rootScope.changeStatusOfInterviewInVacancy.approvedCount = $scope.approvedCount;
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/candidate-change-status-in-vacancy.html?b=2',
                scope: $scope,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            $scope.modalInstance.closed.then(function() {
                $rootScope.candnotify.show = false;
                tinyMCE.remove()
            });
            $scope.modalInstance.opened.then(function(){

                createEmailTemplateFunc($scope,$rootScope,'changeStatusCandidateInVacancyMCE', Mail, $location);
                $rootScope.changeTemplateInChangeStatusCandidate($rootScope.changeStatusOfInterviewInVacancy.status);

                new Promise((resolve, reject) =>{
                   let interval = setInterval(() => {
                       let changeStatusOfInterviewInVacancyPick = $(".changeStatusOfInterviewInVacancyPick"),
                           changeStatusOfInterviewEmployed = $('.changeStatusOfInterviewEmployed');

                       if(changeStatusOfInterviewInVacancyPick.length && changeStatusOfInterviewEmployed.length){
                           clearInterval(interval);
                           resolve({changeStatusOfInterviewInVacancyPick, changeStatusOfInterviewEmployed});
                       }
                   },0);
                })
                    .then((elements) =>{
                        elements['changeStatusOfInterviewInVacancyPick'].datetimepicker({
                            format: "dd/mm/yyyy hh:ii",
                            startView: 2,
                            minView: 0,
                            weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                            autoclose: true,
                            language: $translate.use()
                        }).on('changeDate', function (data) {
                            $rootScope.changeStatusOfInterviewInVacancy.date = data.date;
                        }).on('hide', function () {
                            if ($('.changeStatusOfInterviewInVacancyPick').val() == "") {
                                $rootScope.changeStatusOfInterviewInVacancy.date = null;
                            }else{
                                $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[interview date and time\]\]/g, $filter('dateFormat2')($('.changeStatusOfInterviewInVacancyPick').datetimepicker('getDate').getTime(), true));
                                $rootScope.emailTemplateInModal.title = $rootScope.emailTemplateInModal.title.replace(/\[\[interview date and time\]\]/g, $filter('dateFormat2')($('.changeStatusOfInterviewInVacancyPick').datetimepicker('getDate').getTime(), true));
                                tinyMCE.get('changeStatusCandidateInVacancyMCE').setContent($rootScope.emailTemplateInModal.text);
                            }
                            $('.changeStatusOfInterviewInVacancyPick').blur();
                        });

                        elements["changeStatusOfInterviewEmployed"].datetimepicker({
                            format: "dd/mm/yyyy",
                            startView: 2,
                            minView: 2,
                            autoclose: true,
                            weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                            language: $translate.use()
                        }).on('changeDate', function (data) {
                            $rootScope.changeStatusOfInterviewEmployed.date = data.date;
                        }).on('hide', function () {
                            if ($('.changeStatusOfInterviewEmployed').val() == "") {
                                $rootScope.changeStatusOfInterviewEmployed.date = null;
                            }
                            $('.changeStatusOfInterviewEmployed').blur();
                        });
                        $scope.$apply();
                    });
            });

            $scope.showChangeStatusValue = null;
            $rootScope.candnotify = {};
            var email = "";
            angular.forEach($scope.candidate.contacts, function (c) {
                if (c.type == "email") {
                    email = c.value;
                }
            });
            $rootScope.candnotify.emails = email.replace(/ /gi, "").split(",");
            $rootScope.candnotify.sendMail = (email && email.length)? email.split(/[',',' ']/gi)[0] : '';

            $rootScope.candnotify.show = false;
            $rootScope.candnotify.fullName = $scope.candidate.fullName;
            if (status == 'approved') {
                $rootScope.showEmployedFields = true;
                $rootScope.probationaryPeriod = null;
            } else {
                $rootScope.showEmployedFields = false;
            }
            //$rootScope.candnotify.send = $localStorage.get("candnotify") != "false";
        };

        $rootScope.changeStatusInAddCandidate = function () {
            if (!$rootScope.addCandidateInInterviewbuttonClicked) {
                var changeObj = $rootScope.changeStatusOfInterviewInVacancy;
                var candidateObj = $rootScope.addCandidateInInterview;
                var date = $('.addCandidateInInterviewPicker').datetimepicker('getDate') != null && candidateObj.status.withDate ? $('.addCandidateInInterviewPicker').datetimepicker('getDate') : null;

                if (changeObj.candidate.state == 'approved' && $rootScope.me.recrutRole != 'admin') {
                    $rootScope.errorMessageForAddCandidate.text = $filter('translate')('Transfer from the status of approved can only Admin');
                    $rootScope.errorMessageForAddCandidate.show = true;
                    return;
                }
                changeObj.status = candidateObj.status;
                changeObj.comment = candidateObj.comment;
                $rootScope.addCandidateInInterviewbuttonClicked = true;
                $rootScope.saveStatusInterviewInVacancy(date);
                $('.addCandidateInInterviewPicker').val("");
                $('.addCandidateInInterview.modal').modal('hide');
            }
        };

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
        $scope.initDirective = {};

        $rootScope.saveStatusInterviewInVacancy = function (customDate, flag, sendEmail) {
            if(!$rootScope.candnotify.sendMail && flag){
                notificationService.error($filter('translate')("enter_email_candidate"));
                return;
            }
            if (!$rootScope.clickedSaveStatusInterviewInVacancy) {
                $rootScope.clickedSaveStatusInterviewInVacancy = true;
                $rootScope.changeStatusOfInterviewInVacancy.errorMessage = false;
                var changeObj = $rootScope.changeStatusOfInterviewInVacancy;
                if (changeObj.status.value == 'declinedoffer' && changeObj.comment == '') {
                    $rootScope.changeStatusOfInterviewInVacancy.errorMessage = true;
                    $rootScope.clickedSaveStatusInterviewInVacancy = false;
                    //return;
                }
                if ($rootScope.showEmployedFields) {
                    changeObj.date = $('.changeStatusOfInterviewEmployed').datetimepicker('getDeate') != null ? $('.changeStatusOfInterviewEmployed').datetimepicker('getDate') : customDate != undefined ? customDate : null;
                } else {
                    changeObj.date = $('.changeStatusOfInterviewInVacancyPick').datetimepicker('getDate') != null ? $('.changeStatusOfInterviewInVacancyPick').datetimepicker('getDate') : customDate != undefined ? customDate : null;
                }


                if ($rootScope.showEmployedFields) {
                    Vacancy.editInterview({
                        "personId": $scope.personId,
                        "vacancyId": $rootScope.changeStatusOfInterviewInVacancy.vacancyId,
                        "candidateId":  $scope.candidate.candidateId,
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
                            if(changeObj.date){
                                if($rootScope.calendarShow){
                                    googleCalendarCreateEvent(googleService, changeObj.date, changeObj.candidate.candidateId.fullName,
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
                            if ((changeObj.status.withDate || changeObj.status.type == 'interview') && changeObj.date && $rootScope.candnotify.send && $rootScope.candnotify.sendMail.length > 1) {
                                var candnotify = $rootScope.candnotify;
                                Vacancy.sendInterviewCreateMail({
                                        "email": candnotify.sendMail,
                                        "vacancyId": $rootScope.changeStatusOfInterviewInVacancy.vacancyId,
                                        "candidateId": changeObj.candidate.candidateId.candidateId,
                                        "fullName": candnotify.fullName,
                                        "date": changeObj.date,
                                        "lang": $translate.use()
                                    },
                                    function (resp) {
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
                            $scope.updateCandidate();
                            $scope.getLastEvent();
                            let changeStagesText ='The candidate has been transferred to the stage';

                            notificationService.success(`${$filter('translate')(changeStagesText)} ${$filter('translate')(changeObj.status.value)}`);
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
                        "candidateId": $scope.candidate.candidateId,
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
                                    googleCalendarCreateEvent(googleService, changeObj.date, changeObj.candidate.candidateId.fullName,
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
                            if ($rootScope.candnotify.send && $rootScope.candnotify.sendMail.length > 1 && sendEmail) {
                                var candnotify = $rootScope.candnotify;
                                var changeObj = $rootScope.changeStatusOfInterviewInVacancy;
                                Mail.sendMailByTemplateVerified({
                                    toEmails: candnotify.sendMail,
                                    vacancyId: $rootScope.changedStatusVacancy ? $rootScope.changedStatusVacancy.vacancyId:$rootScope.VacancyAddedInCandidate.vacancyId,
                                    candidateId: $scope.candidate.candidateId,
                                    fullName: $scope.candidate.fullName,
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
                            $scope.updateCandidate();
                            $scope.getLastEvent();
                            let changeStagesText ='The candidate has been transferred to the stage';
                            notificationService.success(`${$filter('translate')(changeStagesText)} ${$filter('translate')(changeObj.status.value)}`);

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
        $scope.changeTestStatus = function (appointmentId, status) {
            Test.editAppointment({appointmentId: appointmentId, passed: status}, function (resp) {
            });
        };
        //Candidate.getParseEmailData(function(resp){
        //    $scope.emailData = resp.objects;
        //});
        $scope.initDirectiveVar = {
            valiable: "asdasd",
            test: 0
        };
        $scope.close_modal = function () {
            $scope.show_modal = false;
        };
        $('.ui.dropdown').dropdown();
        $scope.showFastChangeStatus = $localStorage.get("showFastChangeStatus") != undefined ? $localStorage.get("showFastChangeStatus") : true;
        $scope.changeShowFastChangeStatus = function (change) {
            $scope.showFastChangeStatus = change;
            $localStorage.set("showFastChangeStatus", change);
        };
        $scope.changeCommentFlag = function(history){
            history.editCommentFlag = !history.editCommentFlag;
            $scope.editComment = history.descr;
        };
        $scope.changeComment = function(action, comment){
            Action.editAction({"comment": comment, "actionId": action.actionId}, function(resp){
                if (resp.status && angular.equals(resp.status, "error")) {
                    notificationService.error(resp.message);
                }
                else {
                    action.editCommentFlag = false;
                    action.descr = resp.object.descr;
                    action.new_komment = '';
                    action.dateEdit = resp.object.dateEdit;
                    notificationService.success($filter('translate')('Comment changed'));
                }
            });
        };

        $scope.showDeleteComment = function(resp) {
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/delete-comment-candidate.html',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            $rootScope.commentRemove = resp;
            $rootScope.commentRemoveId = resp.actionId;
        };

        $rootScope.deleteComment = function() {
            Action.removeMessageAction({
                actionId: $rootScope.commentRemoveId
            },function(resp){
                if (resp.status === "ok") {
                    //Service.history();
                    $scope.showComments();
                    notificationService.success($filter('translate')('Comment removed'));
                    if(!$scope.onlyComments){
                        $scope.getLastEvent();
                    }
                } else {
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                }
                $rootScope.closeModal();
            })
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
        $scope.addLinkInCandidate = function(){
            if($scope.addLinkToCandidate.name && $scope.addLinkToCandidate.url){
                if($rootScope.me.recrutRole != 'client'){
                    Candidate.addLink({
                        "candidateId": $scope.candidate.candidateId,
                        "name" : $scope.addLinkToCandidate.name,
                        "url" : $scope.addLinkToCandidate.url
                    }, function (resp){
                        if(resp.status === 'ok'){
                            $scope.addLinkToCandidate.name = null;
                            $scope.addLinkToCandidate.url = null;
                            $scope.addLinkErrorShow = false;
                            $scope.showAddLink = false;
                            //$scope.candidate.files.push(resp.object);
                            $scope.updateCandidate();
                            notificationService.success($filter('translate')('history_info.added_link'));
                        } else{
                            notificationService.error(resp.message);
                        }
                    });
                }else{
                    notificationService.error($filter('translate')('This feature is available only to administrators and recruiters'));
                }
            } else{
                $scope.addLinkErrorShow = true;
                if(!$scope.addLinkToCandidate.name)
                    notificationService.error($filter('translate')('Enter a URL name'));
            }
        };
        $scope.showCommentsFirstTime = function(){
            //$scope.onlyComments = !$scope.onlyComments;
            Service.history({
                "page": {"number": 0, "count": 5},
                "candidateId": $scope.candidate !== undefined ? $scope.candidate.candidateId : null,
                "onlyWithComment":false
            }, function(res) {
                $scope.historyLimit = res.size;
                $scope.historyTotal = res.total;
                $scope.history = res.objects;
                $scope.onlyComments = false;
            });
        };
        $scope.showComments = function(){
            //$scope.onlyComments = !$scope.onlyComments;
            $scope.historyLimit = 5;
            $scope.loaders.history = true;
            if($scope.loaders.history == true){
                var spinnerImage = angular.element.find('.loader-outer');
                $(spinnerImage).replaceWith( "<div class='loader'></div>" );
            }
            Service.history({
                "vacancyId": $scope.vacancy != undefined ? $scope.vacancy.vacancyId : null,
                "page": {"number": 0, "count": 5},
                "candidateId": $scope.candidate !== undefined ? $scope.candidate.candidateId : null,
                "onlyWithComment":true
            }, function(res) {
                $scope.loaders.history = false;
                $scope.showHistoryForPrint = true;
                $scope.historyLimit = res.size;
                $scope.historyTotal = res.total;
                $scope.history = res.objects;
                angular.forEach($scope.history, function(resp){
                    $scope.countComments++
                });
                $scope.onlyComments = true;
                $('.showCommentSwitcher').prop("checked", !$scope.onlyComments);
                //$("html, body").animate({ scrollTop: $(document).height() }, "slow");
            });
        };
        $scope.showDetails = function(){
            //$scope.onlyComments = !$scope.onlyComments;
            $scope.historyLimit = 5;
            $scope.loaders.history = true;
            if($scope.loaders.history == true){
                var spinnerImage = angular.element.find('.loader-outer');
                $(spinnerImage).replaceWith( "<div class='loader'></div>" );
            }
            Service.history({
                "page": {"number": 0, "count": 5},
                "candidateId": $scope.candidate !== undefined ? $scope.candidate.candidateId : null,
                "onlyWithComment":false
            }, function(res) {
                $scope.loaders.history = false;
                var keepGoing = true;
                angular.forEach($scope.history, function(val) {
                    if(keepGoing) {
                        if(val.type == 'vacancy_message' ||
                            val.type == 'candidate_message' ||
                            val.type == 'interview_message' ||
                            val.type == 'client_message'){
                            $scope.showHistoryForPrint = true;
                            keepGoing = false;
                        }
                    }
                });
                $scope.historyLimit = res.size;
                $scope.historyTotal = res.total;
                $scope.history = res.objects;
                $scope.onlyComments = false;
                $('.showCommentSwitcher').prop("checked", !$scope.onlyComments);
                //$("html, body").animate({ scrollTop: $(document).height() }, "slow");
            });
        };
        $scope.showCommentsSwitch = function () {
            if($scope.onlyComments) {
                $scope.showDetails();
            }  else {
                $scope.showComments();
            }
        };
        $scope.removeLinkedinConnect = function(resourseType){
            $scope.resourseType = resourseType;
            angular.forEach($scope.linkedCandidate,function(resp){
                if(resp.resourseType == resourseType){
                    Candidate.removeCandidateLink({
                        "id": resp.linkId
                    },function(res){
                        if(res.status == 'error'){
                            notificationService.error(res.message);
                        }else{
                            $scope.updateCandidateLinks();
                            $scope.linked = false;
                        }
                    })
                }
            });
        };
        $scope.showEditFileNameFunc = function(file){
            file.showEditFileName = !file.showEditFileName;
            file.showMenuEdDelFile = !file.showMenuEdDelFile;
            $scope.showMenuEdDelFile = false;
        };
        $scope.editFileName = function(data){
            File.changeFileName({
                "fileId":data.fileId,
                "name":data.fileName
            },function(resp){
                if(resp.status == 'ok'){
                    data.showEditFileName = false;
                }else{
                    notificationService.error(resp.message);
                }
            });
        };
        $scope.MenuEdDelFile = function(file){
            file.showMenuEdDelFile = true;
            $('body').mouseup(function (e) {
                var element = $(".editFileMenu");
                if ($(".editFileMenu").has(e.target).length == 0) {
                    file.showMenuEdDelFile = false;
                    $(document).off('mouseup');
                    $scope.$apply();
                }
            });
        };

        $scope.toggleDescriptionFunc = function (param) {
            var elem = $('div.content-description');
            var titleElem = $('.candidate-profile-rezume .centerBar .description h4');
            if($scope.toggleDescription || param == 'expand') {
                elem.css({'max-height': 'none'});
                elem.toggleClass('showAfter');
                $scope.toggleDescription = false;
                titleElem.prop('title', $filter('translate')('Hide full description'));
            } else {
                elem.css({'max-height': '100px'});
                elem.toggleClass('showAfter');
                $scope.toggleDescription = true;
                titleElem.prop('title', $filter('translate')('Show full description'));
            }
        };


        $('body').mouseup(function (e) {
            var element = $(".clever-window");
            if ($(".clever-window").has(e.target).length == 0) {
                $scope.showRegion2Map = false;
                $(document).off('mouseup');
                $scope.$apply();
            }
        });
        $scope.roundMinutes = function(date) {
            date.setHours(date.getHours());
            date.setMinutes(0);
            return date;
        };
        setTimeout(function(){
            $(".withoutTimeTask").datetimepicker({
                format: "dd/mm/yyyy HH:00",
                startView: 2,
                minView: 1,
                autoclose: true,
                weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                language: $translate.use(),
                initialDate: new Date(),
                startDate: new Date()
            }).on('changeDate', function (data) {
                $rootScope.editableTask.targetDate = $('.withoutTimeTask').datetimepicker('getDate');
                $scope.roundMinutes($rootScope.editableTask.targetDate);
                Task.changeTargetDate({
                    "taskId": $rootScope.editableTask.taskId,
                    "date":$rootScope.editableTask.targetDate
                }, function(resp){
                    $scope.updateTasks();
                    $scope.getLastEvent();
                })
            }).on('hide', function () {
                if ($('.withoutTimeTask').val() == "") {
                    $rootScope.editableTask.date = "";
                }
                $('.withoutTimeTask').blur();
            });

            //$scope.showModalAddTaskToCandidate = function () {
            //    $rootScope.responsiblePersons = [];
            //    $('.addTaskInCandidate').modal('show');
            //};
            $scope.showModalAddTaskToCandidate = function (size) {
                $rootScope.responsiblePersons = [];
                angular.forEach($rootScope.persons,function(res){
                    res.notShown = false;
                });
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../partials/modal/adding-task.html',
                    size: size,
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });
                $scope.modalInstance.opened.then(function() {
                    setTimeout(function(){
                        $(".changeDateNewTask").datetimepicker({
                            format: "dd/mm/yyyy hh:ii",
                            startView: 2,
                            minView: 0,
                            autoclose: true,
                            weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                            language: $translate.use(),
                            initialDate: new Date(),
                            startDate: new Date()
                        }).on('changeDate', function (data) {
                            $rootScope.newTask.targetDate = $('.changeDateNewTask').datetimepicker('getDate');
                            function roundMinutes(date) {

                                date.setHours(date.getHours() + Math.round(date.getMinutes()/60));
                                date.setMinutes(0);

                                return date;
                            }
                            // $scope.roundMinutes($rootScope.newTask.targetDate)
                        }).on('hide', function () {
                            if ($('.changeDateNewTask').val() == "") {
                                $rootScope.newTask.date = "";
                            }
                            $('.changeDateNewTask').blur();
                        });
                    },1)
                });
            };
            $scope.showModalConfirmationResumeUpdate = function(){
                $('.confirmationResumeUpdate.modal').modal('show');
            };
            $scope.showModalConfirmationResumeEdit = function(file){
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../partials/modal/candidate-replace-with-resume.html',
                    size: ''
                });
                $rootScope.editResumeFile = file;
            };
            $rootScope.changeCandidateFromExistingResume = function(){
                Candidate.updateFromFile({
                    candidateId: $rootScope.candidateForUpdateResume.candidateId,
                    fileId: $rootScope.editResumeFile.fileId
                },function(resp){
                    if(resp.status == 'ok'){
                        $scope.updateCandidate();
                        $rootScope.closeModal();
                    }else{
                        notificationService.error(resp.message);
                    }
                })
            };
            $scope.showModalResume = function(file){
                showModalResume(file,$scope,$rootScope,$location,$sce,$uibModal);
            };
            $rootScope.closeModalResume = function(){
                $rootScope.closeModal();
            };
            $scope.downloadDoc = function(){
                $scope.loading = true;
                Candidate.getCV({"localId": $scope.candidate.localId},function(resp){
                    if(resp.status == 'ok'){
                        $scope.loading = false;
                        pdfId = resp.object;
                        $('#downloadDoc')[0].href = '/hr/' + 'getapp?id=' + pdfId;
                        $('#downloadDoc')[0].click();
                    }else{
                        notificationService.error(resp.message);
                    }
                });
            };
            $rootScope.changeSearchType = function(param){
                $window.location.replace('/!#/candidates');
                $rootScope.changeSearchTypeNotFromCandidates = param;
            };

            $rootScope.changeTabOnTask = function(val){
                if (val == "Task") {
                    $rootScope.editableTask.type = 'Task';
                } else if (val == "Call") {
                    $rootScope.editableTask.type = 'Call';
                } else if (val == "Meeting") {
                    $rootScope.editableTask.type = 'Meeting';
                }
                $rootScope.editNameTask(true);
                $scope.updateTasks();
            };
            $rootScope.changeTabOnTaskForNewTask = function(val){
                if (val == "Task") {
                    $rootScope.newTask.type = 'Task';
                } else if (val == "Call") {
                    $rootScope.newTask.type = 'Call';
                } else if (val == "Meeting") {
                    $rootScope.newTask.type = 'Meeting';
                }
                $scope.updateTasks();
            };

            //$scope.deleteComment = function(action){
            //    Action.removeMessageAction({"actionId": action.actionId}, function(resp){
            //        if (resp.status && angular.equals(resp.status, "error")) {
            //            notificationService.error(resp.message);
            //        }
            //    });
            //};
        });
        $scope.getFirstLetters = function(str){
            return firstLetters(str)
        };
        $scope.addOurEmployee = function (size) {
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/vacancy-add-candidate.html',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
        };
        function cascadeStages() {
            setTimeout(function () {
                angular.forEach($scope.candidate.interviews, function (interview, index) {
                    var popWithstages = 'changeStatePop' + interview.vacancyId.vacancyId;
                    $('#' + popWithstages).children().each(function (index) {
                        var stageName = $(this).attr('id');
                        var isStandartStageRefuse = (stageName == 'notafit' || stageName == 'declinedoffer' || stageName == 'is_not_looking_for_job' || stageName == 'no_response' || stageName == 'no_contacts' || stageName == 'accepted_counter_offer' || stageName == 'found_another_job');
                        if(isStandartStageRefuse) {
                            $(this).addClass('refusal')
                        } else {
                            if(stageName !== undefined) {
                                for(var i = $scope.customStages.length; i--; i > 0) {
                                    if($scope.customStages[i].type == 'refuse' && $scope.customStages[i].name == stageName) {
                                        $(this).addClass('refusal');
                                        break;
                                    }
                                }
                            }
                        }
                    })


                });
            },0);

        }
        $scope.showRefusal = function (id) {
            var popWithstages = 'changeStatePop' + id;


            $('#' + popWithstages).find('.refusal').each(function () {
                $('#' + popWithstages).append(this);
                $(this).animate({height: '25px' }, 100);
            });
        };

        $scope.hideRefusal = function (id) {
            var popWithstages = 'changeStatePop' + id;
            $('#' + popWithstages).find('.refusal').each(function () {
                $(this).animate({height: '0px' }, 100);
            });
        };

        ///////////////////////////////////////////////////////////////Email chat with candidate

        $scope.openChat = function(){
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/candidate-email-chat.html',
                size: '',
                resolve: {

                }
            });
        };
        $scope.gotoBottom = function() {
            document.getElementById('history').scrollIntoView()
        };
        $scope.limitedAccessCandidate = function(){
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/limited-access-candidate.html',
                size: '',
                backdrop: 'static',
                resolve: {

                }
            });
        };

        ////////////////////////////////////////////////////////////End of email chat with candidate
        ///////////////////////////////////////////////////////////////Sent Email candidate
        $rootScope.emailTemplateInModal = {
            text: "Hi [[candidate name]]!<br/><br/>--<br/>Best, <br/>[[recruiter's name]]"
        };
        $scope.showCandidateSentEmail = function(){
            if($rootScope.me.emails.length === 0 && !$scope.noAllowedMails){
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../partials/modal/no-synch-email.html',
                    size: '',
                    scope: $scope,
                    resolve: {

                    }
                });
            }else{
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../partials/modal/candidate-send-email.html',
                    size: '',
                    scope: $scope,
                    resolve: {

                    }
                });
                $scope.modalInstance.closed.then(function() {
                    tinyMCE.remove();
                });
                $scope.modalInstance.opened.then(function(){
                    setTimeout(function(){
                        tinymce.init({
                            selector: '#modalMCE',
                            mode: 'exact',
                            theme: "modern",
                            height: 145,
                            language: $scope.lang!=undefined ||$scope.lang!=null?$scope.lang:"ru",
                            browser_spellcheck: true,
                            menubar: false,
                            statusbar: false,
                            theme_advanced_resizing: true,
                            plugins: ["advlist autolink lists link image charmap print preview hr anchor pagebreak",
                                "searchreplace visualblocks visualchars code fullscreen",
                                "insertdatetime media nonbreaking save table directionality",
                                "template paste textcolor  "],
                            fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
                            toolbar1: "bold italic forecolor backcolor fontsizeselect | bullist numlist | link",
                            image_advtab: true,
                            toolbar_items_size: 'small',
                            relative_urls: false,
                            link_assume_external_targets: true,
                            setup: function (ed) {
                                ed.on('SetContent', function (e) {

                                });
                                ed.on('change', function(e) {
                                    console.log('changed');
                                    $rootScope.emailTemplateInModal.text = tinyMCE.get('modalMCE').getContent();
                                });
                            }
                        });
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[candidate name\]\]/g, $scope.candidate.fullName);
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's name\]\]/g, $rootScope.me.fullName);
                        setTimeout(function(){
                            tinyMCE.get('modalMCE').setContent($rootScope.emailTemplateInModal.text);
                        },100);
                    },0);
                });
                angular.forEach($scope.candidate.contacts,function(resp){
                    if(resp.type == 'email'){
                        $rootScope.emailToSend = resp.value;
                    }
                });
            }
        };
        FileInit.initVacancyTemplateFileOption($scope, "", "", false, $filter);
        $scope.callbackFileForTemplate = function(resp, names) {
            $scope.fileForSave.push({"fileId": resp, "fileName": names});
            $rootScope.fileForSave.push({"fileId": resp, "fileName": names});
        };
        $rootScope.addEmailFromWhatSend = function(email){
            if($rootScope.emailThatAlreadyUsed){
                $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace($rootScope.emailThatAlreadyUsed.email, email.email);
            }
            $rootScope.emailTemplateInModal.email = [];
            $rootScope.emailThatAlreadyUsed = email;
            localStorage.emailThatAlreadyUsed = email.email;
            $rootScope.emailTemplateInModal.email = $rootScope.emailTemplateInModal.email + email.email;
            $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiterEmail\]\]/g, $rootScope.emailTemplateInModal.email?$rootScope.emailTemplateInModal.email:"");
            tinyMCE.get('modalMCE').setContent($rootScope.emailTemplateInModal.text);
        };
        $rootScope.sentEmail = function(){
            Mail.sendMailByTemplateVerified({
                    toEmails: $rootScope.emailToSend,
                    candidateId: $scope.candidate.candidateId,
                    fullName: $scope.candidate.fullName,
                    email: $rootScope.emailTemplateInModal.email,
                    date: null,
                    lang: $scope.lang,
                    template: {
                        type: $rootScope.emailTemplateInModal.type,
                        title: $rootScope.emailTemplateInModal.title,
                        text: $rootScope.emailTemplateInModal.text,
                        fileId: $rootScope.fileForSave.length > 0 ? $rootScope.fileForSave[0].fileId : null,
                        fileName: $rootScope.fileForSave.length > 0 ? $rootScope.fileForSave[0].fileName : null
                    }
                },
                function (resp) {
                    if (resp.status != 'ok') {
                        notificationService.error($filter('translate')('Error connecting integrate with email. Connect it again'));
                    }else{
                        notificationService.success($filter('translate')('Letter sent'));
                        $rootScope.closeModal();
                        $rootScope.emailToSend = null;
                        $rootScope.fileForSave = [];
                        $rootScope.emailTemplateInModal = {
                            text: "Hi [[candidate name]]!<br/><br/>--<br/>Best, <br/>[[recruiter's name]]"
                        };
                    }
                });
        };

        (function getPersonEmails() {
            Person.getPersonEmails({type: 'all'})
                .then(resp => {
                    let isPermittedEmail = resp.objects.filter(email => email.permitSend).length;

                    if(!isPermittedEmail && resp.objects.length) $scope.noAllowedMails = true;

                }, error => notificationService.error(error));
        })();

        $scope.deleteCandidateFromSystemModal = function() {
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/candidate-remove-from-system.html',
                size: '',
                scope: $scope,
                resolve: function(){}
            });
        };
        $scope.deleteCandidateFromSystem = function() {
            Candidate.deleteCandidateFromSystem({
                candidateId: $scope.candidate.candidateId,
                comment: $rootScope.changeStateInCandidate.comment
            }).then((resp) => {
                    $scope.closeModal();
                    $rootScope.changeStateInCandidate.comment = '';
                    $location.path('/candidates');
                    notificationService.success($filter('translate')('Candidate name has been removed from the database', { name:  $rootScope.changeStateInCandidate.candidate.fullName}));
                }, error => {
                    $scope.closeModal();
                    $rootScope.changeStateInCandidate.comment = '';
                    notificationService.error(error.message);
                });
        };

        sliderElements.params = Candidate.candidateLastRequestParams || JSON.parse(localStorage.getItem('candidateLastRequestParams'));
        sliderElements.setCurrent();
        $scope.nextOrPrevElements = sliderElements.nextOrPrevElements.bind(null, $scope);
        $scope.nextElement = sliderElements.nextElement.bind(null, $scope);
        $scope.candidateLength = $rootScope.objectSize || localStorage.getItem('objectSize');
        $scope.currentIndex = sliderElements.nextElement.cacheCurrentPosition + 1 ||  (+localStorage.getItem('numberPage')) +  1;
        ///////////////////////////////////////////////////////////////End of Sent Email candidate

    }]);


