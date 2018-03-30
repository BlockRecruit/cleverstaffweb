component.component('sentMailingStatus',{
    bindings: {
        sent: '=',
        delivered: '<',
        opened: '<'
    },
    template: `
                <div class="stat-sent" ng-class="{'not-completed': $ctrl.sent == 0}" title="{{$ctrl.titleTexts.sent}}" ng-bind="$ctrl.sent"></div>
                <div class="stat-delivered" ng-class="{'not-completed': $ctrl.delivered < $ctrl.sent || $ctrl.sent == 0}" title="{{$ctrl.titleTexts.delivered}}" ng-bind="$ctrl.delivered"></div>
                <div class="stat-opened" ng-class="{'not-completed': $ctrl.opened < $ctrl.sent || $ctrl.sent == 0}" title="{{$ctrl.titleTexts.opened}}" ng-bind="$ctrl.opened"></div>
               `,
    controller: function ($translate) {
        $('.status-panel').tooltip();
        this.$onInit = function () {
            this.opened = (this.opened <= this.sent?this.opened:this.sent);
            let titleTextsPerc = {
                delivered: (Math.round(this.delivered/this.sent*10000))/100,
                opened: (Math.round(this.opened/this.sent*10000))/100
            };
            let titleTextsAbs = {
                sent: (this.sent ? this.sent : this.sent = 0),
                delivered: (this.delivered ? this.delivered : this.delivered = 0),
                opened: (this.opened ? this.opened : this.opened = 0)
            };
            this.titleTexts = {
                sent: $translate.instant('Sent_stat') + ': ' + titleTextsAbs.sent,
                delivered: $translate.instant('Delivered_stat') + ': ' + titleTextsAbs.delivered + ' (' + titleTextsPerc.delivered + '%)',
                opened: $translate.instant('Opened_stat') + ': ' + titleTextsAbs.opened + ' (' + titleTextsPerc.opened + '%)',
            };
        };
    },
    controllerAs: '$ctrl'

}).component('slideStatisticListCol2',{
    bindings:{
        candidatesList: '<'
    },
    template: `<div class="slide-list-wrapper">
                    <div class="header row">
                        <div class="col-lg-6 first-cell" translate="full_name"></div>
                        <div class="col-lg-6 last-cell" translate="email" ng-class="{'with-scroll': $ctrl.candidatesList.length >= 10}"></div>
                    </div>
                    <div class="candidates-list-wrapper">
                        <div class="row" ng-repeat="candidate in $ctrl.candidatesList">
                            <div class="col-lg-6 first-cell" ><a href="!#/candidates/{{candidate.localId}}" target="_blank" ng-bind="candidate.name"></a></div>
                            <div ng-bind="candidate.email" class="col-lg-6 last-cell"></div>
                        </div>
                    </div>
               </div>`,
    controllerAs: '$ctrl'
}).component('slideStatisticListCol3',{
    bindings:{
        candidatesList: '<'
    },
    template: `<div class="slide-list-wrapper">
                    <div class="header row">
                        <div class="col-lg-4 first-cell" translate="full_name"></div>
                        <div class="col-lg-4" translate="email"></div>
                        <div class="col-lg-4 last-cell" translate="openings" ng-class="{'with-scroll': $ctrl.candidatesList.length >= 10}"></div>
                    </div>
                    <div class="candidates-list-wrapper">
                        <div class="row" ng-repeat="candidate in $ctrl.candidatesList">
                            <div class="col-lg-4 first-cell" ><a href="!#/candidates/{{candidate.localId}}" target="_blank" ng-bind="candidate.name"></a></div>
                            <div ng-bind="candidate.email" class="col-lg-4"></div>
                            <div class="col-lg-4 last-cell" ng-bind="candidate.opensCount"></div>
                        </div>
                    </div>
               </div>`,
    controllerAs: '$ctrl'
});