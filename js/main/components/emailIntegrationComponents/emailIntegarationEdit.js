component.component("emailTemplateEditComponent", {

   templateUrl: "partials/emailIntegration/emailIntegrationEdit.html",

   controller: function ($q, $state, $stateParams, $rootScope, notificationService, $filter, Person, Mailing, googleService, Candidate) {
       let vm = this;
       let mailBoxId = "";
       let emails = [];
       vm.editableMailbox = {};
       vm.dkimStatusRefreshing = false;
       vm.emailSettingsType = "";
       vm.dkimInfoReceived = false;
       vm.signatures = {dkim:{},spf:{}};
       vm.mailingPermitDenied = false;

       if($stateParams !== undefined && $stateParams.id) {
           mailBoxId = $stateParams.id;
           Person.getMailboxes().then( result => {
               emails = result;
               vm.editableMailbox = getEditableMailbox(emails, mailBoxId);
               vm.emailSettingsType = getMailboxSettingsType(vm.editableMailbox);
           });
       } else {
           $state.go("email-integration");
       }


       vm.copyDimProperties = function () {
           let textBlock = document.getElementById('dkim-settings');
           let chevron = document.getElementById('dkim-settings-chevron');
           let hasDownChevron = chevron.classList.contains("fa-chevron-down");
           let settingsText = document.getElementById("dkim-settings-text");
           settingsText.value = `
Record DKIM
${vm.signatures.dkim.name}
type: TXT
${vm.signatures.dkim.value}

Record SPF
${vm.signatures.spf.name}
type: TXT
${vm.signatures.spf.value}

Record DMARC
${vm.signatures.dmarc.name}
type: TXT
${vm.signatures.dmarc.value}`;
           chevron.classList.toggle("fa-chevron-down", !hasDownChevron);
           chevron.classList.toggle("fa-chevron-up", hasDownChevron);
           textBlock.classList.toggle("show");
           if(hasDownChevron) {
               settingsText.select();
               document.execCommand("Copy");
               notificationService.success($filter('translate')('Text copied'));
           }
       };


        vm.mailingOn = function () {
            if (vm.dkimInfoReceived || vm.editableMailbox.corpMail !== true || !vm.editableMailbox.permitMailing)
                return;
            $rootScope.loading = true;
            vm.checkDkimStatus();
        };


        vm.checkDkimStatus = function (withNotification) {
            vm.dkimStatusRefreshing = true;
            //Mailing.checkDkimSettings("info@csmailer.org").then(response => {
            Mailing.checkDkimSettings(vm.editableMailbox.email).then(response => {
                vm.signatures = getSignature(response.object, vm.editableMailbox.domain);
                vm.dkimStatusRefreshing = false;
                $rootScope.loading = false;
                vm.dkimInfoReceived = true;
                if(withNotification) {
                    notificationService.success($filter("translate")("Statuses are updated"));
                }
            }, error => {
                vm.dkimStatusRefreshing = false;
                $rootScope.loading = false;
                notificationService.error("Can not update statuses");
            });
        };


        vm.saveProperties = function () {
            getPropertiesForRequest(vm.editableMailbox,vm.emailSettingsType).then(properties => {
                if(properties.password && properties.password.trim().length > 0) {
                    if((properties.permitMailing && vm.editableMailbox.corpMail)) {
                        if(properties.domainVerified){
                            vm.mailingPermitDenied = false;
                            saveProperties(properties);
                        } else {
                            mailingPermitDenied();
                        }
                    } else {
                        saveProperties(properties);
                    }
                } else {
                    notificationService.error($filter('translate')('Please enter your password'));
                }
                console.log('editableMailbox',properties)
            });
        };


        function mailingPermitDenied() {
            vm.mailingPermitDenied = true;
        }


        function saveProperties(properties) {
            $rootScope.loading = true;
            Candidate.editEmailAccess(properties, function(resp){
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
                        } else {
                            notificationService.error(resp.message);
                        }
                }else{
                    notificationService.success($filter('translate')('Settings have been saved'));
                    $state.go("email-integration");
                }
            }, function (error) {
                $rootScope.loading = false;
                notificationService.error(error.status);
            });
        }


       function getEditableMailbox(emailsArray, id) {
           let mailboxWithSameId = {};
           let mailboxExist = emailsArray.some((oneMailbox) => {
               if(oneMailbox.parseEmailDataId === id) {
                   mailboxWithSameId = oneMailbox;
                   return true
               }
               return false
           });
           if(mailboxExist) {
               return mailboxWithSameId
           } else {
               notificationService.error("There is no mailBox with such id");
               $state.go("email-integration");
           }
       }


       function getMailboxSettingsType(mailBox) {
           if(mailBox.status == "gmail")
               return "gmail";
           if(mailBox.status == "exchange")
               return "exchange";
           if(mailBox.domain == "yandex.ru")
               return "yandex";
           if(mailBox.domain == "mail.ru")
               return "mailru";
           return "common_domain"
       }


       function getPropertiesForRequest(editableMailBox, settingsType) {
           let propObject = {
               email: editableMailBox.email,
               name: $rootScope.me.fullName,
               password: editableMailBox.password!==undefined?editableMailBox.password:"",
               host: "email",
               permitConversation: false,
               permitParsing: editableMailBox.permitParsing,
               permitSend: editableMailBox.permitSend,
               permitMailing: editableMailBox.permitMailing!==undefined?editableMailBox.permitMailing:false,
               smtp: {}
           };
           return new $q ((resolve, reject) => {
               if(editableMailBox.corpMail) {
                   if(vm.signatures.spf.status && vm.signatures.dkim.status)
                       propObject.domainVerified = true;
               }
               switch (settingsType) {
                   case "gmail":
                       getGmailToken().then(result => {
                           propObject.email = result.email;
                           propObject.password = result.password;
                           propObject.host = "gmail";
                           resolve(propObject);
                       }, error => {
                           console.log('Exception in getGmailToken()');
                           notificationService.error(error.status);
                       });
                       break;
                   case "mailru":
                       propObject.smtp.type = "mailru";
                       resolve(propObject);
                       break;
                   case "yandex":
                       propObject.smtp.type = "yandex";
                       resolve(propObject);
                       break;
                   case "exchange":
                       propObject.domainSlashUsername = editableMailBox.exchangeDomain + '/' + editableMailBox.exchangeUsername;
                       propObject.exchangeHost = editableMailBox.exchangeHost;
                       propObject.exchangeVersion = editableMailBox.exchangeVersion;
                       propObject.host = "exchange";
                       resolve(propObject);
                       break;
                   default:
                       propObject.smtp.host = editableMailBox.smtpHost;
                       propObject.smtp.secure = editableMailBox.smtpSecure;
                       propObject.smtp.port = editableMailBox.smtpPort;
                       resolve(propObject);
               }
           });
       }
       
       
       function getGmailToken() {
           return new $q((resolve, reject) => {
               googleService.gmailAuth("modify",function(result) {
                   console.log('gmailParams', result)
                   resolve({password: result.code, email: result.email})
               }, function (error) {
                   reject(error);
               });
           })
       }


       function getSignature(feedgeResp, domain) {
           return {
               dkim: {
                   name: `Host: feedgee._domainkey.${domain}`,
                   value: `value: ${feedgeResp.dkim}`,
                   status: feedgeResp.dkimStatus === "DkimInclude"?true:false
               },
               spf: {
                   name: `Host: @`,
                   value: `value: ${feedgeResp.spf}`,
                   status: feedgeResp.spfStatus === "spfInclude"?true:false
               },
               dmarc: {
                   name: `Host: ${domain}`,
                   value: `value: _dmarc.${domain} IN TXT "v=DMARC1; p=none; sp=none; rua=mailto:postmaster@${domain}" `
               }
           }
       }


   },

   controllerAs: '$ctrl'

});