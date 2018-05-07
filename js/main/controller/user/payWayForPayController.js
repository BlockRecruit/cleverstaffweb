controller.controller('payWay4PayController', ["$scope", "Person", "$rootScope", "$routeParams", "$location","$translate","Service",
    "notificationService","$filter", "Account", "Pay","Company", "$timeout",
    function ($scope, Person, $rootScope, $routeParams, $location, $translate, Service, notificationService, $filter, Account, Pay, Company, $timeout) {
        $scope.numberVacancy = 0;
        $scope.trueVisionBlockUser = $rootScope.blockUser;
        $rootScope.blockUser = false;
        $scope.bonus = 0;
        $scope.paidUsers = [];
        $scope.months = [{label:1, value:1},{label:2, value:2},{label:3, value:3},{label:4, value:4},{label:5, value:5},{label:6, value:6},{label:7, value:7},{label:8, value:8},{label:9, value:9},{label:10, value:10},{label:11, value:11},{label:12, value:12}];
        $scope.countPeople = 0;
        $scope.countMonth = 4;
        $scope.isOnBilling = false;
        $scope.bonuce = 10;

        $scope.paymentHistory = {payment: false, transitions: false};
        $scope.showFreeTariffPayment = false;

        $scope.togglePaymentHistory = function({payment, transitions}) {
            if(payment && $scope.paymentHistory.payment && $scope.paymentHistory.transitions) {
                $scope.paymentHistory.transitions = false;
            }
            if(transitions && $scope.paymentHistory.payment && $scope.paymentHistory.transitions){
                $scope.paymentHistory.payment = false;
            }
        };

        $scope.toggleFreeTariffView = function() {
            $scope.showFreeTariffPayment = true;
            $timeout(() => {
                $scope.scrollTo('section-pay');
            })
        };

        var promise = new Promise(function(resolve, reject) {
            $rootScope.loading = true;
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
            $scope.isOnBilling = !resp.object.monthRate;
            $rootScope.loading = false;
            watchSelectForChanges();
            if($rootScope.me['orgParams']['tarif']) {
                if($rootScope.me['orgParams']['tarif'] == 'free'){
                    $scope.tarif = '1 Recruiter';
                }else if($rootScope.me['orgParams']['tarif'] == 'standard'){
                    $scope.tarif = 'Team work';
                }else{
                    $scope.tarif = $rootScope.me['orgParams']['tarif'];
                }
            } else {
                $scope.tarif = resp.object.tarif;
            }
            $scope.dailyRate = resp.object.dailyRate;
            $scope.monthRate = resp.object.monthRate;
        },function(msg){
            notificationService.error(msg);
            $rootScope.loading = false;
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

                $scope.price = Math.floor($scope.monthRate * $scope.countMonth * $scope.countPeople);
                $scope.bonusAmount = Math.floor(($scope.price / 100) * $scope.bonus );
                $scope.priceWithBonus = $scope.price + $scope.bonusAmount;

                $scope.priceWithBonusBilling = ($scope.price - ($scope.bonuce * $scope.price)/100);
                $('#price').html($scope.priceWithBonusBilling + " USD");
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
            $scope.price = Math.floor($scope.monthRate * $scope.countMonth * $scope.countPeople);
            $scope.bonusAmount = Math.floor(($scope.price / 100) * $scope.bonus );
            $scope.priceWithBonus = $scope.price + $scope.bonusAmount;

            Pay.paymentInfo.countPeople = $scope.countPeople;
            Pay.paymentInfo.countMonths = $scope.countMonth;

        });

        function watchSelectForChanges() {
            $timeout(() => {
                $('.checkoutInner select').on('change', function () {
                    $scope.countMonth = $('#countMonth').val();
                    $scope.countPeople = $('#countPeople').val();

                    $scope.monthRate = $scope.monthRate || 25;

                    if ($scope.countMonth >= 12) {
                        $scope.price = $scope.monthRate * $scope.countMonth * $scope.countPeople;
                        $scope.bonuce = 20;
                        $scope.priceWithBonusBilling = ($scope.price - ($scope.bonuce * $scope.price)/100);
                        $('#bonuce').removeClass('hidden');
                        $('#amountBonus').html($scope.priceWithBonusBilling);
                    }
                    else if ($scope.countMonth >= 4) {
                        $scope.price = $scope.monthRate * $scope.countMonth * $scope.countPeople;
                        $scope.bonuce = 10;
                        $scope.priceWithBonusBilling = ($scope.price - ($scope.bonuce * $scope.price)/100);
                        $('#bonuce').removeClass('hidden');
                        $('#amountBonus').html($scope.priceWithBonusBilling);
                    }
                    else {
                        $('#bonuce').addClass('hidden');
                        $scope.price = $scope.monthRate * $scope.countMonth * $scope.countPeople;
                        $scope.priceWithBonusBilling = $scope.price;
                    }

                    // $('#price').html($scope.price + " USD");
                    $('#price').html($scope.priceWithBonusBilling + " USD");
                    $scope.$apply();
                });
            })
        }

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

        $scope.scrollTo = function(id) {
            if($(window).width() <= 768) {
                let element = $('#' + id);
                $("html, body").animate({scrollTop: element.position().top - 20}, "slow");
            }
        };

        $scope.updatePaymentsList();
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
