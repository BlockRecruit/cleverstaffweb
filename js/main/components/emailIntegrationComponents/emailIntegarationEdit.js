component.component("emailTemplateEditComponent", {

   templateUrl: "partials/emailIntegration/emailIntegrationEdit.html",

   controller: function ($state, $stateParams, $rootScope, notificationService, Person) {
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
               notificationService.error("There is no mailBox with such id")
           }
       }
   },

   controllerAs: '$ctrl'

});