controller.controller('ActivityNoticesController',["$scope", "Notice", "Service","Person","$rootScope", "$filter", function($scope, Notice, Service, Person, $rootScope, $filter) {
    var noticeDate = new Date();
    var sendReadRequest = [];
    console.log(noticeDate);
    noticeDate.setDate(1);
    noticeDate.setMonth(noticeDate.getMonth() + 1);
    noticeDate.setHours(0);
    noticeDate.setMinutes(0);
    $scope.notices = [];
    $scope.usedIds = {};
    $scope.searchNumber = 1;
    $scope.showNumber = 20;

    Notice.registerNoticeView(function(id) {
        angular.forEach($scope.notices, function(not) {
            angular.forEach(not.object, function(val) {
                if (val.noticeId == id) {
                    val.read = true;
                }
            })
        });
    }, "ActivityNoticesController");
    $scope.hideButtonPrevHistory = false;
    var array = [];
    $scope.updateNotification = function(){
        Notice.all({
            from: null,
            to: null,
            page:{
                count:$scope.showNumber,
                number:$scope.searchNumber - 1
            }
        }, function(resp) {
            $scope.notificationOuter = resp;
            $scope.getMoreHistoryLoading = false;
            if (resp.status == 'ok' && resp.objects != undefined && resp.objects.length > 0) {
                console.log(resp);
                /** @namespace resp.objects */
                array.push({date: noticeDate.getTime(), object: resp.objects});
                $scope.notices = array;
                array = [];
                angular.forEach($scope.notices[0].object,function(data,key){
                    data.dateCreationMonth = $filter('date')(data.dc,'MM')
                });
                console.log($scope.notices);
                $scope.totalPages = Math.ceil($scope.notificationOuter.total/$scope.showNumber)
            } else if (resp.status == 'ok' && resp.objects == undefined) {
                $scope.hideButtonPrevHistory = true;
            }

        }, function(respError) {
            $scope.getMoreHistoryLoading = true;
        });
    };
    $scope.getBehindLastMonth = function(subtractMonth) {
        $scope.getMoreHistoryLoading = true;
        var to = angular.copy(noticeDate);
        if (subtractMonth) {
            noticeDate.setMonth(noticeDate.getMonth() - 1);
        }
        $scope.updateNotification();
    };
    function pageScroll() {
        $(window).scroll(function() {
            if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
                $(window).unbind('scroll');
                $scope.getBehindLastMonth(true);
            }
        });

    }

    $scope.getBehindLastMonth(true);

    $scope.readNotice = function(n) {
        if (!n.read) {
            Notice.updateNoticesView(n.noticeId, "ActivityNoticesController");
            if (!n.read && sendReadRequest.indexOf(n.noticeId) == -1) {
                sendReadRequest.push(n.noticeId);
                var index = sendReadRequest.indexOf(n.noticeId);
                Service.readNotice(n.noticeIds, function(resp) {
                    if (resp.status && resp.status == "ok") {
                        n.read = true;
                        document.dispatchEvent(new CustomEvent('cleverstaffExtensionReloadCountUnreadNotice'));
                    } else if (resp.message) {
                    }
                    sendReadRequest.splice(index, 1);
                }, function(resp) {
                    sendReadRequest.splice(index, 1);
                });
            } else {
            }
        }
    };
    $scope.checkEverythingRead = function(){
        noticeDate = new Date();
        noticeDate.setDate(1);
        noticeDate.setMonth(noticeDate.getMonth() + 1);
        noticeDate.setHours(0);
        noticeDate.setMinutes(0);
        Notice.readAll(function(resp){
            if(resp.status == 'ok'){
                $rootScope.changeFaviconNumber(0);
                $scope.getBehindLastMonth(true);
                $rootScope.updateNoticesNav();
            }
        })
    };

    $scope.changePage= function(index){
        console.log(index);
        $scope.searchNumber = $scope.searchNumber + index;
        $scope.updateNotification();
    };

    $scope.changeInputPage = function(){
        if($scope.searchNumber){
            $scope.updateNotification();
        }
    };
    $scope.changeShowNumber = function(number){
        $scope.showNumber = number;
        $scope.updateNotification();
    };


}]);