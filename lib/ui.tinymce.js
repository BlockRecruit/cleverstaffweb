angular.module('ui.tinymce', [])
    .value('uiTinymceConfig', {})
    .directive('uiTinymce', ['uiTinymceConfig', function (uiTinymceConfig, $translate) {
        uiTinymceConfig = uiTinymceConfig || {};
        var generatedIds = 0;
        return {
            priority: 10,
            scope: {
                disabledMce: '=',
                resizable: '='
            },
            require: 'ngModel',
            link: function (scope, elm, attrs, ngModel) {
                var expression, options, tinyInstance,
                    updateView = function () {
                        ngModel.$setViewValue(elm.val());
                        if (scope.tinymceChanged != undefined) {
                            scope.tinymceChanged(elm.val());
                        }
                        if (!scope.$root.$$phase) {
                            scope.$apply();
                        }

                    };

                // generate an ID if not present
                if (!attrs.id) {
                    attrs.$set('id', 'uiTinymce' + generatedIds++);
                }

                if (attrs.uiTinymce) {
                    expression = scope.$eval(attrs.uiTinymce);
                } else {
                    expression = {};
                }

                // make config'ed setup method available
                if (expression.setup) {
                    var configSetup = expression.setup;
                    delete expression.setup;
                }

                var plugin = [];
                if (!scope.tinyMcePlugin) {
                    plugin = [
                        "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                        "searchreplace visualblocks visualchars code fullscreen",
                        "insertdatetime media nonbreaking save table directionality",
                        "template paste textcolor  "
                    ];
                } else {
                    plugin = scope.tinyMcePlugin;
                }
                var lang = localStorage.getItem('NG_TRANSLATE_LANG_KEY');

                options = {
                    // Update model when calling setContent (such as from the source editor popup)
                    setup: function (ed) {
                        var args;
                        ed.on('init', function (args) {
                            ngModel.$render();
                            ngModel.$setPristine();
                        });
                        // Update model on button click
                        ed.on('ExecCommand', function (e) {
                            ed.save();
                            updateView();
                        });
                        // Update model on keypress
                        ed.on('KeyUp', function (e) {
                            ed.save();
                            updateView();
                        });
                        // Update model on change, i.e. copy/pasted text, plugins altering content
                        ed.on('SetContent', function (e) {
                            if (!e.initial && ngModel.$viewValue !== e.content) {
                                ed.save();
                                updateView();
                            }
                        });
                        ed.on('blur', function (e) {
                            elm.blur();
                        });
                        // Update model when an object has been resized (table, image)
                        ed.on('ObjectResized', function (e) {
                            ed.save();
                            updateView();
                        });
                        ed.on('change', function(e) {
                            ngModel.$viewValue = tinyInstance.getContent();
                            ed.save();
                            updateView();
                        });
                        if (configSetup) {
                            configSetup(ed);
                        }
                    },
                    mode: 'exact',
                    theme: "modern",
                    resize: scope.resizable === true ? true : false,
                    readonly: 0,
                    height: 300,
                    language: lang != undefined || lang != null ? lang : "ru",
                    browser_spellcheck: true,
                    menu: {
                        format: {title: 'Format', items: 'underline strikethrough superscript subscript | formats | removeformat'},
                        insert: {title: 'Insert', items: 'media image | charmap hr insertdatetime'}
                    },
                    statusbar: scope.resizable === true ? true : false,
                    theme_advanced_resizing: true,
                    plugins: plugin,
                    fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
                    toolbar1: "undo redo | bold italic forecolor backcolor fontsizeselect | bullist numlist outdent indent | table | link",
                    image_advtab: true,
                    toolbar_items_size: 'small',
                    relative_urls: false,
                    link_assume_external_targets: true,

                    elements: attrs.id,
                    content_css: "/dist/css/tinymce.css"
                };
                // extend options with initial uiTinymceConfig and options from directive attribute value
                angular.extend(options, uiTinymceConfig, expression);
                setTimeout(function () {
                    tinymce.init(options);
                });

                ngModel.$render = function () {
                    if (!tinyInstance) {
                        tinyInstance = tinymce.get(attrs.id);
                    }
                    if (tinyInstance) {
                        tinyInstance.setContent(ngModel.$viewValue || '');
                    }
                };

                scope.$on('$destroy', function () {
                    if (!tinyInstance) {
                        tinyInstance = tinymce.get(attrs.id);
                    }
                    if (tinyInstance) {
                        tinyInstance.remove();
                        tinyInstance = null;
                    }
                });
            }
        };
    }]).directive('uiTinymceForRender', ['uiTinymceConfig','$filter','$rootScope', function (uiTinymceConfig, $filter, $rootScope) {
    uiTinymceConfig = uiTinymceConfig || {};
    var generatedIds = 0;
    return {
        priority: 10,
        scope: {
            disabledMce: '='
        },
        require: 'ngModel',
        link: function (scope, elm, attrs, ngModel) {
            var expression, options, tinyInstance,
                updateView = function () {
                    ngModel.$setViewValue(elm.val());
                    if (scope.tinymceChanged != undefined) {
                        scope.tinymceChanged(elm.val());
                    }
                    if (!scope.$root.$$phase) {
                        scope.$apply();
                    }

                };

            // generate an ID if not present
            if (!attrs.id) {
                attrs.$set('id', 'uiTinymce' + generatedIds++);
            }

            if (attrs.uiTinymce) {
                expression = scope.$eval(attrs.uiTinymce);
            } else {
                expression = {};
            }

            // make config'ed setup method available
            if (expression.setup) {
                var configSetup = expression.setup;
                delete expression.setup;
            }

            var plugin = [];
            if (!scope.tinyMcePlugin) {
                plugin = [
                    "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                    "searchreplace visualblocks visualchars code fullscreen",
                    "insertdatetime media nonbreaking save table directionality",
                    "template paste textcolor  "
                ];
            } else {
                plugin = scope.tinyMcePlugin;
            }
            var lang = localStorage.getItem('NG_TRANSLATE_LANG_KEY');

            options = {
                // Update model when calling setContent (such as from the source editor popup)
                setup: function (ed) {
                    var args;
                    ed.on('init', function (args) {
                        ngModel.$render();
                        ngModel.$setPristine();
                    });
                    // Update model on button click
                    ed.on('ExecCommand', function (e) {
                        ed.save();
                        updateView();
                    });
                    ed.on('change', function (e) {
                        console.log('changed');
                        if (!scope.disabledMce) {
                            var str = tinyInstance.getContent();
                            var rendered = str.replace(/\[\[candidate name\]\]/g, $rootScope.staticEmailTemplate.candidateName);
                            rendered = rendered.replace(/\[\[vacancy link\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + scope.$parent.publicLink+ '">' + scope.$parent.vacancy.position + '</a>');
                            rendered = rendered.replace(/\[\[interview date and time\]\]/g, $filter('dateFormat2')($rootScope.staticEmailTemplate.date, true));
                            rendered = rendered.replace(/\[\[recruiter's name\]\]/g, $rootScope.staticEmailTemplate.recruiterName);
                            rendered = rendered.replace(/\[\[recruiterEmail\]\]/g, $rootScope.staticEmailTemplate.recruiterEmail);
                            rendered = rendered.replace(/\[\[recruiter's phone\]\]/g, $rootScope.me.phoneWork ? $rootScope.me.phoneWork : $rootScope.me.phone);
                            rendered = rendered.replace(/Skype: \[\[recruiter's Skype\]\]/g, $rootScope.staticEmailTemplate.skype ? "Skype: " + $rootScope.staticEmailTemplate.skype : '<span id="removedSpan"></span>');
                            if($rootScope.staticEmailTemplate.facebook){
                                rendered = rendered.replace(/\[\[recruiter's Facebook\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $rootScope.staticEmailTemplate.facebook+ '">' + $rootScope.staticEmailTemplate.facebook + '</a>');
                            }else{
                                rendered = rendered.replace(/\[\[recruiter's Facebook\]\]/g, '<span id="removedSpan2"></span>');
                            }
                            if($rootScope.staticEmailTemplate.linkedin){
                                rendered = rendered.replace(/\[\[recruiter's LinkedIn\]\]/g, '<a style="font-weight: 600; {cursor: pointer;text-decoration: blink;color: #1A6986; text-decoration: none} :hover {text-decoration: underline;}"target="_blank" href="' + $rootScope.staticEmailTemplate.linkedin+ '">' + $rootScope.staticEmailTemplate.linkedin + '</a>');
                            }else{
                                rendered = rendered.replace(/\[\[recruiter's LinkedIn\]\]/g, '<span id="removedSpan3"></span>');
                            }
                            $('#removedSpan + br').remove();
                            $('#removedSpan2 + br').remove();
                            $('#removedSpan3 + br').remove();
                            $('#removedSpan').remove();
                            $('#removedSpan2').remove();
                            $('#removedSpan3').remove();
                            scope.$parent.emailTemplateForRender.text = rendered;
                        }
                    });
                    // Update model on keypress
                    ed.on('KeyUp', function (e) {
                        ed.save();
                        updateView();
                    });
                    // Update model on change, i.e. copy/pasted text, plugins altering content
                    ed.on('SetContent', function (e) {
                        if (!e.initial && ngModel.$viewValue !== e.content) {
                            ed.save();
                            updateView();
                        }
                    });
                    ed.on('blur', function (e) {
                        elm.blur();
                        console.log(1)
                    });
                    // Update model when an object has been resized (table, image)
                    ed.on('ObjectResized', function (e) {
                        ed.save();
                        updateView();
                    });
                    if (configSetup) {
                        configSetup(ed);
                    }
                },
                mode: 'exact',
                theme: "modern",
                readonly: scope.disabledMce ? 1 : 0,
                height: 145,
                language: lang != undefined || lang != null ? lang : "ru",
                browser_spellcheck: true,
                menubar: false,
                statusbar: false,
                theme_advanced_resizing: true,
                plugins: plugin,
                fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
                toolbar1: scope.disabledMce ? "false" : "undo redo | bold italic forecolor backcolor fontsizeselect link | bullist numlist outdent indent | table",
                image_advtab: true,
                toolbar_items_size: 'small',
                relative_urls: false,

                elements: attrs.id,
                content_css: "/dist/css/tinymce.css"
            };
            // extend options with initial uiTinymceConfig and options from directive attribute value
            angular.extend(options, uiTinymceConfig, expression);
            setTimeout(function () {
                tinymce.init(options);
            });

            ngModel.$render = function () {
                if (!tinyInstance) {
                    tinyInstance = tinymce.get(attrs.id);
                }
                if (tinyInstance) {
                    tinyInstance.setContent(ngModel.$viewValue || '');
                }
            };

            scope.$on('$destroy', function () {
                if (!tinyInstance) {
                    tinyInstance = tinymce.get(attrs.id);
                }
                if (tinyInstance) {
                    tinyInstance.remove();
                    tinyInstance = null;
                }
            });
        }
    };
}]);