controller.controller('mailingSentController',['$scope', '$rootScope', '$filter', '$translate', 'notificationService', '$uibModal', '$state', '$localStorage', 'Mailing', function ($scope, $rootScope, $filter, $translate, notificationService, $uibModal, $state, $localStorage, Mailing) {
    $scope.sentMailing = JSON.parse($localStorage.get('sentMailing'));
    let storedBreadcrumbs = $localStorage.get('breadcrumbs');
    $scope.cloneName = '';
    let statistics = {};
    $scope.readers = [];
    $scope.notRecieved = [];
    $scope.statistics = {};
    $scope.opensListFlag = {
      opened: false,
      undelivered: false
    };
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
            statistics.common = getCommonStatistics(respObj);
            statistics.undelivered = getUndeliveredStatistics(respObj);
            $scope.readers = getReadersList(respObj.compaignEntries);
            $scope.notReceived = getNotReceivedList(respObj.compaignEntries);
            $scope.statistics = {
              opens: statistics.common.opens,
              sent: statistics.common.sent,
              undelivered: statistics.common.undelivered
            };
            chartRendering(statistics.common, statistics.undelivered);
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
                    'compaignId': $scope.sentMailing.compaignId,
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


    $scope.readerListToggle = function (sliderType) {
        $scope.opensListFlag[sliderType] = !$scope.opensListFlag[sliderType];
    };


    function getCommonStatistics(statParams) {
        let commonStat = statParams.compaign;
        let detailedStat = statParams.compaignEntries;
        let undeliveredCount = 0;
        let opens = 0;
        statParams.compaignEntries.forEach(entry => {
            if(entry.status == 'undelivered')
                undeliveredCount++;
            if(entry.status == 'open')
                opens++;
        });
        let delivered = (commonStat.sent!==undefined && commonStat.undelivered!==undefined)?(commonStat.sent - undeliveredCount):0;
        return {
            sent: commonStat.sent?commonStat.sent:0,
            opens: opens,
            undelivered: undeliveredCount,
            delivered:delivered,
            notOpened: delivered - opens
        }
    }


    function getUndeliveredStatistics(statParams) {
        let wrongEmails = 0;
        let otherReason = 0;
        statParams.compaignEntries.forEach(entry => {
            if(entry.reason == 'Неверный email') {
                wrongEmails++;
            }
        });
        otherReason = statParams.compaign.undelivered - wrongEmails - statParams.compaign.spam;
        otherReason = otherReason < 0 ? 0 : otherReason;
        return {
            spam: statParams.compaign.spam,
            wrongEmail: wrongEmails,
            other: otherReason
        }
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


    function getNotReceivedList(listReceivers) {
        let notReceived = [];
        listReceivers.forEach((reader) => {
            if(reader.status == 'undelivered') {
                notReceived.push({
                    email: reader.subscriber.email,
                    name: reader.subscriber.firstName + reader.subscriber.lastName,
                    localId: reader.subscriber.localId
                });
            }
        });
        return notReceived;
    }


    function chartRendering(common, undelivered) {
        var commonStat = {
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
        var undeliveredStat = {
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
                "text":$translate.instant('Delivery fail reasons'),
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
                    "values":[undelivered.spam],
                    "text": $translate.instant('Spam')
                },
                {
                    "values":[undelivered.other],
                    "text": $translate.instant('Other'),
                    "backgroundColor":"#7ca82b"
                },
                {
                    "values":[undelivered.wrongEmail],
                    "text": $translate.instant('Email does not exist'),
                    "backgroundColor":"#d31e1e"
                }
            ]
        };

        zingchart.render({
            id : 'commonStat',
            data : commonStat,
            height: 300,
            width: "100%"
        });
        zingchart.render({
            id : 'failsStat',
            data : undeliveredStat,
            height: 300,
            width: "100%"
        });
    }

}]);