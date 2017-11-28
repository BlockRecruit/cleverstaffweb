controller.controller('recallController', ["$localStorage", "frontMode", "googleService", "serverAddress", "$rootScope", "$scope", "$routeParams",
    "Vacancy", "$location", "Candidate", "notificationService", "$translate", "$filter", "vacancyStages", "Mail", "FileInit", "$uibModal",
    function ($localStorage, frontMode, googleService, serverAddress, $rootScope, $scope, $routeParams, Vacancy, $location, Candidate, notificationService, $translate, $filter,
              vacancyStages, Mail, FileInit, $uibModal) {
        $scope.serverAddress = serverAddress;
        $rootScope.recallCandidate = {candidateId: null};
        $scope.pageObject = {showButtonCandidate: false, showButtonVacancy: false, interview: null};
        $rootScope.closeModal = function(){
            $scope.modalInstance.close();
        };
        $rootScope.addToInterviewForm = {
            show: null,
            candidate: null,
            candidateId: null,
            recall: null,
            status: "longlist",
            date: null,
            comment: ""
        };
        $scope.fileForSave = [];
        $rootScope.fileForSave = [];
        /*For modal window*/

        FileInit.initVacancyTemplateFileOption($scope, "", "", false, $filter);
        $scope.callbackFile = function (resp, names) {
            $scope.fileForSave.push({"fileId": resp, "fileName": names});
            $rootScope.fileForSave.push({"fileId": resp, "fileName": names});
        };
        $scope.removeFile = function (id) {
            angular.forEach($scope.fileForSave, function (val, ind) {
                if (val.attId === id) {
                    $scope.fileForSave.splice(ind, 1);
                }
            });
        };
        $rootScope.removeFile = function (id) {
            angular.forEach($rootScope.fileForSave, function (val, ind) {
                if (val.attId === id) {
                    $rootScope.fileForSave.splice(ind, 1);
                }
            });
        };

        $scope.showSendEmailTemplateModal = function () {
            $scope.lang = localStorage.getItem('NG_TRANSLATE_LANG_KEY');
            $rootScope.sendEmailTemplate = {
                toEmails: $scope.recall.email ? $scope.recall.email : "",
                vacancyId: $scope.vacancy.vacancyId,
                candidateId: null,
                fullName: null,
                email: '',
                date: null,
                lang: $scope.lang,
                template: {}
            };
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/send-reject-by-email.html',
                size: '',
                resolve: function(){

                }
            });
            var asyncFunc = function () {
                Mail.getTemplateVacancy({
                    vacancyId: $scope.vacancy.vacancyId,
                    type: 'refuseCandidateInVacancy'
                }, function (data) {
                    data.object.title = data.object.title.replace(/\[\[vacancy name\]\]/g, $scope.vacancy.position);
                    data.object.text = data.object.text.replace(/\[\[candidate name\]\]/g, $scope.recall.name + ' ' + $scope.recall.lastName);
                    data.object.text = data.object.text.replace(/\[\[vacancy link\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $scope.publicLink + '">' + $scope.vacancy.position + '</a>');
                    data.object.text = data.object.text.replace(/\[\[recruiter's name\]\]/g, $rootScope.me.fullName);
                    $rootScope.sendEmailTemplate.template = data.object;
                    $rootScope.sendEmailTemplate.template.text = $rootScope.sendEmailTemplate.template.text.replace(/\[\[recruiter's phone\]\]/g, $rootScope.me.phone ? $rootScope.me.phone : "");
                    $rootScope.sendEmailTemplate.template.text = $rootScope.sendEmailTemplate.template.text.replace(/\[\[recruiter's Skype\]\]/g, $rootScope.staticEmailTemplate.skype ? $rootScope.staticEmailTemplate.skype : "");
                    if($rootScope.staticEmailTemplate.facebook){
                        $rootScope.sendEmailTemplate.template.text = $rootScope.sendEmailTemplate.template.text.replace(/\[\[recruiter's Facebook\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $rootScope.staticEmailTemplate.facebook+ '">' + $rootScope.staticEmailTemplate.facebook + '</a>');
                    }else{
                        $rootScope.sendEmailTemplate.template.text = $rootScope.sendEmailTemplate.template.text.replace(/\[\[recruiter's Facebook\]\]/g, '');
                    }
                    if($rootScope.staticEmailTemplate.linkedin){
                        $rootScope.sendEmailTemplate.template.text = $rootScope.sendEmailTemplate.template.text.replace(/\[\[recruiter's LinkedIn\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $rootScope.staticEmailTemplate.linkedin+ '">' + $rootScope.staticEmailTemplate.linkedin + '</a>');
                    }
                    else{
                        $rootScope.sendEmailTemplate.template.text = $rootScope.sendEmailTemplate.template.text.replace(/\[\[recruiter's LinkedIn\]\]/g, '');
                    }
                    if($rootScope.me.emails.length == 1){
                        $rootScope.sendEmailTemplate.template.text = $rootScope.sendEmailTemplate.template.text.replace(/\[\[recruiterEmail\]\]/g, $rootScope.me.emails[0].email);
                    }
                    if($rootScope.me.emails.length == 1){
                        $rootScope.sendEmailTemplate.template.text = $rootScope.sendEmailTemplate.template.text.replace(/\[\[recruiterEmail\]\]/g, $rootScope.me.emails[0].email);
                    }
                    tinyMCE.get('sendVacancyModalMCE').setContent(data.object.text);
                    $scope.addEmailInDescriptionFromLocalStorage();
                    if ($rootScope.sendEmailTemplate.template.fileId && $rootScope.sendEmailTemplate.template.fileName) {
                        $rootScope.fileForSave.push({
                            "fileId": $rootScope.sendEmailTemplate.template.fileId,
                            "fileName": $rootScope.sendEmailTemplate.template.fileName
                        });
                    }
                });
            };
            $scope.modalInstance.opened.then(function(){
                setTimeout(function () {
                    tinymce.init({
                        selector: '#sendVacancyModalMCE',
                        mode: 'exact',
                        theme: "modern",
                        height: 150,
                        language: $scope.lang != undefined || $scope.lang != null ? $scope.lang : "ru",
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
                        setup: function (ed) {
                            ed.on('SetContent', function (e) {
                                console.log('set')
                            });
                            ed.on('change', function(e) {
                                $rootScope.sendEmailTemplate.text = tinyMCE.get('sendVacancyModalMCE').getContent();
                            });
                        }
                    });
                    asyncFunc();
                }, 0);
            });
            $scope.modalInstance.closed.then(function() {
                tinyMCE.remove()
            });
        };
        $rootScope.sendEmailTemplateFunc = function () {
            if(!$rootScope.$root.sendEmailTemplate.toEmails) {
              return false;
            }
            console.log(!!$rootScope.sendEmailTemplate.toEmails);
            $rootScope.sendEmailTemplate.template.fileId = $rootScope.fileForSave.length > 0 ? $rootScope.fileForSave[0].fileId : null;
            $rootScope.sendEmailTemplate.template.fileName = $rootScope.fileForSave.length > 0 ? $rootScope.fileForSave[0].fileName : null;
            Mail.sendMailByTemplateVerified($rootScope.sendEmailTemplate, function (resp) {
                if (resp.status == 'ok') {
                    notificationService.success($filter('translate')('Letter sent'));
                    $rootScope.closeModal();
                } else {
                    notificationService.error($filter('translate')('Error connecting integrate with email. Connect it again'));
                }
            });
        };
        $rootScope.addEmailFromWhatSendInDescription = function (email) {
            $rootScope.sendEmailTemplate.template.email = [];
            $rootScope.sendEmailTemplate.template.email = $rootScope.sendEmailTemplate.template.email + email.email;
            $rootScope.sendEmailTemplate.email = $rootScope.sendEmailTemplate.template.email;
            $rootScope.sendEmailTemplate.template.text = $rootScope.sendEmailTemplate.template.text.replace(/\[\[recruiterEmail\]\]/g, $rootScope.sendEmailTemplate.template.email);
            tinyMCE.get('sendVacancyModalMCE').setContent($rootScope.sendEmailTemplate.template.text);
            console.log($rootScope.sendEmailTemplate.template.email);
            //$rootScope.emailTemplateInModal.email.toString();
        };

        Vacancy.oneRecall({"recallId": $routeParams.id}, function (resp) {
            if (resp.object.message) {
                $("#recall_description").html(resp.object.message.replace(/\r|\n/g, "<br>"))
            }

//        resp.object.message=resp.object.message.replace(/\r|\n/g, "<br>");
            $scope.recall = resp.object;
            if ($scope.recall.fileId != undefined) {
                $scope.recall.fileId = JSON.parse($scope.recall.fileId);
            }
            $scope.pageObject.showButtonCandidate = resp.object.candidateId == undefined || resp.object.candidateId == "" ||
                resp.object.candidateId != undefined &&
                $scope.recall.candidateId.split(',').length > 1;
            $rootScope.addToInterviewForm.showButtonCandidate = $scope.pageObject.showButtonCandidate;
            $scope.VacancyStatus = Vacancy.interviewStatusNew();
            vacancyStages.get(function (resp) {
                var array = [];
                $scope.customStages = resp.object.interviewStates;
                angular.forEach($scope.customStages, function (res) {
                    if (res.status != "D") {
                        array.push(res);
                    }
                });
                $scope.customStages = array;
            });
            Vacancy.one({"id": $scope.recall.vacancyId}, function (resp) {
                $scope.vacancy = resp.object;
                $scope.publicLink = $location.$$protocol + "://" + $location.$$host + "/i#/vacancy-" + $scope.vacancy.localId;
                $rootScope.staticEmailTemplate = {
                    candidateName: "John Dou",
                    vacancyLink: $scope.vacancy.position,
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
                if (resp.object.interviewStatus) {
                    var array = resp.object.interviewStatus.split(",");
                    var sortedStages = [];
                    angular.forEach($scope.VacancyStatus, function (vStatus) {
                        if (vStatus.used) {
                            var statusNotDef = $filter('filter')(vStatus.status, {defaultS: false});
                            angular.forEach(statusNotDef, function (statusND) {
                                angular.forEach(array, function (statusA) {
                                    if (statusND.value == statusA) {
                                        statusND.added = true;
                                    } else if (statusND.value != statusA && (statusND.value == 'shortlist' || statusND.value == 'interview')) {
                                        statusND.added = false;
                                    }
                                })
                            })
                        }
                    });
                    var i = 0;
                    angular.forEach(array, function (resp) {
                        angular.forEach($scope.VacancyStatus, function (vStatus) {
                            if (vStatus.used) {
                                if (i == 0) {
                                    angular.forEach($scope.customStages, function (res) {
                                        res.value = res.name;
                                        res.movable = true;
                                        res.added = false;
                                        res.count = 0;
                                        vStatus.status.push(res);
                                        i = i + 1;
                                    });
                                }
                                angular.forEach(vStatus.status, function (vStatusIn) {
                                    if (resp == vStatusIn.value) {
                                        vStatusIn.added = true;
                                        sortedStages.push(vStatusIn);
                                    } else if (resp == vStatusIn.customInterviewStateId) {
                                        if (vStatusIn.type == 'interview') {
                                            vStatusIn.withDate = true;
                                        }
                                        vStatusIn.added = true;
                                        sortedStages.push(vStatusIn);
                                    }
                                })
                            }
                        })
                    });
                    $scope.VacancyStatusFiltered = sortedStages;
                    //angular.forEach(array, function(val) {
                    //    angular.forEach($scope.customStages, function(resp) {
                    //        if(val == resp.customInterviewStateId){
                    //            resp.value = resp.name;
                    //            resp.movable = true;
                    //            $scope.VacancyStatusFiltered.push(resp);
                    //        }
                    //    });
                    //});
                } else {
                    $scope.VacancyStatusFiltered = $filter('vacancyStatusInSelectFilter')($scope.VacancyStatus);
                }
                if ($scope.recall.candidateId != undefined && $scope.recall.candidateId != "" && $scope.recall.candidateId.split(",").length == 1) {
                    if ($scope.vacancy != undefined && $scope.vacancy.interviews != undefined) {
                        var check = true;
                        angular.forEach($scope.vacancy.interviews, function (val) {
                            if (val.candidateId.candidateId == $scope.recall.candidateId.split(",")[0]) {
                                check = false;
                                $scope.pageObject.interview = val;
                            }
                        });
                        console.log($scope.pageObject.interview);
                        angular.forEach($scope.customStages, function (res) {
                            if ($scope.pageObject.interview) {
                                if ($scope.pageObject.interview.state == res.customInterviewStateId) {
                                    $scope.pageObject.interview.state = res.name;
                                }
                            }
                        });
                        $scope.pageObject.showButtonVacancy = check;
                        console.log($scope.pageObject.showButtonVacancy)
                    }

                } else {
                    console.log(2);
                    $scope.pageObject.showButtonVacancy = true;
                }
            });
            if ($scope.recall.candidateId != undefined && $scope.recall.candidateId != "" && $scope.recall.candidateId.split(',').length == 1) {
                Candidate.one({"id": $scope.recall.candidateId}, function (resp) {
                    if (resp.status == "ok") {
                        $scope.candidate = resp.object;
                        $rootScope.addToInterviewForm.candidate = $scope.candidate;
                    }
                });
            }

            Candidate.mathRecallWithCandidate({"recallId": $scope.recall.recallId}, function (resp) {
                $rootScope.candidatesForRecallsO = resp.objects;
            });
            Vacancy.recallRewieved({recallId: $scope.recall.recallId}, function () {

            });

        });


        $rootScope.statusInter = Vacancy.getInterviewStatus();
        $rootScope.addRecallToCandidate = function () {
            $scope.addRecallToCandidate('add');
        };
        $scope.addRecallToCandidate = function (eventName) {
            if (!$scope.mathCandidateNotFounded) {
                Candidate.mathRecallWithCandidate({"recallId": $scope.recall.recallId}, function (resp) {
                    if (!resp.objects || resp.objects.length == 0) {
                        $scope.mathCandidateNotFounded = true;
                        $scope.addRecallToCandidate('add');
                    } else {
                        if (resp.objects.length > 1) {
                            $rootScope.candidatesForRecallsO = resp.objects;
                            $('#recallsModals').modal('show');
                            $scope.mathCandidateNotFounded = true;
                        } else if (resp.objects.length == 1) {
                            $rootScope.recallCandidate.candidateId = resp.objects[0].candidateId;
                            $scope.mathCandidateNotFounded = true;
                            $scope.addRecallToCandidate('add');
                        }
                    }
                    // console.log($scope.mathCandidateNotFounded);
                });

            } else if (eventName == 'add') {
                Candidate.addFromRecall({
                    "recallId": $scope.recall.recallId,
                    "candidateId": $rootScope.recallCandidate.candidateId
                }, function (resp) {
                    if (resp.status == 'ok') {
                        $scope.recall.candidateId = resp.object.candidateId;
                        $scope.pageObject.showButtonCandidate = false;
                        $rootScope.addToInterviewForm.showButtonCandidate = false;
                        $('.recallsModals.modal').modal('hide');
                        $scope.candidate = resp.object;
                        notificationService.success($filter('translate')('added_candidate'));
                        $rootScope.candidatesForRecallsO = null;
                        angular.forEach($scope.vacancy.interviews, function (val) {
                            if (val.candidateId.candidateId == $scope.recall.candidateId) {
                                $scope.pageObject.interview = val;
                                $scope.pageObject.showButtonVacancy = true;
                                $scope.candidate = resp.object;
                                $rootScope.addToInterviewForm.candidate = $scope.candidate;
                            }
                        });

                    } else {
                        notificationService.success($filter('translate')('Sorry we have a trouble with ...'));
                    }
                });
            } else {
                $('.recallsModals.modal').modal('show');
            }
        };

        function addToInterview(candidateId, sendTemplate) {
            var recallObj = $rootScope.addToInterviewForm;
            recallObj.date = $('.addRecallInvacancyPicker').datetimepicker('getDate') != null && recallObj.status.withDate ? $('.addRecallInvacancyPicker').datetimepicker('getDate') : null;
            vacancyAddInterview(Vacancy, $scope.vacancy.vacancyId, $scope.vacancy.position,
                candidateId,
                recallObj.comment,
                recallObj.status.customInterviewStateId ? recallObj.status.customInterviewStateId : recallObj.status.value,
                recallObj.date, function (resp) {
                    notificationService.success($filter('translate')("candidate was added to the stage") + " " + $filter('translate')(recallObj.status.value));
                    $scope.pageObject.interview = resp.object;
                    recallObj.recall.addToInterview = false;
                    recallObj.recall.candidateInd = resp.object.candidateId.candidateId;
                    $rootScope.addToInterviewForm = {recall: "", status: "", date: "", comment: ""};
                    $scope.pageObject.showButtonVacancy = false;
                    if(sendTemplate){
                        Mail.sendMailByTemplateVerified({
                                toEmails: $rootScope.candnotify.sendMail,
                                vacancyId: $scope.vacancy.vacancyId,
                                candidateId: $scope.pageObject.interview.candidateId.candidateId,
                                fullName: $rootScope.candnotify.fullName,
                                email: $rootScope.emailTemplateInModal.email,
                                date: recallObj.date.getTime(),
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
                                if(resp.status != 'ok'){
                                    notificationService.error($filter('translate')('Error connecting integrate with email. Connect it again'));
                                }
                            });
                    }
                }, function (resp) {
                }, frontMode, notificationService, googleService, $scope.selectedCalendar != undefined ? $scope.selectedCalendar.id : null, $filter, $translate.use(), $rootScope);
        }

        $rootScope.addRecallInInterview = function (sendTemplate) {
            var recallObj = $rootScope.addToInterviewForm;
            if (recallObj.status == "") return;
            $rootScope.closeModal();
            // console.log($rootScope.addToInterviewForm.show);
            if ($rootScope.addToInterviewForm.candidateId != null) {
                $scope.addCandidate($scope.recall.recallId, $rootScope.addToInterviewForm.candidateId, addToInterview);
            } else if ($scope.recall.candidateId == undefined || $scope.recall.candidateId == "") {
                $scope.addCandidate($scope.recall.recallId, null, addToInterview);
            } else {
                addToInterview($scope.recall.candidateId, sendTemplate);
            }

        };
        $scope.addCandidate = function (recallId, candidateId, callback) {
            Candidate.addFromRecall({"recallId": recallId, "candidateId": candidateId}, function (resp) {
                if (resp.status == 'ok') {
                    $scope.recall.candidateId = resp.object.candidateId;
                    if (callback != undefined)callback(resp.object.candidateId);
                    notificationService.success($filter('translate')('New candidate has been added'));
                    $scope.candidate = resp.object;
                    $rootScope.candidatesForRecallsO = null;
                    $scope.pageObject.showButtonCandidate = false;
                    $rootScope.addToInterviewForm.showButtonCandidate = false;

                    angular.forEach($scope.vacancy.interviews, function (val) {
                        if (val.candidateId.candidateId == $scope.recall.candidateId) {
                            $scope.pageObject.interview = val;
                            $scope.pageObject.showButtonVacancy = true;
                            $scope.candidate = resp.object;
                            $rootScope.addToInterviewForm.candidate = $scope.candidate;
                        }
                    });
                } else {
                    notificationService.success($filter('translate')('Sorry we have a trouble with ...'));
                }
            });
        };
        $rootScope.fileForSave = [];    /*For modal window*/

        FileInit.initVacancyTemplateFileOption($scope, "", "", false, $filter);
        $scope.callbackFile = function(resp, names) {
            $scope.fileForSave.push({"fileId": resp, "fileName": names});
            $rootScope.fileForSave.push({"fileId": resp, "fileName": names});
        };
        $rootScope.removeFile = function(id) {
            angular.forEach($rootScope.fileForSave, function(val, ind) {
                if (val.attId === id) {
                    $rootScope.fileForSave.splice(ind, 1);
                }
            });
        };
        $scope.openModalAddRecallToInterview = function (status, size) {
            if ($rootScope.candidatesForRecallsO != undefined && $rootScope.candidatesForRecallsO.length > 1) {
                $rootScope.addToInterviewForm.show = "two";
            } else {
                $rootScope.addToInterviewForm.show = "one";
            }
            $rootScope.addToInterviewForm.status = status;
            $rootScope.addToInterviewForm.recall = $scope.recall;
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/add-interview-from-recall.html',
                size: '',
                resolve: {
                }
            });
            $scope.modalInstance.opened.then(function() {
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
                        setup: function (ed) {
                            ed.on('SetContent', function (e) {

                            });
                            ed.on('change', function(e) {
                                $rootScope.emailTemplateInModal.text = tinyMCE.get('modalMCE').getContent();
                            });
                        }
                    });
                    if($rootScope.addToInterviewForm.status.value == 'interview' ||
                        $rootScope.addToInterviewForm.status.withDate ||
                        $rootScope.addToInterviewForm.status.value == 'longlist' ||
                        $rootScope.addToInterviewForm.status.value == 'shortlist' ||
                        $rootScope.addToInterviewForm.status.value == 'notafit' ||
                        $rootScope.addToInterviewForm.status.value == 'declinedoffer' ||
                        $rootScope.addToInterviewForm.status.value == 'no_response' ||
                        $rootScope.addToInterviewForm.status.value == 'no_contacts' ||
                        $rootScope.addToInterviewForm.status.type == 'interview' ||
                        $rootScope.addToInterviewForm.status.type == 'refuse'){
                        var templateType = 'candidateCreateInterviewNotification';
                        if($rootScope.addToInterviewForm.status.value == 'notafit' ||
                            $rootScope.addToInterviewForm.status.value == 'declinedoffer' ||
                            $rootScope.addToInterviewForm.status.value == 'no_response' ||
                            $rootScope.addToInterviewForm.status.value == 'no_contacts' ||
                            $rootScope.addToInterviewForm.status.type == 'refuse'){
                            templateType = 'refuseCandidateInVacancy'
                        }else if($rootScope.addToInterviewForm.status.value == 'longlist' ||
                            $rootScope.addToInterviewForm.status.value == 'shortlist'){
                            templateType = 'seeVacancy'
                        }
                        Mail.getTemplateVacancy({vacancyId: $scope.vacancy.vacancyId,type:templateType},function(data){
                            $rootScope.fileForSave = [];
                            $rootScope.emailTemplateInModal = data.object;
                            $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[candidate name\]\]/g, $rootScope.candnotify.fullName);
                            $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[vacancy link\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $scope.publicLink+ '">' + $scope.vacancy.position + '</a>');
                            $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's name\]\]/g, $rootScope.me.fullName);
                            $rootScope.emailTemplateInModal.title = $rootScope.emailTemplateInModal.title.replace(/\[\[vacancy link\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $scope.publicLink+ '">' + $scope.vacancy.position + '</a>');
                            $rootScope.emailTemplateInModal.title = $rootScope.emailTemplateInModal.title.replace(/\[\[vacancy name\]\]/g, $scope.vacancy.position);
                            $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's phone\]\]/g, $rootScope.me.phone ? $rootScope.me.phone : "");
                            $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's Skype\]\]/g, $rootScope.staticEmailTemplate.skype ? $rootScope.staticEmailTemplate.skype : "");
                            if(!$rootScope.staticEmailTemplate.skype){
                                $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/Skype:/g, "");
                            }
                            if($rootScope.staticEmailTemplate.facebook){
                                $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's Facebook\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $rootScope.staticEmailTemplate.facebook+ '">' + $rootScope.staticEmailTemplate.facebook + '</a>');
                            }else{
                                $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's Facebook\]\]/g, '');
                            }
                            if($rootScope.staticEmailTemplate.linkedin){
                                $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's LinkedIn\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $rootScope.staticEmailTemplate.linkedin+ '">' + $rootScope.staticEmailTemplate.linkedin + '</a>');
                            }else{
                                $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiter's LinkedIn\]\]/g, '');
                            }
                            if($rootScope.me.emails.length == 1){
                                $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[recruiterEmail\]\]/g, $rootScope.me.emails[0].email);
                            }
                            console.log($rootScope.emailTemplateInModal.text);
                            tinyMCE.get('modalMCE').setContent($rootScope.emailTemplateInModal.text);
                            if(localStorage.emailThatAlreadyUsed){
                                $scope.addEmailFromLocalStorage(localStorage.emailThatAlreadyUsed);
                            }
                            if($rootScope.emailTemplateInModal.fileId && $rootScope.emailTemplateInModal.fileName){
                                $rootScope.fileForSave.push({"fileId": $rootScope.emailTemplateInModal.fileId, "fileName": $rootScope.emailTemplateInModal.fileName});
                            }
                        })
                    }
                    $(".addRecallInvacancyPicker").datetimepicker({
                        format: "dd/mm/yyyy hh:ii",
                        startView: 2,
                        minView: 0,
                        weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                        autoclose: true,
                        language: $translate.use()
                    }).on('changeDate', function (data) {
                        $rootScope.addToInterviewForm.date = data.date;
                        $rootScope.emailTemplateInModal.text = $rootScope.emailTemplateInModal.text.replace(/\[\[interview date and time\]\]/g, $filter('dateFormat2')($('.addRecallInvacancyPicker').datetimepicker('getDate').getTime(), true));
                        $rootScope.emailTemplateInModal.title = $rootScope.emailTemplateInModal.title.replace(/\[\[interview date and time\]\]/g, $filter('dateFormat2')($('.addRecallInvacancyPicker').datetimepicker('getDate').getTime(), true));
                        $scope.$apply();
                        tinyMCE.get('modalMCE').setContent($rootScope.emailTemplateInModal.text);
                    });
                },0);
            });
            $scope.modalInstance.closed.then(function() {
                $rootScope.candnotify.show = false;
                tinyMCE.remove()
            });
            $rootScope.getTemplate = function(){

            };
            //$('.addInInterviewFromRecall.modal').modal('show');
            $rootScope.candnotify = {};
            $rootScope.candnotify.emails = $scope.recall.email.split(",");
            $rootScope.candnotify.sendMail = $scope.recall.email;
            $rootScope.candnotify.show = false;
            $rootScope.candnotify.fullName = $scope.recall.name + " " + $scope.recall.lastName;
            //if ($localStorage.get("candnotify") == "false") {
            //    $rootScope.candnotify.send = false;
            //} else {
            //    $rootScope.candnotify.send = true;
            //}
        };
        $scope.toVacancy = function () {
            $location.path("vacancies/" + $scope.vacancy.localId);

        };
        $(".addRecallInvacancyPicker").datetimepicker({
            format: "dd/mm/yyyy hh:ii",
            startView: 2,
            minView: 0,
            weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
            autoclose: true,
            language: $translate.use()
        }).on('changeDate', function (data) {
            $rootScope.addToInterviewForm.date = data.date;
        });
        $scope.addEmailInDescriptionFromLocalStorage = function (email) {
            angular.forEach($rootScope.me.emails, function (resp) {
                if (resp.email == localStorage.emailThatAlreadyUsed) {
                    $rootScope.addEmailFromWhatSendInDescription(resp);
                }
            })
        };
        Vacancy.all(Vacancy.searchOptions(), function(response) {
            $rootScope.objectSize = response['objects'] != undefined ? response['total'] : 0;
        });
    }]);
