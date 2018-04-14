function CandidateEmailSend($scope, $rootScope, $stateParams, Vacancy, Person, googleService, Candidate, notificationService, $location, Client, $filter, vacancyStages) {
    $scope.pageObject = {
        emails: [],
        candidates: [],
        toEmails: null,
        text: "",
        vacancy: null,
        clientEmails: [],
        candidateForShow: [],
        loading: true,
        client: null,
        mail: {
            fromEmail: null,
            toEmails: null,
            subject: null,
            text: "<p style='margin: 0px;'><p style='margin: 0px;' id=\"candidates\">&nbsp;</p></p>",
            candidateIds: []
        },
        vacancyStatus: [],
        error: {
            type: 0,
            message: ""
        },
        send: false,
        showEmailSelectMenu: false
    };

    $rootScope.addEmailAccessObject = {
        errorMessage: null
    };

    vacancyStages.get(function(resp){
        var array = [];
        $scope.customStages =resp.object.interviewStates;
        angular.forEach($scope.customStages, function(res){
            res.added = false;
            res.count = 0;
            if(res.status != "D"){
                array.push(res);
            }
        });
        $scope.customStages = array;
        $scope.customStagesFull =resp.object.interviewStates;
    });

    Vacancy.one({localId: $stateParams.vacancyId}, function(resp) {
        if (!resp.object.interviews || resp.object.interviews.length == 0) {
            console.log("returning!",resp.object);
            $location.path("/vacancies/" + $stateParams.vacancyId);
            return;
        } else {
            console.log(resp.object);
        }
        $scope.pageObject.mail.vacancyId = resp.object.vacancyId;
        $rootScope.title = $filter('translate')('Sending email to the customer') + " | CleverStaff";
        $scope.pageObject.mail.subject = $filter('translate')("Candidates for") + " " + resp.object.position +
        " " + $filter('translate')("vacancy");
        if (resp.object.interviews) {
            $scope.pageObject.vacancy = resp.object;
            var candidateIds = [];
            angular.forEach(resp.object.interviews, function(resp) {
                candidateIds.push(resp.candidateId.candidateId);
            });

            Candidate.all({ids: candidateIds}, function(respC) {
                angular.forEach(respC.objects, function(val) {
                    angular.forEach(resp.object.interviews, function(valI) {
                        if (valI.candidateId.candidateId == val.candidateId) {
                            if (val.contacts) {
                                angular.forEach(val.contacts, function(valC) {
                                    if (valC.type == 'linkedin') {
                                        valI.candidateId.contact = valC;
                                    }
                                });
                            }
                        }
                    });
                });
            });
            $scope.pageObject.clientEmails = [];
            Client.one({id: resp.object.clientId.clientId}, function(resp) {
                if (resp.status == "ok") {
                    $scope.pageObject.client = resp.object;
                    angular.forEach(resp.object.contactClientList, function(val) {
                        angular.forEach(val.contacts, function(valC) {
                            if (valC.type == 'email') {
                                var text = "";
                                if (val.firstName) text = text + val.firstName;
                                if (val.lastName) text = text + " " + val.lastName;
                                text = text + " <" + valC.value + ">";
                                $scope.pageObject.clientEmails.push({id: valC.value, text: text});
                            }
                        })
                    });
                    var inputText = '';
                    $("#toEmails").select2({
                        tags: $scope.pageObject.clientEmails,
                        tokenSeparators: [",", " "],
                        formatNoMatches: function(term) {
                            return "<div class='select2-result-label' style='cursor: s-resize;'><span class='select2-match'></span>" + $filter('translate')("Enter a source of this candidate") + "</div>"
                        },

                        createSearchChoice: function(term, data) {
                            if ($(data).filter(function() {
                                    return this.text.localeCompare(term) === 0;
                                }).length === 0) {
                                inputText = term;
                                return {id: term, text: term};
                            }
                        },
                        initSelection: function(element, callback) {
                            var data = {id: element.val(), text: element.val()};
                            callback(data);
                        }
                    }).on("select2-close", function(e) {
                        if (inputText.length > 0) {
                            var data = $(this).select2("data");
                            data.push({id: inputText, text: inputText});
                            $(this).select2('data', data);
                        }
                    }).on("select2-selecting", function(e) {
                        inputText = "";
                    });
                }
                $scope.pageObject.loading = false;
            });
            if (!resp.object.interviewStatus) {
                angular.forEach(Vacancy.interviewStatusNew()[0].status, function(val) {
                    addCandidateInList(resp.object.interviews, val.value, $scope.pageObject.vacancyStatus);
                });
            } else {
                var status = resp.object.interviewStatus.split(",");
                angular.forEach(status, function(val) {
                    addCandidateInList(resp.object.interviews, val, $scope.pageObject.vacancyStatus);
                })
            }
            if ($scope.pageObject.vacancyStatus.length > 0) {
                $scope.status = $scope.pageObject.vacancyStatus[0].value;
                $scope.pageObject.vacancyStatus[0].show = true;
                $scope.pageObject.candidateForShow = $scope.pageObject.vacancyStatus[0].candidates;
            }
        }


    });
    function queryAddEmail(email, password, name) {
        Person.addEmail({email: email, password: password, type: "google", ownerName: name}, function(resp) {
            if (resp.status == 'ok') {
                $(".addEmailToMail").modal('hide');
                $scope.pageObject.emails = [];

                $scope.pageObject.error.message = "";
                $scope.pageObject.error.type = 0;
                $scope.pageObject.emails.push(resp.object);
                $scope.pageObject.mail.fromEmail = resp.object.email;
                $scope.pageObject.showEmailSelectMenu = false;
            } else {
                $rootScope.addEmailAccessObject.errorMessage = resp.message;
                $scope.pageObject.error.type = 5;
                $scope.pageObject.showEmailSelectMenu = true;
            }
        });
    }


    $scope.openModalAddEmail = function() {
        $rootScope.addEmailAccessObject.errorMessage = null;
        $(".addEmailToMail").modal('show');
    };

    $scope.addGoogleEmailToMailDb = function() {
        googleService.gmailAuth("compose", function(result) {
            if (result.status == 'ok') {
                if ($scope.pageObject.emails && $scope.pageObject.emails.length == 1) {
                    Person.deleteEmail({objectId: $scope.pageObject.emails[0].personEmailAccessId}, function(resp) {
                        queryAddEmail(result.email, result.code, result.ownerName)
                    });
                } else {
                    queryAddEmail(result.email, result.code, result.ownerName);
                }
            }
        });
    };
    $scope.candidateIds = [];
    $scope.addCandidateLinkToText = function(candidateObj) {
        if(candidateObj.checked){
            $scope.candidateIds.push(candidateObj.candidateId);
            var linkedInLink = candidateObj.contact != undefined ? candidateObj.contact.value : "";
            var newCandidateList = "<span style='font-size: 14px;display: block' ng-show=\"candidateObj.checked\" id=\"span" + candidateObj.candidateId + "\"><a id=" + candidateObj.candidateId + " href=\"#/candidates/" + candidateObj.localId + " \">" + candidateObj.fullName + "</a>&nbsp;&nbsp;&nbsp;" + linkedInLink + "</span>";
            var candidatesFrame = $("#candidateText_ifr");
            if (candidatesFrame.contents().find('#candidates').length == 0) {
                candidatesFrame.contents().find('#tinymce').prepend("<p style='margin: 0px;' id=\"candidates\"><span id=\"candidateTitle\">$</span></br></p>" +  $filter('translate')('Thank you_1'));
            }
            var candidateAElement = candidatesFrame.contents().find('body').find("#span" + candidateObj.candidateId);
            var candidateTitleElement = candidatesFrame.contents().find('#candidates').find("#candidateTitle");
            if (candidateAElement.length == 1) {
                candidateAElement.replaceWith(newCandidateList);
            } else {
                var candidatesElement = candidatesFrame.contents().find('#candidates').contents().find("a").length;
                var candidatePElement = candidatesFrame.contents().find('#candidates');
                if (candidatesElement >= 1) {
                    candidatePElement[0].childNodes[2].textContent = $filter('translate')('I would appreciate hearing your feedback regarding those candidates');
                }else {
                    candidateTitleElement.replaceWith($filter('translate')('Hi') + "</br>" + $filter('translate')('I would appreciate hearing your feedback regarding this candidate'));
                }
                candidatesFrame.contents().find('#candidates').append(newCandidateList);
            }
        }else{
            var countForAdded = 0;
            var candidatesFrame2 = $("#candidateText_ifr");
            angular.forEach($scope.pageObject.vacancyStatus, function(val) {
                angular.forEach(val.candidates, function(nval) {
                    var candidateAElement = candidatesFrame2.contents().find('body').find("#span" + nval.candidateId);
                    var candidateTitleElement2 = candidatesFrame2.contents().find('#candidates').find("#span" + nval.candidateId);
                    var candidatesElement = candidatesFrame2.contents().find('#candidates').contents().find("a").length;
                    var candidatePElement = candidatesFrame2.contents().find('#candidates');
                    if(candidateAElement[0] != undefined && candidateObj.candidateId == candidateAElement[0].firstChild.id){
                        if (candidateAElement.length == 1) {
                            candidateAElement.remove();
                            nval.checked = false;
                        } else {
                            countForAdded++;
                        }
                        if (candidatesElement > 2) {
                            if (candidateTitleElement2.text().length != 0) {
                                candidateTitleElement2.replaceWith($filter('translate')('Hi') + "</br>" + $filter('translate')('I would appreciate hearing your feedback regarding those candidates'));
                            }
                        } else {
                            if (candidateTitleElement2.text().length != 0) {
                                candidatePElement[0].childNodes[2].textContent = $filter('translate')('I would appreciate hearing your feedback regarding this candidate');
                            }
                        }
                    }
                    if(nval.candidateId == candidateObj.candidateId){
                        var index = $scope.candidateIds.indexOf(candidateObj.candidateId);
                        if (index > -1) {
                            $scope.candidateIds.splice(index, 1);
                        }
                    }
                });
            });
        }
    };


    $scope.cancel = function() {
        $location.path("/vacancies/" + $stateParams.vacancyId);
    };

    $scope.send = function() {
        $scope.pageObject.error.message = "";
        $scope.pageObject.error.type = 0;
        if (!$scope.pageObject.mail.fromEmail) {
            $scope.pageObject.send = false;
            $scope.pageObject.error.type = 1;
            pageScrollOnTop();
            return;
        }
        $scope.pageObject.mail.toEmails = $('#toEmails').select2('val');
        if ($scope.pageObject.mail.toEmails.length == 0) {
            $scope.pageObject.error.type = 2;
            pageScrollOnTop();
            return;
        }

        var unValidEmail = "";
        angular.forEach($scope.pageObject.mail.toEmails, function(val) {
            if (validEmail(val)) {
                if (unValidEmail.length > 0)  unValidEmail += ", ";
                unValidEmail += val;
            }
        });
        if (unValidEmail.length > 0) {
            $scope.pageObject.error.type = 3;
            $scope.pageObject.error.message = unValidEmail;
            $scope.pageObject.send = false;
            pageScrollOnTop();
            return;
        }
        $scope.pageObject.mail.text = $(tinymce.get('candidateText').getBody()).html();
        $scope.pageObject.send = true;
        $scope.pageObject.mail.toEmails = $scope.pageObject.mail.toEmails.join();
        $scope.pageObject.mail.candidateIds = $scope.candidateIds;
        Candidate.sendToMail($scope.pageObject.mail, function(resp) {
            if (resp.status == "ok") {
                notificationService.success($filter('translate')("Letter sent"));
                $scope.pageObject.send = false;
                $('#toEmails').select2('data', null);
                $scope.pageObject.mail.subject = "";
                $scope.pageObject.text = "";
                $location.path("/vacancies/" + $stateParams.vacancyId);
                tinymce.get("candidateText").setContent('');
            } else {
                $scope.pageObject.error.type = 5;
                pageScrollOnTop();
                //$scope.pageObject.error.message = ('Ввведите email еше раз');
                //resp.message;
                $scope.pageObject.send = false;
                $scope.pageObject.showEmailSelectMenu = true;
            }
        });
    };

    $scope.chooseFromEmail = function(val) {
        $scope.pageObject.showEmailSelectMenu = false;
        $scope.pageObject.mail.fromEmail = val;
    };
    $scope.openSelectMenu = function() {
        $scope.pageObject.showEmailSelectMenu = true;
    };

    Person.personEmails({'type': 'send'}, function(resp) {
        $scope.pageObject.emails = resp.objects;
        if ($scope.pageObject.emails && $scope.pageObject.emails.length == 1) {
            $scope.pageObject.mail.fromEmail = $scope.pageObject.emails[0].email;
        } else {
            $scope.pageObject.showEmailSelectMenu = true;
        }
    });

    $scope.chooseShowEmail = function(status) {
        $scope.status = status;
        angular.forEach($scope.pageObject.vacancyStatus, function(val) {
            if (val.value == status) {
                val.show = true;
                $scope.pageObject.candidateForShow = val.candidates;
            } else {
                val.show = false;
            }
        });
    };

    $scope.tinyMcePlugin = [];
    $scope.addToEmails = function(email){
        $scope.pageObject.mail.fromEmail = email.email;
    };
    if($rootScope.me.emails.length == 1){
        $scope.addToEmails($rootScope.me.emails[0]);
    }
    function addCandidateInList(interviews, value, vacancyStatusAssoc) {
        var candidates = [];
        angular.forEach(interviews, function(valI) {
            if (valI.state == value) {
                valI.candidateId.added = false;
                candidates.push(valI.candidateId);
            }
        });
        if (candidates.length > 0) {
            angular.forEach($scope.customStagesFull, function(resp) {
                if(resp.customInterviewStateId == value){
                    value = resp.name
                }
            });
            vacancyStatusAssoc.push({value: value, candidates: candidates, show: false});
        }
    }
}

controller.controller("CandidateEmailSend", ['$scope', '$rootScope', '$stateParams', 'Vacancy', 'Person', 'googleService', 'Candidate', 'notificationService', '$location', 'Client', '$filter', 'vacancyStages', CandidateEmailSend]);
controller.filter('slice', function() {
    return function(arr, start, end) {
        return (arr || []).slice(start, end);
    };
});

function validEmail(email, notificationService) {
    if (email == undefined) return true;
    var r = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi;
    return !email.match(r);
}