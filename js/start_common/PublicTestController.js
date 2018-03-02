controller.controller('PublicTestController', ['$scope', '$rootScope', 'serverAddress', 'Service', 'Company',
    'notificationService', '$routeParams', 'Test', "$interval", "$timeout", "$localStorage", "$location", "$filter", "$translate", "$window",
    function ($scope, $rootScope, serverAddress, Service, Company, notificationService, $routeParams, Test, $interval, $timeout, $localStorage, $location, $filter, $translate, $window) {
        $scope.loaded = false;
        $scope.showStartTest = true;
        $scope.showStartTest2 = true;
        $scope.showFirstTest = false;
        $scope.currentTab = 'start_test';
        $scope.hideTest = true;
        $scope.showEndMessage = false;
        $scope.saveAnswersTest = false;
        $scope.endTestMsg = null;
        $scope.serverAddress = serverAddress;
        $scope.checkPreviousAnswers = false;
        $scope.inHover = function(){
            $scope.showHover = true;
        };
        $scope.outHover = function(){
            $scope.showHover = false;
        };
        $timeout(function() {
            $scope.getTestFunc();
        });

        function getOrgLogo(orgId) {
            console.log('hello',orgId);
            Service.getOrgLogoId({orgId: orgId}, function (resp) {
                console.log(serverAddress);
                console.log(resp);
                if (resp.status && resp.status === 'ok') {
                    $scope.companyInfo.logo = resp.object;
                }
            });
        }

        $scope.getTestFunc = function () {
            Test.openTest({
                appointmentId: $routeParams.id
            },function(resp){
                $scope.startTestFunc();
                $scope.showFirstTest = true;
                $scope.loaded = true;
                if(resp.message == 'This test is already passed. If you want to pass it one more time, please contact the recruiter who sent you the test link.'){
                    // $('.publicTest2, .publicTest3').hide();
                    $scope.showStartTest = true;
                    $scope.showStartTest2 = false;
                    $scope.endTestMsg = resp.message;
                    $scope.showEndMessage = true;
                }
                if(resp.message == 'This test is inactive now. Please contact the rectuiter if you want to pass the test.'){
                    // $('.publicTest2, .publicTest3').hide();
                    $scope.showStartTest = false;
                    $scope.showStartTest2 = true;
                    $scope.endTestMsg = resp.message;
                    $scope.showEndMessage = true;
                }
                if(resp.status == 'ok'){
                    getOrgLogo(resp.object.orgId);
                    if($localStorage.get("currentTab") == 'first_test'){
                        if (performance.navigation.type == 1) {
                            setTimeout(function(){
                                $scope.startTestFunc('first_test');
                            }, 500);
                        } else {
                            console.info( "This page is not reloaded");
                        }
                    }
                    $scope.showEndMessage = false;
                    $scope.showStartTest = false;
                    $scope.showStartTest2 = false;
                    $rootScope.title = resp.object.testName;
                    $scope.companyInfo = {
                        name : resp.companyName,
                        fb : resp.companyFacebookPage,
                        website : resp.companyWebSite
                    };
                    $scope.getTestCandidate = resp.object;
                    $scope.currentLang = $translate.use();
                    if($scope.currentLang == undefined){
                        console.log('lang');
                    }
                    if($scope.getTestCandidate.timeLimit == '3600' || $scope.getTestCandidate.timeLimit == '7200' || $scope.getTestCandidate.timeLimit == '10800' || $scope.getTestCandidate.timeLimit == '14400' || $scope.getTestCandidate.timeLimit == '18000' || $scope.getTestCandidate.timeLimit == '21600' || $scope.getTestCandidate.timeLimit == '25200' || $scope.getTestCandidate.timeLimit == '28800'|| $scope.getTestCandidate.timeLimit == '32400' || $scope.getTestCandidate.timeLimit == '36000' || $scope.getTestCandidate.timeLimit == '39600' || $scope.getTestCandidate.timeLimit == '43200' || $scope.getTestCandidate.timeLimit == '46800' || $scope.getTestCandidate.timeLimit == '54000' || $scope.getTestCandidate.timeLimit == '57600' || $scope.getTestCandidate.timeLimit == '61200' || $scope.getTestCandidate.timeLimit == '64800' || $scope.getTestCandidate.timeLimit == '68400' || $scope.getTestCandidate.timeLimit == '72000' || $scope.getTestCandidate.timeLimit == '75600' || $scope.getTestCandidate.timeLimit == '79200' || $scope.getTestCandidate.timeLimit == '82800' || $scope.getTestCandidate.timeLimit == '86400'){
                        $('.min').hide();
                        $('.allTime').hide();
                    }else if($scope.getTestCandidate.timeLimit > '3600' && ($scope.getTestCandidate.timeLimit != '3600' || $scope.getTestCandidate.timeLimit != '7200' || $scope.getTestCandidate.timeLimit != '10800' || $scope.getTestCandidate.timeLimit != '14400' || $scope.getTestCandidate.timeLimit != '18000' || $scope.getTestCandidate.timeLimit != '21600' || $scope.getTestCandidate.timeLimit != '25200' || $scope.getTestCandidate.timeLimit != '28800'|| $scope.getTestCandidate.timeLimit != '32400' || $scope.getTestCandidate.timeLimit != '36000' || $scope.getTestCandidate.timeLimit != '39600' || $scope.getTestCandidate.timeLimit != '43200' || $scope.getTestCandidate.timeLimit != '46800' || $scope.getTestCandidate.timeLimit != '54000' || $scope.getTestCandidate.timeLimit != '57600' || $scope.getTestCandidate.timeLimit != '61200' || $scope.getTestCandidate.timeLimit != '64800' || $scope.getTestCandidate.timeLimit != '68400' || $scope.getTestCandidate.timeLimit != '72000' || $scope.getTestCandidate.timeLimit != '75600' || $scope.getTestCandidate.timeLimit != '79200' || $scope.getTestCandidate.timeLimit != '82800' || $scope.getTestCandidate.timeLimit != '86400')){
                        $('.min').hide();
                        $('.hour').hide();
                        $('.allTime').show();
                    }else if($scope.getTestCandidate.timeLimit < '3600'){
                        $('.allTime').hide();
                        $('.min').show();
                        $('.hour').hide();
                    }
                }else{
                    getOrgLogo(resp.object.orgId);
                    $rootScope.title = resp.object.testName;
                    $scope.companyInfo = {
                        name : resp.companyName,
                        fb : resp.companyFacebookPage,
                        website : resp.companyWebSite
                    };
                    $scope.getTestCandidate = resp.object;
                    $scope.currentLang = $translate.use();
                    if($scope.currentLang == undefined){
                        $window.location.reload();
                    }
                    if($scope.getTestCandidate.timeLimit == '3600' || $scope.getTestCandidate.timeLimit == '7200' || $scope.getTestCandidate.timeLimit == '10800' || $scope.getTestCandidate.timeLimit == '14400' || $scope.getTestCandidate.timeLimit == '18000' || $scope.getTestCandidate.timeLimit == '21600' || $scope.getTestCandidate.timeLimit == '25200' || $scope.getTestCandidate.timeLimit == '28800'|| $scope.getTestCandidate.timeLimit == '32400' || $scope.getTestCandidate.timeLimit == '36000' || $scope.getTestCandidate.timeLimit == '39600' || $scope.getTestCandidate.timeLimit == '43200' || $scope.getTestCandidate.timeLimit == '46800' || $scope.getTestCandidate.timeLimit == '54000' || $scope.getTestCandidate.timeLimit == '57600' || $scope.getTestCandidate.timeLimit == '61200' || $scope.getTestCandidate.timeLimit == '64800' || $scope.getTestCandidate.timeLimit == '68400' || $scope.getTestCandidate.timeLimit == '72000' || $scope.getTestCandidate.timeLimit == '75600' || $scope.getTestCandidate.timeLimit == '79200' || $scope.getTestCandidate.timeLimit == '82800' || $scope.getTestCandidate.timeLimit == '86400'){
                        $('.min').hide();
                        $('.allTime').hide();
                    }else if($scope.getTestCandidate.timeLimit > '3600' && ($scope.getTestCandidate.timeLimit != '3600' || $scope.getTestCandidate.timeLimit != '7200' || $scope.getTestCandidate.timeLimit != '10800' || $scope.getTestCandidate.timeLimit != '14400' || $scope.getTestCandidate.timeLimit != '18000' || $scope.getTestCandidate.timeLimit != '21600' || $scope.getTestCandidate.timeLimit != '25200' || $scope.getTestCandidate.timeLimit != '28800'|| $scope.getTestCandidate.timeLimit != '32400' || $scope.getTestCandidate.timeLimit != '36000' || $scope.getTestCandidate.timeLimit != '39600' || $scope.getTestCandidate.timeLimit != '43200' || $scope.getTestCandidate.timeLimit != '46800' || $scope.getTestCandidate.timeLimit != '54000' || $scope.getTestCandidate.timeLimit != '57600' || $scope.getTestCandidate.timeLimit != '61200' || $scope.getTestCandidate.timeLimit != '64800' || $scope.getTestCandidate.timeLimit != '68400' || $scope.getTestCandidate.timeLimit != '72000' || $scope.getTestCandidate.timeLimit != '75600' || $scope.getTestCandidate.timeLimit != '79200' || $scope.getTestCandidate.timeLimit != '82800' || $scope.getTestCandidate.timeLimit != '86400')){
                        $('.allTime').show();
                        $('.min').hide();
                        $('.hour').hide();
                    } else if($scope.getTestCandidate.timeLimit < '3600'){
                        $('.allTime').hide();
                        $('.min').show();
                        $('.hour').hide();
                    }
                    //notificationService.error(resp.message);
                }
            })
        };

        var intervalId;

        $scope.counter = 0;

        $scope.countdown = $scope.initialCountdown;
        $scope.timer = function(){
            var startTime = new Date();
            intervalId = $interval(function(){
                var actualTime = new Date();
                $scope.counter = Math.floor((actualTime - startTime) / 1000);
                $scope.countdown = $scope.initialCountdown - $scope.counter;
            }, 500);
        };

        $scope.$watch('countdown', function(countdown){
            if (countdown === 0 || countdown < 0){
                $scope.stopTimer();
                // $scope.nextTestQuestion();
                // $scope.getNextQuestion();
                $scope.endTestTimeOrSubmit();
            }
        });
        $scope.stopTimer = function(){
            $interval.cancel(intervalId);
            intervalId = null;
        };
        $scope.startTimer = function(){
            if (intervalId === null) {
                $interval(function(){
                    $scope.countdown--;
                }, 1000);
            }
        };
        $scope.startTestFunc = function (tab) {
            $scope.currentTab = tab || "start_test";
            Test.startTest({
                appointmentId: $routeParams.id
            },function(resp){
                if(resp.status == 'ok'){
                    if(!tab) {
                        if(resp.object.question.num > 1 || resp.object.answer) {
                            $scope.startTestFunc('first_test');
                            return;
                        }
                        $scope.checkPreviousAnswers = true;
                        return;
                    }

                    if(resp.object.answer) setRightAnswer(resp);

                    $scope.firstTestQuestion = resp;
                    if(resp.object.question.imageId != undefined){
                        $scope.imageId = serverAddress + "/getPublicFile/" + resp.object.question.imageId;
                    }
                    $scope.initialCountdown = $scope.firstTestQuestion.timeLeft;
                    if($scope.initialCountdown > 0){
                        $scope.timer();
                    }
                    $scope.firstPage = resp.object.question.num;
                    $scope.checkPreviousAnswers = true;
                }else{
                    notificationService.error(resp.message);
                }
            })
        };
        $scope.variantsAnswer = [];
        $scope.checkFewAnswer = function (text) {
            if ($scope.variantsAnswer.indexOf(text) === -1) {
                $scope.variantsAnswer.push(text);
            } else {
                $scope.variantsAnswer.splice($scope.variantsAnswer.indexOf(text), 1);
            }
        };
        $scope.checkOneAnswer = function (text) {
            $scope.checkAnswerText = text;
        };
        $scope.textAnswer = function (text) {
            $scope.textAnswers = text;
        };
        $scope.nextTestQuestion = function(next){
            if($scope.textAnswers != undefined){
                Test.saveAnswer({
                    questionId: $scope.firstTestQuestion.object.question.id,
                    appointmentId: $routeParams.id,
                    text: $scope.textAnswers
                },function(resp){
                    $scope.variantsAnswer = [];
                    $scope.checkAnswerText = null;
                    $scope.textAnswers = null;
                    if(next == 'next'){
                        $scope.getNextQuestion();
                    }else if(next == 'prev'){
                        $scope.previousTestQuestion();
                    }
                })
            }else if($scope.variantsAnswer != undefined && $scope.variantsAnswer.length > 0){
                Test.saveAnswer({
                    questionId: $scope.firstTestQuestion.object.question.id,
                    appointmentId: $routeParams.id,
                    variantsArray: $scope.variantsAnswer
                },function(resp){
                    $scope.variantsAnswer = [];
                    $scope.checkAnswerText = undefined;
                    $scope.textAnswers = undefined;
                    if(next == 'next'){
                        $scope.getNextQuestion();
                    }else if(next == 'prev'){
                        $scope.previousTestQuestion();
                    }
                })
            }else if( $scope.checkAnswerText != undefined){
                Test.saveAnswer({
                    questionId: $scope.firstTestQuestion.object.question.id,
                    appointmentId: $routeParams.id,
                    variantsArray: [$scope.checkAnswerText]
                },function(resp){
                    $scope.variantsAnswer = [];
                    $scope.checkAnswerText = undefined;
                    $scope.textAnswers = undefined;
                    if(next == 'next'){
                        $scope.getNextQuestion();
                    }else if(next == 'prev'){
                        $scope.previousTestQuestion();
                    }
                })
            } else if(next == 'prev') {
                $scope.variantsAnswer = [];
                $scope.checkAnswerText = undefined;
                $scope.textAnswers = undefined;
                $scope.previousTestQuestion();
            } else{
                if($scope.firstTestQuestion.object.question.answerType === 'task_question') {
                    notificationService.error($filter('translate')('Enter your answer first text'));
                } else {
                    notificationService.error($filter('translate')('Enter your answer first'));
                }
            }
        };
        $scope.previousTestQuestion = function(){
            Test.getTestsQuestion({
                testId: $scope.getTestCandidate.id,
                questionNumber: --$scope.firstPage,
                appointmentId: $routeParams.id
            },function(resp){
                if(resp.status == 'ok'){
                    $scope.firstTestQuestion = resp;
                    $scope.imageId = serverAddress + "/getPublicFile/" + resp.object.question.imageId;
                    -$scope.firstPage;
                    setRightAnswer(resp);
                    $scope.hideTest = true;
                    $scope.saveAnswersTest = false;
                }else{
                    notificationService.error(resp.message);
                }
            })
        };
        $scope.endTestTimeOrSubmit = function(done){
            $('.publicTest3').hide();
            $scope.hideTest = false;
            $scope.showEndMessage = true;
            $scope.saveAnswersTest = false;
            Test.endAppointment({
                status: 'partly_done' ? done : 'partly_done',
                appointmentId: $routeParams.id
            },function(resp){
                if(resp.status == 'ok'){

                }else{
                }
            })
        };
        $scope.getNextQuestion = function(){
            Test.getTestsQuestion({
                testId: $scope.getTestCandidate.id,
                questionNumber: ++$scope.firstPage,
                appointmentId: $routeParams.id
            },function(resp){
                if(resp.message == 'There is no question with such number.'){
                    $scope.hideTest = false;
                    $scope.saveAnswersTest = true;
                }
                if(resp.status == 'ok'){
                    $scope.firstTestQuestion = resp;
                    $scope.imageId = serverAddress + "/getPublicFile/" + resp.object.question.imageId;
                    +$scope.firstPage;
                    $('#answersText').val('');
                    var rightAnswer = {};
                    angular.copy(resp.object.answer, rightAnswer);
                    if(rightAnswer != null){
                        if(rightAnswer.variantsArray != undefined){
                            var answer = {};
                            angular.copy(resp.object.question, answer);
                            if(answer.answerType == 'few_answers'){
                                $scope.variantsAnswer = [];
                                angular.forEach(rightAnswer.variantsArray, function (val) {
                                    $scope.variantsAnswer.push(val);
                                    $scope.checkAnswerText = null;
                                    $scope.textAnswers = undefined;
                                });
                            }else if(answer.answerType == 'one_answer'){
                                $scope.checkAnswerText = null;
                                angular.forEach(rightAnswer.variantsArray, function (val) {
                                    $scope.checkAnswerText = val;
                                    $scope.variantsAnswer = undefined;
                                    $scope.textAnswers = undefined;
                                });
                            }
                        }else if(rightAnswer.text != undefined){
                            $scope.textAnswers = rightAnswer.text;
                            $scope.variantsAnswer = undefined;
                            $scope.checkAnswerText = undefined;
                            $('#answersText').val($scope.textAnswers);
                        } else {
                        }
                    } else {
                        $scope.checkAnswerText = null;
                    }
                }else{
                    notificationService.error(resp.message);
                }
            })
        };

        function setRightAnswer(resp) {
            var rightAnswer = {};
            angular.copy(resp.object.answer, rightAnswer);
            if(rightAnswer != null){
                if(rightAnswer.variantsArray != undefined){
                    $scope.variantsAnswer = [];
                    angular.forEach(rightAnswer.variantsArray, function (val) {
                        var answer = {};
                        angular.copy(resp.object.question, answer);
                        if(answer.answerType == 'few_answers'){
                            $scope.variantsAnswer = [];
                            angular.forEach(rightAnswer.variantsArray, function (val) {
                                $scope.variantsAnswer.push(val);
                                $scope.checkAnswerText = undefined;
                                $scope.textAnswers = undefined;
                            });
                        }else if(answer.answerType == 'one_answer'){
                            $scope.checkAnswerText = [];
                            angular.forEach(rightAnswer.variantsArray, function (val) {
                                $scope.checkAnswerText = [val];
                                $scope.variantsAnswer = undefined;
                                $scope.textAnswers = undefined;
                            });
                        }
                    });
                }else if(rightAnswer.text != undefined){
                    $scope.textAnswers = rightAnswer.text;
                    $('#answersText').val($scope.textAnswers);
                }
            }
        }
        $scope.showModalImage = function() {
            $('#question-modal').removeClass('hidden');
            $('#question-modal').addClass('visible');
        };
        $scope.closeModalImage = function() {
            $('#question-modal').removeClass('visible');
            $('#question-modal').addClass('hidden');
        };

        let timeout;
        $scope.companyInfoHoverIn = function() {
            let logo = $('.logo'),
                companyInfo = $('.companyInfo'),
                nameWrap = $('.name_wrap'),
                infoSite = $('.info--site:eq'),
                name = $('.block-company-public-vacancy .companyInfo h2'),
                site = $('.info--site:eq a'),
                fb = $('.info--site:eq a');

            clearTimeout(timeout);

            if(infoSite.width() - site.width() <= 44.64 || infoSite.width() - fb.width() <= 44.64 || nameWrap.width() <= name.width()) {
                $scope.adaptiveImgWidth = logo.height();
                logo.height($scope.adaptiveImgWidth);
                timeout = setTimeout(() => nameWrap.css('white-space', 'normal'),300);
                companyInfo.addClass('hovered');
            }
        };

        $scope.companyInfoHoverOut = function() {
            console.log('out');
            let nameWrap = $('.name_wrap');
            nameWrap.css('white-space', 'nowrap');
            $('.companyInfo').removeClass('hovered');
            clearTimeout(timeout);
        };
    }]
);
/*** Created by вик on 31.05.2017.*/
