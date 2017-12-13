controller.controller('userOneController', ["$scope", "tmhDynamicLocale", "Person", "$rootScope", "$routeParams", "Vacancy",
    "$location", "$translate", "Candidate", "Service", "notificationService", "$filter", "googleService", '$http', 'serverAddress', 'Client',
    'Company', 'vacancyStages','Action', '$sce', '$uibModal',
    function($scope, tmhDynamicLocale, Person, $rootScope, $routeParams, Vacancy, $location, $translate, Candidate, Service,
             notificationService, $filter, googleService, $http, serverAddress, Client, Company, vacancyStages, Action, $sce, $uibModal) {
        $scope.showChangePassword = false;
        $scope.showChangeOrgName = false;
        $scope.showChangeRole = false;
        $scope.showChangeRegion = false;
        $scope.showChangeGmail = false;
        $scope.showChangeContacts = false;
        $scope.changedName = "";
        $scope.contacts = {};
        $rootScope.closeModal = function(){
            $scope.modalInstance.close();
        };
        $scope.showChangeCompanyOfInvitedClient = false;
        vacancyStages.get(function(resp){
            $scope.customStages =resp.object.interviewStates;
        });

        var oldContacts = {};

        $scope.setPersonParam = function(name, value, callback) {
            $http.get(serverAddress + '/person/changeUserParam?userId=' + $scope.user.userId + "&name=" + name + "&value=" + value).success(
                function(resp) {
                if (!$scope.user.personParams) {
                    $scope.user.personParams = {};
                }
                $scope.user.personParams[name] = value;
                if (callback != undefined)callback();
            });
        };
        $scope.enableViewClients = function(user) {
            if(user.personParams.clientAccessLevel == 'full'){
                $scope.setPersonParam('clientAccessLevel', 'hide');
            }else{
                $scope.setPersonParam('clientAccessLevel', 'full');
            }
        };

        $scope.disableViewClients = function() {
            $scope.setPersonParam('clientAccessLevel', 'hide');
        };

        $scope.changeUserClientRole = function(name, clientId) {
            $scope.setPersonParam(name, clientId, function() {
                Person.getPerson({userId: $routeParams.id}, function(resp) {
                    $scope.user = resp;
                    $scope.showChangeCompanyOfInvitedClient=false;
                });
            });
        };
        $('.ui.dropdown').dropdown();
        Person.getPerson({userId: $routeParams.id}, function(resp) {
          if(resp.status =='ok'){
              $scope.user = resp.object;
              if($scope.user.recrutRole == 'admin') {
                  $scope.user.personParams.enableDownloadToExcel = (!$scope.user.personParams.enableDownloadToExcel || $scope.user.personParams.enableDownloadToExcel == 'Y' )? true : false;
              } else if ($scope.user.recrutRole == 'recruter') {
                  $scope.user.personParams.enableDownloadToExcel = ($scope.user.personParams.enableDownloadToExcel && $scope.user.personParams.enableDownloadToExcel == 'Y' )? true : false;
              }

              $scope.changedName = resp.object.fullName;
              $scope.getMyVacancy = function(){
                  Vacancy.setOptions("personId", $scope.user.userId);
                  Vacancy.all(Vacancy.searchOptions(), function(response) {
                      $scope.allVacancyInUser = response.objects;
                  });
              };
              $scope.getMyVacancy();
              angular.forEach($scope.user.personParams, function(value,key){
                  angular.forEach($scope.sendNotificationObj, function(res){
                      if(res.name == key){
                          res.value = value;
                      }
                  });
              });
              if ($rootScope.errorMessageType === "inviteBlockUser") {
                  $rootScope.errorMessageType = null;
                  $scope.errorMessage = $scope.user.fullName + " (" + $scope.user.login + ") " + $filter("translate")("has already been in your account and now he (she) is disabled. Here you can enable access for him (her)");
              }
              $scope.newRole = resp.object.recrutRole;
              $scope.statisticObj = {
                  requestObj: {creator: resp.userId},
                  objId: resp.userId,
                  objType: "user"
              };

              if (resp.object.recrutRole == 'client') {
              }
              // Client.all(Client.searchOptions(), function(response) {
              //     console.log(response);
              //     $scope.clients = response['objects'];
              // });

              $scope.showHistory = true;
              $scope.refreshHistory = function(){
                  Service.history({
                      personId: resp.object.userId,
                      "ignoreType": ['sent_candidate_to_client'],
                      "page": {"number": 0, "count": 20}
                  }, function(res) {
                      $scope.history = res.objects;
                      var array = [];
                      angular.forEach($scope.history, function(value){
                          if(value.stateNew && value.type == "set_interview_status"){
                              array = value.stateNew.split(",");
                              angular.forEach($scope.customStages,function(val){
                                  angular.forEach(array,function(resp){
                                      if(val.customInterviewStateId == resp){
                                          array[array.indexOf(val.customInterviewStateId)] = val.name;
                                      }
                                  });
                              });
                              value.stateNew = array.toString();
                          }
                      });
                      $scope.showHistory = res.objects != undefined;
                      $scope.historyLimit = 20;
                      $scope.historyTotal = res.total;
                  });
              };
              $scope.refreshHistory();

              if (resp.object.contacts) {
                  angular.forEach(resp.object.contacts, function(val) {
                      if (angular.equals(val.contactType, "phoneMob")) {
                          $scope.contacts.phoneMob = val.value;
                      }
                      if (angular.equals(val.contactType, "phoneWork")) {
                          $scope.contacts.phoneWork = val.value;
                      }
                      if (angular.equals(val.contactType, "skype")) {
                          $scope.contacts.skype = val.value;
                      }
                      if (angular.equals(val.contactType, "linkedin")) {
                          $scope.contacts.linkedin = val.value;
                      }
                      if (angular.equals(val.contactType, "facebook")) {
                          $scope.contacts.facebook = val.value;
                      }
                      if (angular.equals(val.contactType, "googleplus")) {
                          $scope.contacts.googleplus = val.value;
                      }
                      if (angular.equals(val.contactType, "homepage")) {
                          $scope.contacts.homepage = val.value;
                      }
                  });
                  oldContacts = angular.copy($scope.contacts);
              }
          }else if(resp.code == 'notFound'){
              notificationService.error($filter('translate')('User not found'));
              $location.path("company/users");
          }
        });

        $scope.getMoreHistory = function() {
            Service.history({
                personId: $scope.user.userId,
                "ignoreType": ['sent_candidate_to_client'],
                "page": {"number": 0, "count": $scope.historyLimit *= 2}
            }, function(res) {
                $scope.history = res.objects;
            }, function(error) {
            });
        };

        $scope.toAllVacancy = function() {
            $rootScope.usernameThatIsSearching = $scope.user.cutFullName;
            Vacancy.setOptions("personId", $scope.user.userId);
            $location.path("/vacancies");
        };
        $scope.toAllCandidates = function() {
            $rootScope.usernameThatIsSearching = $scope.user.cutFullName;
            $rootScope.userIdThatIsSearching = $scope.user.userId;
            Candidate.setOptions("personId", $scope.user.userId);
            $location.path("/candidates");
        };
        $rootScope.currentLang = $translate.use();
        $scope.changeLanguage = function(key) {
            $translate.use(key);
            tmhDynamicLocale.set(key);
            Person.setLang({lang: key});
        };
        $scope.saveNewRole = function(val,confirmed) {
            if ((val !== undefined && val !== $scope.user.recrutRole && val != 'client') || (val == 'client' && confirmed) || (val != 'client')) {
                    $rootScope.loading = true;
                    $scope.newRole = val;
                    Person.changeUserRole({
                        personId: $scope.user.personId,
                        userId: $scope.user.userId,
                        role: $scope.newRole
                        //clientId: newClient ? newClient.clientId : $scope.user.client ? $scope.user.client.clientId : ""
                    }, function(resp) {
                        if (resp.status && angular.equals(resp.status, "error")) {
                            $rootScope.loading = false;
                            resp.message = $filter('translate')(resp.message);
                            notificationService.error(resp.message);
                        } else {
                            Person.getPerson({userId: $routeParams.id}, function(resp) {
                                $rootScope.loading = false;
                                if($scope.newRole == resp.object.recrutRole) {
                                    $scope.user.recrutRole = $scope.newRole;
                                    var roleName = $scope.newRole == 'salesmanager' ? "Sales Manager" : $scope.newRole == 'admin' ? "Admin" : $scope.newRole == 'client' ? "Hiring Manager" : $scope.newRole == 'freelancer' ? "Freelancer" : "Recruiter";
                                    var message = $filter('translate')("You has granted role") + " " + roleName + " " + $filter('translate')('_for') + " " + $scope.user.firstName;
                                    $rootScope.updateMe();
                                    notificationService.success(message);
                                    $scope.getLastEvent();
                                }
                            });
                        }
                    }, function() {
                        //notificationService.error($filter('translate')('service temporarily unvailable'));
                    });
                $scope.showChangeRole = false;
            }else if(!confirmed){
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../partials/modal/change-role-warning.html',
                    resolve: {

                    }
                });
            } else {
                $scope.showChangeRole = false;
            }
        };
        $rootScope.saveNewRole = $scope.saveNewRole;
        $scope.inputValue = '';
        $scope.saveNewRegion = function() {
            if ($scope.region !== undefined && $scope.regionInput != '') {
                Person.changeRegion({
                    personId: $scope.user.personId,
                    region: $scope.region,
                    lang: $translate.use()
                }, function(resp) {
                    if (resp.status && angular.equals(resp.status, "error")) {
                        notificationService.error(resp.message);
                    } else {
                        $scope.user.region = $scope.region;
                        $scope.user.region.displayFullName = $scope.user.region.fullName;
//                    angular.forEach($scope.regions, function (region) {
//                        if ($scope.newRegion == region.regionId) {
//                            $scope.user.region = region;
//                        }
//                    });
                        // console.log(resp)
                        notificationService.success($filter('translate')("region change"));
                    }
                }, function() {
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                });
                $scope.showChangeRegion = false;
            } else {
                if( $scope.user.region != undefined) {
                    Person.changeRegion({
                        personId: $scope.user.personId,
                        lang: $translate.use()
                    }, function(resp) {
                        if (resp.status && angular.equals(resp.status, "error")) {
                            notificationService.error(resp.message);
                        } else {
                            $scope.user.region = undefined;
                            notificationService.success($filter('translate')("region change"));
                        }
                    }, function() {
                        //notificationService.error($filter('translate')('service temporarily unvailable'));
                    });
                }
                $scope.showChangeRegion = false;
            }
        };

        $scope.setGmail = function() {
            $rootScope.curentOnlyMenWatch = $rootScope.$watch('g_info', function(val) {
                if ($rootScope.g_info && $rootScope.g_info.email && $rootScope.g_info.email !== $scope.user.googleMail) {
                    Person.setSocial({email: $rootScope.g_info.email, social: "google"}, function(resp) {
                        if (resp.status && angular.equals(resp.status, "error")) {
                            if(resp.code == 'busyGoogle'){
                                notificationService.error($filter('translate')("This gmail is already connected to another user"));
                            }else{
                                notificationService.error(resp.message);
                            }
                            $rootScope.g_info = null;
                        } else {
                            $scope.user.googleMail = $rootScope.g_info.email;
                            notificationService.success($filter('translate')("gmail change"));
                        }
                    }, function() {
                        //notificationService.error($filter('translate')('service temporarily unvailable'));
                        $rootScope.g_info = null;
                    });
                    $rootScope.curentOnlyMenWatch();
                }
            });
            googleService.loginLink(function(resp) {
            });
        };

        $scope.resetGmail = function() {
            Person.resetSocial({social: "google"}, function(resp) {
                if (resp.status && angular.equals(resp.status, "error")) {
                    notificationService.error(resp.message);
                } else {
                    $scope.user.googleMail = null;
                    $rootScope.g_info = null;
                    notificationService.success($filter('translate')("gmail reset"));
                }
            }, function() {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });
        };
        var messages = {
            wrong1_password: $filter('translate')("Password should contain only numbers and latin letters, allowed characters: !,.?%$#@*_-+=\\|/[]{}()"),
            wrong2_password: $filter('translate')("Password should contain at least one latin letter"),
            wrong3_password: $filter('translate')("Password should contain at least one number"),
            wrong4_password: $filter('translate')("Password must be 8-30 characters long"),
            wrong_password2: $filter('translate')("The password doesn't match to previous")
        };
        $scope.changePassword = function() {
            var password1 = /^(?=.*\d)(?=.*[a-zA-Z0-9!,.?%$#@*_\-+=\\|/[\]{}()]).{8,30}$/;
            var password2 = /.*[a-zA-Z].*/;
            var password3 = /.*\d.*/;
            var password = $($('input[name=newPass]'));
            var repeatPassword = $($('input[name=newPass2]'));
            console.log(password1.test(password.val()));
            console.log(password2.test(password.val()));
            console.log(password3.test(password.val()));
            if(!password1.test(password.val()) || !password2.test(password.val()) || !password3.test(password.val()) || password.val().length < 8 || password.val().length > 30){
                password.css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
                password.focus();
                $(".error-password").removeClass("hidden");
                if(password.val().length == 0){
                    $(".error-password").html(messages.wrong4_password);
                    $(".error-password-1").removeClass("hidden");
                    $(".error-password-3").addClass("hidden");
                    $(".error-password-4").addClass("hidden");
                    $(".error-password-5").addClass("hidden");
                    $(".error-password-6").addClass("hidden");
                    return false;
                }
                if(password.val().length < 8 || password.val().length > 30){
                    $(".error-password").html(messages.wrong4_password);
                    $(".error-password-1").addClass("hidden");
                    $(".error-password-2").addClass("hidden");
                    $(".error-password-3").addClass("hidden");
                    $(".error-password-4").addClass("hidden");
                    $(".error-password-5").addClass("hidden");
                    $(".error-password-6").removeClass("hidden");
                    if(!password3.test(password.val()) == true){
                        $(".error-password").html(messages.wrong4_password);
                        $(".error-password-1").addClass("hidden");
                        $(".error-password-2").addClass("hidden");
                        $(".error-password-3").addClass("hidden");
                        $(".error-password-5").removeClass("hidden");
                        $(".error-password-6").addClass("hidden");
                        return false;
                    }
                    if(password2.test(password.val()) == true && password3.test(password.val()) == true){
                        $(".error-password").html(messages.wrong4_password);
                        $(".error-password-1").addClass("hidden");
                        $(".error-password-2").addClass("hidden");
                        $(".error-password-3").addClass("hidden");
                        $(".error-password-7").removeClass("hidden");
                        $(".error-password-5").addClass("hidden");
                        $(".error-password-6").addClass("hidden");
                        return false;
                    }
                    return false;
                }else{
                    $(".error-password").html(messages.wrong4_password);
                    $(".error-password-2").addClass("hidden");
                    $(".error-password-3").removeClass("hidden");
                    $(".error-password-5").addClass("hidden");
                }
                if(!password1.test(password.val())){
                    $(".error-password").html(messages.wrong3_password);
                    $(".error-password-3").removeClass("hidden");
                    $(".error-password-1").addClass("hidden");
                    $(".error-password-4").addClass("hidden");
                    return false;
                }
                if(!password2.test(password.val())){
                    $(".error-password").html(messages.wrong2_password);
                    $(".error-password-1").addClass("hidden");
                    $(".error-password-2").removeClass("hidden");
                    $(".error-password-4").addClass("hidden");
                    $(".error-password-3").addClass("hidden");
                    $(".error-password-6").addClass("hidden");
                    return false;
                }
            }
            if(password1.test(password.val()) && password2.test(password.val()) && password3.test(password.val())){
                password.css({'border': 'none', 'border-bottom': '1px solid #e3e3e3', 'background-color': '#fff'});
                repeatPassword.css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
                $(".error-password").html(messages.wrong_password2);
                $(".error-password-2").addClass("hidden");
                $(".error-password-3").addClass("hidden");
                $(".error-password-4").removeClass("hidden");
                $(".error-password-5").addClass("hidden");
                $(".error-password-7").addClass("hidden");
            }
            if ($scope.changePass.newPass === $scope.changePass.newPass2) {
                Person.changePassword({
                    oldPass: $scope.changePass.oldPass,
                    newPass: $scope.changePass.newPass
                }, function(resp) {
                    if (resp.status && angular.equals(resp.status, "error")) {
                        if(resp.code == 'pwd8_30'){
                            notificationService.error($filter('translate')('Password should contain at least one number, one Latin letter and be 8-30 characters long'));
                        }else{
                            resp.message = $filter('translate')(resp.message);
                            notificationService.error(resp.message);
                            repeatPassword.css({'border': 'none', 'border-bottom': '1px solid #e3e3e3', 'background-color': '#fff'});
                            $(".error-password").html(resp.message);
                        }
                    } else {
                        notificationService.success($filter('translate')('password_changed'));
                        repeatPassword.css({'border': 'none', 'border-bottom': '1px solid #e3e3e3', 'background-color': '#fff'});
                        $($('input[name=oldPass]')).val('');
                        password.val('');
                        repeatPassword.val('');
                        $(".error-password").addClass("hidden");
                        $(".error-password-4").addClass("hidden");
                        $scope.showChangePassword = false;
                    }
                }, function() {
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                });
            } else {
                notificationService.error($filter('translate')('not_match'));
            }
        };
        $scope.updateContacts = function() {
            var contacts = [];
            if ($scope.contacts.phoneMob) {
                contacts.push({contactType: "phoneMob", value: $scope.contacts.phoneMob});
            }
            if ($scope.contacts.phoneWork) {
                contacts.push({contactType: "phoneWork", value: $scope.contacts.phoneWork});
            }
            if ($scope.contacts.skype) {
                contacts.push({contactType: "skype", value: $scope.contacts.skype});
            }
            if ($scope.contacts.linkedin) {
                updateContactsLocal('linkedin',$scope.contacts.linkedin);
                contacts.push({contactType: "linkedin", value: $scope.contacts.linkedin});
            } else {
                updateContactsLocal('linkedin',$scope.contacts.linkedin);
            }
            if ($scope.contacts.facebook) {
                updateContactsLocal('facebook',$scope.contacts.facebook);
                contacts.push({contactType: "facebook", value: $scope.contacts.facebook});
            } else {
                updateContactsLocal('facebook',$scope.contacts.facebook);
            }
            if ($scope.contacts.googleplus) {
                contacts.push({contactType: "googleplus", value: $scope.contacts.googleplus});
            }
            if ($scope.contacts.homepage) {
                contacts.push({contactType: "homepage", value: $scope.contacts.homepage});
            }
            if((($('#phoneNumber').val() == $scope.contacts.phoneMob) || ($('#phoneNumber').val() == '' && $scope.contacts.phoneMob == undefined)) && (($('#workNumber').val() == $scope.contacts.phoneWork) || ($('#workNumber').val() == '' && $scope.contacts.phoneWork == undefined))){
                Person.updateContacts(contacts, function(resp) {
                    if (resp.status && angular.equals(resp.status, "error")) {
                        notificationService.error(resp.message);
                    } else {
                        notificationService.success($filter('translate')('contacts_saved'));
                        $scope.showChangeContacts = false;
                        oldContacts = angular.copy($scope.contacts);
                    }
                }, function() {
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                });
            }else{
                notificationService.error($filter('translate')('Incorrect phone number'));
            }
        };


        function updateContactsLocal(contactType, contactValue) {
            let existContact = false;
            existContact = $rootScope.me.contacts.some(function (contact) {
                if(contact.contactType == contactType) {
                    contact.value = contactValue;
                    return true
                } else {
                    return false
                }
            });

            if(!existContact) {
                $rootScope.me.contacts.push({
                    contactType: contactType,
                    value: contactValue,
                    personId: $rootScope.me.personId
                });
            }
        }


        $scope.cancelUpdateContacts = function() {
            $scope.contacts = angular.copy(oldContacts);
            $scope.showChangeContacts = false;
        };


        $scope.showChangeUserOrgName = function() {
            $scope.showChangeOrgName = true;
            $scope.newOrgName = $rootScope.me.orgName;
        };

        $scope.changeOrgName = function() {
            Person.changeOrgName({orgName: $scope.newOrgName, lang: $translate.use()}, function(resp) {
                if (resp.status && angular.equals(resp.status, "error")) {
                    notificationService.error(resp.message);
                } else {
                    $rootScope.me.orgName = $scope.newOrgName;
                    $scope.user.orgName = $scope.newOrgName;
                    $scope.showChangeOrgName = false;
                    angular.forEach($rootScope.me.orgs, function(org) {
                        if (org.orgId == $rootScope.me.orgId) {
                            org.orgName = $scope.newOrgName;
                        }
                    });
                    angular.forEach($rootScope.orgs, function(org) {
                        if (org.orgId == $rootScope.me.orgId) {
                            org.orgName = $scope.newOrgName;
                        }
                    });

                    $scope.getLastEvent();

                }
            }, function() {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });
        };

        $scope.changeUserStatus = function() {
            if ($scope.user.status === "A") {
                $scope.disableUser();
            } else if ($scope.user.status === "N") {
                $scope.enableUser();
            }
        };

        $scope.getLastEvent = function() {
            Service.history({
                "vacancyId": $scope.vacancy !== undefined ? $scope.vacancy.vacancyId : null,
                "page": {"number": 0, "count": 1},
                "candidateId": $scope.candidate !== undefined ? $scope.candidate.candidateId : null,
                "clientId": $scope.client !== undefined ? $scope.client.clientId : null,
                "personId": ($scope.user !== undefined && $scope.user.userId != undefined) ? $scope.user.userId : null
            }, function(res) {
                if (res.status == 'ok')
                    $scope.history.unshift(res.objects[0]);
            }, function(error) {
            });
        };

        $scope.disableUser = function(user,confirmed) {
            $rootScope.userForDisable = user;
            if(user.status == 'A' && confirmed){
                Person.disableUser({personId: $scope.user.personId, userId: $scope.user.userId}, function(resp) {
                    if (resp.status && angular.equals(resp.status, "error")) {
                        notificationService.error(resp.message);
                    } else {
                        $scope.user.status = "N";
                        $scope.getLastEvent();
                    }
                }, function() {
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                });
            }else if(confirmed && user.status == 'N'){
                Person.enableUser({personId: $scope.user.personId, userId: $scope.user.userId}, function(resp) {
                    if (resp.status && angular.equals(resp.status, "error")) {
                        notificationService.error(resp.message);
                    } else {
                        $scope.user.status = "A";
                        $scope.getLastEvent();
                    }
                }, function() {
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                });
            }else{
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    scope: $scope,
                    templateUrl: '../partials/modal/remove-user-warning.html?b1',
                    resolve: {

                    }
                });
            }
        };
        $rootScope.disableUser = $scope.disableUser;
        $scope.enableUser = function() {
            Person.enableUser({personId: $scope.user.personId, userId: $scope.user.userId}, function(resp) {
                if (resp.status && angular.equals(resp.status, "error")) {
                    notificationService.error(resp.message);
                } else {
                    $scope.user.status = "A";
                    $scope.getLastEvent();
                }
            }, function() {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });
        };

        $scope.setPersonEmploye = function(name, value) {
            $http.get(serverAddress + '/employee/setEmployeeFunctionsEnabled?userId=' + $scope.user.userId + "&enable=" + value).success(
                function(resp) {
                    if (!$scope.user.personParams) {
                        $scope.user.personParams = {};
                    }
                    $scope.user.personParams[name] = value;
                    if($scope.user.login == $rootScope.me.login){
                        $rootScope.me.personParams[name] = value;
                    }
                    //if (callback != undefined)callback();
                });

        };
        $scope.setExcelRecruiter = function(name, value) {
            $http.get(serverAddress + '/employee/setDownloadingToExcelEnable?userId=' + $scope.user.userId + "&enable=" + value).success(
                function(resp) {
                    if (!$scope.user.personParams) {
                        $scope.user.personParams = {};
                    }
                    $scope.user.personParams[name] = value;
                    if($scope.user.login == $rootScope.me.login){
                        $rootScope.me.personParams[name] = value;
                    }
                    //if (callback != undefined)callback();
                });

        };

        $scope.enableViewEmploye = function(user) {
            if(user.personParams.enableEmployee == 'N'){
                $scope.setPersonEmploye('enableEmployee','Y');
            }else{
                $scope.setPersonEmploye('enableEmployee','N');
            }
        };

        $scope.disableViewEmploye = function() {
            $scope.setPersonEmploye('enableEmployee','N');
        };

        $scope.disableExcelRecruiter = function() {
            $scope.setExcelRecruiter('enableEmployee',false);
        };
        $scope.enableExcelRecruiter = function(user) {
            if(user.personParams.enableDownloadToExcel){
                $scope.setExcelRecruiter('enableDownloadToExcel', false);
            }else{
                $scope.setExcelRecruiter('enableDownloadToExcel', true);
            }
        };

        $scope.getCompanyParams = function(){
            Company.getParams(function(resp){
                $scope.companyParams = resp.object;
            });
        };
        $scope.getCompanyParams();
        $scope.changeCommentFlag = function(history){
            history.editCommentFlag = !history.editCommentFlag;
            $scope.editComment = history.descr;
        };
        $scope.changeComment = function(action){
            Action.editAction({"comment": action.descr, "actionId": action.actionId}, function(resp){
                if (resp.status && angular.equals(resp.status, "error")) {
                    notificationService.error(resp.message);
                }
                else {
                    action.editCommentFlag = false;
                    action.descr = resp.object.descr;
                    action.new_komment = '';
                    action.dateEdit = resp.object.dateEdit;
                }
            });
        };

        $scope.showDeleteComment = function(resp) {
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/delete-comment-candidate.html',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            $rootScope.commentRemove = resp;
            $rootScope.commentRemoveId = resp.actionId;
        };

        $rootScope.deleteComment = function() {
            Action.removeMessageAction({
                actionId: $rootScope.commentRemoveId
            },function(resp){
                if (resp.status === "ok") {
                    notificationService.success($filter('translate')('Comment removed'));
                    $scope.refreshHistory();
                } else {
                    //notificationService.error($filter('translate')('service temporarily unvailable'));
                }
                $rootScope.closeModal();
            })
        };
        $scope.showForm = true;
        $scope.focusChangeNameFunc = function(){
            $scope.showForm = false;
            setTimeout(function(){
                $("#changeNameInput").focus();
            },0)
        };
        $scope.showFormEdit = function(){
            $scope.showForm = false;
            $scope.focusInput = true;
        };
        $scope.checkKeyFunc = function(event){
            if(event.keyCode === 13){
                $scope.showForm = true;
                $('#changeNameInput').blur()
            }
        };
        $scope.changeUserFirstName = function (){
            if($scope.changedName.length > 0){
                Person.changeFirstName({
                    firstName: $scope.changedName
                },function(resp){
                    if(resp.status == 'ok'){
                        $scope.showForm = true;
                        Person.getPerson({userId: $routeParams.id}, function(resp) {
                            $scope.user = resp.object;
                            $rootScope.updateMe();
                        });
                    }else{
                        notificationService.error(resp.message);
                    }
                });
            }else{
                notificationService.error($filter('translate')('Enter_at_least_one_symbol'));
            }
        };
        $scope.showEditEmailTemplate = function(template){
            $scope.activeTemplate = template.type;
            $scope.fileForSave = [];
            $scope.emailTemplate = {
                mailTemplateId: template.mailTemplateId,
                type: template.type,
                name: template.name,
                title: template.title,
                text: template.text,
                vacancyId: $scope.vacancy.vacancyId,
                fileId: template.fileId,
                fileName: template.fileName
            };
            if($scope.emailTemplate.fileId && $scope.emailTemplate.fileName){
                $scope.fileForSave.push({"fileId": $scope.emailTemplate.fileId, "fileName": $scope.emailTemplate.fileName});
            }
            $scope.emailTemplateForRender.text = $scope.emailTemplate.text;
            $scope.showAddEmailTemplate = true;
            $scope.updateRenderedTitle();
        };

        $(document).mouseup(function (e) {
            if ($(".popover").has(e.target).length === 0){
                $('.popover').remove('.popover');
            }
        });
    }
]);
