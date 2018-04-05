angular.module('services.reportsService', [
    'ngResource'
]).factory('reportsService', ['$rootScope', '$resource', 'serverAddress','$uibModal','$location', '$window', function($rootScope, $resource, serverAddress, $uibModal, $location, $window ) {
    let reportsData = {};
        reportsData.reportsBlocks = [
            {
                src:"images/reports-img/voronka.png",
                title:"Funnel and vacancy report",
                description:"The recruitment funnel displays the conversion of candidates in vacancies and helps to identify the bottlenecks or forgotten candidates.",
                href:"/reports/vacancy"
            },
            {
                src:"images/reports-img/statistika.png",
                title:" User statistics",
                description:"Displays the effectiveness of recruiters in numbers and percentages for the chosen period.",
                href:"/reports/statistics"
            },
            {
                src:"images/reports-img/pipeline.png",
                title:"Pipeline report",
                description:"Displays problem vacancies and responsible employees and helps to determine which areas need to be strengthened.",
                href:"/reports/pipeline"
            }
        ];

        function inviteHiringManager() {
            $rootScope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/modal/invite-hiring-manager.html',
                size: '',
                resolve: function(){

                }
            });
            $rootScope.modalInstance.opened.then(function(){
                $rootScope.inviteUser.role = 'client';
            });
            $rootScope.modalInstance.closed.then(function() {
                $rootScope.inviteUser.role = null;
                $rootScope.inviteUser.email = null;
            });
        }
        
        function replaceClassName(nameFirst, newNameSecond, element) {
            element.classList.toggle(nameFirst);
            element.classList.add(newNameSecond);
        }

        function showMore() {
            let defaultHeightBlockReportsList = getComputedStyle(document.querySelector('.custom-reports-list'))['maxHeight'],
                blockReportsList = document.querySelector('.custom-reports-list'),
                blockShowMore = document.querySelector('.show-more');

            this.showMore  = function () {
                let scrollHeightBlockReportsList = blockReportsList.scrollHeight;

                (blockReportsList.classList.contains('show'))? blockReportsList.style.maxHeight = defaultHeightBlockReportsList : blockReportsList.style.maxHeight = scrollHeightBlockReportsList + 'px';

                blockReportsList.classList.toggle('show');
                blockShowMore.classList.toggle('border-bottom');
                this.isShowMore = !this.isShowMore;
                replaceClassName('fa-angle-down', 'fa-angle-up', blockShowMore.querySelector('.fa'));
            }
        }

        reportsData.showMore = showMore;
        reportsData.inviteHiringManager = inviteHiringManager;

    return reportsData;
}]);

