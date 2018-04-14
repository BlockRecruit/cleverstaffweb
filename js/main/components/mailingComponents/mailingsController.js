component.component('mailings', {
   templateUrl: "partials/mailing/mailings.html",
    controller: function ($scope, $localStorage, $rootScope, $state, $timeout, $filter, $transitions, $uibModal, Mailing, Person) {
        $scope.savedMailings = [];
        let isPreviousSentMailings = $rootScope.previousLocation?$rootScope.previousLocation.indexOf('mailing-sent')!=-1:false;
        let defaultBreadcrumbs = [
            {
                href: '#/candidates',
                transl: 'our_base'
            },
            {
                transl: 'My mailings'
            }
        ];
        if($rootScope.previousLocation) {
            if($rootScope.previousLocation.indexOf('vacancies') != -1) {
                if($rootScope.vacancy) {
                    $localStorage.set('breadcrumbs', JSON.stringify([
                        {
                            href: '#/vacancies',
                            transl: 'vacancies'
                        },
                        {
                            href: '#/vacancies/' + $rootScope.vacancy.localId,
                            value: $rootScope.vacancy.position
                        },
                        {
                            transl: 'My mailings'
                        }
                    ]));
                } else {
                    $localStorage.set('breadcrumbs', JSON.stringify(defaultBreadcrumbs));
                }
            } else {
                $localStorage.set('breadcrumbs', JSON.stringify(defaultBreadcrumbs));
            }
        }

        let storedBreadcrumbs = $localStorage.get('breadcrumbs');
        $rootScope.breadCrumbs = storedBreadcrumbs?JSON.parse(storedBreadcrumbs):defaultBreadcrumbs;

        if(isPreviousSentMailings) {
            $state.go('mailings-sent');
        } else {
            $state.go('mailings-saved');
        }


        $scope.newMailing = function () {
            Mailing.newMailing();
        };

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

        $scope.mailingTariffInfoModal = function() {
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/mailing-tariff-info.html',
                size: '',
                scope: $scope,
                backdrop: 'static',
                resolve: function(){}
            });
        };

        function getFreeMailCount() {
            return new Promise((resolve, reject) => {
                Person.getMe(resp => {
                    if(resp.status === 'ok') {
                        resolve(resp);
                    } else {
                        reject(resp);
                    }
                }, error => console.error(error));
            });
        }

        function getInitialData() {
            getFreeMailCount()
                .then(resp => {
                    console.log(resp);
                    $rootScope.me = resp.object;
                    $scope.openMailingInfoModal();
                }, error => console.error(error));
        }

        getInitialData();
    }
});