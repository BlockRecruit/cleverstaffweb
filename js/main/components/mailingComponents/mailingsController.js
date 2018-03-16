controller.controller('mailingsController', ['$scope', '$localStorage', '$rootScope', '$state','$timeout', '$filter', '$transitions', '$uibModal', 'Mailing',
    function ($scope, $localStorage, $rootScope, $state, $timeout, $filter, $transitions, $uibModal, Mailing) {


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

        function openMailingInfoModal() {
            //if(param) {}
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/mailingServiceInfo.html',
                size: '',
                scope: $scope,
                resolve: function(){

                }
            });
        }

        openMailingInfoModal();
}]);