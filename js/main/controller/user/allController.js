controller.controller('usersController', ["$localStorage", "$translate", "$scope", "ngTableParams", "Person", "$rootScope", "$filter", "$location",
    "notificationService", "Service", "Company", "Vacancy", "ScopeService", "$uibModal",
    function ($localStorage, $translate, $scope, ngTableParams, Person, $rootScope, $filter, $location, notificationService, Service, Company, Vacancy, ScopeService, $uibModal) {
        $scope.personAll = [];
        $scope.usersFoundInv = false;
        $scope.personAllDisable = [];
        $scope.a = {};
        $scope.a.searchNumber = 1;
        $scope.sortTypeInvited = 'email';
        $scope.sortReverseInvited = true;
        $scope.sortTypeDisabled = 'fullName';
        $scope.sortReverseDisabled = true;
        $scope.toggleDisabledUsers = true;
        $scope.toggleInvitedUsers = true;
        $localStorage.remove("previousHistoryCustomFields");
        //listenerForScope($scope, $rootScope);
        $rootScope.closeModal = function(){
            $rootScope.modalInstance.close();
        };
        function scope_update(val) {
            $scope.tableParams.reload();
            $scope.tableParamsDisable.reload();
        }

        ScopeService.setCurrentControllerUpdateFunc(scope_update);

        $scope.toOne = function (id) {
            $location.path("/users/" + id);
        };

        $scope.toHistory = function () {
            $location.path("/organizer/history");
        };

        $scope.rotateTringle = function (event){
           let element = event.delegateTarget.children[0];
            $(element).toggleClass('fa-sort-desc-rotate');
        };

        if (window.location.hash.indexOf("invite") != -1) {
            $('.addUserInvite.modal').modal('show');
        }

        $scope.sendDailyReportExample = function () {
            if ($localStorage.isExist('dateSent')) {
                var dateStr = $localStorage.get('dateSent');
                dateStr = dateStr.split('-');
                var dateReport = new Date(dateStr[0], dateStr[1] - 1, dateStr[2]);
                if (dateReport.getDate() != new Date().getDate() && dateReport.getMonth() != new Date().getMonth()) {
                    Service.sendDailyReportExample(function (resp) {
                        if (angular.equals(resp.status, "ok")) {
                            var dateSent = new Date();
                            var formatDate = $filter('date')(dateSent, 'yyyy-MM-dd');
                            $localStorage.set('dateSent', formatDate);
                            notificationService.success($filter('translate')('Report has been sent!'));
                        } else if (angular.equals(res.status, "error")) {
                            notificationService.error(res.message);
                        } else {
                            //notificationService.error($filter('translate')('service temporarily unvailable'));
                        }
                    });

                } else {
                    notificationService.error($filter('translate')('You have already sent daily report today'));
                }
            } else {
                Service.sendDailyReportExample(function (resp) {
                    if (angular.equals(resp.status, "ok")) {
                        var dateSent = new Date();
                        var formatDate = $filter('date')(dateSent, 'yyyy-MM-dd');
                        $localStorage.set('dateSent', formatDate);
                        notificationService.success($filter('translate')('Report has been sent!'));
                    } else if (angular.equals(res.status, "error")) {
                        notificationService.error(res.message);
                    } else {
                        //notificationService.error($filter('translate')('service temporarily unvailable'));
                    }
                });
            }
        };


        Person.getAllPersonsWithDetails(function (resp) {

            $scope.tableParams = new ngTableParams({
                page: 1,
                count: 15
            }, {
                total: 10,
                getData: function ($defer, params) {
                    if (ScopeService.isInit()) {
                        var activeParam = ScopeService.getActiveScopeObject();
                        $scope.activeScopeParam = activeParam;
                        $scope.usersFound = false;
                        $scope.personAll = [];
                        var persons = angular.copy(resp);
                        angular.forEach(persons, function (val, key) {
                            if (activeParam.name != 'region' && persons[key].status === 'A') {
                                $scope.personAll.push(persons[key]);
                                $scope.usersFound = true;
                            } else if (persons[key].region !== undefined) {
                                if (activeParam.name == 'region' && activeParam.value.type == "country" && persons[key].region.country == activeParam.value.value && persons[key].status === 'A') {
                                    $scope.personAll.push(persons[key]);
                                    $scope.usersFound = true;
                                } else if (activeParam.name == 'region' && activeParam.value.type == "city" && activeParam.value.value == persons[key].region.regionId && persons[key].status === 'A') {
                                    $scope.personAll.push(persons[key]);
                                    $scope.usersFound = true;
                                }
                            }
                        });
                        //if ($rootScope.me.recrutRole == 'client') {
                        //    var personS = [];
                        //    angular.forEach($scope.personAll, function (val) {
                        //        if (val.recrutRole != 'client') {
                        //            personS.push(val);
                        //        }
                        //    });
                        //    if (personS.length == 0) {
                        //        $scope.usersFound = false;
                        //    }
                        //    $defer.resolve($filter('orderBy')(personS, params.orderBy()));
                        //    $scope.personAll = angular.copy(personS);
                        //    console.log($scope.personAll);
                        //} else {
                        $defer.resolve($filter('orderBy')($scope.personAll, params.orderBy()));
                        //}
                        $scope.a.searchNumber = $scope.tableParams.page();
                    }
                }
            });
            $scope.changeInputPage = function(params,searchNumber){
                var searchNumber = Math.round(searchNumber);
                var maxValue = $filter('roundUp')(params.settings().total/params.count());
                if(searchNumber){
                    if(searchNumber >= 1 && searchNumber <= maxValue){
                        params.page(searchNumber);
                        $scope.a.searchNumber = searchNumber;
                    }
                }
            };
            $scope.tableParamsDisable = new ngTableParams({
                page: 1,
                count: 15
            }, {
                total: 10,
                getData: function ($defer, params) {
                    if (ScopeService.isInit()) {
                        var activeParam = ScopeService.getActiveScopeObject();
                        $scope.activeScopeParam = activeParam;
                        var persons = angular.copy(resp);
                        $scope.usersFoundDisable = false;
                        $scope.personAllDisable = [];

                        angular.forEach(persons, function (val, key) {
                            if (activeParam.name != 'region' && persons[key].status === 'N') {
                                $scope.personAllDisable.push(persons[key]);
                                $scope.usersFoundDisable = true;
                            } else if (persons[key].region !== undefined) {
                                if (activeParam.name == 'region' && activeParam.value.type == "country" && persons[key].region.country == activeParam.value.value && persons[key].status === 'N') {
                                    $scope.personAllDisable.push(persons[key]);
                                    $scope.usersFoundDisable = true;
                                } else if (activeParam.name == 'region' && activeParam.value.type == "city" && activeParam.value.value == persons[key].region.regionId && persons[key].status === 'N') {
                                    $scope.personAllDisable.push(persons[key]);
                                    $scope.usersFoundDisable = true;
                                }
                            }

                        });
                        $defer.resolve($filter('orderBy')($scope.personAllDisable, params.orderBy()));
                    }
                }
            });
        });
        $scope.initTableParamsInv = function () {
            $scope.tableParamsInv = new ngTableParams({
                page: 1,
                count: 15
            }, {
                total: 15,
                getData: function ($defer, params) {
                    Person.getInvited(function (resp) {
                        $scope.invAll = [];
                        angular.forEach(resp, function (val, key) {
                            if (resp[key].status !== 'A' && resp[key].status !== 'D') {
                                $scope.invAll.push(resp[key]);
                                $scope.usersFoundInv = true;
                            }
                        });
                        $defer.resolve($filter('orderBy')($scope.invAll, params.orderBy()));
                    });
                }
            });
        };
        if ($rootScope.me.recrutRole == 'admin') {
            $scope.initTableParamsInv();
        }
        $scope.callbackAddLogo = function (photo) {
            $rootScope.companyLogo = photo;
            $rootScope.logoLink = $scope.serverAddress + "/getapp?id=" + $rootScope.companyLogo + "&d=true";
        };
        $scope.callbackErr = function (err) {
            notificationService.error(err);
        };

        $scope.openInviteUserModal = function (resp) {
            console.log('here');
            $rootScope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/modal/company-invite.html',
                size: '',
                resolve: function(){

                }
            });
            $rootScope.showUserMail = resp;
        };
        $scope.openInviteUser = function () {
            if($rootScope.hideTariff){
                $rootScope.inviteUserBlock = false;
                $rootScope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'partials/modal/invite-new-user.html',
                    size: '',
                    resolve: function(){

                    }
                });
                $rootScope.modalInstance.closed.then(function() {
                    $rootScope.inviteUser.role = null;
                    $rootScope.inviteUser.email = null;
                });
            }else{
                $rootScope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'partials/modal/block-invite-user.html',
                    size: '',
                    resolve: function(){

                    }
                });
            }
        };
        $rootScope.sendUserMail = function(){
            if($rootScope.showUserMail.role == 'hr:salesmanager'){
                $rootScope.showUserMail.role = 'salesmanager';
            } else if ($rootScope.showUserMail.role == 'hr:recruter'){
                $rootScope.showUserMail.role = 'recruter';
            } else if ($rootScope.showUserMail.role == 'hr:admin'){
                $rootScope.showUserMail.role = 'admin';
            } else if ($rootScope.showUserMail.role == 'hr:client'){
                $rootScope.showUserMail.role = 'client';
            } else if ($rootScope.showUserMail.role == 'hr:freelancer'){
                $rootScope.showUserMail.role = 'freelancer';

            }
            Person.inviteUser({
                email: $rootScope.showUserMail.email,
                role: $rootScope.showUserMail.role,
                clientId: $rootScope.showUserMail.clientId,
                lang: $translate.use()
            }, function (resp) {
                if (resp.status && angular.equals(resp.status, "error")) {
                    notificationService.error(resp.message);
                   $rootScope.closeModal();
                } else {
                    notificationService.success($filter('translate')('user_was_invite_1') + $rootScope.showUserMail.email + $filter('translate')('user_was_invite_2'));
                    $rootScope.closeModal();
                    $rootScope.inviteUser.email = "";
                }
            });
        };
        $rootScope.deleteUserMail = function(){
            Person.unInviteUser({email : $rootScope.showUserMail.email, lang : $rootScope.me.personParams.lang},function(resp){
                if(resp.status == 'ok'){
                    $scope.tableParamsInv.reload();
                   $rootScope.closeModal();
                }else{
                    notificationService.error(resp.message);
                }
            })
        };
        $scope.tofullinformation = function(user){
            $location.path('users/' + user.userId);
        };
        $scope.moveToThanks = function(){
            $location.path("thanks")
        };
        $scope.getFirstLetters = function(str){
            return firstLetters(str)
        };
        //$rootScope.disabledBtnFuncUserModal = function(){
        //    $scope.modalInstance.close(function() {
        //        $scope.openInviteUser();
        //    });
        //    $scope.modalInstance = $uibModal.open({
        //        animation: true,
        //        templateUrl: '../partials/modal/disabled-btn-for-test-account.html',
        //        resolve: {
        //            items: function () {
        //                return $scope.items;
        //            }
        //        }
        //    });
        //    setTimeout(function(){
        //        $rootScope.closeModal = function(){
        //            $scope.modalInstance.close();
        //        };
        //    }, 0);
        //};
        $scope.toggleDisabledUsersFunc = function () {
            var elem = $('.disabledUsers');
            //var titleElem = $('.block-company .no-padding-sm .disabledUsers table thead');
            if($scope.toggleDisabledUsers) {
                elem.css({'display': 'block'});
                elem.toggleClass('showAfter');
                $scope.toggleDisabledUsers = false;
                //titleElem.prop('title', $filter('translate')('Show full description'));
            } else {
                elem.css({'display': 'none'});
                elem.toggleClass('showAfter');
                $scope.toggleDisabledUsers = true;
                //titleElem.prop('title', $filter('translate')('Hide full description'));
            }
        };
        $scope.toggleInvitedUsersFunc = function () {
            var elem = $('.invitedUsers');
            //var titleElem = $('.block-company .no-padding-sm .invitedUsers table thead');
            if($scope.toggleInvitedUsers) {
                elem.css({'display': 'block'});
                elem.toggleClass('showAfter');
                $scope.toggleInvitedUsers = false;
                //titleElem.prop('title', $filter('translate')('Hide full description'));
            } else {
                elem.css({'display': 'none'});
                elem.toggleClass('showAfter');
                $scope.toggleInvitedUsers = true;
                //titleElem.prop('title', $filter('translate')('Show full description'));
            }
        };
    }]);
