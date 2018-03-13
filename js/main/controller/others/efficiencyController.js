controller.controller('EfficiencyController', ["$scope", "$rootScope", "$filter", "$window", "Efficiency", "googleService", "notificationService", function($scope, $rootScope, $filter, $window, Efficiency, googleService, notificationService) {
    $scope.extensionHas = false;
    $scope.showConnectEmail = true;
    if ($rootScope.eventListenerPing) {
        document.removeEventListener('cleverstaffExtensionPong', $rootScope.eventListenerPing);
    }
    $rootScope.eventListenerPing = function(event) {
        console.log('extension has');
        $scope.extensionHas = true;
    };
    document.addEventListener('cleverstaffExtensionPong', $rootScope.eventListenerPing);
    document.dispatchEvent(new CustomEvent('cleverstaffExtensionPing'));

    $scope.getPlugin = function() {
        if (navigator.saysWho.indexOf("Chrome") != -1) {
            $window.open("https://chrome.google.com/webstore/detail/ats-extension/ibfoabadoicmplbdpmchomcagkpmfama");
        } else if (navigator.saysWho.indexOf("Firefox") != -1) {
            //$window.open("https://addons.mozilla.org/firefox/addon/cleverstaff_extension");
            $window.open("/extension/CleverstaffExtension4Firefox.xpi");
        } else {
            $("#bad-browser-modal").modal("show");
        }
    };
    $scope.getBrowser = function() {
        if (navigator.saysWho.indexOf("Chrome") != -1) {
            return "Chrome";
        } else if (navigator.saysWho.indexOf("Firefox") != -1) {
            return "Firefox";
        } else {
            return $filter("translate")("browser");
        }
    };
    $scope.isGoodBrowser = function() {
        return $scope.getBrowser() === "Chrome" || $scope.getBrowser() === "Firefox";
    };

    $scope.connectGoogleCalendar = function() {
        if (!$rootScope.me.googleMail) {
            $rootScope.curentOnlyMenWatch = $rootScope.$watch('g_info', function(val) {
                if ($rootScope.g_info !== undefined && $rootScope.g_info.email !== undefined) {
                    Person.setSocial({email: $rootScope.g_info.email, social: "google"}, function(resp) {
                        if (resp.status && angular.equals(resp.status, "error")) {
                            notificationService.error(resp.message);
                            $rootScope.g_info = null;
                        } else {
                            if ($scope.user) {
                                $scope.user.googleMail = $rootScope.g_info.email;
                            }
                            notificationService.success($filter('translate')("gmail change"));
                            googleService.login();
                            $rootScope.initGoogleCalendar = true;
                        }
                    }, function() {
                        //notificationService.error($filter('translate')('service temporarily unvailable'));
                        $rootScope.g_info = null;
                    });
                    $rootScope.curentOnlyMenWatch();
                }
            });
            googleService.loginLink(function(resp) {
            });
        } else {
            googleService.login();
            $rootScope.initGoogleCalendar = true;
        }
    };

    Efficiency.get(function(resp) {
        console.log(resp)
    });

}]);
