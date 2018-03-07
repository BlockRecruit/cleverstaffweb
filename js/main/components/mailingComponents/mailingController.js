controller.controller('mailingController', ['$scope', '$rootScope', '$translate', '$localStorage', 'notificationService','$filter', '$uibModal','$state', '$transitions', 'Mailing', function ($scope, $rootScope, $translate, $localStorage, notificationService, $filter, $uibModal, $state, $transitions, Mailing) {
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


    let storedBreadcrumbs = $localStorage.get('breadcrumbs');
    let defaultBreadcrumbs = [
        {
            href: '#/candidates',
            transl: 'our_base'
        },
        {
            transl: 'My mailings'
        }
    ];
    let breadCrumbs = storedBreadcrumbs?JSON.parse(storedBreadcrumbs):defaultBreadcrumbs;
    breadCrumbs.pop();
    breadCrumbs.push({
        href: '#/mailings',
        transl: 'My mailings'
    },{
        value: $scope.internalName?$scope.internalName:$translate.instant('New mailing')
    });
    $rootScope.breadCrumbs = breadCrumbs;


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