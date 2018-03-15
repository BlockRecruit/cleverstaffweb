component.component('sent', {
    templateUrl: "partials/mailing/mailings-sent.html",
    controller: function ($scope, $rootScope, $timeout, $anchorScroll , $localStorage, notificationService, $filter, $uibModal, ngTableParams, Mailing, Service) {
        $scope.a = {};
        $scope.a.searchNumber = 1;
        $scope.requestParams = {
            page: {number: 0, count: 15},
            status: 'sent'
        };
        $scope.currentDate = new Date().getTime();
        $scope.tableParams = new ngTableParams({
            page: 1,
            count: $scope.requestParams.page.count
        }, {
            total: 0,
            getData: function($defer, params) {
                $rootScope.loading = true;
                $scope.requestParams.page.number = params.$params.page - 1;
                $scope.requestParams.page.count = params.$params.count;

                function getMailings(page, count) {
                    if(page || count) {
                        $scope.requestParams.page.number = page;
                        $scope.requestParams.page.count = count;
                    } else {
                        $scope.isShowMore = false;
                        if(document.getElementById('scrollup'))
                            document.getElementById('scrollup').style.display = 'none';
                        $timeout(function() {
                            $anchorScroll('mainTable');
                        });
                    }
                    Mailing.getAllCompaigns($scope.requestParams, function(response) {
                        $rootScope.loading = false;
                        $scope.objectSize =  response['object'] != undefined ? response['object']['page']['totalElements'] : 0;
                        params.total(response['object']['page']['totalElements']);
                        $scope.paginationParams = {
                            currentPage: $scope.requestParams.page.number,
                            totalCount: $scope.objectSize
                        };
                        let pagesCount = response['object']['page']['totalPages'];
                        if(pagesCount == $scope.requestParams.page.number + 1) {
                            $('#show_more').hide();
                        } else {
                            $('#show_more').show();
                        }
                        if(page) {
                            $scope.sentMailings = $scope.sentMailings.concat(response['object']['page']['content'])
                        } else {
                            $scope.sentMailings = response['object']['page']['content'];
                        }
                        $defer.resolve($scope.sentMailings);
                        $scope.a.searchNumber = $scope.tableParams.page();
                    });
                }
                getMailings();
                $scope.showMore = function () {
                    $scope.isShowMore = true;
                    Service.dynamicTableLoading(params.total(), $scope.requestParams.page.number, $scope.requestParams.page.count, getMailings)
                };
            }
        });


        $scope.toSentPreview = function (mailing) {
            Mailing.toSentPreview(mailing);
        };


        $scope.cloneModal = function (id) {
            $scope.cloningCompaignId = id;
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/mailing-clone.html',
                size: '',
                scope: $scope
            });
        };


        $scope.cloneMailing = function (cloneName) {
            if(cloneName && cloneName.length > 0) {
                Mailing.cloneMailing({
                    'compaignId': $scope.cloningCompaignId,
                    'internalName': cloneName
                },(resp)=> {
                    if(resp.status !== 'error') {
                        notificationService.success($filter('translate')('Mailing cloned'))
                    } else {
                        notificationService.error(resp.message)
                    }
                }, (error)=>{
                    notificationService.error(error)
                });
                $scope.modalInstance.close();
            } else {
                notificationService.error($filter('translate')('Fill in the new mailing name'))
            }
        };

    }
});