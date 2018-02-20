controller.controller('cloudAdminController', ["$rootScope", "$http", "$scope", "$translate", "FileInit", "$location", "Service", "Candidate","Account","Company", "notificationService", "$filter",
    "$localStorage", "$cookies", "$window", "serverAddress","$routeParams", "$uibModal",
    function($rootScope, $http, $scope, $translate, FileInit, $location, Service, Candidate,Account,Company, notificationService, $filter, $localStorage,
             $cookies, $window, serverAddress,$routeParams, $uibModal) {

        if($rootScope.me){
            if($rootScope['me']['personParams']['domainAdmin'] == 'all'){
                $scope.title = 'Admin Panel of all accounts';
            }else{
                $scope.title =  "Admin Panel of domain" + $rootScope['me']['personParams']['domainAdmin'];
            }
        }

        $rootScope.closeModal = function(){
            $scope.modalInstance.close();
        };

        $rootScope.loading = true;
        Account.getAccountsInfo({},function (resp) {
            $rootScope.loading = false;
            if(!resp)return;
            $scope.data = resp['object'];
        });



        $scope.tableHeads = ['points','score','account','country','created','regUsers','tarif','paidTill','trialEnd','block',
                             'integratedEmails','invites', 'hrModule','balance','payUsers','latestPaymentByCard','amount',
                             'purpose','activeUsers','vacancies','candidates','lastAtion','server'];


        $scope.scroll = 0;
        $scope.max = 1;

        $scope.sortCriteria = "points";
        $scope.reverseSort = true;

        $scope.dateError = false;
        $scope.amountError = false;
        $scope.commentError = false;
        $scope.newPayment = {};
        $scope.selectedAccount = {};


        $scope.leftScroll = (function () {
            var elems = document.querySelectorAll('.admin-panel'),
                max = 0,
                scroll = 0;
                return function () {
                    elems.forEach(item => {
                        if(max <= 0){
                            max = item.scrollWidth - item.scrollLeft - item.clientWidth - 1;
                            $scope.max = max;
                        }
                        scroll = item.scrollLeft += 1150;
                        $scope.scroll = scroll;
                    })
                };
        })();

        $scope.rightScroll = (function () {
            var elems = document.querySelectorAll('.admin-panel'),
                min = 0,
                scroll = 0;
            return function () {
                elems.forEach(item =>{
                    scroll = item.scrollLeft -= 1150;
                    $scope.scroll = scroll;
                })
            };
        })();

        $scope.sortBy = function(head) {
            if(head !== $scope.sortCriteria) {
                $scope.sortCriteria = head;
                $scope.reverseSort = true;
            } else {
                $scope.reverseSort = !$scope.reverseSort;
            }
        };

        $scope.addNewPayment = function() {
            $scope.dateError = !$scope.newPayment.date;
            $scope.amountError = !$scope.newPayment || !$scope.newPayment.amount;
            $scope.commentError = !!($scope.newPayment && $scope.newPayment.amount < 0 && !$scope.newPayment.comment);

            if(!$scope.amountError && !$scope.commentError && !$scope.dateError) {
                Account.addTransactionForFinancier({
                    orgId: $scope.selectedAccount.orgId,
                    targetDate: $scope.newPayment.date,
                    doubleAmount: $scope.newPayment.amount,
                    descr: $scope.newPayment.comment
                }, function (resp) {
                    console.log(resp);
                    if(resp.status === "ok") {
                        $scope.modalInstance.close();
                        notificationService.success($filter('translate')('Payment was added'));
                    } else {
                        notificationService.error(resp.message);
                    }
                });
            }
        };

        $scope.limitFloats = function() {
            if($scope.newPayment && $scope.newPayment.amount && $scope.newPayment.amount % 1 !== 0) {
                $scope.newPayment.amount = +($scope.newPayment.amount).toFixed(2);
            }
        };

        function resetPayment() {
            $scope.newPayment.date = null;
            $scope.newPayment.amount = null;
            $scope.newPayment.comment = "";
            $scope.dateError = false;
            $scope.amountError = false;
            $scope.commentError = false;
        }

        $scope.openNewPayment = function(account) {
            resetPayment();
            $scope.selectedAccount.orgId = account.orgId;
            $scope.selectedAccount.account = account.account;
            $scope.newPayment.date = Date.now();
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/cloud-admin-new-payment.html?b=9',
                size: '',
                scope: $scope,
                resolve: {}
            });
            // $scope.modalInstance.opened.then(function() {
            //     setTimeout(function(){
            //         $(".setPaymentDate").datetimepicker({
            //             format: "dd-MM",
            //             startView: 2,
            //             minView: 2,
            //             autoclose: true,
            //             weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
            //             language: $translate.use(),
            //             startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
            //             endDate:  new Date(),
            //             maxViewMode: 4
            //         }).on('changeDate', function (data) {
            //             $scope.newPayment.date = data.date;
            //         }).on('hide', function () {
            //             $('.setPaymentDate').blur();
            //         });
            //         $('th.switch').bind('click' , function() {
            //             return false; // disabling month and year nagivation
            //         })
            //     },1)
            // });
        }
    }]);