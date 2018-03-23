component.component('saved',{
    templateUrl: "partials/mailing/mailings-saved.html",
    controller: function ($scope, $rootScope, $timeout, $anchorScroll, $localStorage, notificationService, $uibModal, $filter, ngTableParams, Mailing, Service) {
        $scope.a = {};
        $scope.a.searchNumber = 1;
        $scope.requestParams = {
            page: {number: 0, count: 15},
            status: 'newComp'
        };

        $scope.toEditMailing = function (mailingForEdit) {
            Mailing.makeStepClickable(3);
            Mailing.toEditMailing(mailingForEdit);
        };


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
                        if(response.status === 'ok') {
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
                                $scope.savedMailings = $scope.savedMailings.concat(response['object']['page']['content'])
                            } else {
                                $scope.savedMailings = response['object']['page']['content'];
                            }
                            $defer.resolve($scope.savedMailings);
                            $scope.a.searchNumber = $scope.tableParams.page();
                        } else {
                            $rootScope.loading = false;
                            notificationService.error(response.message);
                        }
                    });
                }
                getMailings();
                $scope.showMore = function () {
                    $scope.isShowMore = true;
                    Service.dynamicTableLoading(params.total(), $scope.requestParams.page.number, $scope.requestParams.page.count, getMailings)
                };
            }
        });


        $scope.deleteMailing = function (name, id) {
            $scope.mailingName = name;
            $scope.mailingId = id;
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../partials/modal/delete-mailing.html',
                    size: '',
                    scope: $scope,
                    resolve: function(){

                    }
                });
        };


        $scope.confirmDeleteMailing = function () {
            let mailingsIds = [$scope.mailingId];
            Mailing.deleteCompaign({compaignIds: mailingsIds}, function (resp) {
                if(resp.status != 'error') {
                    $scope.closeModal();
                    $scope.tableParams.reload();
                    notificationService.success($filter('translate')('Mailing deleted'));
                    delete $scope.mailingName;
                    delete $scope.mailingId;
                } else {
                    notificationService.error(resp.message);
                }
            }, function (err) {
                notificationService.error('Error.')
            });
        };


        $scope.closeModal = function () {
            $scope.modalInstance.close();
        };


        $scope.sendMailing = function (mailingId) {
            $rootScope.loading = true;
            Mailing.sendCampaign(mailingId).then(result => {
                $rootScope.loading = false;
        }, error => {
                console.log('Error in $scope.sendMailing', error);
                $rootScope.loading = false;
            });
        };

    }
});