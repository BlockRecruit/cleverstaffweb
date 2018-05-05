controller.controller('addEmailForTemplateController', ["$state", "$scope", "$translate", "$stateParams", "$rootScope",
    "notificationService", "$filter","Person", "Candidate", "googleService","$uibModal",
    function ($state, $scope,$translate, $stateParams, $rootScope, notificationService, $filter, Person, Candidate, googleService, $uibModal) {
        $rootScope.showAdvancedFields = false;
        $scope.loading = true;
        $scope.showPassword = false;
        $rootScope.showPassInModal = true;
        $rootScope.editEmail = false;
        $scope.wrongEmail = false;
        $scope.checkFields = false;
        $scope.isExchange = false;
        $rootScope.addedEmail ={
            host: "email",
            email: "",
            name: $rootScope.me.fullName,
            password: "",
            smtp: {}
        };
        $rootScope.editedEmail ={
            host: "email",
            email: "",
            name: $rootScope.me.fullName,
            password: "",
            smtp: {}
        };
        $scope.updateCreatedEmails = function(){
            $rootScope.loading = true;
            Person.personEmails({type: 'all'},function(resp){
                $rootScope.loading = false;
                if(resp.status == 'ok'){
                    if(resp.objects.length > 0){
                        $scope.emails = resp.objects;
                        $scope.showAddEmail = false;
                    }else{
                        $scope.emails = [];
                        $scope.showAddEmail = true;
                    }
                }else{
                    notificationService.error(resp.message);
                }
                $rootScope.loading = false;
            }, function (error) {
                $rootScope.loading = false;
            });
        };
        $scope.updateCreatedEmails();
        $rootScope.addEmail = function(){
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,15})+$/.test($rootScope.addedEmail.email)) {
                    $scope.wrongEmail = false;
                    if($rootScope.addedEmail.email.length > 0){
                        var emailDomen = $rootScope.addedEmail.email.substr($rootScope.addedEmail.email.indexOf("@") + 1);
                        if(!$rootScope.showAdvancedFields || !$scope.showPassword){
                            if(emailDomen == 'mail.ru' || emailDomen == 'yandex.ru'){
                                Candidate.checkMailbox({email: $rootScope.addedEmail.email}, function(resp){
                                    if(resp.status == 'ok'){
                                        if(resp.message != undefined) {
                                            $rootScope.addedEmail.smtp.host = $scope.parseParam(resp.message).host;
                                            $rootScope.addedEmail.smtp.port = $scope.parseParam(resp.message).port;
                                            $rootScope.addedEmail.smtp.secure = $scope.parseParam(resp.message).secure;
                                        }
                                        if(emailDomen == 'mail.ru'){
                                            $rootScope.addedEmail.smtp.type = 'mailru';
                                        }else if(emailDomen == 'yandex.ru'){
                                            $rootScope.addedEmail.smtp.type = 'yandex';
                                        }
                                        $scope.showPassword = true;
                                        if($rootScope.addedEmail.password.length > 1){
                                            $rootScope.loading = true;
                                            Candidate.addEmailAccess($rootScope.addedEmail, function(resp){
                                                $rootScope.loading = false;
                                                if(resp.status == 'error'){

                                                    notificationService.error(resp.message);
                                                }else{
                                                    $scope.updateCreatedEmails();
                                                    $rootScope.updateMe();
                                                }
                                            }, function (error) {
                                                $rootScope.loading = false;
                                            });
                                        }
                                    }
                                });
                            }else if(emailDomen == 'gmail.com'){
                                googleService.gmailAuth("modify",function(result) {
                                    $rootScope.addedEmail.email = result.email;
                                    $rootScope.addedEmail.password = result.code;
                                    $rootScope.addedEmail.host = 'gmail';
                                    $rootScope.loading = true;
                                    Candidate.addEmailAccess($rootScope.addedEmail, function(resp){
                                        $rootScope.loading = false;
                                        if(resp.status == 'error'){
                                            if(resp.code == 'сouldNotGetRefreshTokenIntegration') {
                                                $scope.modalInstance = $uibModal.open({
                                                    animation: true,
                                                    templateUrl: '../partials/modal/gmail-access.html',
                                                    scope: $scope,
                                                    resolve: {
                                                    }
                                                });
                                            } else
                                            notificationService.error(resp.message);
                                        }else{
                                            $scope.updateCreatedEmails();
                                            $rootScope.updateMe();
                                        }
                                    }, function (error) {
                                        $rootScope.loading = false;
                                    });
                                });
                            }else{
                                if(!$scope.isExchange) {
                                    Candidate.checkMailbox({email: $rootScope.addedEmail.email}, function(resp){
                                        if(resp.status == 'ok'){
                                            $rootScope.itsGmail = resp.code;
                                            if(resp.code == 'gmail'){
                                                googleService.gmailAuth("modify",function(result) {
                                                    $rootScope.addedEmail.email = result.email;
                                                    $rootScope.addedEmail.password = result.code;
                                                    $rootScope.addedEmail.host = 'gmail';
                                                    $rootScope.loading = true;
                                                    Candidate.addEmailAccess($rootScope.addedEmail, function(resp){
                                                        $rootScope.loading = false;
                                                        if(resp.status == 'error'){
                                                            if(resp.code == 'сouldNotGetRefreshTokenIntegration') {
                                                                $scope.modalInstance = $uibModal.open({
                                                                    animation: true,
                                                                    templateUrl: '../partials/modal/gmail-access.html',
                                                                    scope: $scope,
                                                                    resolve: {
                                                                    }
                                                                });
                                                            } else
                                                                notificationService.error(resp.message);
                                                        }else{
                                                            $scope.updateCreatedEmails();
                                                            $rootScope.updateMe();
                                                        }
                                                    }, function (error) {
                                                        $rootScope.loading = false;
                                                    });
                                                });
                                            }else{
                                                if(resp.message != undefined) {
                                                    $rootScope.addedEmail.smtp.host = $scope.parseParam(resp.message).host;
                                                    $rootScope.addedEmail.smtp.port = $scope.parseParam(resp.message).port;
                                                    $rootScope.addedEmail.smtp.secure = $scope.parseParam(resp.message).secure;
                                                }
                                                $scope.showPassword = true;
                                                $rootScope.showAdvancedFields = true;
                                            }
                                        }
                                    });
                                } else {
                                    Candidate.checkMailbox({email: $rootScope.addedEmail.email}, (resp) => {
                                        console.log('rest', resp)
                                    }, (error) => {

                                    });
                                    $rootScope.addedEmail.host = 'exchange';
                                    $scope.showPassword = true;
                                    $rootScope.showAdvancedFields = true;
                                }
                            }
                        }else{
                            if(($rootScope.addedEmail.smtp.host != undefined && $rootScope.addedEmail.smtp.port != undefined && $rootScope.addedEmail.password != undefined)||$scope.isExchange) {
                                $rootScope.loading = true;
                                Candidate.addEmailAccess($rootScope.addedEmail, function(resp){
                                    $rootScope.loading = false;
                                    if(resp.status == 'error'){
                                        notificationService.error(resp.message);
                                    }else{
                                        $scope.updateCreatedEmails();
                                        $rootScope.updateMe();
                                    }
                                }, function (error) {
                                    $rootScope.loading = false;
                                });
                            }
                        }
                    }
                }else {
                    $scope.wrongEmail = true;
                }
        };

        $scope.editMailBox = function(email){
            if(email !== undefined && email.parseEmailDataId) {
                $state.go("email-integration-edit", {id: email.parseEmailDataId});
            } else {
                notificationService.error('Empty parseEmailDataId');
            }
        };

        $scope.setDefault = function(){
            $scope.isExchange = false;
            $rootScope.addedEmail ={
                host: "email",
                email: "",
                name: $rootScope.me.fullName,
                password: "",
                smtp: {}
            };
            $scope.showAdvancedFields = false;
            $rootScope.showAdvancedFields = false;
            $scope.showPassword = false;
        };
        $scope.hideAddEmail = function() {
            $scope.showAddEmail = false;
        };
        $scope.showRemoveEmail = function(emailForDelete){
            $rootScope.emailForDelete = emailForDelete;
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/email-integration-remove.html',
                size: '',
                resolve: function(){

                }
            });
        };
        $scope.parseParam = function (params) {
            return {
                host: params.substr((params.indexOf("host") + 5), (params.indexOf(", smtp_port") - params.indexOf("host") - 5)),
                port: + params.substr((params.indexOf("port") + 5), (params.indexOf(", smtp_secure") - params.indexOf("port") - 5)),
                secure: params.substr((params.indexOf("secure") + 7), (params.indexOf("}") - params.indexOf("secure") - 7))
            }
        };
        $rootScope.removePersonEmail = function(){
            $rootScope.loading = true;
            Person.removePersonEmail({email : $rootScope.emailForDelete.email},function(resp){
                $rootScope.loading = false;
                if(resp.status == 'ok'){
                    $scope.updateCreatedEmails();
                    $rootScope.updateMe();
                    $scope.setDefault();
                    $('.removeEmail').modal('hide');
                }else{
                    notificationService.error(resp.message);
                }
            }, function (error) {
                $rootScope.loading = false;
            });
            $scope.closeModal();
        };
        $rootScope.closeModal = function(){
            $scope.modalInstance.close();
        };


        $scope.goBack = function () {
          if($scope.emails && $scope.emails.length === 0) {
              $scope.showPassword = false;
              $rootScope.showAdvancedFields = false;
          } else {
              $scope.showAddEmail = false;
          }
        };
    }]);


