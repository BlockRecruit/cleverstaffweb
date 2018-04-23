controller.controller('payWay4PayController', ["$scope", "Person", "$rootScope", "$routeParams", "$location","$translate","Service",
    "notificationService","$filter", "Account", "Pay","Company",
    function ($scope, Person, $rootScope, $routeParams, $location, $translate, Service, notificationService, $filter, Account, Pay, Company) {
        $scope.numberVacancy = 0;
        $scope.trueVisionBlockUser = $rootScope.blockUser;
        $rootScope.blockUser = false;
        $scope.bonus = 0;
        $scope.paidUsers = [];
        $scope.months = [{label:1, value:1},{label:2, value:2},{label:3, value:3},{label:4, value:4},{label:5, value:5},{label:6, value:6},{label:7, value:7},{label:8, value:8},{label:9, value:9},{label:10, value:10},{label:11, value:11},{label:12, value:12}];
        $scope.countPeople = 0;
        $scope.countMonth = 4;

        $scope.paymentHistory = {payment: true, transitions: false};

        $scope.togglePaymentHistory = function({payment, transitions}) {
            if(payment) {
                $scope.paymentHistory.transitions = !$scope.paymentHistory.transitions;
            } else {
                $scope.paymentHistory.payment = !$scope.paymentHistory.payment;
            }
        };

        var promise = new Promise(function(resolve, reject) {
            Account.getAccountInfo(function(resp){
                if(resp.status != 'error'){
                    resolve(resp);
                } else {
                    reject(resp.message);
                }
            });
        });

        promise.then(function(resp){
            $scope.balance = resp.object;
            if($rootScope.me['orgParams']['tarif']) {
                $scope.tarif = $rootScope.me['orgParams']['tarif'];
            } else {
                $scope.tarif = resp.object.tarif;
            }

            $scope.dailyRate = resp.object.dailyRate;
            $scope.monthRate = resp.object.monthRate;
        },function(msg){
            notificationService.error(msg);
        }).then(function(){
            $scope.getAllPersons = Person.getAllPersons(function (resp) {
                $scope.associativePerson = resp.object;
                angular.forEach($scope.associativePerson, function (val) {
                    if (val.status == "A" && val.recrutRole != 'client') {
                        $scope.numberVacancy = ++$scope.numberVacancy;
                        $scope.paidUsers.push({label: $scope.paidUsers.length + 1, value: $scope.paidUsers.length + 1});
                    }
                });
                $scope.countPeople = $scope.paidUsers.length;
                if(!$scope.monthRate) {
                    if ($scope.countMonth >= 12) {
                        $scope.price = 25 * $scope.countMonth * $scope.countPeople * 0.8;
                        $scope.bonus = 20;
                    }
                    else if ($scope.countMonth >= 4) {
                        $scope.price = 25 * $scope.countMonth * $scope.countPeople * 0.9;
                        $scope.bonus = 10;
                    }
                    else {
                        $scope.price = 25 * $scope.countMonth * $scope.countPeople;
                        $scope.bonus = 0;
                    }
                } else {
                    $scope.price = $scope.monthRate * $scope.countMonth * $scope.countPeople;
                }
                $scope.bonusAmount = ($scope.bonus * $scope.price)/100;
            });
        },function(msg){
            notificationService.error(msg);
        });

        $scope.$watchGroup(['countPeople', 'countMonth'], function() {
            $scope.monthRate = $scope.monthRate || 25;
            if ($scope.countMonth >= 12) {
                $scope.bonus = 20;
            }
            else if ($scope.countMonth >= 4) {
                $scope.bonus = 10;
            }
            else {
                $scope.bonus = 0;
            }
            $scope.price = Math.floor($scope.monthRate * $scope.countMonth * $scope.countPeople * (1 + ($scope.bonus/ 100)));
            $scope.bonusAmount = $scope.price - ($scope.price * 100 / ($scope.bonus + 100));
        });

        $scope.payClick = function () {
            Pay.createPaymentUsage({
                months: $scope.countMonth,
                users: $scope.countPeople,
                type: 'way4pay'
            }, function (resp) {
                if (resp.status && angular.equals(resp.status, "error")) {
                    notificationService.error(resp.message);
                } else {
                    var form = '<form id="payForm" action="https://secure.wayforpay.com/pay" method="post">' +
                        '<input type="hidden" name="amount" value="' + resp.wayForPayParams.amount + '" />' +
                        '<input type="hidden" name="currency" value="' + resp.wayForPayParams.currency + '" />' +
                        '<input type="hidden" name="merchantAccount" value="' + resp.wayForPayParams.merchantAccount + '" />' +
                        '<input type="hidden" name="merchantDomainName" value="' + resp.wayForPayParams.merchantDomainName + '" />' +
                        '<input type="hidden" name="merchantSignature" value="' + resp.wayForPayParams.merchantSignature + '" />' +
                        '<input type="hidden" name="merchantTransactionSecureType" value="' + resp.wayForPayParams.merchantTransactionSecureType + '" />' +
                        '<input type="hidden" name="merchantTransactionType" value="' + resp.wayForPayParams.merchantTransactionType + '" />' +
                        '<input type="hidden" name="orderDate" value="' + resp.wayForPayParams.orderDate + '" />' +
                        '<input type="hidden" name="orderReference" value="' + resp.wayForPayParams.orderReference + '" />' +
                        '<input type="hidden" name="paymentSystems" value="' + resp.wayForPayParams.paymentSystems + '" />' +
                        '<input type="hidden" name="productCount[]" value="' + resp.wayForPayParams.productCount + '" />' +
                        '<input type="hidden" name="productName[]" value="' + resp.wayForPayParams.productName + '" />' +
                        '<input type="hidden" name="productPrice[]" value="' + resp.wayForPayParams.productPrice + '" />' +
                        '<input type="hidden" name="returnUrl" value="' + resp.wayForPayParams.returnUrl + '" />' +
                        '<input type="hidden" name="serviceUrl" value="' + resp.wayForPayParams.serviceUrl + '" />' +
                        '</form>';
                    $('body').append(form);
                    $('#payForm').submit();
                    $('#payForm').remove();
                }
            }, function () {
                //notificationService.error($filter('translate')('service temporarily unvailable'));
            });
        };

        $scope.updatePaymentsList = function () {
            Pay.getPayments(function (resp) {
                $scope.payments = resp;
            });
        };

        $scope.acceptChangesBiling = function () {

            Company.setParam({
                name:"switch2billing",
                value:"Y"

            }, function (resp) {

                if(resp.status == "ok"){
                    $rootScope.closeModal();
                    $rootScope.modalInstance = undefined;
                }
            });

        };

        $scope.updatePaymentsList();
        // $scope.getAllPersons = Person.getAllPersons(function (resp) {
        //     //allPersons = Object.keys(resp).length;
        //     $scope.associativePerson = resp.object;
        //     angular.forEach($scope.associativePerson, function (val) {
        //         //console.log(val);
        //         //console.log(val.status);
        //         if (val.status == "A" && val.recrutRole != 'client') {
        //             $scope.numberVacancy = ++$scope.numberVacancy;
        //         }
        //     });
        //     //console.log('allPersons: '+$scope.numberVacancy);
        //     if ($scope.numberVacancy <= 12 && $scope.numberVacancy != 0) {
        //         $('#countPeople').append("<option style='display: none;' selected>" + $scope.numberVacancy + "</option>");
        //     }
        //     else {
        //         $('#countPeople').append("<option selected>" + $scope.numberVacancy + "</option>");
        //     }
        //     $scope.countMonth = $('#countMonth').val();
        //     $scope.countPeople = $('#countPeople').val();
        //     if ($scope.countMonth >= 12) {
        //         $scope.price = $scope.monthRate * $scope.countMonth * $scope.countPeople * 0.80;
        //     }
        //     else if ($scope.countMonth >= 4) {
        //         $scope.price = $scope.monthRate * $scope.countMonth * $scope.countPeople * 0.9;
        //     }
        //     else {
        //         console.log("3",$scope.monthRate);
        //         console.log("4",$scope.dailyRate);
        //         $scope.price = $scope.monthRate * $scope.countMonth * $scope.countPeople;
        //     }
        //     $('#price').html($scope.price + " USD");
        // });
        $scope.deletePayment = function (resp) {
            console.log(resp.paymentId);
            $.ajax({
                url: "/hr/pay/removePayment?paymentId=" + resp.paymentId,
                type: "GET",
                data: null,
                dataType: "json",
                success: function (data) {
                    if (data.status === "ok") {
                        $scope.updatePaymentsList();
                    }else{
                        notificationService.error(data.message);
                    }
                }
            });
        };
        $scope.payViaTab = function (resp) {
            var form = '<form id="payForm" action="https://secure.wayforpay.com/pay" method="post">' +
                '<input type="hidden" name="amount" value="' + resp.wayForPayParams.amount + '" />' +
                '<input type="hidden" name="currency" value="' + resp.wayForPayParams.currency + '" />' +
                '<input type="hidden" name="merchantAccount" value="' + resp.wayForPayParams.merchantAccount + '" />' +
                '<input type="hidden" name="merchantDomainName" value="' + resp.wayForPayParams.merchantDomainName + '" />' +
                '<input type="hidden" name="merchantSignature" value="' + resp.wayForPayParams.merchantSignature + '" />' +
                '<input type="hidden" name="merchantTransactionSecureType" value="' + resp.wayForPayParams.merchantTransactionSecureType + '" />' +
                '<input type="hidden" name="merchantTransactionType" value="' + resp.wayForPayParams.merchantTransactionType + '" />' +
                '<input type="hidden" name="orderDate" value="' + resp.wayForPayParams.orderDate + '" />' +
                '<input type="hidden" name="orderReference" value="' + resp.wayForPayParams.orderReference + '" />' +
                '<input type="hidden" name="paymentSystems" value="' + resp.wayForPayParams.paymentSystems + '" />' +
                '<input type="hidden" name="productCount[]" value="' + resp.wayForPayParams.productCount + '" />' +
                '<input type="hidden" name="productName[]" value="' + resp.wayForPayParams.productName + '" />' +
                '<input type="hidden" name="productPrice[]" value="' + resp.wayForPayParams.productPrice + '" />' +
                '<input type="hidden" name="returnUrl" value="' + resp.wayForPayParams.returnUrl + '" />' +
                '<input type="hidden" name="serviceUrl" value="' + resp.wayForPayParams.serviceUrl + '" />' +
                '</form>';
            $('body').append(form);
            $('#payForm').submit();
            $('#payForm').remove();
        };
        $scope.checkPay = function () {
            var string = window.location.hash,
                substring = "order";
            console.log(string);
            if (string.indexOf(substring) > -1) {
                $scope.fromPayment = true;
            }
        };
        $scope.checkPay();

        Account.getTransactions({
            dateFrom:null,
            dateTo: null
        },function (resp) {
                if(resp.status == 'ok'){
                    $scope.expenses = resp.object.reverse();
                }else{
                    notificationService.error(resp.message);
                }
        });
    }
]);
