controller.controller('mailingController', ['$scope', '$rootScope','$localStorage', 'notificationService','$filter', '$uibModal','$state', '$transitions', 'Mailing', function ($scope, $rootScope, $localStorage, notificationService, $filter, $uibModal, $state, $transitions, Mailing) {
    $scope.currentStep = Mailing.currentStep;

    let mailingDetails = Mailing.getMailingDetails();

    if(mailingDetails) {
        $scope.internalName = mailingDetails.internalName;
    } else {
        $scope.internalName = '';
    }

    switch ($scope.currentStep) {
        case 'mailing-details':
            $state.go('mailing-details');
            break;
        case 'mailing-editor':
            $state.go('mailing-editor');
            break;
        case 'mailing-preview':
            $state.go('mailing-preview');
            break;
        default:
            $state.go('mailing-details');
            break;
    }


    $scope.fieldFocused = function (event) {
        event.currentTarget.classList.remove('empty');
    };


    $scope.updateInternal = function () {
          Mailing.updateInternal($scope.internalName);
    };
    $scope.updateInternal();

    $rootScope.setDocCounter = function(){
        $scope.currentDocPreviewPage = 0;
    };


}]);