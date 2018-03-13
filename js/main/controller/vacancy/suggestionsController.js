controller.controller('vacancySuggestionController', ["$rootScope", "$scope", "Vacancy", "$location",
    "$routeParams", "notificationService", "$filter", "$translate","vacancySuggestions","$uibModal",
    function($rootScope, $scope, Vacancy, $location, $routeParams, notificationService, $filter,
             $translate,vacancySuggestions,$uibModal) {
        $scope.candidates = [];
        $scope.suggestionTab = 'exactMatching';

        $scope.SuggestionsSortCriteria = 'scorePersent';
        $scope.reverseSort = true;

        $scope.$on('suggestions', function() {
            if(checkRequiredFieldsCompletion().invalid) {
                openSuggestionModal();
            } else {
                getSuggestions();
            }
        });

        $scope.closeModal = function(){
            $scope.modalInstance.close();
        };

        $scope.setSuggestionTab = function(tab) {
            $scope.suggestionTab = tab;
            if(tab === 'exactMatching') {
                $scope.suggestedCandidates = filterCandidatesByMatching($scope.candidates, true);
            } else {
                $scope.suggestedCandidates = filterCandidatesByMatching($scope.candidates, false);
            }
        };

        $scope.saveVacancyFromSuggestion = function() {
            if(checkRequiredFieldsCompletion().invalid) {
                notificationService.error($filter('translate')('Fill all fields'));
                return;
            }
            vacancySuggestions.saveVacancy($scope.vacancy)
                .then(resp => {
                    if(resp.status === 'ok') {
                        notificationService.success($filter('translate')('vacancy_save_1') + $scope.vacancy.position + $filter('translate')('vacancy_save_2'));
                        $scope.closeModal();
                        getSuggestions();
                    } else {
                        notificationService.error(resp.message);
                    }
                }, error => notificationService.error(error));
        };

        $scope.saveCandidateFromSuggestions = function(candidate) {
            vacancySuggestions.addCandidateToVacancy({
                vacancyId: $scope.vacancy.vacancyId,
                position: $scope.vacancy.position,
                candidateId: candidate.candidateId,
                comment: "",
                interviewState: "longlist",
                date: null,
            }).then(resp => {
                $scope.suggestedCandidates[$scope.suggestedCandidates.indexOf(candidate)].adviceType = 'has';
                $scope.$apply();
                notificationService.success($filter('translate')('added_candidate'));
            }, error => {
                notificationService.error(error.message);
            });
        };

        $scope.sortCandidatesBy = function(head) {
            if(head !== $scope.SuggestionsSortCriteria) {
                $scope.SuggestionsSortCriteria = head;
                $scope.reverseSort = true;
            } else {
                $scope.reverseSort = !$scope.reverseSort;
            }
        };

         function getSuggestions() {
            $rootScope.loading = true;
            vacancySuggestions.getSuggestions({"vacancyId": $scope.vacancy.vacancyId})
                .then(resp => {
                    $scope.candidates = resp['objects'];
                    $scope.suggestedCandidates = filterCandidatesByMatching($scope.candidates, true);
                    $rootScope.loading = false;
                    $scope.$apply();
                });
        }

        function filterCandidatesByMatching(candidates, exactMatching){
             let result = [];

             candidates.forEach(candidate => {
                 if(candidate.exactlyAppropriate === exactMatching) {
                     result.push(candidate);
                 }
             });

             return result;
        }

        function checkRequiredFieldsCompletion() {
            $scope.emptyRequiredFields = [];
            let requiredFields = vacancySuggestions.getRequiredFields($scope.vacancy);

            Object.keys($scope.vacancy).forEach(key => {
                requiredFields.forEach(field => {
                    if(key === field && !$scope.vacancy[key] && $scope.vacancy[key] !== 0) {
                        console.log($scope.vacancy[key]);
                        if($scope.emptyRequiredFields.indexOf(key) === -1) {
                            $scope.emptyRequiredFields.push(key);
                        }
                    }
                    if(!$scope.vacancy[field] && $scope.vacancy[field] !== 0) {
                        if($scope.emptyRequiredFields.indexOf(field) === -1) {
                            $scope.emptyRequiredFields.push(field);
                        }
                    }
                    if(key === 'region' && !$scope.vacancy[key].city) {
                        if($scope.emptyRequiredFields.indexOf(key) === -1) {
                            $scope.emptyRequiredFields.push(key);
                        }
                    }
                })
            });

            return { invalid: Boolean($scope.emptyRequiredFields.length) };
        }

        function openSuggestionModal() {
            if($scope.emptyRequiredFields.length) {
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../partials/modal/vacancy-suggestion-check-fields.html',
                    size: '',
                    scope: $scope
                });

                $scope.modalInstance.result.then(() => {
                    if(checkRequiredFieldsCompletion().invalid) $scope.$parent.VacanciesInfCandidTaskHistClientFunc('candidate');
                },() => {
                    if(checkRequiredFieldsCompletion().invalid) $scope.$parent.VacanciesInfCandidTaskHistClientFunc('candidate');
                });
            }
        }
    }
]);



