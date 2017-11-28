controller.controller('evaluationController', ["$scope", "$rootScope", "$timeout", "$window", "$translate", "Person", function($scope, $rootScope, $timeout, $window, $translate, Person) {
    Person.getMe(function(resp) {
        if (resp.login) {
            $.ajax({
                url: "/hr/person/checkEmail",
                type: "GET",
                data: "email=" + resp.login + "&lang=en",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data) {
                    if (data.status === "ok") {
                        $scope.isSignUp = false;
                    } else {
                        $scope.isSignUp = localStorage.getItem("demo_social") && localStorage.getItem("demo_social_code");
                    }
                }
            });
        } else {
            $scope.isSignUp = false;
        }
    });


    $scope.toSignup = function() {
        if ($scope.isSignUp) {
            $scope.signin()
        } else {
            var url = "/signup";
            if ($translate.use() === 'ua') {
                url += '-ua';
            } else if ($translate.use() === 'en') {
                url += '-en';
            }
            if ($rootScope.me.login != 'leonid.martovskiy@fargopersonal.net' && $rootScope.me.login != 'lorne.malvo@fargorecruitment.net') {
                url += ("?login=" + $rootScope.me.login + "&name=" + $rootScope.me.fullName + "&company=" + $rootScope.me.orgName);
                if ($rootScope.me.phone !== undefined) {
                    url += "&phone=" + $rootScope.me.phone;
                }
                if (localStorage.demo_social) {
                    url += "&s=" + localStorage.getItem("demo_social");
                }
                $window.location.replace(url);
            } else {
                $window.location.replace(url);
            }
        }

    };

    $scope.signin = function(code, social) {
        $scope.signinLoading = true;
        $.ajax({
            url: "/hr/person/auth",
            type: "POST",
            data: '{"socialKey":"' + localStorage.getItem("demo_social_code") + '","social":"' + localStorage.getItem("demo_social") + '","lang":"' + $translate.use() + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
                $scope.signinLoading = false;
                console.log(data);
                if (data.personId !== undefined) {
                    window.location.replace("/!#/organizer");
                } else {
                    window.location.replace("/?q=auth");
                }
                localStorage.removeItem("demo_social_code");
                localStorage.removeItem("demo_social");
            },
            error: function(){
                $scope.signinLoading = false;
                window.location.replace("/?q=auth");
            }
        });
    }
}]);
