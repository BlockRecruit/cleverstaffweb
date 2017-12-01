angular.module('services.globalService', [
        'ngResource',
        'pascalprecht.translate',
        'services.notice'
    ]
).factory('Service', ['$resource', 'serverAddress', '$filter', '$translate', '$location', 'notificationService', '$rootScope', function($resource, serverAddress, $filter, $translate, $location, notificationService, $rootScope) {
    var service = $resource(serverAddress + '/:service/:action', {service: "@service", action: "@action"}, {
        getRegions: {
            method: "GET",
            params: {
                service: "region",
                action: "get"
            }
        },
        getRegionsTwo: {
            method: "GET",
            params: {
                service: "region",
                action: "get2"
            }
        },
        history: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "action",
                action: "get"
            }
        },
        notice: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "notice",
                action: "get"
            }
        },
        readNotice: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "notice",
                action: "read"
            }
        },
        publicVacancy: {
            method: "GET",
            params: {
                service: "public",
                action: "getVacancy"
            }
        },
        publicCandidate:{
          method:"GET",
            params: {
                service: "public",
                action: "getCandidate"
            }
        },
        saveAccessLogEntry: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "public",
                action: "saveAccessLogEntry"
            }
        },
        addCandidate: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "public",
                action: "addRecall"
            }
        },
        getEvaluation: {
            method: "GET",
            params: {
                service: "public",
                action: "getEvaluation"
            }
        },
        sendDailyReportExample: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "public",
                action: "sendDailyReportExample"
            }
        },
        getClientNames: {
            method: "GET",
            params: {
                service: "public",
                action: "getClientNames"
            }
        },
        addVacancyPackage: {
            method: "POST",
            params: {
                service: "public",
                action: "addVacancyPackage"
            }
        },
        saveBrowserWithPlugin: {
            method: "GET",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params : {
                service: "person",
                action: "saveBrowserWithPlugin"
            }
        },
        getOrgLogoId: {
            method: "GET",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params : {
                service : "company",
                action : "getOrgLogoId"
            }
        },
        removeLogo: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "company",
                action: "removeLogo"
            }
        },
        readAt: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params : {
                service : "at",
                action : "read"
            }
        },
        getGroups: {
            method: "GET",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params : {
                service : "candidateGroup",
                action : "getGroups"
            }
        },
        getAllOpenVacancy: {
            method: "GET",
            params: {
                service: "public",
                action: "getAllOpenVacancy"
            }
        }

    });
    service.regions = function(callbacl) {

    };
    service.getRegions2 = function(callback) {
        service.getRegionsTwo(function(resp) {
            var country = [];
            var cities = [];
            var sortArrayCountry = [];
            var sortArrayCities = [];
            var sortObjectCountry = {};
            var sortObjectCities = {};
            angular.forEach(resp.object, function(valC, keyC) {
                country.push({id:keyC,value: keyC, name: keyC, type: "country", showName: keyC, country: keyC, nameRu: keyC});
                angular.forEach(valC, function(val, key) {
                    if (val.type == 'country') {
                        country.push({
                            id:val.displayCity+keyC,
                            value: val.regionId,
                            name: val.displayCity,
                            type: "country",
                            showName: val.displayCity,
                            nameRu: (val.googlePlaceId == undefined || val.googlePlaceId.cityRu == undefined) ? val.city : val.googlePlaceId.cityRu,
                            nameEn: (val.googlePlaceId == undefined || val.googlePlaceId.cityEn == undefined) ? val.city : val.googlePlaceId.cityEn,
                            country: keyC,
                            countryRu: (val.googlePlaceId == undefined || val.googlePlaceId.countryRu == undefined) ? val.country : val.googlePlaceId.countryRu
                        });
                    }else{
                        cities.push({
                            id:val.displayCity+keyC,
                            value: val.regionId,
                            name: val.displayCity,
                            type: "city",
                            showName: val.displayCity,
                            nameRu: (val.googlePlaceId == undefined || val.googlePlaceId.cityRu == undefined) ? val.city : val.googlePlaceId.cityRu,
                            nameEn: (val.googlePlaceId == undefined || val.googlePlaceId.cityEn == undefined) ? val.city : val.googlePlaceId.cityEn,
                            country: keyC,
                            countryRu: (val.googlePlaceId == undefined || val.googlePlaceId.countryRu == undefined) ? val.country : val.googlePlaceId.countryRu
                        });
                    }
                    angular.forEach(country, function(valIn, keyIn) {
                        if (valIn.value == val.country) {
                            valIn.name = val.displayCountry;
                            valIn.showName = val.displayCountry;
                            valIn.nameRu = (val.googlePlaceId == undefined || val.googlePlaceId.countryRu == undefined) ? val.country : val.googlePlaceId.countryRu;
                        }
                    })
                });
            });
            angular.forEach(country,function(data){
                sortArrayCountry.push(data.id)
            });
            angular.forEach(cities,function(data){
                sortArrayCities.push(data.id)
            });
            sortArrayCountry = sortArrayCountry.sort();
            sortArrayCities = sortArrayCities.sort();

            angular.forEach(sortArrayCountry,function(name,key){
                    angular.forEach(country,function(obj){
                        if(name == obj.id){
                            sortObjectCountry[key] = obj;
                        }
                    })
            });
            angular.forEach(sortArrayCities,function(name,key){
                angular.forEach(cities,function(obj){
                    if(name == obj.id){
                        sortObjectCities[key] = obj;
                    }
                })
            });
            //angular.forEach(sortObjectCities,function(obj){
            //    if(obj.name == 'Одесса'){
            //        console.log(obj)
            //    }
            //});
            if (callback != undefined)
                callback(sortObjectCountry, sortObjectCities);
        });
    };
    service.getIndustries = function() {
        return [
            {value: "Accounting, Auditing"},
            {value: "Agriculture, agribusiness"},
            {value: "Automotive"},
            {value: "Aviation & Aerospace"},
            {value: "Beauty, fitness and sports"},
            {value: "Charity & NGO"},
            {value: "Chemicals"},
            {value: "Construction and architecture"},
            {value: "Consulting"},
            {value: "Consumer Goods"},
            {value: "Culture, music, show business"},
            {value: "Design, creativity"},
            {value: "Energy industry"},
            {value: "E-Commerce"},
            {value: "Education"},
            {value: "Engineering"},
            {value: "Engineering Consulting"},
            {value: "Engineering Services"},
            {value: "Finance, bank"},
            {value: "FMCG"},
            {value: "Government"},
            {value: "Healthcare, hospital"},
            {value: "HR Management, HR"},
            {value: "Hotel and restaurant business, tourism"},
            {value: "Insurance"},
            {value: "IT, computers, the Internet"},
            {value: "IT Consulting"},
            {value: "Logistics, warehouse, Foreign Trade"},
            {value: "Legal"},
            {value: "Manufacturing"},
            {value: "Marketing, Advertising, PR"},
            {value: "Media, publishing, printing"},
            {value: "Medicine, pharmacy"},
            {value: "Mining"},
            {value: "Network Marketing and MLM"},
            {value: "Oil & Gas"},
            {value: "Real Estate"},
            {value: "Retail"},
            {value: "Sales Jobs"},
            {value: "Secretariat, outsourcing, ACS"},
            {value: "Security, Safety"},
            {value: "Service industries"},
            {value: "Telecommunications"},
            {value: "Top management, senior management"},
            {value: "Transport, Telecom"},
            {value: "Travel & Tourism"},
            {value: "Work at home"},
            {value: "Work for students, early career"},
            {value: "Work without special training"},
            {value: "Other areas of activity"}
        ];
    };

    service.getSalary = function() {
        return [
            {name: "up to 500", salaryFrom: "0", salaryTo: "500"},
            {name: "500-1500", salaryFrom: "500", salaryTo: "1500"},
            {name: "1500-2500", salaryFrom: "1500", salaryTo: "2500"},
            {name: "2500-3500", salaryFrom: "2500", salaryTo: "3500"},
            {name: "3500-4500", salaryFrom: "3500", salaryTo: "4500"},
            {name: "more", salaryFrom: "4500", salaryTo: ""}
        ];
    };

    service.currency = function() {
        return [
            {value: "USD"},
            {value: "EUR"},
            {value: "ARS"},
            {value: "AUD"},
            {value: "BRL"},
            {value: "BYN"},
            {value: "CAD"},   
            {value: "CNY"},
            {value: "GBP"},    
            {value: "HKD"},
            {value: "IDR"},
            {value: "INR"},
            {value: "JPY"},
            {value: "KZT"},
            {value: "LKR"},
            {value: "MXN"},
            {value: "MYR"},
            {value: "PHP"},
            {value: "PLN"},
            {value: "RMB"},
            {value: "RUB"},            
            {value: "SGD"},
            {value: "THB"},
            {value: "UAH"},
            {value: "ZAR"}
        ];
    };
    service.positionLevel = function() {
        return [
            {value: "specialty workers"},
            {value: "specialist  (entry level)"},
            {value: "specialist"},
            {value: "Senior Specialist / Team Leader"},
            {value: "middle manager / head of department"},
            {value: "top manager / CEO / President"}
        ];
    };

    service.employmentType = function() {
        return [
            {value: "full employment"},
            {value: "underemployment"},
            {value: "telework"},
            {value: "training, practice"},
            {value: "project work"},
            {value: "seasonal, temporary work"},
            {value: "relocate"}
        ];

    };
    service.numberPosition = function() {
        return [
            {value: "1"},
            {value: "2"},
            {value: "3"},
            {value: "4"},
            {value: "5"},
            {value: "6"},
            {value: "7"},
            {value: "8"},
            {value: "9"},
            {value: "10"}
        ];
    };
    service.employmentTypeTwo = function() {
        if ($translate.use() == 'ua') {
            return [
                {text: "повна зайнятість", id: "full employment"},
                {text: "неповна зайнятість ", id: "underemployment"},
                {text: "Віддалена робота ", id: "telework"},
                {text: "навчання, практика", id: "training_practice"},
                {text: "проектна робота", id: "project work"},
                {text: "сезонна, тимчасова робота", id: "seasonal_temporary_work"}
            ];
        } else if ($translate.use() == 'ru') {
            return [
                {text: "полная занятость", id: "full employment"},
                {text: "неполная занятость ", id: "underemployment"},
                {text: "удаленная работа ", id: "telework"},
                {text: "обучение, практика", id: "training_practice"},
                {text: "проектная работа", id: "project work"},
                {text: "сезонная, временная работа", id: "seasonal_temporary_work"},
                {text: "переезд", id: "Relocate"}
            ];
        } else {
            return [
                {text: "Full Time", id: "full employment"},
                {text: "Part Time", id: "underemployment"},
                {text: "Remote", id: "telework"},
                {text: "Training, Practice", id: "training_practice"},
                {text: "Project", id: "project work"},
                {text: "Temporary", id: "seasonal_temporary_work"},
                {text: "Relocate", id: "Relocate"}
            ];
        }
    };
    service.createArrayByEmploymentType = function(arrayOfName) {
        var array = service.employmentTypeTwo();
        var respArray = [];
        angular.forEach(arrayOfName, function(valueOfName) {
            angular.forEach(array, function(vlOfArr) {
                if (valueOfName == vlOfArr.id) {
                    respArray.push(vlOfArr);
                }
            });
        });
        return respArray;
    };

    service.experience = function() {
        return [
            {value: "no experience"},
            {value: "least a year"},
            {value: "1-2 years"},
            {value: "2-3 years"},
            {value: "3-4 years"},
            {value: "4-5 years"},
            {value: "5-10 years"},
            {value: "over 10 years"}
        ];
    };
    var UALang = [
        "Англійська розмовна",
        "Англійська професійна",
        "Англійська середня",
        "Англійська початківець",
        "Білоруська розмовна",
        "Білоруська професійна",
        "Білоруська середня",
        "Білоруська початківець",
        "Іспанська розмовна",
        "Іспанська професійна",
        "Іспанська середня",
        "Іспанська початківець",
        "Італійська розмовна",
        "Італійська професійна",
        "Італійська середня",
        "Італійська початківець",
        "Казахська розмовна",
        "Казахська професійна",
        "Казахська середня",
        "Казахська початківець",
        "Китайська розмовна",
        "Китайська професійна",
        "Китайська середня",
        "Китайська початківець",
        "Малайська розмовна",
        "Малайська професійна",
        "Малайська середня",
        "Малайська початківець",
        "Мандаринська розмовна",
        "Мандаринська професійна",
        "Мандаринська середня",
        "Мандаринська початківець",
        "Молдавська розмовна",
        "Молдавська професійна",
        "Молдавська середня",
        "Молдавська початківець",
        "Німецька розмовна",
        "Німецька професійна",
        "Німецька середня",
        "Німецька початківець",
        "Португальська розмовна",
        "Португальська професійна",
        "Португальська середня",
        "Португальська початківець",
        "Російська розмовна",
        "Російська професійна",
        "Російська середня",
        "Російська початківець",
        "Тамільська розмовна",
        "Тамільська професійна",
        "Тамільська середня",
        "Тамільська початківець",
        "Українська розмовна",
        "Українська професійна",
        "Українська середня",
        "Українська початківець",
        "Французька розмовна",
        "Французька професійна",
        "Французька середня",
        "Французька початківець",
        "Гінді розмовна",
        "Гінді професійна",
        "Гінді середня",
        "Гінді початківець",
        "Японська розмовна",
        "Японська професійна",
        "Японська середня",
        "Японська початківець",
     ];

    var RULang = ["Английский разговорный",
        "Английский профессиональный",
        "Английский средний",
        "Английский начинающий",
        "Белорусский разговорный",
        "Белорусский профессиональный",
        "Белорусский средний",
        "Белорусский начинающий",
        "Испанский разговорный",
        "Испанский профессиональный",
        "Испанский средний",
        "Испанский начинающий",
        "Итальянский разговорный",
        "Итальянский профессиональный",
        "Итальянский средний",
        "Итальянский начинающий",
        "Казахский разговорный",
        "Казахский профессиональный",
        "Казахский средний",
        "Казахский начинающий",
        "Китайский разговорный",
        "Китайский профессиональный",
        "Китайский средний",
        "Китайский начинающий",
        "Малайский разговорный",
        "Малайский профессиональный",
        "Малайский средний",
        "Малайский начинающий",
        "Мандаринский разговорный",
        "Мандаринский профессиональный",
        "Мандаринский средний",
        "Мандаринский начинающий",
        "Молдавский разговорный",
        "Молдавский профессиональный",
        "Молдавский средний",
        "Молдавский начинающий",
        "Немецкий разговорный",
        "Немецкий профессиональный",
        "Немецкий средний",
        "Немецкий начинающий",
        "Португальский разговорный",
        "Португальский профессиональный",
        "Португальский средний",
        "Португальский начинающий",
        "Русский разговорный",
        "Русский профессиональный",
        "Русский средний",
        "Русский начинающий",
        "Тамильский разговорный",
        "Тамильский профессиональный",
        "Тамильский средний",
        "Тамильский начинающий",
        "Украинский разговорный",
        "Украинский профессиональный",
        "Украинский средний",
        "Украинский начинающий",
        "Французский разговорный",
        "Французский профессиональный",
        "Французский средний",
        "Французский начинающий",
        "Хинди разговорный",
        "Хинди профессиональный",
        "Хинди средний",
        "Хинди начинающий",
        "Японский разговорный",
        "Японский профессиональный",
        "Японский средний",
        "Японский начинающий"

    ];
    var ENLang = [
        "English Oral",
        "English Professional",
        "English Intermediate",
        "English Elementary",
        "Belarusian Oral",
        "Belarusian Professional",
        "Belarusian Intermediate",
        "Belarusian Elementary",
        "Spanish Oral",
        "Spanish Professional",
        "Spanish Intermediate",
        "Spanish Elementary",
        "Italian Oral",
        "Italian Professional",
        "Italian Intermediate",
        "Italian Elementary",
        "Kazakh Oral",
        "Kazakh Professional",
        "Kazakh Intermediate",
        "Kazakh Elementary",
        "Chinese Oral",
        "Chinese Professional",
        "Chinese Intermediate",
        "Chinese Elementary",
        "Malay Oral",
        "Malay Professional",
        "Malay Intermediate",
        "Malay Elementary",
        "Mandarin Oral",
        "Mandarin Professional",
        "Mandarin Intermediate",
        "Mandarin Elementary",
        "Moldovan Oral",
        "Moldovan Professional",
        "Moldovan Intermediate",
        "Moldovan Elementary",
        "German Oral",
        "German Professional",
        "German Intermediate",
        "German Elementary",
        "Portuguese Oral",
        "Portuguese Professional",
        "Portuguese Intermediate",
        "Portuguese Elementary",
        "Russian Oral",
        "Russian Professional",
        "Russian Intermediate",
        "Russian Elementary",
        "Tamil Oral",
        "Tamil Professional",
        "Tamil Intermediate",
        "Tamil Elementary",
        "Ukrainian Oral",
        "Ukrainian Professional",
        "Ukrainian Intermediate",
        "Ukrainian Elementary",
        "French Oral",
        "French Professional",
        "French Intermediate",
        "French Elementary",
        "Hindi Oral",
        "Hindi Professional",
        "Hindi Intermediate",
        "Hindi Elementary",
        "Japanese Oral",
        "Japanese Professional",
        "Japanese Intermediate",
        "Japanese Elementary",
    ];

        service.lang = function() {
        if ($translate.use() == 'ua') {
            return UALang;
        } else if ($translate.use() == 'ru') {
            return RULang;
        } else {
            return ENLang;
        }
    };
    service.langTranslator = function(currentLang) {
        if (!currentLang || currentLang.length == 0) {
            return currentLang;
        }
        currentLang = currentLang.replace(/,/g, ', ');
        for (var i = 0; i < ENLang.length; i++) {
            if ($translate.use() == 'ua') {
                currentLang = currentLang.replace(ENLang[i], UALang[i]).replace(RULang[i], UALang[i]);
            }
            if ($translate.use() == 'en') {
                currentLang = currentLang.replace(UALang[i], ENLang[i]).replace(RULang[i], ENLang[i]);
            }
            if ($translate.use() == 'ru') {
                currentLang = currentLang.replace(ENLang[i], RULang[i]).replace(UALang[i], RULang[i]);
            }
        }
        return currentLang;
    };

    service.gender = function($scope) {
        $scope.sexObjectRU = [
            {name: "Мужчина", value: true},
            {name: "Женщина", value: false}
        ];
        $scope.sexObject = [
            {name: "Male", value: true},
            {name: "Female", value: false}
        ];
        $scope.sexObjectUA = [
            {name: "Чоловік", value: true},
            {name: "Жінка", value: false}
        ];
    };


    service.genderTwo = function($scope) {
        $scope.sexObjectRU = [
            {name: "Мужчина", value: true},
            {name: "Женщина", value: false},
            {name: "Не имеет значения", value: null}
        ];
        $scope.sexObject = [
            {name: "Male", value: true},
            {name: "Female", value: false},
            {name: "Doesn't matter", value: null}
        ];
        $scope.sexObjectUA = [
            {name: "Чоловік", value: true},
            {name: "Жінка", value: false},
            {name: "Не має значення", value: null}
        ];
    };

    service.toAddCandidate = function(path) {
        if ($rootScope && $rootScope.me && angular.equals($rootScope.me.recrutRole, "salesmanager")) {
            if (path) {
                $location.path(path);
            }
            notificationService.error($filter('translate')("Sales Manager cannot add candidates"));
        } else {
            $location.path("candidate/add/");
        }
    };
    service.toEditCandidate = function(id, path) {
        if ($rootScope && $rootScope.me && angular.equals($rootScope.me.recrutRole, "salesmanager")) {
            if (path) {
                $location.path(path);
            }
            notificationService.error($filter('translate')("Sales Manager cannot edit candidates"));
        } else {
            $location.path("candidate/edit/" + id);
        }
    };
    service.toMergeCandidate = function(id, path) {
        if ($rootScope && $rootScope.me && angular.equals($rootScope.me.recrutRole, "salesmanager")) {
            if (path) {
                $location.path(path);
            }
            notificationService.error($filter('translate')("Sales Manager cannot edit candidates"));
        } else {
            $location.path("candidate/merge/" + id);
        }
    };

    service.getCountryLinkedIn = function() {
        return [
            {key: "ru", value: "Россия"},
            {key: "au", value: "Австралия"},
            {key: "at", value: "Австрия"},
            {key: "az", value: "Азербайджан"},
            {key: "ax", value: "Аландские о-ва"},
            {key: "al", value: "Албания"},
            {key: "dz", value: "Алжир"},
            {key: "as", value: "Американское Самоа"},
            {key: "ai", value: "Ангилья"},
            {key: "ao", value: "Ангола"},
            {key: "ad", value: "Андорра"},
            {key: "aq", value: "Антарктида"},
            {key: "ag", value: "Антигуа и Барбуда"},
            {key: "ar", value: "Аргентина"},
            {key: "am", value: "Армения"},
            {key: "aw", value: "Аруба"},
            {key: "af", value: "Афганистан"},
            {key: "bs", value: "Багамские о-ва"},
            {key: "bd", value: "Бангладеш"},
            {key: "bb", value: "Барбадос"},
            {key: "bh", value: "Бахрейн"},
            {key: "by", value: "Беларусь"},
            {key: "bz", value: "Белиз"},
            {key: "be", value: "Бельгия"},
            {key: "bj", value: "Бенин"},
            {key: "bm", value: "Бермудские о-ва"},
            {key: "bg", value: "Болгария"},
            {key: "bo", value: "Боливия"},
            {key: "ba", value: "Босния и Герцеговина"},
            {key: "bw", value: "Ботсвана"},
            {key: "br", value: "Бразилия"},
            {key: "io", value: "Британская территория в Индийском океане"},
            {key: "bn", value: "Бруней-Даруссалам"},
            {key: "bf", value: "Буркина-Фасо"},
            {key: "bi", value: "Бурунди"},
            {key: "bt", value: "Бутан"},
            {key: "vu", value: "Вануату"},
            {key: "va", value: "Ватикан"},
            {key: "gb", value: "Великобритания"},
            {key: "hu", value: "Венгрия"},
            {key: "ve", value: "Венесуэла"},
            {key: "vg", value: "Виргинские о-ва (Британские)"},
            {key: "vi", value: "Виргинские о-ва (США)"},
            {key: "tl", value: "Восточный Тимор"},
            {key: "tp", value: "Восточный Тимор"},
            {key: "tl", value: "Восточный Тимор"},
            {key: "tp", value: "Восточный Тимор"},
            {key: "vn", value: "Вьетнама"},
            {key: "ga", value: "Габон"},
            {key: "ht", value: "Гаити"},
            {key: "gy", value: "Гайана"},
            {key: "gm", value: "Гамбия"},
            {key: "gh", value: "Гана"},
            {key: "gp", value: "Гваделупа"},
            {key: "gt", value: "Гватемала"},
            {key: "gn", value: "Гвинея"},
            {key: "gw", value: "Гвинея-Бисау"},
            {key: "de", value: "Германия"},
            {key: "gg", value: "Гернси"},
            {key: "gi", value: "Гибралтар"},
            {key: "hn", value: "Гондурас"},
            {key: "hk", value: "Гонконг"},
            {key: "gd", value: "Гренада"},
            {key: "gl", value: "Гренландия"},
            {key: "gr", value: "Греция"},
            {key: "ge", value: "Грузия"},
            {key: "gu", value: "Гуам"},
            {key: "dk", value: "Дания"},
            {key: "cd", value: "Демократическая Республика Конго"},
            {key: "je", value: "Джерси"},
            {key: "dj", value: "Джибути"},
            {key: "dm", value: "Доминика"},
            {key: "do", value: "Доминиканская Республика"},
            {key: "eg", value: "Египет"},
            {key: "zm", value: "Замбия"},
            {key: "eh", value: "Западная Сахара"},
            {key: "zw", value: "Зимбабве"},
            {key: "il", value: "Израиль"},
            {key: "in", value: "Индия"},
            {key: "id", value: "Индонезия"},
            {key: "jo", value: "Иордания"},
            {key: "iq", value: "Ирак"},
            {key: "ir", value: "Иран"},
            {key: "ie", value: "Ирландия"},
            {key: "is", value: "Исландия"},
            {key: "es", value: "Испания"},
            {key: "it", value: "Италия"},
            {key: "ye", value: "Йемен"},
            {key: "cv", value: "Кабо-Верде"},
            {key: "kz", value: "Казахстан"},
            {key: "ky", value: "Каймановы о-ва"},
            {key: "kh", value: "Камбоджа"},
            {key: "cm", value: "Камерун"},
            {key: "ca", value: "Канада"},
            {key: "cb", value: "Карибский бассейн (страны и территории)"},
            {key: "qa", value: "Катар"},
            {key: "ke", value: "Кения"},
            {key: "cy", value: "Кипр"},
            {key: "kg", value: "Киргизия"},
            {key: "ki", value: "Кирибати"},
            {key: "cn", value: "Китай"},
            {key: "cc", value: "Кокосовые о-ва (о-ва Килинг)"},
            {key: "co", value: "Колумбия"},
            {key: "km", value: "Коморские о-ва"},
            {key: "cg", value: "Конго"},
            {key: "ko", value: "Косово"},
            {key: "cr", value: "Коста-Рика"},
            {key: "ci", value: "Кот-д'Ивуар"},
            {key: "cu", value: "Куба"},
            {key: "kw", value: "Кувейт"},
            {key: "la", value: "Лаос"},
            {key: "lv", value: "Латвия"},
            {key: "ls", value: "Лесото"},
            {key: "lr", value: "Либерия"},
            {key: "lb", value: "Ливан"},
            {key: "ly", value: "Ливия"},
            {key: "lt", value: "Литва"},
            {key: "li", value: "Лихтенштейн"},
            {key: "lu", value: "Люксембург"},
            {key: "mu", value: "Маврикий"},
            {key: "mr", value: "Мавритания"},
            {key: "mg", value: "Мадагаскар"},
            {key: "yt", value: "Майотта"},
            {key: "mo", value: "Макао"},
            {key: "mk", value: "Македония"},
            {key: "mw", value: "Малави"},
            {key: "my", value: "Малайзия"},
            {key: "ml", value: "Мали"},
            {key: "mv", value: "Мальдивские о-ва"},
            {key: "mt", value: "Мальта"},
            {key: "ma", value: "Марокко"},
            {key: "mq", value: "Мартиника"},
            {key: "mh", value: "Маршалловы о-ва"},
            {key: "mx", value: "Мексика"},
            {key: "mz", value: "Мозамбик"},
            {key: "md", value: "Молдова"},
            {key: "mc", value: "Монако"},
            {key: "mn", value: "Монголия"},
            {key: "ms", value: "Монтсеррат"},
            {key: "mm", value: "Мьянма"},
            {key: "na", value: "Намибия"},
            {key: "nr", value: "Науру"},
            {key: "np", value: "Непал"},
            {key: "ne", value: "Нигер"},
            {key: "ng", value: "Нигерия"},
            {key: "an", value: "Нидерландские Антильские о-ва"},
            {key: "nl", value: "Нидерланды"},
            {key: "ni", value: "Никарагуа"},
            {key: "nu", value: "Ниуэ"},
            {key: "nz", value: "Новая Зеландия"},
            {key: "nc", value: "Новая Каледония"},
            {key: "no", value: "Норвегия"},
            {key: "nf", value: "Норфолк (о-в)"},
            {key: "ae", value: "ОАЭ"},
            {key: "om", value: "Оман"},
            {key: "ck", value: "Острова Кука"},
            {key: "im", value: "Остров Мэн"},
            {key: "cx", value: "Остров Рождества"},
            {key: "pk", value: "Пакистан"},
            {key: "pw", value: "Палау"},
            {key: "ps", value: "Палестинская территория"},
            {key: "pa", value: "Панама"},
            {key: "pg", value: "Папуа-Новая Гвинея"},
            {key: "py", value: "Парагвай"},
            {key: "pe", value: "Перу"},
            {key: "pn", value: "Питкэрн"},
            {key: "pl", value: "Польша"},
            {key: "pt", value: "Португалия"},
            {key: "pr", value: "Пуэрто-Рико"},
            {key: "re", value: "Реюньон"},
            {key: "rw", value: "Руанда"},
            {key: "ro", value: "Румыния"},
            {key: "sv", value: "Сальвадор"},
            {key: "ws", value: "Самоа"},
            {key: "sm", value: "Сан-Марино"},
            {key: "st", value: "Сан-Томе и Принсипи"},
            {key: "sa", value: "Саудовская Аравия"},
            {key: "sz", value: "Свазиленд"},
            {key: "sj", value: "Свальбард и Ян-Майен (о-ва)"},
            {key: "sh", value: "Святая Елена (о-в)"},
            {key: "kp", value: "Северная Корея"},
            {key: "mp", value: "Северные Марианские о-ва"},
            {key: "sc", value: "Сейшельские о-ва"},
            {key: "sn", value: "Сенегал"},
            {key: "pm", value: "Сен-Пьер и Микелон"},
            {key: "vc", value: "Сент-Винсент и Гренадины"},
            {key: "kn", value: "Сент-Китс и Невис"},
            {key: "lc", value: "Сент-Люсия"},
            {key: "rs", value: "Сербия"},
            {key: "sg", value: "Сингапур"},
            {key: "sy", value: "Сирия"},
            {key: "sk", value: "Словацкая Республика"},
            {key: "si", value: "Словения"},
            {key: "sb", value: "Соломоновы о-ва"},
            {key: "so", value: "Сомали"},
            {key: "sd", value: "Судан"},
            {key: "sr", value: "Суринам"},
            {key: "us", value: "США"},
            {key: "sl", value: "Сьерра-Леоне"},
            {key: "tj", value: "Таджикистан"},
            {key: "th", value: "Таиланд"},
            {key: "tw", value: "Тайвань"},
            {key: "tz", value: "Танзания"},
            {key: "tc", value: "Теркс и Кайкос (о-ва)"},
            {key: "tg", value: "Того"},
            {key: "tk", value: "Токелау"},
            {key: "to", value: "Тонга"},
            {key: "tt", value: "Тринидад и Тобаго"},
            {key: "tv", value: "Тувалу"},
            {key: "tn", value: "Тунис"},
            {key: "tm", value: "Туркменистан"},
            {key: "tr", value: "Турция"},
            {key: "ug", value: "Уганда"},
            {key: "uz", value: "Узбекистан"},
            {key: "ua", value: "Украина"},
            {key: "wf", value: "Уоллис и Футуна"},
            {key: "uy", value: "Уругвай"},
            {key: "fo", value: "Фарерские о-ва"},
            {key: "fm", value: "Федеративные Штаты Микронезии"},
            {key: "fj", value: "Фиджи"},
            {key: "ph", value: "Филиппины"},
            {key: "fi", value: "Финляндия"},
            {key: "fk", value: "Фолклендские о-ва (Мальвинские о-ва)"},
            {key: "fr", value: "Франция"},
            {key: "gf", value: "Французская Гвиана"},
            {key: "pf", value: "Французская Полинезия"},
            {key: "tf", value: "Французские Южные Территории"},
            {key: "hr", value: "Хорватия"},
            {key: "cf", value: "Центральноафриканская Республика"},
            {key: "td", value: "Чад"},
            {key: "me", value: "Черногория"},
            {key: "cz", value: "Чешская Республика"},
            {key: "cl", value: "Чили"},
            {key: "ch", value: "Швейцария"},
            {key: "se", value: "Швеция"},
            {key: "lk", value: "Шри-Ланка"},
            {key: "ec", value: "Эквадор"},
            {key: "gq", value: "Экваториальная Гвинея"},
            {key: "er", value: "Эритрея"},
            {key: "ee", value: "Эстония"},
            {key: "et", value: "Эфиопия"},
            {key: "za", value: "ЮАР"},
            {key: "kr", value: "Южная Корея"},
            {key: "ss", value: "Южный Судан"},
            {key: "jm", value: "Ямайка"},
            {key: "jp", value: "Япония"},
            {key: "oo", value: "Другое"},
            {key: "us", value: "United States"},
            {key: "af", value: "Afghanistan"},
            {key: "ax", value: "Aland Islands"},
            {key: "al", value: "Albania"},
            {key: "dz", value: "Algeria"},
            {key: "as", value: "American Samoa"},
            {key: "ad", value: "Andorra"},
            {key: "ao", value: "Angola"},
            {key: "ai", value: "Anguilla"},
            {key: "aq", value: "Antarctica"},
            {key: "ag", value: "Antigua and Barbuda"},
            {key: "ar", value: "Argentina"},
            {key: "am", value: "Armenia"},
            {key: "aw", value: "Aruba"},
            {key: "au", value: "Australia"},
            {key: "at", value: "Austria"},
            {key: "az", value: "Azerbaijan"},
            {key: "bs", value: "Bahamas"},
            {key: "bh", value: "Bahrain"},
            {key: "bd", value: "Bangladesh"},
            {key: "bb", value: "Barbados"},
            {key: "by", value: "Belarus"},
            {key: "be", value: "Belgium"},
            {key: "bz", value: "Belize"},
            {key: "bj", value: "Benin"},
            {key: "bm", value: "Bermuda"},
            {key: "bt", value: "Bhutan"},
            {key: "bo", value: "Bolivia"},
            {key: "ba", value: "Bosnia and Herzegovina"},
            {key: "bw", value: "Botswana"},
            {key: "br", value: "Brazil"},
            {key: "io", value: "British Indian Ocean Territory"},
            {key: "bn", value: "Brunei Darussalam"},
            {key: "bg", value: "Bulgaria"},
            {key: "bf", value: "Burkina Faso"},
            {key: "bi", value: "Burundi"},
            {key: "kh", value: "Cambodia"},
            {key: "cm", value: "Cameroon"},
            {key: "ca", value: "Canada"},
            {key: "cv", value: "Cape Verde"},
            {key: "cb", value: "Caribbean Nations"},
            {key: "ky", value: "Cayman Islands"},
            {key: "cf", value: "Central African Republic"},
            {key: "td", value: "Chad"},
            {key: "cl", value: "Chile"},
            {key: "cn", value: "China"},
            {key: "cx", value: "Christmas Island"},
            {key: "cc", value: "Cocos (Keeling) Islands"},
            {key: "co", value: "Colombia"},
            {key: "km", value: "Comoros"},
            {key: "cg", value: "Congo"},
            {key: "ck", value: "Cook Islands"},
            {key: "cr", value: "Costa Rica"},
            {key: "ci", value: "Cote D\"Ivoire (Ivory Coast)"},
            {key: "hr", value: "Croatia"},
            {key: "cu", value: "Cuba"},
            {key: "cy", value: "Cyprus"},
            {key: "cz", value: "Czech Republic"},
            {key: "cd", value: "Democratic Republic of the Congo"},
            {key: "dk", value: "Denmark"},
            {key: "dj", value: "Djibouti"},
            {key: "dm", value: "Dominica"},
            {key: "do", value: "Dominican Republic"},
            {key: "tp", value: "East Timor"},
            {key: "ec", value: "Ecuador"},
            {key: "eg", value: "Egypt"},
            {key: "sv", value: "El Salvador"},
            {key: "gq", value: "Equatorial Guinea"},
            {key: "er", value: "Eritrea"},
            {key: "ee", value: "Estonia"},
            {key: "et", value: "Ethiopia"},
            {key: "fk", value: "Falkland Islands (Malvinas)"},
            {key: "fo", value: "Faroe Islands"},
            {key: "fm", value: "Federated States of Micronesia"},
            {key: "fj", value: "Fiji"},
            {key: "fi", value: "Finland"},
            {key: "fr", value: "France"},
            {key: "gf", value: "French Guiana"},
            {key: "pf", value: "French Polynesia"},
            {key: "tf", value: "French Southern Territories"},
            {key: "ga", value: "Gabon"},
            {key: "gm", value: "Gambia"},
            {key: "ge", value: "Georgia"},
            {key: "de", value: "Germany"},
            {key: "gh", value: "Ghana"},
            {key: "gi", value: "Gibraltar"},
            {key: "gr", value: "Greece"},
            {key: "gl", value: "Greenland"},
            {key: "gd", value: "Grenada"},
            {key: "gp", value: "Guadeloupe"},
            {key: "gu", value: "Guam"},
            {key: "gt", value: "Guatemala"},
            {key: "gg", value: "Guernsey"},
            {key: "gn", value: "Guinea"},
            {key: "gw", value: "Guinea-Bissau"},
            {key: "gy", value: "Guyana"},
            {key: "ht", value: "Haiti"},
            {key: "hn", value: "Honduras"},
            {key: "hk", value: "Hong Kong"},
            {key: "hu", value: "Hungary"},
            {key: "is", value: "Iceland"},
            {key: "in", value: "India"},
            {key: "id", value: "Indonesia"},
            {key: "ir", value: "Iran"},
            {key: "iq", value: "Iraq"},
            {key: "ie", value: "Ireland"},
            {key: "im", value: "Isle of Man"},
            {key: "il", value: "Israel"},
            {key: "it", value: "Italy"},
            {key: "jm", value: "Jamaica"},
            {key: "jp", value: "Japan"},
            {key: "je", value: "Jersey"},
            {key: "jo", value: "Jordan"},
            {key: "kz", value: "Kazakhstan"},
            {key: "ke", value: "Kenya"},
            {key: "ki", value: "Kiribati"},
            {key: "kr", value: "Korea"},
            {key: "kp", value: "Korea (North)"},
            {key: "ko", value: "Kosovo"},
            {key: "kw", value: "Kuwait"},
            {key: "kg", value: "Kyrgyzstan"},
            {key: "la", value: "Laos"},
            {key: "lv", value: "Latvia"},
            {key: "lb", value: "Lebanon"},
            {key: "ls", value: "Lesotho"},
            {key: "lr", value: "Liberia"},
            {key: "ly", value: "Libya"},
            {key: "li", value: "Liechtenstein"},
            {key: "lt", value: "Lithuania"},
            {key: "lu", value: "Luxembourg"},
            {key: "mo", value: "Macao"},
            {key: "mk", value: "Macedonia"},
            {key: "mg", value: "Madagascar"},
            {key: "mw", value: "Malawi"},
            {key: "my", value: "Malaysia"},
            {key: "mv", value: "Maldives"},
            {key: "ml", value: "Mali"},
            {key: "mt", value: "Malta"},
            {key: "mh", value: "Marshall Islands"},
            {key: "mq", value: "Martinique"},
            {key: "mr", value: "Mauritania"},
            {key: "mu", value: "Mauritius"},
            {key: "yt", value: "Mayotte"},
            {key: "mx", value: "Mexico"},
            {key: "md", value: "Moldova"},
            {key: "mc", value: "Monaco"},
            {key: "mn", value: "Mongolia"},
            {key: "me", value: "Montenegro"},
            {key: "ms", value: "Montserrat"},
            {key: "ma", value: "Morocco"},
            {key: "mz", value: "Mozambique"},
            {key: "mm", value: "Myanmar"},
            {key: "na", value: "Namibia"},
            {key: "nr", value: "Nauru"},
            {key: "np", value: "Nepal"},
            {key: "nl", value: "Netherlands"},
            {key: "an", value: "Netherlands Antilles"},
            {key: "nc", value: "New Caledonia"},
            {key: "nz", value: "New Zealand"},
            {key: "ni", value: "Nicaragua"},
            {key: "ne", value: "Niger"},
            {key: "ng", value: "Nigeria"},
            {key: "nu", value: "Niue"},
            {key: "nf", value: "Norfolk Island"},
            {key: "mp", value: "Northern Mariana Islands"},
            {key: "no", value: "Norway"},
            {key: "pk", value: "Pakistan"},
            {key: "pw", value: "Palau"},
            {key: "ps", value: "Palestinian Territory"},
            {key: "pa", value: "Panama"},
            {key: "pg", value: "Papua New Guinea"},
            {key: "py", value: "Paraguay"},
            {key: "pe", value: "Peru"},
            {key: "ph", value: "Philippines"},
            {key: "pn", value: "Pitcairn"},
            {key: "pl", value: "Poland"},
            {key: "pt", value: "Portugal"},
            {key: "pr", value: "Puerto Rico"},
            {key: "qa", value: "Qatar"},
            {key: "re", value: "Reunion"},
            {key: "ro", value: "Romania"},
            {key: "ru", value: "Russian Federation"},
            {key: "ru", value: "Russia"},
            {key: "rw", value: "Rwanda"},
            {key: "sh", value: "Saint Helena"},
            {key: "kn", value: "Saint Kitts and Nevis"},
            {key: "lc", value: "Saint Lucia"},
            {key: "pm", value: "Saint Pierre and Miquelon"},
            {key: "vc", value: "Saint Vincent and the Grenadines"},
            {key: "ws", value: "Samoa"},
            {key: "sm", value: "San Marino"},
            {key: "st", value: "Sao Tome and Principe"},
            {key: "sa", value: "Saudi Arabia"},
            {key: "sn", value: "Senegal"},
            {key: "rs", value: "Serbia"},
            {key: "sc", value: "Seychelles"},
            {key: "sl", value: "Sierra Leone"},
            {key: "sg", value: "Singapore"},
            {key: "sk", value: "Slovak Republic"},
            {key: "si", value: "Slovenia"},
            {key: "sb", value: "Solomon Islands"},
            {key: "so", value: "Somalia"},
            {key: "za", value: "South Africa"},
            {key: "ss", value: "South Sudan"},
            {key: "es", value: "Spain"},
            {key: "lk", value: "Sri Lanka"},
            {key: "sd", value: "Sudan"},
            {key: "om", value: "Sultanate of Oman"},
            {key: "sr", value: "Suriname"},
            {key: "sj", value: "Svalbard and Jan Mayen"},
            {key: "sz", value: "Swaziland"},
            {key: "se", value: "Sweden"},
            {key: "ch", value: "Switzerland"},
            {key: "sy", value: "Syria"},
            {key: "tw", value: "Taiwan"},
            {key: "tj", value: "Tajikistan"},
            {key: "tz", value: "Tanzania"},
            {key: "th", value: "Thailand"},
            {key: "tl", value: "Timor-Leste"},
            {key: "tg", value: "Togo"},
            {key: "tk", value: "Tokelau"},
            {key: "to", value: "Tonga"},
            {key: "tt", value: "Trinidad and Tobago"},
            {key: "tn", value: "Tunisia"},
            {key: "tr", value: "Turkey"},
            {key: "tm", value: "Turkmenistan"},
            {key: "tc", value: "Turks and Caicos Islands"},
            {key: "tv", value: "Tuvalu"},
            {key: "ug", value: "Uganda"},
            {key: "ua", value: "Ukraine"},
            {key: "ae", value: "United Arab Emirates"},
            {key: "gb", value: "United Kingdom"},
            {key: "uy", value: "Uruguay"},
            {key: "uz", value: "Uzbekistan"},
            {key: "vu", value: "Vanuatu"},
            {key: "va", value: "Vatican City State (Holy See)"},
            {key: "ve", value: "Venezuela"},
            {key: "vn", value: "Vietnam"},
            {key: "vg", value: "Virgin Islands (British)"},
            {key: "vi", value: "Virgin Islands (U.S.)"},
            {key: "wf", value: "Wallis and Futuna"},
            {key: "eh", value: "Western Sahara"},
            {key: "ye", value: "Yemen"},
            {key: "zm", value: "Zambia"},
            {key: "zw", value: "Zimbabwe"},
            {key: "oo", value: "Other"}
        ];
    };

    service.dynamicTableLoading = function (total, page, count, getDataFunction) {

        let pagesPerOneLoad = count,
            currentPage = page,
            pagesCount = Math.ceil(total/pagesPerOneLoad);
                if(currentPage < pagesCount - 1) {
                    $rootScope.loading = true;
                    currentPage++;
                    updateData(currentPage);
                }

        function updateData(pageNext) {
            if(getDataFunction) {
                moveUpFunc();
                getDataFunction(pageNext, pagesPerOneLoad);
            }
        }
        function moveUpFunc(){
            let scrollUp = document.getElementById('scrollup'); // найти элемент
            scrollUp.style.display = 'block';
            scrollUp.style.position = 'fixed';
            scrollUp.style.bottom = '20px';
            scrollUp.style.left = '0px';
            scrollUp.onmouseover = function() { // добавить прозрачность
                scrollUp.style.opacity=0.3;
                scrollUp.style.filter  = 'alpha(opacity=30)';
            };

            scrollUp.onmouseout = function() { //убрать прозрачность
                scrollUp.style.opacity = 0.5;
                scrollUp.style.filter  = 'alpha(opacity=50)';
            };

            scrollUp.onclick = function() { //обработка клика
                window.scrollTo(0,0);
            };
        }
    };

    return service;
}]);
