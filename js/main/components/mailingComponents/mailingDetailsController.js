component.component('mDetails', {
    templateUrl: "partials/mailing/mailing-details.html",
    controller: function ($location, $scope, $rootScope, $localStorage, notificationService, $filter, $uibModal, $http, $state, Mailing, vacancyStages, Person) {
        $scope.candidatesForMailing = $localStorage.get('candidatesForMailing')?JSON.parse($localStorage.get('candidatesForMailing')):[];
        let olderAvailableStep = $localStorage.get('stepClickable');
        $scope.newRecipient = {};
        $scope.editFromName = false;
        $scope.topic = '';
        $scope.allChecked = true;
        $scope.vacancy = {};
        let regForMailSplit = /[\s,;]+/;

        $scope.mailingDetails = Mailing.getMailingDetails();

        if($scope.mailingDetails) {
            $scope.topic = $scope.mailingDetails.subject;
            $scope.fromName = $scope.mailingDetails.fromName;
            $scope.fromMail = $scope.mailingDetails.fromMail;
        } else {
            $scope.fromName = $rootScope.me.fullName;
            $scope.fromMail = $rootScope.me.login;
            for(let i = $scope.candidatesForMailing.length - 1; i >= 0; i-- ) {
                if($scope.candidatesForMailing[i].candidateId.email)
                    $scope.candidatesForMailing[i].candidateId.email = $scope.candidatesForMailing[i].candidateId.email.split(regForMailSplit)[0];
                $scope.candidatesForMailing[i].mailing = true;
            }
        }
        //Set new params or get already set -- end


        $scope.checkAll = function () {
            if($scope.allChecked) {
                for(let i = $scope.candidatesForMailing.length - 1; i >= 0; i-- ) {
                    $scope.candidatesForMailing[i].mailing = true;
                }
            } else {
                for(let i = $scope.candidatesForMailing.length - 1; i >= 0; i-- ) {
                    $scope.candidatesForMailing[i].mailing = false;
                }
            }
        };





        $scope.saveCandidateContacts = function (candidate, newEmail) {
            if(!candidate.localId) {
                notificationService.error('There is no candidate Id. This mailing is broken. Please, create new mailing');
                return
            }
            if(Mailing.emailValidation(newEmail)) {
                candidate.email = newEmail;
                editCandidate(candidate);
            } else {
                notificationService.error($filter('translate')('wrong_email'));
            }
        };


        $scope.cancelSavingCandidateContacts = function (localId) {
            hideEditInput(localId)
        };


        $scope.deleteCandidates = function (candidateObj) {
            $scope.candidateForDelete = candidateObj;
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/delete-candidates-from-mailing.html?1',
                size: '',
                scope: $scope,
                resolve: function(){
                }
            });
        };


        $scope.addRecipient = function () {
            if($scope.newRecipient) {
                let preparedCandidate = candidateTransform($scope.newRecipient);
                preparedCandidate.mailing = true;
                if(preparedCandidate) {
                    $scope.candidatesForMailing.unshift(preparedCandidate);
                    Mailing.updateSubList(Mailing.getInternal(), $scope.candidatesForMailing).then((response) => {
                        $localStorage.set('candidatesForMailing', $scope.candidatesForMailing);
                        notificationService.success($filter('translate')('Recipient added'));
                    }, (error) => {
                        notificationService.error(error.message);
                    });
                    $scope.modalInstance.close();
                } else {
                    console.log('preparedCandidate is:',preparedCandidate)
                }
            } else {
                console.log('$scope.newRecipient is:',$scope.newRecipient)
            }

            function candidateTransform(candidate) {
                let candidateTransformed = {
                    candidateId: {}
                };
                candidateTransformed.candidateId.localId = candidate.id;
                candidateTransformed.candidateId.firstName = candidate.text.split(' ')[0];
                candidateTransformed.candidateId.lastName = candidate.text.split(' ')[1]?candidate.text.split(' ')[1]:'';
                candidateTransformed.candidateId.fullName = candidate.text;
                if(candidate.contacts) {
                    candidate.contacts.some((contact) => {
                        if(contact.type == 'email') {
                            candidateTransformed.candidateId.email = contact.value;
                            return true
                        }
                    });
                }

                return candidateTransformed
            }

        };


        $scope.confirmDelete = function () {
            if($scope.candidatesForMailing.length > 1) {
                let beforeDeleting = angular.copy($scope.candidatesForMailing);
                _.remove($scope.candidatesForMailing, function (obj) {
                    return (obj.candidateId.localId == $scope.candidateForDelete.localId) && obj.candidateId.localId && obj.candidateId.localId;
                });
                $scope.modalInstance.close();
                $localStorage.set('candidatesForMailing', $scope.candidatesForMailing);
                Mailing.updateSubList(Mailing.getInternal(), $scope.candidatesForMailing).then((response) => {
                    notificationService.success($filter('translate')('deleted'));
                }, (error) => {
                    $scope.candidatesForMailing = angular.copy(beforeDeleting);
                    notificationService.error(error.message);
                });
            } else {
                notificationService.error($filter('translate')('Must be at least one recipient'));
            }
        };


        $scope.toTheEditor = function (toThePreview) {
            let notValid = false;
            $('.required').each(function () {
                let element = $(this);
                element.removeClass('empty');
                if(element[0].value.length == 0) {
                    element.addClass('empty');
                    notValid = true;
                }
            });
            if(notValid) {
                $('html, body').animate({scrollTop: 0}, 500, 'easeOutQuart');
                notificationService.error($filter('translate')('You should fill all obligatory fields.'))
            } else {
                $localStorage.set('candidatesForMailing', $scope.candidatesForMailing);
                if($scope.candidatesForMailing && $scope.candidatesForMailing.some(function (candidate) {return candidate.mailing})) {
                    if($scope.candidatesForMailing.length > 1000) {
                        notificationService.error($filter('translate')('Count of recipients should be less than 1000'));
                        return
                    }
                    let incorrectEmails = false;
                    angular.forEach($scope.candidatesForMailing, (candidate)=>{
                        if(candidate.candidateId.email && candidate.mailing) {
                            if(candidate.candidateId.email.indexOf('@') == -1 && candidate.mailing) {
                                candidate.wrongEmail = true;
                                incorrectEmails = true;
                            }
                        } else {
                            candidate.wrongEmail = true;
                            incorrectEmails = true;
                        }

                    });
                    if(!$scope.$$phase && !$rootScope.$$phase) {
                        $scope.$apply();
                    }
                    if(!incorrectEmails) {
                        if(toThePreview) {
                            Mailing.saveSubscribersList($scope.topic, Mailing.getInternal(), $scope.fromName, $scope.fromMail, $scope.candidatesForMailing);
                            Mailing.toThePreview();
                        } else {
                            Mailing.saveSubscribersList($scope.topic, Mailing.getInternal(), $scope.fromName, $scope.fromMail, $scope.candidatesForMailing, true);
                        }
                    } else {
                        notificationService.error($filter('translate')('Wrong emails'))
                    }

                } else {
                    notificationService.error($filter('translate')('Please pick the candidates'));
                }
            }
        };


        $scope.addRecipientModal = function () {
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/mailing-add-recipient.html',
                size: '',
                scope: $scope,
                resolve: function(){

                }
            });
        };

        $scope.candidateCheckbox = function (candidate) {
            updateCheckboxState(candidate);
        };


        function toPreview() {
            $scope.toTheEditor(true);
        }


        function editCandidate(candidate) {
            hideEditInput(candidate.localId);
            updateContactsInLocalStorage(candidate);
            notificationService.success($filter('translate')('Changes are saved'));
        }


        function hideEditInput(localId) {
            $scope.candidatesForMailing.some(function (candidate) {
                if(candidate.candidateId.localId == localId) {
                    candidate.editable = false;
                    return true
                }
            });
        }


        function updateContactsInLocalStorage(candidate) {
            $scope.candidatesForMailing.some(function (obj) {
                if(obj.candidateId.localId == candidate.localId) {
                    obj.candidateId.fullName = candidate.fullName;
                    obj.candidateId.contacts = candidate.contacts;
                    if(obj.wrongEmail)
                        delete obj.wrongEmail;
                    return true
                }
                return false
            });
            $localStorage.set('candidatesForMailing', $scope.candidatesForMailing);
        }


        function updateCheckboxState(candidate) {
            $scope.candidatesForMailing.some(function (obj) {
                if(obj.candidateId.localId == candidate.localId) {
                    obj.mailing = !obj.mailing;
                    return true
                }
                return false
            });
            $localStorage.set('candidatesForMailing', $scope.candidatesForMailing);
        }

        $('#step_1').unbind();
        $('#step_2').unbind().on('click',() => {
            $scope.toTheEditor();
        });
        if(olderAvailableStep == 3) {
            $('#step_3').addClass('clickable').unbind().on('click', () => {
                toPreview();
            });
        }

        //Get custom stages for vacancyAutocompleter
        if(!$rootScope.customStages) {
            vacancyStages.get(function(resp){
                $rootScope.customStages = resp.object.interviewStates;
            });
        }

        $scope.closeModal = function() {
            $scope.modalInstance.close();
        };

        $scope.openMailingInfoModal = function() {
            if($rootScope.me.personParams.mailingNews === "true") {
                $scope.mailingModal();
            }
        };

        $scope.mailingModal = function() {
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/mailingServiceInfo.html',
                size: '',
                scope: $scope,
                backdrop: 'static',
                resolve: function(){}
            });

            $scope.modalInstance.result.then(function () {
                if($rootScope.me.personParams.mailingNews === "true") {
                    Person.changeUserParam({
                        userId: $rootScope.me.userId,
                        name: 'mailingNews',
                        value: false
                    });
                }
            });
        };

        $scope.openMailingInfoModal();

    }
});