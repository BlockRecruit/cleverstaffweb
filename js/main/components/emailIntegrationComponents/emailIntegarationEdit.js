component.component("emailTemplateEditComponent", {

   templateUrl: "partials/emailIntegration/emailIntegrationEdit.html",

   controller: function ($state, $stateParams, $rootScope, notificationService, $filter, Person) {
       let vm = this;
       let mailBoxId = "";
       let emails = [];
       vm.editableMailbox = {};

       if($stateParams !== undefined && $stateParams.id) {
           mailBoxId = $stateParams.id;
           Person.getMailboxes().then( result => {
               emails = result;
               vm.editableMailbox = getEditableMailbox(emails, mailBoxId);
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
   },

   controllerAs: '$ctrl'

});