controller.controller('CandidateAddFromEmailController', ["Notice", "$localStorage", "$translate", "Service", "$scope", "ngTableParams", "Candidate", "$location", "$rootScope", "$filter", "$cookies", "serverAddress", "notificationService", "googleService", "$window",
    function (Notice, $localStorage, $translate, Service, $scope, ngTableParams, Candidate, $location, $rootScope, $filter, $cookies, serverAddress, notificationService, googleService, $window) {
        $scope.serverAddress = serverAddress;
        $rootScope.addToQueueData = {email: "", password: "", loading: false, host: ""};
        $rootScope.repeatPassword = '';
        $rootScope.validEmail = {email: ""};
        $rootScope.removeFromQueueData = {email: "", loading: false};
        $scope.emailDatas = false;
        $scope.emailHistory = undefined;
        $scope.showHistory = true;
        $scope.notices = [];
        $scope.checkedGMail = [];
        $scope.minutesLeft = 60 - new Date().getMinutes();
        var noticeDate = new Date();
        noticeDate.setMonth(noticeDate.getMonth() - 1);
        noticeDate.setHours(0);
        noticeDate.setMinutes(0);

        $scope.getMoreHistory = function () {
            $scope.getMoreHistoryLoading = true;
            noticeDate.setMonth(noticeDate.getMonth() - 1);
            Service.notice({
                from: noticeDate.getTime(),
                types: ["parserAddCandidate", "parserEditCandidate"]
            }, function (resp) {
                $scope.notices = resp.objects != undefined ? resp.objects : [];
                $scope.getMoreHistoryLoading = false;
            }, function (resp) {
                $scope.getMoreHistoryLoading = false;
            });
        };
        Notice.registerNoticeView(function (id) {
            angular.forEach($scope.notices, function (val) {
                if (val.noticeId == id) {
                    val.read = true;
                }
            });
        }, "CandidateAddFromEmailController");

        var mailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;

        Service.notice({
            from: noticeDate.getTime(),
            "types": ["parserAddCandidate", "parserEditCandidate"]
        }, function (res) {
            $scope.notices = res.objects != undefined ? res.objects : [];
            $scope.showHistory = res.objects != undefined;
        });

        function updateData() {
            Candidate.getParseEmailData(function (resp) {
                if (resp.status && resp.status === "ok") {
                    $scope.emailDatas = resp.objects != undefined ? resp.objects : [];
                } else if (resp.message) {
                    notificationService.error(resp.message);
                }
            }, function (resp) {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });
        }

        function closeAddModal() {
            return setTimeout(function () {
                $(".addEmailToParseQueue").modal("hide");
                $rootScope.addToQueueData = {email: "", password: "", loading: false};
            }, 8000)
        }

        updateData();

        $scope.showAddModal = function () {
            $rootScope.repeatPassword = '';
            $(".addEmailToParseQueue").modal("show");
        };

        $scope.showRemoveModal = function (isNotGmail) {
            $(".removeEmailFromParseQueue").modal("show");
            $rootScope.isNotGmailToRemove = isNotGmail;
        };

        $rootScope.addFromGmail = function () {
            googleService.gmailAuth("readonly", function (result) {
                if (result.status == 'ok') {
                    $scope.checkedGMail.push(result.email);
                    $(".addEmailToParseQueue").modal("hide");
                    Candidate.addToParserQueue({email: result.email, password: result.code, host: "gmail"},
                        function (resp) {
                            if (resp.status && resp.status === "ok") {
                                $scope.emailDatas = resp.objects != undefined ? resp.objects : [];
                                $scope.checkNow = true;
                            } else if (resp.message) {
                                notificationService.error(resp.message);
                            }
                        },
                        function (resp) {
                            console.log(resp)
                        });
                }
            });
        };
        $rootScope.checkValidEmail = function () {
            if($rootScope.repeatPassword == $rootScope.addToQueueData.password){
                $rootScope.validEmail.email = $rootScope.addToQueueData.email;
                Candidate.checkMailbox($rootScope.validEmail, function (resp) {
                    if (resp.status && resp.status === "ok") {
                        $rootScope.addEmailToParserQueue();
                    }
                    else if (resp.message) {
                        $rootScope.addFromGmail()
                    }
                });
            }else{
                notificationService.error($filter('translate')('not_match'));
            }
        };

        $rootScope.addEmailToParserQueue = function () {
            if ($rootScope.addToQueueData.email === "" || !mailPattern.test($rootScope.addToQueueData.email)) {
                notificationService.error($filter('translate')('Not valid email'));
            } else if ($rootScope.addToQueueData.password === "") {
                notificationService.error($filter('translate')('Please enter your password'));
            } else if ($rootScope.addToQueueData.email.indexOf("@gmail.com") != -1) {
                $rootScope.addFromGmail();
            } else {
                $rootScope.addToQueueData.loading = true;
                $rootScope.addToQueueData.host = "email";
                var timeout_id = closeAddModal();
                Candidate.addToParserQueue($rootScope.addToQueueData, function (resp) {
                    clearTimeout(timeout_id);
                    if (resp.status && resp.status === "ok") {
                        $rootScope.addToQueueData = {email: "", password: "", loading: false};
                        $(".addEmailToParseQueue").modal("hide");
                        $scope.emailDatas = resp.objects != undefined ? resp.objects : [];
                        $scope.isActiveLastEmail = resp.object == "ok";
                        $scope.checkNow = true;
                    } else if (resp.message) {
                        notificationService.error(resp.message);
                        $rootScope.addToQueueData.loading = false;
                    }
                }, function (resp) {
                    clearTimeout(timeout_id);
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                    $rootScope.addToQueueData.loading = false;
                });
            }
        };


        $scope.editPassword = function (email) {
            $rootScope.addToQueueData.email = email;
            $scope.showAddModal();
        };


        $rootScope.removeEmailFromParserQueue = function () {
            Candidate.removeFromParserQueue({email: $rootScope.removeFromQueueData.email}, function (resp) {
                if (resp.status && resp.status === "ok") {
                    $scope.emailDatas = resp.objects != undefined ? resp.objects : [];
                    $(".removeEmailFromParseQueue").modal("hide");
                } else if (resp.message) {
                    notificationService.error(resp.message);
                }
                $scope.isActiveLastEmail = null;
            }, function (resp) {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });
        };

        var sendReadRequest = [];
        $scope.readNotice = function (n) {

            if (!n.read && sendReadRequest.indexOf(n.noticeId) == -1) {
                Notice.updateNoticesView(n.noticeId, "CandidateAddFromEmailController");
                sendReadRequest.push(n.noticeId);
                var index = sendReadRequest.indexOf(n.noticeId);
                Service.readNotice(n.noticeIds, function (resp) {
                    if (resp.status && resp.status == "ok") {
                        n.read = true;
                        document.dispatchEvent(new CustomEvent('cleverstaffExtensionReloadCountUnreadNotice'));
                    } else if (resp.message) {
                        notificationService.error(resp.message);
                    }
                    sendReadRequest.splice(index, 1);
                }, function (resp) {
                    //notificationService.error($filter('translate')('service temporarily unvailable'));

                    sendReadRequest.splice(index, 1);
                });
            } else {
            }
        };

        $scope.checkedEmail = function (email) {
            return $.inArray(email, $scope.checkedGMail) != -1;
        };

        $rootScope.changeSearchType = function (param) {
            $window.location.replace('/!#/candidates');
            $rootScope.changeSearchTypeNotFromCandidates = param;
        }
    }]);
