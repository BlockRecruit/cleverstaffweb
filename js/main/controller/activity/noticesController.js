controller.controller('ActivityNoticesController',["$scope", "ngTableParams", "$timeout", "$anchorScroll", "Notice", "Service","Person","$rootScope", "$filter", function($scope, ngTableParams, $timeout, $anchorScroll, Notice, Service, Person, $rootScope, $filter) {
    var noticeDate = new Date();
    var sendReadRequest = [];
    noticeDate.setDate(1);
    noticeDate.setMonth(noticeDate.getMonth() + 1);
    noticeDate.setHours(0);
    noticeDate.setMinutes(0);
    $scope.notices = [];
    $scope.usedIds = {};
    $scope.hideButtonPrevHistory = false;
    let pagingParams = {
        page: {
            number: 0,
            count: 15
        }
    };

    let pageNumber = 0;
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 15
    }, {
        total: 0,
        getData: function($defer, params){
            function getNotices(page, count) {
                if(page || count) {
                    pageNumber = page;
                    pagingParams.page.number = page;
                    pagingParams.page.count = count;
                } else {
                    $scope.isShowMore = false;
                    pageNumber = params.$params.page-1;
                    pagingParams.page.number = params.$params.page-1;
                    pagingParams.page.count = params.$params.count;
                    if(document.getElementById('scrollup'))
                        document.getElementById('scrollup').style.display = 'none';
                    $timeout(function() {
                        $anchorScroll('mainTable');
                    });
                }
                Notice.all({
                    from: null,
                    to: null,
                    page:{
                        count:pagingParams.page.count,
                        number:pagingParams.page.number
                    }
                }, function(resp) {
                    $scope.notificationOuter = resp;
                    $scope.getMoreHistoryLoading = false;
                    if (resp.status == 'ok' && resp.objects != undefined && resp.objects.length > 0) {
                        if(page) {
                            $scope.notices = $scope.notices.concat(resp['objects'])
                        } else {
                            $scope.notices = resp['objects'];
                        }
                        angular.forEach($scope.notices,function(data,key){
                            data.dateCreationMonth = $filter('date')(data.dc,'MM')
                        });
                        $scope.dateCreate = noticeDate.getDate();
                        console.log($scope.notices);
                        $scope.totalPages = Math.ceil($scope.notificationOuter.total/$scope.showNumber);
                        $rootScope.objectSize = resp['objects'] != undefined ? resp['total'] : 0;
                        $scope.paginationParams = {
                            currentPage: $scope.searchNumber,
                            totalCount: $rootScope.objectSize
                        };
                        let pagesCount = Math.ceil(resp['total']/params.$params.count);
                        if(pagesCount == pagingParams.page.number + 1) {
                            $('#show_more').hide();
                        } else {
                            $('#show_more').show();
                        }
                        $rootScope.loading = false;
                        params.total(resp['total']);
                        $defer.resolve($scope.notices);
                    } else if (resp.status == 'ok' && resp.objects == undefined) {
                        $scope.hideButtonPrevHistory = true;
                    }

                }, function(respError) {
                    $scope.getMoreHistoryLoading = true;
                });
            }

            getNotices();
            $scope.showMore = function () {
                $scope.isShowMore = true;
                Service.dynamicTableLoading(params.total(), pageNumber, params.$params.count, getNotices)
            };
        }
    });


    Notice.registerNoticeView(function(id) {
        angular.forEach($scope.notices, function(not) {
            angular.forEach(not.object, function(val) {
                if (val.noticeId == id) {
                    val.read = true;
                }
            })
        });
    }, "ActivityNoticesController");


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


}]);