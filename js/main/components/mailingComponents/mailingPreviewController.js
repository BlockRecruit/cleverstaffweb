controller.controller('mailingPreviewController', ['$scope', '$rootScope', 'notificationService', '$localStorage', '$filter', '$uibModal','$state', '$location', 'Mailing', 'Account', 'Person']);
component.component('preview', {
    templateUrl: "partials/mailing/mailing-preview.html",
    controller: function ($scope, $rootScope, notificationService, $localStorage, $filter, $uibModal, $state, $location, Mailing, Account, Person) {
        $scope.candidatesForMailing = $localStorage.get('candidatesForMailing')?JSON.parse($localStorage.get('candidatesForMailing')):[];
        $scope.mailingParams = {};
        $scope.mailingParams = Mailing.getMailingDetails();
        $scope.sendMailingParams = {};
        $scope.testEmail = '';
        $scope.sendTestShow = false;

        $scope.mailingPreview = function () {
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/mailing-preview.html?1',
                size: '',
                scope: $scope
            });
        };


        $scope.showSendTest = function () {
            $scope.sendTestShow = !$scope.sendTestShow;
        };


        $scope.editMessage = function () {
            Mailing.setStep('mailing-editor');
        };


        $scope.editDetails = function () {
            Mailing.setStep("mailing-details");
        };


        $scope.sendMailing = function () {
            Promise.all([
                Mailing.getCompaignPrice({ compaignId: $scope.mailingParams.compaignId}),
                getAccountInfo(),
                getFreeMailCount(),
                ]).then(([compaignPrice, accountInfo, freeMailCount]) => {
                $scope.sendMailingParams = {
                        accountBalance: accountInfo.object.amount,
                        compaignPrice: compaignPrice.object,
                        freeMailCount: +(freeMailCount.object.orgParams.freeMailCount),
                        available: true
                    };

                    if($scope.sendMailingParams.compaignPrice > $scope.sendMailingParams.accountBalance) {
                        $scope.sendMailingParams.available = false;
                    }

                    openMailingModal();
                    $scope.$apply();
                }, error => notificationService.error(error));
        };


        $scope.confirmSendMailing = function () {
            if(!$scope.sendMailingParams.available) {
                notificationService.error($filter('translate')('You do not have enough money on your balance to make a mailing.'));
                return;
            }
            $scope.modalInstance.close();
            $rootScope.loading = true;
            Mailing.sendCampaign().then(
                result => {
                    $rootScope.loading = false;
                    Mailing.afterSending();
                },
                error => {
                    $rootScope.loading = false;
                    console.log('in error', error)
                }
            );
        };


        $scope.saveMailing = function () {
            Mailing.saveMailing().then(
                result => {
                    Mailing.afterSending();
                },
                error => {
                    console.log('saveMailing Error', error);
                }
            );
        };


        $scope.sendTestMail = function () {
            if(Mailing.emailValidation($scope.testEmail)) {
                $rootScope.loading = true;
                Mailing.sendTestMail($scope.testEmail).then(result => {
                    $rootScope.loading = false;
                    $scope.testEmail = '';
                }, error => {
                    $rootScope.loading = false;
                    console.log('error in $scope.sendTestMail', error)
                });
            } else {
                $('#test-mail').addClass('empty');
                notificationService.error($filter('translate')('wrong_email'));
            }
        };


        $scope.closeModal = function () {
            $scope.modalInstance.close();
        };

        function getAccountInfo() {
            return new Promise((resolve, reject) => {
               Account.getAccountInfo((resp) => {
                   if(resp.status !== 'error') {
                       resolve(resp);
                   } else {
                       reject(resp);
                   }
               }, error => console.error(error));
            });
        }

        function getFreeMailCount() {
            return new Promise((resolve, reject) => {
                Person.getMe(function(resp) {
                    if(resp.status === 'ok') {
                        resolve(resp);
                    } else {
                        reject(resp);
                    }
                });
            }, error => console.error(error));
        }

        function openMailingModal(){
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/confirm-send-mailing.html?3',
                size: '',
                scope: $scope,
                resolve: function(){

                }
            });

            $scope.modalInstance.result.catch(function () { $scope.modalInstance.close(); })
        }

        $('#step_2').unbind().on('click', $scope.editMessage);
        $('#step_1').unbind().on('click', $scope.editDetails);
        $('#go-back-button').unbind().on('click', $scope.editMessage);


    }
});