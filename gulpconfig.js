//
// Global Gulp configuration file
module.exports = function () {

	//
	// Init Config
	var config = {};

	//
	// Folders configuration
	var rootDir     = "./"
		, distDir   = rootDir + "dist/"
		, imagesDir = rootDir + "images/"
		, jsDir     = rootDir + "js/"
		, libDir    = rootDir + "lib/"
		, stylesDir = rootDir + "sass/";

	config.path = {
		rootDir: rootDir

		, distDir:    distDir
		, distCssDir: distDir + "css/"
		, distJsDir:  distDir + "js/"

		, imagesDir: imagesDir

		, jsDir:     jsDir
		, libDir:    libDir
		, stylesDir: stylesDir

		, vendorDir: rootDir + "vendor/"
	};

	//
	// Images configuration
	config.images = {
		spriteDir: config.path.imagesDir + "sprite/"
	};

	//
	// Styles configuration
	config.styles = {
		files: config.path.stylesDir + "styles.scss"
	};

	//
	// scripts configuration
	config.scripts = {
		main:      {
			lib:   { //cleverStaff main lib
				filename: 'mainLib.js'
				, files:  [ // ORDER IS IMPORTANT!
					config.path.libDir + "jquery/jquery-2.0.3.min.js"
					, config.path.libDir + "jstz-1.0.6.min.js"
					, config.path.libDir + "mCustomScrollbar.js"
                    , config.path.libDir + "bootstrap-datetimepicker.js"
					, config.path.libDir + "linkify.js"
					, config.path.libDir + "semantic/semantic.min.js"
					, config.path.libDir + "angular/angular.min.js"
					, config.path.libDir + "lodash.min.js"
					, config.path.libDir + "angular-google-maps.min.js"
					, config.path.libDir + "pnotify.custom.min.js"
					, config.path.libDir + "angular-local-storage.js"
                    , config.path.libDir + "jquery-ui.min.js"
					, config.path.libDir + "pnotify.js"
					, config.path.libDir + "select2/select2.min.js"
					, config.path.libDir + "select2/angular-select2.js"
					, config.path.libDir + "angular/angular-route.min.js"
					, config.path.libDir + "angular/angular-resource.min.js"
					, config.path.libDir + "angular/angular-sanitize.min.js"
					, config.path.libDir + "angular/angular-animate.min.js"
					, config.path.libDir + "angular/angular-cookies.min.js"
					, config.path.libDir + "angular-translate/angular-translate.min.js"
					, config.path.libDir + "angular-translate/angular-translate-locale.js"
					, config.path.libDir + "ngtable/ng-table.js"
					, config.path.libDir + "angular-once/once.js"
					, config.path.libDir + "ZeroClipboard.js"
					, config.path.libDir + "ui.tinymce.js"
					, config.path.libDir + "ng-google-chart.js"
					, config.path.libDir + "angular-googleapi.js"
					, config.path.libDir + "io.file.js"
					, config.path.libDir + "bootstrap-datetimepicker.js"
					, config.path.libDir + "ng-quick-date.min.js"
					, config.path.libDir + "bind-once/bindonce.js"
					, config.path.libDir + "zingchart-html5-min.js"
					, config.path.libDir + "favico-0.3.6.min.js"
					, config.path.libDir + "jquery.dotdotdot.js"
					, config.path.libDir + "Sortable.js"
					, config.path.libDir + "ng-sortable.js"
					, config.path.libDir + "oi-list.js"
					, config.path.libDir + "ng-infinite-scroll.js"
					, config.path.libDir + "angulartics/angulartics.min.js"
					, config.path.libDir + "angulartics/angulartics-ga.min.js"
					, config.path.libDir + "angular-translate/angular-translate-storage-local.js"
					, config.path.libDir + "angular-translate/angular-translate-loader-url.min.js"
					, config.path.libDir + "angular-translate/angular-translate-loader-static-files.min.js"
					, config.path.libDir + "angular-translate/angular-translate-storage-cookie.min.js"
                    , config.path.libDir + "ui-bootstrap-tpls-2.0.1.min.js"
                    , config.path.libDir + "angular-outlook-api.js"
					, config.path.libDir + "cropper.min.js"
				]
			}
			, app: { // main angular app
				filename: 'mainApp.js'
				, files:  [
					config.path.jsDir + "main/directive/directives.js"
					, config.path.jsDir + "main/filter/filters.js"
					, config.path.jsDir + "main/service/*.js"
					, config.path.jsDir + "main/serviceMainApp.js"
					, config.path.jsDir + "main/constant/constantMain.js"
					, config.path.jsDir + "main/app.js"
					, config.path.jsDir + "main/controller/activity/*.js"
					, config.path.jsDir + "main/controller/candidate/*.js"
					, config.path.jsDir + "main/controller/client/*.js"
					, config.path.jsDir + "main/controller/contact/*.js"
					, config.path.jsDir + "main/controller/others/*.js"
					, config.path.jsDir + "main/controller/user/*.js"
					, config.path.jsDir + "main/controller/vacancy/*.js"
					, config.path.jsDir + "main/globalFunction.js"
					, config.path.jsDir + "main/controller/employee/*.js"
                    , config.path.jsDir + "main/controller/reports/*.js"
				]
			}
		},
		start:     { //public main and app lib
			lib:   {
				filename: 'startLib.js'
				, files:  [
					config.path.libDir + "jquery/jquery-2.0.3.min.js"
					, config.path.libDir + "linkify.js"
					, config.path.libDir + "semantic/form.min.js"
					, config.path.libDir + "angular/angular.min.js"
					, config.path.libDir + "pnotify.custom.min.js"
					, config.path.libDir + "lodash.min.js"
					, config.path.libDir + "angular-google-maps.min.js"
					, config.path.libDir + "select2/select2.min.js"
					, config.path.libDir + "select2/angular-select2.js"
					, config.path.libDir + "angular/angular-route.min.js"
					, config.path.libDir + "angular/angular-resource.min.js"
					, config.path.libDir + "angular/angular-touch.min.js"
					, config.path.libDir + "angular/angular-animate.min.js"
					, config.path.libDir + "angular-translate/angular-translate.min.js"
					, config.path.libDir + "angular-translate/angular-translate-locale.js"
					, config.path.libDir + "bind-once/bindonce.min.js"
					, config.path.libDir + "angular/angular-cookies.min.js"
					, config.path.libDir + "pnotify.js"
					, config.path.libDir + "bootstrap-datetimepicker.js"
					, config.path.libDir + "ui.tinymce.js"
					, config.path.libDir + "io.file.js"
					, config.path.libDir + "oi-list.js"
					, config.path.libDir + "angular-translate/angular-translate-storage-local.js"
					, config.path.libDir + "angular-translate/angular-translate-loader-url.min.js"
					, config.path.libDir + "angular-translate/angular-translate-loader-static-files.min.js"
					, config.path.libDir + "angular-translate/angular-translate-storage-cookie.min.js"
					, config.path.libDir + "ngMeta.min.js"
					, config.path.libDir + "ui-bootstrap-tpls-2.0.1.min.js"
          ]
			}
			, app: { // public app
				filename: 'startApp.js'
				, files:  [
					config.path.jsDir + "start/app.js"
					, config.path.jsDir + "start/controllers.js"
					, config.path.jsDir + "start_common/*.js"
					, config.path.jsDir + "start/filters.js"
					, config.path.jsDir + "start/directives.js"
					, config.path.jsDir + "main/service/serviceStartApp.js"
					, config.path.jsDir + "main/service/CandidateService.js"
					, config.path.jsDir + "main/service/FileInitService.js"
					, config.path.jsDir + "main/service/GlobalService.js"
					, config.path.jsDir + "main/service/LocalStorageService.js"
					, config.path.jsDir + "main/service/NoticeService.js"
					, config.path.jsDir + "main/service/PersonService.js"
					, config.path.jsDir + "main/service/TransliterationService.js"
					, config.path.jsDir + "main/serviceStartApp.js"
				]
			}
		},
		bootstrap: {
			filename: 'bootstrap.js',
			files:    [
				config.path.vendorDir + "twbs/bootstrap/assets/javascripts/bootstrap/affix.js"
				, config.path.vendorDir + "twbs/bootstrap/assets/javascripts/bootstrap/alert.js"
				, config.path.vendorDir + "twbs/bootstrap/assets/javascripts/bootstrap/button.js"
				, config.path.vendorDir + "twbs/bootstrap/assets/javascripts/bootstrap/carousel.js"
				, config.path.vendorDir + "twbs/bootstrap/assets/javascripts/bootstrap/collapse.js"
				, config.path.vendorDir + "twbs/bootstrap/assets/javascripts/bootstrap/dropdown.js"
				, config.path.vendorDir + "twbs/bootstrap/assets/javascripts/bootstrap/tab.js"
				, config.path.vendorDir + "twbs/bootstrap/assets/javascripts/bootstrap/transition.js"
				, config.path.vendorDir + "twbs/bootstrap/assets/javascripts/bootstrap/scrollspy.js"
				, config.path.vendorDir + "twbs/bootstrap/assets/javascripts/bootstrap/modal.js"
				, config.path.vendorDir + "twbs/bootstrap/assets/javascripts/bootstrap/tooltip.js"
				, config.path.vendorDir + "twbs/bootstrap/assets/javascripts/bootstrap/popover.js"
			]
		}
	};

	//
	// Tasks configuration
	config.tasks = {
		alias: "cs"
	};

	//
	// Plugins configuration
	config.plugins = {
		autoprefixer: {
			browsers:  "last 1 version, > 10%, iOS >= 7"
			, cascade: false
		},
		critical:     {},
		cssBase64:    {
			maxWeightResource: 8 * 1024
		},
		imagemin:     {
			verbose: true
		},
		sass:         {
			prod: {
				outputStyle: 'compressed'
			},
			dev:  {
				outputStyle: 'nested'
			}
		},
		sourcemaps:   {
			includeContent: false
			, sourceRoot:   config.stylesDir
		},
		sprity:       {
			src:           config.images.spriteDir + '**/*.{png,jpg}'
			, cssPath:     '../../images/' // dist/css to images/ folder relative path
			, margin:      8
			, name:        'sprite'
			, orientation: 'binary-tree'
			, prefix:      'sprite'
			, processor:   'css'
			, style:       '_sprite.scss'
			, template:    config.path.rootDir + 'gulp/.sprity.hbs'
		},
		uglify:       {}
	};

	return config;
};
