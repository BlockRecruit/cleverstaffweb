component.component("emailTemplateEditComponent", {

   templateUrl: "partials/emailIntegration/emailIntegrationEdit.html",

   controller: function ($q, $state, $stateParams, $rootScope, notificationService, $filter, Person, Mailing, googleService) {
       let vm = this;
       let mailBoxId = "";
       let emails = [];
       vm.editableMailbox = {};
       vm.dkimStatusRefreshing = false;
       vm.emailSettingsType = "";

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
           settingsText.value = "asdfasdf";
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
            console.log('vm',vm.editableMailbox)
        };


        vm.checkDkimStatus = function () {
            vm.dkimStatusRefreshing = true;
            Mailing.checkDkimSettings(vm.editableMailbox.email).then(response => {
                vm.dkimStatusRefreshing = false;
            }, error => {
                vm.dkimStatusRefreshing = false;
            });
        };


        vm.saveProperties = function () {
            let properties = getPropertiesForRequest(vm.editableMailbox,vm.emailSettingsType);
            console.log('editableMailbox',properties)
        };


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
           if(mailBox.domain == "yandex.ru" || mailBox.domain == "mail.ru")
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
            switch (settingsType) {
                case "gmail":
                    getGmailToken().then(result => {
                        propObject.email = result.email;
                        propObject.password = result.password;
                    }, error => {
                        console.log('Exception in getGmailToken()');
                        notificationService.error(error.status);
                    });
                    break;
                case "mailru":
                    propObject.smtp.type = "mailru";
                    break;
                case "yandex":
                    propObject.smtp.type = "yandex";
                    break;
                case "exchange":
                    propObject.domainSlashUsername = editableMailBox.exchangeDomain + '/' + editableMailBox.exchangeUsername;
                    propObject.exchangeHost = editableMailBox.exchangeHost;
                    propObject.exchangeVersion = editableMailBox.exchangeVersion;
                    propObject.host = "exchange";
                    break;
                default:
                    propObject.smtp.host = editableMailBox.smtpHost;
                    propObject.smtp.secure = editableMailBox.smtpSecure;
                    propObject.smtp.port = editableMailBox.smtpPort;
            }
            return propObject
       }
       
       
       function getGmailToken() {
           return new $q((resolve, reject) => {
               googleService.gmailAuth("modify",function(result) {
                   resolve({password: result.code, email: result.email})
               }, function (error) {
                   reject(error);
               });
           })
       }


   },

   controllerAs: '$ctrl'

});