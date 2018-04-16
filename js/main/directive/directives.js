var directive = angular.module('RecruitingApp.directives', []).
directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
        elm.text(version);
    };
}]).value('ZeroClipboardPath', '//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/1.1.7/ZeroClipboard.swf')
    .directive('appendHtml', function() {
        return {
            restrict: 'AE',
            scope: {
                text: "@text"
            },
            link: function(scope, element) {
                element.append(scope.text)
            }
        }
    })
    .directive('clipCopy', ['$window', 'ZeroClipboardPath', function($window, ZeroClipboardPath) {
            return {
                scope: {
                    clipCopy: '&',
                    clipClick: '&'
                },
                restrict: 'A',
                link: function(scope, element, attrs) {
                    // Create the clip object
                    var clip = new ZeroClipboard(element, {
                        moviePath: ZeroClipboardPath,
                        trustedDomains: ['*'],
                        allowScriptAccess: "always"
                    });

                    clip.on('mousedown', function(client) {
                        client.setText(scope.$eval(scope.clipCopy));
                        if (angular.isDefined(attrs.clipClick)) {
                            scope.$apply(scope.clipClick);
                        }
                    });
                }
            }
        }]
    ).directive('phoneInfoInCandidateTable', ['$window', function($window) {
            return {
                scope: {
                    contact: '='
                },
                restrict: 'A',
                link: function(scope, element, attrs) {
                    angular.forEach(scope.contact, function(val) {
                        if (val.type == 'mphone') {
                            element.attr('title', val.value);
                            if (val.value != undefined) {
                                var s = val.value.split(',');
                                if (s.length == 1) {
                                    element.text(val.value);
                                } else {
                                    element.text(s[0] + ', ...');
                                }
                            }
                        }
                    });
                }
            }
        }]
    ).directive('pulsar', ['$window', 'Candidate', '$rootScope', function($window, Candidate, $rootScope) {
            return {
                restrict: 'AE',
                scope: {
                    left: "@",
                    top: "@",
                    typem: "@"
                },
                templateUrl: "partials/pulsar.html",
                link: function(scope, element, attrs) {
                    element.find(".pulsar").css({
                        left: scope.left,
                        top: scope.top
                    });
                    element.mouseover(function(event) {

                        var left = element.find('.pulsar').css("left").replace('px', '');
                        var top = element.find('.pulsar').css("top").replace('px', '');
                        if (scope.typem == 'open_cv') {
                            scope.$parent.$parent.showResumeUploadInfoPop = true;
                            if (!scope.$parent.$parent.$$phase) {
                                scope.$parent.$parent.$apply();
                            }
                        } else if (scope.typem == 'networking') {
                            element.find('.bubble').css({
                                "top": '69px',
                                "left": Number($(this).css("left").replace('px', '')) + 'px',
                                "display": "block",
                                "visibility": "visible"
                            });
                            element.find('.bubble-arrow').css({
                                "background-position": "right top",
                                "left": "-63px"
                            });
                            element.find('.bubble-info').css({
                                left: 810 - Number(element.find('.bubble-info').width()) - 900,
                                "display": "block",
                                "visibility": "visible"
                            });
                        } else if (scope.typem == 'candidate_add') {
                            element.find('.bubble-arrow').css({
                                "background-position": "left bottom"
                            });
                            element.find('.bubble-info').css({
                                "display": "block",
                                "visibility": "visible",
                                top: "0px"
                            });

                            element.find('.bubble').css({
                                "top": (Number(top.replace('px', '')) - 10) + 'px',
                                "left": (Number(left.replace('px', '')) + 17) + 'px',
                                "display": "block",
                                "visibility": "visible"
                            });
                        } else if (scope.typem == 'recommended_candidates') {
                            element.find('.bubble-info').css({
                                "display": "block",
                                "visibility": "visible"
                            });

                            element.find('.bubble').css({
                                "top": (Number(top.replace('px', '')) - 44) + 'px',
                                "left": (Number(left.replace('px', '')) + 17) + 'px',
                                "display": "block",
                                "visibility": "visible"
                            });
                        } else if (scope.typem == 'search_vk_ws') {
                            element.find('.bubble-info').css({
                                "display": "block",
                                "visibility": "visible"
                            });

                            element.find('.bubble').css({
                                "top": (Number(top.replace('px', '')) - 44) + 'px',
                                "left": (Number(left.replace('px', '')) + 17) + 'px',
                                "display": "block",
                                "visibility": "visible"
                            });
                        } else if (scope.typem == 'scope_descr') {

                            element.find('.bubble-info').css({
                                "display": "block",
                                "visibility": "visible",
                                left: "-192px",
                                top: "-83px",
                                height: "215px"
                            });
                            element.find('.bubble-arrow').css({
                                "background-position": "right bottom",
                                left: "171px",
                                top: "-108px"

                            });

                            element.find('.bubble').css({
                                "top": (Number(top.replace('px', '')) ) + 100 + 'px',
                                "left": (Number(left.replace('px', '')) - $(this).width() - element.find('.bubble-arrow').width() - 150) + 'px',
                                "display": "block",
                                "visibility": "visible"
                            });
                        }
                        else if (scope.typem == 'invite_user') {
                            element.find('.bubble-arrow').css({
                                "background-position": "left bottom",
                                top: "35px"
                            });
                            element.find('.bubble-info').css({
                                "display": "block",
                                "visibility": "visible",
                                top: "54px"
                            });

                            element.find('.bubble').css({
                                "top": (Number(top.replace('px', '')) - 44) + 'px',
                                "left": (Number(left.replace('px', '')) + 17) + 'px',
                                "display": "block",
                                "visibility": "visible"
                            });
                        }
                    });
                    element.mouseleave(function(event) {
                        element.find('.bubble-info').css({
                            "display": "block",
                            "visibility": "visible"
                        });
                        element.find('.bubble').css({
                            "display": "none",
                            "visibility": "hidden"
                        });
                        if (scope.typem == 'open_cv') {
                            scope.$parent.$parent.showResumeUploadInfoPop = false;
                            if (!scope.$parent.$parent.$$phase) {
                                scope.$parent.$parent.$apply();
                            }

                        }
                    });
                }
            };
        }]
    ).directive('statisticsDir', ["Statistic", "$filter", "$translate", function(Statistic, $filter, $translate) {
            return {
                restrict: 'AE',
                scope: {
                    statisticObj: "="
                },
                templateUrl: "partials/notices/statistics.html",
                link: function(scope, element, attrs) {
                    element.find('.button_open').click(function() {
                        Statistic.getSalesFunnel(scope.statisticObj.requestObj, function(resp) {
                            scope.hasFunnelChart = false;
                            console.log("create diagram");
                            if (resp['longlist'] != 0) {
                                scope.hasFunnelChart = true;
                                var myChart = {};
                                if (resp.funnelMap) {
                                    var series = [];
                                    var values = [];
                                    var values2 = [];
                                    var values3 = [];
                                    var lastCount = null;
                                    angular.forEach(resp.funnelMap, function(i, s) {
                                        series.push({
                                            "values": [i]
                                        });
                                        values.push($filter('translate')("interview_status_assoc" + "." + s));
                                        values2.push(i.toString());
                                        if (lastCount == null) {
                                            values3.push('100%');
                                        } else {
                                            values3.push((i != 0 ? Math.round(i / lastCount * 100) : 0) + '%');
                                        }
                                        lastCount = i;
                                    });
                                    myChart = {
                                        "type": "funnel",
                                        "series": series,
                                        tooltip: {
                                            visible: true,
                                            shadow: 0
                                        },

                                        "scale-y": {
                                            "values": values,
                                            "item": {
                                                fontSize: 12,
                                                "offset-x": 50
                                            }
                                        },
                                        "scale-y-2": {
                                            "values": values2,
                                            "item": {
                                                fontSize: 12,
                                                "offset-x": -40
                                            }
                                        },
                                        "scale-y-3": {
                                            "values": values3,
                                            "item": {
                                                fontSize: 12,
                                                "offset-x": -10
                                            }
                                        },
                                        "scale-x": {
                                            "values": [""]
                                        },
                                        labels: [
                                            {
                                                text: $filter('translate')('Relative conversion'),
                                                fontWeight: "bold",
                                                fontSize: 12,
                                                offsetX: 670,
                                                offsetY: 20
                                            },
                                            {
                                                text: $filter('translate')('Candidates'),
                                                fontWeight: "bold",
                                                fontSize: 12,
                                                offsetX: $translate.use() != 'en' ? 580 : 605,
                                                offsetY: 20
                                            },
                                            {
                                                text: $filter('translate')('status'),
                                                fontWeight: "bold",
                                                fontSize: 12,
                                                offsetX: 100,
                                                offsetY: 20
                                            }
                                        ],
                                        "backgroundColor": "white",
                                        "gui": {
                                            "behaviors": [
                                                {
                                                    "id": "DownloadPDF",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "Reload",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "Print",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "DownloadSVG",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "LogScale",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "About",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "FullScreen",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "BugReport",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "ViewSource",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "FullScreen",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "FullScreen",
                                                    "enabled": "none"
                                                }
                                            ]
                                        }
                                    };
                                } else {
                                    myChart = {
                                        "type": "funnel",
                                        "width":'610px',
                                        "series": [
                                            {
                                                "values": [resp['longlist']]
                                            }, {
                                                "values": [resp['shortlist']]
                                            }, {
                                                "values": [resp['interview']]
                                            }, {
                                                "values": [resp['approved']]
                                            }
                                        ],
                                        "tooltip": {
                                            "visible": true
                                        },
                                        "scale-y": {
                                            "values": [$filter('translate')('long_list'),
                                                $filter('translate')('short_list'),
                                                $filter('translate')('interview'),
                                                $filter('translate')('approved')],
                                            "item": {
                                                fontSize: 12,
                                                "offset-x": 35
                                            }
                                        },
                                        "scale-y-2": {
                                            "values": [resp['longlist'] + '',
                                                resp['shortlist'] + '',
                                                resp['interview'] + '',
                                                resp['approved'] + ''],
                                            "item": {
                                                fontSize: 12,
                                                "offset-x": 0
                                            }
                                        },
                                        "scale-y-3": {
                                            "values": ['100%',
                                                Math.round(resp['shortlist'] / resp['longlist'] * 100) + '%',
                                                (resp['shortlist'] != 0 ? Math.round(resp['interview'] / resp['shortlist'] * 100) : 0) + '%',
                                                (resp['interview'] != 0 ? Math.round(resp['approved'] / resp['interview'] * 100) : 0) + '%'],
                                            "item": {
                                                fontSize: 12,
                                                "offset-x": 55
                                            }
                                        },
                                        "scale-y-4": {
                                            "values": ['100%',
                                                Math.round(resp['shortlist'] / resp['longlist'] * 100) + '%',
                                                (resp['interview'] != 0 ? Math.round(resp['interview'] / resp['longlist'] * 100) : 0) + '%',
                                                (resp['approved'] != 0 ? Math.round(resp['approved'] / resp['longlist'] * 100) : 0) + '%'],
                                            "item": {
                                                fontSize: 12,
                                                "offset-x": 115
                                            }
                                        },
                                        "scale-x": {
                                            "values": [""]
                                        },
                                        labels: [
                                            {
                                                text: $filter('translate')('Relative conversion'),
                                                fontWeight: "bold",
                                                fontSize: 12,
                                                offsetX: 570,
                                                offsetY: 20
                                            },
                                            {
                                                text: $filter('translate')('Absolute conversion'),
                                                fontWeight: "bold",
                                                fontSize: 12,
                                                offsetX: 670,
                                                offsetY: 20
                                            },
                                            {
                                                text: $filter('translate')('Candidates'),
                                                fontWeight: "bold",
                                                fontSize: 12,
                                                offsetX: $translate.use() != 'en' ? 485 : 505,
                                                offsetY: 20
                                            },
                                            {
                                                text: $filter('translate')('status'),
                                                fontWeight: "bold",
                                                fontSize: 12,
                                                offsetX: 80,
                                                offsetY: 20
                                            }
                                        ],
                                        "backgroundColor": "white",
                                        "gui": {
                                            "behaviors": [
                                                {
                                                    "id": "DownloadPDF",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "Reload",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "Print",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "DownloadSVG",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "LogScale",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "About",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "FullScreen",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "BugReport",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "ViewSource",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "FullScreen",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "FullScreen",
                                                    "enabled": "none"
                                                }
                                            ]
                                        }
                                    };
                                }
                                zingchart.render({
                                    id: "myChartDiv",
                                    data: myChart,
                                    height: 350,
                                    width: 750,
                                    output: "html5"
                                });
                            }
                        });
                        var statPanel = element.find('#statistic_panel');
                        statPanel.css({left: Number(element.find("#buttonPanel").width()) + 14});
                        if (statPanel.css('display') == 'none') {
                            statPanel.toggle('slide', {direction: 'left'}, 400);
                            $(document).mouseup(function(e) {
                                var statElement = $("#statistic_panel");
                                if ($("#statistic_panel").has(e.target) && !$('.button_open').is(e.target)) {
                                    element.find("#statistic_panel").hide();
                                    $(document).off('mouseup');
                                }
                            });
                        } else {
                            statPanel.hide();
                            $(document).off('mouseup')
                        }
                    });
                }
            }
        }]
    ).directive('userStatisticsDir', ["Statistic", "$filter", "$translate", function(Statistic, $filter, $translate) {
            return {
                restrict: 'AE',
                scope: {
                    user: "@userId",
                    name: "@userName"
                },
                templateUrl: "partials/notices/userSalesFunnel.html",
                link: function(scope, element, attrs) {
                    element.find('.button_open').click(function() {
                        var chartId = scope.user + "_chartDiv";
                        Statistic.getSalesFunnel({creator: scope.user}, function(resp) {
                            scope.hasFunnelChart = false;
                            if (resp['longlist'] != 0) {
                                scope.hasFunnelChart = true;
                                var myChart = {};
                                if (resp.funnelMap) {
                                    var series = [];
                                    var values = [];
                                    var values2 = [];
                                    var values3 = [];
                                    var lastCount = null;
                                    angular.forEach(resp.funnelMap, function(i, s) {
                                        series.push({
                                            "values": [i]
                                        });
                                        values.push($filter('translate')("interview_status_assoc" + "." + s));
                                        values2.push(i.toString());
                                        if (lastCount == null) {
                                            values3.push('100%');
                                        } else {
                                            values3.push((i != 0 ? Math.round(i / lastCount * 100) : 0) + '%');
                                        }
                                        lastCount = i;
                                    });
                                    myChart = {
                                        "type": "funnel",
                                        "series": series,
                                        tooltip: {
                                            visible: true,
                                            shadow: 0
                                        },

                                        "scale-y": {
                                            "values": values,
                                            "item": {
                                                fontSize: 12,
                                                "offset-x": 50
                                            }
                                        },
                                        "scale-y-2": {
                                            "values": values2,
                                            "item": {
                                                fontSize: 12,
                                                "offset-x": -40
                                            }
                                        },
                                        "scale-y-3": {
                                            "values": values3,
                                            "item": {
                                                fontSize: 12,
                                                "offset-x": -10
                                            }
                                        },
                                        "scale-x": {
                                            "values": [""]
                                        },
                                        labels: [
                                            {
                                                text: $filter('translate')('Conversion'),
                                                fontWeight: "bold",
                                                fontSize: 12,
                                                offsetX: 670,
                                                offsetY: 20
                                            },
                                            {
                                                text: $filter('translate')('Count'),
                                                fontWeight: "bold",
                                                fontSize: 12,
                                                offsetX: $translate.use() != 'en' ? 580 : 605,
                                                offsetY: 20
                                            },
                                            {
                                                text: $filter('translate')('status'),
                                                fontWeight: "bold",
                                                fontSize: 12,
                                                offsetX: 100,
                                                offsetY: 20
                                            }
                                        ],
                                        "backgroundColor": "white",
                                        "gui": {
                                            "behaviors": [
                                                {
                                                    "id": "DownloadPDF",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "Reload",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "Print",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "DownloadSVG",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "LogScale",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "About",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "FullScreen",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "BugReport",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "ViewSource",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "FullScreen",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "FullScreen",
                                                    "enabled": "none"
                                                }
                                            ]
                                        }
                                    };
                                } else {
                                    myChart = {
                                        "type": "funnel",
                                        "series": [
                                            {
                                                "values": [resp['longlist']]
                                            }, {
                                                "values": [resp['shortlist']]
                                            }, {
                                                "values": [resp['interview']]
                                            }, {
                                                "values": [resp['approved']]
                                            },
                                        ],
                                        "tooltip": {
                                            "visible": true
                                        },
                                        "scale-y": {
                                            "values": [$filter('translate')('long_list'),
                                                $filter('translate')('short_list'),
                                                $filter('translate')('interview'),
                                                $filter('translate')('approved')],
                                            "item": {
                                                fontSize: 12,
                                                "offset-x": 60
                                            }
                                        },
                                        "scale-y-2": {
                                            "values": [resp['longlist'] + '',
                                                resp['shortlist'] + '',
                                                resp['interview'] + '',
                                                resp['approved'] + ''],
                                            "item": {
                                                fontSize: 12,
                                                "offset-x": -40
                                            }
                                        },
                                        "scale-y-3": {
                                            "values": ['100%',
                                                Math.round(resp['shortlist'] / resp['longlist'] * 100) + '%',
                                                (resp['shortlist'] != 0 ? Math.round(resp['interview'] / resp['shortlist'] * 100) : 0) + '%',
                                                (resp['interview'] != 0 ? Math.round(resp['approved'] / resp['interview'] * 100) : 0) + '%'],
                                            "item": {
                                                fontSize: 12,
                                                "offset-x": -10
                                            }
                                        },
                                        "scale-x": {
                                            "values": [""]
                                        },
                                        labels: [
                                            {
                                                text: $filter('translate')('Conversion'),
                                                fontWeight: "bold",
                                                fontSize: 12,
                                                offsetX: 670,
                                                offsetY: 20
                                            },
                                            {
                                                text: $filter('translate')('Count'),
                                                fontWeight: "bold",
                                                fontSize: 12,
                                                offsetX: $translate.use() != 'en' ? 580 : 605,
                                                offsetY: 20
                                            },
                                            {
                                                text: $filter('translate')('status'),
                                                fontWeight: "bold",
                                                fontSize: 12,
                                                offsetX: 100,
                                                offsetY: 20
                                            }
                                        ],
                                        "backgroundColor": "white",
                                        "gui": {
                                            "behaviors": [
                                                {
                                                    "id": "DownloadPDF",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "Reload",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "Print",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "DownloadSVG",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "LogScale",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "About",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "FullScreen",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "BugReport",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "ViewSource",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "FullScreen",
                                                    "enabled": "none"
                                                }, {
                                                    "id": "FullScreen",
                                                    "enabled": "none"
                                                }
                                            ]
                                        }
                                    };
                                }
                                zingchart.render({
                                    id: chartId,
                                    data: myChart,
                                    height: 350,
                                    width: 750,
                                    output: "html5"
                                });
                            }
                        });
                        var salesFunnelId = '#' + scope.user + '_panel';
                        var statPanel = element.find(salesFunnelId);
                        statPanel.css({left: $(window).width() / 2 - statPanel.width() / 2});
                        if (statPanel.css('display') == 'none') {
                            statPanel.toggle('slide', {direction: 'left'}, 400);
                            $(document).mouseup(function(e) {
                                if ($(salesFunnelId).has(e.target) && !$('.button_open').is(e.target)) {
                                    element.find(salesFunnelId).hide();
                                    $(document).off('mouseup');
                                }
                            });
                        } else {
                            statPanel.hide();
                            $(document).off('mouseup')
                        }
                    });
                }
            }
        }]
    ).directive('noticesDir', ["$window", "Candidate", "CacheCandidates", "$rootScope", "Person", "$location",
        "Service", "Notice", "$translate", "$filter", "tmhDynamicLocale",
        function($window, Candidate, CacheCandidates, $rootScope, Person, $location, Service, Notice, $translate,
                 $filter, tmhDynamicLocale) {
            return {
                scope: {},
                restrict: 'AE',
                templateUrl: "partials/notices/notice.html",
                link: function(scope, element, attrs) {
                    var sendReadRequest = [];
                    var favicon = new Favico({
                        animation:'none',
                        position : 'up'
                    });
                    scope.noticeObj = {tariffPlanType: null, notices: null, read: 0};
                    scope.sync = {withEmail: false, withGoogle: false};
                    var check = 0;
                    //Candidate.getParseEmailData(function(resp) {
                    //    if (resp.status && resp.status === "ok") {
                    //        angular.forEach(resp.objects, function(val) {
                    //            if (val.validHost) {
                    //                scope.sync.withEmail = "active";
                    //            } else if (scope.sync.withEmail === false) {
                    //                scope.sync.withEmail = "processing";
                    //            }
                    //        });
                    //
                    //    }
                    //}, function(resp) {
                    //});
                    scope.toCandidateAddEmail = function() {
                        closePopUp();
                        $location.path('/candidate/add/email');
                    };

                    Notice.registerNoticeView(function(id) {
                        $rootScope.newNoticeCount = $rootScope.newNoticeCount - 1;
                        favicon.badge($rootScope.newNoticeCount);
                        angular.forEach(scope.noticeObj.notices, function(val) {
                            if (val.noticeId == id) {
                                val.read = true;
                                scope.noticeObj.read++;
                            }
                        });
                    }, "noticesDir");

                    scope.toVacancy=function(val){
                        $location.path('/vacancies/'+val);
                    };
                    scope.readNotice = function(n) {
                        if (!n.read && sendReadRequest.indexOf(n.noticeId) == -1) {
                            Notice.updateNoticesView(n.noticeId, "noticesDir");
                            sendReadRequest.push(n.noticeId);
                            var index = sendReadRequest.indexOf(n.noticeId);
                            Service.readNotice(n.noticeIds, function(resp) {
                                if (resp.status && resp.status == "ok") {
                                    n.read = true;
                                    scope.noticeObj.read++;
                                    $rootScope.newNoticeCount = $rootScope.newNoticeCount - 1;
                                    favicon.badge($rootScope.newNoticeCount);
                                    document.dispatchEvent(new CustomEvent('cleverstaffExtensionReloadCountUnreadNotice'));
                                } else if (resp.message) {
                                }
                                sendReadRequest.splice(index, 1);
                            }, function(resp) {
                                sendReadRequest.splice(index, 1);
                            });
                        } else {
                        }
                    };
                    scope.toPage = function(notice) {
                        if (notice.type == 'parserEmailIncorrectPassword') {
                            closePopUp();
                            $location.path("/candidate/add/email")
                        }
                    };
                    scope.toCandidate = function(id) {
                        closePopUp();
                        $location.path('/candidates/' + id);
                    };
                    $rootScope.updateNoticesNav = function(){
                        var interval = setInterval(function(){
                            if($rootScope.globalNotice){
                                clearInterval(interval);
                                if($rootScope.me !== undefined) {
                                    scope.sync.withGoogle = $rootScope.me.googleMail != undefined;
                                } else {
                                    scope.sync.withGoogle = false;
                                }
                                if ($rootScope.globalNotice.notices != undefined && $rootScope.globalNotice.notices.length > 0) {
                                    scope.noticeObj.notices = $rootScope.globalNotice.notices;
                                    $rootScope.newNoticeCount = $rootScope.globalNotice.countUnreadNotice;
                                    favicon.badge($rootScope.newNoticeCount);
                                    $rootScope.$apply()
                                }
                            }
                        },500);
                        //Person.getMe(function(resp) {
                        //    scope.sync.withGoogle = resp.googleMail != undefined;
                        //    if (resp.notices != undefined && resp.notices.length > 0) {
                        //        scope.noticeObj.notices = resp.notices;
                        //        $rootScope.newNoticeCount = resp.countUnreadNotice;
                        //        favicon.badge($rootScope.newNoticeCount);
                        //    }
                        //});
                    };
                    $rootScope.updateNoticesNav();
                    Person.getAllPersons(function(resp) {
                        scope.associativePerson = resp.object;
                        angular.forEach(scope.associativePerson, function(element, key) {
                            if (element.userId != undefined && resp.status == 'ok') {
                                check++;
                            }
                            scope.noticeObj.tariffPlanType = check > 1 ? "company" : "freelancer";
                            if (check > 1) {

                            }
                        })
                    });
                    function closePopUp() {
                        $("#notices").hide();
                        $("#notice_element_icon").css({"background-color": "rgba(0, 0, 0, 0)"});
                        $(document).off('mouseup');
                    }

                    scope.toUser = function() {
                        closePopUp();
                        $location.path('/users/' + $rootScope.me.userId);
                    };
                    scope.toCheckout = function() {
                        closePopUp();
                        $location.path('/pay');
                    };
                    scope.toListNotices = function() {
                        closePopUp();
                        $location.path('/notices');
                    };
                    scope.toAddEmail = function() {
                        closePopUp();
                        $location.path('/email-integration');
                    };
                    scope.checkEverythingRead = function(){
                        Notice.readAll(function(resp){
                            if(resp.status == 'ok'){
                                Notice.getMy(function(resp) {
                                    scope.sync.withGoogle = resp.googleMail != undefined;
                                    if (resp.object.notices != undefined && resp.object.notices.length > 0) {
                                        scope.noticeObj.notices = resp.object.notices;
                                        $rootScope.newNoticeCount = resp.object.countUnreadNotice;
                                        favicon.badge($rootScope.newNoticeCount);
                                    }
                                });
                            }
                        })
                    };
                    $rootScope.changeFaviconNumber = function(number){
                        $rootScope.newNoticeCount = number;
                        favicon.badge($rootScope.newNoticeCount);
                    };
                    scope.changeLanguage = function(key) {
                        $translate.use(key);
                        tmhDynamicLocale.set(key);
                        Person.setLang({lang: key});
                    };
                    scope.getPlugin = function() {
                        if (navigator.saysWho.indexOf("Chrome") != -1) {
                            $window.open("https://chrome.google.com/webstore/detail/recruiters-integration-to/ibfoabadoicmplbdpmchomcagkpmfama");
                        } else if (navigator.saysWho.indexOf("Firefox") != -1) {
                            //$window.open("https://addons.mozilla.org/firefox/addon/cleverstaff_extension");
                            $window.open("/extension/CleverstaffExtension4Firefox.xpi");
                        } else {
                            $("#bad-browser-modal").modal("show");
                        }
                    };
                    scope.getBrowser = function() {
                        if (navigator.saysWho.indexOf("Chrome") != -1) {
                            return "Chrome";
                        } else if (navigator.saysWho.indexOf("Firefox") != -1) {
                            return "Firefox";
                        } else {
                            return $filter("translate")("browser");
                        }
                    };
                    scope.isGoodBrowser = function() {
                        return scope.getBrowser() === "Chrome" || scope.getBrowser() === "Firefox";
                    };

                    navigator.saysWho = (function() {
                        var ua = navigator.userAgent, tem,
                            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
                        if (/trident/i.test(M[1])) {
                            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                            return 'IE ' + (tem[1] || '');
                        }
                        if (M[1] === 'Chrome') {
                            tem = ua.match(/\bOPR\/(\d+)/);
                            if (tem != null) return 'Opera ' + tem[1];
                        }
                        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
                        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
                        return M.join(' ');
                    })();

                    scope.extensionHas = false;
                    if ($rootScope.eventListenerPing) {
                        document.removeEventListener('cleverstaffExtensionPong', $rootScope.eventListenerPing);
                    }
                    $rootScope.eventListenerPing = function(event) {
                        console.log('extension has');
                        scope.extensionHas = true;
                        $rootScope.extensionHas = true;
                        Service.saveBrowserWithPlugin({browser: scope.getBrowser()});
                    };
                    document.addEventListener('cleverstaffExtensionPong', $rootScope.eventListenerPing);
                    document.dispatchEvent(new CustomEvent('cleverstaffExtensionPing'));

                }
            }
        }]
    ).directive('helpZip1', ["$window", "Candidate", "CacheCandidates", "$rootScope", "Person", "$location", "Service", "Notice", "$translate", "$filter", "tmhDynamicLocale","Vacancy",
        function($window, Candidate, CacheCandidates, $rootScope, Person,Vacancy, $location, Service, Notice, $translate, $filter, tmhDynamicLocale) {
            return {
                scope: {},
                restrict: 'AE',
                templateUrl: "partials/notices/helpWindowZip1.html",
                link: function(scope, element, attrs) {

                    //function closePopUp() {
                    //    $("#noticesQuestion").hide();
                    //    $("#agreedQuestion").css({"background-color": "rgba(0, 0, 0, 0)"})
                    //    $(document).off('mouseup');
                    //}
                }
            }
        }]
    ).directive('helpZip2', ["$window", "Candidate", "CacheCandidates", "$rootScope", "Person", "$location", "Service", "Notice", "$translate", "$filter", "tmhDynamicLocale","Vacancy",
        function($window, Candidate, CacheCandidates, $rootScope, Person,Vacancy, $location, Service, Notice, $translate, $filter, tmhDynamicLocale) {
            return {
                scope: {},
                restrict: 'AE',
                templateUrl: "partials/notices/helpWindowZip2.html",
                link: function(scope, element, attrs) {

                    //function closePopUp() {
                    //    $("#noticesQuestion").hide();
                    //    $("#agreedQuestion").css({"background-color": "rgba(0, 0, 0, 0)"})
                    //    $(document).off('mouseup');
                    //}
                }
            }
        }]
    ).directive('helpZip3', ["$window", "Candidate", "CacheCandidates", "$rootScope", "Person", "$location", "Service", "Notice", "$translate", "$filter", "tmhDynamicLocale","Vacancy",
        function($window, Candidate, CacheCandidates, $rootScope, Person,Vacancy, $location, Service, Notice, $translate, $filter, tmhDynamicLocale) {
            return {
                scope: {},
                restrict: 'AE',
                templateUrl: "partials/notices/helpWindowZip3.html",
                link: function(scope, element, attrs) {

                    //function closePopUp() {
                    //    $("#noticesQuestion").hide();
                    //    $("#agreedQuestion").css({"background-color": "rgba(0, 0, 0, 0)"})
                    //    $(document).off('mouseup');
                    //}
                }
            }
        }]
    ).directive('priview', ["$window", "Candidate", "CacheCandidates", "$rootScope","$location","$sce", function($window, Candidate, CacheCandidates, $rootScope, $location, $sce) {
            return {
                scope: {
                    candidate: '=',
                    pageid: "@"
                },
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var checkShow = false;
                    var isOpen = false;
                    element.click(function(event) {
                        if (!isOpen) {
                            $rootScope.loadingPriview = true;
                            timeToOPen(event);
                            setTimeout(function(){
                                $rootScope.loadingPriview = false;
                            },0)
                        }
                    });
                    element.mouseup(function() {
                        checkShow = false;
                        isOpen = false;
                    });
                    function setPosition() {
                        var pos = findPos(element.find('.text_change')[0]);
                        var preview_top = pos[0] + 5 - $('#candidate_preview').height() / 2;
                        var checkLessThenNull = false;
                        if (preview_top < 0) {
                            checkLessThenNull = true
                        }
                        $('#candidate_preview').css({
                            "top": !checkLessThenNull ? preview_top : "41px",
                            "left": pos[1] + 50
                        });
                        $('#arrow_preview').css({
                            "top": !checkLessThenNull ? $('#candidate_preview').height() / 2 - 57 : "50px",
                            "left": "-28px"
                        });
                        $('#' + scope.pageid).click(function() {
                            $('#candidate_preview').css({
                                "top": 0,
                                "left": 0
                            });
                            $('#candidate_preview').hide();
                            $('#vacancy').off('click');
                            $rootScope.candidatePreview = null;
                            isOpen = false;
                        });
                        //$("#candidate_preview").toggle('slide', {direction: 'left'}, 300);
                        $("#candidate_preview").css('display', 'block');
                        isOpen = true;
                    }
                    function timeToOPen(event) {
                        openCandidate(event);
                        if (!checkShow) {
                            checkShow = true;
                            setTimeout(function() {
                                if (checkShow && !isOpen) {
                                    if ($rootScope.candidatePreview) {
                                        $('#candidate_preview').hide();
                                        $rootScope.candidatePreview = null;
                                        $rootScope.previewHistory = null;
                                        $rootScope.$apply();
                                        setTimeout(function() {
                                            setPosition()
                                        }, 50)
                                    } else {
                                        setTimeout(function() {
                                            setPosition()
                                        }, 0);
                                    }
                                }
                            }, 100);
                        }
                    }

                    function findPos(obj) {
                        var obj2 = obj;
                        var curtop = 0;
                        var curleft = 0;
                        if (document.getElementById || document.all) {
                            do {
                                curleft += obj.offsetLeft - obj.scrollLeft;
                                curtop += obj.offsetTop - obj.scrollTop;
                                obj = obj.offsetParent;
                                obj2 = obj2.parentNode;
                                while (obj2 != obj) {
                                    curleft -= obj2.scrollLeft;
                                    curtop -= obj2.scrollTop;
                                    obj2 = obj2.parentNode;
                                }
                            } while (obj.offsetParent)
                        } else if (document.layers) {
                            curtop += obj.y;
                            curleft += obj.x;
                        }
                        return [curtop, curleft];
                    }

                    function open(resp) {
                        $rootScope.setDocCounter();
                        $(document).click(function(e) {
                            var container = $("#candidate_preview");
                            if (!container.is(e.target) && container.has(e.target).length === 0) {
                                container.hide();
                                $rootScope.candidatePreview = null;
                                $rootScope.previewHistory = null;
                                $rootScope.$apply();
                                $(document).unbind("click")
                            }
                        });
                    $rootScope.candidatePreview = resp;
                    $rootScope.candidatePreviewAdditional = !!(resp.contacts.length || resp.education || resp.languages.length || resp.employmentType || resp.readyRelocate);
                    $rootScope.previewHistory = resp.actions.objects ? resp.actions.objects : null;
                    $rootScope.lastCandidatePreview = resp.candidateId;
                    $rootScope.imgWidthPreviewFunc = function() {
                        var img = new Image();
                        img.onload = function () {
                            var width = this.width;
                            var height = this.height;
                            var minus = width - height;
                            if (minus < -200) {
                                $('#photo-preview').css({
                                    'width': '60%',
                                    'left': '0',
                                    'right': '0',
                                    'margin': '0px auto',
                                    'position': 'absolute'
                                });
                            } else if (width == height && (width < 700 && height < 700)) {
                                $('#photo-preview').css({
                                    'left': '0',
                                    'right': '0',
                                    'margin': '0px auto',
                                    'position': 'absolute'
                                });
                            } else if ((width <= height && width < 200) || (width >= height && minus > 30 && minus <= 100)) {
                                $('#photo-preview').css({
                                    'width': '76%',
                                    'left': '0',
                                    'right': '0',
                                    'margin': '0px auto',
                                    'position': 'absolute'
                                });
                            } else if ((width >= 300 && width <= 349) || width != height || width == height) {
                                $('#photo-preview').css({
                                    'object-fit': 'fill',
                                    'width': '76%',
                                    'left': '0',
                                    'right': '0',
                                    'margin': '0px auto',
                                    'position': 'absolute'
                                });
                            } else if (width == height) {
                                $('#photo-preview').css('width', '33%');
                            }
                        };
                        img.src = $location.$$protocol + '://' + $location.$$host + $rootScope.serverAddress + '/getapp?id=' + $rootScope.candidatePreview.photo + '&d=' + $rootScope.me.personId;
                    };
                        $rootScope.imgWidthPreviewFunc();
                        if (!$rootScope.candidatePreview.db && !$rootScope.candidatePreview.expirence && !$rootScope.candidatePreview.languages && !$rootScope.candidatePreview.employmentType && !$rootScope.candidatePreview.salary && !$rootScope.candidatePreview.contacts) {
                            $rootScope.previewInfoIsMissing = true;
                        }
                        if (!$rootScope.$$phase) {
                            $rootScope.$apply();
                        }
                    }

                    //$rootScope.hideCandidatePreviewModal = function() {
                    //    $('#candidate_preview').hide();
                    //};


                    function openCandidate(event) {
                        console.log(event.target);
                        console.log(event.target.getAttribute("file-to-preview"));
                        let fileId = event.target.getAttribute("file-to-preview");
                        $rootScope.previewInfoIsMissing = false;
                        Candidate.one({"localId": scope.candidate.localId}, function(resp) {
                            var array = [];
                            angular.forEach(resp.object.files,function(res){
                                initDocuments(res);
                                console.log(res);
                                if(res.showGDocs && ($(element).hasClass("preview-docs")) && fileId === res.fileId){
                                    resp.object.showDocument = true;
                                    res.linkFileForShow = "https://docs.google.com/viewer?embedded=true&url=http://" + $location.$$host + "/hr/showFile/" + res.fileId + "/" + encodeURI(res.fileName) + '?decache=' + Math.random();
                                    res.linkFileForShow = $sce.trustAsResourceUrl(res.linkFileForShow);
                                    array.push(res);
                                }
                            });
                            resp.object.files = array;
                            open(resp.object);
                            CacheCandidates.add(resp.object);
                        });
                    }
                }
            }
        }]
    ).directive('ngEnterSearch', function() {
            return function(scope, element, attrs) {
                element.bind("keypress", function(event) {
                    if (event.which === 13) {
                        scope.clickSearch();
                    }
                });
            }
        }
    )
    .directive('recommendation', function() {
            return {
                restrict: "EA",
                link: function(scope, element, attr) {
                    var buttonAdd = element.next(".recommendationAdd");
                    element.hover(function() {
                        var buttonAdd = element.next(".recommendationAdd");
                        buttonAdd.removeClass("blockDisplay");
                        var position = getPosition(buttonAdd[0]);
                        if (element[0].getAttribute("isOfset") == undefined) {
                            buttonAdd.offset({
                                top: (buttonAdd.offset().top - element[0].scrollHeight / 2) - 13,
                                left: (element[0].scrollWidth / 2) - 6
                            });
                            element[0].setAttribute("isOfset", "true");
                        }
                    });
                    element.mouseleave(function(event) {
                        var buttonAdd = element.next('.recommendationAdd');
                        buttonAdd.addClass("blockDisplay");
                    });
                }
            }
        }
    ).directive('recbutton', function() {
            return {
                restrict: "EA",
                link: function(scope, element, attr) {
                    element.hover(function() {
                        element.removeClass("blockDisplay");
                    });
                    element.mouseleave(function() {
                        element.addClass("blockDisplay");
                    })
                }
            }
        }
    )
    .directive('modalAddFile', ["$filter", function($filter) {
            return {
                restrict: "EA",
                templateUrl: "partials/modal/add-photo-candidate.html",
                link: function(scope, element, attr) {
                    scope.loader = true;
                    scope.modalAddPhoto = true;
                    scope.showErrorAddPhotoMessage = false;
                    if (attr.page == "candidate") {
                        scope.headerFile = $filter('translate')('You can select a photo on your computer');
                        scope.headerLink = $filter('translate')('Or provide a link to photos on the internet');
                    } else if (attr.page == "client") {
                        scope.headerFile = $filter('translate')('You can select a logo on your computer');
                        scope.headerLink = $filter('translate')('Or provide a link to logo on the internet');
                    }
                    scope.showModalAddPhoto = function(headerText) {
                        scope.modalAddPhotoHeaderText = $filter('translate')(headerText);
                        scope.modalAddPhoto = true;
                        element.children().addClass("active");
                        element.children().removeClass("hide");
                        element.children().children().addClass("active");
                    };
                    scope.hideModalAddPhoto = function() {
                        if (scope.modalAddPhoto) {
                            element.children().addClass("hide");
                            element.children().removeClass("active");
                            element.children().children().removeClass("active");
                            scope.modalAddPhoto = false;
                            scope.photoUrl = "";
                        }
                    };
                }
            }
        }]
    ).directive('statusColorNew', ["$filter", function($filter) {
            return {
                restrict: "EA",
                scope: {
                    old: "=",
                    new: "=",
                    icon: "=",
                    statusarr: "@"
                },
                link: function(scope, element) {
                    if(!scope.statusarr){
                        scope.statusarr = '';
                    }
                    if (scope.new) {
                        element.append(createSpanForInterviewStatusHistory(scope.statusarr,scope.old, $filter)+
                            "<i class='fa fa-angle-right' aria-hidden='true' style='color: black;padding-right: 6px;'></i>"
                            + createSpanForInterviewStatusHistory(scope.statusarr, scope.new, $filter))
                    } else {
                        scope.$watch("old", function() {
                            element.html(createSpanForInterviewStatusHistory(scope.statusarr, scope.old, $filter, true));
                            if (scope.icon) {
                                $(element).find("span").append('<i style="margin: 0px 0px 0px 5px;" class="caret small down icon"></i>');
                            }
                        });
                    }
                }
            }
        }]
    ).directive('statusColorDiv', ["$filter", function($filter) {
            return {
                restrict: "EA",
                scope: {
                    old: "="
                },
                link: function(scope, element) {
                    element.html(createDivForInterviewStatusHistory(scope.old, $filter));
                }
            }
        }]
    ).directive('statusColor', ["$filter", function($filter) {
            return {
                restrict: "EA",
                scope: {
                    old: "=",
                    new: "="
                },
                link: function(scope, element) {
                    scope.one = true;
                    var retText;
                    var span;

                    function translate(value) {
                        return $filter('translate')(value);
                    }

                    function name(status, scope) {
                        var checkLast = false;
                        var span = "<span style='border-radius: 5px;padding-left: 4px;padding-right: 4px;color:white;background-color:";
                        if (status === 'longlist') {
                            span = span + "#9eacc3'>" + translate("long_list") + "</span>"
                        } else if (status === 'shortlist') {
                            span = span + "#b5c3da;'>" + translate("short_list") + "</span>"
                        } else if (status === 'interview') {
                            span = span + "#f09c99'>" + translate("interview") + "</span>"
                        } else if (status === 'notafit') {
                            span = span + "#71a6b1'>" + translate("not_a_fit") + "</span>"
                        } else if (status === 'approved') {
                            span = span + "#b5d6a8'>" + translate("approved") + "</span>"
                        } else if (status === 'declinedoffer') {
                            span = span + "#d9a9bf'>" + translate("declined_offer") + "</span>"
                        } else {
                            span = span + "#9B4F9B'>";
                            if (scope.old === 'not_searching') {
                                span = span + translate(scope.old);
                            } else if (scope.old === 'passive_search') {
                                span = span + translate(scope.old);
                            } else if (scope.old === 'active_search') {
                                span = span + translate(scope.old);
                            } else if (scope.old === 'employed') {
                                span = span + translate(scope.old);
                            } else {
                                span = span + translate(scope.old);
                            }
                            span = span + "</span>" + "<i class='right icon' style='color: black;padding-right: 6px;'></i>" + "<span style='border-radius: 5px;padding-left: 4px;padding-right: 4px;color:white;background-color:#E45454'>";
                            if (scope.new === 'not_searching') {
                                span = span + translate(scope.new);
                            } else if (scope.new === 'passive_search') {
                                span = span + translate(scope.new);
                            } else if (scope.new === 'active_search') {
                                span = span + translate(scope.new);
                            } else if (scope.new === 'employed') {
                                span = span + translate(scope.new);
                            } else {
                                span = span + translate(scope.new)
                            }
                            span = span + "</span>";
                            checkLast = true;
                        }
                        if (!checkLast)
                            scope.one = false;
                        return span;
                    }

                    if (scope.new == undefined || scope.one) {
                        span = "<span style='border-radius: 5px;padding-left: 4px;padding-right: 4px;color:white;background-color:";
                        retText = name(scope.old, scope);
                    }
                    if (scope.new != undefined && !scope.one) {
                        retText = "<span style='border-radius: 5px;padding-left: 4px;padding-right: 4px;color:white;background-color:";
                        retText = name(scope.old, scope) + "<i class='right icon' style='color: black;padding-right: 6px;'></i>" + name(scope.new, scope);
                    }
                    element.append(retText);
                }
            }
        }]
    )
    //    .directive('popoverClose', function($timeout){
    //        console.log('1');
    //    return{
    //        scope: {
    //            excludeClass: '@'
    //        },
    //        link: function(scope, element, attrs) {
    //            console.log('2');
    //            var trigger = document.getElementsByClassName('trigger');
    //            console.log(trigger);
    //            function closeTrigger(i) {
    //                $timeout(function(){
    //                    console.log(i);
    //                    $('.popover').css({display: 'none'});
    //                    //angular.element(trigger[0]).triggerHandler('click').removeClass('trigger');
    //                    console.log(angular.element);
    //                });
    //            }
    //
    //            element.on('click', function(event){
    //                console.log('5');
    //                $('.popover').hide({display: 'none!important'}, 0);
    //            });
    //        }
    //    };
    //}).directive('popoverElem', function(){
    //    return{
    //        link: function(scope, element, attrs) {
    //            element.on('click', function(){
    //                element.addClass('trigger');
    //            });
    //            console.log('qwerty');
    //        }
    //    };
    //})
    .directive('highlights', ["$location", function($location) {
            return {
                restrict: 'EA',
                scope: {
                    hgobject: "=",
                    hgtablecollspan: "@",
                    hglocationOfOneObject: "="
                },
                link: function(scope, element) {
                    if (scope.hgobject === undefined) {
                        return;
                    }
                    if (scope.hgobject.highlights !== undefined && scope.hgobject.highlights.length > 0) {
                        var reg = /<highlight>|<\/highlight>/g;
                        var withoutHighlitedString = scope.hgobject.highlights[0].replace(reg, '');
                        if(withoutHighlitedString == scope.hgobject.position){
                            scope.hgobject.position = scope.hgobject.highlights[0];
                        }else if(withoutHighlitedString == scope.hgobject.fullName){
                            scope.hgobject.fullName = scope.hgobject.highlights[0];
                        }else{
                            $("<tr><td style='padding-left: 4%;' colspan='" + scope.hgtablecollspan + 1 + "'>" + scope.hgobject.highlights + "</td></tr>").insertAfter(element).on('click', function() {
                                $location.path(scope.hglocationOfOneObject + scope.hgobject.localId);
                                scope.$apply();
                            });
                        }
                    }
                    if (scope.hgobject.files !== undefined) {
                        angular.forEach(scope.hgobject.files, function(value) {
                            angular.forEach(value.highlights, function(highlight) {
                                $("<tr><td style='padding-left: 4%;' title='" + value.fileName + "' colspan='" + scope.hgtablecollspan + "'>" + "<i style='padding-right: 10px' class='fa fa-paperclip'></i>" + highlight + "</td></tr>").insertAfter(element).on('click', function() {
                                    $location.path(scope.hglocationOfOneObject + scope.hgobject.localId);
                                    scope.$apply();
                                });
                            });
                        });
                    }
                }
            };
        }]
    ).directive('ngContacts', function() {
            return function(scope, element, attrs) {
                var contact = scope.contact.contacts;
                if (contact == undefined)
                    return;
                var phone = "";
                var skype = "";
                var email = "";
                angular.forEach(contact, function(val) {
                    if (angular.equals(val.type, "mphone")) {
                        phone = val.value
                    }
                    if (angular.equals(val.type, "email")) {
                        email = '<a href="mailto:' + val.value + '" class="ng-binding">' + val.value + '</a>';
                    }
                    if (angular.equals(val.type, "skype")) {
                        skype = val.value;
                    }
                });
                element.append('<span>' + email + " " + phone + " " + skype + '</span>')

            }
        }
    ).directive("tofullinformation", ["$location", "$window", "frontMode", function($location, $window, frontMode) {
            return {
                restrict: 'EA',
                link: function(scope, element, atrr) {
                    var page = frontMode == "war" ? "/!#/" : "/!#/";
                    ///home.html#/ /hdemo.html#/
                    $(element.find('.clickable')).mousedown(function(e) {
                        switch (e.which) {
                            case 1:
                                $location.path(atrr.tofullinformation);
                                scope.$apply();
                                break;
                            case 2:
                                $window.open($location.$$protocol + "://" + $location.$$host + page + atrr.tofullinformation);
                                break;
                        }
                    })
                }
            }
        }]
    ).directive('checkbox', function() {
            return {
                restrict: 'EAC',
                link: function(scope, element) {
                    element.checkbox();
                }
            };
        }
    ).directive('ngSelectColor', function() {
            return {
                restrict: 'EA',
                link: function(scope, element) {
                    if (element.find(":selected")) {
                        $(element).css("color", "#999");
                    } else {
                        $(element).css("color", "black");
                    }
                    element.on('change', function() {
                        $.each(element.children(), function() {
                            if (!$(this).is(element.find(":first"))) {
                                $(this).css("color", "black");
                            }
                        });
                        if (element.find(":selected").is(element.find(":first"))) {
                            $(this).css("color", "#999");
                        } else {
                            $(this).css("color", "black");
                        }
                    });
                }
            };
        }
    ).directive('isNumber', function() {
            return {
                require: 'ngModel',
                scope: {
                    model: "="
                },
                link: function(scope) {

                    scope.$watch('model', function(newValue, oldValue) {
                        var arr = String(newValue).split("");
                        if (arr.length === 0)
                            return;
                        if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.'))
                            return;
                        if (arr.length === 2 && newValue === '-.')
                            return;
                        if (isNaN(newValue)) {
                            scope.model = oldValue;
                        }
                    });
                }
            };
        }
    ).directive('optionsClass', ["$parse", function($parse) {
            return {
                require: 'select',
                link: function(scope, elem, attrs, ngSelect) {
                    var optionsSourceStr = attrs.ngOptions.split(' ').pop(),
                        getOptionsClass = $parse(attrs.optionsClass);

                    scope.$watch(optionsSourceStr, function(items) {
                        angular.forEach(items, function(item, index) {
                            var classes = getOptionsClass(item),
                                option = elem.find('option[value=' + index + ']');
                            angular.forEach(classes, function(add, className) {
                                if (add) {
                                    angular.element(option).addClass(className);
                                }
                            });
                        });
                    });
                }
            };
        }]
    ).directive('googleplace', function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attrs, model) {
                    var options = {
                        types: ['(regions)']
                    };
                    var gPlace = new google.maps.places.Autocomplete(element[0], options);
                    google.maps.event.addListener(gPlace, 'place_changed', function(val) {
                        var place = gPlace.getPlace();
                        if (place) {
                            place.formatted_address = $('#pac-input').val();
                            var fullNameAr = place.formatted_address.split(',');

                            if (similar_text(fullNameAr[1], fullNameAr[0]) == fullNameAr[0].length || (similar_text(fullNameAr[0], fullNameAr[1]) / fullNameAr[0].length) * 100 > 80) {
                                place.formatted_address = fullNameAr[0] + "," + fullNameAr[2];
                            }
                            var lat = place.geometry.location.k;
                            var lng = place.geometry.location.D;
                            if (scope.mapObject != null) {
                                var location = new google.maps.LatLng(lat, lng);
                                scope.mapObject.marker.setPosition(location);
                                scope.mapObject.map.setCenter(location);
                            }
                            scope.$apply(function() {
                                scope.region = convertToRegionObject(place, scope);
                                if (scope.region != undefined && scope.region.country == null) {
                                    scope.region.country = scope.region.city != null ? scope.region.city : scope.region.area != null ? scope.region.area : " ";
                                    if (scope.region.fullName != undefined) {
                                        scope.region.fullName = scope.region.fullName.replace(",undefined", "");
                                    }
                                }
                                model.$setViewValue(place.formatted_address);
                            });
                            if (scope.progressUpdate != undefined) {
                                scope.progressUpdate();
                            }

                        } else {
                            scope.regionInputOk = false;
                            scope.region = null;
                        }
                    });
                }
            };
        }
    ).directive('googleplacerelocate', function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attrs, model) {
                    var options = {
                        types: ['(regions)']
                    };
                    var gPlace = new google.maps.places.Autocomplete(element[0], options);
                    google.maps.event.addListener(gPlace, 'place_changed', function(val) {
                        var place = gPlace.getPlace();
                        place.formatted_address = $('#pac-input2').val();
                        var fullNameAr = place.formatted_address.split(',');
                        if (similar_text(fullNameAr[1], fullNameAr[0]) == fullNameAr[0].length || (similar_text(fullNameAr[0], fullNameAr[1]) / fullNameAr[0].length) * 100 > 80) {
                            place.formatted_address = fullNameAr[0] + "," + fullNameAr[2];
                        }
                        scope.$apply(function() {
                            scope.regionToRelocate.push(convertToRegionObject(place, scope));
                            model.$setViewValue("");
                            $('#pac-input2').val("");
                        });
                    });
                }
            };
        }
    ).directive('googleplacezip', function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attrs, model) {
                    var options = {
                        types: ['(regions)']
                    };
                    var gPlace = new google.maps.places.Autocomplete(element[0], options);
                    google.maps.event.addListener(gPlace, 'place_changed', function(val) {
                        var place = gPlace.getPlace();
                        if(place.address_components) {
                            place.formatted_address = $('#pac-input3').val();
                            var fullNameAr = place.formatted_address.split(',');
                            if (similar_text(fullNameAr[1], fullNameAr[0]) == fullNameAr[0].length || (similar_text(fullNameAr[0], fullNameAr[1]) / fullNameAr[0].length) * 100 > 80) {
                                place.formatted_address = fullNameAr[2];
                            }
                            scope.$apply(function () {
                                scope.regionzip.push(convertToRegionObject(place, scope));
                                model.$setViewValue("");
                                $('#pac-input3').val("");
                                console.log(scope.regionzip);
                            });
                        }
                    });
                }
            };
        }
    ).directive('googlePlaces', function() {
            return {
                restrict: 'E',
                replace: true,
                scope: {location: '='},
                template: '<input id="google_places_ac" name="google_places_ac" type="text" class="input-block-level"/>',
                link: function($scope, elm, attrs) {
                    var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac")[0], {});
                    google.maps.event.addListener(autocomplete, 'place_changed', function() {
                        var place = autocomplete.getPlace();
                        $scope.location = place.geometry.location.lat() + ',' + place.geometry.location.lng();
                        $scope.$apply();
                    });
                }
            }
        }
    ).directive('vacancyAutocompleter', ["$filter", "serverAddress", "$rootScope", "Vacancy", function($filter, serverAddress, $rootScope, Vacancy) {
            return {
                restrict: 'EA',
                replace: true,
                link: function($scope, element, attrs) {
                    $(element[0]).select2({
                        placeholder: $filter('translate')('enter job title'),
                        minimumInputLength: 0,
                        ajax: {
                            url: serverAddress + "/vacancy/autocompleter",
                            dataType: 'json',
                            crossDomain: true,
                            type: "POST",
                            data: function(term, page) {
                                return {
                                    name: term.trim(),
                                    candidateId: $rootScope.candidateIdForVacancyId
                                };
                            },
                            results: function(data, page) {
                                console.log(data);
                                var results = [];
                                if (data['objects'] !== undefined) {
                                    $.each(data['objects'], function(index, item) {
                                        var clientName = "";
                                        if (item.clientId.name.length > 20) {
                                            clientName = item.clientId.name.substring(0, 20);
                                        } else {
                                            clientName = item.clientId.name;
                                        }
                                        var inVacancy = false;
                                        var interviewStatus;
                                        if (item.interviewStatus == undefined) {
                                            item.interviewStatus = 'longlist,shortlist,interview,approved,notafit,declinedoffer';
                                        }
                                        var extraText = "";
                                        if (item.interviews != null) {
                                            interviewStatus = item.interviews[0].state;
                                            angular.forEach($rootScope.customStages, function(resp){
                                                if(interviewStatus == resp.customInterviewStateId){
                                                    interviewStatus = resp.name
                                                }
                                            });
                                            extraText = " [ " + $filter('translate')(interviewStatus) + " ]";
                                            inVacancy = true;
                                        }
                                        results.push({
                                            vacancy: item,
                                            id: item.vacancyId,
                                            status: interviewStatus,
                                            text: item.position + " (" + clientName + ")" + extraText,
                                            interviewStatus: item.interviewStatus,
                                            inVacancy: inVacancy
                                        });
                                    });
                                }
                                return {
                                    results: results
                                };
                            }
                        },
                        dropdownCssClass: "bigdrop"
                    }).on("change", function(e) {
                        if (e.added != undefined && e.added.inVacancy){
                            $rootScope.addCandidateInVacancySelect2Obj = {
                                status: e.added.status
                            };
                            $rootScope.candidateAddedInVacancy = true;
                        }else{
                            $rootScope.candidateAddedInVacancy = false;
                        }
                        $rootScope.VacancyAddedInCandidate = e.added.vacancy;
                        var sortedStages = [];
                        var array = e.added.interviewStatus.split(',');
                        var VacancyStatus = Vacancy.interviewStatusNew();
                        var candidate = $rootScope.candidateForUpdateResume;
                        $rootScope.vacancyForAddCandidate = e.added.vacancy.localId;
                        var i = 0;
                        console.log(candidate);
                        if(candidate){
                            angular.forEach(candidate.interviews, function(resp) {
                                if(e.added.id == resp.vacancy){
                                    angular.forEach(array, function(res) {
                                        if(resp.state == res || resp.customInterviewStateId == res){
                                            array.splice(array.indexOf(res), 1);
                                        }
                                    });
                                }
                            });
                        }
                        angular.forEach(array, function(resp) {
                            angular.forEach(VacancyStatus, function(vStatus) {
                                if (vStatus.used) {
                                    if(i == 0){
                                        angular.forEach($rootScope.customStages, function(res) {
                                            res.value = res.name;
                                            res.movable = true;
                                            res.added = false;
                                            res.count = 0;
                                            vStatus.status.push(res);
                                            i = i+1;
                                        });
                                    }
                                    angular.forEach(vStatus.status, function(vStatusIn) {
                                        if(resp == vStatusIn.value){
                                            vStatusIn.added = true;
                                            sortedStages.push(vStatusIn);
                                        } else if(resp == vStatusIn.customInterviewStateId){
                                            vStatusIn.added = true;
                                            sortedStages.push(vStatusIn);
                                        }
                                    })
                                }
                            })
                        });
                        $rootScope.VacancyStatusFiltered = sortedStages;
                        if(candidate){
                            $rootScope.changeTemplateInAddCandidate($rootScope.VacancyStatusFiltered[0]);
                        }
                        $scope.$apply();
                    })
                }
            }
        }]
    ).directive('candidateAutocompleter', ["$filter", "serverAddress", "$rootScope","vacancyStages", function($filter, serverAddress, $rootScope, vacancyStages) {
        return {
            restrict: 'EA',
            replace: true,
            link: function($scope, element, attrs) {
                if ($(element[0])) {
                    element.select2({
                        placeholder: $filter('translate')('select candidate'),
                        minimumInputLength: 0,
                        ajax: {
                            url: serverAddress + "/candidate/autocompleate",
                            dataType: 'json',
                            crossDomain: true,
                            type: "POST",
                            data: function(term, page) {
                                return {
                                    name: term.trim(),
                                    vacancyId: $scope.vacancy.vacancyId,
                                    withPersonalContacts: true
                                };
                            },
                            results: function(data, page) {
                                var customStages = [];
                                var results = [];
                                var check = $scope.$parent.autocomplete.interviews != undefined;
                                var inVacancy = false;
                                var status = "";
                                var realName = "";
                                var text;
                                if (data['objects'] !== undefined) {
                                    angular.forEach(data['objects'], function(item) {
                                        //inVacancy = false;
                                        //if (item.position !== undefined || item.position !== '') {
                                        //    item.fullName = item.fullName + ', ' + item.position;
                                        //}
                                        if(item.interviews){
                                            angular.forEach($rootScope.customStages,function(customStage){
                                                if(customStage.customInterviewStateId == item.interviews[0].state){
                                                    item.interviews[0].state = customStage.name;
                                                }
                                            });
                                        }
                                        //if (check) {
                                        //    angular.forEach($scope.$parent.autocomplete.interviews, function(interItem) {
                                        //        if (interItem.candidateId.candidateId == item.candidateId) {
                                        //            realName = item.fullName;
                                        //            if(interItem.customStage){
                                        //                item.fullName = item.fullName + " [ "+ interItem.state + " ]";
                                        //            }else{
                                        //                item.fullName = item.fullName + " [ " + $filter('translate')('interview_status_assoc.' + interItem.state) + " ]";
                                        //            }
                                        //            inVacancy = true;
                                        //            status = interItem.state;
                                        //        }
                                        //    })
                                        //}
                                        results.push({
                                            id: item.candidateId,
                                            text: item.interviews ? item.fullName + " [" + $filter('translate')(item.interviews[0].state) + "]": item.fullName,
                                            inVacancy: inVacancy,
                                            status: status,
                                            name: realName
                                        });
                                    });
                                }
                                return {
                                    results: results
                                };
                            }
                        },
                        dropdownCssClass: "bigdrop"
                    }).on("change", function(e) {
                        if (!$rootScope.withoutChangeStatusInVacancyAutocopleater) {
                            if (e.added != undefined && e.added.inVacancy) {
                                $rootScope.addCandidateInInterview.addedInVacancy = true;
                                $rootScope.addCandidateInInterview.select2Obj = {
                                    name: e.added.name,
                                    status: e.added.status
                                };
                                if (e.added.status == "interview") {
                                    $rootScope.addCandidateInInterview.status = $rootScope.addCandidateInInterview.statusObject[0]
                                } else if (e.added.status == 'longlist') {
                                    $rootScope.addCandidateInInterview.status = $rootScope.addCandidateInInterview.statusObject[1]
                                } else {
                                    $rootScope.addCandidateInInterview.status = $rootScope.addCandidateInInterview.statusObject[0]
                                }
                            } else {
                                $rootScope.errorMessageForAddCandidate.show = false;
                                $rootScope.addCandidateInInterview.addedInVacancy = false;
                                $rootScope.addCandidateInInterview.select2Obj = null;
                                $rootScope.addCandidateInInterview.status = $rootScope.addCandidateInInterview.statusObject[0]
                            }
                            $rootScope.addCandidateInInterview.showSelect = true;
                            $rootScope.$apply();
                        }
                    })
                }
            }
        }
    }]).directive('testCandidateAutocompleter', ["$filter", "serverAddress", "$rootScope", "$localStorage", function($filter, serverAddress, $rootScope, $localStorage) {
        return {
            restrict: 'EA',
            replace: true,
            link: function($scope, element, attrs) {
                function formData (data) {
                    markup = "<span style='font-weight: 600;color: #ccc'>" + data.fullName + ", " + "</span>" + "<span style='color: #ccc'>" + data.position  + "</span>";
                    return markup;
                }
                $scope.groupNameList = [];
                $(element[0]).select2({
                    placeholder: $filter('translate')('select candidate'),
                    tags: $scope.groupNameList,
                    tokenSeparators: [","],
                    ajax: {
                        url: serverAddress + "/candidate/autocompleate",
                        dataType: 'json',
                        crossDomain: true,
                        type: "POST",
                        data: function(term, page) {
                            return {
                                name: term.trim(),
                                withPersonalContacts: true
                            };
                        },
                        results: function(data, page) {
                            var results = [];
                            if (data['objects'] !== undefined) {
                                angular.forEach(data['objects'], function(item) {
                                    if(item.contacts != undefined) {
                                        var contacts = item.contacts;
                                        if(contacts[0].value.length > 0 && (contacts[0].value).search(/ /) !== -1) {
                                            contacts[0].value = (contacts[0].value).split(/ /)[0];
                                        }
                                        results.push({
                                            id: item.candidateId,
                                            text: item.fullName + ', ' + item.position,
                                            fullName: item.fullName,
                                            position: item.position,
                                            localId: item.localId,
                                            email: contacts
                                        });
                                    }
                                });
                            }
                            return {
                                results: results
                            };
                        }
                    },
                    formatResult: formData,
                    dropdownCssClass: "bigdrop"
                }).on("change", function(e) {
                    $scope.groupNameList.push(e.added);
                    console.log($scope.groupNameList);
                    $rootScope.$broadcast('groupNameList', $scope.groupNameList);
                    if (e.removed) {
                        angular.forEach($scope.groupNameList, function(nval) {
                            if(e.removed.id == nval.id){
                                var deleteFromArray = $scope.groupNameList.indexOf(nval);
                                if (deleteFromArray > -1) {
                                    $scope.groupNameList.splice(deleteFromArray, 1);
                                }
                                for (var i = $scope.groupNameList.length - 1; i >= 0; i--) {
                                    if ($scope.groupNameList[i] == undefined)  {
                                        $scope.groupNameList.splice(i, 1);
                                    }
                                }
                                $rootScope.$broadcast('groupNameList', $scope.groupNameList);
                                return $scope.groupNameList;
                            }
                        });
                    }
                    $rootScope.$apply();
                });
            }
        }
    }]).directive('mergeAutocompleter', ["$filter", "serverAddress", "$rootScope", "$localStorage", function($filter, serverAddress, $rootScope, $localStorage) {
        return {
            restrict: 'EA',
            replace: true,
            link: function($scope, element, attrs) {
                if ($(element[0])) {
                    element.select2({
                        placeholder: $filter('translate')('select candidate'),
                        minimumInputLength: 0,
                        ajax: {
                            url: serverAddress + "/candidate/autocompleate",
                            dataType: 'json',
                            crossDomain: true,
                            type: "POST",
                            data: function(term, page) {
                                return {
                                    name: term.trim(),
                                };
                            },
                            results: function(data, page) {
                                var results = [];
                                if (data['objects'] !== undefined) {
                                    angular.forEach(data['objects'], function(item) {
                                        if(item.localId != $rootScope.localIdOfMerged) {
                                            results.push({
                                                id: item.candidateId,
                                                text: item.fullName + ', ' + item.position,
                                                fullName: item.fullName,
                                                position: item.position,
                                                localId: item.localId
                                            });
                                        }
                                    });
                                }
                                return {
                                    results: results
                                };
                            }
                        },
                        dropdownCssClass: "bigdrop"
                    }).on("change", function(e) {
                        $rootScope.candidateForMerge = e.added;
                        $localStorage.set("candidateForMerge", $rootScope.candidateForMerge);
                        console.log($rootScope.candidateForMerge);
                        $rootScope.$apply();
                    })
                }
            }
        }
    }]).directive('clientAutocompleter', ["$filter", "serverAddress", "$rootScope","vacancyStages", "$translate", function($filter, serverAddress, $rootScope, vacancyStages, $translate) {
        return {
            restrict: 'EA',
            replace: true,
            link: function($scope, element, attrs) {
                $scope.setClientAutocompleterValue = function(val,id) { //переимновтаь
                    console.log(val);
                    if (val != undefined) {
                        $(element[0]).select2("data", {id: id, text: val});
                    }
                };
                let translatedPositions = false;

                $rootScope.$on('$translateChangeSuccess', function () {
                    initSelect2();
                });

                if(!translatedPositions) {
                    initSelect2();
                }
                function initSelect2() {
                    translatedPositions = true;
                    if ($(element[0])) {
                        element.select2({
                            placeholder: $translate.instant('client'),
                            minimumInputLength: 0,
                            allowClear: true,
                            ajax: {
                                url: serverAddress + "/client/autocompleteClients",
                                dataType: 'json',
                                crossDomain: true,
                                type: "POST",
                                data: function(term, page) {
                                    return {
                                        text: term.trim()
                                    };
                                },
                                results: function(data, page) {
                                    var results = [];
                                    var inVacancy = false;
                                    var status = "";
                                    var realName = "";
                                    if (data['objects'] !== undefined) {
                                        console.log(data['objects']);
                                        angular.forEach(data['objects'], function(item) {
                                            results.push({
                                                id: item.clientId,
                                                text: item.name,
                                                name: item.name
                                            });
                                        });
                                    }
                                    return {
                                        results: results
                                    };
                                }
                            },
                            dropdownCssClass: "bigdrop"
                        }).on("change", function(e) {

                        }).on("select2-opening", function(e){
                            setTimeout(function () {
                                $('#select2-drop .select2-results .select2-searching')[0].innerText = $filter("translate")("Searching");
                            }, 0);
                        })
                    }
                }
            }
        }
    }])
    .directive('industryAutocomplete', ["$filter", "$rootScope", "$translate", "Service", function($filter, $rootScope, $translate, Service) {
        return {
            restrict: 'EA',
            replace: true,
            link: function($scope, element) {

                let industries = Service.getIndustries(),
                    translatedIndustries = [];

                $rootScope.$on('$translateChangeSuccess', function () {
                    initSelect2();
                });
                if(translatedIndustries.length == 0) {
                    initSelect2();
                }

                function initSelect2 (){
                    translatedIndustries = industries.map(function (oneIndustry) {
                        return {
                            id: oneIndustry.value,
                            text: $translate.instant( 'industries_assoc.' + oneIndustry.value)
                        }
                    });
                    translatedIndustries = _.sortBy(translatedIndustries, 'text');
                    element.select2({
                        minimumInputLength: 0,
                        placeholder: ' ',
                        allowClear: true,
                        data: translatedIndustries,
                        dropdownCssClass: "bigdrop"
                    }).unbind("change").on("change", function(e) {

                        if(e.added) {
                            if($scope.candidate) {
                                $scope.candidate.industry = e.added.id;
                                $scope.progressUpdate();
                            } else {
                                if($scope.client) {
                                    $scope.client.industry = e.added.id;
                                }
                            }
                        } else {
                            if($scope.candidate) {
                                $scope.candidate.industry = '';
                            } else {
                                if($scope.client) {
                                    $scope.client.industry = '';
                                }
                            }

                        }
                    })
                }
                $scope.getSelect2Industry = function() {
                    var val = $(element[0]).select2('val');
                    return val != null ? val.toString() : null;
                };
                $scope.setSelect2Industry = function(val) {
                    if (val != undefined) {
                        $(element[0]).select2('val', val);
                    }

                };
            }
        }
    }])
    .directive('industryAutocompleteSearch', ["$filter", "$rootScope", "$translate", "Service", function($filter, $rootScope, $translate, Service) {
        return {
            restrict: 'EA',
            replace: true,
            link: function($scope, element) {

                let industries = Service.getIndustries(),
                    translatedIndustries = [];

                $rootScope.$on('$translateChangeSuccess', function () {
                    initSelect2();
                });
                if(translatedIndustries.length == 0) {
                    initSelect2();
                }

                function initSelect2 (){
                    translatedIndustries = industries.map(function (oneIndustry) {
                        return {
                            id: oneIndustry.value,
                            text: $translate.instant( 'industries_assoc.' + oneIndustry.value)
                        }
                    });
                    translatedIndustries = _.sortBy(translatedIndustries, 'text');
                    element.select2({
                        minimumInputLength: 0,
                        placeholder: $translate.instant('industry'),
                        allowClear: true,
                        data: translatedIndustries,
                        dropdownCssClass: "bigdrop"
                    }).unbind("change").on("change", function(e) {

                        if(e.added) {
                            if($scope.searchParam) {
                                $scope.searchParam.industry = e.added.id
                            }
                        } else {
                            if($scope.closeSearchTags) {
                                $scope.closeSearchTags('industry')
                            } else if($scope.searchParam['industry']) {
                                $scope.searchParam['industry'] = null;
                            }
                        }
                    })
                }
                $scope.getSelect2Industry = function() {
                    var val = $(element[0]).select2('val');
                    return val != null ? val.toString() : null;
                };
                $scope.setSelect2Industry = function(val) {
                    if (val != undefined) {
                        $(element[0]).select2('val', val);
                    }

                };
            }
        }
    }])
    .directive('addLogo', ["$rootScope", "Company", "notificationService", "$filter", function ($rootScope, Company, notificationService, $filter) {
        return {
            restrict: 'AE',
            link: function ($scope, elem, attr, ctrl) {

                elem.on('click', function () {
                    if ($rootScope.me.recrutRole == 'admin') {
                        $("#the-file-input").click();
                    } else {
                        notificationService.error($filter('translate')('Only admin can set logo'));
                    }
                });

                var Cropper = window.Cropper;

                $("#the-file-input").unbind('change').change(function() {
                    renderImage(this.files[0]);
                });

                renderImage = function (file) {
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var the_url = event.target.result;
                        var logoImg = new Image();
                        logoImg.src = the_url;
                        logoImg.onload = function () {
                            $('#logo-button').hide();
                            if(logoImg.width > 290 && logoImg.height > 290){
                                if($("#cropper-wrap").length == 0) {
                                    $("#owner_photo_wrap").prepend('<div id="cropper-wrap"> <div id="img-wrapper"> </div> <button id="close">' + $filter("translate")("Close") + '</button> <button id="cropp">' + $filter("translate")("Accept_1") + '</button> <div id="wrapper"></div>  </div> <div id="wrapperForPng"></div>');
                                    $("#owner_photo_wrap").find('img').hide();
                                    $("#owner_photo_bubble_wrap").hide();
                                    $('#wrapperForPng').hide();
                                }
                                $('#img-wrapper').html("<img id='image' src='" + the_url + "'>");
                                cropperFunc();
                            } else if(logoImg.width == 290 && logoImg.height == 290){
                                Company.uploadCompanyLogo(the_url).then(function (data) {
                                    $scope.callbackAddLogo(data.data.objects[0]);
                                    $('#logo-button').show();
                                }, function (error) {
                                    notificationService.error(error.data.message);
                                    $('#logo-button').show();
                                });
                            } else {
                                $('#logo-button').show();
                                notificationService.error($filter('translate')('Please choose image 290 x 290 px or larger'));
                            }
                        }

                    };
                    reader.readAsDataURL(file);
                };

                function cropperFunc() {
                    var image = document.getElementById('image');
                    var cropper = new Cropper(image, {
                        aspectRatio: 1 / 1,
                        movable: false,
                        zoomable: false,
                    });

                    $('#cropp').on('click',function () {
                        var canvasImg = image.cropper.getCroppedCanvas();
                        var ctx = canvasImg.getContext('2d');

                        var canvasCopy = document.createElement("canvas");
                        var copyContext = canvasCopy.getContext("2d");
                        canvasCopy.width = 290;
                        canvasCopy.height = 290;
                        copyContext.drawImage(canvasImg, 0, 0, 290, 290);
                        canvasImg.width = 290;
                        canvasImg.height = 290;
                        ctx.drawImage(canvasCopy, 0, 0, canvasImg.width, canvasImg.height,  0, 0,  canvasCopy.width, canvasCopy.height);
                        $scope.dataUrl = canvasImg.toDataURL();
                        $('#wrapperForPng').show();
                        $('#wrapperForPng').html("<img  src='" + $scope.dataUrl + "' > <button id='cancel'>" + $filter('translate')('cancel') + "</button><button id='download'>" + $filter('translate')('save') + "</button>");
                        $('#cropper-wrap').hide();
                        $('#cancel').on('click', function () {
                            $('#cropper-wrap').show();
                            $('#wrapperForPng').find('img').remove();
                            $('#cancel').remove();
                            $('#download').remove();
                        });
                        $('#download').on('click', function () {
                            Company.uploadCompanyLogo($scope.dataUrl).then(function (data) {
                                $scope.callbackAddLogo(data.data.objects[0]);
                                $('#company-logo').show();
                                cropper.destroy();
                                $('#cropper-wrap').remove();
                                $('#wrapperForPng').remove();
                                $("#the-file-input").val('');
                                $("#owner_photo_wrap").find('img').show();
                                $("#owner_photo_bubble_wrap").show();
                                $(".block-company .img-section img").prop('href','$rootScope.logoLink');
                                $('#logo-button').show();
                            }, function (error) {
                                notificationService.error(error.data.message);
                            });

                        });
                    });
                    $('#close').on('click', function () {
                        cropper.destroy();
                        $('#cropper-wrap').remove();
                        $('#wrapperForPng').remove();
                        $("#the-file-input").val('');
                        $("#owner_photo_wrap").find('img').show();
                        $("#owner_photo_bubble_wrap").show();
                        if($rootScope.companyLogo == undefined) {
                            $("#logo-button").show();
                        }
                    });
                }
            }
        }
    }])
    .directive('addLogoTestCandidateQuestion', ["$rootScope", "Test", "notificationService", "$filter", function ($rootScope, Test, notificationService, $filter) {
        return {
            restrict: 'AE',
            link: function ($scope, elem, attr, ctrl) {
                elem.on('click', function () {
                    if ($rootScope.me.recrutRole == 'admin') {
                        $("#the-file-input").click();
                    } else {
                        notificationService.error($filter('translate')('Only admin can set logo'));
                    }
                });

                var Cropper = window.Cropper;
                $scope.openFiles = function(index){
                    console.log(index + 'openImg');
                    $rootScope.questionIndex = index;
                };
                $("#the-file-input").unbind('change').change(function() {
                    renderImage(this.files[0]);
                });
                renderImage = function (file) {
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var the_url = event.target.result;
                        var logoImg = new Image();
                        console.log(logoImg);
                        logoImg.src = the_url;
                        logoImg.onload = function () {
                            console.log($('#logo-button' + $rootScope.questionIndex));
                            $('#logo-button' + $rootScope.questionIndex).hide();
                            if((logoImg.width > 960 && logoImg.height > 380) || (logoImg.width == 960 && logoImg.height > 380) || (logoImg.width > 960 && logoImg.height == 380)){
                                if($rootScope.questionIndex != undefined){
                                    if($("#cropper-wrap").length == 0) {
                                        $(".owner_photo_wrap" + $rootScope.questionIndex).prepend('<div id="cropper-wrap"> <div id="img-wrapper"> </div> <button id="close">' + $filter("translate")("Close") + '</button> <button id="cropp">' + $filter("translate")("Accept_1") + '</button> <div id="wrapper"></div>  </div> <div id="wrapperForPng"></div>');
                                        $(".owner_photo_wrap" + $rootScope.questionIndex).find('img').hide();
                                        $(".owner_photo_wrap" + $rootScope.questionIndex).find('.owner_photo_bubble_wrap' + $rootScope.questionIndex).hide();
                                        $('#wrapperForPng').hide();
                                    }
                                    $('#img-wrapper').html("<img id='image' src='" + the_url + "'>");
                                    cropperFunc($rootScope.questionIndex);
                                }
                            } else if(logoImg.width == 960 && logoImg.height == 380){
                                Test.uploadTestQuestionLogo(the_url).then(function (data) {
                                    if(data.data.status == 'ok'){
                                        $scope.callbackTestQuestionLogo(data.data.object, $rootScope.questionIndex);
                                        $('#logo-button' + $rootScope.questionIndex).show();
                                    }else{
                                        notificationService.error(data.data.message);
                                        $('#logo-button' + $rootScope.questionIndex).show();
                                    }
                                }, function (error) {
                                    notificationService.error(error.data.message);
                                    $('#logo-button' + $rootScope.questionIndex).show();
                                });
                            } else {
                                $('#logo-button' + $rootScope.questionIndex).show();
                                notificationService.error($filter('translate')('Please choose image 960 x 380 px or larger'));
                            }
                        }

                    };
                    console.log(file);
                    reader.readAsDataURL(file);
                };
                function cropperFunc(index) {
                    var image = document.getElementById('image');
                    var cropper = new Cropper(image, {
                        aspectRatio: 960 / 380,
                        movable: false,
                        zoomable: false
                    });

                    $('#cropp').on('click',function () {
                        var canvasImg = image.cropper.getCroppedCanvas();
                        var ctx = canvasImg.getContext('2d');

                        var canvasCopy = document.createElement("canvas");
                        var copyContext = canvasCopy.getContext("2d");
                        canvasCopy.width = 960;
                        canvasCopy.height = 380;
                        copyContext.drawImage(canvasImg, 0, 0, 960, 380);
                        canvasImg.width = 960;
                        canvasImg.height = 380;
                        ctx.drawImage(canvasCopy, 0, 0, canvasImg.width, canvasImg.height,  0, 0,  canvasCopy.width, canvasCopy.height);
                        $scope.dataUrl = canvasImg.toDataURL();
                        $('#wrapperForPng').show();
                        $('#wrapperForPng').html("<img  src='" + $scope.dataUrl + "' > <button id='cancel'>" + $filter('translate')('cancel') + "</button><button id='download'>" + $filter('translate')('save') + "</button>");
                        $('#cropper-wrap').hide();
                        $('#cancel').on('click', function () {
                            $('#cropper-wrap').show();
                            $('#wrapperForPng').find('img').remove();
                            $('#cancel').remove();
                            $('#download').remove();
                        });
                        $('#download').on('click', function () {
                            Test.uploadTestQuestionLogo($scope.dataUrl).then(function (data) {
                                $scope.callbackTestQuestionLogo(data.data.object, $rootScope.questionIndex);
                                $('#company-logo').show();
                                cropper.destroy();
                                $('#cropper-wrap').remove();
                                $('#wrapperForPng').remove();
                                $("#the-file-input").val('');
                                $(".owner_photo_wrap" + index).find('img').show();
                                $(".owner_photo_wrap" + index).find('.owner_photo_bubble_wrap' + index).show();
                                $(".block-company .img-section img").prop('href','$rootScope.testQuestionLogoLink');
                                $('#logo-button' + index).show();
                            }, function (error) {
                                notificationService.error(error.data.message);
                            });

                        });
                    });
                    $('#close').on('click', function () {
                        cropper.destroy();
                        $('#cropper-wrap').remove();
                        $('#wrapperForPng').remove();
                        $("#the-file-input").val('');
                        $(".owner_photo_wrap" + index).find('img').hide();
                        $(".owner_photo_wrap" + index).find('.owner_photo_bubble_wrap' + index).show();
                        $("#logo-button" + index).show();
                    });
                }
            }
        }
    }])
    .directive('testAutocompleter', ["$filter", "serverAddress", "$rootScope", function($filter, serverAddress, $rootScope) {
            return {
                restrict: 'EA',
                replace: true,
                link: function($scope, element, attrs) {
                    $scope.addedTest = {};
                    var inputText = "";

                    $(element[0]).select2({
                        placeholder: $filter('translate')('Choose test'),
                        //minimumInputLength: 2,
                        allowClear: true,
                        //formatInputTooShort: function () {
                        //    return ""+ $filter('translate')('Please enter 2 characters') +"";
                        //},
                        formatNoMatches: function(term) {
                            return "<div class='select2-result-label' style='cursor: s-resize;'><span class='select2-match'></span>" + $filter('translate')('Please enter test title') + "</div>";
                        },
                        createSearchChoice: function(term, data) {
                            if ($(data).filter(function() {
                                    return this.text.localeCompare(term) === 0;
                                }).length === 0) {
                                inputText = term;
                                return {id: data.id, text: term};
                            }
                        },
                        ajax: {
                            url: serverAddress + "/test/autocompleteTest",
                            dataType: 'json',
                            crossDomain: true,
                            type: "POST",
                            data: function(term, page) {
                                return {
                                    text: term.trim()
                                };
                            },
                            results: function(data, page) {
                                var result = [];
                                angular.forEach(data['objects'], function(val) {
                                    if(val.status != 'D'){
                                        result.push({id: val.id, text: val.testName})
                                    }
                                });
                                return {
                                    results: result
                                };
                            }
                        },
                        dropdownCssClass: "bigdrop"
                    }).on("change", function(e){
                        if (e.added != undefined) {
                            $scope.addedTest = {
                                id: e.added.id,
                                text: e.added.text
                            };
                            $rootScope.$broadcast('addedTest', $scope.addedTest);
                        }
                    });
                }
            }
        }]
    )
    .directive('clickAnywhereButHere', function($document) {
        return {
            restrict: 'A',
            link: function(scope, elem, attr, ctrl) {
                elem.on('click', function(e) {
                    $(".clever-window.hideable").not(".ng-hide").addClass("ng-hide");
                    e.stopPropagation();
                });
                $document.on('click', function() {
                    scope.$apply(attr.clickAnywhereButHere);
                })
            }
        }
    })
    .directive('hideOnclickAnywhereButHere', function($document) {
        return {
            restrict: 'A',
            scope: {
                show: '='
            },
            link: function(scope, elem, attr, ctrl) {
                if(scope.show != false){
                    elem.on('click', function(e) {
                        var hidden = true;
                        if (!elem.children(".clever-window").hasClass("ng-hide")) {
                            hidden = false
                        }
                        $(".clever-window.hideable").not(".ng-hide").addClass("ng-hide");
                        if (hidden) {
                            elem.children(".clever-window").removeClass("ng-hide")
                        }
                        e.stopPropagation();
                    });
                    $document.on('click', function() {
                        $(".clever-window.hideable").not(".ng-hide").addClass("ng-hide");
                    })
                }
            }
        }
    }).directive('originAutocompleter', ["$filter", "serverAddress", "$translate", "$rootScope", function($filter, serverAddress, $translate, $rootScope) {
            return {
                restrict: 'EA',
                replace: true,
                link: function($scope, element, attrs) {
                    $scope.setOriginAutocompleterValue = function(val) {
                        if (val != undefined) {
                            $(element[0]).select2("data", {id: val, text: val});
                        } else {
                            $(element[0]).select2("data", {id: '', text: ''});
                        }
                        $('.select2-search-choice-edit-origin').off().on('click', function (e) {
                            $scope.editOriginName();
                        }).attr("title", $filter('translate')('Edit source for all candidates'));
                    };
                    $scope.getOriginAutocompleterValue = function() {
                        var object = $(element[0]).select2("data");
                        return object != null ? object.text : null;
                    };
                    var inputText = "";

                    let translatedPositions = false;

                    $rootScope.$on('$translateChangeSuccess', function () {
                        initSelect2();
                    });

                    if(!translatedPositions) {
                        initSelect2();
                    }
                    function initSelect2() {
                        translatedPositions = true;
                        $(element[0]).select2({
                            placeholder: $translate.instant('source'),
                            minimumInputLength: 0,
                            formatNoMatches: function(term) {
                                return "<div class='select2-result-label' style='cursor: s-resize;'><span class='select2-match'></span>" + $filter('translate')('Enter a source of this candidate') + "</div>";
                            },
                            createSearchChoice: function(term, data) {
                                if ($(data).filter(function() {
                                        return this.text.localeCompare(term) === 0;
                                    }).length === 0) {
                                    inputText = term;
                                    return {id: term, text: term};
                                }
                            },
                            ajax: {
                                url: serverAddress + "/candidate/autocompleteOrigin",
                                dataType: 'json',
                                crossDomain: true,
                                type: "POST",
                                data: function(term, page) {
                                    return {
                                        text: term.trim()
                                    };
                                },
                                results: function(data, page) {
                                    var result = [];
                                    angular.forEach(data['objects'], function(val) {
                                        result.push({id: val, text: val})
                                    });
                                    return {
                                        results: result
                                    };
                                }
                            },
                            dropdownCssClass: "bigdrop"
                        }).on('change',function () {
                            $('.select2-search-choice-edit-origin').off().on('click', function (e) {
                                $scope.editOriginName();
                            }).attr("title", $filter('translate')('Edit source for all candidates'));
                        }).on("select2-close", function(e) {
                            console.log("CLOSE!");
                            if (inputText.length > 0) {
                                $(element[0]).select2("data", {id: inputText, text: inputText});
                            }
                        }).on("select2-selecting", function(e) {
                            inputText = "";
                        });
                    }
                }
            }
        }]
    ).directive('select2EmploymentType', ["$filter", "serverAddress", "Service", function($filter, serverAddress, Service) {
            return {
                restrict: 'EA',
                replace: true,
                link: function($scope, element, attrs) {
                    $(element[0]).select2({
                        tags: Service.employmentTypeTwo(),
                        tokenSeparators: [",", " "],
                        createSearchChoice: function(){
                            return false;
                        }
                    }).on("change", function(e) {
                        $scope.progressUpdate();
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
                    $scope.getSelect2EmploymentType = function() {
                        var val = $(element[0]).select2('val');
                        return val != null ? val.toString() : null;
                    };
                    $scope.setSelect2EmploymentType = function(val) {
                        if (val != undefined) {
                            $(element[0]).select2('val', val);
                        }

                    };

                }
            }
        }]
    ).directive('select2Lang', ["$filter", "serverAddress", "Service", "notificationService", "$window", function($filter, serverAddress, Service, notificationService, $window) {
            return {
                restrict: 'EA',
                replace: true,
                link: function($scope, element) {
                    function format(item) {
                        return item.text;
                    }
                    $scope.setLangs=function(langs) {
                        $scope.addedLang = [];
                        var results = [];
                        var newarr = [];
                        var unique = {};
                        var newarrAdd = [];
                        var uniqueAdd = {};
                        angular.forEach(langs, function (val) {
                            if (!unique[val.name]) {
                                newarr.push(val);
                                unique[val.name] = val;
                            }
                        });
                        angular.forEach(newarr, function (nval) {
                            results.push({id: nval.languageId == undefined ? nval.name : nval.languageId, text: nval.name, level: 'undefined'});
                            setTimeout(function(){
                                var myListener = $scope.$on('addedLang', function (event, data) {
                                    if (data != undefined) {
                                        angular.forEach(results, function(mval, ind) {
                                            angular.forEach(data, function(val) {
                                                if(mval.text == val.text){
                                                    results.splice(ind, 1);
                                                }
                                            });
                                        });
                                        angular.forEach(results, function (val) {
                                            if (!uniqueAdd[val.text]) {
                                                newarrAdd.push(val);
                                                uniqueAdd[val.text] = val;
                                            }
                                        });
                                        angular.forEach(newarrAdd, function(mval, ind) {
                                            angular.forEach(data, function(val) {
                                                if(mval.text == val.text){
                                                    newarrAdd.splice(ind, 1);
                                                    results = newarrAdd;
                                                }
                                            });
                                        });
                                        $scope.addedLang = data;
                                        $('.addingLangs').show();
                                        $scope.$apply();
                                    }
                                });
                                $scope.$on('$destroy', myListener);
                            },0);
                        });
                        var inputText = "";

                        $(element[0]).select2({
                                tags:  results,
                                tokenSeparators: [',', ' '],
                                data:{
                                    results:  results,
                                    text: function(item) { return item.text; }
                                },
                                createSearchChoice: function(term, data) {
                                    if ($(data).filter(function() {
                                            return this.text.localeCompare(term) === 0;
                                        }).length === 0) {
                                        inputText = term;
                                        var inputElement = $('.select-lang-container .select2-input input');
                                        inputElement.attr('placeholder', $filter('translate')('Choose/add'));
                                        return {id: term, text: term};
                                    }
                                },
                                formatSelection: format,
                                formatResult: format,
                                formatResultCssClass: function (data, container) { return data.text; }
                            }
                        ).on("change", function(e) {
                            if(e.added != undefined){
                                $scope.addedLang.push(e.added);
                                var alreadySet = $scope.getSelect2Lang();
                                var toStandardCase = alreadySet[alreadySet.length - 1];
                                toStandardCase.text = toStandardCase.text[0].toUpperCase() + toStandardCase.text.slice(1).toLowerCase();
                                alreadySet.pop();
                                alreadySet.push(toStandardCase);
                                $scope.setSelect2Lang(alreadySet);
                                angular.forEach(alreadySet, function(nval, index) {
                                    if( alreadySet.length > 1 && index < alreadySet.length -1 ){
                                        if(e.added.text.toUpperCase() == nval.text.toUpperCase()){
                                            $scope.addedLang.splice(-1, 1);
                                            var afterDelete = $scope.getSelect2Lang();
                                            afterDelete.pop();
                                            $scope.setSelect2Lang(afterDelete);
                                            notificationService.success($filter('translate')('This language has already been added'));
                                            $scope.$broadcast('addedLang',  $scope.addedLang);
                                        }
                                    }
                                });
                            }
                            if($scope.type != 'merge' && $scope.type != 'Vacancy add' && $scope.type != 'Vacancy edit') {
                                $scope.candidate.languages = $scope.getSelect2Lang();
                                $scope.progressUpdate();
                            }
                            var inputElement = $('.select-lang-container .select2-search-field input');
                            inputElement.attr('placeholder', $filter('translate')('Choose/add'));


                            if (e.removed) {
                                angular.forEach($scope.addedLang, function(nval) {
                                    if(e.removed.id == nval.id){
                                        var deleteFromArray = $scope.addedLang.indexOf(nval);
                                        if (deleteFromArray > -1) {
                                            $scope.addedLang.splice(deleteFromArray, 1);
                                        }
                                        $scope.$broadcast('addedLang',  $scope.addedLang);
                                    }
                                    results.push(e.removed);
                                });
                            }
                        }).on("select2-selecting", function(e) {
                            inputText = "";
                        });
                    };
                    $scope.getSelect2Lang = function() {
                        var val = $(element[0]).select2("data");
                        $scope.addedLang2 = val;
                        setTimeout(function(){
                            $scope.$broadcast('addedLang',  $scope.addedLang2);
                        },0);
                        return val != null ? val : null;
                    };
                    $scope.setSelect2Lang = function(val) {
                        var inputElement = $('.select-lang-container .select2-search-field input');
                        inputElement.attr('placeholder', $filter('translate')('Choose/add'));
                        inputElement.attr('maxlength', '20');
                        if (val != undefined) {
                            $scope.addedLang = val;
                            $(element[0]).select2("data", val);
                            setTimeout(function(){
                                $scope.$broadcast('addedLang',  $scope.addedLang);
                            },0);
                        } else {
                            $(element[0]).select2("data", {id: '', text: ''});
                        }
                    };
                }
            }
        }]
    ).directive('select2LangSearch', ["$filter", "serverAddress", "Service", function($filter, serverAddress, Service) {
            return {
                restrict: 'EA',
                replace: true,
                link: function($scope, element, attrs) {
                    $scope.setLangs=function(langs) {
                        Array.prototype.removeDuplicates = function (){
                            var temp=[];
                            label:for(i=0;i<this.length;i++){
                                for(var j=0; j<temp.length;j++ ){//check duplicates
                                    if(temp[j]==this[i])//skip if already present
                                        continue label;
                                }
                                temp[temp.length] = this[i];
                            }
                            return temp;
                        };
                        $scope.fullLangs = langs.concat(Service.lang());
                        $scope.fullLangs2 = $scope.fullLangs.removeDuplicates();
                        //$scope.cutFullLangs = $scope.fullLangs2.slice(0,)

                        $(element[0]).select2({
                                tags: $scope.fullLangs2,
                                tokenSeparators: [","]
                            }
                        ).on("change", function(e) {
                            if (e.removed) {

                            } else {
                            }
                        });
                    };
                    $scope.getSelect2Lang = function() {
                        var val = $(element[0]).select2('val');
                        return val != null ? val.toString() : null;
                    };
                    $scope.setSelect2Lang = function(val) {
                        if (val != undefined) {
                            $(element[0]).select2('val', val);
                        }
                    };
                }
            }
        }]
    ).directive('select2Groups', ["$filter", "serverAddress", "Service", "CandidateGroup","notificationService", function($filter, serverAddress, Service, CandidateGroup, notificationService) {
            return {
                restrict: 'EA',
                replace: true,
                link: function($scope, element, attrs) {
                    $scope.setGroups=function(groups, groupsByCandidate) {
                        var candidateGroups = groupsByCandidate;
                        var groupList = groups;
                        var groupNameList = [];
                        var alreadyDeleted = [];
                        angular.forEach(groupList, function (val, key) {
                            groupNameList.push(val.name);
                        });
                        $(element[0]).select2({
                                tags: groupNameList,
                                tokenSeparators: [","]
                            }
                        ).unbind().on("change", function(e) {
                            if (e.removed) {
                                var newGroupList = $scope.getSelect2Group().split(",");
                                var isExists = false;

                                angular.forEach(candidateGroups, function(val, key) {
                                    isExists = false;
                                    angular.forEach(newGroupList, function(nval, nkey) {
                                        if (nval == val.name) {
                                            isExists = true;
                                        }
                                    });
                                    if (!isExists) {
                                        var candidates = [];
                                        candidates.push($scope.candidate.candidateId);
                                        CandidateGroup.remove({
                                            candidateGroupId : val.candidateGroupId,
                                            candidateIds : candidates
                                        },function(res){
                                            if(res.status == 'ok'){
                                                notificationService.success($filter('translate')('Tags removed'));
                                                var deletedElement = alreadyDeleted.indexOf(val);
                                                alreadyDeleted.splice(deletedElement, 1);
                                            }
                                        });
                                        var deleteFromArray = candidateGroups.indexOf(val);
                                        if (deleteFromArray > -1) {
                                            candidateGroups.splice(deleteFromArray, 1);
                                        }
                                    }
                                });

                            } else {
                                var newGroupList = $scope.getSelect2Group().split(",");
                                var isExists = false;
                                angular.forEach(newGroupList, function(nval, key) {
                                    isExists = false;
                                    angular.forEach(candidateGroups, function(val, nkey) {
                                        if (nval.toUpperCase() == val.name.toUpperCase()) {
                                            isExists = true;
                                            if(alreadyDeleted.indexOf(val.name.toUpperCase()) === -1)
                                                alreadyDeleted.push(val.name.toUpperCase());
                                        }
                                    });
                                    if (!isExists && alreadyDeleted.indexOf(nval.toUpperCase()) === -1) {
                                        var candidates = [];
                                        candidates.push($scope.candidate.candidateId);
                                        CandidateGroup.add({name : nval, candidateIds : candidates},function(res){
                                            if(res.status == 'ok'){
                                                $('.select2-search-choice').last().children().first().text(res.object.name);
                                                var afterAdd = $scope.getSelect2Group().split(",");
                                                afterAdd.pop();
                                                afterAdd.push(res.object.name);
                                                $scope.setSelect2Group(afterAdd);
                                                candidateGroups.push(res.object);
                                                notificationService.success($filter('translate')('Tag added'));
                                            }
                                            $('a.select2-search-choice-edit').attr("title", $filter('translate')('Edit tag for all candidates'));
                                            $('a.select2-search-choice-edit').off().on('click',function (e) {
                                                $scope.editTagName(e.currentTarget);
                                            });
                                        });
                                    }
                                });
                                if (isExists) {
                                    notificationService.success($filter('translate')('This tag has already assigned'));
                                    var afterDelete = $scope.getSelect2Group().split(",");
                                    afterDelete.pop();
                                    $scope.setSelect2Group(afterDelete);
                                    $('a.select2-search-choice-edit').attr("title", $filter('translate')('Edit tag for all candidates'));
                                    $('a.select2-search-choice-edit').off().on('click',function (e) {
                                        $scope.editTagName(e.currentTarget);
                                    });
                                }
                            }

                        });
                    };
                    $scope.getSelect2Group = function() {
                        var val = $(element[0]).select2('val');
                        return val != null ? val.toString() : null;
                    };
                    $scope.setSelect2Group = function(val) {

                        if (val != undefined) {
                            $(element[0]).select2('val', val);
                        }
                    };
                    setTimeout(function () {
                        $('a.select2-search-choice-edit').attr("title", $filter('translate')('Edit tag for all candidates'));
                        $('a.select2-search-choice-edit').off().on('click',function (e) {
                            $scope.editTagName(e.currentTarget);
                        });
                    },5000);
                }
            }
        }]
    ).directive('select2CustomField', ["$filter", "Service", "CustomField","notificationService", function($filter, Service, CustomField, notificationService) {
            return {
                restrict: 'EA',
                replace: true,
                link: function($scope, element, attrs) {
                    var groupNameList = [];
                    var addParam = [];

                    $(element[0]).select2({
                            tags: groupNameList,
                            tokenSeparators: [","],
                            placeholder: ($filter('translate')('Enter values for the drop-down list')),
                            minimumInputLength: 1,
                            width: '310px'
                        }
                    );

                    $('#addFieldParam').click(function(){

                        var newGroupList = $scope.getSelect2Group().split(",");

                        var addParam = [];
                        angular.forEach(newGroupList, function(nval) {
                            addParam.push({name: 'defaultValue', value: nval == '' ? notificationService.error($filter('translate')('Please enter at least one value for the drop-down list')) : nval});
                        });

                        $scope.count = 0;
                        angular.forEach($scope.allObjCustomField, function(val) {
                            if(val.orderIndex != undefined && $scope.count <= val.orderIndex){
                                $scope.count = val.orderIndex;
                            }
                        });

                        CustomField.addField({
                            objType: $scope.tabsForFields == 'Vacancies' ? 'vacancy' : 'vacancy' &&  $scope.tabsForFields == 'Candidates' ? 'candidate' : 'candidate' && $scope.tabsForFields == 'Clients' ? 'client' : 'client',
                            type: $scope.typeCustomField,
                            title: $scope.fieldTitle == undefined ||  $scope.fieldTitle == '' ? notificationService.error($filter('translate')('Enter the field title')) :  $scope.fieldTitle,
                            orderIndex: ++$scope.count,
                            params: addParam
                        }, function(resp) {
                            if (resp.status == "ok") {
                                $scope.objCustomField = resp.object;
                                $scope.fieldTitle = '';
                                $("#customFullField").select2("val", "");
                                $scope.showDropDownSelect = false;
                                $scope.typeCustomField = null;
                                $scope.getFullFields();
                                notificationService.success($filter('translate')('New field added'));
                            } else {
                                //notificationService.error(resp.message);
                            }
                        });
                    });

                    $scope.getSelect2Group = function() {
                        var val = $(element[0]).select2('val');
                        return val != null ? val.toString() : null;
                    };
                    $scope.setSelect2Group = function(val) {

                        if (val != undefined) {
                            $(element[0]).select2('val', val);
                        }
                    };
                    $('#s2id_customFullField .select2-search-field input').attr('maxlength', 50);
                }
            }
        }]
    ).directive('select2GroupsForMass', ["$filter", "serverAddress", "Service",
        "CandidateGroup", "notificationService", "$rootScope", function ($filter, serverAddress, Service, CandidateGroup, notificationService, $rootScope) {
            return {
                restrict: 'EA',
                replace: true,
                link: function ($scope, element, attrs) {
                    $rootScope.setGroupsForMass = function (groups, groupsByCandidate, scope) {
                        var candidateGroups = groupsByCandidate;
                        var groupList = groups;
                        var groupNameList = [];
                        angular.forEach(groupList, function (val, key) {
                            groupNameList.push(val.name);
                        });
                        $(element[0]).select2({
                                tags: groupNameList,
                                tokenSeparators: [","]
                            }
                        ).on("change", function (e) {
                            var i = 0;
                            if (e.removed) {
                                angular.forEach(candidateGroups, function(val, key) {
                                    //if(e.removed.text == val.name){
                                    //    CandidateGroup.remove({
                                    //        candidateGroupId : val.candidateGroupId,
                                    //        candidateIds : $scope.candidatesAddToVacancyIds
                                    //    },function(res){
                                    //        if(res.status == 'ok'){
                                    //            if(i == 0){
                                    //                i++;
                                    //                notificationService.success($filter('translate')('Tags removed'));
                                    //            }
                                    //        }
                                    //    });
                                    //}
                                });
                            }else{
                                //var newGroupList = scope.getSelect2GroupForMass().split(",");
                                //angular.forEach(newGroupList, function (nval, key) {
                                //    CandidateGroup.add({
                                //        name: newGroupList[newGroupList.length-1],
                                //        candidateIds: $scope.candidatesAddToVacancyIds
                                //    }, function (res) {
                                //        if(res.status == 'ok'){
                                //            if(i == 0){
                                //                i++;
                                //                candidateGroups.push(res.object);
                                //                notificationService.success($filter('translate')('Tags added'));
                                //            }
                                //        }
                                //    });
                                //});
                            }
                        });
                        scope.getSelect2GroupForMass = function () {
                            var val = $(element[0]).select2('val');
                            return val != null ? val.toString() : null;
                        };
                        scope.setSelect2GroupForMass = function (val) {
                            if (val != undefined) {
                                $(element[0]).select2('val', val);
                            }
                        };
                    };
                }
            }
        }]
    ).directive('descriptionTreatment', [function() {
            return {
                restrict: 'EA',
                scope: {
                    description: "="
                },
                link: function(scope, element, attrs) {
                    scope.$watch('description', function(newval, oldval) {
                        if (newval) {
                            element.html(scope.description);
                            element.children().each(function () {
                                if($(this).html() == "&nbsp;") {
                                    $(this).remove();
                                }else {
                                    return false;
                                }
                            });
                            $(element).linkify();
                        }
                    });

                }
            }
        }]
    ).directive('ngContextMenu', function ($parse) {
        var renderContextMenu = function ($scope, event, options) {
            if (!$) { var $ = angular.element; }
            $(event.currentTarget).addClass('context');
            var $contextMenu = $('<div>');
            $contextMenu.addClass('dropdown clearfix');
            var $ul = $('<ul>');
            var body = document.body,
                html = document.documentElement;

            var height = Math.max( body.scrollHeight, body.offsetHeight,
                html.clientHeight, html.scrollHeight, html.offsetHeight );
            $ul.addClass('dropdown-menu');
            $ul.attr({ 'role': 'menu' });
            $ul.css({
                display: 'block',
                position: 'absolute',
                left: event.pageX + 'px',
                top: event.pageY + 'px'
            });
            angular.forEach(options, function (item, i) {
                var $li = $('<li>');
                if (item === null) {
                    $li.addClass('divider');
                } else {
                    $a = $('<a>');
                    $a.attr({ tabindex: '-1'});
                    $a.text(item[0]);
                    $li.append($a);
                    $li.on('click', function () {
                        $scope.$apply(function() {
                            item[1].call($scope, $scope);
                        });
                    });
                }
                $ul.append($li);
            });
            $contextMenu.append($ul);
            $contextMenu.css({
                width: '100%',
                height: height,
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 9999999
            });
            $(document).find('body').append($contextMenu);
            $contextMenu.on("click", function (e) {
                $(event.currentTarget).removeClass('context');
                $contextMenu.remove();
            }).on('contextmenu', function (event) {
                $(event.currentTarget).removeClass('context');
                event.preventDefault();
                $contextMenu.remove();
            });
        };
        return function ($scope, element, attrs) {
            element.on('contextmenu', function (event) {
                $scope.$apply(function () {
                    event.preventDefault();
                    var options = $scope.$eval(attrs.ngContextMenu);
                    if (options instanceof Array) {
                        renderContextMenu($scope, event, options);
                    } else {
                        throw '"' + attrs.ngContextMenu + '" not an array';
                    }
                });
            });
        };
    }).directive('positionAutocompleter', ["$rootScope", "$filter", "$translate", "serverAddress", function($rootScope, $filter, $translate, serverAddress) {
            return {
                restrict: 'EA',
                replace: true,
                link: function($scope, element, attrs) {
                    $scope.setPositionAutocompleterValue = function(val) { //переимновтаь
                        if (val != undefined) {
                            $(element[0]).select2("data", {id: val, text: val});
                        }else {
                            $(element[0]).select2("data", {id: '', text: ''});
                        }
                    };
                    $scope.getPositionAutocompleterValue = function() {//.переимновтаь
                        var object = $(element[0]).select2("data");
                        return object != null ? object.text : null;
                    };
                    var inputText = "";
                    let translatedPositions = false;

                    $rootScope.$on('$translateChangeSuccess', function () {
                        initSelect2();
                    });

                    if(!translatedPositions) {
                        initSelect2();
                    }

                    function initSelect2() {
                        translatedPositions = true;
                        $(element[0]).select2({
                            placeholder: $translate.instant($scope.placeholder),
                            minimumInputLength: 2,
                            allowClear: true,
                            formatInputTooShort: function () {
                                return ""+ $filter('translate')('Please enter 2 characters') +"";
                            },
                            formatNoMatches: function(term) {
                                return "<div class='select2-result-label' style='cursor: s-resize;'><span class='select2-match'></span>" + $filter('translate')('Enter a source of this candidate') + "</div>";
                            },
                            createSearchChoice: function(term, data) {
                                if ($(data).filter(function() {
                                        return this.text.localeCompare(term) === 0;
                                    }).length === 0) {
                                    inputText = term;
                                    return {id: term, text: term};
                                }
                            },
                            ajax: {
                                url: serverAddress + "/candidate/autocompletePosition",
                                dataType: 'json',
                                crossDomain: true,
                                type: "POST",
                                data: function(term, page) {
                                    return {
                                        text: term.trim()
                                    };
                                },
                                results: function(data, page) {
                                    var result = [];
                                    angular.forEach(data['objects'], function(val) {
                                        result.push({id: val, text: val})
                                    });
                                    return {
                                        results: result
                                    };
                                }
                            },
                            dropdownCssClass: "bigdrop"
                        }).on("select2-close", function(e) {
                            if (inputText.length > 0) {
                                $(element[0]).select2("data", {id: inputText, text: removeExtraSpaces(inputText)});
                            }
                            if($(element[0]).select2("data")) {
                                $(element[0]).select2("data", {id: inputText, text: removeExtraSpaces($(element[0]).select2("data").text)});
                                $scope.searchParam.position = removeExtraSpaces($(element[0]).select2("data").text);
                                $scope.setPositionAutocompleterValue($scope.searchParam.position);
                            }
                            $scope.searchParam.position = removeExtraSpaces($(element[0]).select2("data").text);
                        }).on("select2-selecting", function(e) {
                            inputText = "";
                        }).on("select2-open", function() {
                            if($(element[0]).select2("data"))
                                $('#select2-drop input').val($(element[0]).select2("data").text)
                        });
                    }
                    function removeExtraSpaces(string) {
                        let str = string.split('');
                        // console.log(str);
                        for( let i = 0; i < str.length; i++) {
                            if( str[i] === " " && str[i+1] === " " && i !== 0 && i !== str.length - 1  || (str[i] === " " && i === str.length - 1)) {
                                // console.log(str[i],str[i+1],"spliced");
                                str.splice(i,1);
                                i--;
                            }
                        }
                        // console.log(str);
                        return str.join('');
                    }
                }
            }
        }]
    ).directive('dotdotdot', function() {
            return function(scope, element, attrs) {
                $(element).dotdotdot({
                    watch:true
                    //height:Number(attrs.dotdotdot)
                });
            }
        }
    ).directive('dotdotdot2', function() {
            return function(scope, element, attrs) {
                $(element).dotdotdot({
                    watch:true,
                    height:Number(attrs.dotdotdot2)
                });
            }
        }
    ).directive('customScrollbar', function() {
            return function(scope, element, attrs) {
                $(element).mCustomScrollbar({
                    theme: 'dark',
                    scrollInertia:1000
                });
            }
        }
    ).directive('popup', function() {
            return function($scope, element, attrs) {
                element.popup({
                    position : 'right center'
                });
            }
        }
    ).directive('skillsAutocompleter', ["$filter", "serverAddress","notificationService", function($filter, serverAddress, notificationService) {
            return {
                restrict: 'EA',
                replace: true,
                link: function($scope, element, attrs) {
                    $scope.setSkillAutocompleterValue = function(val) { //переимновтаь
                        if (val != undefined) {
                            $(element[0]).select2("data", {id: val, text: val});
                        }
                    };
                    $scope.getSkillAutocompleterValue = function() {//.переимновтаь
                        var object = $(element[0]).select2("data");
                        return object != null ? object.text : null;
                    };
                    var inputText = "";
                    var source = ["MySQL", "JavaScript", "Linux", "CSS", "HTML", "PHP", "jQuery", "SQL", "Git", "C#", "Java", "XML", "C++", "Python", "OOP/OOD", "PostgreSQL", "MongoDB", "Spring", "Hibernate", "CSS3", "HTML5", "MVC", "Oracle", "ASP.NET", "Android", "Maven", "WPF", "JSON", "WCF", "AJAX", ".NET", "Jira", "Django", "Scrum", "Windows", "JSP", "Yii", "Redis", "JDBC", "SQLite", "Agile", "Ruby", "TDD", "JUnit", "REST API", "STL", "Qt", "Bootstrap", "Tomcat", "ADO.NET", "Delphi", "LINQ", "iOS", "WinForms", "Selenium", "Angular.js", "Design Patterns", "Eclipse", "Apache", "Mercurial", "Frontend", "Entity Framework", "Node.js", "Photoshop", "T-SQL", "JPA", "Objective-C", "Nginx", "Multithreading", "Servlets", "Redmine", "SOAP", "TFS", "UML", "Backbone.js", "Jenkins", "Perl", "Wordpress", "Subversion", "Ant", "Ruby on Rails", "JSF", "CoffeeScript", "PL/SQL", "Joomla", "C/C++", "FreeBSD", "LESS", "SASS", "bash", "Android SDK", "Drupal", "GWT", "EJB", "Scala", "Smarty", "CodeIgniter", "XSLT", "OpenGL", "Quality Assurance (QA)", "Flask", "Symfony", "Swing", "OOD", "Zend Framework (ZF)", "Ubuntu", "Twitter Bootstrap", "Java EE", "Memcached", "Magento", "Silverlight", "\u0421++", "ExtJS", "JMS", "Illustrator", "Boost", "Sphinx", "Patterns", "BDD", "MS SQL Server", "NodeJS", "Unix", "User Interface (UI)", "TCP/IP", "Unity3D", "CI", "Java Core", "JBoss", "RabbitMQ", "NoSQL", "WinAPI", "TeamCity", "Kohana", "TestNG", "Flash", "HAML", "UIKit", "JSTL", "AWS", "NetBeans", "Product management", "RSpec", "C (plain)", "Groovy", "Kanban", "MFC", "Confluence", "Spring MVC", "HTTP", "NHibernate", "XPath", "XAML", "Mantis", "PHPUnit", "Mockito", "Algorithms", "Embedded", "Memcache", "Struts", "Adobe Photoshop", "Cocoa", "CoreData", "Firebird", "Selenium IDE", "IIS", "Visual Studio", "NUnit", "English", "RoR", "Flex", "Lua", "Perforce", "Networking", "SOA", "Knockout", "LAMP", "Xcode", "CakePHP", "\u0421#", "Tornado", "SSIS", "Firebug", "Microsoft SQL Server", "RequireJS", "Highload", "MVVM", "Windows Phone", "SEO", "Doctrine", "COM", "Azure", "Debian", "User Experience (UX)", "IntelliJ IDEA", "JMeter", "Erlang", "Cocoa Touch", "TestComplete", "Windows Forms", "MapKit", "DDD", "MacOS", "Twig", "CVS", "XP", "Foundation", "GUI", "GCD", "Pascal", "Mongo", "Axure", "CentOS", "Prototype", "SoapUI", "Test driven development (TDD)", "SSRS", "Cucumber", "Manual Testing (QA)", "SOLID", "ActionScript", "Grunt", "Solr", "CMS", "Cassandra", "Sinatra", "EntityFramework", "DNS", "Entity", "Hadoop", "Symfony 2", "CRM", "JAXB", "Project Management", "DHCP", "Knockout.js", "regression", "Celery", "TestRail", "CouchDB", "Jetty", "Automation", "DevExpress", "ETL", "Java SE", "Servlet", "ZF", "WebServices", "SCSS", "ASP", "ORM", "Bugzilla", "JAX-RS", "Web Development", "Automated Testing (QA)", "Embedded C", "Stylus", "Selenium WebDriver", "Bitrix", "Shell", "Jade", "iPhone", "Facebook API", "SDLC", "IDEA", "Microsoft Office", "Threads", "Security", "VirtualBox", "Matlab", "DB2", "Vaadin", "Capybara", "Visual Basic (VB)", "Adobe Illustrator", "ARM", "MyBatis", "Waterfall", "RUP", "PHP5", "ActionScript3 (AS3)", "Glassfish", "VMware", "XSD", "Laravel", "Underscore.js", "Gradle", "SharePoint", "SVG", "Grails", "usability", "WinRT", "Zabbix", "Cocos2d", "Nagios", "Assembler", "Objective C", "CoreLocation", "R (language)", "Win32", "Regression Testing", "Cisco", "OpenCV", "JAX-WS", "DirectX", "Continuous Integration", "Haskell", "GIS", "Open Source", "Leaflet"];
                    var sourceForSelect = [];
                    angular.forEach(source, function(val) {
                        sourceForSelect.push({id: val, text: val})
                    });
                    $(element[0]).select2({
                        placeholder: $filter('translate')('Enter skill'),
                        minimumInputLength: 2,
                        formatInputTooShort: function () {
                            return ""+ $filter('translate')('Please enter 2 characters') +"";
                        },
                        formatNoMatches: function(term) {
                            return "<div class='select2-result-label' style='cursor: s-resize;'><span class='select2-match'></span>" + $filter('translate')('Enter a source of this candidate') + "</div>";
                        },
                        createSearchChoice: function(term, data) {
                            if ($(data).filter(function() {
                                    return this.text.localeCompare(term) === 0;
                                }).length === 0) {
                                inputText = term;
                                return {id: term, text: term};
                            }
                        },
                        data: sourceForSelect,
                        dropdownCssClass: "bigdrop"
                    }).on("select2-close", function(e) {
                        console.log("CLOSE!");
                        function addSkillName(first) {
                            this.name = first;
                        }
                        if($scope.getSkillAutocompleterValue().length > 1){
                            if($scope.candidate.skills.length > 0){
                                var noDoublicate = true;
                                angular.forEach($scope.candidate.skills, function(resp){

                                    if(resp.name.toLowerCase() == $scope.getSkillAutocompleterValue().toLowerCase()){
                                        notificationService.error($filter('translate')('Skill is already added'));
                                        noDoublicate = false;
                                    }
                                });
                                if(noDoublicate){
                                    $scope.candidate.skills.push({name : $scope.getSkillAutocompleterValue(),level: '0'});
                                }
                            }else{
                                $scope.candidate.skills.push({name : $scope.getSkillAutocompleterValue(),level: '0'});
                            }
                        }
                        $scope.setSkillAutocompleterValue('');
                        $scope.$apply();
                        console.log($scope.candidate);
                        if (inputText.length > 0) {
                            $(element[0]).select2("data", {id: inputText, text: inputText});
                        }
                    }).on("select2-selecting", function(e) {
                        inputText = "";
                    });
                }
            }
        }]
    ).directive('skillsAutocompleterForSearch', ["$filter", "serverAddress","notificationService", "$translate", "$rootScope", function($filter, serverAddress, notificationService, $translate, $rootScope) {
            return {
                restrict: 'EA',
                replace: true,
                link: function($scope, element, attrs) {
                    $scope.setSkillAutocompleterValueForSearch = function(val) { //переимновтаь
                        if (val != undefined) {
                            $(element[0]).select2("data", {id: val, text: val});
                        }
                    };
                    $scope.getSkillAutocompleterValueForSearch = function() {//.переимновтаь
                        var object = $(element[0]).select2("data");
                        return object != null ? object.text : null;
                    };
                    var inputText = "";

                    let translatedPositions = false;

                    $rootScope.$on('$translateChangeSuccess', function () {
                        initSelect2();
                    });

                    if(!translatedPositions) {
                        initSelect2();
                    }
                    function initSelect2() {
                        translatedPositions = true;
                        $(element[0]).select2({
                            placeholder: $translate.instant('Skill with rating'),
                            minimumInputLength: 2,
                            formatInputTooShort: function () {
                                return ""+ $filter('translate')('Please enter 2 characters') +"";
                            },
                            formatNoMatches: function(term) {
                                return "<div class='select2-result-label' style='cursor: s-resize;'><span class='select2-match'></span>" + $filter('translate')('Enter a source of this candidate') + "</div>";
                            },
                            createSearchChoice: function(term, data) {
                                if ($(data).filter(function() {
                                        return this.text.localeCompare(term) === 0;
                                    }).length === 0) {
                                    inputText = term;
                                    return {id: term, text: term};
                                }
                            },
                            ajax: {
                                url: serverAddress + "/candidate/autocompleteSkill",
                                dataType: 'json',
                                crossDomain: true,
                                type: "POST",
                                data: function(term, page) {
                                    return {
                                        text: term.trim()
                                    };
                                },
                                results: function(data, page) {
                                    var result = [];
                                    angular.forEach(data['objects'], function(val) {
                                        result.push({id: val, text: val})
                                    });
                                    console.log(result);
                                    return {
                                        results: result
                                    };
                                }
                            },
                            dropdownCssClass: "bigdrop"
                        }).on("select2-close", function(e) {
                            console.log("CLOSE!");
                            function addSkillName(first) {
                                this.name = first;
                            }
                            if($scope.getSkillAutocompleterValueForSearch().length > 1){
                                $scope.candidate = {};
                                var i = 0;
                                angular.forEach($scope.candidate.skills, function(resp){
                                    if(resp.name == $scope.getSkillAutocompleterValueForSearch()){
                                        notificationService.error($filter('translate')('Skill is already added'));
                                    }else{
                                        if(i == 0){
                                            $scope.candidate.skills.push({name : $scope.getSkillAutocompleterValueForSearch(),level: '_0'});
                                            i++;
                                        }
                                    }
                                });

                            }
                            $scope.getSkillAutocompleterValueForSearch('');
                            $scope.$apply();
                            if (inputText.length > 0) {
                                $(element[0]).select2("data", {id: inputText, text: inputText});
                            }
                        }).on("select2-selecting", function(e) {
                            inputText = "";
                        });
                    }
                }
            }
        }]
    ).directive('select2GroupsSearch', ["$filter", "serverAddress", "Service", "CandidateGroup", function($filter, serverAddress, Service, CandidateGroup) {
            return {
                restrict: 'EA',
                replace: true,
                link: function($scope, element, attrs) {
                    $scope.clearTags = function(){
                        $(element[0]).select2('data', null);
                        $scope.groupIdsForSearch = [];
                    };
                    $scope.setGroups=function(groups, groupsByCandidate) {
                        var candidateGroups = groupsByCandidate;
                        var groupList = groups;
                        var groupNameList = [];
                        $scope.groupsForEdit = [];
                        angular.forEach(groupList, function (val, key) {
                            groupNameList.push(val.name);
                        });
                        $(element[0]).select2({
                                tags: groupNameList,
                                tokenSeparators: [","]
                            }
                        ).on("change", function(e) {
                            if (e.removed) {
                                var newGroupList = $scope.getSelect2Group().split(",");
                                var isExists = false;
                                angular.forEach(groupList, function(val, key) {
                                    isExists = false;
                                    angular.forEach(newGroupList, function(nval, nkey) {
                                        if (nval == val.name) {
                                            isExists = true;
                                        }else if(val.candidateGroupId == nval){
                                            isExists = true;
                                        }
                                    });
                                    if (!isExists) {
                                        //angular.forEach(newGroupList, function(nval, key) {
                                        //    angular.forEach(groupList, function(val, nkey) {
                                        //        if (nval == val.name) {
                                        //            groupsIds.push(val.candidateGroupId);
                                        //        }
                                        //    });
                                        //});
                                        var deleteFromArray = $scope.groupIdsForSearch.indexOf(val.candidateGroupId);
                                        if (deleteFromArray > -1) {
                                            $scope.groupIdsForSearch.splice(deleteFromArray, 1);
                                        }
                                    }
                                });
                            } else {
                                var groupsIds = [];
                                var newGroupList = removeExtraSpaces($scope.getSelect2Group()).split(",");
                                var isExists = false;
                                console.log(newGroupList);
                                angular.forEach(newGroupList, function(nval, key) {
                                    isExists = false;
                                    angular.forEach(candidateGroups, function(val, nkey) {
                                        if (nval == val.name) {
                                            isExists = true;
                                        }
                                    });
                                    if (!isExists) {
                                        angular.forEach(groupList, function(val, nkey) {
                                            console.log(nval);
                                            if (nval == val.name) {
                                                groupsIds.push(val.candidateGroupId);
                                                var alreadyAdded = false;
                                                angular.forEach($scope.groupsForEdit,function (forEdit) {
                                                    if(val.candidateGroupId == forEdit.candidateGroupId) {
                                                        alreadyAdded = true;
                                                    }
                                                });
                                                if(!alreadyAdded) {
                                                    console.log("here2");
                                                    $scope.groupsForEdit.push({name: val.name + "123", candidateGroupId: val.candidateGroupId})
                                                }
                                            }else if(val.candidateGroupId == nval){
                                                console.log("here");
                                                groupsIds.push(val.candidateGroupId);
                                            }
                                        });
                                        //CandidateGroup.add({name : nval, candidateIds : candidates},function(res){
                                        //    candidateGroups.push(res.object);
                                        //});
                                    }
                                });
                                $('a.select2-search-choice-edit').attr("title", $filter('translate')('Edit tag for all candidates'));
                                $('a.select2-search-choice-edit').off().on('click',function (e) {
                                    $scope.editTagName(e.currentTarget);
                                });
                                $scope.groupIdsForSearch = groupsIds;
                                $scope.$apply();
                            }
                        });
                    };
                    $scope.getSelect2Group = function() {
                        var val = $(element[0]).select2('val');
                        return val != null ? val.toString() : null;
                    };
                    $scope.setSelect2Group = function(val) {
                        if (val != undefined) {
                            $(element[0]).select2('val', val);
                        }
                    };
                    function removeExtraSpaces(string) {
                        let str = string.split('');
                        console.log(str);
                        for( let i = 0; i < str.length; i++) {
                            if( str[i] === " " && str[i+1] === " " && i !== 0 && i !== str.length - 1 ) {
                                console.log(str[i],str[i+1],"spliced");
                                str.splice(i,1);
                                i--;
                            }
                        }
                        return str.join('');
                    }
                }
            }
        }]
    ).directive('ngMin', function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, elem, attr, ctrl) {
                    scope.$watch(attr.ngMin, function(){
                        ctrl.$setViewValue(ctrl.$viewValue);
                    });
                    var minValidator = function(value) {
                        var min = scope.$eval(attr.ngMin) || 0;
                        if (!isEmpty(value) && value < min) {
                            ctrl.$setValidity('ngMin', false);
                            return undefined;
                        } else {
                            ctrl.$setValidity('ngMin', true);
                            return value;
                        }
                    };

                    ctrl.$parsers.push(minValidator);
                    ctrl.$formatters.push(minValidator);
                }
            };
        }
    ).directive('ngMax', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elem, attr, ctrl) {
                scope.$watch(attr.ngMax, function(){
                    ctrl.$setViewValue(ctrl.$viewValue);
                });
                var maxValidator = function(value) {
                    var max = scope.$eval(attr.ngMax) || Infinity;
                    if (!isEmpty(value) && value > max) {
                        ctrl.$setValidity('ngMax', false);
                        return undefined;
                    } else {
                        ctrl.$setValidity('ngMax', true);
                        return value;
                    }
                };

                ctrl.$parsers.push(maxValidator);
                ctrl.$formatters.push(maxValidator);
            }
        };
    }).directive('showPreviewCandidate', function () {
        return {
            scope: {
                candidate: '='
            },
            restrict: 'A',
            link: function (scope, element, attrs) {
                var showDocument = false;
                if(scope.candidate.files){
                    angular.forEach(scope.candidate.files,function(resp){
                        initDocuments(resp);
                        if(resp.showGDocs){
                            showDocument = true;
                            resp.showDocument = true;
                        }
                    });
                }
                if(showDocument){
                    $(element).addClass('attachment');
                    $(element).click(function () {
                        $(this).removeClass('attachment');
                        $(this).addClass('unhide');
                    }, function () {
                        $(this).addClass('attachment');
                        $(this).removeClass('unhide');
                    });
                }else{
                    $(element).addClass('unhide')
                }
            }
        }
    }).directive('myEnter', function () {
        return function (scope, element, attrs) {
            console.log('here');
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.myEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    }).directive('clickOnEnter', function () {
        return function (scope, element, attrs) {
            console.log('here', attrs.clickOnEnter);
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    $(attrs.clickOnEnter).click();

                    event.preventDefault();
                }
            });
        };
    }).directive('filterList', function($timeout) {
        return {
            link: function(scope, element, attrs) {

                var li = Array.prototype.slice.call(element[0].children);
                function filterBy(value) {
                    li.forEach(function(el) {
                        if($(el).attr('role') == 'tab'){
                            el.className = el.outerText.toLowerCase().indexOf(value.toLowerCase()) !== -1 ? 'panel-heading' : 'ng-hide';
                            if(el.outerText.toLowerCase().indexOf(value.toLowerCase()) !== -1){
                                $(el).parent().css({'display': 'block', 'margin-top': '20px'});
                                if(el.className != 'ng-hide'){
                                    $(el).parents('.guideAndWork').find('.mrg-bottom').css('display', 'none');
                                }
                                if(scope.searchFaq.length == 0){
                                    $(el).parents('.guideAndWork').find('.mrg-bottom').css('display', 'block');
                                }
                            }else{
                                $(el).parents('.guideAndWork').find('.mrg-bottom').css('display', 'none');
                                $(el).parent().css('display', 'none');
                            }
                        }else{
                            if(el.textContent.toLowerCase().indexOf(value.toLowerCase()) !== -1){
                                $(el).parent().css('display', 'block');
                                $(el).parent()[0].children[0].className = 'panel-heading';
                            }
                        }
                    });
                }

                scope.$watch(attrs.filterList, function(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        filterBy(newVal);
                    }
                });
            }
        };
    }).directive("fileread", [function () {
        return {
            restrict: 'AE',
            scope: {
                fileread: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            var txt = "";
                            if ('files' in element[0]) {
                                for (var i = 0; i < element[0].files.length; i++) {
                                    var file = element[0].files[i];
                                    if ('name' in file) {
                                        txt += file.name;
                                    }
                                }
                            }
                            scope.fileread = txt;
                        });
                    };
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    }]).directive('selectWithScroll' , [function() {
        return {
            restrict: 'A',
            scope: {
                scrollSize: "=",
                activeClass: "="
            },
            link: function(scope, element) {

                element.on(
                    {
                        mousedown: () => showOptions(event),
                        change: () => reset(event),
                        blur: () =>  reset(event),
                        contextmenu: () => disableContextMenu()
                    }
                );

                let optionsLength = element.children('option').length;
                let showUsers = !(element.attr('size'));
                let selectedOption = null;


                function showOptions(e) {
                    if(showUsers && optionsLength > scope.scrollSize - 1) {
                        element.attr('size', scope.scrollSize);
                        element.addClass(scope.activeClass);
                        showUsers = false;
                    }

                    if(e.target === selectedOption && !showUsers && e.target.tagName.toLowerCase() !== 'select') {
                        reset(e);
                    }

                    if(e.target.tagName.toLowerCase() === 'option') {
                        selectedOption = e.target;
                    }
                }

                function reset(e) {
                    element.removeAttr('size');
                    element.removeClass(scope.activeClass);
                    showUsers = true;
                    if(e.target.tagName.toLowerCase() === 'option') selectedOption = e.target;
                    if(e.type === 'change') element.blur();
                }

                function disableContextMenu() {
                    selectedOption = null;
                    return false;
                }

            }
        }
    }]).directive('fixedHeaderTable', ['$window', function($window) {
        return {
            restrict: 'EA',
            scope: {
                columns: "=",
                secondColumns: "=",
                vacancies: "="
            },
            link: function(scope, element, attrs) {
                scope.$watch('vacancies', function(newValue) {
                    if(newValue) setTable();
                });

                function setTable() {
                    $(element).after('<table class="table" id="header-fixed" columns="10" second-columns="8" style="position: fixed;top: 0;display: none;background-color: inherit; margin-right: 15px;width: 98%"></table>');
                    // setTimeout(function(){
                    var tableOffset = $('#'+ attrs.id).offset().top;
                    /////////////////////////////////////////////////////////////////////////  Id is a must!!!!!!
                    /////////////////////////////////////////////////////////////////////////  ".main-header" is a must!!!!!!
                    console.log($("#header-fixed"));
                    var header = $('#'+ attrs.id + " #main-header").clone();
                    var secondHeader = $('#'+ attrs.id + " #second_header").clone();
                    var $fixedHeader = $("#header-fixed").append(header);
                    $fixedHeader = $("#header-fixed").append(secondHeader);
                    setTimeout(function(){
                        $("#header-fixed #main-header td:nth-child(1)").css('width', '95');
                        $("#header-fixed #main-header td:nth-child(2)").css('width', '95');
                        $("#header-fixed #main-header td:nth-child(3)").css('width', '105');
                        $("#header-fixed #main-header td:nth-child(4)").css('width', '130');
                        $("#header-fixed #main-header td:nth-child(5)").css('width', '92');
                        $("#header-fixed #main-header td:nth-child(6)").css('width', '100');
                        $("#header-fixed #main-header td:nth-child(7)").css('width', '239');
                        $("#header-fixed #main-header td:nth-child(8)").css('width', '271');
                        $("#header-fixed #main-header td:nth-child(9)").css('width', '127');
                        $("#header-fixed #main-header td:nth-child(10)").css('width', '152');
                        //for (var i = 1; i <= scope.columns; i++){
                        //    $("#header-fixed #main-header td:nth-child("+i+")").css('width', $('#'+ attrs.id + " #main-header td:nth-child("+i+")").css('width'));
                        //}
                        if(secondHeader){
                            console.log(scope.secondColumns);
                            $("#header-fixed #second_header td:nth-child(1)").css('width', '105');
                            $("#header-fixed #second_header td:nth-child(2)").css('width', '119');
                            $("#header-fixed #second_header td:nth-child(3)").css('width', '93');
                            $("#header-fixed #second_header td:nth-child(4)").css('width', '119');
                            $("#header-fixed #second_header td:nth-child(5)").css('width', '56');
                            $("#header-fixed #second_header td:nth-child(6)").css('width', '84');
                            $("#header-fixed #second_header td:nth-child(7)").css('width', '88');
                            $("#header-fixed #second_header td:nth-child(8)").css('width', '84');
                            //for (var i = 1; i <= scope.secondColumns; i++){
                            //    $("#header-fixed #second_header td:nth-child("+i+")").css('width', $('#'+ attrs.id + " #second_header td:nth-child("+i+")").css('width'));
                            //}
                        }
                        console.log('done')
                    },1000);

                    $(window).bind("scroll", function() {
                        var offset = $(this).scrollTop();
                        if (offset >= tableOffset && $fixedHeader.is(":hidden")) {
                            if(window.screen.width >= '1400'){
                                $fixedHeader.css('display', 'inline-table');
                                $("#header-fixed #main-header td:nth-child(7)").css('width', '226');
                                $("#header-fixed #main-header td:nth-child(8)").css('width', '225');
                                $("#header-fixed #main-header td:nth-child(9)").css('width', '157');
                                $("#header-fixed #main-header td:nth-child(10)").css('width', '183');
                            }else{
                                $fixedHeader.css('display', 'block');
                            }
                        }
                        else if (offset < tableOffset) {
                            $fixedHeader.hide();
                        }
                    });
                    // },100)
                }
            }
        }
    }]).directive('datepickerForTask', ["$filter",  "$rootScope" ,"$translate", "$route", "Task" ,function($filter,  $rootScope, $translate, $route, Task){
        return {
            restrict:"EA",
            link: function ($scope, element, attrs) {
                $(".editDateTask").datetimepicker({
                    format: "dd/mm/yyyy hh:00",
                    startView: 2,
                    minView: 1,
                    autoclose: true,
                    weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                    language: $translate.use(),
                    initialDate: new Date(),
                    startDate: new Date()
                }).on('changeDate', function (data) {
                    $rootScope.editableTask.targetDate = $('.editDateTask').datetimepicker('getDate');
                    $scope.roundMinutes($rootScope.editableTask.targetDate);
                    Task.changeTargetDate({
                        "taskId": $rootScope.editableTask.taskId,
                        "date":$rootScope.editableTask.targetDate
                    }, function(resp){
                        if($route.current.$$route.pageName != 'Activity'){
                            $rootScope.getHistoryForAllActions();
                            $scope.updateTasks();
                            $scope.getLastEvent();
                        } else{
                            $rootScope.getHistoryForAllActions();
                            $scope.tableParams.reload();
                        }
                    })
                }).on('hide', function () {
                    if ($('.editDateTask').val() == "") {
                        $rootScope.editableTask.date = "";
                    }
                });
            }
        };
    }]).directive('datepickerForReportOnRequest', ["$filter",  "$rootScope" ,"$translate", "Statistic" ,function($filter,  $rootScope, $translate, Statistic){
        return {
            restrict:"EA",
            link: function ($scope, element, attrs) {
                let today = new Date();
                let yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                element.datetimepicker({
                    format: "dd/mm/yyyy",
                    startView: 2,
                    minView: 2,
                    maxView: 4,
                    autoclose: true,
                    weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                    language: $translate.use(),
                    initialDate: yesterday,
                    startDate: new Date($rootScope.me.org.dc),
                    endDate: yesterday
                }).on('changeDate', function (data) {
                    function datepickerDSTfix(dateFromPicker) {
                        let currentTimeZone = (new Date()).getTimezoneOffset();
                        let pickerTimeZone = dateFromPicker.getTimezoneOffset();
                        if(pickerTimeZone == currentTimeZone) {
                            let corrected = new Date(dateFromPicker - dateFromPicker.getMinutes()* 60000 - dateFromPicker.getSeconds()*1000 + currentTimeZone*60000);
                            return corrected - corrected.getHours() * 3600000
                        } else {
                            let timeZoneShift = pickerTimeZone - currentTimeZone;
                            let corrected = new Date(dateFromPicker - dateFromPicker.getMinutes()* 60000 - dateFromPicker.getSeconds()*1000 + currentTimeZone*60000 + timeZoneShift*60000);
                            return corrected - corrected.getHours() * 3600000
                        }
                    }

                    if (data.date != undefined) {
                        Statistic.setParam('requestReportDate', datepickerDSTfix(data.date));
                    }
                }).on('hide', function () {
                    element.blur();
                });
            }
        };
    }]).directive('datepickerOfCustomEditTime', ["$filter",  "$rootScope","$translate" ,function($filter,  $rootScope, $translate){
        return {
            restrict:"EA",
            link: function ($scope, element, attrs) {
                element.datetimepicker({
                    format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy hh:00" : "mm/dd/yyyy hh:00",
                    startView: 2,
                    minView: 1,
                    autoclose: true,
                    language: $translate.use(),
                    weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                    initialDate: new Date(),
                    startDate: new Date(-1262304000000)
                }).on('changeDate', function (val) {
                    var flag = false;

                    function datepickerDSTfix(dateFromPicker) {
                        let currentTimeZone = (new Date()).getTimezoneOffset();
                        let pickerTimeZone = dateFromPicker.getTimezoneOffset();
                        if(pickerTimeZone == currentTimeZone) {
                            return dateFromPicker - dateFromPicker.getMinutes()* 60000 - dateFromPicker.getSeconds()*1000 + currentTimeZone*60000
                        } else {
                            let timeZoneShift = pickerTimeZone - currentTimeZone;
                            return dateFromPicker - dateFromPicker.getMinutes()* 60000 - dateFromPicker.getSeconds()*1000 + currentTimeZone*60000 + timeZoneShift*60000
                        }
                    }

                    if (val.date != undefined) {
                        $scope.editCustomValueDate = datepickerDSTfix(val.date);
                        if($scope[$scope.objType].fieldValues &&  $scope[$scope.objType].fieldValues.length > 0){
                            angular.forEach($scope[$scope.objType].fieldValues, function(val) {
                                if (val.field.fieldId == $scope.editCustomId) {
                                    val.dateTimeValue = $scope.editCustomValueDate;
                                    flag = true;
                                }
                            });
                            if(!flag){
                                $scope[$scope.objType].fieldValues.push({
                                    objType: $scope.objType,
                                    dateTimeValue: $scope.editCustomValueDate,
                                    fieldValueId: $scope.editCustomFieldValueId,
                                    field: {
                                        fieldId: $scope.editCustomId
                                    }
                                });
                            }
                        }else{
                            $scope[$scope.objType].fieldValues.push({
                                objType: $scope.objType,
                                dateTimeValue: $scope.editCustomValueDate,
                                fieldValueId: $scope.editCustomFieldValueId,
                                field : {
                                    fieldId:  $scope.editCustomId
                                }
                            });
                        }
                    }
                }).on('hide', function (val) {
                    if ($(element).name == $scope.editCustomId) {
                        console.log($scope[$scope.objType], '$scope[$scope.objType].fieldValue');
                        angular.forEach($scope[$scope.objType].fieldValues, function (nval) {
                            if ($(element).value != '') {
                                if ($scope.editCustomId == nval.field.fieldId) {
                                    nval.dateTimeValue = "";
                                }
                            }
                        });
                    }
                    $(element).blur();
                });
            }
        };
    }]).directive('datepickerOfCustomEdit', ["$filter",  "$rootScope","$translate" ,function($filter,  $rootScope, $translate){
        return {
            restrict:"EA",
            link: function ($scope, element, attrs) {
                $(element).datetimepicker({
                    format: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? "dd/mm/yyyy" : "mm/dd/yyyy",
                    startView: 4,
                    minView: 2,
                    autoclose: true,
                    language: $translate.use(),
                    weekStart: $rootScope.currentLang == 'ru' || $rootScope.currentLang == 'ua' ? 1 : 7,
                    initialDate: new Date(),
                    startDate: new Date(-1262304000000)
                }).on('changeDate', function (val) {
                    var flag = false;
                    if (val.date != undefined) {
                        $scope.editCustomValueDate = val.date.getTime();
                        console.log($scope[$scope.objType].fieldValues, '$scope[$scope.objType].fieldValuesDate');
                        if ($scope[$scope.objType].fieldValues &&  $scope[$scope.objType].fieldValues.length > 0) {

                            console.log('1date');
                            angular.forEach($scope[$scope.objType].fieldValues, function (val) {
                                if (val.field.fieldId == $scope.editCustomId) {
                                    val.dateTimeValue = $scope.editCustomValueDate;
                                    flag = true;
                                    console.log('flag = true;');
                                }
                            });

                            if(!flag){

                                $scope[$scope.objType].fieldValues.push({
                                    objType: $scope.objType,
                                    dateTimeValue: $scope.editCustomValueDate,
                                    fieldValueId: $scope.editCustomFieldValueId,
                                    field: {
                                        fieldId: $scope.editCustomId
                                    }
                                });
                            }
                        } else {
                            console.log('2date');

                            // $scope[$scope.objType].fieldValues = [];

                            $scope[$scope.objType].fieldValues.push({
                                objType: $scope.objType,
                                dateTimeValue: $scope.editCustomValueDate,
                                fieldValueId: $scope.editCustomFieldValueId,
                                field: {
                                    fieldId: $scope.editCustomId
                                }
                            });
                        }
                        console.log($scope[$scope.objType].fieldValues, '$scope[$scope.objType].fieldValues');
                    }
                }).on('hide', function () {
                    if ($(element).name == $scope.editCustomId) {
                        console.log($scope[$scope.objType], '$scope[$scope.objType].fieldValue');

                        angular.forEach($scope[$scope.objType].fieldValues, function (nval) {
                            if ($(element).value != '') {
                                if ($scope.editCustomId == nval.field.fieldId) {
                                    nval.dateTimeValue = "";
                                }
                            }
                        });
                    }
                    $(element).blur();
                });

            },

        };
    }]).directive('customScrollbarPagination', function() {
            return function(scope, element, attrs) {
                $(element).mCustomScrollbar({
                    theme: 'dark-3',
                    scrollInertia:1000
                });
            }
        }
    ).directive("navPagination", [ function () {
        return {
            restrict: 'AE',
            templateUrl: '../partials/pagination.html?1',
            link: function (scope, element, attributes) {
                let pagePickerButtons = element.find('.left-block .pager-round-button');
                scope.$watch('paginationParams', function (newValue, oldValue) {
                    if(newValue)
                        scope.totalPagesCount = Math.ceil(newValue.totalCount/scope.params.count());
                    if(pagePickerButtons) {
                        if(scope.totalPagesCount > 9999) {
                            pagePickerButtons.css({"min-width": "55px"});
                        } else if(scope.totalPagesCount > 999) {
                            pagePickerButtons.css({"min-width": "46px"});
                        } else {
                            pagePickerButtons.css({"min-width": "37px"});
                        }
                    }
                });
            }
        }
    }]).directive("paginationSelect", [function () {
        return {
            restrict: 'AE',
            link: function (scope, element, attributes) {
                let startPos = 1;
                let lastPos = 1;
                let expanded = false;
                let heightDropList = 100;
                let widthDropList = 37;
                let drListElement = element.find('.pagination-droplist');
                let elementWrapper = element.find('.pagination-droplist-2');
                let totalPages;

                scope.$watch('paginationParams', function (newValue, oldValue) {
                    hideDropdown();
                    if(newValue)
                        totalPages = Math.ceil(newValue.totalCount/scope.params.count());
                    if(totalPages > 5) {
                        startPos = firstPageNumber(totalPages, scope.paginationParams.currentPage+1);
                        lastPos = lastPageNumber(totalPages, scope.paginationParams.currentPage+1);
                        formingElement(startPos, lastPos);
                        bindListeners(heightDropList, widthDropList);
                    }
                });

                function lastPageNumber(totalPages, currentPage) {
                    if(totalPages == 6) {
                        switch (true) {
                            case (currentPage == 3):
                                return 5;
                            case (currentPage == 4):
                                return 3;
                            default:
                                return 4
                        }
                    } else {
                        switch (true) {
                            case (currentPage < 3 || currentPage > totalPages - 2):
                                return totalPages - 2;
                            default:
                                return (currentPage - 1)
                        }
                    }
                }

                function firstPageNumber(totalPages, currentPage) {
                    if(totalPages == 6) {
                        switch (currentPage) {
                            case 3:
                                return 4;
                            case  4:
                                return 2;
                            default:
                                return 3
                        }
                    } else {
                        switch (true) {
                            case (currentPage < 3):
                                return 3;
                            case (currentPage == 3):
                                return 4;
                            case (currentPage > 3 && currentPage < totalPages - 1):
                                return 2;
                            case (currentPage >= totalPages - 1):
                                return 3;
                        }
                    }
                }

                function hideDropdown() {
                    if(elementWrapper) {
                        elementWrapper.css({
                            "height": "0",
                            "border": "none"
                        });
                        expanded = false;
                    }
                }

                function bindListeners(height, width) {
                    element.unbind().on('mousedown',(event) => {
                        if(expanded && hideIfNotScrollBar(event)) {
                            hideDropdown();
                        } else {
                            expanded = true;

                            elementWrapper.css({
                                "height": height,
                                "width": width,
                                "border": "1px solid #aaa"
                            });
                        }
                    });
                    element.find('li').on('mousedown',(event) => {
                        if(event.target.value) {
                            scope.params.page(event.target.value);
                            scope.$apply();
                        }
                    });
                    $('body').on('mousedown', (event) => {
                        if(hideIfNotScrollBar(event)) {
                            if(!$(event.target).is(element)) {
                                hideDropdown();
                            }
                        }
                    })
                }

                function hideIfNotScrollBar(event) {
                    let classListOfTarget = [];
                    for(let i = event.target.classList.length - 1 ; i >= 0; i--) {
                        classListOfTarget.push(event.target.classList[i]);
                    }
                    if(classListOfTarget && (classListOfTarget.indexOf('_mCS_2') != -1 || classListOfTarget.indexOf('mCSB_dragger_bar') != -1 || classListOfTarget.indexOf('mCSB_dragger') != -1 || classListOfTarget.indexOf('mCSB_draggerRail') != -1)) {
                        return false
                    } else {
                        return true
                    }
                }

                function formingElement(startPage, lastPage) {
                    let pagesList = '';
                    let elementsCount = lastPage - startPage + 1;
                    if(elementsCount < 200) {
                        for(let i = startPage; i <= lastPage; i++){
                            pagesList += '<li value =" ' + i + '">' + i + '</li>';
                        }
                    } else {
                        for(let i = startPage; i <= lastPage &&  i - startPage <= 100; i++){
                            pagesList += '<li value =" ' + i + '">' + i + '</li>';
                        }
                        pagesList += '<li class="ellipsis" value ="...">...</li>';
                        for(let b = lastPage - 100; b <= lastPage; b++){
                            pagesList += '<li value =" ' + b + '">' + b + '</li>';
                        }
                    }

                    drListElement.html(pagesList);
                    if(elementsCount < 5) {
                        heightDropList = 20*(elementsCount);
                    } else {
                        heightDropList = 100;
                    }
                    if(lastPage > 999) {
                        widthDropList = 57;
                    } else if(lastPage > 99) {
                        widthDropList = 49;
                    } else {
                        widthDropList = 37;
                    }
                    return drListElement
                }

            }
        }
    }]).directive("paginationSecondSelect", [ function () {
        return {
            restrict: 'AE',
            link: function (scope, element, attributes) {
                let startPos = 1;
                let lastPos = 1;
                let expanded = false;
                let heightDropList = 100;
                let widthDropList = 37;
                let drListElement = element.find('.pagination-droplist');
                let elementWrapper = element.find('.pagination-droplist-2');
                let totalPages;

                scope.$watch('paginationParams', function (newValue, oldValue) {
                    hideDropdown();
                    if(newValue)
                        totalPages = Math.ceil(newValue.totalCount/scope.params.count());
                    if(totalPages > 5) {
                        startPos = scope.paginationParams.currentPage + 2;
                        lastPos = totalPages - 1;
                        formingElement(startPos, lastPos);
                        bindListeners(heightDropList, widthDropList);
                    }
                });

                function hideDropdown() {
                    if(elementWrapper) {
                        elementWrapper.css({
                            "height": "0",
                            "border": "none"
                        });
                        expanded = false;
                    }
                }

                function bindListeners(height, width) {
                    element.unbind().on('mousedown',(event) => {
                        if(expanded && hideIfNotScrollBar(event)) {
                            hideDropdown();
                        } else {
                            expanded = true;
                            elementWrapper.css({
                                "height": height,
                                "width": width,
                                "border": "1px solid #aaa"
                            });
                        }
                    });
                    element.find('li').on('mousedown',(event) => {
                        if(event.target.value) {
                            scope.params.page(event.target.value);
                            scope.$apply();
                        }
                    });
                    $('body').on('mousedown', (event) => {
                        if(hideIfNotScrollBar(event)) {
                            if(!$(event.target).is(element)) {
                                hideDropdown();
                            }
                        }
                    })
                }

                function hideIfNotScrollBar(event) {
                    let classListOfTarget = [];
                    for(let i = event.target.classList.length - 1 ; i >= 0; i--) {
                        classListOfTarget.push(event.target.classList[i]);
                    }
                    if(classListOfTarget && (classListOfTarget.indexOf('_mCS_2') != -1 || classListOfTarget.indexOf('mCSB_dragger_bar') != -1 || classListOfTarget.indexOf('mCSB_dragger') != -1 || classListOfTarget.indexOf('mCSB_draggerRail') != -1)) {
                        return false
                    } else {
                        return true
                    }
                }

                function formingElement(startPage, lastPage) {
                    let pagesList = '';
                    let elementsCount = lastPage - startPage + 1;
                    if(elementsCount < 200) {
                        for(let i = startPage; i <= lastPage; i++){
                            pagesList += '<li value =" ' + i + '">' + i + '</li>';
                        }
                    } else {
                        for(let i = startPage; i <= lastPage &&  i - startPage <= 100; i++){
                            pagesList += '<li value =" ' + i + '">' + i + '</li>';
                        }
                        pagesList += '<li class="ellipsis" value ="...">...</li>';
                        for(let b = lastPage - 100; b <= lastPage; b++){
                            pagesList += '<li value =" ' + b + '">' + b + '</li>';
                        }
                    }

                    drListElement.html(pagesList);
                    if(elementsCount < 5) {
                        heightDropList = 20*(elementsCount);
                    } else {
                        heightDropList = 100;
                    }
                    if(lastPage > 999) {
                        widthDropList = 57;
                    } else if(lastPage > 99) {
                        widthDropList = 49;
                    } else {
                        widthDropList = 37;
                    }
                    return drListElement
                }

            }
        }
    }])
    .directive("customSelect",setCustomSelect)
    .directive("errorPopup", removePopUp)
    .directive("removedPerson", removedPerson);


function removedPerson($compile){
    let restrict  = "EACM";
    return {
        restrict,
        link(scope, element, attrs){
            let user = element.find('.user').clone(),
                dataHistory = scope.history,
                angularElement, compileFn;

            if(setRemoveConfig(user, dataHistory)) return;

            angularElement = angular.element(user);
            compileFn = $compile(angularElement)(scope);
            element.find('.user').replaceWith(angularElement[0])
        }
    }
}

function setRemoveConfig(user, dataHistory) {
    if(dataHistory.person.status !== 'D') return true;

    user.addClass('remove-user');
    user.attr('error-popup', '');
    user.attr('href', '');
    user[0].dataset.error = "User deleted from account";
}

function removePopUp(notificationService, $translate){
    let restrict  = "EACM";
        return {
        restrict,
        link(scope, element, attrs){
            element[0].onclick = function () {
                notificationService.error($translate.instant(this.dataset.error));
            };
        }
    }
}

function setCustomSelect($rootScope){
    let restrict  = "EACM",
        scope = {
            data:"=",
            model:"=",
            placeholder:"@",
            method:"=",
            $scope:"=",
            event:"=",
            new:"@"
        },
        template = `
        <div class="select clearfix">
            <input type="text" ng-model="model" placeholder="{{placeholder|translate}}" readonly class="form-control col-lg-12 select-input-field">
            <div class="dropdown-content" style="z-index: -999">
                <ul>
                    <li ng-repeat="item in data track by $index" ng-click="method(item, $scope, $event, $index)" ng-class="{disable: (item.status == 'N')}">{{item.text|translate}}</li>
                </ul>
            </div>
             <span class="new-label" ng-show="new" style="right: 0px;">new</span>
        </div>`;
    return {
        restrict,
        scope,
        template,
        link(scope, element, attrs){

        }
    }
};

function similar_text(first, second, percent) {
    if (first === null || second === null || typeof first === 'undefined' || typeof second === 'undefined') {
        return 0;
    }
    first += '';
    second += '';
    var pos1 = 0,
        pos2 = 0,
        max = 0,
        firstLength = first.length,
        secondLength = second.length,
        p, q, l, sum;
    max = 0;
    for (p = 0; p < firstLength; p++) {
        for (q = 0; q < secondLength; q++) {
            for (l = 0;
                 (p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++)
                ;
            if (l > max) {
                max = l;
                pos1 = p;
                pos2 = q;
            }
        }
    }
    sum = max;
    if (sum) {
        if (pos1 && pos2) {
            sum += similar_text(first.substr(0, pos1), second.substr(0, pos2));
        }
        if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
            sum += similar_text(first.substr(pos1 + max, firstLength - pos1 - max), second.substr(pos2 + max,
                secondLength - pos2 - max));
        }
    }
    if (!percent) {
        return sum;
    } else {
        return (sum * 200) / (firstLength + secondLength);
    }
}


function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;
    while (element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return {x: xPosition, y: yPosition};
}

function createSpanForInterviewStatusHistory(arrname, status, $filter, short) {
    var span = "<span style='border-radius: 5px;padding-left: 4px;padding-right: 4px;color:white;background-color:";
    switch (status) {
        case "longlist":
            return span + "#9eacc3'>" + $filter('translate')("interview_status_assoc_full.longlist") + "</span>";
        case "shortlist":
            return span + "#b5c3da;'>" + $filter('translate')("interview_status_assoc_full.shortlist") + "</span>";
        case "interview":
            return span + "#f09c99'>" + $filter('translate')("interview_status_assoc_full.interview") + "</span>";
        case "notafit":
            return span + "#71a6b1'>" + $filter('translate')("interview_status_assoc_full.notafit") + "</span>";
        case "approved":
            return span + "#b5d6a8'>" + $filter('translate')("interview_status_assoc_full.approved") + "</span>";
        case "declinedoffer":
            return span + "#d9a9bf'>" + $filter('translate')("interview_status_assoc_full.declinedoffer") + "</span>";
        case "completed":
            return span + "#f1f1f1'>" + $filter('translate')("interview_status_assoc.completed") + "</span>";

        default:
            if (short && status == "interview_with_the_boss") {
                return span + "#CBB4AB'>" + $filter('translate')(status + "_short") + "</span>"
            } else {
                if(arrname){
                    return span + "#CBB4AB'>" + $filter('translate')(arrname + "." + status) + "</span>"
                } else{
                    return span + "#CBB4AB'>" + $filter('translate')(arrname + status) + "</span>"
                }
            }
    }
}

function createDivForInterviewStatusHistory(status, $filter) {
    var span = "<div class='grey-hover vacancy-stages' style='border-radius: 5px;padding-left: 4px;padding-right: 4px;color:white;background-color:";
    switch (status) {
        case "longlist":
            return span + "#5e6d86'>" + $filter('translate')("interview_status_assoc_full.longlist") + "</div>";
        case "shortlist":
            return span + "#7887a0;'>" + $filter('translate')("interview_status_assoc_full.shortlist") + "</div>";
        case "interview":
            return span + "#3E3773'>" + $filter('translate')("interview_status_assoc_full.interview") + "</div>";
        case "notafit":
            return span + "#407682'>" + $filter('translate')("interview_status_assoc_full.notafit") + "</div>";
        case "approved":
            return span + "#76a563'>" + $filter('translate')("interview_status_assoc_full.approved") + "</div>";
        case "declinedoffer":
            return span + "#a56484'>" + $filter('translate')("interview_status_assoc_full.declinedoffer") + "</div>";
        default:
            return span + "rgba(88,88,88,0.96)'>" + $filter('translate')(status) + "</div>"
    }
}
