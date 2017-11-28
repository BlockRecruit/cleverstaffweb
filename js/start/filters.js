'use strict';

/* Filters */


angular.module('RecruitingAppStart.filters', []).
    filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        }
    }]).filter('salaryFormat', function($filter) {
        return function(salaryFrom, salaryTo) {
            var res = "";
            if (salaryFrom && salaryTo) {
                res = salaryFrom + "-" + salaryTo;
            } else if (salaryFrom && !salaryTo) {
                res = salaryFrom + "+";
            } else if (!salaryFrom && salaryTo) {
                res = $filter('translate')('up to') + " " + salaryTo;
            } else if (!salaryFrom && !salaryTo) {
                // res = $filter('translate')('on the interview results');
                return res;
            }
            return res;
        };
    }).filter('transliteration', function(transliteration) {
        return function (value) {
            var transl = transliteration.getArray();
            var result = "";
            for (var i = 0; i < value.length; i++) {
                if (transl[value[i]] != undefined) {
                    result += transl[value[i]];
                } else {
                    if (value[i].match(/\w/)) {
                        result += value[i];
                    } else if(value[i] == '#'){
                        result += '-sharp'
                    }else if(value[i] == '/'){
                        result += '|'
                    } else {
                        result += '_';
                    }
                }
            }
            return result;
        }
    }).filter('ageDisplay', function($filter) {
        return function(ageFrom, ageTo) {
            if (ageFrom != undefined && ageTo == undefined) {
                return $filter('translate')('from') + " " + ageFrom
            } else if (ageTo != undefined && ageFrom == undefined) {
                return $filter('translate')('to') + " " + ageTo
            } else if (ageTo != undefined && ageFrom != undefined) {
                return ageFrom + "-" + ageTo;
            }
        }
    }).filter('cut', function() {
        return function(value, wordwise, max, tail) {
            var endExtension = "";
            if (!value)
                return '';
            if (value.split('.').length === 2) {
                endExtension = value.split('.')[1];
                value = value.split('.')[0];
            }
            max = parseInt(max, 10);
            if (!max)
                return value;
            if (value.length + value.split(' ').length <= max)
                return value + "." + endExtension;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                    value = value.substr(0, lastspace);
                }
            }
            return value + (tail || '...') + endExtension;
        };
    }).filter('dateFormat', ["$filter", "$translate", function($filter, $translate) {
        return function(date, withHour, withUTC) {

            function createDateAsUTC(datLong) {
                if (datLong != undefined) {
                    var date = new Date(datLong);
                    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
                }
            }

            if (withUTC == true) {
                date = createDateAsUTC(date);
            }
            var hour = "";
            var dateToday = new Date().getTime();
            var lang = $translate.use();
            var dateMD = "";
            var dateMDY = "";
            if (lang == 'ru' || lang == 'ua') {
                dateMD = "d MMM ";
                dateMDY = "d MMM y ";
            } else if (lang == 'en') {
                dateMD = "MMM d ";
                dateMDY = "MMM d, y ";
            }
            if (withHour === true) {
                hour = "H:mm";
            }
            if (angular.equals($filter('date')(dateToday, 'y'), $filter('date')(date, 'y'))) {
                return $filter('date')(date, dateMD + hour);
            } else {
                return $filter('date')(date, dateMDY + hour);
            }
        };
    }]).filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
    }]).filter('ageOfDate', ['$filter', function($filter) {
        return function(dateString) {
            if (dateString != undefined) {
                var today = new Date();
                var birthDate = new Date(dateString);
                var age = today.getFullYear() - birthDate.getFullYear();
                var m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                var cases = [2, 0, 1, 1, 1, 2];
                var translate = $filter('translate');
                return age + " " + [translate('year'), translate('years'),  translate('age_1')][(age % 100 > 4 && age % 100 < 20) ? 2 : cases[(age % 10 < 5) ? age % 10 : 5]];

            }
        };
    }]).filter('registrationRole' , ['$filter' , function($filter) {
          return function(roleID) {
            if(!roleID) {
                return false;
            }
            var UpperLetter = roleID.charAt(3).toUpperCase();
            var role = UpperLetter + roleID.substring(4);
            if(role == 'Client') {
              return "Hiring Manager";
            } else if (role == 'Salesmanager') {
              return "Sales Manager"
            } else {
              return role;
            }
          }
    }]).filter('employmentType' , ['$filter' , function($filter) {
        return function(empType) {
            return empType === "Project" ? "PR" : empType === "Remote" ? "RM" :
                   empType === "Temporary" ? "TM" : empType === "Relocate" ? "RL" : empType[0] + empType[empType.indexOf(" ")+1];
        }
    }]).filter('parseFacebookUrl' , [function() {
        return function(url) {
            let start = url.indexOf('.com/') + 4;
            return result = url.substr(start, url.length);
        }
    }]);


