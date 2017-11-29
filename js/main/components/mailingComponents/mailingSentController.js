controller.controller('mailingSentController',['$scope', '$rootScope', '$filter', '$translate', 'notificationService', '$uibModal', '$state', '$localStorage', 'Mailing', function ($scope, $rootScope, $filter, $translate, notificationService, $uibModal, $state, $localStorage, Mailing) {
    $scope.sentMailing = JSON.parse($localStorage.get('sentMailing'));
    let storedBreadcrumbs = $localStorage.get('breadcrumbs');
    $scope.cloneName = '';
    let statistics = {};
    $scope.readers = [];
    $scope.statistics = {};
    let defaultBreadcrumbs = [
        {
            href: '#/candidates',
            transl: 'our_base'
        },
        {
            transl: 'My mailings'
        }
    ];
    let breadCrumbs = storedBreadcrumbs?JSON.parse(storedBreadcrumbs):defaultBreadcrumbs;
    breadCrumbs.pop();
    breadCrumbs.push({
        href: '#/mailings',
        transl: 'My mailings'
        },{
        value: $scope.sentMailing.internalName
    });
    $rootScope.breadCrumbs = breadCrumbs;


    Mailing.getAnalytics({compaignIds: [$scope.sentMailing.compaignId]},function (resp) {
        let respObj = resp.object[0];
        if(resp.status != 'error') {
            statistics.common = getCommonStatistics(respObj.compaign);
            $scope.readers = getReadersList(respObj.compaignEntries);
            $scope.statistics = {
              opens: statistics.common.opens,
              sent: statistics.common.sent,
              undelivered: statistics.common.undelivered
            };
            chartRendering(statistics.common);
        }
    },function (error) {
        console.log('error',error);
    });


    $scope.cloneModal = function () {
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
                    'сompaignId': $scope.sentMailing.compaignId,
                    'internalName': cloneName
            },(resp)=> {
                if(resp.status !== 'error') {
                    console.log('newMail', resp)
                }
            }, (error)=>{
                notificationService.error(error)
            });
            $scope.modalInstance.close();
        } else {
            notificationService.error($filter('translate')('Fill in the new mailing name'))
        }
    };


    $scope.readerListToggle = function () {
        $scope.opensListFlag = !$scope.opensListFlag;
    };


    function getCommonStatistics(statParams) {
        let result = {};
        if(statParams.opens > statParams.sent)
            statParams.opens = statParams.sent;
        let delivered = (statParams.sent!==undefined && statParams.undelivered!==undefined)?(statParams.sent - statParams.undelivered):0;
        result = {
            sent: statParams.sent?statParams.sent:0,
            opens: statParams.opens?statParams.opens:0,
            undelivered: statParams.undelivered?statParams.undelivered:0,
            delivered:delivered,
            notOpened: (statParams.opens!==undefined)?(delivered - statParams.opens):0
        };
        return result;
    }


    function getReadersList(readersList) {
        let readers = [];
        readersList.forEach((reader) => {
            if(reader.status == 'open') {
                readers.push({
                    email: reader.subscriber.email,
                    name: reader.subscriber.firstName + reader.subscriber.lastName,
                    localId: reader.subscriber.localId
                });
            }
        });
        return readers;
    }


    function chartRendering(common) {
        var myConfig = {
            "type":"pie",
            "plot": {
                "borderColor": "#eee",
                "borderWidth": 3,
                "valueBox": {
                    "placement": 'out',
                    "text": '%t\n%npv%',
                    "fontFamily": "Open Sans"
                },
                "tooltip":{
                    "fontSize": '18',
                    "fontFamily": "Open Sans",
                    "padding": "5 10"
                },
                "animation":{
                    "effect": 2,
                    "method": 5,
                    "speed": 900,
                    "sequence": 1,
                    "delay": 1000
                }
            },
            "title":{
                "text":$translate.instant('statistics'),
                "fontColor": "#8e99a9",
                "align": "left",
                "offsetX": 10,
                "fontFamily": "Open Sans",
                "fontSize": 18
            },
            "plotarea": {
                "margin": "20 0 0 0"
            },
            "series":[
                {
                    "values":[common.notOpened],
                    "text": $translate.instant('Not opened')
                },
                {
                    "values":[common.opens],
                    "text": $translate.instant('Read'),
                    "backgroundColor":"#7ca82b"
                },
                {
                    "values":[common.undelivered],
                    "text": $translate.instant('Not delivered'),
                    "backgroundColor":"#d31e1e"
                }
            ]
        };

        zingchart.render({
            id : 'commonStat',
            data : myConfig,
            height: 300,
            width: "100%"
        });
        zingchart.render({
            id : 'failsStat',
            data : myConfig,
            height: 300,
            width: "100%"
        });
    }

}]);