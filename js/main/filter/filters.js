'use strict';

/* Filters */
var mass = {
    0: "today",
    1: "tomorrow"
};


angular.module('RecruitingApp.filters', ['ngSanitize'])
    .filter("fileNameCut", [function () {
        return function (fileName, start, end) {
            if (fileName != undefined) {
                start = start != undefined ? start : 0;
                end = end != undefined ? end : 50;
                var filenameArr = fileName.split(".");
                    if(fileName.length >= end){
                        return filenameArr[0].substring(start, end-6) + "..." + filenameArr.pop();
                    } else if (filenameArr.length == 1) {
                        return filenameArr[0].substring(start, end);
                    } else {
                        return fileName.substring(start, end);
                    }
            } else {
                return "";
            }

        }
    }])
    .filter("roundUp", [function () {
        return function (number) {
            if (number == undefined) return 0;
            return Math.ceil(number);

        }
    }])
    .filter("datefunction", ["$filter", function ($filter) {
        return function (date) {
            var vlDate = new Date($filter('date')(date, "MM/dd/yyyy", "UTC"));
            var now = new Date();
            var vlM = vlDate.getMonth();
            if (vlDate.getMonth() == now.getMonth()) {
                if (vlDate.getDate() >= now.getDate()) {
                    var dayDiff = vlDate.getDate() - now.getDate();
                    if (dayDiff > 1) {
                    } else {
                        return $filter('translate')(mass[dayDiff]) + " " + $filter('translate')('birthday_2');
                    }

                } else {

                    return $filter('date')(vlDate, "dd MMM") + " " + $filter('translate')("was") + " " + $filter('translate')('birthday_2')
                }
            } else {
                return $filter('date')(vlDate, "dd MMM") + " " + $filter('translate')("was") + " " + $filter('translate')('birthday_2')
            }
        }
    }])
    .filter('findTypeOfVacancy', ["$filter", "Vacancy", function ($filter, Vacancy) {
        return function (vacancyStatus) {
            var array = vacancyStatus.split(',');
            var vacancyType;
            angular.forEach(Vacancy.interviewStatusNew(), function (vStatus) {
                var check = [];
                var statusDef = $filter('filter')(vStatus.status, {defaultS: true});
                angular.forEach(statusDef, function (statusD) {
                    angular.forEach(array, function (statA) {
                        if (statusD.value == statA) {
                            check.push(true);
                        }
                    });
                });
                if (check.length == statusDef.length) {
                    vacancyType = vStatus.vacancyType;
                } else {
                }
            });
            return vacancyType;
        }
    }])
    .filter('vacancyStatusForHistory', ["$filter", "Vacancy", function ($filter, Vacancy) {
        return function (vacancyStatus) {
            var array = vacancyStatus.split(',');
            var forReturn = [];
            angular.forEach(Vacancy.interviewStatusNew(), function (vStatus) {
                var check = [];
                var statusDef = $filter('filter')(vStatus.status, {defaultS: true});
                angular.forEach(statusDef, function (statusD) {
                    angular.forEach(array, function (statA) {
                        if (statusD.value == statA) {
                            check.push(true);
                        }
                    });
                });
                if (check.length == statusDef.length) {
                    angular.forEach(vStatus.status, function (vStatusV) {
                        if (vStatusV.forHistory) {
                            angular.forEach(array, function (val) {
                                if (val == vStatusV.value) {
                                    forReturn.push(vStatusV.value);
                                }
                            })
                        }
                    });
                }
            });
            return forReturn;
        };
    }])
    .filter('vacancyStatusInSelectFilter', ["$filter", function ($filter) {
        return function (vacancyStatus) {
            if (vacancyStatus != undefined) {
                var value = $filter('filter')(vacancyStatus, {used: true});
                if (value != undefined && value.length == 1) {
                    return $filter('filter')(value[0].status, {added: true});
                }
            }
            return [];
        }
    }])
    .filter('vacancyStatusInCheckFilter', ["$filter", function ($filter) {
        return function (vacancyStatus, vacancyType) {
            if (vacancyStatus != undefined) {
                var value = $filter('filter')(vacancyStatus, {vacancyType: vacancyType});
                if (value != undefined && value.length == 1) {
                    return $filter('filter')(value[0].status, {defaultS: false});
                }
            }
        }
    }])
    .filter('dateFormat', ["$filter", "$translate", function ($filter, $translate) {
        return function (date, withHour, withUTC) {

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
                if (lang == 'en') {
                    hour = "h:mm a";
                } else {
                    hour = "H:mm";
                }
            }
            if (angular.equals($filter('date')(dateToday, 'y'), $filter('date')(date, 'y'))) {
                return $filter('date')(date, dateMD + hour);
            } else {
                return $filter('date')(date, dateMDY + hour);
            }
        };
    }])
    .filter('dateFormat2', ["$filter", "$translate", function ($filter, $translate) {
        return function (date, withHour) {
            var hour = "";
            var dateToday = new Date().getTime();
            var dateTomorrow = new Date().setDate(new Date().getDate() + 1);
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
                if (lang == 'en') {
                    hour = "h:mm a";
                } else {
                    hour = "H:mm";
                }
            }
            if (angular.equals($filter('date')(dateToday, 'y'), $filter('date')(date, 'y'))) {
                if (angular.equals($filter('date')(dateToday, 'y MMM d'), $filter('date')(date, 'y MMM d'))) {
                    var res = $filter("translate")("today");
                    if (withHour) {
                        res += " " + $filter("translate")("at") + " " + $filter('date')(date, hour)
                    }
                    return res;
                } else if (angular.equals($filter('date')(dateTomorrow, 'y MMM d'), $filter('date')(date, 'y MMM d'))) {
                    var res = $filter("translate")("tomorrow");
                    if (withHour) {
                        res += " " + $filter("translate")("at") + " " + $filter('date')(date, hour)
                    }
                    return res;
                } else {
                    return $filter('date')(date, dateMD + hour);
                }
            } else {
                return $filter('date')(date, dateMDY + hour);
            }
        };
    }])
    .filter('dateFormat3', ["$filter", "$translate", function ($filter, $translate) {
        return function (date, withHour, withUTC) {

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
                dateMD = "yyyy-MM-dd ";
                dateMDY = "yyyy-MM-dd ";
            } else if (lang == 'en') {
                dateMD = "MM-dd-yyyy ";
                dateMDY = "MM-dd-yyyy ";
            }
            if (withHour === true) {
                if (lang == 'en') {
                    hour = "h:mm:ss a";
                } else {
                    hour = "H:mm:ss";
                }
            }
            if (angular.equals($filter('date')(dateToday, 'y'), $filter('date')(date, 'y'))) {
                return $filter('date')(date, dateMD + hour);
            } else {
                return $filter('date')(date, dateMDY + hour);
            }
        };
    }])
    .filter('dateFormat4', ["$filter", "$translate", function ($filter, $translate) {
        return function (date, withHour, withUTC) {

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
                if (lang == 'en') {
                    hour = "h:mm a";
                } else {
                    hour = "H:mm";
                }
            }
            if (angular.equals($filter('date')(dateToday, 'y'), $filter('date')(date, 'y'))) {
                return $filter('date')(date, dateMD) + $filter('translate')('at') + " " + $filter('date')(date, hour);
            } else {
                return $filter('date')(date, dateMDY) + $filter('translate')('at') + " " + $filter('date')(date, hour);
            }
        };
    }])
    .filter('dateFormat5', ["$filter", "$translate", function ($filter, $translate) {
        return function (date, withHour) {
            var hour = "";
            var dateforToday = "";
            var dateToday = new Date().getTime();
            var dateTomorrow = new Date().setDate(new Date().getDate() + 1);
            var dateYesterday = new Date().setDate(new Date().getDate() - 1);
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
                if (lang == 'en') {
                    hour = "h:mm a";
                    dateforToday = "h:mm:ss a";
                } else {
                    hour = "H:mm";
                    dateforToday = "H:mm:ss";
                }
            }
            if (angular.equals($filter('date')(dateToday, 'y'), $filter('date')(date, 'y'))) {
                if (angular.equals($filter('date')(dateToday, 'y MMM d'), $filter('date')(date, 'y MMM d'))) {
                    var res = $filter("translate")("today");
                    if (withHour) {
                        res += " " + $filter("translate")("at") + " " + $filter('date')(date, dateforToday)
                    }
                    return res;
                } else if (angular.equals($filter('date')(dateYesterday, 'y MMM d'), $filter('date')(date, 'y MMM d'))) {
                    var res = $filter("translate")("yesterday");
                    if (withHour) {
                        res += " " + $filter("translate")("at") + " " + $filter('date')(date, dateforToday)
                    }
                    return res;
                } else {
                    return $filter('date')(date, dateMD);
                }
            } else {
                return $filter('date')(date, dateMDY);
            }
        };
    }])
    .filter('dateFormat6', ["$filter", "$translate",'$rootScope' , function ($filter, $translate, $rootScope) {
        return function (date, withHour) {
            var hour = "";
            var dateToday = new Date().getTime();
            var dateTomorrow = new Date().setDate(new Date().getDate() + 1);
            var lang = $translate.use() || $rootScope.currentLang || 'ru';
            var dateMD = "";
            var dateMDY = "";
            if (lang == 'ru' || lang == 'ua') {
                dateMD = "d MMM ";
                dateMDY = "d MMM '<br/>' y ";
            } else if (lang == 'en') {
                dateMD = "MMM d ";
                dateMDY = "MMM d, y ";
            }
            if (withHour === true) {
                if (lang == 'en') {
                    hour = "h:mm a";
                } else {
                    hour = "H:mm";
                }
            }
            if (angular.equals($filter('date')(dateToday, 'y'), $filter('date')(date, 'y'))) {
                if (angular.equals($filter('date')(dateToday, 'y MMM d'), $filter('date')(date, 'y MMM d'))) {
                    var res = $filter("translate")("today");
                    if (withHour) {
                        res += " " + $filter("translate")("at") + '<br/>' + $filter('date')(date, hour);
                    }

                    if(res.indexOf('до полудня') !== -1){
                        return res.split(' ').slice(0,2).join(' ') + ' AM';
                    }else if(res.indexOf('после полудня') !== -1){
                        return res.split(' ').slice(0,2).join(' ') + ' PM';
                    }

                    return res;
                } else if (angular.equals($filter('date')(dateTomorrow, 'y MMM d'), $filter('date')(date, 'y MMM d'))) {
                    var res = $filter("translate")("tomorrow");
                    if (withHour) {
                        res += " " + $filter("translate")("at") + '<br/>' + $filter('date')(date, hour)
                    }
                    return res;
                } else {
                    return $filter('date')(date, dateMD + '<br/>' + hour);
                }
            } else {
                return $filter('date')(date, dateMDY + hour);
            }
        };
    }])
    .filter('dateFormat7', ["$filter", "$translate", function ($filter, $translate) {
        return function (date, withHour, withUTC) {

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
                dateMD = "dd-MM-yyyy ";
                dateMDY = "dd-MM-yyyy ";
            } else if (lang == 'en') {
                dateMD = "MM-dd-yyyy ";
                dateMDY = "MM-dd-yyyy ";
            }
            if (withHour === true) {
                if (lang == 'en') {
                    hour = "h:mm:ss a";
                } else {
                    hour = "H:mm:ss";
                }
            }
            if (angular.equals($filter('date')(dateToday, 'y'), $filter('date')(date, 'y'))) {
                return $filter('date')(date, dateMD + hour);
            } else {
                return $filter('date')(date, dateMDY + hour);
            }
        };
    }])
    .filter('salaryFormat', ["$filter", function ($filter) {
        return function (salaryFrom, salaryTo) {
            var res = "";
            if (salaryFrom && salaryTo) {
                res = salaryFrom + "-" + salaryTo;
            } else if (salaryFrom && !salaryTo) {
                res = salaryFrom + "+";
            } else if (!salaryFrom && salaryTo) {
                res = $filter('translate')('up to') + " " + salaryTo;
            } else if (!salaryFrom && !salaryTo) {
                res = $filter('translate')('on the interview results');
            }
            return res;
        };
    }])
    .filter('secondsToHhMm', ["$filter", function ($filter) {
        return function (seconds) {
            if (seconds != undefined && seconds != null && !isNaN(seconds) && seconds != 0) {
                var res = "";
                if(seconds >= 60) {
                    var hour = parseInt(seconds / 3600 );
                    if (hour != 0) {
                        res += hour + " " + $filter("translate")("h") + " ";
                    }
                    var min =  parseInt((seconds - (hour * 3600)) / 60);
                    res += min + " " + $filter("translate")("min");
                    return res;
                } else {
                    var sec = seconds + " " +$filter("translate")("sec");
                    return sec;
                }
            } else {
                return "";
            }
        };
    }])
    .filter('dayFormat', ["$filter", function ($filter) {
        return function (seconds) {
            if (seconds != undefined && seconds != null && !isNaN(seconds) && seconds != 0) {
                var res = "";
                var day = parseInt(seconds / 3600 / 24);
                if (day != 0) {
                    res += day + " " + $filter("translate")("d") + ". ";
                }
                var hour = Math.round((seconds / 3600) % 24);
                if (hour != 0) {
                    res += hour + " " + $filter("translate")("h") + ". "
                } else if (seconds < 3600) {
                    res += "1 " + $filter("translate")("h") + ". "
                }
                return res;
            } else {
                return "";
            }
        };
    }])
    .filter('dayFormat2', ["$filter", "$translate", function ($filter, $translate) {
        return function (date, done) {
            if (date) {
                var seconds = (new Date().getTime() - date) / 1000;
                var res = "";
                var day = parseInt(seconds / 3600 / 24);
                if (day != 0) {
                    res += day + " " + $filter("translate")("d") + ". ";
                }
                var hour = Math.round((seconds / 3600) % 24);
                if (hour != 0) {
                    res += hour + " " + $filter("translate")("h") + ". "
                } else if (seconds < 3600) {
                    var min = parseInt(seconds / 60);
                    if (min >= 1) {
                        res += min + " " + $filter("translate")("min") + ". ";
                    }
                }
                if (res != "") {
                    res += " " + $filter("translate")("ago")
                } else {
                    res = $filter("translate")("Just done");
                    if (done) {
                        if ($translate.use() != 'en') {
                            res += " " + $filter("translate")("done")
                        }
                    }
                }
                return res;
            } else {

            }
        };
    }])
    .filter('countFormat', ["$filter", "$translate", function ($filter, $translate) {
        return function (count) {
            if ($translate.use() == 'en') {
                return count + " " + $filter("translate")("Active vacancies");
            } else {
                return count;
            }
        };
    }])
    .filter('clientsCountFormat', ["$filter", function ($filter) {
        return function (count) {
            if(count) return count;
            return 0;
        };
    }])
    .filter('ageOfDate', ['$filter', function ($filter) {
        return function (dateString) {
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
                return age + " " + [translate('years old1'), translate('years old2'), translate('age_1')][(age % 100 > 4 && age % 100 < 20) ? 2 : cases[(age % 10 < 5) ? age % 10 : 5]];

            }
        };
    }])
    .filter('ageDisplay', ["$filter", function ($filter) {
        return function (ageFrom, ageTo) {
            if (ageFrom != undefined && ageTo == undefined) {
                return $filter('translate')('from') + " " + ageFrom
            } else if (ageTo != undefined && ageFrom == undefined) {
                return $filter('translate')('to') + " " + ageTo
            } else if (ageTo != undefined && ageFrom != undefined) {
                return ageFrom + "-" + ageTo;
            }
        }
    }])
    .filter('adviceFilter', function () {
        return function (advices, criteria) {
            var filtered = [];
            var limit = criteria.limit;
            angular.forEach(advices, function (val, s, i) {
                if (limit != undefined && limit > s) {
                    if (val.scorePersent != undefined && val.scorePersent > 25) {
                        filtered.push(val);
                    }
                }
            });
            return filtered;
        }
    })
    .filter('transliteration', ["transliteration", function (transliteration) {
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
    }])
    .filter('responsibleWithout', function () {
        return function (responsible, responsibleHas) {
            var filtered = [];
            angular.forEach(responsible, function (person) {
                if (person.userId != undefined) {
                    var has = false;
                    angular.forEach(responsibleHas, function (hasPerson) {
                        if (hasPerson.responsible && hasPerson.responsible.userId === person.userId) {
                            has = true;
                        }
                    });
                    if (!has) {
                        filtered.push(person);
                    }
                }
            });
            return filtered;
        };
    })
    .filter('scopeRegionFilter', function () {
        return function (regions, regionId) {
            var filtered = [];
            angular.forEach(regions, function (region) {
                if (angular.equals(region.regionId, regionId)) {
                    filtered.push(region);
                }
            });
            return filtered;
        };
    })
    .filter('cutName', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || '…');
        };
    })
    .filter('cut', function () {
        return function (value, wordwise, max, tail) {
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
                return value + endExtension;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                    value = value.substr(0, lastspace);
                }
            }
            return value + (tail || '...') + endExtension;
        };
    })
    .filter('modalchangestatusplaceholder', ["$filter", function ($filter) {
        return function (value) {
            if (value == 'declinedoffer') {
                return $filter('translate')('Write a comment why candidate long offer (required)')
            } else {
                return $filter('translate')('Write a comment about changing candidate status to') + ' '
                     + $filter('translate')('(optional)');
            }

        };
    }])
    .filter('spellcheck', function () {
        return function (value) {
            if (!value) {
                return '';
            }
            if (value === 'admin') {
                return 'Admin';
            }
            if (value === 'client') {
                return 'Hiring manager';
            }
            if (value === 'hr:client') {
                return 'Hiring manager';
            }
            if (value === 'recruter') {
                return 'Recruiter';
            }
            if (value === 'researcher') {
                return 'Researcher';
            }
            if (value === 'hr:admin') {
                return 'Admin';
            }
            if (value === 'hr:recruter') {
                return 'Recruiter';
            }
            if (value == "salesmanager") {
                return "Sales Manager"
            }
            if (value === 'hr:salesmanager') {
                return 'Sales Manager';
            }
            if (value === 'freelancer') {
                return 'Freelancer';
            }
            if (value === 'hr:freelancer') {
                return 'Freelancer';
            }
            return value;
        };
    })
    .filter('cutScope', function () {
        return function (value) {
            if (!value)
                return '';
            if (value.length < 15) {
                return value;
            } else {
                value = value.substr(0, 13);
                return value + '...';
            }
        };
    })
    .filter('unique', function () {

        return function (items, filterOn) {

            if (filterOn === false) {
                return items;
            }

            if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
                var hashCheck = {}, newItems = [];

                var extractValueToCompare = function (item) {
                    if (angular.isObject(item) && angular.isString(filterOn)) {
                        return item[filterOn];
                    } else {
                        return item;
                    }
                };

                angular.forEach(items, function (item) {
                    var valueToCheck, isDuplicate = false;

                    for (var i = 0; i < newItems.length; i++) {
                        if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                            isDuplicate = true;
                            break;
                        }
                    }
                    if (!isDuplicate) {
                        newItems.push(item);
                    }

                });
                items = newItems;
            }
            return items;
        };
    })
    .filter('escape', function () {
        return window.escape;
    })
    .filter('interpolate', ['version', function (version) {
        return function (text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }])
    .filter("translatestatus", ["$filter", function ($filter) {
        return function (text) {
            switch (text) {
                case"shortlist":
                    return $filter("translate")("short_list");
                case"longlist":
                    return $filter("translate")("long_list");
                case"interview":
                    return $filter("translate")("interview");
                case"approved":
                    return $filter("translate")("approved");
                case"notafit":
                    return $filter("translate")("not_a_fit");
                case"declinedoffer":
                    return $filter("translate")("declined_offer");
                case"no_contacts":
                    return $filter("translate")("no_contacts");
                case"no_response":
                    return $filter("translate")("no_response");
            }

        }
    }])
    .filter('getorders', function () {
        return function (orders) {
            var filtered_list = [];
            if (orders != undefined) {
                for (var i = 0; i < orders.length; i++) {
                        var two_days_ago = new Date().getTime() - 24 * 60 * 60 * 1000;
                        var last_modified = new Date(orders[i].date).getTime();

                        //if (two_days_ago <= last_modified || orders[i].type == 'task') {
                            filtered_list.push(orders[i]);
                        //}
                }
            }

            //filtered_list.sort(function (a, b) {
            //    return a.date - b.date;
            //});
            return filtered_list;
        }
    })
    .filter('showRegionInVacancy', function () {
        return function (region) {

            if (region) {
                if (region.city) {
                    return region.city;
                } else if (region.country)
                    return region.country;
            }
            return "";

        }
    })
    .filter('textForNotice', function ($sce, $filter) {
        return function (text, withDot) {
            withDot == undefined ? false : withDot;
            var respText;
            var dots = "";
            if ($filter('countOfTextInSticker')(text) > 210 && withDot)dots = "...";
            if (text != undefined && text.length > 0) {
                respText = linkify3(text) + dots;
            } else {
                respText = "";
            }
            respText = respText.replace(new RegExp('\n', 'g'), '<br />');
            return $sce.trustAsHtml(respText);
        }
    })
    .filter('countOfTextInSticker', function () {
        return function (text) {
            var limitRow = 30;
            var count = 0;
            if (text != undefined) {
                var arr = text.split(/\n/g);
                angular.forEach(arr, function (val) {
                    if (val.length >= limitRow) {
                        count = count + val.length;
                    } else {
                        count = count + limitRow;
                    }
                });
            }
            return count;
        }
    })
    .filter('stringToJson', function () {
        return function (text) {
            if (text != undefined) {
                var s = JSON.parse(text);
                if (angular.isArray(s)) {
                    return s;
                } else {
                    return s.split(',');
                }
            }
            return [];
        }
    })
    .filter('numberSpacing', function () {
        return function (number) {
            if (number != undefined) {
                //return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                var parts = number.toString().split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                return parts.join(".");
            }
            return [];
        }
    })
    .filter('dateCounter', function ($filter, $sce) {
        return function (date, type) {
            if (!date) {
                return "";
            }
            var msDate = null;
            switch (type) {
                case "String":
                    msDate = new Date(date);
                    break;
                case "second":
                    msDate = new Date(date * 1000);
                    break;
                case "milliseconds":
                    msDate = new Date(date);
                default:
                    msDate = date;
            }

            var today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            msDate.setUTCHours(0, 0, 0, 0);
            var seconds = (today.getTime() - msDate.getTime()) / 1000;
            var future = false;
            if (seconds < 0) {
                seconds = Math.abs(seconds);
                future = true;
            }

            var res = "";
            var day = parseInt(seconds / 3600 / 24);
            var translate = $filter("translate");
            if (day === 0) {
                return $sce.trustAsHtml(translate("today"));
            } else if (day === 1) {
                if (future) {
                    return $sce.trustAsHtml(translate("tomorrow"));
                } else {
                    return $sce.trustAsHtml("<span style='color:#D95C5C'>" + translate("yesterday") + "</span>");
                }
            } else {
                var cases = [2, 0, 1, 1, 1, 2];
                res += day + " " + [translate('day'), translate('days'), translate('days_1')][(day % 100 > 4 && day % 100 < 20) ? 2 : cases[(day % 10 < 5) ? day % 10 : 5]]
            }
            if (!future) {
                res += " " + translate("ago");
                res = "<span style='color:#D95C5C'>" + res + "</span>";
            } else {
                res = translate("in_1") + " " + res;
            }
            return $sce.trustAsHtml(res);
        };
    })
    .filter("makeLink", [function () {
        return function (linkName) {
            if (linkName != undefined) {
                var linkNameArr = linkName.split(":");
                if(linkNameArr[0] != 'http' && linkNameArr[0] != 'https'){
                    linkNameArr.unshift("http://");
                    linkNameArr = linkNameArr.join("");
                    return linkNameArr;
                }else{
                    linkNameArr = linkNameArr.join(":");
                    return linkNameArr;
                }
            } else {
                return "";
            }

        }
    }])
    .filter('filter_refToDomain', function(){
        return function (value) {
            if(!value) return;
            return value.split('/')[2];
        };
    })
    .filter('filter_parseObject', function () {
        return function (value) {
            var str,
                str2,
                i = 0 ,
                max, resault = '';

            if(!value)return;

            value = JSON.parse(value);
            max = Object.entries(value);

            for(; i < max.length; i++) {
                str = max[i][0];
                str2 = max[i][1];
                resault += str + ":" + str2 + '<br />' ;
            }

            return resault;
        }
    })
    .filter('filterDataForReport',filterFildsForCustomReports)
    .filter('parseCamelCase' , function() {
       return function(string) {
           var result = [];
           Array.prototype.map.call(string, (letter) => {
                if(letter === letter.toLowerCase()) {
                    result.push(letter);
                } else {
                    result.push(" ");
                    result.push(letter);
                }
           });
           return result.join("");
       }
    }).filter('userTypes', ['$filter', function($filter) {
        return function(access) {
            switch (access) {
                case 'full-access':
                    return $filter('translate')('Paid_user');
                case 'limited-access':
                    return $filter('translate')('Paid_user');
                case 'free-access':
                    return $filter('translate')('Free_user');
            }
        }
    }]).filter('breakOnMiddleString', ['$sce', function($sce) {
        return function(value){
            let spaceBeforeIndex = null,
                spaceAfterIndex = null;

            for(let i = Math.floor(value.length/2); i >= 0; i--) {
                if(value[i] === " ") {
                    spaceBeforeIndex = i;
                    break;
                }
            }

            for(let i = Math.floor(value.length/2); i <= value.length; i++) {
                if(value[i] === " ") {
                    spaceAfterIndex = i;
                    break;
                }
            }

            if(value.length - spaceAfterIndex < value.length - spaceBeforeIndex) {
                spaceBeforeIndex = spaceAfterIndex;
            }

            value = value.split('');
            value[spaceBeforeIndex] = "<br/>";
            return $sce.trustAsHtml(value.join(""));
        };
    }]);
function linkify3(text) {
    if (text) {
        text = text.replace(
            /((https?\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi,
            function (url) {
                var full_url = url;
                if (!full_url.match('^https?:\/\/')) {
                    full_url = 'http://' + full_url;
                }
                url = url.replace('http://', '').replace('https://', '').replace('www.', '');
                var dot = "";
                if (url.length > 24) {
                    dot = "...";
                }
                return '<a target="_blank" href="' + full_url + '">' + url.substr(0, 24) + dot + '</a>';
            }
        );
    }
    return text;
}


function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    //console.log(inputText.match(replacePattern1))
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    //console.log(inputText.match(replacePattern1))
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    ////Change email addresses to mailto:: links.
    //replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    //replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}

function filterFildsForCustomReports($filter) {
    return (field, scope) =>{
        if(scope.ctrlReport){
            scope = scope.ctrlReport;
        }

        if(field.type.value == 'responsibles'){
            if(!field.value) return '-';
            return field.value.map(item => scope.getPersonFullName(item.personId)).join(', ');
        }else if(field.type.value == 'client'){
            return field['vacancy'].clientId.name;
        }else if(field.type.value == 'location'){
            return scope.regionIdToName(field['vacancy'].regionId);
        }else if(field.type.value == 'salary'){
            return (field['vacancy'].salaryTo)? field['vacancy'].salaryTo + " " + field['vacancy'].currency : '-';
        }else if(field.type.value == "dc" || field.type.value == "dateFinish"  || field.type.value == "datePayment"){
            return formatDate(field.value);
        }else if(field.type.id && field.type.visiable){
            return filterCustomFildsForCustomReports(field);
        }

        if(!field.value && field.type.visiable){
            return '-';
        }

        return field.value;
    }
}

function formatDate(date) {
    if(!date) return '-';
     date = new Date(date);


    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear() % 100;

    if (yy < 10) yy = '0' + yy;

    return dd + '.' + mm + '.' + yy;
}

function filterCustomFildsForCustomReports(customField) {
    let vacancy = customField.vacancy;

    if(vacancy.customFieldsDto){
        vacancy = vacancy.customFieldsDto.filter(item => item.fieldId == customField.type.id);
        if(vacancy[0] && vacancy[0].type !== "date" && vacancy[0].type !== "datetime"){
            return vacancy[0].value;
        }else if(vacancy[0] && vacancy[0].type == "date"){
            return vacancy[0].value.split(' ')[0];
        }else if(vacancy[0] && vacancy[0].type == "datetime"){
            console.log(vacancy[0], 'vacancy[0]');
            return vacancy[0].value.split(':')[0] + ":" + vacancy[0].value.split(':')[1];
        }
    }

    return '-';
}
