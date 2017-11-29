angular.module('services', [
        'services.candidate',
        'services.file',
        'services.globalService',
        'services.localStorage',
        'services.notice',
        'services.person',
        'services.transliteration'
    ]
);

function parseLinkedInInformationForRecall(me, $scope) {
        var user = {
                education: me.values[0].educations,
                firstName: me.values[0].firstName,
                lastName: me.values[0].lastName,
                headline: me.values[0].headline,
                positions: me.values[0].positions,
                email: me.values[0].emailAddress

        };
        if (me.values[0].siteStandardProfileRequest && me.values[0].siteStandardProfileRequest.url) {
                user.link = me.values[0].siteStandardProfileRequest.url.split("&authType=")[0];
                var split = me.values[0].siteStandardProfileRequest.url.split("id=");
                if (split.length == 2) {
                        var splitChildOne = split[1];
                        if (splitChildOne.length > 1) {
                                var splitChildTwo = splitChildOne.split("&");
                                if (splitChildTwo.length > 0) {
                                        user.id = splitChildTwo[0];

                                }
                        }
                }
        }
        var phone = null;
        if (me.values[0].phoneNumbers != undefined) {
                angular.forEach(me.values[0].phoneNumbers.values, function(val) {
                        if (val.phoneType == 'mobile') {
                                user.phone = val.phoneNumber.replace(/[`~!@#$%^&*()\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s+/g, "");
                        }
                })
        }
        var info;
        if (user.firstName) {
                info = user.firstName + " "
        }
        if (user.lastName) {
                info = user.lastName + '\n';
        }
        if (user.headline) {
                info = info + user.headline + '\n';
        }
        if (user.email) {
                info = info + user.email + '\n';
        }
        if (user.positions) {
                info = info + '------------------- \n';
                info = info + 'Experience \n';
                info = info + '------------------- \n';
                angular.forEach(user.positions.values, function(pos, iter) {
                        var j = iter > 0 ? "--------- \n" : "";
                        info = info + j;
                        var posI = "";
                        if (pos.title) {
                                posI = posI + pos.title;
                        }
                        if (pos.company.name) {
                                posI = posI + " at " + pos.company.name + '\n';
                        }
                        if (pos.startDate) {
                                posI = posI + pos.startDate.month + '/' + pos.startDate.year;
                        }
                        if (pos.endDate) {
                                posI = posI + " to " + pos.endDate.month + '/' + pos.endDate.year;
                        } else {
                                posI = posI + " to Present";
                        }
                        info = info + posI + "\n";
                })

        }
        if (user.education) {
                info = info + '------------------- \n';
                info = info + 'Education \n';
                info = info + '------------------- \n';
                angular.forEach(user.education.values, function(ed, iter) {
                        var j = iter > 0 ? "--------- \n" : "";
                        info = info + j;
                        var edI = "";
                        if (ed.schoolName) {
                                edI = edI + ed.schoolName + "\n";
                        }
                        if (ed.startDate) {
                                edI = edI + ed.startDate.year;
                        }
                        if (ed.endDate) {
                                edI = edI + " to " + ed.endDate.year;
                        }
                        info = info + edI + "\n";
                        info = info + "\n";
                });
        }
        $scope.request.name = user.firstName;
        $scope.request.phone = user.phone;
        $scope.request.lastName = user.lastName;
        $scope.request.linkedinId = user.id;
        $scope.request.linkedinLink = user.link;
        console.log($scope.request);
        $('#email2').val(user.email);
        $scope.request.email = user.email;
        $scope.request.message = info;
        if (!$scope.$$phase) {
                $scope.$apply();
        }
}