controller.controller('testResults', ["$scope", "Test", "notificationService", "$filter", "$rootScope", "$uibModal", "$window", "$stateParams", "$location", "ngTableParams", function ($scope, Test, notificationService, $filter, $rootScope, $uibModal, $window, $stateParams, $location, ngTableParams) {

    $scope.a = {};
    $scope.a.searchNumber = 1;
    $scope.requestParams = {};
    $scope.objectSize = 0;
    $scope.test = {};
    $scope.detailedInfo = {};
    localStorage.setItem("isAddCandidates", false);
    if($location.path().match('candidate/tests/results')) {
        $scope.typeOfResults = 'candidate';
        $scope.requestParams = {
            candidateId: $stateParams.id,
            page: {number: 0, count: 15}
        };
    } else if($location.path().match('candidate/test/results')) {
        $scope.typeOfResults = 'test';
        $scope.requestParams = {
            testId: $stateParams.id,
            page: {number: 0, count: 15}
        };
        Test.getTest({id: $stateParams.id}, function (resp) {
            if(resp.status == "ok"){
                $scope.test = resp.object;
            } else {
                notificationService.error(resp.message)
            }
        });
    } else if($location.path().match('/candidate/test/details/')){
        $scope.typeOfResults = 'detailed';
        Test.getAppointment({id: $stateParams.id}, function (resp) {
            if(resp.status == "ok") {
                $scope.detailedInfo = {};
                angular.copy(resp.object, $scope.detailedInfo);
                $scope.detailedInfo.maxPoints = 0;
                var withoutAnswers = [];
                angular.forEach(resp.object.answers,function (answer) {
                    withoutAnswers.push(answer.questionId);
                });
                angular.forEach(resp.object.test.questions, function (question, questInd) {
                    $scope.detailedInfo.test.questions[questInd].variantsArray = [];
                    if(!withoutAnswers.includes(question.id)) {
                        resp.object.answers.push({questionId: question.id, points: 0});
                    }
                    angular.forEach(resp.object.answers, function (answer, answId) {
                        if(answer.questionId == question.id) {
                            angular.forEach(question.variantsArray, function (variant, variantInd) {
                                if(answer.variantsArray) {
                                    if(answer.variantsArray.includes(variant)){
                                        if(question.rightAnswersArray.includes(variant)){
                                            $scope.detailedInfo.test.questions[questInd].variantsArray.push({value: variant, isCorrect: true, chosen: true});
                                        } else {
                                            $scope.detailedInfo.test.questions[questInd].variantsArray.push({value: variant, isCorrect: false, chosen: true});
                                        }
                                    } else {
                                        $scope.detailedInfo.test.questions[questInd].variantsArray.push({value: variant, isCorrect: false, chosen: false});
                                    }
                                } else {
                                    if(question.rightAnswersArray.includes(variant)){
                                        $scope.detailedInfo.test.questions[questInd].variantsArray.push({value: variant, isCorrect: true, chosen: false});
                                    } else {
                                        $scope.detailedInfo.test.questions[questInd].variantsArray.push({value: variant, isCorrect: false, chosen: false});
                                    }
                                }
                            });
                            if(answer.text) {
                                $scope.detailedInfo.test.questions[questInd].textAnswer = answer.text;
                            }
                            if($scope.detailedInfo.test.questions[questInd].points !== undefined) {
                                $scope.detailedInfo.maxPoints += $scope.detailedInfo.test.questions[questInd].points;
                            }
                            if(answer.points !== undefined) {
                                $scope.detailedInfo.test.questions[questInd].points = answer.points;
                            }
                            $scope.detailedInfo.test.questions[questInd].answerId = answer.answerId;
                        }
                    });

                });

                console.log('detailed',$scope.detailedInfo)
            } else {
                notificationService.error(resp.message);
            }
        });
    }

    if($scope.typeOfResults == 'test' || $scope.typeOfResults == 'candidate') {
        $scope.tableParams = new ngTableParams({
            page: 1,
            count: $scope.requestParams.page.count
        }, {
            total: 0,
            getData: function($defer, params) {
                $rootScope.loading = true;
                $scope.requestParams.page.number = params.$params.page - 1;
                $scope.requestParams.page.count = params.$params.count;
                $scope.count = 0;
                Test.getAppointments($scope.requestParams, function(response) {
                    if(response.status == "ok") {
                        $rootScope.loading = false;
                        angular.forEach(response.objects,function (val) {
                            if(val.percentile != undefined){
                                $scope.count++;
                            }
                        });
                        $scope.paginationParams = {
                            currentPage: $scope.requestParams.page.number,
                            totalCount: response['total']
                        };
                        $scope.candidateName = response.objects[0].candidateName;
                        $scope.candidateLocalId = response.objects[0].candidateLocalId;
                        $scope.objectSize =  response['objects'] != undefined ? response['total'] : 0;
                        params.total(response['total']);

                        $defer.resolve(response['objects']);
                        $scope.a.searchNumber = $scope.tableParams.page();
                    } else {
                        notificationService.error(response.message)
                    }
                });

            }
        });
    }

    $scope.changeInputPage = function(params,searchNumber){
        var searchNumber = Math.round(searchNumber);
        var maxValue = $filter('roundUp')(params.settings().total/params.count());
        if(searchNumber){
            if(searchNumber >= 1 && searchNumber <= maxValue){
                params.page(searchNumber);
                $scope.a.searchNumber = searchNumber;
                $scope.requestParams.page.number = $scope.a.searchNumber - 1;
            }
        }
    };

    $scope.changePoints = function (answerId, points, inited) {
        if(inited) {
            Test.editAnswer({answerId: answerId, points: points}, function (resp) {
                if(resp.status != "ok"){
                    notificationService.error(resp.message)
                }
            });
        }
    };
    $scope.changeStatus = function (appointmentId, status) {
            Test.editAppointment({appointmentId: appointmentId, passed: status}, function (resp) {
                if(resp.status != "ok"){
                    notificationService.error(resp.message)
                }
            });
    };

}]);