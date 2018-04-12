 angular.module('services.person', [
    'ngResource'
 ]).factory('Person', ['$resource', 'serverAddress','$rootScope', function($resource, serverAddress, $rootScope) {
     var person = $resource(serverAddress + '/person/:param', {param: "@param"},
            {
                authorization: {
                    method: 'POST',
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                    params: {
                        param: "auth"
                    }
                },
                in: {
                    method: "GET",
                    params: {
                        param: "in"
                    }
                },
                changeUserParam:{
                  method:"GET",
                    params:{
                        param:"changeUserParam"
                    }
                },
                registration: {
                    method: "POST",
                    params: {
                        param: "registration"
                    }
                },
                joinInvited: {
                    method: "POST",
                    params: {
                        param: "joinInvited"
                    }
                },
                inviteUser: {
                    method: "GET",
                    params: {
                        param: "inviteUser"
                    }
                },
                finishReg: {
                    method: "GET",
                    params: {
                        param: "finishReg"
                    }
                },
                logout: {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                    params: {
                        param: "logout"
                    }
                },
                getMe: {
                    withCredentials: true,
                    method: 'GET',
                    params: {
                        param: "getMe"
                    }
                },
                changeOrg: {
                    method: "GET",
                    params: {
                        param: "changeOrg"
                    }
                },
                getAllPersons: {
                    method: "GET",
                    params: {
                        param: "getAllPersons"
                    }
                },
                getAllPersonsWithDetails: {
                    method: "GET",
                    params: {
                        param: "getAllPersonsWithDetails"
                    }
                },
                getPerson: {
                    method: "GET",
                    params: {
                        param: "getPerson"
                    }
                },
                getInvited: {
                    method: "GET",
                    params: {
                        param: "getInvited"
                    },
                    isArray: true
                },
                inviteInfo: {
                    method: "GET",
                    params: {
                        param: "inviteInfo"
                    }
                },
                changeUserRole: {
                    method: "GET",
                    params: {
                        param: "changeUserRole"
                    }

                },
                changeUserRegion: {
                    method: "GET",
                    params: {
                        param: "changeUserRegion"
                    }
                },
                setSocial: {
                    method: "GET",
                    params: {
                        param: "setSocial"
                    }
                },
                personEmails:{
                    method:"GET",
                    params:{
                        param:"personEmails"
                    }
                },

                addEmail:{
                    method:"POST",
                    params:{
                        param:"addEmail"
                    }
                },

                deleteEmail:{
                    method:"GET",
                    params:{
                        param:"deleteEmail"
                    }
                },




                resetSocial: {
                    method: "GET",
                    params: {
                        param: "resetSocial"
                    }
                },
                setLang: {
                    method: "GET",
                    params: {
                        param: "setLang"
                    }
                },
                changePassword: {
                    method: "POST",
                    params: {
                        param: "changePassword"
                    }
                },
                changePasswordByKey: {
                    method: "POST",
                    params: {
                        param: "changePasswordByKey"
                    }
                },
                updateContacts: {
                    method: "POST",
                    params: {
                        param: "updateContacts"
                    }
                },
                changeOrgName: {
                    method: "POST",
                    params: {
                        param: "changeOrgName"
                    }
                },
                createPaymentUsage: {
                    method: "GET",
                    params: {
                        param: "createPaymentUsage"
                    }
                },
                getPayments: {
                    method: "GET",
                    params: {
                        param: "getPayments"
                    },
                    isArray: true
                },
                deletePayment: {
                    method: "GET",
                    params: {
                        param: "deletePayment"
                    }
                },
                changeRegion: {
                    method: "POST",
                    params: {
                        param: "changeRegion"
                    }
                },
                disableUser: {
                    method: "GET",
                    params: {
                        param: "disableUser"
                    }
                },
                enableUser: {
                    method: "GET",
                    params: {
                        param: "enableUser"
                    }
                },
                getActivePersonCount: {
                    method: "GET",
                    params: {
                        param: "getActivePersonCount"
                    }
                },
                checkKey: {
                    method: "GET",
                    params: {
                        param: "checkKey"
                    }
                },
                getAchieves:{
                    method:"POST",
                    params:{
                        param:"getAchieves"
                    }
                },
                authPing:{
                    method:"GET",
                    params:{
                        param:"authping"
                    }
                },
                getUserParam: {
                    method: "GET",
                    params: {
                        param: "getUserParam"
                    }
                },
                editEmail:{
                    method:"POST",
                    params:{
                        param:"editEmail"
                    }
                },
                removePersonEmail:{
                    method:"GET",
                    params:{
                        param:"removePersonEmail"
                    }
                },
                changeFirstName:{
                    method:"POST",
                    params:{
                        param:"changeFirstName"
                    }
                },
                addGoogleCalendar:{
                    method:"POST",
                    params:{
                        param:"addGoogleCalendar"
                    }
                },
                getGoogleCalendar:{
                    method:"GET",
                    params:{
                        param:"getGoogleCalendar"
                    }
                },
                deleteGoogleCalendar:{
                    method:"DELETE",
                    params:{
                        param:"deleteGoogleCalendar"
                    }
                },
                unInviteUser:{
                    method:"GET",
                    params:{
                        param:"unInviteUser"
                    }
                },
                getUserPopup: {
                    method: "GET",
                    params: {
                        param: "getUserPopup"
                    }
                },
                addOutlookCalendar:{
                    method:"POST",
                    params:{
                        param:"addOutlookCalendar"
                    }
                },
                getOutlookCalendar: {
                    method: "GET",
                    params: {
                        param: "getOutlookCalendar"
                    }
                },
                deleteOutlookCalendar: {
                    method: "DELETE",
                    params: {
                        param: "deleteOutlookCalendar"
                    }
                },
                removeUser : {
                    method: "get",
                    params: {
                        param: "removeUser"
                    }
                }

            });
     person.requestGetAllPersons = function () {
         $rootScope.loading = true;
         return new Promise((resolve, reject) => {
             person.getAllPersons(resp => resolve(resp, resp['request'] = 'AllPersons'),error => reject(error));
         });
     };
     person.requestRemoveUser = function (params) {
         $rootScope.loading = true;
         return new Promise((resolve, reject) => {
             person.removeUser(params, resp => resolve(resp), error => reject(error));
         });
     };

     return person;
 }]);