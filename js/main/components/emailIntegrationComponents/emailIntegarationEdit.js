component.component("emailTemplateEditComponent", {

   templateUrl: "partials/emailIntegration/emailIntegrationEdit.html",

   controller: function ($state, $stateParams, $rootScope, notificationService, $filter, Person, Mailing) {
       let vm = this;
       let mailBoxId = "";
       let emails = [];
       vm.editableMailbox = {};
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
          Mailing.checkDkimSettings(vm.editableMailbox.email).then(response => {
             console.log('response', response)
          }, error => {});
        };


        vm.saveProperties = function () {

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
   },

   controllerAs: '$ctrl'

});