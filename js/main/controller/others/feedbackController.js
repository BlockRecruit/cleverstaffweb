controller.controller('FeedbackController',["$localStorage", "serverAddress", "$rootScope", "$scope", "Person", "notificationService", "$location", "$filter",
    function($localStorage, serverAddress, $rootScope, $scope, Person, notificationService, $location, $filter) {
        $scope.pageUserWhriteFeedback = $location.$$absUrl;
        $localStorage.get('previousHistoryFeedback');
        $scope.previousPage = $localStorage.get('previousHistoryFeedback');
        $scope.oneAtATime = true;
        $scope.hideFeedbackButton = function(){
            Person.changeUserParam({
                name: 'sendDesignFeedback',
                value: 'Y'
            },function(resp){
                if(resp.status == 'ok'){
                    Person.getMe(function(response){
                        $rootScope.me = response.object;
                    });
                }else{
                    notificationService.error(resp.message);
                }
            })
        };
        $scope.regex = "";

        $('textarea').keyup(function() {
            var first = $(this).val().length;
            if(first > 0){
                $('.textarea').removeClass('notWriteError');
            }
        });
        $scope.goFeedbackThanks = function(){
            if($scope.regex.length === 0){
                $('.textarea').addClass('notWriteError');
                $('.enterYourRequest').attr('placeholder', $filter('translate')('Please enter your request'));
                $('.describeIssue').attr('placeholder', $filter('translate')('Please describe the issue'));
                $('.enterYourProposal').attr('placeholder', $filter('translate')('Please enter your proposal'));
            }else{
                $('.textarea').removeClass('notWriteError');
                $location.path('/feedback/thanks');
            }
        };

        $('input.input_checkbox').on('change', function() {
            $('input.input_checkbox').not(this).prop('checked', false);
        });
    }]);
