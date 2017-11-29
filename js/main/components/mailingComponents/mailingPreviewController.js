controller.controller('mailingPreviewController', ['$scope', '$rootScope', 'notificationService', '$localStorage', '$filter', '$uibModal','$state', '$location', 'Mailing']);
component.component('preview', {
    templateUrl: "partials/mailing/mailing-preview.html",
    controller: function ($scope, $rootScope, notificationService, $localStorage, $filter, $uibModal, $state, $location, Mailing) {
        $scope.candidatesForMailing = $localStorage.get('candidatesForMailing')?JSON.parse($localStorage.get('candidatesForMailing')):[];
        $scope.mailingParams = {};
        $scope.mailingParams = Mailing.getMailingDetails();
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
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/confirm-send-mailing.html?1',
                size: '',
                scope: $scope,
                resolve: function(){

                }
            });
        };


        $scope.confirmSendMailing = function () {
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


        $('#step_2').unbind().on('click', $scope.editMessage);
        $('#step_1').unbind().on('click', $scope.editDetails);
        $('#go-back-button').unbind().on('click', $scope.editMessage);


    }
});