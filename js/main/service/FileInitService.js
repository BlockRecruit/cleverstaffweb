 angular.module('services.fileinit', [
        'services.candidate'
    ]
).factory('FileInit', ['serverAddress', '$http', 'Candidate', 'notificationService', '$rootScope', function(serverAddress, $http, Candidate, notificationService, $rootScope) {
    return {
        initFileOption: function($scope, path, setings, $filter) {
            $scope.file = {}; //Model
            $scope.options = {
                change: function(file) {
                    $rootScope.loading = true;
                    var uri = serverAddress;
                    if (path != undefined)
                        uri = uri + "/" + path;
                    uri = uri + '/addFile';
                    if ($scope.objectId != undefined)
                        uri = uri + "/" + $scope.objectId;
                    $scope.fileIsSelected = true;
                    $scope.ngShowOldFile = false;
                    file.$preview(file).then(function(data) {
                        /** @namespace data.item.thumb */
                        $scope.newImgSrc = data.item.thumb;
                        $scope.fileName = data.item.filename;
                        $scope.ngShowNewImage = true;
                    });
                    file.$upload(uri, $scope.file, setings, $scope).then(function(data) {
                        $scope.loading = false;
                        $rootScope.loading = false;
                        var resp = JSON.parse(data.response);

                        if (data.statusText == 'OK' && resp.status != 'error') {
                            if ($scope.callbackFile != undefined) {
                                $scope.callbackFile(data.data.objects[0], $scope.file.filename);
                                if(path == 'candidate'){
                                    $scope.updateCandidate();
                                }else {
                                    $scope.updateClient();
                                }
                                new PNotify({
                                    styling: 'jqueryui',
                                    type: "success",
                                    text: ($filter('translate')('history_info.added_file'))
                                });
                            }
                        } else if (resp.status == 'error') {
                            notificationService.error(resp.message);
                            if ($scope.callbackFileError != undefined) {
                                $scope.callbackFileError("error");
                            }
                        }
                    }).catch(function(data) {

                        $scope.loading = false;

//                            data.response= JSON.parse(data.response);
                        if (data.response[0].code == 'type') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: $filter('translate')('Allowed file formats') + ": " + setings.allowedType.join(", ")
                            });
                        }
                        if (data.response[0].code == 'upload') {
                            console.log("upload===");
                        }
                        if (data.response[0].code == 'size') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Большой размер файла"
                            });
                        }
                    });

                }
            };
        },
        initFileVacancy: function($scope, path, $filter, setings) {
            $scope.fileForVacancy = {}; //Model
            $scope.optionsForVacancy = {
                change: function(file) {
                    $rootScope.loading = true;
                    var uri = serverAddress;
                    if (path != undefined)
                        uri = uri + "/" + path;
                    uri = uri + '/addFile';
                    if ($scope.objectId != undefined)
                        uri = uri + "/" + $scope.objectId;
                    $scope.fileIsSelected = true;
                    $scope.ngShowOldFile = false;
                    file.$preview(file).then(function(data) {
                        /** @namespace data.item.thumb */
                        $scope.newImgSrc = data.item.thumb;
                        $scope.fileName = data.item.filename;
                        $scope.ngShowNewImage = true;
                    });
                    file.$upload(uri, $scope.fileForVacancy, setings, $scope).then(function(data) {
                        $scope.loading = false;
                        var resp = JSON.parse(data.response);

                        if (data.statusText == 'OK' && resp.status != 'error') {
                            if ($scope.callbackFile != undefined) {
                                $scope.callbackFile(data.data.objects[0], $scope.fileForVacancy.filename);
                                $scope.updateVacancy();
                                new PNotify({
                                    styling: 'jqueryui',
                                    type: "success",
                                    text: ($filter('translate')('history_info.added_file'))
                                });
                            }
                        } else if (resp.status == 'error') {
                            notificationService.error(resp.message);
                            if ($scope.callbackFileError != undefined) {
                                $scope.callbackFileError("error");
                            }
                        }
                    }).catch(function(data) {

                        $scope.loading = false;

//                            data.response= JSON.parse(data.response);
                        if (data.response[0].code == 'type') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: $filter('translate')('Allowed file formats') + ": " + setings.allowedType.join(", ")
                            });
                        }
                        if (data.response[0].code == 'upload') {
                            console.log("upload===");
                        }
                        if (data.response[0].code == 'size') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Большой размер файла"
                            });
                        }
                    });

                }
            };
        },
        initCandFileOption: function($scope, path, setings, toSave, $filter) {
            $scope.file = {}; //Model
            $scope.options = {
                change: function(file) {
                    var uri = serverAddress;
                    if (path != undefined)
                        uri = uri + "/" + path;
                    uri = uri + '/addFile';
                    if ($scope.objectId != undefined)
                        uri = uri + "/" + $scope.objectId;
                    $scope.fileIsSelected = true;
                    $scope.ngShowOldFile = false;
                    file.$preview(file).then(function(data) {
                        $scope.newImgSrc = data.item.thumb;
                        $scope.fileName = data.item.filename;
                        $scope.ngShowNewImage = true;
                    });
                    file.$upload(uri, $scope.file, setings, $scope).then(function(data) {
                        $scope.loading = false;
                        console.log(data);
                        if (data.data.status == 'ok') {
                            if ($scope.callbackFile != undefined) {
                                $scope.callbackFile(data.data.objects[0], $scope.file.filename);
                                new PNotify({
                                    styling: 'jqueryui',
                                    type: "success",
                                    text: ($filter('translate')('history_info.added_file'))
                                });
                            }
                            $scope.fastCandAttachProcessId = data.data.objects[0];
                            $scope.fastCandAttachProcess = true;
                            //file.$upload(serverAddress + '/candidate/fromFile', file).then(function(data) {
                            //    console.log(data);
                            //    Candidate.convert2($scope, data.data.object, toSave);
                            //    if (toSave) {
                            //    }
                            //    $scope.fastCandAttachProcess = false;
                            //}).catch(function(data) {
                            //    console.log(data);
                            //    //$scope.callbackErr(data.statusText);
                            //    $scope.fastCandAttachProcess = false;
                            //});
                        }else{
                            console.log(2);
                                new PNotify({
                                    styling: 'jqueryui',
                                    type: "error",
                                    text: data.data.message
                                });
                        }
                    }).catch(function(data) {
                        $scope.loading = false;
                        if (data.response[0].code == 'type') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Возможные форматы файла: " + setings.allowedType.join(", ")
                            });
                        }
                        if (data.response[0].code == 'upload') {
                            console.log("upload===");
                        }
                        if (data.response[0].code == 'size') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Большой размер файла"
                            });
                        }
                    });

                }
            };
        },
        initVacancyTemplateInCandidateFileOption: function($scope, $rootScope, path, setings, toSave, $filter) {
            $scope.file = {}; //Model
            $rootScope.optionsTemplate = {
                change: function(file) {
                    var uri = serverAddress;
                    //if (path != undefined)
                    //    uri = uri + "/" + path;
                    uri = uri + '/addFile';
                    console.log(uri);
                    console.log(12321);
                    if ($scope.fileId != undefined)
                        uri = uri + "/" + $scope.objectId;
                    $scope.fileIsSelected = true;
                    $scope.ngShowOldFile = false;
                    file.$preview(file).then(function(data) {
                        $scope.newImgSrc = data.item.thumb;
                        $scope.fileName = data.item.filename;
                        $scope.ngShowNewImage = true;
                    });
                    file.$upload(uri, $scope.file, setings, $scope).then(function(data) {
                        $scope.loading = false;
                        console.log(data);
                        if (data.data.status == 'ok') {
                            if ($scope.callbackFileTemplateInCandidate != undefined) {
                                $scope.callbackFileTemplateInCandidate(data.data.objects[0], $scope.file.filename);
                                new PNotify({
                                    styling: 'jqueryui',
                                    type: "success",
                                    text: ($filter('translate')('history_info.added_file'))
                                });
                            }
                            $scope.fastCandAttachProcessId = data.data.objects[0];
                            $scope.fastCandAttachProcess = true;
                            //file.$upload(serverAddress + '/candidate/fromFile', file).then(function(data) {
                            //    console.log(data);
                            //    Candidate.convert2($scope, data.data.object, toSave);
                            //    if (toSave) {
                            //    }
                            //    $scope.fastCandAttachProcess = false;
                            //}).catch(function(data) {
                            //    console.log(data);
                            //    //$scope.callbackErr(data.statusText);
                            //    $scope.fastCandAttachProcess = false;
                            //});
                        }else{
                            console.log(2);
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: data.data.message
                            });
                        }
                    }).catch(function(data) {
                        $scope.loading = false;
                        if (data.response[0].code == 'type') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Возможные форматы файла: " + setings.allowedType.join(", ")
                            });
                        }
                        if (data.response[0].code == 'upload') {
                            console.log("upload===");
                        }
                        if (data.response[0].code == 'size') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Большой размер файла"
                            });
                        }
                    });

                }
            };
        },
        initVacancyTemplateFileOption: function($scope, path, setings, toSave, $filter) {
            $scope.file = {}; //Model
            $scope.optionsForTemplate = {
                change: function(file) {
                    var uri = serverAddress;
                    if (path != undefined)
                        uri = uri + "/" + path;
                    uri = uri + '/addFile';
                    if ($scope.fileId != undefined)
                        uri = uri + "/" + $scope.objectId;
                    $scope.fileIsSelected = true;
                    $scope.ngShowOldFile = false;
                    file.$preview(file).then(function(data) {
                        $scope.newImgSrc = data.item.thumb;
                        $scope.fileName = data.item.filename;
                        $scope.ngShowNewImage = true;
                    });
                    $rootScope.loading = true;
                    file.$upload(uri, $scope.file, setings, $scope).then(function(data) {
                        $rootScope.loading = false;
                        console.log(data);
                        if (data.data.status == 'ok') {
                            if ($scope.callbackFileForTemplate != undefined) {
                                $scope.callbackFileForTemplate(data.data.objects[0], $scope.file.filename);
                                new PNotify({
                                    styling: 'jqueryui',
                                    type: "success",
                                    text: ($filter('translate')('history_info.added_file'))
                                });
                            }
                            $scope.fastCandAttachProcessId = data.data.objects[0];
                            $scope.fastCandAttachProcess = true;
                            //file.$upload(serverAddress + '/candidate/fromFile', file).then(function(data) {
                            //    console.log(data);
                            //    Candidate.convert2($scope, data.data.object, toSave);
                            //    if (toSave) {
                            //    }
                            //    $scope.fastCandAttachProcess = false;
                            //}).catch(function(data) {
                            //    console.log(data);
                            //    //$scope.callbackErr(data.statusText);
                            //    $scope.fastCandAttachProcess = false;
                            //});
                        }else{
                            console.log(2);
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: data.data.message
                            });
                        }
                    }).catch(function(data) {
                        $scope.loading = false;
                        if (data.response[0].code == 'type') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Возможные форматы файла: " + setings.allowedType.join(", ")
                            });
                        }
                        if (data.response[0].code == 'upload') {
                            console.log("upload===");
                        }
                        if (data.response[0].code == 'size') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Большой размер файла"
                            });
                        }
                    });

                }
            };
        },
        initVacancyTemplateInCandidateFileOption: function($scope, $rootScope, path, setings, toSave, $filter) {
            $scope.file = {}; //Model
            $rootScope.optionsTemplate = {
                change: function(file) {
                    var uri = serverAddress;
                    //if (path != undefined)
                    //    uri = uri + "/" + path;
                    uri = uri + '/addFile';
                    console.log(uri);
                    console.log(12321);
                    if ($scope.fileId != undefined)
                        uri = uri + "/" + $scope.objectId;
                    $scope.fileIsSelected = true;
                    $scope.ngShowOldFile = false;
                    file.$preview(file).then(function(data) {
                        $scope.newImgSrc = data.item.thumb;
                        $scope.fileName = data.item.filename;
                        $scope.ngShowNewImage = true;
                    });
                    file.$upload(uri, $scope.file, setings, $scope).then(function(data) {
                        $scope.loading = false;
                        console.log(data);
                        if (data.data.status == 'ok') {
                            if ($scope.callbackFileTemplateInCandidate != undefined) {
                                $scope.callbackFileTemplateInCandidate(data.data.objects[0], $scope.file.filename);
                                new PNotify({
                                    styling: 'jqueryui',
                                    type: "success",
                                    text: ($filter('translate')('history_info.added_file'))
                                });
                            }
                            $scope.fastCandAttachProcessId = data.data.objects[0];
                            $scope.fastCandAttachProcess = true;
                            //file.$upload(serverAddress + '/candidate/fromFile', file).then(function(data) {
                            //    console.log(data);
                            //    Candidate.convert2($scope, data.data.object, toSave);
                            //    if (toSave) {
                            //    }
                            //    $scope.fastCandAttachProcess = false;
                            //}).catch(function(data) {
                            //    console.log(data);
                            //    //$scope.callbackErr(data.statusText);
                            //    $scope.fastCandAttachProcess = false;
                            //});
                        }else{
                            console.log(2);
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: data.data.message
                            });
                        }
                    }).catch(function(data) {
                        $scope.loading = false;
                        if (data.response[0].code == 'type') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Возможные форматы файла: " + setings.allowedType.join(", ")
                            });
                        }
                        if (data.response[0].code == 'upload') {
                            console.log("upload===");
                        }
                        if (data.response[0].code == 'size') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Большой размер файла"
                            });
                        }
                    });

                }
            };
        },
        initFileOptionForEditFromResume: function($scope, path, setings) {
            $scope.file = {}; //Model
            $scope.optionsForEditFromResume = {
                change: function(file) {
                    var uri = serverAddress;
                    if (path != undefined)
                        uri = uri + "/" + path;
                    uri = uri + '/updateFromFile';
                    if ($scope.objectId != undefined)
                        uri = uri + "/" + $scope.objectId;
                    $scope.fileIsSelected = true;
                    $scope.ngShowOldFile = false;
                    file.$preview(file).then(function(data) {
                        /** @namespace data.item.thumb */
                        $scope.newImgSrc = data.item.thumb;
                        $scope.fileName = data.item.filename;
                        $scope.ngShowNewImage = true;
                    });
                    file.$upload(uri, $scope.file, setings, $scope).then(function(data) {
                        $scope.loading = false;
                        var resp = JSON.parse(data.response);

                        if (data.statusText == 'OK' && resp.status != 'error') {
                            if ($scope.callbackFile != undefined) {
                                $scope.updateCandidate();
                            }
                        } else if (resp.status == 'error') {
                            notificationService.error(resp.message);
                            if ($scope.callbackFileError != undefined) {
                                $scope.callbackFileError("error");
                            }
                        }
                        $('.confirmationResumeUpdate.modal').modal('hide');
                    }).catch(function(data) {

                        $scope.loading = false;

//                            data.response= JSON.parse(data.response);
                        if (data.response[0].code == 'type') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Возможные форматы файла: " + setings.allowedType.join(", ")
                            });
                        }
                        if (data.response[0].code == 'upload') {
                            console.log("upload===");
                        }
                        if (data.response[0].code == 'size') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Большой размер файла"
                            });
                        }
                    });

                }
            };
        },
        initFileExcellUpload: function($rootScope, $scope, path, setings, $filter) {
            $scope.file = {}; //Model
            $scope.options = {
                change: function(file) {
                    $rootScope.loading = true;
                    console.log('hereeeeeeeeeee');
                    var uri = serverAddress;
                    if (path != undefined)
                        uri = uri + "/" + path;
                    uri = uri + '/uploadExcelFile';
                    if ($scope.objectId != undefined)
                        uri = uri + "/" + $scope.objectId;
                    $scope.fileIsSelected = true;
                    $scope.ngShowOldFile = false;
                    file.$preview(file).then(function(data) {
                        /** @namespace data.item.thumb */
                        $scope.newImgSrc = data.item.thumb;
                        $scope.fileName = data.item.filename;
                        $scope.ngShowNewImage = true;
                    });
                    file.$upload(uri, $scope.file, setings, $scope).then(function(data) {
                        $scope.loading = false;
                        var resp = JSON.parse(data.response);

                        if (data.statusText == 'OK' && resp.status != 'error') {
                            //if ($scope.callbackFile != undefined) {
                            //    $scope.callbackFile(data.data.objects[0], $scope.file.filename);
                            //}
                            $rootScope.loading = false;
                            new PNotify({
                                styling: 'jqueryui',
                                type: "success",
                                text: ($filter('translate')('history_info.added_file'))
                            });
                        } else if (resp.status == 'error') {
                            $rootScope.loading = false;
                            notificationService.error(resp.message);
                            if ($scope.callbackFileError != undefined) {
                                $scope.callbackFileError("error");
                            }
                        }
                    }).catch(function(data) {

                        $rootScope.loading = false;

//                            data.response= JSON.parse(data.response);
                        if (data.response[0].code == 'type') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: $filter('translate')('Allowed file formats') + ": " + setings.allowedType.join(", ")
                            });
                        }
                        if (data.response[0].code == 'upload') {
                            console.log("upload===");
                        }
                        if (data.response[0].code == 'size') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Большой размер файла"
                            });
                        }
                    });

                }
            };
        },
        addPhotoByReference: function(url, callback) {
            console.log('in serv', url)
            $http({
                url: serverAddress + '/addPhotoByReference',
                method: "GET",
                params: {reference: url}
            }).success(function(data) {
                if (data.status == "ok") {
                    callback(data.object);
                } else if (data.status == "error") {
                    callback('error')
                    notificationService.error(data.message)
                }
            });
        }
    };
     var FileInit = $resource(serverAddress + '/action/:param', {param: "@param"}, {
             changeFileName: {
                 method : "POST",
                 headers: {'Content-type':'application/json; charset=UTF-8'},
                 params: {
                     param: 'changeFileName'
                 }
             }


         });

     return FileInit;
}]);
