controller.controller('PublicCompanyController', ['$scope', '$rootScope', 'serverAddress', 'Service', 'Company',
    'notificationService', '$routeParams', '$window','$filter',
    function ($scope, $rootScope, serverAddress, Service, Company, notificationService, $routeParams, $window, $filter) {

        $scope.loaded = false;
        $scope.hideSearchPositions = true;
        $scope.showFilterSettings = false;

        $scope.vacanciesLocation = null;
        $scope.vacanciesPosition = null;
        $scope.vacanciesPositionFiltered = null;

        $scope.errorHandler = {
          vacanciesFilter: {
              positionError: false,
              locationError: false,
              error: {
                  show: false,
                  msg: "No vacancies found."
              }
          }
        };

        let filteredVacancies = [],
            selectedPosition = null,
            selectedLocation = null,
            filterIsActive = false;

        $('body').on(
            {
                mousedown: () => closeAutoCompletePositions(event)
            }
        );

        $scope.toggleFilter = function() {
          console.log($scope.showFilterSettings);
          if($scope.showFilterSettings) {
              $scope.showFilter();
          } else {
              $scope.hideFilter();
          }
        };

        $scope.hideFilter = function() {
            $scope.showFilterSettings = false;
            filterIsActive = false;
        };

        $scope.showFilter = function() {
            $scope.showFilterSettings = true;
        };

        $scope.filter = function(vacancy) {
            // if(!filterIsActive && !$scope.hideSearchPositions) return true;
            if(!filterIsActive) return true;

            let criteria = {};

            if(!selectedLocation || vacancy.region && vacancy.region.country.toLowerCase() === selectedLocation.toLowerCase() || selectedLocation === 'Any') criteria.location = true;
            if(!selectedPosition || vacancy.position.toLowerCase() === selectedPosition.toLowerCase()) criteria.position = true;

            if(criteria.position && criteria.location && filteredVacancies.indexOf(vacancy) === -1) filteredVacancies.push(vacancy);

            if(filteredVacancies.length === 0) {
                $scope.errorHandler.vacanciesFilter.error.show = true;
            } else {
                $scope.errorHandler.vacanciesFilter.error.show = false;
            }

            return criteria.position && criteria.location;
        };

        $scope.setAutoCompleteString = function(event) {
            $scope.vacanciesPositionFiltered = Company.positionAutoCompleteResult(event.target.value);

            if($scope.vacanciesPositionFiltered.length !== $scope.orgParams.objects.length) {
                checkAutoCompletePosition();
            } else {
                $scope.hideSearchPositions = true;
                $scope.errorHandler.vacanciesFilter.positionError = false;
            }
        };

        $scope.selectPosition = function(position) {
            $('input.vacancy-position').val(position);
            $scope.vacanciesPositionFiltered = null;
            $scope.errorHandler.vacanciesFilter.positionError = false;
            $scope.hideSearchPositions = true;
        };

        $scope.showFilteredVacancies = function() {
          filterIsActive = true;
          filteredVacancies = [];
          selectedLocation = $('.locations-wrap select option:checked').val();
          selectedPosition = $('.positions-wrap input.vacancy-position').val();
        };

        $scope.resetPosition = function() {
            $('.positions-wrap input.vacancy-position').val("");
            $scope.hideSearchPositions = true;
            $scope.errorHandler.vacanciesFilter.positionError = false;
        };

         function getAllVacancyForCompany(){
            let string = $routeParams.nameAlias.replace('-vacancies', '');
            Company.getAllOpenVacancies(string)
                .then((resp) => {
                    $scope.orgParams = resp;

                    $window.document.title = $scope.orgParams.orgName + ' ' + 'vacancies';
                    $scope.logoLink = '/hr/getlogo?id=' + $scope.orgParams.companyLogo + '';
                    $scope.serverAddress = serverAddress;

                    $scope.vacanciesLocation = Company.getVacanciesLocation();
                    $scope.vacanciesPosition = Company.getVacanciesPosition();
                    $scope.loaded = true;
                    $scope.$apply();
                }, (err) => {
                    console.error(err);
                });
        }

        function checkAutoCompletePosition() {
            let inputPosition = $('.positions-wrap input.vacancy-position'),
                checked = false;

            $scope.vacanciesPosition.forEach((position) => {
                if(position.toLowerCase() === inputPosition.val().toLowerCase()) checked = true;
            });

            if(checked) {
                // $scope.hideSearchPositions = true;
                $scope.errorHandler.vacanciesFilter.positionError = false;
            } else {
                $scope.hideSearchPositions = false;
                $scope.errorHandler.vacanciesFilter.positionError = true;
                // $scope.errorHandler.vacanciesFilter.error.msg = "No vacancies found. Try to pick position from a suggested list."
            }
        }

        function closeAutoCompletePositions(e) {
            if(!$(e.target).hasClass('auto-complete-position') && !$scope.hideSearchPositions) {
                checkAutoCompletePosition();
                $scope.hideSearchPositions = true;
                $scope.$apply();
            }
        }

        getAllVacancyForCompany();
    }]
);
