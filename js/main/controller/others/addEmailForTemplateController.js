controller.controller('addEmailForTemplateController', ["$scope", "$translate", "$routeParams", "$rootScope",
    "notificationService", "$filter","Person", "Candidate", "googleService","$uibModal",
    function ($scope,$translate, $routeParams, $rootScope, notificationService, $filter, Person, Candidate, googleService, $uibModal) {
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
            Person.personEmails({type: 'all'},function(resp){
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
                $scope.loading = false;
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
                                            Candidate.addEmailAccess($rootScope.addedEmail, function(resp){
                                                if(resp.status == 'error'){

                                                    notificationService.error(resp.message);
                                                }else{
                                                    $scope.updateCreatedEmails();
                                                    $rootScope.updateMe();
                                                }
                                            });
                                        }
                                    }
                                });
                            }else if(emailDomen == 'gmail.com'){
                                googleService.gmailAuth("modify",function(result) {
                                    $rootScope.addedEmail.email = result.email;
                                    $rootScope.addedEmail.password = result.code;
                                    $rootScope.addedEmail.host = 'gmail';
                                    Candidate.addEmailAccess($rootScope.addedEmail, function(resp){
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
                                                    Candidate.addEmailAccess($rootScope.addedEmail, function(resp){
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
                                Candidate.addEmailAccess($rootScope.addedEmail, function(resp){
                                    if(resp.status == 'error'){
                                        notificationService.error(resp.message);
                                    }else{
                                        $scope.updateCreatedEmails();
                                        $rootScope.updateMe();
                                    }
                                });
                            }
                        }
                    }
                }else {
                    $scope.wrongEmail = true;
                }
        };
        $rootScope.editEmailFuc = function(){
            $scope.isExchange = false;
            var emailDomen = $rootScope.editedEmail.email.substr($rootScope.editedEmail.email.indexOf("@") + 1);
            if(!$rootScope.showAdvancedFields){
                if(emailDomen == 'mail.ru' || emailDomen == 'yandex.ru' || $rootScope.editedEmail.host == 'exchange'){
                    if($rootScope.editedEmail.email.length > 0 && $rootScope.editedEmail.password.length > 0){
                        if(emailDomen == 'mail.ru'){
                            $rootScope.editedEmail.smtp.type = 'mailru';
                        }else if(emailDomen == 'yandex.ru'){
                            $rootScope.editedEmail.smtp.type = 'yandex';
                        }
                        Candidate.editEmailAccess($rootScope.editedEmail, function(resp){
                            if(resp.status == 'error'){
                                notificationService.error(resp.message);
                            }else{
                                $scope.updateCreatedEmails();
                                $rootScope.closeModal();
                            }
                        });
                    }else{
                        notificationService.error($filter('translate')('Please enter your password'));
                    }
                }else if(emailDomen == 'gmail.com' || emailDomen == 'gmail' || $rootScope.itsGmail == 'gmail' || $rootScope.itsGmailModal == 'gmail'){
                    googleService.gmailAuth("modify",function(result) {
                        $rootScope.editedEmail.password = result.code;
                        $rootScope.addedEmail.email = result.email;
                        $rootScope.editedEmail.host = 'gmail';
                        Candidate.editEmailAccess($rootScope.editedEmail, function(resp){
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
                                $rootScope.closeModal();
                            }
                        });
                    });
                }else{
                    $rootScope.showAdvancedFields = true;
                }
            } else {
                if($rootScope.editedEmail.host = 'email'){
                    if($rootScope.editedEmail.email.length > 0 && $rootScope.editedEmail.password.length > 0) {
                        Candidate.editEmailAccess($rootScope.editedEmail, function (resp) {
                            if (resp.status == 'error') {
                                if(resp.message == 'сouldNotGetRefreshTokenIntegration') {
                                    $scope.modalInstance = $uibModal.open({
                                        animation: true,
                                        templateUrl: '../partials/modal/gmail-access.html',
                                        scope: $scope,
                                        resolve: {
                                        }
                                    });
                                } else
                                notificationService.error(resp.message);
                            } else {
                                $scope.updateCreatedEmails();
                                $scope.editEmail = false;
                                $rootScope.closeModal();
                            }
                        });
                    }else {
                        notificationService.error($filter('translate')('Please enter your password'));
                    }
                }
            }
        };
        $scope.showEditeTemplateModal = function(email){
            $scope.status = email.status;
            $rootScope.itsGmailModal = email.sendStatus;
            $rootScope.showAdvancedFields = false;
            $rootScope.editedEmail.host = 'email';
            $rootScope.editedEmail.email = email.email;
            $rootScope.editedEmail.permitConversation = email.permitConversation;
            $rootScope.editedEmail.host = 'gmail';
            $rootScope.editedEmail.permitParsing = email.permitParsing;
            $rootScope.editedEmail.permitSend = email.permitSend;
            var emailDomen = $rootScope.editedEmail.email.substr($rootScope.editedEmail.email.indexOf("@") + 1);
            if(emailDomen == 'mail.ru' || emailDomen == 'yandex.ru'){
                if(emailDomen == 'mail.ru'){
                    $rootScope.editedEmail.smtp.type = 'mailru';
                }else if(emailDomen == 'yandex.ru'){
                    $rootScope.editedEmail.smtp.type = 'yandex';
                }
                $rootScope.showPassInModal = true;
            }else if(emailDomen == 'gmail.com' || emailDomen == 'gmail' || email.sendStatus == 'gmail'){
                $rootScope.showPassInModal = false;
            }else if($scope.status != 'exchange'){
                $rootScope.showPassInModal = true;
                $rootScope.showAdvancedFields = true;
                $rootScope.editedEmail.smtp.host = email.smtpHost;
                $rootScope.editedEmail.smtp.secure = email.smtpSecure;
                $rootScope.editedEmail.smtp.port = email.smtpPort;
            } else {
                $rootScope.editedEmail.domainSlashUsername = email.exchangeDomain + '/' + email.exchangeUsername;
                $rootScope.editedEmail.exchangeHost = email.exchangeHost;
                $rootScope.editedEmail.exchangeVersion = email.exchangeVersion;
                $rootScope.editedEmail.host = 'exchange';
                $rootScope.showPassInModal = true;
                $rootScope.showAdvancedFields = false;
            }
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/edit-integration-with-email.html',
                size: '',
                scope: $scope,
                resolve: function(){

                }
            });
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
            Person.removePersonEmail({email : $rootScope.emailForDelete.email},function(resp){
                if(resp.status == 'ok'){
                    $scope.updateCreatedEmails();
                    $rootScope.updateMe();
                    $scope.setDefault();
                    $('.removeEmail').modal('hide');
                }else{
                    notificationService.error(resp.message);
                }
            });
            $scope.closeModal();
        };
        $rootScope.closeModal = function(){
            $scope.modalInstance.close();
        };
    }]);


