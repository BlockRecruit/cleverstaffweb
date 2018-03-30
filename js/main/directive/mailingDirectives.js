directive.directive('mailingCandidateAutocompleter', ["$filter", "serverAddress", function($filter, serverAddress) {
    return {
        restrict: 'EA',
        replace: true,
        link: function(scope, element, attrs) {
            console.log('elem', $(element[0]))
            if ($(element[0])) {
                element.select2({
                    placeholder: $filter('translate')('select candidate'),
                    minimumInputLength: 0,
                    ajax: {
                        url: serverAddress + "/candidate/autocompleate",
                        dataType: 'json',
                        crossDomain: true,
                        quietMillis: 500,
                        type: "POST",
                        data: function(term, page) {
                            return {
                                name: term.trim(),
                                withPersonalContacts: true
                            };
                        },
                        results: function(data, page) {
                            var results = [];
                            if (data['objects'] !== undefined) {
                                angular.forEach(data['objects'], function(item) {
                                    if(!scope.$parent.candidatesForMailing.some((candidate) => {
                                        return candidate.candidateId.localId == item.localId
                                    })) {
                                        results.push({
                                            id: item.localId,
                                            text: item.fullName,
                                            contacts: item.contacts
                                        });
                                    }
                                });
                            }
                            return {
                                results: results
                            };
                        }
                    },
                    dropdownCssClass: "bigdrop"
                }).on('change', (e) => {
                    if(e.added) {
                        console.log('scope.$parent',scope.$parent.candidatesForMailing)
                        scope.$parent.newRecipient = e.added;
                    }
                });
            }
        }
    }
}]).directive('mailingVacancyAutocompleter', ["$filter", "$localStorage", "serverAddress", "$translate", "$rootScope", "Vacancy","Mailing", function($filter, $localStorage, serverAddress, $translate, $rootScope, Vacancy, Mailing) {
        return {
            restrict: 'EA',
            replace: true,
            link: function($scope, element) {
                let candidatesCount = [];
                $(element[0]).select2({
                    placeholder: $filter('translate')('enter job title'),
                    minimumInputLength: 0,
                    ajax: {
                        url: serverAddress + "/vacancy/autocompleter",
                        dataType: 'json',
                        crossDomain: true,
                        quietMillis: 500,
                        type: "POST",
                        data: function(term, page) {
                            return {
                                name: term.trim()
                            };
                        },
                        results: function(data, page) {
                            var results = [];
                            if (data['objects'] !== undefined) {
                                $.each(data['objects'], function(index, item) {
                                    var clientName = "";
                                    if (item.clientId.name.length > 20) {
                                        clientName = item.clientId.name.substring(0, 20);
                                    } else {
                                        clientName = item.clientId.name;
                                    }
                                    var inVacancy = false;
                                    var interviewStatus;
                                    if (item.interviewStatus == undefined) {
                                        item.interviewStatus = 'longlist,shortlist,interview,approved,notafit,declinedoffer';
                                    }
                                    var extraText = "";
                                    if (item.interviews != null) {
                                        interviewStatus = item.interviews[0].state;
                                        angular.forEach($rootScope.customStages, function(stage){
                                            if(interviewStatus == stage.customInterviewStateId){
                                                interviewStatus = stage.name
                                            }
                                        });
                                        extraText = " [ " + $filter('translate')(interviewStatus) + " ]";
                                        inVacancy = true;
                                    }
                                    results.push({
                                        vacancy: item,
                                        id: item.vacancyId,
                                        localId: item.localId,
                                        status: interviewStatus,
                                        text: item.position + " (" + clientName + ")" + extraText,
                                        interviewStatus: item.interviewStatus,
                                        inVacancy: inVacancy
                                    });
                                });
                            }
                            return {
                                results: results
                            };
                        }
                    },
                    dropdownCssClass: "bigdrop"
                }).on("change", function(e) {
                    $scope.vacancy = e.added;
                    $scope.emptyEmails.count = 0;
                    statusListForming($scope.vacancy.id, $scope.vacancy.interviewStatus);
                });

                function setSelect2Vacancy() {
                    let recipientsSource = JSON.parse($localStorage.get('mailingRecipientsSource'));
                    if(recipientsSource && recipientsSource.state && recipientsSource.localId) {
                        Mailing.getVacancyParams(recipientsSource.localId).then((result) => {
                            $(element[0]).select2("data", {id: result.vacancyId, text: result.position});
                            statusListForming(result.vacancyId, result.statuses).then((result) => {
                                console.log("$scope.VacancyStatusFiltered",$scope.VacancyStatusFiltered)
                                $scope.VacancyStatusFiltered.some((status)=> {
                                    if(status.value == recipientsSource.state) {
                                        recipientsSource.fullState = status;
                                        return true
                                    } else {
                                        return false
                                    }
                                });
                                $('#stageSelect').val(JSON.stringify(recipientsSource.fullState));
                            });
                        }, (error) =>{
                            notificationService.error(error)
                        })
                    }
                }
                setSelect2Vacancy();

                function statusListForming(vacancyId, statuses) {
                    return new Promise((resolve, reject) => {
                        if(vacancyId) {
                            Vacancy.getCounts({vacancyId: vacancyId}, (resp) => {
                                candidatesCount = resp.object;
                                var sortedStages = [];
                                var array = statuses.split(',');
                                var VacancyStatus = Vacancy.interviewStatusNew();
                                var i = 0;
                                angular.forEach(array, function(resp) {
                                    angular.forEach(VacancyStatus, function(vStatus) {
                                        if (vStatus.used) {
                                            if(i == 0){
                                                angular.forEach($rootScope.customStages, function(res) {
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
                                candidatesCount.forEach((candidateCount) => {
                                    sortedStages.forEach((stage) => {
                                        if(stage.customInterviewStateId) {
                                            if(stage.customInterviewStateId == candidateCount.item) {
                                                stage.count =  candidateCount.count
                                            }
                                        } else {
                                            if(stage.value == candidateCount.item) {
                                                stage.count =  candidateCount.count
                                            }
                                        }
                                    })
                                });
                                $scope.VacancyStatusFiltered = sortedStages;

                                if (!$scope.$$phase && !$rootScope.$$phase) {
                                    $scope.$apply();
                                }
                                resolve();
                            }, (error) => {
                                notificationService.error(error.message);
                                reject();
                            });
                        }
                    })

                }
            }
        }
    }]).directive('mailingFetchCandidates',["$q", "$localStorage", "$filter", "$rootScope", "notificationService", "Vacancy", function ($q, $localStorage, $filter, $rootScope, notificationService, Vacancy) {
        return {
            restrict: 'EA',
            template: `<div class="item" ng-show="statuses">
                            <label ng-show="statuses && (status.value != 'approved' && status.value != 'notafit')">{{'interview_status'|translate}}</label>
                            <div ng-show="$root.hover && $root.status2 === false" style="position: absolute">{{"longlist"|translate}}</div>
                            <select ng-model="currentStatus" class="stage-select" ng-change="fetchCandidates()" id="stageSelect">
                                <option ng-repeat="status in statuses track by status.value"
                                        value="{{status}}">
                                    {{status.value|translate}} ({{status.count?status.count:'0'}})
                                </option>
                            </select>
                        </div>`,
            scope: {
              statuses: '=',
              vacancyId: '@',
              localId: '@',
              candidates: '='
            },
            link: function (scope, element) {
                scope.currentStatus = {};
                let regForMailSplit = /[\s,;]+/;
                let maxCandidatesPerRequest = 500;
                let vacancySearchParams = {
                    state: status.value,
                    page: {number:0, count: maxCandidatesPerRequest},
                    vacancyId: scope.vacancyId,
                    interviewSortEnum: 'addInVacancyDate',
                    withCandidates: true,
                    withVacancies: false
                };
                let recipientsSource = JSON.parse($localStorage.get('mailingRecipientsSource'));
                recipientsSource = recipientsSource?recipientsSource:{localId: "", vacancyId: "",};
                scope.fetchCandidates = function () {
                    if(scope.currentStatus) {
                        let statusPicked = JSON.parse(scope.currentStatus);
                        vacancySearchParams.page.count = statusPicked.count;
                        vacancySearchParams.vacancyId = scope.vacancyId||recipientsSource.vacancyId;
                        vacancySearchParams.state = statusPicked.customInterviewStateId?statusPicked.customInterviewStateId:statusPicked.value;
                        if(statusPicked.count > 0 && statusPicked.count < maxCandidatesPerRequest) {
                            fetchCandidate(vacancySearchParams, statusPicked.value).then((result) => {
                                setTable(result);
                            }, (error) => {
                            });
//If candidates count too large, load through several requests
                        } else if (statusPicked.count >= maxCandidatesPerRequest){
                            let pagesCount = Math.ceil(statusPicked.count/maxCandidatesPerRequest);
                            vacancySearchParams.page.count = maxCandidatesPerRequest;
                            recursiveFetch(pagesCount, []);
                        }
                    }
                };


                function recursiveFetch(pages,candidates) {
                    let countPages = pages;
                    let allFetched = candidates;
                    if(pages > 0) {
                        countPages--;
                        vacancySearchParams.page.number = countPages;
                        fetchCandidate(vacancySearchParams).then((result) => {
                            allFetched = allFetched.concat(result);
                            recursiveFetch(countPages,allFetched);
                        }, (error) => {
                        });
                    } else {
                        setTable(allFetched);
                    }
                }

                function setTable(result) {
                    let candidates = candidatesToTable(result);
                    if(candidates && candidates.length > 0) {
                        scope.candidates = candidatesToTable(result);
                        $localStorage.set('candidatesForMailing', scope.candidates);
                        scope.$parent.emptyEmails.count = 0;
                    } else {
                        notificationService.error($filter('translate')('No active candidates on this stage'));
                    }
                }


                function fetchCandidate(params, stageName) {
                    return new $q((resolve, reject) => {
                        $rootScope.loading = true;
                        Vacancy.getCandidatesInStages(params, (resp) => {
                            if(resp.status != 'error') {
                                saveVacancyParams(params.state, scope.localId, scope.vacancyId, stageName);
                                $rootScope.loading = false;
                                if(!$rootScope.$$phase)
                                    $rootScope.$apply();
                                resolve(resp.objects);
                            } else {
                                notificationService.error(resp.message);
                                $rootScope.loading = false;
                                if(!$rootScope.$$phase)
                                    $rootScope.$apply();
                                reject();
                            }
                        }, (error) => {
                            notificationService.error(error.message);
                            $rootScope.loading = false;
                            if(!$rootScope.$$phase)
                                $rootScope.$apply();
                            reject();
                        })
                    })
                }


                function saveVacancyParams(state, localId, vacancyId, stageName) {
                    $localStorage.set('mailingRecipientsSource', JSON.stringify({
                        localId: localId?localId:recipientsSource.localId,
                        vacancyId: vacancyId?vacancyId:recipientsSource.vacancyId,
                        state: state,
                        stageName: stageName,
                        fullState: JSON.parse(scope.currentStatus)
                    }));
                }

                
                function candidatesToTable(fetched) {
                    let transformed = [];
                    fetched.forEach((candidate)=> {
                        if(candidate.candidateId.status != 'archived') {
                            transformed.push({
                                candidateId: {
                                    fullName:  candidate.candidateId.fullName,
                                    firstName: candidate.candidateId.fullName.split(' ')[0],
                                    lastName: candidate.candidateId.fullName.split(' ')[1]?candidate.candidateId.fullName.split(' ')[1]:'',
                                    email: candidate.candidateId.email?candidate.candidateId.email.split(regForMailSplit)[0]:'',
                                    localId: candidate.candidateId.localId
                                },
                                mailing: true
                            });
                        }
                    });
                    return transformed
                }

            }
        }
}]);