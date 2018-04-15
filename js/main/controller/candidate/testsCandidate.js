controller.controller('testsAndForms', ["$scope", "Test", "notificationService", "$filter", "$rootScope", "$uibModal", "$window", "$stateParams", "$location", "FileInit", "serverAddress", "Vacancy", "$localStorage",
    function ($scope, Test, notificationService, $filter, $rootScope, $uibModal, $window, $stateParams, $location, FileInit, serverAddress, Vacancy, $localStorage) {
        $scope.optionTab = 'show';
        $scope.textType = false;
        $scope.fieldCheck = false;
        $scope.timeLimit = {hh: null, mm: null};
        $rootScope.sendOneTest = {
            id: null
        };
        $scope.newTestParamInit = function () {
            $scope.timeLimit = {hh: null, mm: null};
            $scope.newTestParam = {
                testName: null,
                description: null,
                timeLimit: null,
                questions: [
                    {
                        text: null,
                        points: null,
                        answerType: false,
                        variantsArray: [{value: null, isCorrect: true}],
                        rightAnswersArray: [],
                        num: 1,
                        imageId: null
                    }
                ]
            };
            $scope.testPreview = null;
        };
        $scope.newTestParamInit();
        $scope.allTests = [];
        $scope.getAllTests = function () {
            Test.getTests(function (resp) {
                if(resp.status == "ok") {
                    $scope.allTests = resp.objects;
                    if(!$scope.allTests || $scope.allTests.length === 0) {
                        $scope.changeTab('add');
                    }
                } else {
                    notificationService.error(resp.message);
                }
            },function (err) {
                notificationService.error(err.message);
            });
        };
        $scope.getAllTests();
        $rootScope.testQuestionLogo = [];
        $scope.callbackTestQuestionLogo = function(photo, index) {
            $rootScope.testQuestionLogo[index] = photo;
            $rootScope.testQuestionLogoLink = $scope.serverAddress + "/getapp?id=" + photo + "&d=true";
        };

        $scope.changeTab = function (tab, TestId) {
            var toEdit = function () {
                $scope.editTestId = TestId;
                Test.getTest({id: TestId}, function (resp) {
                    if(resp.status == "ok") {
                        var editTestParam = {};
                        angular.copy(resp.object, editTestParam);
                        $scope.testQuestion = resp.object.questions;
                        angular.forEach(resp.object.questions, function (question, questId) {
                            editTestParam.questions[questId] = {};
                            $scope.numMenu = question.num;
                            editTestParam.questions[questId].num = question.num;
                            editTestParam.questions[questId].id = question.id;
                            editTestParam.questions[questId].text = question.text;
                            editTestParam.questions[questId].points = question.points;
                            editTestParam.questions[questId].imageId = question.imageId;
                            $rootScope.testQuestionLogo.push(question.imageId);
                            editTestParam.questions[questId].variantsArray = [];
                            editTestParam.questions[questId].rightAnswersArray = [];
                            editTestParam.questions[questId].answerType = !(question.answerType == 'few_answers' || question.answerType == 'one_answer');
                            angular.forEach(question.variantsArray, function (variant, index) {
                                var isCorrectAnsw = false;
                                if(question.rightAnswersArray.includes(variant)){
                                    isCorrectAnsw = true;
                                }
                                var variantFOrPush = {value: variant, isCorrect: isCorrectAnsw};
                                editTestParam.questions[questId].variantsArray.push(variantFOrPush);
                            });
                        });
                        $scope.newTestParamInit();
                        $scope.newTestParam.testName = editTestParam.testName ? editTestParam.testName : null;
                        $scope.newTestParam.timeLimit = editTestParam.timeLimit ? editTestParam.timeLimit : null;
                        $scope.newTestParam.questions = editTestParam.questions ? editTestParam.questions : null;
                        $scope.newTestParam.norms = editTestParam.norms ? editTestParam.norms : null;
                        $scope.newTestParam.description = editTestParam.description ? editTestParam.description : null;
                        $scope.newTestParam.id = editTestParam.id;
                        $scope.timeLimit.hh = Math.floor(editTestParam.timeLimit / 3600);
                        $scope.timeLimit.mm = Math.floor((editTestParam.timeLimit - ($scope.timeLimit.hh * 3600)) / 60);
                    } else {
                        notificationService.error(resp.message)
                    }
                }, function (err) {
                    notificationService.error(err.message);
                })
            };

            $scope.optionTab = tab;
            if(tab == 'show') {
                $scope.getAllTests();
                $scope.newTestParamInit();
                $scope.fieldCheck = false;
            } else if(tab == 'edit') {
                $scope.fieldCheck = false;
                toEdit();
            } else if($scope.optionTab == 'add') {
                $scope.newTestParamInit();
            }
        };
        $scope.changeAnswerType = function ($event, questInd) {
            $scope.newTestParam.questions[questInd].answerType = !$scope.newTestParam.questions[questInd].answerType;
            if($scope.newTestParam.questions[questInd].answerType) {
                $scope.newTestParam.questions[questInd].variantsArray = [];
                $scope.newTestParam.questions[questInd].rightAnswersArray = [];
                $($event.currentTarget).find('#cmn-toggle-9').prop('checked', true);
            } else {
                $scope.newTestParam.questions[questInd].variantsArray.push({value: null, isCorrect: true});
                $($event.currentTarget).find('#cmn-toggle-9').prop('checked', false);
            }
        };
        $scope.answerAdd = function (questInd) {
            $scope.newTestParam.questions[questInd].variantsArray.push({value: null, isCorrect: false});
        };
        $scope.questAdd = function () {
            $scope.newTestParam.questions.push({
                text: null,
                points: null,
                answerType: false,
                variantsArray: [{value: null, isCorrect: true}],
                rightAnswersArray: [],
                num: null,
                imageId: null
            })
        };
        $scope.deleteQuestion = function (questIndex) {
            $scope.newTestParam.questions.splice(questIndex, 1);
        };
        $scope.deleteAnswer = function (questIndex, answIndex) {
            $scope.newTestParam.questions[questIndex].variantsArray.splice(answIndex, 1);
        };
        $scope.removeObligatory = function () {
            $(".obligatory").each(function () {
                if($(this)[0].value == '' || $(this)[0].value === null) {
                    $(this).removeClass("empty");
                }
            });
        };
        $scope.removeLogoTestCandidateQuestion = function (questIndex, question, e) {
            $scope.questIndex = questIndex;
            console.log(questIndex);
            console.log(question);
            if(question.imageId == null){
                console.log($(e.target).offsetParent());
                $(e.target).offsetParent().hide();
                $(e.target).offsetParent().offsetParent().find('.img_wrap' + questIndex).hide();
                $rootScope.testQuestionLogo[questIndex] = undefined;
                $('#logo-button' + questIndex).show();
            }else{

            }
            console.log($rootScope.testQuestionLogo);
            console.log($scope.testQuestion);
            angular.forEach($scope.testQuestion, function(val) {
                if(val.id === question.id){
                    $rootScope.testQuestionLogo[questIndex] = undefined;
                    //$rootScope.testQuestionLogo.splice(questIndex, 1);
                    $(".owner_photo_wrap" + questIndex).find('img').hide();
                    $(".owner_photo_wrap" + questIndex).find('#owner_photo_bubble_wrap').hide();
                }
            });
        };

        $scope.selectCorrectAnswer = function(question,answers) {
            if(answers.isCorrect) question.noCorrectAnswerInQuestion = false;
        };
        $scope.saveTest = function () {
            var emptyQuestion = false;
            var firstNoAnswerIndex = null;
            $scope.noAnswerIndex = null;
            $scope.fieldCheck = false;
            $scope.noCorrectAnswerInQuestion = false;

            angular.forEach($scope.newTestParam.questions, function (question, index) {
                if((question.text === '' || question.text === null || question.points === null || question.points === '') && !question.answerType){
                    emptyQuestion = true;
                }

                let checkForCorrectAnswer = question.variantsArray.every(function (variant) {
                    return !variant.isCorrect;
                });

                console.log($scope.newTestParam.questions[$scope.newTestParam.questions.indexOf(question)].answerType);


                if(checkForCorrectAnswer && !$scope.newTestParam.questions[$scope.newTestParam.questions.indexOf(question)].answerType
                    || $scope.newTestParam.questions[$scope.newTestParam.questions.indexOf(question)].answerType && !question.text) {
                    question.noCorrectAnswerInQuestion = true;
                    $scope.noCorrectAnswerInQuestion = true;
                    $scope.noAnswerIndex = index;
                } else {
                    question.noCorrectAnswerInQuestion = false;
                }

                if(question.noCorrectAnswerInQuestion && firstNoAnswerIndex === null) {
                    firstNoAnswerIndex = index;
                }

                angular.forEach(question.variantsArray,function (variant) {
                    if((variant.value == '' || variant.value == null)){
                        emptyQuestion = true;
                    }
                });
            });

            if($scope.newTestParam.testName !== null && $scope.newTestParam.testName !== '' && !emptyQuestion && !$scope.noCorrectAnswerInQuestion) {
                var testForSend = {};
                angular.copy($scope.newTestParam, testForSend);
                angular.forEach($scope.newTestParam.questions, function (quest, key) {
                    testForSend.questions[key].num = key + 1;
                    testForSend.questions[key].rightAnswersArray = [];
                    testForSend.questions[key].imageId = $rootScope.testQuestionLogo[key];
                    angular.forEach(quest.variantsArray, function (variant, index) {
                        if(variant.isCorrect) {
                            if(variant.value)
                                testForSend.questions[key].rightAnswersArray.push(variant.value);
                        }
                    })
                });
                angular.forEach($scope.newTestParam.questions, function (quest, key) {
                    testForSend.questions[key].variantsArray = [];
                    angular.forEach(quest.variantsArray, function (answ, ind) {
                        if(answ.value) {
                            testForSend.questions[key].variantsArray.push(answ.value);
                        }
                    });
                    if(quest.answerType) {
                        testForSend.questions[key].answerType = 'task_question'
                    } else {
                        if(testForSend.questions[key].rightAnswersArray.length == 1) {
                            testForSend.questions[key].answerType = 'one_answer'
                        } else {
                            testForSend.questions[key].answerType = 'few_answers'
                        }
                    }
                });

                testForSend.timeLimit = ($scope.timeLimit.hh*60 + $scope.timeLimit.mm)*60;
                testForSend.status = 'A';
                Test.saveTest(testForSend, function (resp) {
                    if(resp.status == "ok") {
                        if($scope.optionTab == 'add') {
                            notificationService.success($filter('translate')('You created the new test:') + ' ' + testForSend.testName);
                        } else {
                            notificationService.success($filter('translate')('Changes are saved') + ' ' + testForSend.testName);
                        }
                        $scope.changeTab('show');
                    }else {
                        notificationService.error(resp.message);
                    }
                }, function (err) {
                    notificationService.error(err.message);
                });
            } else {
                let emptyFilesError = $scope.newTestParam.testName === null || $scope.newTestParam.testName === '' || emptyQuestion;


                $(".obligatory").each(function () {
                    if($(this)[0].value == '' || $(this)[0].value === null) {
                        $(this).addClass("empty")
                    }
                });
                if(emptyFilesError) {
                    notificationService.error($filter('translate')('You should fill all obligatory fields.'))
                } else if(!emptyFilesError && $scope.noCorrectAnswerInQuestion){
                    let element = $('#question-' + firstNoAnswerIndex);
                    $("html, body").animate({scrollTop: element.position().top + element.height()}, "slow");
                    return;
                }
            }
        };

        $scope.showDeleteTest = function (testId, testName) {
            $rootScope.testForDelete = {testId: testId, testName: testName};
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/test-delete.html',
                size: '',
                resolve: function(){
                }
            });
        };

        if($rootScope.$state.current.data.pageName == "Test page") {
            $scope.testPreview = {};
            Test.getTest({
                id: $stateParams.id
            }, function(resp) {
                if (resp.status == "ok") {
                    angular.copy(resp.object, $scope.testPreview);
                    angular.forEach(resp.object.questions, function (question, questInd) {
                        $scope.testPreview.questions[questInd].variantsArray = [];
                        angular.forEach(question.variantsArray, function (variant, variantInd) {
                            if(question.rightAnswersArray.includes(variant)){
                                $scope.testPreview.questions[questInd].variantsArray.push({value: variant, isCorrect: true});
                            } else {
                                $scope.testPreview.questions[questInd].variantsArray.push({value: variant, isCorrect: false});
                            }
                        });
                    });
                } else {
                    notificationService.error(resp.message);
                }
            });
        }

        $rootScope.closeModal = function(){
            $scope.modalInstance.close();
        };
        $rootScope.deleteTest = function (testId) {
            Test.deleteTest({id: testId}, function () {
                notificationService.success($filter('translate')('The test was deleted'));
                $scope.changeTab('show');
            }, function (err) {
                notificationService.error(err.message);
            });
            $rootScope.closeModal();
        };
        $rootScope.changeSearchType = function(param){
            $window.location.replace('/!#/candidates');
            $rootScope.changeSearchTypeNotFromCandidates = param;
        };
        $scope.getTestFunc = function () {
            Test.getTest({
                id: $stateParams.id
            }, function(resp) {
                if (resp.status == "ok") {
                    $rootScope.sendOneTest = resp.object;
                    $rootScope.linkTest = $location.$$protocol + "://" + $location.$$host + "/i#/pass_the_test/" + $rootScope.sendOneTest.id;
                    $scope.emailTestCandidate = $filter('translate')('Please pass the') + '"' + $rootScope.sendOneTest.testName + '"' + $filter('translate')('test');
                    $scope.textEmailTestCandidate = $filter('translate')('Hi!') + '<br>'+ '<br>' + $filter('translate')('Please pass the') + '"' + $rootScope.sendOneTest.testName + '"' + $filter('translate')('test via this link:') + '<br>' + '<br>' + $filter('translate')('{here will be individual link for test for each candidate}') + '<br>' + '<br>' + '--' + '<br>' + $filter('translate')('Best regards,') + '<br>' + $rootScope.me.fullName;
                } else {
                    notificationService.error(resp.message);
                }
            });
        };
        if($rootScope.$state.current.data.pageName == 'Send test candidate to email'){
            $scope.getTestFunc();
        }
        $scope.sendTestRequest = [];
        $scope.$on('groupNameList', function(event, groupNameList) {
            $scope.sendTestRequest = [];
            console.log('groupnamelist',groupNameList);
            $scope.groupNameList = groupNameList;
            angular.forEach($scope.groupNameList, function(nval, ind) {
                if(nval !== undefined){
                    $scope.candidate = nval;
                    $rootScope.emailCandidate = nval.email[0].value;
                    $scope.sendTestRequest.push({
                        candidateId:  $scope.candidate.id ,
                        email:  $rootScope.emailCandidate
                    });
                }
            });
        });
        $('#testCandidate').on("change", function(e) {
            $("#testCandidate").select2('val', '');
        });
        $scope.deleteCandidate = function(candidate){
            angular.forEach($scope.groupNameList, function(nval, ind) {
                if (nval.id === candidate.id) {
                    $scope.groupNameList.splice(ind, 1);
                    angular.forEach($('.select2-search-choice'), function(val) {
                        if($(val).find('div')[0].innerText == nval.text){
                            document.getElementById("testCandidate").setAttribute('value', $scope.groupNameList);
                            $(val).remove();
                        }
                    });
                }
            });
        };
        setTimeout(function(){
            tinymce.init({
                selector: '#testCandidateMCE',
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
                        $scope.textEmailTestCandidate = tinyMCE.get('testCandidateMCE').getContent();
                    });
                }
            });
        }, 0);
        $rootScope.changesEmail = function (text, id) {
            $scope.emailCandidateId  = id;
            $rootScope.emailCandidate = text;
        };
        $scope.changeEmailTestCandidate = function(groupList, candidate){
            console.log(groupList);
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/change-email-test-candidate.html',
                size: '',
                resolve: {
                }
            });
            if(candidate != undefined){
                $rootScope.groupNameList = groupList;
                angular.forEach(groupList.contacts, function (val) {
                    if(val.type == 'email'){
                        $rootScope.emailCandidate = val.value.split(" ")[0].replace(/,/g,"");
                    }
                });
            }else{
                $rootScope.groupNameList = groupList;
                $rootScope.emailCandidate = $rootScope.groupNameList.email[0].value.split(" ")[0].replace(/,/g,"");
            }
        };
        $rootScope.saveChangeEmailTestCandidate = function(candidate){
            var email = $('#changeEmailCandidate');
            console.log(email.val().indexOf('@'));
            console.log(email.val().indexOf('@') > 0);
            if(email.val().indexOf('@') > 0){
                email.css('border','2px solid #61B452');
                if(candidate != undefined){
                    angular.forEach($rootScope.groupNameList.contacts, function (val) {
                        if(val.type == 'email'){
                            val.value = $rootScope.emailCandidate;
                        }
                    });
                }else{
                    $rootScope.groupNameList.email[0].value = $rootScope.emailCandidate;
                }
                $scope.sendTestRequest.push({
                    candidateId: $scope.emailCandidateId,
                    email: $rootScope.emailCandidate
                });
                function removeDuplicates(arr, prop) {
                    var new_arr = [];
                    var lookup  = {};

                    for (var i in arr) {
                        lookup[arr[i][prop]] = arr[i];
                    }

                    for (i in lookup) {
                        new_arr.push(lookup[i]);
                    }
                    return new_arr;
                }

                var uniqueArray = removeDuplicates($scope.sendTestRequest, "candidateId");
                $scope.sendTestRequest = uniqueArray;
                $rootScope.closeModal();
            }else{
                email.css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
                email.focus();
                $("#error-password").removeClass("hidden");
                $("#error-password").html('Кажется, вы ввели неверный email. Пожалуйста, попробуйте ещё раз.');
                //$("#error-password").html('Seems like email you entered is incorrect. Please enter the correct one.');
                setTimeout(function(){
                    $("#error-password").hide();
                },5000);
            }
        };
        if($rootScope.$state.current.data.pageName == 'Send test candidate to email from candidate'){
            $rootScope.sendCandidateToTest();
            if($rootScope.candidateToTest == undefined){
                $rootScope.candidateToTest = JSON.parse($localStorage.get('candidateForTest'));
                $rootScope.fromCandidate = [$rootScope.candidateToTest];
                $rootScope.emailCandidateId = $rootScope.candidateToTest.candidateId;
                if($rootScope.candidateToTest.contacts.length > 0){
                    angular.forEach($rootScope.candidateToTest.contacts, function (nval) {
                        if (nval.type == "email") {
                            delete  $rootScope.emailCandidate;
                            var email = nval.value.split(" ")[0];
                            $rootScope.emailCandidate = email.replace(/,/g,"");
                        }
                    });
                }else{
                    notificationService.error($filter('translate')('Please add an email before sending a test to this candidate'))
                }
            }
            $scope.sendTestRequest.push({
                candidateId: $rootScope.emailCandidateId,
                email: $rootScope.emailCandidate
            });
        }else if($rootScope.$state.current.data.pageName == 'Send test candidate to email from vacancy'){
            setTimeout(function(){
                $rootScope.candidatesInStages = JSON.parse($localStorage.get('vacancyForTest'));
                $rootScope.activeCustomStageName = $localStorage.get('activeCustomStageName');
                $scope.activeCustomStageId = $localStorage.get('activeCustomStageId');
                $rootScope.vacancySearchParams = {
                    state: $scope.activeCustomStageId,
                    vacancyId: $rootScope.candidatesInStages[0].vacancyId.vacancyId,
                    withCandidates: true,
                    withVacancies: true
                };
                Vacancy.getCandidatesInStages($rootScope.vacancySearchParams, function(resp){
                    if(resp.objects.length == 0){

                    }else{
                        $rootScope.candidatesInStages = resp.objects;
                        $localStorage.set('vacancyForTest', $rootScope.candidatesInStages);
                        $location.path('/candidate/send-test-candidate-to-email-from-vacancy');
                    }
                });
            }, 0);

        }
        $scope.sendTestToCandidate = function () {
            if($rootScope.$state.current.data.pageName == 'Send test candidate to email'){
                $scope.textEmailTestCandidate = tinyMCE.get('testCandidateMCE').getContent();
                $location.path('/candidate/tests');
            }else if($rootScope.$state.current.data.pageName == 'Send test candidate to email from vacancy'){
                $scope.textEmailTestCandidate = tinyMCE.get('testCandidateMCE2').getContent();
                $location.path('/vacancies/' + $rootScope.candidatesInStages[0].vacancyId.localId);
            }else if($rootScope.$state.current.data.pageName == 'Send test candidate to email from candidate'){
                $scope.textEmailTestCandidate = tinyMCE.get('testCandidateMCE2').getContent();
                $location.path('/candidates/' + $rootScope.candidateToTest.localId);
            }
            Test.sendTest({
                testId: $rootScope.sendOneTest.id,
                appointments: $scope.sendTestRequest,
                text: $scope.textEmailTestCandidate
            }, function(resp) {
                if (resp.status == "ok") {
                    notificationService.success($filter('translate')('The email with a link to the test was successfully sent'));
                } else {
                    notificationService.error(resp.message);
                }
            });
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
        $scope.objCandiateEmail = [];
        $scope.addCandidateLinkToText = function (objCandidate) {
            if(objCandidate.checked){
                if(objCandidate.candidateId.email != undefined){
                    $scope.objCandiateEmail.push({
                        candidateId:  objCandidate.candidateId.candidateId,
                        email:  objCandidate.candidateId.email.split(" ")[0].replace(/,/g,"")
                    });
                }else{
                    notificationService.error($filter('translate')('Please add an email before sending a test to this candidate'));
                }
            }else{
                angular.forEach($scope.objCandiateEmail, function(val, ind) {
                    if(val.candidateId == objCandidate.candidate){
                        $scope.objCandiateEmail.splice(ind, 1);
                    }
                });
            }
            $scope.sendTestRequest = $scope.objCandiateEmail;
            console.log($scope.objCandiateEmail);
        };
        setTimeout(function(){
            var myListener = $scope.$on('addedTest', function(event, data){
                console.log(data);
                if(data != undefined){
                    $('.select2-choice').find('abbr').css('margin-top', '-2px');
                    $('#testCandidateFromVacancyId').show();
                    $('.testCandidateFromCandidate').show();
                    $('.showLetter').show();
                    $rootScope.sendOneTest.id = data.id;
                    $scope.emailTestCandidate = $filter('translate')('Please pass the') + '"' + data.text + '"' + $filter('translate')('test');
                    $scope.textEmailTestCandidate = $filter('translate')('Hi!') + '<br>'+ '<br>' + $filter('translate')('Please pass the') + '"' + data.text + '"' + $filter('translate')('test via this link:') + '<br>' + '<br>' + $filter('translate')('{here will be individual link for test for each candidate}') + '<br>' + '<br>' + '--' + '<br>' + $filter('translate')('Best regards,') + '<br>' + $rootScope.me.fullName;
                    setTimeout(function(){
                        tinyMCE.get('testCandidateMCE2').setContent($scope.textEmailTestCandidate);
                    }, 0);
                }
            });
            $scope.$on('$destroy', myListener);
        }, 20);
        setTimeout(function(){
            tinymce.init({
                selector: '#testCandidateMCE2',
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
                        $scope.textEmailTestCandidate = tinyMCE.get('testCandidateMCE2').getContent();
                    });
                }
            });
        }, 700);
        $scope.goBack = function(){
            history.back()
        };
    }]);