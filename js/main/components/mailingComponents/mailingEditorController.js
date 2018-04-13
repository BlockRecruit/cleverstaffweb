controller.controller('mailingEditorController', ['$scope', '$rootScope','$localStorage', '$timeout', 'notificationService','$filter', '$uibModal', 'Mailing', ]);
component.component('editor', {
    templateUrl: "partials/mailing/mailing-editor.html",
    controller: function ($scope, $rootScope, $localStorage, $timeout, notificationService, $filter, $uibModal, Mailing) {
        $scope.emailText = '';
        $scope.senderEmail = {};
        let emailDetails = Mailing.getMailingDetails();

        Mailing.getUserEmailsWithMailingEnabled().then((mailBoxes) => {
            $timeout(()=>{
                $scope.senderEmail.mailBoxes = mailBoxes;
                if(emailDetails && emailDetails.fromMail) {
                    $scope.senderEmail.selectedMailBox = emailDetails.fromMail;
                } else {
                    if($scope.senderEmail.mailBoxes && $scope.senderEmail.mailBoxes.length > 0) {
                        $scope.senderEmail.selectedMailBox = $scope.senderEmail.mailBoxes[0]
                    }
                }
            },0);
            console.log('availableEmails',$scope.senderEmail.mailBoxes)
        }, (error) => {
            console.log('Error in getUserEmailsWithMailingEnabled: ',error);
            notificationService.error($filter('translate')('service temporarily unvailable'));
        });


        if(emailDetails && emailDetails.text) {
            $scope.emailText = emailDetails.text;
            $scope.topic = emailDetails.name;
            $scope.fromName = emailDetails.fromName;
        } else {
            $scope.fromName = $rootScope.me.fullName;
        }


        $scope.saveMailing = function () {
            changeStep('save');
        };


        $scope.editSenderName = function () {
            $scope.editFromName = true;
            $scope.fromNameEdit = $scope.fromName;
        };


        $scope.cancelEdit = function () {
            $scope.editFromName = false;
        };


        $scope.saveFromName = function () {
            if($scope.fromNameEdit != $scope.fromName) {
                if($scope.fromNameEdit.length > 0 ) {
                    $scope.fromName = $scope.fromNameEdit;
                    $scope.editFromName = false;
                } else {
                    notificationService.error($filter('translate')('enter_first_name'));
                }
            } else {
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
                    Mailing.editorChangeStep($scope.emailText, $scope.topic, $scope.fromName, $scope.senderEmail.selectedMailBox, step).then(results => {
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
        }


        Mailing.makeStepClickable(3);
        $('#step_3').unbind().on('click', $scope.toPreview);
        $('#step_2').unbind();
        $('#go-back-button').unbind().on('click', $scope.toDetails);
        $('#step_1').unbind().on('click', $scope.toDetails);


    }
});