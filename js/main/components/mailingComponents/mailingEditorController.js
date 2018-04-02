controller.controller('mailingEditorController', ['$scope', '$rootScope','$localStorage', 'notificationService','$filter', '$uibModal', 'Mailing', ]);
component.component('editor', {
    templateUrl: "partials/mailing/mailing-editor.html",
    controller: function ($scope, $rootScope, $localStorage, notificationService, $filter, $uibModal, Mailing) {
        $scope.emailText = '';
        let emailDetails = Mailing.getMailingDetails();
        if(emailDetails && emailDetails.text) {
            $scope.emailText = emailDetails.text;
            $scope.topic = emailDetails.name;
            $scope.fromName = emailDetails.fromName;
            $scope.fromMail = emailDetails.fromMail;
        } else {
            $scope.fromName = $rootScope.me.fullName;
            $scope.fromMail = $rootScope.me.login;
        }

        $scope.saveMailing = function () {
            changeStep('save');
        };


        $scope.editFromEmail = function () {
            $scope.editFromName = true;
            $scope.fromMailEdit = $scope.fromMail;
            $scope.fromNameEdit = $scope.fromName;
        };


        $scope.cancelEdit = function () {
            $scope.editFromName = false;
        };


        $scope.saveFromEmail = function () {
            if($scope.fromMailEdit != $scope.fromMail || $scope.fromNameEdit != $scope.fromName) {
                if($scope.fromNameEdit.length > 0 ) {
                    if (Mailing.emailValidation($scope.fromMailEdit)) {
                        $scope.fromMail = $scope.fromMailEdit;
                        $scope.fromName = $scope.fromNameEdit;
                        $scope.editFromName = false;
                    } else {
                        notificationService.error($filter('translate')('wrong_email'));
                    }
                } else {
                    notificationService.error($filter('translate')('enter_first_name'));
                }
            } else {
                $scope.fromMail = $scope.fromMailEdit;
                $scope.fromName = $scope.fromNameEdit;
                $scope.editFromName = false;
            }
        };


        $scope.toDetails = function () {
            changeStep('details')
        };


        $scope.toPreview = function () {
            changeStep('preview')
        };


        function changeStep(step) {
            let notValid = false;
            if(step != 'details') {
                $('.required').each(function () {
                    let element = $(this);
                    element.removeClass('empty');
                    if(element[0].value.length == 0) {
                        element.addClass('empty');
                        notValid = true;
                    }
                });
            }

            if(notValid) {
                $('html, body').animate({scrollTop: 0}, 500, 'easeOutQuart');
                notificationService.error($filter('translate')('You should fill all obligatory fields.'))
            } else {
                $rootScope.loader = true;
                if(step === "details" || $scope.emailText) {
                    Mailing.editorChangeStep($scope.emailText, $scope.topic, $scope.fromName, $scope.fromMail, step).then(results => {
                        $rootScope.loader = false;
                        if(step == 'save') {
                            Mailing.afterSending();
                        }
                    }, error => {
                        $rootScope.loader = false;
                        console.log('error in $scope.toDetails', error)
                    });
                } else {
                    notificationService.error($filter('translate')('Enter the text of the letter'))
                }
            }
        };


        Mailing.makeStepClickable(3);
        $('#step_3').unbind().on('click', $scope.toPreview);
        $('#step_2').unbind();
        $('#go-back-button').unbind().on('click', $scope.toDetails);
        $('#step_1').unbind().on('click', $scope.toDetails);


    }
})