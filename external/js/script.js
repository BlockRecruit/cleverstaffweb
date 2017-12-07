var google_url = "https://accounts.google.com/o/oauth2/auth" +
    "?client_id=" + apiKey.google.client_id +
    "&scope=email%20profile" +
    "&state=/profile" +
    "&redirect_uri=" + location.protocol + "//" + document.domain + "/white.html" +
    "&response_type=code%20token" +
    "&approval_prompt=auto";

var linkedin_url = "https://www.linkedin.com/uas/oauth2/authorization" +
    "?response_type=code" +
    "&client_id=" +apiKey.linkedIn.api_key+
    "&scope=r_fullprofile%20r_contactinfo%20r_emailaddress" +
    "&state=STATUS123asd33342" +
    "&redirect_uri=" + location.protocol + "//" + document.domain + "/white.html";
$(document).ready(function () {
    (function(){
        var buttonsParamsTariff = document.querySelectorAll(".orange-btn, .signupBtn, .tryItfreeTwo, .featureStartTrial, .tryCsfree, .startNowOnerecrut, .teamWorkStartTrial, .corporateEnStart, .enterprizeGetOfferOne, .startNowOneRecrutTwo, .teamWorkStartTrialTwo, .corporateEnStartTwo, .enterprizeGetOfferTwo, .demoParams, .presentation"),
            i = 0,
            max = buttonsParamsTariff.length;

        function setParamsTarif() {
            localStorage.setItem("tarifParams", this.dataset.params);
        }
        for(; i < max; i++){
            buttonsParamsTariff[i].addEventListener('click',setParamsTarif);
        }
    })();

    console.log(history);

    var q = getUrlParameter("q");
    if (q === "demo") {
        $("#mod_demo").fadeIn(100);
    }
    if (q === "auth") {
        $("#mod_enter").fadeIn(100);
    }
    if (q === "ie") {
        $("#mod_download_browser").fadeIn(100);
    }
    if (q === "restore") {
        $("#mod_order_call").fadeIn(100);
    }
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    var mailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
    var namePattern = /^[A-Za-zА-Яа-яёЁІіЇїЄєҐґ’'`\- ]{1,50}$/;
    var passPattern1 = /^[a-zA-Z0-9]{8,30}$/;
    var passPattern2 = /.*[a-zA-Z].*/;
    var passPattern3 = /.*\d.*/;
    //buttons

    $(window).scroll(function () {
        var top = $(document).scrollTop();
        if (top > 445 & top < 657) {
            $(".dig1_num").addClass('active_number');
        } else {
            $(".dig1_num").removeClass('active_number');
        }

        if (top > 657 & top < 807) {
            $(".dig2_num").addClass('active_number');
        } else {
            $(".dig2_num").removeClass('active_number');
        }

        if (top > 807 & top < 957) {
            $(".dig3_num").addClass('active_number');
        } else {
            $(".dig3_num").removeClass('active_number');
        }

        if (top > 957 & top < 1110) {
            $(".dig4_num").addClass('active_number');
        } else {
            $(".dig4_num").removeClass('active_number');
        }

        if (top > 1110 & top < 1257) {
            $(".dig5_num").addClass('active_number');
        } else {
            $(".dig5_num").removeClass('active_number');
        }

        if (top > 1257 & top < 1383) {
            $(".dig6_num").addClass('active_number');
        } else {
            $(".dig6_num").removeClass('active_number');
        }

        if (top > 1383 & top < 2201) {
            $(".dig7_num").addClass('active_number');
        } else {
            $(".dig7_num").removeClass('active_number');
        }
    });

    $('.hov_button').mousedown(function () {
        $(this).parent().addClass('border_none');

    });
    $('.hov_button').mouseup(function () {
        $(this).parent().removeClass('border_none');
    });

    //for modal windows

    $(document).on('click', 'a.modal', function () {
        $(".modal_wrap").fadeOut(100);
        var ID = $(this).attr('href');
        $(ID).fadeIn(100);
        $(ID + " input").first().focus();
        return false;
    });

    $(document).on('click', '.modal_bg', function () {
        $(this).parent().fadeOut();
        return false;
    });
    $('.mod_close').on('click', function () {
        $('.modal_wrap').fadeOut();
        resetError();
        return false;
    });

    enterForm('#signupGoogleForm', '#signupGoogleBtn');
    var signup_google_loading = false;
    $("#signupGoogleBtn").on("click", function () {
            signup_google_loading = true;
            resetError();
            checkFormGoogle();
            var res = $("#signupGoogleForm").serializeObject();
            res.utms = null;
            res.intention =  localStorage.getItem("tarifParams");
            res.login = $("#google_mail").val();
            var string = res.country;
            if(string == 'null' || string == null || string == undefined){
                res.country = 'Afghanistan';
            }else{
                res.country = string.replace(/\d+/g, "").replace("(","").replace(")","").replace(" +","");
            }
            if(localStorage.getItem('phone') == null){
                res.phone = $('#signupGoogleForm').find('.select2-selection__rendered')[0].title.replace(/[A-z]/g, "").replace(/\(*\)*\.*\s*/g,"").replace(/,/g,"") + res.phone;
            }else{
                res.phone = $(".countryCustom").text(localStorage.getItem('phone').replace(/-/g,"") + res.phone)[0].textContent;
            }
            delete res.countryCustom;
            console.log(res);
            $.ajax({
                url: "/hr/person/registration/google",
                type: "POST",
                data: JSON.stringify(res),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function (xhr) {
                    $(function() {
                        var isoCountries = [
                            { id: 'AF', text: 'Afghanistan (+93)', value: '+93'},
                            { id: 'AX', text: 'Aland Islands (+358)', value: '+358'},
                            { id: 'AL', text: 'Albania (+355)', value: '+355'},
                            { id: 'DZ', text: 'Algeria (+213)', value: '+213'},
                            { id: 'AS', text: 'American Samoa (+1)', value: '+1'},
                            { id: 'AD', text: 'Andorra (+376)', value: '+376'},
                            { id: 'AO', text: 'Angola (+244)', value: '+244'},
                            { id: 'AI', text: 'Anguilla (+1264)', value: '+1264'},
                            { id: 'AQ', text: 'Antarctica (+672)', value: '+672'},
                            { id: 'AG', text: 'Antigua And Barbuda (+1268)', value: '+1268'},
                            { id: 'AR', text: 'Argentina (+54)', value: '+54'},
                            { id: 'AM', text: 'Armenia (+374)', value: '+374'},
                            { id: 'AW', text: 'Aruba (+297)', value: '+297'},
                            { id: 'AU', text: 'Australia (+61)', value: '+61'},
                            { id: 'AT', text: 'Austria (+43)', value: '+43'},
                            { id: 'AZ', text: 'Azerbaijan (+994)', value: '+994'},
                            { id: 'BS', text: 'Bahamas (+1242)', value: '+1242'},
                            { id: 'BH', text: 'Bahrain (+973)', value: '+973'},
                            { id: 'BD', text: 'Bangladesh (+880)', value: '+880'},
                            { id: 'BB', text: 'Barbados (+1246)', value: '+1246'},
                            { id: 'BY', text: 'Belarus (+375)', value: '+375'},
                            { id: 'BE', text: 'Belgium (+32)', value: '+32'},
                            { id: 'BZ', text: 'Belize (+501)', value: '+501'},
                            { id: 'BJ', text: 'Benin (+229)', value: '+229'},
                            { id: 'BM', text: 'Bermuda (+1441)', value: '+1441'},
                            { id: 'BT', text: 'Bhutan (+975)', value: '+975'},
                            { id: 'BO', text: 'Bolivia (+591)', value: '+591'},
                            { id: 'BA', text: 'Bosnia And Herzegovina (+387)', value: '+387'},
                            { id: 'BW', text: 'Botswana (+267)', value: '+267'},
                            { id: 'BV', text: 'Bouvet Island (+47)', value: '+47'},
                            { id: 'BR', text: 'Brazil (+55)', value: '+55'},
                            { id: 'IO', text: 'British Indian Ocean Territory (+246)', value: '+246'},
                            { id: 'BN', text: 'Brunei Darussalam (+673)', value: '+673'},
                            { id: 'BG', text: 'Bulgaria (+359)', value: '+359'},
                            { id: 'BF', text: 'Burkina Faso (+226)', value: '+226'},
                            { id: 'BI', text: 'Burundi (+257)', value: '+257'},
                            { id: 'KH', text: 'Cambodia (+855)', value: '+855'},
                            { id: 'CM', text: 'Cameroon (+237)', value: '+237'},
                            { id: 'CA', text: 'Canada (+1)', value: '+1'},
                            { id: 'CV', text: 'Cape Verde Islands (+238)', value: '+238'},
                            { id: 'KY', text: 'Cayman Islands (+1345)', value: '+1345'},
                            { id: 'CF', text: 'Central African Republic (+236)', value: '+236'},
                            { id: 'TD', text: 'Chad (+235)', value: '+235'},
                            { id: 'CL', text: 'Chile (+56)', value: '+56'},
                            { id: 'CN', text: 'China (+86)', value: '+86'},
                            { id: 'CX', text: 'Christmas Island (+672)', value: '+672'},
                            { id: 'CC', text: 'Cocos (Keeling) Islands (+225)', value: '+225'},
                            { id: 'CO', text: 'Colombia (+57)', value: '+57'},
                            { id: 'KM', text: 'Comoros (+269)', value: '+269'},
                            { id: 'CG', text: 'Congo (+242)', value: '+242'},
                            { id: 'CD', text: 'Congo, Democratic Republic (+243)', value: '+243'},
                            { id: 'CK', text: 'Cook Islands (+682)', value: '+682'},
                            { id: 'CR', text: 'Costa Rica (+506)', value: '+506'},
                            { id: 'CI', text: 'Cote D\'Ivoire (+225)', value: '+225'},
                            { id: 'HR', text: 'Croatia (+385)', value: '+385'},
                            { id: 'CU', text: 'Cuba (+53)', value: '+53'},
                            { id: 'CY', text: 'Cyprus (+90)', value: '+90'},
                            { id: 'CZ', text: 'Czech Republic (+420)', value: '+420'},
                            { id: 'DK', text: 'Denmark (+45)', value: '+45'},
                            { id: 'DJ', text: 'Djibouti (+253)', value: '+253'},
                            { id: 'DM', text: 'Dominica (+1809)', value: '+1809'},
                            { id: 'DO', text: 'Dominican Republic (+1809)', value: '+1809'},
                            { id: 'EC', text: 'Ecuador (+593)', value: '+593'},
                            { id: 'EG', text: 'Egypt (+20)', value: '+20'},
                            { id: 'SV', text: 'El Salvador (+503)', value: '+503'},
                            { id: 'GQ', text: 'Equatorial Guinea (+240)', value: '+240'},
                            { id: 'ER', text: 'Eritrea (+291)', value: '+291'},
                            { id: 'EE', text: 'Estonia (+372)', value: '+372'},
                            { id: 'ET', text: 'Ethiopia (+251)', value: '+251'},
                            { id: 'FK', text: 'Falkland Islands (Malvinas) (+500)', value: '+500'},
                            { id: 'FO', text: 'Faroe Islands (+298)', value: '+298'},
                            { id: 'FJ', text: 'Fiji (+679)', value: '+679'},
                            { id: 'FI', text: 'Finland (+358)', value: '+358'},
                            { id: 'FR', text: 'France (+33)', value: '+33'},
                            { id: 'GF', text: 'French Guiana (+594)', value: '+594'},
                            { id: 'PF', text: 'French Polynesia (+689)', value: '+689'},
                            { id: 'TF', text: 'French Southern Territories (+689)', value: '+689'},
                            { id: 'GA', text: 'Gabon (+241)', value: '+241'},
                            { id: 'GM', text: 'Gambia (+220)', value: '+220'},
                            { id: 'GE', text: 'Georgia (+7880)', value: '+7880'},
                            { id: 'DE', text: 'Germany (+49)', value: '+49'},
                            { id: 'GH', text: 'Ghana (+233)', value: '+233'},
                            { id: 'GI', text: 'Gibraltar (+350)', value: '+350'},
                            { id: 'GR', text: 'Greece (+30)', value: '+30'},
                            { id: 'GL', text: 'Greenland (+299)', value: '+299'},
                            { id: 'GD', text: 'Grenada (+1473)', value: '+1473'},
                            { id: 'GP', text: 'Guadeloupe (+590)', value: '+590'},
                            { id: 'GU', text: 'Guam (+671)', value: '+671'},
                            { id: 'GT', text: 'Guatemala (+502)', value: '+502'},
                            { id: 'GG', text: 'Guernsey (+44)', value: '+44'},
                            { id: 'GN', text: 'Guinea (+224)', value: '+224'},
                            { id: 'GW', text: 'Guinea-Bissau (+245)', value: '+245'},
                            { id: 'GY', text: 'Guyana (+592)', value: '+592'},
                            { id: 'HT', text: 'Haiti (+509)', value: '+509'},
                            { id: 'HM', text: 'Heard Island & Mcdonald Islands (+61)', value: '+61'},
                            { id: 'VA', text: 'Holy See (Vatican City State) (+39)', value: '+39'},
                            { id: 'HN', text: 'Honduras (+504)', value: '+504'},
                            { id: 'HK', text: 'Hong Kong (+852)', value: '+852'},
                            { id: 'HU', text: 'Hungary (+36)', value: '+36'},
                            { id: 'IS', text: 'Iceland (+354)', value: '+354'},
                            { id: 'IN', text: 'India(+91)', value: '+91'},
                            { id: 'ID', text: 'Indonesia (+62)', value: '+62'},
                            { id: 'IR', text: 'Iran, Islamic Republic Of (+98)', value: '+98'},
                            { id: 'IQ', text: 'Iraq (+964)', value: '+964'},
                            { id: 'IE', text: 'Ireland (+353)', value: '+353'},
                            { id: 'IM', text: 'Isle Of Man (+44)', value: '+44'},
                            { id: 'IL', text: 'Israel (+972)', value: '+975'},
                            { id: 'IT', text: 'Italy (+39)', value: '+39'},
                            { id: 'JM', text: 'Jamaica (+1876)', value: '+1876'},
                            { id: 'JP', text: 'Japan (+81)', value: '+81'},
                            { id: 'JE', text: 'Jersey (+44-1534)', value: '+44-1534'},
                            { id: 'JO', text: 'Jordan (+962)', value: '+962'},
                            { id: 'KZ', text: 'Kazakhstan (+7)', value: '+7'},
                            { id: 'KE', text: 'Kenya (+254)', value: '+254'},
                            { id: 'KI', text: 'Kiribati (+686)', value: '+686'},
                            { id: 'KP', text: 'Korea - North (+850)', value: '+850'},
                            { id: 'KR', text: 'Korea - South (+82)', value: '+82'},
                            { id: 'KW', text: 'Kuwait (+965)', value: '+965'},
                            { id: 'KG', text: 'Kyrgyzstan (+996)', value: '+996'},
                            { id: 'LA', text: 'Lao People\'s Democratic Republic (+856)', value: '+856'},
                            { id: 'LV', text: 'Latvia (+371)', value: '+371'},
                            { id: 'LB', text: 'Lebanon (+961)', value: '+961'},
                            { id: 'LS', text: 'Lesotho (+266)', value: '+266'},
                            { id: 'LR', text: 'Liberia (+231)', value: '+231'},
                            { id: 'LY', text: 'Libyan Arab Jamahiriya (+218)', value: '+218'},
                            { id: 'LI', text: 'Liechtenstein (+417)', value: '+417'},
                            { id: 'LT', text: 'Lithuania (+370)', value: '+370'},
                            { id: 'LU', text: 'Luxembourg (+352)', value: '+352'},
                            { id: 'MO', text: 'Macao (+853)', value: '+853'},
                            { id: 'MK', text: 'Macedonia (+389)', value: '+389'},
                            { id: 'MG', text: 'Madagascar (+261)', value: '+261'},
                            { id: 'MW', text: 'Malawi (+265)', value: '+265'},
                            { id: 'MY', text: 'Malaysia (+60)', value: '+60'},
                            { id: 'MV', text: 'Maldives (+960)', value: '+960'},
                            { id: 'ML', text: 'Mali (+223)', value: '+223'},
                            { id: 'MT', text: 'Malta (+356)', value: '+356'},
                            { id: 'MH', text: 'Marshall Islands (+692)', value: '+692'},
                            { id: 'MQ', text: 'Martinique (+596)', value: '+596'},
                            { id: 'MR', text: 'Mauritania (+222)', value: '+222'},
                            { id: 'MU', text: 'Mauritius (+230)', value: '+230'},
                            { id: 'YT', text: 'Mayotte (+269)', value: '+269'},
                            { id: 'MX', text: 'Mexico (+52)', value: '+52'},
                            { id: 'FM', text: 'Micronesia, Federated States Of (+691)', value: '+691'},
                            { id: 'MD', text: 'Moldova (+373)', value: '+373'},
                            { id: 'MC', text: 'Monaco (+377)', value: '+377'},
                            { id: 'MN', text: 'Mongolia (+976)', value: '+976'},
                            { id: 'ME', text: 'Montenegro (+382)', value: '+382'},
                            { id: 'MS', text: 'Montserrat (+1664)', value: '+1664'},
                            { id: 'MA', text: 'Morocco (+212)', value: '+212'},
                            { id: 'MZ', text: 'Mozambique (+258)', value: '+258'},
                            { id: 'MM', text: 'Myanmar (+95)', value: '+95'},
                            { id: 'NA', text: 'Namibia (+264)', value: '+264'},
                            { id: 'NR', text: 'Nauru (+674)', value: '+674'},
                            { id: 'NP', text: 'Nepal (+977)', value: '+977'},
                            { id: 'NL', text: 'Netherlands (+31)', value: '+31'},
                            { id: 'AN', text: 'Netherlands Antilles (+599)', value: '+599'},
                            { id: 'NC', text: 'New Caledonia (+687)', value: '+687'},
                            { id: 'NZ', text: 'New Zealand (+64)', value: '+64'},
                            { id: 'NI', text: 'Nicaragua (+505)', value: '+505'},
                            { id: 'NE', text: 'Niger (+227)', value: '+227'},
                            { id: 'NG', text: 'Nigeria (+234)', value: '+234'},
                            { id: 'NU', text: 'Niue (+683)', value: '+683'},
                            { id: 'NF', text: 'Norfolk Island (+672)', value: '+672'},
                            { id: 'MP', text: 'Northern Mariana Islands (+670)', value: '+670'},
                            { id: 'NO', text: 'Norway (+47)', value: '+47'},
                            { id: 'OM', text: 'Oman (+968)', value: '+968'},
                            { id: 'PK', text: 'Pakistan (+92)', value: '+92'},
                            { id: 'PW', text: 'Palau (+680)', value: '+680'},
                            { id: 'PS', text: 'Palestinian Territory (+970)', value: '+970'},
                            { id: 'PA', text: 'Panama (+507)', value: '+507'},
                            { id: 'PG', text: 'Papua New Guinea (+675)', value: '+675'},
                            { id: 'PY', text: 'Paraguay (+595)', value: '+595'},
                            { id: 'PE', text: 'Peru (+51)', value: '+51'},
                            { id: 'PH', text: 'Philippines (+63)', value: '+63'},
                            { id: 'PN', text: 'Pitcairn (+64)', value: '+64'},
                            { id: 'PL', text: 'Poland (+48)', value: '+48'},
                            { id: 'PT', text: 'Portugal (+351)', value: '+351'},
                            { id: 'PR', text: 'Puerto Rico (+1787)', value: '+1787'},
                            { id: 'QA', text: 'Qatar (+974)', value: '+974'},
                            { id: 'RE', text: 'Reunion (+262)', value: '+262'},
                            { id: 'RO', text: 'Romania (+40)', value: '+40'},
                            { id: 'RU', text: 'Russian Federation (+7)', value: '+7'},
                            { id: 'RW', text: 'Rwanda (+250)', value: '+250'},
                            { id: 'BL', text: 'Saint Barthelemy (+590)', value: '+590'},
                            { id: 'SH', text: 'Saint Helena (+290)', value: '+94'},
                            { id: 'KN', text: 'Saint Kitts And Nevis (+1869)', value: '+94'},
                            { id: 'LC', text: 'Saint Lucia (+1758)', value: '+94'},
                            { id: 'MF', text: 'Saint Martin (+590)', value: '+590'},
                            { id: 'PM', text: 'Saint Pierre And Miquelon (+508)', value: '+508'},
                            { id: 'VC', text: 'Saint Vincent And Grenadines (+1-784)', value: '+1-784'},
                            { id: 'WS', text: 'Samoa (+685)', value: '+685'},
                            { id: 'SM', text: 'San Marino (+378)', value: '+378'},
                            { id: 'ST', text: 'Sao Tome And Principe (+239)', value: '+239'},
                            { id: 'SA', text: 'Saudi Arabia (+966)', value: '+966'},
                            { id: 'SN', text: 'Senegal (+221)', value: '+221'},
                            { id: 'RS', text: 'Serbia (+381)', value: '+381'},
                            { id: 'SC', text: 'Seychelles (+248)', value: '+248'},
                            { id: 'SL', text: 'Sierra Leone (+232)', value: '+232'},
                            { id: 'SG', text: 'Singapore (+65)', value: '+65'},
                            { id: 'SK', text: 'Slovakia (+421)', value: '+421'},
                            { id: 'SI', text: 'Slovenia (+386)', value: '+386'},
                            { id: 'SB', text: 'Solomon Islands (+677)', value: '+677'},
                            { id: 'SO', text: 'Somalia (+252)', value: '+252'},
                            { id: 'ZA', text: 'South Africa (+27)', value: '+27'},
                            { id: 'GS', text: 'South Georgia And Sandwich Isl. (+500)', value: '+500'},
                            { id: 'ES', text: 'Spain (+34)', value: '+34'},
                            { id: 'LK', text: 'Sri Lanka (+94)', value: '+94'},
                            { id: 'SD', text: 'Sudan (+249)', value: '+249'},
                            { id: 'SR', text: 'Suriname (+597)', value: '+597'},
                            { id: 'SJ', text: 'Svalbard And Jan Mayen (+47)', value: '+47'},
                            { id: 'SZ', text: 'Swaziland (+268)', value: '+268'},
                            { id: 'SE', text: 'Sweden (+46)', value: '+46'},
                            { id: 'CH', text: 'Switzerland (+41)', value: '+41'},
                            { id: 'SY', text: 'Syrian Arab Republic (+963)', value: '+963'},
                            { id: 'TW', text: 'Taiwan (+886)', value: '+886'},
                            { id: 'TJ', text: 'Tajikistan (+992)', value: '+992'},
                            { id: 'TZ', text: 'Tanzania (+255)', value: '+255'},
                            { id: 'TH', text: 'Thailand (+66)', value: '+66'},
                            { id: 'TL', text: 'Timor-Leste (+670)', value: '+670'},
                            { id: 'TG', text: 'Togo (+228)', value: '+228'},
                            { id: 'TK', text: 'Tokelau (+690)', value: '+690'},
                            { id: 'TO', text: 'Tonga (+676)', value: '+676'},
                            { id: 'TT', text: 'Trinidad And Tobago (+1868)', value: '+1868'},
                            { id: 'TN', text: 'Tunisia (+216)', value: '+216'},
                            { id: 'TR', text: 'Turkey (+90)', value: '+90'},
                            { id: 'TM', text: 'Turkmenistan (+993)', value: '+993'},
                            { id: 'TC', text: 'Turks And Caicos Islands (+1649)', value: '+1649'},
                            { id: 'TV', text: 'Tuvalu (+688)', value: '+668'},
                            { id: 'UG', text: 'Uganda (+256)', value: '+256'},
                            { id: 'UA', text: 'Ukraine (+380)', value: '+380'},
                            { id: 'AE', text: 'United Arab Emirates (+971)', value: '+971'},
                            { id: 'GB', text: 'United Kingdom (+44)', value: '+44'},
                            { id: 'US', text: 'United States (+1)', value: '+1'},
                            { id: 'UM', text: 'United States Outlying Islands (+1-340)', value: '+1-340'},
                            { id: 'UY', text: 'Uruguay (+598)', value: '+598'},
                            { id: 'UZ', text: 'Uzbekistan (+998)', value: '+998'},
                            { id: 'VU', text: 'Vanuatu (+678)', value: '+678'},
                            { id: 'VE', text: 'Venezuela (+58)', value: '+58'},
                            { id: 'VN', text: 'Vietnam (+84)', value: '+84'},
                            { id: 'VG', text: 'Virgin Islands, British (+1)', value: '+1'},
                            { id: 'VI', text: 'Virgin Islands, U.S. (+1)', value: '+1'},
                            { id: 'WF', text: 'Wallis And Futuna (+681)', value: '+681'},
                            { id: 'EH', text: 'Western Sahara (+212)', value: '+212'},
                            { id: 'YE', text: 'Yemen (North)(+969)', value: '+969'},
                            { id: 'YE', text: 'Yemen (South)(+967)', value: '+967'},
                            { id: 'ZM', text: 'Zambia (+260)', value: '+260'},
                            { id: 'ZW', text: 'Zimbabwe (+263)', value: '+263'}
                        ];
                        function formatCountry (country) {
                            if (!country.id) { return country.text; }
                            var $country = $(
                                '<span class="flag-icon flag-icon-'+ country.id.toLowerCase() +' flag-icon-squared"></span>' +
                                '<span class="flag-text" style="margin-left: 5px;">'+ country.text+"</span>"
                            );
                            return $country;
                        }
                        function format(state) {
                            if(state.selected == true){
                                var country = $('input[name=country]');
                                country.val(state.text);
                                if(state.value != undefined){
                                    var phone = state.value.replace("+","");
                                    localStorage.setItem("phone", phone);
                                }
                            }
                            if (!state.id) return state.text;
                            var $state = $(
                                '<span class="flag-icon flag-icon-'+ state.id.toLowerCase() +' flag-icon-squared"></span>' +
                                '<span class="flag-text" style="margin-left: 5px;">'+ state.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\-*\s*/g,"").replace(/,/g,"").replace(/'/g,"").replace(/&/g,"") +"</span>");
                            return $state;
                        }
                        if(window.location.pathname != '/signin.html' || window.location.pathname != '/ru/signin.html' || window.location.pathname != '/pt/signin.html' ||
                            window.location.pathname != '/why.html' || window.location.pathname != '/ru/why.html' || window.location.pathname != '/pt/why.html' ||
                            window.location.pathname != '/terms.html' || window.location.pathname != '/ru/terms.html' || window.location.pathname != '/pt/terms.html'){
                            $.ajax({
                                url: "/hr/public/getUserLocation",
                                type: "GET",
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                //beforeSend: function (xhr) {
                                //
                                //},
                                complete: function(resp){
                                    $.each(isoCountries, function(index, value) {
                                        if(resp.responseJSON.countryCode != undefined && resp.responseJSON.countryCode == value.id){
                                            if(window.location.pathname == '/signup.html' || window.location.pathname == '/ru/signup.html' || window.location.pathname == '/pt/signup.html'){
                                                //fb
                                                $('#signupFacebookForm').find('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\s*/g,"").replace(/,/g,"")+"</span>";
                                                $('#signupFacebookForm').find('.select2-selection__rendered')[0].title =  value.text;
                                                //end fb
                                                //google
                                                $('#signupGoogleForm').find('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\s*/g,"").replace(/,/g,"")+"</span>";
                                                $('#signupGoogleForm').find('.select2-selection__rendered')[0].title =  value.text;
                                                //end google
                                            }
                                            //our project
                                            $('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\-*\s*/g,"").replace(/,/g,"").replace(/'/g,"").replace(/&/g,"")+"</span>";
                                            $('.select2-selection__rendered')[0].title = value.text;
                                            //end our project
                                            var country = $('input[name=country]');
                                            country.val(value.text);
                                            var phone = $('.countryCustom');
                                            phone.value = value.value.replace("+","");
                                            localStorage.setItem("phone",  phone.value);
                                        }
                                    });
                                }
                            });
                        }
                        $("[name='countryCustom']").select2({
                            placeholder: "Select a country",
                            templateResult: formatCountry,
                            templateSelection: format,
                            data: isoCountries
                        });
                    });
                    if (res.orgName === '') {
                        xhr.abort();
                        $('.pass_need').fadeIn();
                        signup_google_loading = false;
                        return false;
                    }
                    if (res.phone === '') {
                        xhr.abort();
                        $('.pass_need').fadeIn();
                        signup_google_loading = false;
                        return false;
                    }
                    if (res.password === '') {
                        xhr.abort();
                        $('.pass_need').fadeIn();
                        signup_loading = false;
                        return false;
                    }
                    if (res.password2 === '') {
                        xhr.abort();
                        $('.pass_need').fadeIn();
                        signup_loading = false;
                        return false;
                    }
                    if (res.password !== res.password2) {
                        xhr.abort();
                        $('.pass_need').fadeIn();
                        signup_loading = false;
                        return false;
                    }
                    if (res.usersCount === '') {
                        xhr.abort();
                        $('.pass_need').fadeIn();
                        signup_google_loading = false;
                        return false;
                    }
                    if (res.terms != 'on') {
                        xhr.abort();
                        $('.pass_need').fadeIn();
                        signup_google_loading = false;
                        return false;
                    }
                    socialSuccess("google", messages.send);
                },
                success: function (data) {
                    console.log(data);
                    $($('.select2-selection--single')).css('border','2px solid #61B452');
                    $($('input[name=orgName]')).css('border','2px solid #61B452');
                    $($('select[name=usersCount]')).css('border','2px solid #61B452');
                    $($('.select2-container')).css({'border': '2px solid #61B452', 'border-radius': '30px'});
                    $($('input[name=password]')).css('border','2px solid #61B452');
                    $($('input[name=password2]')).css('border','2px solid #61B452');
                    if (data.personId !== undefined) {
                        if (!isIE()) {
                            socialSuccess("google", messages.redirect);
                            sendGA('signin_success');
                            window.location.replace("/!#/organizer");
                        } else {
                            downloadNewBrowser();
                        }
                    } else if (data.status === "error") {
                        localStorage.removeItem('phone');
                        socialError("google", data.message);
                    }
                    signup_google_loading = false;
                },
                error: function (data) {
                    localStorage.removeItem('phone');
                    console.log(data);
                    if (data.status === "error") {
                        socialError("google", data.message);
                    }
                    signup_google_loading = false;
                }
            });
        return false;
    });

    enterForm('#signupFacebookForm', '#signupFacebookBtn');
    var signup_facebook_loading = false;
    $("#signupFacebookBtn").on("click", function () {
            signup_facebook_loading = true;
            checkFormFacebook();
            resetError();
            var res = $("#signupFacebookForm").serializeObject();
            res.intention =  localStorage.getItem("tarifParams");
            res.login = $("#facebook_mail").val();
            var string = res.country;
            if(string == 'null' || string == null || string == undefined){
                res.country = 'Afghanistan';
            }else{
                res.country = string.replace(/\d+/g, "").replace("(","").replace(")","").replace(" +","");
            }
            if(localStorage.getItem('phone') == null){
                res.phone =  $('#signupFacebookForm').find('.select2-selection__rendered')[0].title.replace(/[A-z]/g, "").replace(/\(*\)*\.*\s*/g,"").replace(/,/g,"") + res.phone;
            }else{
                res.phone = $(".countryCustom").text(localStorage.getItem('phone').replace(/-/g,"") + res.phone)[0].textContent;
            }
            delete res.countryCustom;
            $.ajax({
                url: "/hr/person/registration/facebook",
                type: "POST",
                data: JSON.stringify(res),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function (xhr) {
                    $(function() {
                        var isoCountries = [
                            { id: 'AF', text: 'Afghanistan (+93)', value: '+93'},
                            { id: 'AX', text: 'Aland Islands (+358)', value: '+358'},
                            { id: 'AL', text: 'Albania (+355)', value: '+355'},
                            { id: 'DZ', text: 'Algeria (+213)', value: '+213'},
                            { id: 'AS', text: 'American Samoa (+1)', value: '+1'},
                            { id: 'AD', text: 'Andorra (+376)', value: '+376'},
                            { id: 'AO', text: 'Angola (+244)', value: '+244'},
                            { id: 'AI', text: 'Anguilla (+1264)', value: '+1264'},
                            { id: 'AQ', text: 'Antarctica (+672)', value: '+672'},
                            { id: 'AG', text: 'Antigua And Barbuda (+1268)', value: '+1268'},
                            { id: 'AR', text: 'Argentina (+54)', value: '+54'},
                            { id: 'AM', text: 'Armenia (+374)', value: '+374'},
                            { id: 'AW', text: 'Aruba (+297)', value: '+297'},
                            { id: 'AU', text: 'Australia (+61)', value: '+61'},
                            { id: 'AT', text: 'Austria (+43)', value: '+43'},
                            { id: 'AZ', text: 'Azerbaijan (+994)', value: '+994'},
                            { id: 'BS', text: 'Bahamas (+1242)', value: '+1242'},
                            { id: 'BH', text: 'Bahrain (+973)', value: '+973'},
                            { id: 'BD', text: 'Bangladesh (+880)', value: '+880'},
                            { id: 'BB', text: 'Barbados (+1246)', value: '+1246'},
                            { id: 'BY', text: 'Belarus (+375)', value: '+375'},
                            { id: 'BE', text: 'Belgium (+32)', value: '+32'},
                            { id: 'BZ', text: 'Belize (+501)', value: '+501'},
                            { id: 'BJ', text: 'Benin (+229)', value: '+229'},
                            { id: 'BM', text: 'Bermuda (+1441)', value: '+1441'},
                            { id: 'BT', text: 'Bhutan (+975)', value: '+975'},
                            { id: 'BO', text: 'Bolivia (+591)', value: '+591'},
                            { id: 'BA', text: 'Bosnia And Herzegovina (+387)', value: '+387'},
                            { id: 'BW', text: 'Botswana (+267)', value: '+267'},
                            { id: 'BV', text: 'Bouvet Island (+47)', value: '+47'},
                            { id: 'BR', text: 'Brazil (+55)', value: '+55'},
                            { id: 'IO', text: 'British Indian Ocean Territory (+246)', value: '+246'},
                            { id: 'BN', text: 'Brunei Darussalam (+673)', value: '+673'},
                            { id: 'BG', text: 'Bulgaria (+359)', value: '+359'},
                            { id: 'BF', text: 'Burkina Faso (+226)', value: '+226'},
                            { id: 'BI', text: 'Burundi (+257)', value: '+257'},
                            { id: 'KH', text: 'Cambodia (+855)', value: '+855'},
                            { id: 'CM', text: 'Cameroon (+237)', value: '+237'},
                            { id: 'CA', text: 'Canada (+1)', value: '+1'},
                            { id: 'CV', text: 'Cape Verde Islands (+238)', value: '+238'},
                            { id: 'KY', text: 'Cayman Islands (+1345)', value: '+1345'},
                            { id: 'CF', text: 'Central African Republic (+236)', value: '+236'},
                            { id: 'TD', text: 'Chad (+235)', value: '+235'},
                            { id: 'CL', text: 'Chile (+56)', value: '+56'},
                            { id: 'CN', text: 'China (+86)', value: '+86'},
                            { id: 'CX', text: 'Christmas Island (+672)', value: '+672'},
                            { id: 'CC', text: 'Cocos (Keeling) Islands (+225)', value: '+225'},
                            { id: 'CO', text: 'Colombia (+57)', value: '+57'},
                            { id: 'KM', text: 'Comoros (+269)', value: '+269'},
                            { id: 'CG', text: 'Congo (+242)', value: '+242'},
                            { id: 'CD', text: 'Congo, Democratic Republic (+243)', value: '+243'},
                            { id: 'CK', text: 'Cook Islands (+682)', value: '+682'},
                            { id: 'CR', text: 'Costa Rica (+506)', value: '+506'},
                            { id: 'CI', text: 'Cote D\'Ivoire (+225)', value: '+225'},
                            { id: 'HR', text: 'Croatia (+385)', value: '+385'},
                            { id: 'CU', text: 'Cuba (+53)', value: '+53'},
                            { id: 'CY', text: 'Cyprus (+90)', value: '+90'},
                            { id: 'CZ', text: 'Czech Republic (+420)', value: '+420'},
                            { id: 'DK', text: 'Denmark (+45)', value: '+45'},
                            { id: 'DJ', text: 'Djibouti (+253)', value: '+253'},
                            { id: 'DM', text: 'Dominica (+1809)', value: '+1809'},
                            { id: 'DO', text: 'Dominican Republic (+1809)', value: '+1809'},
                            { id: 'EC', text: 'Ecuador (+593)', value: '+593'},
                            { id: 'EG', text: 'Egypt (+20)', value: '+20'},
                            { id: 'SV', text: 'El Salvador (+503)', value: '+503'},
                            { id: 'GQ', text: 'Equatorial Guinea (+240)', value: '+240'},
                            { id: 'ER', text: 'Eritrea (+291)', value: '+291'},
                            { id: 'EE', text: 'Estonia (+372)', value: '+372'},
                            { id: 'ET', text: 'Ethiopia (+251)', value: '+251'},
                            { id: 'FK', text: 'Falkland Islands (Malvinas) (+500)', value: '+500'},
                            { id: 'FO', text: 'Faroe Islands (+298)', value: '+298'},
                            { id: 'FJ', text: 'Fiji (+679)', value: '+679'},
                            { id: 'FI', text: 'Finland (+358)', value: '+358'},
                            { id: 'FR', text: 'France (+33)', value: '+33'},
                            { id: 'GF', text: 'French Guiana (+594)', value: '+594'},
                            { id: 'PF', text: 'French Polynesia (+689)', value: '+689'},
                            { id: 'TF', text: 'French Southern Territories (+689)', value: '+689'},
                            { id: 'GA', text: 'Gabon (+241)', value: '+241'},
                            { id: 'GM', text: 'Gambia (+220)', value: '+220'},
                            { id: 'GE', text: 'Georgia (+7880)', value: '+7880'},
                            { id: 'DE', text: 'Germany (+49)', value: '+49'},
                            { id: 'GH', text: 'Ghana (+233)', value: '+233'},
                            { id: 'GI', text: 'Gibraltar (+350)', value: '+350'},
                            { id: 'GR', text: 'Greece (+30)', value: '+30'},
                            { id: 'GL', text: 'Greenland (+299)', value: '+299'},
                            { id: 'GD', text: 'Grenada (+1473)', value: '+1473'},
                            { id: 'GP', text: 'Guadeloupe (+590)', value: '+590'},
                            { id: 'GU', text: 'Guam (+671)', value: '+671'},
                            { id: 'GT', text: 'Guatemala (+502)', value: '+502'},
                            { id: 'GG', text: 'Guernsey (+44)', value: '+44'},
                            { id: 'GN', text: 'Guinea (+224)', value: '+224'},
                            { id: 'GW', text: 'Guinea-Bissau (+245)', value: '+245'},
                            { id: 'GY', text: 'Guyana (+592)', value: '+592'},
                            { id: 'HT', text: 'Haiti (+509)', value: '+509'},
                            { id: 'HM', text: 'Heard Island & Mcdonald Islands (+61)', value: '+61'},
                            { id: 'VA', text: 'Holy See (Vatican City State) (+39)', value: '+39'},
                            { id: 'HN', text: 'Honduras (+504)', value: '+504'},
                            { id: 'HK', text: 'Hong Kong (+852)', value: '+852'},
                            { id: 'HU', text: 'Hungary (+36)', value: '+36'},
                            { id: 'IS', text: 'Iceland (+354)', value: '+354'},
                            { id: 'IN', text: 'India(+91)', value: '+91'},
                            { id: 'ID', text: 'Indonesia (+62)', value: '+62'},
                            { id: 'IR', text: 'Iran, Islamic Republic Of (+98)', value: '+98'},
                            { id: 'IQ', text: 'Iraq (+964)', value: '+964'},
                            { id: 'IE', text: 'Ireland (+353)', value: '+353'},
                            { id: 'IM', text: 'Isle Of Man (+44)', value: '+44'},
                            { id: 'IL', text: 'Israel (+972)', value: '+975'},
                            { id: 'IT', text: 'Italy (+39)', value: '+39'},
                            { id: 'JM', text: 'Jamaica (+1876)', value: '+1876'},
                            { id: 'JP', text: 'Japan (+81)', value: '+81'},
                            { id: 'JE', text: 'Jersey (+44-1534)', value: '+44-1534'},
                            { id: 'JO', text: 'Jordan (+962)', value: '+962'},
                            { id: 'KZ', text: 'Kazakhstan (+7)', value: '+7'},
                            { id: 'KE', text: 'Kenya (+254)', value: '+254'},
                            { id: 'KI', text: 'Kiribati (+686)', value: '+686'},
                            { id: 'KP', text: 'Korea - North (+850)', value: '+850'},
                            { id: 'KR', text: 'Korea - South (+82)', value: '+82'},
                            { id: 'KW', text: 'Kuwait (+965)', value: '+965'},
                            { id: 'KG', text: 'Kyrgyzstan (+996)', value: '+996'},
                            { id: 'LA', text: 'Lao People\'s Democratic Republic (+856)', value: '+856'},
                            { id: 'LV', text: 'Latvia (+371)', value: '+371'},
                            { id: 'LB', text: 'Lebanon (+961)', value: '+961'},
                            { id: 'LS', text: 'Lesotho (+266)', value: '+266'},
                            { id: 'LR', text: 'Liberia (+231)', value: '+231'},
                            { id: 'LY', text: 'Libyan Arab Jamahiriya (+218)', value: '+218'},
                            { id: 'LI', text: 'Liechtenstein (+417)', value: '+417'},
                            { id: 'LT', text: 'Lithuania (+370)', value: '+370'},
                            { id: 'LU', text: 'Luxembourg (+352)', value: '+352'},
                            { id: 'MO', text: 'Macao (+853)', value: '+853'},
                            { id: 'MK', text: 'Macedonia (+389)', value: '+389'},
                            { id: 'MG', text: 'Madagascar (+261)', value: '+261'},
                            { id: 'MW', text: 'Malawi (+265)', value: '+265'},
                            { id: 'MY', text: 'Malaysia (+60)', value: '+60'},
                            { id: 'MV', text: 'Maldives (+960)', value: '+960'},
                            { id: 'ML', text: 'Mali (+223)', value: '+223'},
                            { id: 'MT', text: 'Malta (+356)', value: '+356'},
                            { id: 'MH', text: 'Marshall Islands (+692)', value: '+692'},
                            { id: 'MQ', text: 'Martinique (+596)', value: '+596'},
                            { id: 'MR', text: 'Mauritania (+222)', value: '+222'},
                            { id: 'MU', text: 'Mauritius (+230)', value: '+230'},
                            { id: 'YT', text: 'Mayotte (+269)', value: '+269'},
                            { id: 'MX', text: 'Mexico (+52)', value: '+52'},
                            { id: 'FM', text: 'Micronesia, Federated States Of (+691)', value: '+691'},
                            { id: 'MD', text: 'Moldova (+373)', value: '+373'},
                            { id: 'MC', text: 'Monaco (+377)', value: '+377'},
                            { id: 'MN', text: 'Mongolia (+976)', value: '+976'},
                            { id: 'ME', text: 'Montenegro (+382)', value: '+382'},
                            { id: 'MS', text: 'Montserrat (+1664)', value: '+1664'},
                            { id: 'MA', text: 'Morocco (+212)', value: '+212'},
                            { id: 'MZ', text: 'Mozambique (+258)', value: '+258'},
                            { id: 'MM', text: 'Myanmar (+95)', value: '+95'},
                            { id: 'NA', text: 'Namibia (+264)', value: '+264'},
                            { id: 'NR', text: 'Nauru (+674)', value: '+674'},
                            { id: 'NP', text: 'Nepal (+977)', value: '+977'},
                            { id: 'NL', text: 'Netherlands (+31)', value: '+31'},
                            { id: 'AN', text: 'Netherlands Antilles (+599)', value: '+599'},
                            { id: 'NC', text: 'New Caledonia (+687)', value: '+687'},
                            { id: 'NZ', text: 'New Zealand (+64)', value: '+64'},
                            { id: 'NI', text: 'Nicaragua (+505)', value: '+505'},
                            { id: 'NE', text: 'Niger (+227)', value: '+227'},
                            { id: 'NG', text: 'Nigeria (+234)', value: '+234'},
                            { id: 'NU', text: 'Niue (+683)', value: '+683'},
                            { id: 'NF', text: 'Norfolk Island (+672)', value: '+672'},
                            { id: 'MP', text: 'Northern Mariana Islands (+670)', value: '+670'},
                            { id: 'NO', text: 'Norway (+47)', value: '+47'},
                            { id: 'OM', text: 'Oman (+968)', value: '+968'},
                            { id: 'PK', text: 'Pakistan (+92)', value: '+92'},
                            { id: 'PW', text: 'Palau (+680)', value: '+680'},
                            { id: 'PS', text: 'Palestinian Territory (+970)', value: '+970'},
                            { id: 'PA', text: 'Panama (+507)', value: '+507'},
                            { id: 'PG', text: 'Papua New Guinea (+675)', value: '+675'},
                            { id: 'PY', text: 'Paraguay (+595)', value: '+595'},
                            { id: 'PE', text: 'Peru (+51)', value: '+51'},
                            { id: 'PH', text: 'Philippines (+63)', value: '+63'},
                            { id: 'PN', text: 'Pitcairn (+64)', value: '+64'},
                            { id: 'PL', text: 'Poland (+48)', value: '+48'},
                            { id: 'PT', text: 'Portugal (+351)', value: '+351'},
                            { id: 'PR', text: 'Puerto Rico (+1787)', value: '+1787'},
                            { id: 'QA', text: 'Qatar (+974)', value: '+974'},
                            { id: 'RE', text: 'Reunion (+262)', value: '+262'},
                            { id: 'RO', text: 'Romania (+40)', value: '+40'},
                            { id: 'RU', text: 'Russian Federation (+7)', value: '+7'},
                            { id: 'RW', text: 'Rwanda (+250)', value: '+250'},
                            { id: 'BL', text: 'Saint Barthelemy (+590)', value: '+590'},
                            { id: 'SH', text: 'Saint Helena (+290)', value: '+94'},
                            { id: 'KN', text: 'Saint Kitts And Nevis (+1869)', value: '+94'},
                            { id: 'LC', text: 'Saint Lucia (+1758)', value: '+94'},
                            { id: 'MF', text: 'Saint Martin (+590)', value: '+590'},
                            { id: 'PM', text: 'Saint Pierre And Miquelon (+508)', value: '+508'},
                            { id: 'VC', text: 'Saint Vincent And Grenadines (+1-784)', value: '+1-784'},
                            { id: 'WS', text: 'Samoa (+685)', value: '+685'},
                            { id: 'SM', text: 'San Marino (+378)', value: '+378'},
                            { id: 'ST', text: 'Sao Tome And Principe (+239)', value: '+239'},
                            { id: 'SA', text: 'Saudi Arabia (+966)', value: '+966'},
                            { id: 'SN', text: 'Senegal (+221)', value: '+221'},
                            { id: 'RS', text: 'Serbia (+381)', value: '+381'},
                            { id: 'SC', text: 'Seychelles (+248)', value: '+248'},
                            { id: 'SL', text: 'Sierra Leone (+232)', value: '+232'},
                            { id: 'SG', text: 'Singapore (+65)', value: '+65'},
                            { id: 'SK', text: 'Slovakia (+421)', value: '+421'},
                            { id: 'SI', text: 'Slovenia (+386)', value: '+386'},
                            { id: 'SB', text: 'Solomon Islands (+677)', value: '+677'},
                            { id: 'SO', text: 'Somalia (+252)', value: '+252'},
                            { id: 'ZA', text: 'South Africa (+27)', value: '+27'},
                            { id: 'GS', text: 'South Georgia And Sandwich Isl. (+500)', value: '+500'},
                            { id: 'ES', text: 'Spain (+34)', value: '+34'},
                            { id: 'LK', text: 'Sri Lanka (+94)', value: '+94'},
                            { id: 'SD', text: 'Sudan (+249)', value: '+249'},
                            { id: 'SR', text: 'Suriname (+597)', value: '+597'},
                            { id: 'SJ', text: 'Svalbard And Jan Mayen (+47)', value: '+47'},
                            { id: 'SZ', text: 'Swaziland (+268)', value: '+268'},
                            { id: 'SE', text: 'Sweden (+46)', value: '+46'},
                            { id: 'CH', text: 'Switzerland (+41)', value: '+41'},
                            { id: 'SY', text: 'Syrian Arab Republic (+963)', value: '+963'},
                            { id: 'TW', text: 'Taiwan (+886)', value: '+886'},
                            { id: 'TJ', text: 'Tajikistan (+992)', value: '+992'},
                            { id: 'TZ', text: 'Tanzania (+255)', value: '+255'},
                            { id: 'TH', text: 'Thailand (+66)', value: '+66'},
                            { id: 'TL', text: 'Timor-Leste (+670)', value: '+670'},
                            { id: 'TG', text: 'Togo (+228)', value: '+228'},
                            { id: 'TK', text: 'Tokelau (+690)', value: '+690'},
                            { id: 'TO', text: 'Tonga (+676)', value: '+676'},
                            { id: 'TT', text: 'Trinidad And Tobago (+1868)', value: '+1868'},
                            { id: 'TN', text: 'Tunisia (+216)', value: '+216'},
                            { id: 'TR', text: 'Turkey (+90)', value: '+90'},
                            { id: 'TM', text: 'Turkmenistan (+993)', value: '+993'},
                            { id: 'TC', text: 'Turks And Caicos Islands (+1649)', value: '+1649'},
                            { id: 'TV', text: 'Tuvalu (+688)', value: '+668'},
                            { id: 'UG', text: 'Uganda (+256)', value: '+256'},
                            { id: 'UA', text: 'Ukraine (+380)', value: '+380'},
                            { id: 'AE', text: 'United Arab Emirates (+971)', value: '+971'},
                            { id: 'GB', text: 'United Kingdom (+44)', value: '+44'},
                            { id: 'US', text: 'United States (+1)', value: '+1'},
                            { id: 'UM', text: 'United States Outlying Islands (+1-340)', value: '+1-340'},
                            { id: 'UY', text: 'Uruguay (+598)', value: '+598'},
                            { id: 'UZ', text: 'Uzbekistan (+998)', value: '+998'},
                            { id: 'VU', text: 'Vanuatu (+678)', value: '+678'},
                            { id: 'VE', text: 'Venezuela (+58)', value: '+58'},
                            { id: 'VN', text: 'Vietnam (+84)', value: '+84'},
                            { id: 'VG', text: 'Virgin Islands, British (+1)', value: '+1'},
                            { id: 'VI', text: 'Virgin Islands, U.S. (+1)', value: '+1'},
                            { id: 'WF', text: 'Wallis And Futuna (+681)', value: '+681'},
                            { id: 'EH', text: 'Western Sahara (+212)', value: '+212'},
                            { id: 'YE', text: 'Yemen (North)(+969)', value: '+969'},
                            { id: 'YE', text: 'Yemen (South)(+967)', value: '+967'},
                            { id: 'ZM', text: 'Zambia (+260)', value: '+260'},
                            { id: 'ZW', text: 'Zimbabwe (+263)', value: '+263'}
                        ];
                        function formatCountry (country) {
                            if (!country.id) { return country.text; }
                            var $country = $(
                                '<span class="flag-icon flag-icon-'+ country.id.toLowerCase() +' flag-icon-squared"></span>' +
                                '<span class="flag-text" style="margin-left: 5px;">'+ country.text+"</span>"
                            );
                            return $country;
                        }
                        function format(state) {
                            if(state.selected == true){
                                var country = $('input[name=country]');
                                country.val(state.text);
                                if(state.value != undefined){
                                    var phone = state.value.replace("+","");
                                    localStorage.setItem("phone", phone);
                                }
                            }
                            if (!state.id) return state.text;
                            var $state = $(
                                '<span class="flag-icon flag-icon-'+ state.id.toLowerCase() +' flag-icon-squared"></span>' +
                                '<span class="flag-text" style="margin-left: 5px;">'+ state.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\-*\s*/g,"").replace(/,/g,"").replace(/'/g,"").replace(/&/g,"") +"</span>");
                            return $state;
                        }
                        if(window.location.pathname != '/signin.html' || window.location.pathname != '/ru/signin.html' || window.location.pathname != '/pt/signin.html' ||
                            window.location.pathname != '/why.html' || window.location.pathname != '/ru/why.html' || window.location.pathname != '/pt/why.html' ||
                            window.location.pathname != '/terms.html' || window.location.pathname != '/ru/terms.html' || window.location.pathname != '/pt/terms.html'){
                            $.ajax({
                                url: "/hr/public/getUserLocation",
                                type: "GET",
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                //beforeSend: function (xhr) {
                                //
                                //},
                                complete: function(resp){
                                    $.each(isoCountries, function(index, value) {
                                        if(resp.responseJSON.countryCode != undefined && resp.responseJSON.countryCode == value.id){
                                            if(window.location.pathname == '/signup.html' || window.location.pathname == '/ru/signup.html' || window.location.pathname == '/pt/signup.html'){
                                                //fb
                                                $('#signupFacebookForm').find('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\s*/g,"").replace(/,/g,"")+"</span>";
                                                $('#signupFacebookForm').find('.select2-selection__rendered')[0].title =  value.text;
                                                //end fb
                                                //google
                                                $('#signupGoogleForm').find('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\s*/g,"").replace(/,/g,"")+"</span>";
                                                $('#signupGoogleForm').find('.select2-selection__rendered')[0].title =  value.text;
                                                //end google
                                            }
                                            //our project
                                            $('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\-*\s*/g,"").replace(/,/g,"").replace(/'/g,"").replace(/&/g,"")+"</span>";
                                            $('.select2-selection__rendered')[0].title = value.text;
                                            //end our project
                                            var country = $('input[name=country]');
                                            country.val(value.text);
                                            var phone = $('.countryCustom');
                                            phone.value = value.value.replace("+","");
                                            localStorage.setItem("phone",  phone.value);
                                        }else{
                                            localStorage.removeItem("phone");
                                        }
                                    });
                                }
                            });
                        }
                        $("[name='countryCustom']").select2({
                            placeholder: "Select a country",
                            templateResult: formatCountry,
                            templateSelection: format,
                            data: isoCountries
                        });
                    });
                    if (res.orgName === '') {
                        xhr.abort();
                        $('.pass_need').fadeIn();
                        signup_facebook_loading = false;
                        return false;
                    }
                    if (res.phone === '') {
                        xhr.abort();
                        $('.pass_need').fadeIn();
                        signup_facebook_loading = false;
                        return false;
                    }
                    if (res.password === '') {
                        xhr.abort();
                        $('.pass_need').fadeIn();
                        signup_loading = false;
                        return false;
                    }
                    if (res.password2 === '') {
                        xhr.abort();
                        $('.pass_need').fadeIn();
                        signup_loading = false;
                        return false;
                    }
                    if (res.password !== res.password2) {
                        xhr.abort();
                        $('.pass_need').fadeIn();
                        signup_loading = false;
                        return false;
                    }
                    if (res.usersCount === '') {
                        xhr.abort();
                        $('.pass_need').fadeIn();
                        signup_google_loading = false;
                        return false;
                    }
                    if (res.terms != 'on') {
                        xhr.abort();
                        $('.pass_need').fadeIn();
                        signup_google_loading = false;
                        return false;
                    }
                    socialSuccess("facebook", messages.send);
                },
                success: function (data) {
                    console.log(data);
                    $($('.select2-selection--single')).css('border','2px solid #61B452');
                    $($('input[name=orgName]')).css('border','2px solid #61B452');
                    $($('select[name=usersCount]')).css('border','2px solid #61B452');
                    $($('input[name=password]')).css('border','2px solid #61B452');
                    $($('input[name=password2]')).css('border','2px solid #61B452');
                    if (data.personId !== undefined) {
                        if (!isIE()) {
                            socialSuccess("facebook", messages.redirect);
                            sendGA('signin_success');
                            window.location.replace("/!#/organizer");
                        } else {
                            downloadNewBrowser();
                        }
                    } else if (data.status === "error") {
                        localStorage.removeItem('phone');
                        socialError("facebook", data.message);
                    }
                    signup_facebook_loading = false;
                },
                error: function (data) {
                    localStorage.removeItem('phone');
                    console.log(data);
                    if (data.status === "error") {
                        socialError("facebook", data.message);
                    }
                    signup_facebook_loading = false;
                }
            });
        return false;
    });

    enterForm('#signupLinkedinForm', '#signupLinkedinBtn');
    var signup_linkedin_loading = false;
    $("#signupLinkedinBtn").on("click", function () {
        if (!signup_linkedin_loading) {
            signup_linkedin_loading = true;
            resetError();
            var res = $("#signupLinkedinForm").serializeObject();
            $.ajax({
                url: "/hr/person/registration/linkedin",
                type: "POST",
                data: JSON.stringify(res),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function (xhr) {
                    if (res.orgName === '') {
                        xhr.abort();
                        $('.pass_need').fadeIn();
                        signup_linkedin_loading = false;
                        return false;
                    }
                    socialSuccess("linkedin", messages.send);
                },
                success: function (data) {
                    console.log(data);
                    if (data.personId !== undefined) {
                        if (!isIE()) {
                            socialSuccess("linkedin", messages.redirect);
                            sendGA('signin_success');
                            window.location.replace("/!#/organizer");
                        } else {
                            downloadNewBrowser();
                        }
                    } else if (data.status === "error") {
                        socialError("linkedin", data.message);
                    }
                    signup_linkedin_loading = false;
                },
                error: function (data) {
                    console.log(data);
                    if (data.status === "error") {
                        socialError("linkedin", data.message);
                    }
                    signup_linkedin_loading = false;
                }
            });
        }
        return false;
    });
    var ua = navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var edge = ua.indexOf("Edge");
    var rv = ua.indexOf("rv:11.0");
    if (msie > 0 || edge > 0 || rv > 0) {
        $("#signinBtn").on("click", function (){
            $("#isIe").modal('show');
        });
    }else{
        var enter_loading = false;
        $("#signinBtn").on("click", function () {
            var timer = setTimeout(function(){
                xhrOuter.abort();
                authError(messages.timeout);
            },3000);
            enter_loading = true;
            resetError();
            var res = $("#enter_form").serializeObject();
            res.login = res.login.toLowerCase();
            res.timeZoneOffset = userTimeZoneOffset;
            res.lang = localStorage.getItem("NG_TRANSLATE_LANG_KEY");
            console.log(res.lang);
            //if(!localStorage.getItem("NG_TRANSLATE_LANG_KEY")){
            //    res.lang = 'en';
            //}
            if(res.login === ''){
                $($('input[name=login]')).css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
                $($('input[name=login]')).focus();
            }
            if(res.password === ''){
                $($('input[name=password]')).css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
                $($('input[name=password]')).focus();
            }
            var xhrOuter =  $.ajax({
                url: "/hr/person/auth",
                type: "POST",
                data: JSON.stringify(res),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function (xhr) {
                    if (res.login === '') {
                        xhr.abort();
                        $('.mail_need').fadeIn();
                        enter_loading = false;
                        clearInterval(timer);
                        return false;
                    }
                    if (!mailPattern.test(res.login)) {
                        xhr.abort();
                        $('.wrong_mail').fadeIn();
                        enter_loading = false;
                        clearInterval(timer);
                        return false;
                    }
                    if (res.password === '') {
                        xhr.abort();
                        $('.pass_need').fadeIn();
                        enter_loading = false;
                        clearInterval(timer);
                        return false;
                    }
                    authSuccess(messages.send);
                },
                success: function (data) {
                    clearTimeout(timer);
                    if(data.message == 'unknownEmail'){
                        $($('input[name=login]')).css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
                        $($('input[name=login]')).focus();
                        $('#enter_server_message').css('display', 'none');
                        $("#error").css('display', 'block');
                        if(localStorage.getItem("NG_TRANSLATE_LANG_KEY") == 'en'){
                            $("#error").html('Seems like you entered the incorrect information. Please enter the correct one.');
                        }else if(localStorage.getItem("NG_TRANSLATE_LANG_KEY") == 'ru'){
                            $("#error").html('Кажется, вы ввели неверные данные. Пожалуйста, попробуйте ещё раз.');
                        } else {
                          $("#error").html('Seems like you entered the incorrect information. Please enter the correct one.');
                        }
                        $("#error").removeClass("hidden");
                        setTimeout(function(){
                            $("#error").hide();
                        },5000);
                    }else{
                        $($('input[name=login]')).css('border','2px solid #61B452');
                        $($('input[name=password], #txthdnPassword')).css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
                        $($('input[name=password], #txthdnPassword')).focus();
                        $('#enter_server_message').text(data.message).css('color', 'red');
                    }
                    console.log(data);
                    localStorage.otherSessionsRemoves = data.object ? data.object.otherSessionsRemoves : false;
                  if (data.object && data.object.personId !== undefined) {
                        if (!isIE()) {
                            authSuccess(messages.redirect);
                            sendGA('signin_success');
                            $($('input[name=login]')).css('border','2px solid #61B452');
                            $($('input[name=password]')).css('border','2px solid #61B452');
                            $($('#txthdnPassword')).css('border','2px solid #61B452');
                            if (data.recrutRole == 'client') {
                                window.location.replace("/!#/vacancies");
                            } else {
                                window.location.replace("/!#/organizer");
                            }
                        } else {
                            downloadNewBrowser();
                        }
                    } else if (data.status === "error") {
                    if (data.message == 'unknownEmail') {
                      authError(messages.unknownEmail);
                    } else if (data.message == 'registrationIsNotConfirmed') {
                      authError(messages.registrationIsNotConfirmed);
                      $("#signupAndForgetDiv").hide();
                      $("#confirmDiv").show();
                    } else {
                      authError(data.message);
                    }
                  }
                  enter_loading = false;
                    clearInterval(timer)
                },
                error: function (data) {
                    console.log(data);
                    if (data.status === "error") {
                        authError(data.message);
                    }
                    enter_loading = false;
                    clearInterval(timer)
                }
            });
            return false;
        });
    }


    $('.enter_mod_mail').on('click', function () {
        $('.mail_need,.wrong_mail').fadeOut();
    });
    $('.enter_mod_mail').change(function () {
        $('.mail_need,.wrong_mail').fadeOut();
    });
    $('.enter_mod_pass').on('click', function () {
        $('.pass_need').fadeOut();
    });
    $('.enter_mod_pass').change(function () {
        $('.pass_need').fadeOut();
    });

    $('.enter_mod_wrap').mousedown(function () {
        $(this).addClass('enter_fix');
    }).mouseup(function () {
        $(this).removeClass('enter_fix');
    });

    $('.sign_up_wrap2').mousedown(function () {
        $(this).addClass('signup_fix');
    }).mouseup(function () {
        $(this).removeClass('signup_fix');
    });

    $('.reg_in').keypress(function () {
        $(this).style('background', 'white', 'important');
    });
    $('.reg_in').focusout(function () {
        if ($(this).val() === '') {
            $(this).removeAttr('style');
        }
    });

    $("#signup_email").focusout(function () {
        console.log("test");
        if (mailPattern.test($(this).val())) {
            $.ajax({
                url: "/hr/person/checkEmail",
                type: "GET",
                data: "email=" + $(this).val() + "&lang=" + localStorage.getItem("NG_TRANSLATE_LANG_KEY"),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.status === "ok") {
                        $("#signup_email").addClass("good").removeAttr("style");
                        $(".mail_occupied").fadeOut();
                    } else {
                        $(".mail_occupied").fadeIn();
                        $("#signup_email").removeClass("good");
                        if ($("#signup_email").val() === '') {
                            $(this).removeAttr('style');
                        } else {
                            $("#signup_email").style('background', 'white', 'important');
                        }
                    }
                }
            });
        }
    });

// reg form
    enterForm("#reg_form", "#signupBtn");
    var signup_loading = false;
    $("#signupBtn").on('click', function () {
        resetError();
        if (!signup_loading) {
            signup_loading = true;
            var res = $("#reg_form").serializeObject();
            res.login = res.login.toLowerCase();
            $.ajax({
                url: "/hr/person/registration",
                type: "POST",
                data: JSON.stringify(res),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function (xhr) {
                    if (res.login === '') {
                        xhr.abort();
                        $('.reg_mail_need').fadeIn();
                        signup_loading = false;
                        return false;
                    }
                    if (!mailPattern.test(res.login)) {
                        xhr.abort();
                        $('.wrong_mail2').fadeIn();
                        signup_loading = false;
                        return false;
                    }
                    if (res.firstName === '') {
                        xhr.abort();
                        $('.reg_name_need.need').fadeIn();
                        signup_loading = false;
                        return false;
                    }
                    if (!namePattern.test(res.firstName)) {
                        xhr.abort();
                        $('.reg_name_need.wrong').fadeIn();
                        signup_loading = false;
                        return false;
                    }
                    if (res.orgName === '') {
                        xhr.abort();
                        $('.reg_company_need').fadeIn();
                        signup_loading = false;
                        return false;
                    }
                    if (res.password === '' || !passPattern1.test(res.password) || !passPattern2.test(res.password) || !passPattern3.test(res.password)) {
                        xhr.abort();
                        $('.reg_pass_need').fadeIn();
                        signup_loading = false;
                        return false;
                    }
                    if (res.password2 === '') {
                        xhr.abort();
                        $('.reg_pass2_need').fadeIn();
                        signup_loading = false;
                        return false;
                    }
                    if (res.password !== res.password2) {
                        xhr.abort();
                        $('.pass_not_coincides').fadeIn();
                        signup_loading = false;
                        return false;
                    }
                },
                success: function (data) {
                    console.log(data);
                    if (data.personId !== undefined) {
                        sendGA('signup_success');
                        signupSuccess(messages.signup_success.replace("${login}", res.login).replace("${orgName}", res.orgName));
                    } else if (data.status === "error") {
                        signupError(data.message);
                    }
                    signup_loading = false;
                },
                error: function (data) {
                    console.log(data);
                    if (data.status === "error") {
                        signupError(data.message);
                    }
                    signup_loading = false;
                }
            });
        }
        return false;
    });

    $('.reg_mod_pass2').on('click', function () {
        $('.pass_not_coincides').fadeOut();
    });
    $('.reg_mod_pass2').change(function () {
        $('.pass_not_coincides').fadeOut();
    });
    $('.reg_mod_pass').on('click', function () {
        $('.pass_not_coincides').fadeOut();
    });
    $('.reg_mod_pass').change(function () {
        $('.pass_not_coincides').fadeOut();
    });


//    $('.reg_mod_phone').on('click', function() {
//        $('.reg_phone_need').fadeIn();
//    });
//    $('.reg_mod_phone').focusout(function() {
//        $('.reg_phone_need').fadeOut();
//    });

    $('.reg_mod_mail').on('click', function () {
        $('.reg_mail_need,.wrong_mail2,.mail_occupied').fadeOut();
    });
    $('.reg_mod_pass').on('click', function () {
        $('.reg_pass_need').fadeOut();
    });
    $('.reg_mod_name').on('click', function () {
        $('.reg_name_need').fadeOut();
    });
    $('.reg_mod_company').on('click', function () {
        $('.reg_company_need').fadeOut();
    });
    $('.reg_mod_pass2').on('click', function () {
        $('.reg_pass2_need').fadeOut();
    });

    $('.reg_mod_mail').change(function () {
        $('.reg_mail_need,.wrong_mail2,.mail_occupied').fadeOut();
    });
    $('.reg_mod_pass').change(function () {
        $('.reg_pass_need').fadeOut();
    });
    $('.reg_mod_name').change(function () {
        $('.reg_name_need').fadeOut();
    });
    $('.reg_mod_company').change(function () {
        $('.reg_company_need').fadeOut();
    });
    $('.reg_mod_pass2').change(function () {
        $('.reg_pass2_need').fadeOut();
    });

    // demo form

    enterForm("#demo_form", "#demoBtn");
    //var demo_loading = false;
    //$("#demoBtn").on('click', function (e) {
    //    resetError();
    //    if (!demo_loading) {
    //        demo_loading = true;
    //        var res = $("#demo_form").serializeObject();
    //        res.utms = localStorage.getItem("UTMS");
    //        if(!res.lang){
    //            res.lang = 'en';
    //        }
    //        $.ajax({
    //            url: "/hr/public/demo",
    //            type: "POST",
    //            data: JSON.stringify(res),
    //            contentType: "application/json; charset=utf-8",
    //            dataType: "json",
    //            beforeSend: function (xhr) {
    //                if (res.email === '') {
    //                    xhr.abort();
    //                    $('.reg_mail_need').fadeIn();
    //                    demo_loading = false;
    //                    return false;
    //                }
    //                if (!mailPattern.test(res.email)) {
    //                    xhr.abort();
    //                    $('.wrong_mail2').fadeIn();
    //                    demo_loading = false;
    //                    return false;
    //                }
    //                if (res.name === '') {
    //                    xhr.abort();
    //                    $('.reg_name_need_demo.need').fadeIn();
    //                    demo_loading = false;
    //                    return false;
    //                }
    //                if (!namePattern.test(res.name)) {
    //                    xhr.abort();
    //                    $('.reg_name_need_demo.wrong').fadeIn();
    //                    demo_loading = false;
    //                    return false;
    //                }
    //                if (res.company === '') {
    //                    xhr.abort();
    //                    $('.reg_company_need_demo').fadeIn();
    //                    demo_loading = false;
    //                    return false;
    //                }
    //                signupDemoSuccess(messages.send);
    //            },
    //            success: function (data) {
    //                console.log(data);
    //                if (data.status === "ok") {
    //                    var requestDemoObj = {
    //                        login: res.email,
    //                        phone: res.phone,
    //                        name: res.name,
    //                        companyName: res.company,
    //                        password: "password",
    //                        lang: localStorage.getItem("NG_TRANSLATE_LANG_KEY")
    //                    };
    //                    $.ajax({
    //                        url: "/hrdemo/person/auth",
    //                        type: "POST",
    //                        data: JSON.stringify(requestDemoObj),
    //                        contentType: "application/json; charset=utf-8",
    //                        dataType: "json",
    //                        success: function (data) {
    //                            console.log(data);
    //                            if (!isIE()) {
    //                                signupDemoSuccess(messages.redirect);
    //                                sendGA('demo_success');
    //                                localStorage.removeItem("demo_social_code");
    //                                localStorage.removeItem("demo_social");
    //                                window.location.replace("/hdemo.html#/organizer");
    //                            } else {
    //                                downloadNewBrowser();
    //                            }
    //                        },
    //                        error: function (data) {
    //                            console.log(data);
    //                            signupDemoError(messages.sta);
    //                        }
    //                    });
    //                } else if (data.message !== undefined) {
    //                    if (data.status === "ok") {
    //                    } else {
    //                        signupDemoError(data.message);
    //                        demo_loading = false;
    //                    }
    //                }
    //            },
    //            error: function (data) {
    //                console.log(data);
    //                if (data.status === "error") {
    //                    signupDemoError(data.message);
    //                }
    //                demo_loading = false;
    //            }
    //        });
    //    }
    //    return false;
    //});
//    $('.phone_demo').on('click', function() {
//        $('.reg_phone_need_demo').fadeIn();
//    });
//    $('.phone_demo').focusout(function() {
//        $('.reg_phone_need_demo').fadeOut();
//    });
    $('.name_demo').on('click', function () {
        $('.reg_name_need_demo').fadeOut();
    });
    $('.name_demo').change(function (e) {
        $('.reg_name_need_demo').fadeOut();
    });
    $('.company_demo').on('click', function () {
        $('.reg_company_need_demo').fadeOut();
    });
    $('.company_demo').change(function (e) {
        $('.reg_company_need_demo').fadeOut();
    });


    // end demo form

    //order_call form
    enterForm("#order_call_form", "#callmeBtn");
    var callme_loading = false;
    $("#callmeBtn").on('click', function (e) {
        resetError();
        if (!callme_loading) {
            callme_loading = true;
            var res = $("#order_call_form").serializeObject();
            res.email = res.email.toLowerCase();
            var email = $('#phone_number4');
            if(email.val().indexOf('@') > 0){
                email.css('border','2px solid #61B452');
            }else{
                email.css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
                email.focus();
                if(localStorage.getItem("NG_TRANSLATE_LANG_KEY") == 'en'){
                    $("#error-password").html('Seems like email you entered is incorrect. Please enter the correct one.');
                }else{
                    $("#error-password").html('Кажется, вы ввели неверный email. Пожалуйста, попробуйте ещё раз.');
                }
                $("#error-password").removeClass("hidden");
                setTimeout(function(){
                    $("#error-password").hide();
                },5000);
            }
            console.log('1');
            $.ajax({
                url: "/hr/person/forgetPasswordRequest/" + localStorage.getItem("NG_TRANSLATE_LANG_KEY"),
                type: "POST",
                data: JSON.stringify(res),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function (xhr) {
                    if (res.email === '') {
                        xhr.abort();
                        $('.order_call_phone_need').fadeIn();
                        callme_loading = false;
                        return false;
                    }
                    if (!mailPattern.test(res.email)) {
                        xhr.abort();
                        $('.order_call_phone_need').fadeIn();
                        email.css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
                        console.log('2');
                        callme_loading = false;
                        return false;
                    }
                },
                success: function (data) {
                    console.log(data);
                    if (data.status === "ok") {
                        $(".order_call_win_under.order_call_success").show();
                        email.css('border','2px solid #61B452');
                        $("#forgot-pass").modal('hide');
                        $("#send-key-modal").modal('show');
                    } else if (data.message) {
                        if (data.message == 'unknownEmail') {
                            $("#error-password").html('Seems like email you entered is incorrect. Please enter the correct one.');
                            $(".order_call_win_under.order_call_error").text(messages.unknownEmail).show();
                            email.css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
                        } else {
                            $(".order_call_win_under.order_call_error").text(messages[data.message]).show();
                            email.css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
                        }
                    }
                    callme_loading = false;
                }, error: function (data) {
                    console.log(data);
                    if (data.status === "error") {
                        signupError(data.message);
                    }
                    callme_loading = false;
                }
            });
        }
        return false;
    });

    var confirmLetter_loading = false;
    $("#confirmLetterLink").on('click', function (e) {
        if (!confirmLetter_loading) {
            confirmLetter_loading = true;
            $.ajax({
                url: "/hr/person/sendConfirmEmail/" + localStorage.getItem("NG_TRANSLATE_LANG_KEY"),
                type: "POST",
                data: JSON.stringify({email: $("#enter_form .enter_mod_mail").val().toLowerCase()}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.status === "ok") {
                        authSuccess(messages.confirmMessage);
                    } else if (data.message) {
                        if (data.message == 'unknownEmail') {
                            authError(messages.unknownEmail);
                        } else {
                            authError(data.message);
                        }
                    }
                    confirmLetter_loading = false;
                }, error: function (data) {
                    console.log(data);
                    if (data.status === "error") {
                        signupError(data.message);
                    }
                    confirmLetter_loading = false;
                }
            });
        }
        return false;
    });

    //subscribe_form form
    enterForm("#subscribe_form", "#subscribeBtn");
    var subscribe_loading = false;
    $("#subscribeBtn").on('click', function () {
        resetError();
        if (!subscribe_loading) {
            subscribe_loading = true;
            var res = $("#subscribe_form").serializeObject();
            $.ajax({
                url: "/hr/public/subscribe",
                type: "POST",
                data: JSON.stringify(res),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function (xhr) {
                    if (res.email === '') {
                        xhr.abort();
                        $(".subscribeEmptyEmail").show();
                        subscribe_loading = false;
                        return false;
                    }
                    if (!mailPattern.test(res.email)) {
                        xhr.abort();
                        $(".subscribeWrongEmail").show();
                        subscribe_loading = false;
                        return false;
                    }
                },
                success: function (data) {
                    sendGA('subscribe');
                    console.log(data);
                    if (data.message !== undefined) {
                        if (data.status === "ok") {
                            $(".subscribeSuccess").show();
                        } else {
                            $(".subscribeServerError").text(data.message).show();
                        }
                    }
                    subscribe_loading = false;
                },
                error: function (data) {
                    console.log(data);
                    $(".subscribeText").hide();
                    if (data.status === "error") {
                        $(".subscribeServerError").text(data.message).show();
                    }
                    subscribe_loading = false;
                }
            });
        }
        return false;
    });
    $('.phone_order_call').on('click', function () {
        $('.order_call_phone_need').fadeOut();
    });
//    $('.phone_order_call').focusout(function() {
//        $('.order_call_valid_phone').fadeOut();
//    });

    // end of order call form

// slider
    $('.slider_wrap').each(function () {
        var $left = $('.left_nav');
        var $right = $('.right_nav');
        var $slider = $('.slider_bg');
        var $slides = $('.slide');
        $left.css('opacity', '0').addClass('cursor_none');
        var clip = false;
        var item = 1;
        var count = $slides.length;
        var active = Math.floor((Math.random() * count));
        if (active > 0) {
            var $replace = $($slides[0]);
            $($slides[0]).replaceWith($slides[active]);
            $($slides[1]).after($replace);
        }
        $right.click(function () {
            if (!clip && item < count) {
                $left.css('opacity', '1').removeClass('cursor_none');
                clip = true;
                next_item = item;
                cur_item = item - 1;
                width_next = $slides.eq(next_item).css('width');
                width_cur = $slides.eq(cur_item).css('width');
                cur_pos = $slider.css('marginLeft');
                new_pos = parseInt(cur_pos) - parseInt(width_next) - 2;
                $slider.animate({'marginLeft': new_pos}, 600, function () {
                    clip = false;
                });
                item = item + 1;
                if (item == count) {
                    $right.css('display', 'none');
                }
            }
            return false;
        });

        $left.click(function () {
            if (!clip && item > 1) {
                $right.css('display', 'block');
                clip = true;
                prev_item = item - 2;
                cur_item = item - 1;
                width_prev = $slides.eq(prev_item).css('width');
                width_cur = $slides.eq(cur_item).css('width');
                cur_pos = $slider.css('marginLeft');
                new_pos = parseInt(cur_pos) + parseInt(width_prev) + 2;
                $slider.animate({'marginLeft': new_pos}, 600, function () {
                    clip = false;
                });
                item = item - 1;
                if (item == 1) {
                    $left.css('opacity', '0').addClass('cursor_none');
                }
            }
            return false;
        });

    });
    // end slider
    if (msie > 0 || edge > 0 || rv > 0) {
        $(".signinButton").on("click", function (){
            $("#isIe").modal('show');
        });
        $(".signinButtonEng").on("click", function (){
            $("#isIe").modal('show');
        });
        $(".signinButtonPt").on("click", function (){
          $("#isIe").modal('show');
        });
    }else{
        $('.signinButton').click (function(checkIE){
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");
            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
                $('#mod_download_browser').css('display','block')
            }
        });
        request = new XMLHttpRequest();
        request.open('GET', '/hr/person/authping', true);
        var redirectLogin = false;
        request.onload = function () {
            console.log(redirectLogin);
            if (request.status >= 200 && request.status < 400) {
                resp = request.responseText;
                var data = JSON.parse(resp);
                if (data.status == 'ok') {
                    redirectLogin = true;
                    //window.location.replace("/!#/organizer");
                }
                event.preventDefault();
            }
        };
        request.send();
        $('.signinButton').click(function(){
            function isIE() {
                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");
                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                    return true;
                } else {
                    return false;
                }
            }
            if (!isIE()) {
                //request = new XMLHttpRequest();
                //request.open('GET', '/hr/person/authping', true);
                //request.onload = function () {
                if (redirectLogin) {
                    window.location.replace("/!#/organizer");
                }else{
                    history.pushState({},"","");
                    window.location.replace("/ru/signin.html");
                }
                //};
            }
        });
        $('.signinButtonEng').click (function(checkIE){
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");
            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
                $('#mod_download_browser').css('display','block')
            }
        });
        $('.signinButtonEng').click(function(){
            function isIE() {
                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");
                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                    return true;
                } else {
                    return false;
                }
            }
            if (!isIE()) {
                console.log('hereeeeeeeeeee');
                //request = new XMLHttpRequest();
                //request.open('GET', '/hr/person/authping', true);
                //request.onload = function () {
                if (redirectLogin) {
                    window.location.replace("/!#/organizer");
                }else{
                    history.pushState({},"","");
                    window.location.replace("/signin.html");
                }
                //};
            }
        });
      $('.signinButtonPt').click (function(checkIE){
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
          $('#mod_download_browser').css('display','block')
        }
      });
      $('.signinButtonPt').click(function(){
        function isIE() {
          var ua = window.navigator.userAgent;
          var msie = ua.indexOf("MSIE ");
          if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            return true;
          } else {
            return false;
          }
        }
        if (!isIE()) {
          //request = new XMLHttpRequest();
          //request.open('GET', '/hr/person/authping', true);
          //request.onload = function () {
          if (redirectLogin) {
            window.location.replace("/!#/organizer");
          }else{
              history.pushState({},"","");
              window.location.replace("/pt/signin.html");
          }
          //};
        }
      });
        function isIE() {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");
            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                return true;
            } else {
                return false;
            }
        }
    }
    $('.ieError2').click (function(checkIE){
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
            $('#mod_download_browser').css('display','block')
        }else{
            history.pushState({},"","");
            window.location.replace("/signin.html");
        }
    });
    if (msie > 0 || edge > 0 || rv > 0) {
        $('.price-btn-small').click (function(){
            $("#isIe").modal('show');
        });
    }else{
        $('.price-btn-small').click (function(checkIE){
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");
            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
                $('#mod_download_browser').css('display','block')
            }else{
                if(window.location.pathname == '/price.html'){
                    history.pushState({},"","");
                    window.location.replace("/signup.html");
                }
                if(window.location.pathname == '/ru/price.html'){
                    history.pushState({},"","");
                    window.location.replace("/ru/signup.html");
                }
            }
        });
    }
    if (msie > 0 || edge > 0  || rv > 0) {
        console.log('orangeBtn click1');
        $('.orange-btn').click (function(){
            $("#isIe").modal('show');
        });
    }else{
        console.log('orangeBtn click2');
        $('.orange-btn').click (function(){
            if(window.location.pathname == '/' || window.location.pathname == '/index.html'){
                history.pushState({},"","");
                window.location.replace("/signup.html");
            }
            if(window.location.pathname == '/ru/' || window.location.pathname == '/ru/index.html'){
                history.pushState({},"","");
                window.location.replace("/ru/signup.html");
            }
        });
    }
    if (msie > 0 || edge > 0  || rv > 0) {
        $('.isIe').click (function(){
            $("#isIe").modal('show');
        });
    }else{
        $('.isIe').click (function(){
            if(window.location.pathname == '/features.html'){
                history.pushState({},"","");
                window.location.replace("/signup.html");
            }
            if(window.location.pathname == '/ru/features.html'){
                history.pushState({},"","");
                window.location.replace("/ru/signup.html");
            }
        });
    }
});
function tariffFunc(tarif){
    console.log(tarif);
    if(tarif == 'team_work' || tarif == 'corporate' || tarif == 'enterprise' ){
        $('.showDemo').css('display', 'none');
        $('.showTariffPrice').css('display', 'block');
        $('#valueTariff').val('Request ' + tarif + ' Pricing');
        if(tarif == 'enterprise') {
            $('.showTariffPriceRu').html('Получить предложение');
            $('.showTariffPriceEn').html('Get an Offer');
        } else {
            $('.showTariffPriceRu').html('Запросить цену');
            $('.showTariffPriceEn').html('Request pricing quote');
        }
    }else{
        $('.showDemo').css('display', 'block');
        $('.showTariffPrice').css('display', 'none');
        $('#valueTariff').val('Request demo');
    }
}
$('#askQuestionSubmit').on('click',function(e){
    var res = $("#questionForm").serializeObject();
    var string = res.country;
    if(string == 'null' || string == null || string == undefined){
        res.country = 'Afghanistan';
    }else{
        res.country = string.replace(/\d+/g, "").replace("(","").replace(")","").replace(" +","");
    }
    if(localStorage.getItem('phone') == null){
        res.phone = $('.select2-selection__rendered')[0].title.replace(/[A-z]/g, "").replace(/\(*\)*\+*\.*\s*/g,"").replace(/,/g,"") + res.phone;
    }else{
        res.phone = $(".countryCustom").text(localStorage.getItem('phone').replace(/-/g,"") + res.phone)[0].textContent;
    }
    delete res.countryCustom;
    $('#ex1_mail, #ex1_skype, #ex1_firstName, #ex1_lastName, #ex1_number, #ex1_orgName, #ex1_usersCount, #ex1_averageNum').css({
        "box-shadow":"none",
        "border":"1px solid #E5E5E6"
    });
    if(!res.intention) {
        res.intention = 'Request demo';
    }
    $.ajax({
        url: "/hr/public/newLead",
        type: "POST",
        data: JSON.stringify(res),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function (xhr) {
            console.log(res);

            contains(res.firstName , '!"№;%:?*()+#$^&*@1234567890' , 'ex1_firstName' , redBorder);
            contains(res.lastName , '!"№;%:?*()+#$^&*@1234567890' , 'ex1_lastName' , redBorder);
            contains(res.email , '!"№;%:?*()+#$^&*' , 'ex1_mail' , redBorder);
            contains(res.phone , '!"№;%:?*()#$^&*@_' , 'ex1_number' , redBorder);
            contains(res.companyName , '' , '#ex1_orgName' , redBorder);

            $(function() {
                var isoCountries = [
                    { id: 'AF', text: 'Afghanistan (+93)', value: '+93'},
                    { id: 'AX', text: 'Aland Islands (+358)', value: '+358'},
                    { id: 'AL', text: 'Albania (+355)', value: '+355'},
                    { id: 'DZ', text: 'Algeria (+213)', value: '+213'},
                    { id: 'AS', text: 'American Samoa (+1)', value: '+1'},
                    { id: 'AD', text: 'Andorra (+376)', value: '+376'},
                    { id: 'AO', text: 'Angola (+244)', value: '+244'},
                    { id: 'AI', text: 'Anguilla (+1264)', value: '+1264'},
                    { id: 'AQ', text: 'Antarctica (+672)', value: '+672'},
                    { id: 'AG', text: 'Antigua And Barbuda (+1268)', value: '+1268'},
                    { id: 'AR', text: 'Argentina (+54)', value: '+54'},
                    { id: 'AM', text: 'Armenia (+374)', value: '+374'},
                    { id: 'AW', text: 'Aruba (+297)', value: '+297'},
                    { id: 'AU', text: 'Australia (+61)', value: '+61'},
                    { id: 'AT', text: 'Austria (+43)', value: '+43'},
                    { id: 'AZ', text: 'Azerbaijan (+994)', value: '+994'},
                    { id: 'BS', text: 'Bahamas (+1242)', value: '+1242'},
                    { id: 'BH', text: 'Bahrain (+973)', value: '+973'},
                    { id: 'BD', text: 'Bangladesh (+880)', value: '+880'},
                    { id: 'BB', text: 'Barbados (+1246)', value: '+1246'},
                    { id: 'BY', text: 'Belarus (+375)', value: '+375'},
                    { id: 'BE', text: 'Belgium (+32)', value: '+32'},
                    { id: 'BZ', text: 'Belize (+501)', value: '+501'},
                    { id: 'BJ', text: 'Benin (+229)', value: '+229'},
                    { id: 'BM', text: 'Bermuda (+1441)', value: '+1441'},
                    { id: 'BT', text: 'Bhutan (+975)', value: '+975'},
                    { id: 'BO', text: 'Bolivia (+591)', value: '+591'},
                    { id: 'BA', text: 'Bosnia And Herzegovina (+387)', value: '+387'},
                    { id: 'BW', text: 'Botswana (+267)', value: '+267'},
                    { id: 'BV', text: 'Bouvet Island (+47)', value: '+47'},
                    { id: 'BR', text: 'Brazil (+55)', value: '+55'},
                    { id: 'IO', text: 'British Indian Ocean Territory (+246)', value: '+246'},
                    { id: 'BN', text: 'Brunei Darussalam (+673)', value: '+673'},
                    { id: 'BG', text: 'Bulgaria (+359)', value: '+359'},
                    { id: 'BF', text: 'Burkina Faso (+226)', value: '+226'},
                    { id: 'BI', text: 'Burundi (+257)', value: '+257'},
                    { id: 'KH', text: 'Cambodia (+855)', value: '+855'},
                    { id: 'CM', text: 'Cameroon (+237)', value: '+237'},
                    { id: 'CA', text: 'Canada (+1)', value: '+1'},
                    { id: 'CV', text: 'Cape Verde Islands (+238)', value: '+238'},
                    { id: 'KY', text: 'Cayman Islands (+1345)', value: '+1345'},
                    { id: 'CF', text: 'Central African Republic (+236)', value: '+236'},
                    { id: 'TD', text: 'Chad (+235)', value: '+235'},
                    { id: 'CL', text: 'Chile (+56)', value: '+56'},
                    { id: 'CN', text: 'China (+86)', value: '+86'},
                    { id: 'CX', text: 'Christmas Island (+672)', value: '+672'},
                    { id: 'CC', text: 'Cocos (Keeling) Islands (+225)', value: '+225'},
                    { id: 'CO', text: 'Colombia (+57)', value: '+57'},
                    { id: 'KM', text: 'Comoros (+269)', value: '+269'},
                    { id: 'CG', text: 'Congo (+242)', value: '+242'},
                    { id: 'CD', text: 'Congo, Democratic Republic (+243)', value: '+243'},
                    { id: 'CK', text: 'Cook Islands (+682)', value: '+682'},
                    { id: 'CR', text: 'Costa Rica (+506)', value: '+506'},
                    { id: 'CI', text: 'Cote D\'Ivoire (+225)', value: '+225'},
                    { id: 'HR', text: 'Croatia (+385)', value: '+385'},
                    { id: 'CU', text: 'Cuba (+53)', value: '+53'},
                    { id: 'CY', text: 'Cyprus (+90)', value: '+90'},
                    { id: 'CZ', text: 'Czech Republic (+420)', value: '+420'},
                    { id: 'DK', text: 'Denmark (+45)', value: '+45'},
                    { id: 'DJ', text: 'Djibouti (+253)', value: '+253'},
                    { id: 'DM', text: 'Dominica (+1809)', value: '+1809'},
                    { id: 'DO', text: 'Dominican Republic (+1809)', value: '+1809'},
                    { id: 'EC', text: 'Ecuador (+593)', value: '+593'},
                    { id: 'EG', text: 'Egypt (+20)', value: '+20'},
                    { id: 'SV', text: 'El Salvador (+503)', value: '+503'},
                    { id: 'GQ', text: 'Equatorial Guinea (+240)', value: '+240'},
                    { id: 'ER', text: 'Eritrea (+291)', value: '+291'},
                    { id: 'EE', text: 'Estonia (+372)', value: '+372'},
                    { id: 'ET', text: 'Ethiopia (+251)', value: '+251'},
                    { id: 'FK', text: 'Falkland Islands (Malvinas) (+500)', value: '+500'},
                    { id: 'FO', text: 'Faroe Islands (+298)', value: '+298'},
                    { id: 'FJ', text: 'Fiji (+679)', value: '+679'},
                    { id: 'FI', text: 'Finland (+358)', value: '+358'},
                    { id: 'FR', text: 'France (+33)', value: '+33'},
                    { id: 'GF', text: 'French Guiana (+594)', value: '+594'},
                    { id: 'PF', text: 'French Polynesia (+689)', value: '+689'},
                    { id: 'TF', text: 'French Southern Territories (+689)', value: '+689'},
                    { id: 'GA', text: 'Gabon (+241)', value: '+241'},
                    { id: 'GM', text: 'Gambia (+220)', value: '+220'},
                    { id: 'GE', text: 'Georgia (+7880)', value: '+7880'},
                    { id: 'DE', text: 'Germany (+49)', value: '+49'},
                    { id: 'GH', text: 'Ghana (+233)', value: '+233'},
                    { id: 'GI', text: 'Gibraltar (+350)', value: '+350'},
                    { id: 'GR', text: 'Greece (+30)', value: '+30'},
                    { id: 'GL', text: 'Greenland (+299)', value: '+299'},
                    { id: 'GD', text: 'Grenada (+1473)', value: '+1473'},
                    { id: 'GP', text: 'Guadeloupe (+590)', value: '+590'},
                    { id: 'GU', text: 'Guam (+671)', value: '+671'},
                    { id: 'GT', text: 'Guatemala (+502)', value: '+502'},
                    { id: 'GG', text: 'Guernsey (+44)', value: '+44'},
                    { id: 'GN', text: 'Guinea (+224)', value: '+224'},
                    { id: 'GW', text: 'Guinea-Bissau (+245)', value: '+245'},
                    { id: 'GY', text: 'Guyana (+592)', value: '+592'},
                    { id: 'HT', text: 'Haiti (+509)', value: '+509'},
                    { id: 'HM', text: 'Heard Island & Mcdonald Islands (+61)', value: '+61'},
                    { id: 'VA', text: 'Holy See (Vatican City State) (+39)', value: '+39'},
                    { id: 'HN', text: 'Honduras (+504)', value: '+504'},
                    { id: 'HK', text: 'Hong Kong (+852)', value: '+852'},
                    { id: 'HU', text: 'Hungary (+36)', value: '+36'},
                    { id: 'IS', text: 'Iceland (+354)', value: '+354'},
                    { id: 'IN', text: 'India(+91)', value: '+91'},
                    { id: 'ID', text: 'Indonesia (+62)', value: '+62'},
                    { id: 'IR', text: 'Iran, Islamic Republic Of (+98)', value: '+98'},
                    { id: 'IQ', text: 'Iraq (+964)', value: '+964'},
                    { id: 'IE', text: 'Ireland (+353)', value: '+353'},
                    { id: 'IM', text: 'Isle Of Man (+44)', value: '+44'},
                    { id: 'IL', text: 'Israel (+972)', value: '+975'},
                    { id: 'IT', text: 'Italy (+39)', value: '+39'},
                    { id: 'JM', text: 'Jamaica (+1876)', value: '+1876'},
                    { id: 'JP', text: 'Japan (+81)', value: '+81'},
                    { id: 'JE', text: 'Jersey (+44-1534)', value: '+44-1534'},
                    { id: 'JO', text: 'Jordan (+962)', value: '+962'},
                    { id: 'KZ', text: 'Kazakhstan (+7)', value: '+7'},
                    { id: 'KE', text: 'Kenya (+254)', value: '+254'},
                    { id: 'KI', text: 'Kiribati (+686)', value: '+686'},
                    { id: 'KP', text: 'Korea - North (+850)', value: '+850'},
                    { id: 'KR', text: 'Korea - South (+82)', value: '+82'},
                    { id: 'KW', text: 'Kuwait (+965)', value: '+965'},
                    { id: 'KG', text: 'Kyrgyzstan (+996)', value: '+996'},
                    { id: 'LA', text: 'Lao People\'s Democratic Republic (+856)', value: '+856'},
                    { id: 'LV', text: 'Latvia (+371)', value: '+371'},
                    { id: 'LB', text: 'Lebanon (+961)', value: '+961'},
                    { id: 'LS', text: 'Lesotho (+266)', value: '+266'},
                    { id: 'LR', text: 'Liberia (+231)', value: '+231'},
                    { id: 'LY', text: 'Libyan Arab Jamahiriya (+218)', value: '+218'},
                    { id: 'LI', text: 'Liechtenstein (+417)', value: '+417'},
                    { id: 'LT', text: 'Lithuania (+370)', value: '+370'},
                    { id: 'LU', text: 'Luxembourg (+352)', value: '+352'},
                    { id: 'MO', text: 'Macao (+853)', value: '+853'},
                    { id: 'MK', text: 'Macedonia (+389)', value: '+389'},
                    { id: 'MG', text: 'Madagascar (+261)', value: '+261'},
                    { id: 'MW', text: 'Malawi (+265)', value: '+265'},
                    { id: 'MY', text: 'Malaysia (+60)', value: '+60'},
                    { id: 'MV', text: 'Maldives (+960)', value: '+960'},
                    { id: 'ML', text: 'Mali (+223)', value: '+223'},
                    { id: 'MT', text: 'Malta (+356)', value: '+356'},
                    { id: 'MH', text: 'Marshall Islands (+692)', value: '+692'},
                    { id: 'MQ', text: 'Martinique (+596)', value: '+596'},
                    { id: 'MR', text: 'Mauritania (+222)', value: '+222'},
                    { id: 'MU', text: 'Mauritius (+230)', value: '+230'},
                    { id: 'YT', text: 'Mayotte (+269)', value: '+269'},
                    { id: 'MX', text: 'Mexico (+52)', value: '+52'},
                    { id: 'FM', text: 'Micronesia, Federated States Of (+691)', value: '+691'},
                    { id: 'MD', text: 'Moldova (+373)', value: '+373'},
                    { id: 'MC', text: 'Monaco (+377)', value: '+377'},
                    { id: 'MN', text: 'Mongolia (+976)', value: '+976'},
                    { id: 'ME', text: 'Montenegro (+382)', value: '+382'},
                    { id: 'MS', text: 'Montserrat (+1664)', value: '+1664'},
                    { id: 'MA', text: 'Morocco (+212)', value: '+212'},
                    { id: 'MZ', text: 'Mozambique (+258)', value: '+258'},
                    { id: 'MM', text: 'Myanmar (+95)', value: '+95'},
                    { id: 'NA', text: 'Namibia (+264)', value: '+264'},
                    { id: 'NR', text: 'Nauru (+674)', value: '+674'},
                    { id: 'NP', text: 'Nepal (+977)', value: '+977'},
                    { id: 'NL', text: 'Netherlands (+31)', value: '+31'},
                    { id: 'AN', text: 'Netherlands Antilles (+599)', value: '+599'},
                    { id: 'NC', text: 'New Caledonia (+687)', value: '+687'},
                    { id: 'NZ', text: 'New Zealand (+64)', value: '+64'},
                    { id: 'NI', text: 'Nicaragua (+505)', value: '+505'},
                    { id: 'NE', text: 'Niger (+227)', value: '+227'},
                    { id: 'NG', text: 'Nigeria (+234)', value: '+234'},
                    { id: 'NU', text: 'Niue (+683)', value: '+683'},
                    { id: 'NF', text: 'Norfolk Island (+672)', value: '+672'},
                    { id: 'MP', text: 'Northern Mariana Islands (+670)', value: '+670'},
                    { id: 'NO', text: 'Norway (+47)', value: '+47'},
                    { id: 'OM', text: 'Oman (+968)', value: '+968'},
                    { id: 'PK', text: 'Pakistan (+92)', value: '+92'},
                    { id: 'PW', text: 'Palau (+680)', value: '+680'},
                    { id: 'PS', text: 'Palestinian Territory (+970)', value: '+970'},
                    { id: 'PA', text: 'Panama (+507)', value: '+507'},
                    { id: 'PG', text: 'Papua New Guinea (+675)', value: '+675'},
                    { id: 'PY', text: 'Paraguay (+595)', value: '+595'},
                    { id: 'PE', text: 'Peru (+51)', value: '+51'},
                    { id: 'PH', text: 'Philippines (+63)', value: '+63'},
                    { id: 'PN', text: 'Pitcairn (+64)', value: '+64'},
                    { id: 'PL', text: 'Poland (+48)', value: '+48'},
                    { id: 'PT', text: 'Portugal (+351)', value: '+351'},
                    { id: 'PR', text: 'Puerto Rico (+1787)', value: '+1787'},
                    { id: 'QA', text: 'Qatar (+974)', value: '+974'},
                    { id: 'RE', text: 'Reunion (+262)', value: '+262'},
                    { id: 'RO', text: 'Romania (+40)', value: '+40'},
                    { id: 'RU', text: 'Russian Federation (+7)', value: '+7'},
                    { id: 'RW', text: 'Rwanda (+250)', value: '+250'},
                    { id: 'BL', text: 'Saint Barthelemy (+590)', value: '+590'},
                    { id: 'SH', text: 'Saint Helena (+290)', value: '+94'},
                    { id: 'KN', text: 'Saint Kitts And Nevis (+1869)', value: '+94'},
                    { id: 'LC', text: 'Saint Lucia (+1758)', value: '+94'},
                    { id: 'MF', text: 'Saint Martin (+590)', value: '+590'},
                    { id: 'PM', text: 'Saint Pierre And Miquelon (+508)', value: '+508'},
                    { id: 'VC', text: 'Saint Vincent And Grenadines (+1-784)', value: '+1-784'},
                    { id: 'WS', text: 'Samoa (+685)', value: '+685'},
                    { id: 'SM', text: 'San Marino (+378)', value: '+378'},
                    { id: 'ST', text: 'Sao Tome And Principe (+239)', value: '+239'},
                    { id: 'SA', text: 'Saudi Arabia (+966)', value: '+966'},
                    { id: 'SN', text: 'Senegal (+221)', value: '+221'},
                    { id: 'RS', text: 'Serbia (+381)', value: '+381'},
                    { id: 'SC', text: 'Seychelles (+248)', value: '+248'},
                    { id: 'SL', text: 'Sierra Leone (+232)', value: '+232'},
                    { id: 'SG', text: 'Singapore (+65)', value: '+65'},
                    { id: 'SK', text: 'Slovakia (+421)', value: '+421'},
                    { id: 'SI', text: 'Slovenia (+386)', value: '+386'},
                    { id: 'SB', text: 'Solomon Islands (+677)', value: '+677'},
                    { id: 'SO', text: 'Somalia (+252)', value: '+252'},
                    { id: 'ZA', text: 'South Africa (+27)', value: '+27'},
                    { id: 'GS', text: 'South Georgia And Sandwich Isl. (+500)', value: '+500'},
                    { id: 'ES', text: 'Spain (+34)', value: '+34'},
                    { id: 'LK', text: 'Sri Lanka (+94)', value: '+94'},
                    { id: 'SD', text: 'Sudan (+249)', value: '+249'},
                    { id: 'SR', text: 'Suriname (+597)', value: '+597'},
                    { id: 'SJ', text: 'Svalbard And Jan Mayen (+47)', value: '+47'},
                    { id: 'SZ', text: 'Swaziland (+268)', value: '+268'},
                    { id: 'SE', text: 'Sweden (+46)', value: '+46'},
                    { id: 'CH', text: 'Switzerland (+41)', value: '+41'},
                    { id: 'SY', text: 'Syrian Arab Republic (+963)', value: '+963'},
                    { id: 'TW', text: 'Taiwan (+886)', value: '+886'},
                    { id: 'TJ', text: 'Tajikistan (+992)', value: '+992'},
                    { id: 'TZ', text: 'Tanzania (+255)', value: '+255'},
                    { id: 'TH', text: 'Thailand (+66)', value: '+66'},
                    { id: 'TL', text: 'Timor-Leste (+670)', value: '+670'},
                    { id: 'TG', text: 'Togo (+228)', value: '+228'},
                    { id: 'TK', text: 'Tokelau (+690)', value: '+690'},
                    { id: 'TO', text: 'Tonga (+676)', value: '+676'},
                    { id: 'TT', text: 'Trinidad And Tobago (+1868)', value: '+1868'},
                    { id: 'TN', text: 'Tunisia (+216)', value: '+216'},
                    { id: 'TR', text: 'Turkey (+90)', value: '+90'},
                    { id: 'TM', text: 'Turkmenistan (+993)', value: '+993'},
                    { id: 'TC', text: 'Turks And Caicos Islands (+1649)', value: '+1649'},
                    { id: 'TV', text: 'Tuvalu (+688)', value: '+668'},
                    { id: 'UG', text: 'Uganda (+256)', value: '+256'},
                    { id: 'UA', text: 'Ukraine (+380)', value: '+380'},
                    { id: 'AE', text: 'United Arab Emirates (+971)', value: '+971'},
                    { id: 'GB', text: 'United Kingdom (+44)', value: '+44'},
                    { id: 'US', text: 'United States (+1)', value: '+1'},
                    { id: 'UM', text: 'United States Outlying Islands (+1-340)', value: '+1-340'},
                    { id: 'UY', text: 'Uruguay (+598)', value: '+598'},
                    { id: 'UZ', text: 'Uzbekistan (+998)', value: '+998'},
                    { id: 'VU', text: 'Vanuatu (+678)', value: '+678'},
                    { id: 'VE', text: 'Venezuela (+58)', value: '+58'},
                    { id: 'VN', text: 'Vietnam (+84)', value: '+84'},
                    { id: 'VG', text: 'Virgin Islands, British (+1)', value: '+1'},
                    { id: 'VI', text: 'Virgin Islands, U.S. (+1)', value: '+1'},
                    { id: 'WF', text: 'Wallis And Futuna (+681)', value: '+681'},
                    { id: 'EH', text: 'Western Sahara (+212)', value: '+212'},
                    { id: 'YE', text: 'Yemen (North)(+969)', value: '+969'},
                    { id: 'YE', text: 'Yemen (South)(+967)', value: '+967'},
                    { id: 'ZM', text: 'Zambia (+260)', value: '+260'},
                    { id: 'ZW', text: 'Zimbabwe (+263)', value: '+263'}
                ];
                function formatCountry (country) {
                    if (!country.id) { return country.text; }
                    var $country = $(
                        '<span class="flag-icon flag-icon-'+ country.id.toLowerCase() +' flag-icon-squared"></span>' +
                        '<span class="flag-text" style="margin-left: 5px;">'+ country.text+"</span>"
                    );
                    return $country;
                }
                function format(state) {
                    if(state.selected == true){
                        var country = $('input[name=country]');
                        country.val(state.text);
                        if(state.value != undefined){
                            var phone = state.value.replace("+","");
                            localStorage.setItem("phone", phone);
                        }
                    }
                    if (!state.id) return state.text;
                    var $state = $(
                        '<span class="flag-icon flag-icon-'+ state.id.toLowerCase() +' flag-icon-squared"></span>' +
                        '<span class="flag-text" style="margin-left: 5px;">'+ state.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\-*\s*/g,"").replace(/,/g,"").replace(/'/g,"").replace(/&/g,"") +"</span>");
                    return $state;
                }
                if(window.location.pathname != '/signin.html' || window.location.pathname != '/ru/signin.html' || window.location.pathname != '/pt/signin.html' ||
                    window.location.pathname != '/why.html' || window.location.pathname != '/ru/why.html' || window.location.pathname != '/pt/why.html' ||
                    window.location.pathname != '/terms.html' || window.location.pathname != '/ru/terms.html' || window.location.pathname != '/pt/terms.html'){
                    $.ajax({
                        url: "/hr/public/getUserLocation",
                        type: "GET",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        //beforeSend: function (xhr) {
                        //
                        //},
                        complete: function(resp){
                            $.each(isoCountries, function(index, value) {
                                if(resp.responseJSON.countryCode != undefined && resp.responseJSON.countryCode == value.id){
                                    if(window.location.pathname == '/signup.html' || window.location.pathname == '/ru/signup.html' || window.location.pathname == '/pt/signup.html'){
                                        //fb
                                        $('#signupFacebookForm').find('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\s*/g,"").replace(/,/g,"")+"</span>";
                                        $('#signupFacebookForm').find('.select2-selection__rendered')[0].title =  value.text;
                                        //end fb
                                        //google
                                        $('#signupGoogleForm').find('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\s*/g,"").replace(/,/g,"")+"</span>";
                                        $('#signupGoogleForm').find('.select2-selection__rendered')[0].title =  value.text;
                                        //end google
                                    }
                                    //our project
                                    $('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\-*\s*/g,"").replace(/,/g,"").replace(/'/g,"").replace(/&/g,"")+"</span>";
                                    $('.select2-selection__rendered')[0].title = value.text;
                                    //end our project
                                    $($('.select2-selection--single')).css('border','2px solid #61B452');
                                    var country = $('input[name=country]');
                                    country.val(value.text);
                                    var phone = $('.countryCustom');
                                    phone.value = value.value.replace("+","");
                                    localStorage.setItem("phone",  phone.value);
                                }
                            });
                        }
                    });
                }
                $("[name='countryCustom']").select2({
                    placeholder: "Select a country",
                    templateResult: formatCountry,
                    templateSelection: format,
                    data: isoCountries
                });
            });

            if (res.email === '') {
                xhr.abort();
                $('#ex1_mail').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }
            if (!mailPattern.test(res.email)) {
                xhr.abort();
                $('#ex1_mail').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }

            if (res.firstName === '') {
                xhr.abort();
                $('#ex1_firstName').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }

            if (res.lastName === '') {
                xhr.abort();
                $('#ex1_lastName').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }

            if(res.phone.length > 18) {
                xhr.abort();
                redBorder('ex1_number');
                if(localStorage.getItem("NG_TRANSLATE_LANG_KEY") == 'en'){
                    $('.error-phone').html('Your phone number should be up to 15 digits');
                }else{
                    $('.error-phone').html('Вы можете ввести не более 15 символов');
                }
            }else{
                $('.error-phone').addClass('hidden');
            }

            if ($('#ex1_number').val() === '') {
                xhr.abort();
                $('#ex1_number').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }
            if (res.companyName === '') {
                xhr.abort();
                $('#ex1_orgName').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }
            if (res.numberOfRecruiters === '') {
                xhr.abort();
                $('#ex1_usersCount').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }
            if (res.numberOfVacancies === '') {
                xhr.abort();
                $('#ex1_averageNum').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }
            if (res.country === '') {
                xhr.abort();
                $('#ex1_country').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }
            function contains(value , signs , id , callback) {
                if(typeof(value) !== "string") {
                    value = String(value);
                }
                value = value.split('');
                signs = signs.split('');

                var checked = value.filter(function(letter){
                    var errorSign = signs.filter(function(sign){
                        return String(letter) === String(sign);
                    });
                    if(errorSign.length) {
                        return errorSign;
                    }
                });

                if(!!checked[0]) {
                    callback(id);
                }
                return !!checked[0];
            }

            function redBorder(id) {
                xhr.abort();
                $('#' + id).css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
                $('.error-phone').removeClass('hidden');
            }
        },
        complete: function(){
            $($('.select2-selection--single')).css('border','2px solid #61B452');
            $("#need-demo-modal").modal('hide');
            $("#thanks-modal").modal('show');
            $("#ex1_firstName").val('');
            $("#ex1_lastName").val('');
            $("#ex1_skype").val('');
            $("#ex1_number").val('');
            $("#ex1_mail").val('');
            $("#ex1_orgName").val('');
            $("#ex1_usersCount").val('');
            $("#ex1_averageNum").val('');
            $("#ex1_soft").val('');
            $("#ex1_keyRequirements").val('');
            $('.nameForm').css('display', 'none');
            $('.phoneForm').css('display', 'none');
            $('.emailForm').css('display', 'none');
            $('.companyForm').css('display', 'none');
            $('.usersCountForm').css('display', 'none');
            $('.softForm').css('display', 'none');
            $('.numberVacancyForm').css('display', 'none');
            $('.usersCountForm').css('display', 'none');
            $('.keyRequirementsForm').css('display', 'none');
            //$('#contact').slideUp('slow');
            //$('.tyMessageQuestion').delay(800).fadeIn();
        },
        error: function (data) {
            localStorage.removeItem('phone');
        }
    });
});

$('#askQuestionSubmit2').on('click',function(e){
    console.log('on ask quest');
    var res = $("#questionForm-index").serializeObject();
    localStorage.removeItem('phone');
    var string = res.country;
    if(string == 'null' || string == null || string == undefined){
        res.country = 'Afghanistan';
    }else{
        res.country = string.replace(/\d+/g, "").replace("(","").replace(")","").replace(" +","");
    }
    console.log($('.select2-selection__rendered')[0].title.replace(/[A-z]/g, "").replace(/\(*\)*\.*\s*/g,"").replace(/,/g,""));
    console.log(localStorage.getItem('phone'));
    if(localStorage.getItem('phone') == null){
        res.phone = $('.select2-selection__rendered')[0].title.replace(/[A-z]/g, "").replace(/\(*\)*\+*\+*\.*\s*/g,"").replace(/,/g,"") + res.phone;
    }else{
        res.phone = $(".countryCustom").text(localStorage.getItem('phone').replace(/-/g,"") + res.phone)[0].textContent;
    }
    delete res.countryCustom;
    console.log(res);
    $('#ex1_mail, #ex1_skype, #ex1_firstName, #ex1_lastName, #ex1_number, #ex1_orgName, #ex1_usersCount, #ex1_averageNum').css({
        "box-shadow":"none",
        "border":"1px solid #E5E5E6"
    });
    if(!res.intention) {
        res.intention = 'Request demo';
    }
    $.ajax({
        url: "/hr/public/newLead",
        type: "POST",
        data: JSON.stringify(res),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function (xhr) {
            console.log(res);

            contains(res.firstName , '!"№;%:?*()+#$^&*@1234567890' , 'ex1_firstName' , redBorder);
            contains(res.lastName , '!"№;%:?*()+#$^&*@1234567890' , 'ex1_lastName' , redBorder);
            contains(res.email , '!"№;%:?*()+#$^&*' , 'ex1_mail' , redBorder);
            contains(res.phone , '!"№;%:?*()#$^&*@_' , 'ex1_number' , redBorder);
            contains(res.companyName , '' , '#ex1_orgName' , redBorder);

            $(function() {
                var isoCountries = [
                    { id: 'AF', text: 'Afghanistan (+93)', value: '+93'},
                    { id: 'AX', text: 'Aland Islands (+358)', value: '+358'},
                    { id: 'AL', text: 'Albania (+355)', value: '+355'},
                    { id: 'DZ', text: 'Algeria (+213)', value: '+213'},
                    { id: 'AS', text: 'American Samoa (+1)', value: '+1'},
                    { id: 'AD', text: 'Andorra (+376)', value: '+376'},
                    { id: 'AO', text: 'Angola (+244)', value: '+244'},
                    { id: 'AI', text: 'Anguilla (+1264)', value: '+1264'},
                    { id: 'AQ', text: 'Antarctica (+672)', value: '+672'},
                    { id: 'AG', text: 'Antigua And Barbuda (+1268)', value: '+1268'},
                    { id: 'AR', text: 'Argentina (+54)', value: '+54'},
                    { id: 'AM', text: 'Armenia (+374)', value: '+374'},
                    { id: 'AW', text: 'Aruba (+297)', value: '+297'},
                    { id: 'AU', text: 'Australia (+61)', value: '+61'},
                    { id: 'AT', text: 'Austria (+43)', value: '+43'},
                    { id: 'AZ', text: 'Azerbaijan (+994)', value: '+994'},
                    { id: 'BS', text: 'Bahamas (+1242)', value: '+1242'},
                    { id: 'BH', text: 'Bahrain (+973)', value: '+973'},
                    { id: 'BD', text: 'Bangladesh (+880)', value: '+880'},
                    { id: 'BB', text: 'Barbados (+1246)', value: '+1246'},
                    { id: 'BY', text: 'Belarus (+375)', value: '+375'},
                    { id: 'BE', text: 'Belgium (+32)', value: '+32'},
                    { id: 'BZ', text: 'Belize (+501)', value: '+501'},
                    { id: 'BJ', text: 'Benin (+229)', value: '+229'},
                    { id: 'BM', text: 'Bermuda (+1441)', value: '+1441'},
                    { id: 'BT', text: 'Bhutan (+975)', value: '+975'},
                    { id: 'BO', text: 'Bolivia (+591)', value: '+591'},
                    { id: 'BA', text: 'Bosnia And Herzegovina (+387)', value: '+387'},
                    { id: 'BW', text: 'Botswana (+267)', value: '+267'},
                    { id: 'BV', text: 'Bouvet Island (+47)', value: '+47'},
                    { id: 'BR', text: 'Brazil (+55)', value: '+55'},
                    { id: 'IO', text: 'British Indian Ocean Territory (+246)', value: '+246'},
                    { id: 'BN', text: 'Brunei Darussalam (+673)', value: '+673'},
                    { id: 'BG', text: 'Bulgaria (+359)', value: '+359'},
                    { id: 'BF', text: 'Burkina Faso (+226)', value: '+226'},
                    { id: 'BI', text: 'Burundi (+257)', value: '+257'},
                    { id: 'KH', text: 'Cambodia (+855)', value: '+855'},
                    { id: 'CM', text: 'Cameroon (+237)', value: '+237'},
                    { id: 'CA', text: 'Canada (+1)', value: '+1'},
                    { id: 'CV', text: 'Cape Verde Islands (+238)', value: '+238'},
                    { id: 'KY', text: 'Cayman Islands (+1345)', value: '+1345'},
                    { id: 'CF', text: 'Central African Republic (+236)', value: '+236'},
                    { id: 'TD', text: 'Chad (+235)', value: '+235'},
                    { id: 'CL', text: 'Chile (+56)', value: '+56'},
                    { id: 'CN', text: 'China (+86)', value: '+86'},
                    { id: 'CX', text: 'Christmas Island (+672)', value: '+672'},
                    { id: 'CC', text: 'Cocos (Keeling) Islands (+225)', value: '+225'},
                    { id: 'CO', text: 'Colombia (+57)', value: '+57'},
                    { id: 'KM', text: 'Comoros (+269)', value: '+269'},
                    { id: 'CG', text: 'Congo (+242)', value: '+242'},
                    { id: 'CD', text: 'Congo, Democratic Republic (+243)', value: '+243'},
                    { id: 'CK', text: 'Cook Islands (+682)', value: '+682'},
                    { id: 'CR', text: 'Costa Rica (+506)', value: '+506'},
                    { id: 'CI', text: 'Cote D\'Ivoire (+225)', value: '+225'},
                    { id: 'HR', text: 'Croatia (+385)', value: '+385'},
                    { id: 'CU', text: 'Cuba (+53)', value: '+53'},
                    { id: 'CY', text: 'Cyprus (+90)', value: '+90'},
                    { id: 'CZ', text: 'Czech Republic (+420)', value: '+420'},
                    { id: 'DK', text: 'Denmark (+45)', value: '+45'},
                    { id: 'DJ', text: 'Djibouti (+253)', value: '+253'},
                    { id: 'DM', text: 'Dominica (+1809)', value: '+1809'},
                    { id: 'DO', text: 'Dominican Republic (+1809)', value: '+1809'},
                    { id: 'EC', text: 'Ecuador (+593)', value: '+593'},
                    { id: 'EG', text: 'Egypt (+20)', value: '+20'},
                    { id: 'SV', text: 'El Salvador (+503)', value: '+503'},
                    { id: 'GQ', text: 'Equatorial Guinea (+240)', value: '+240'},
                    { id: 'ER', text: 'Eritrea (+291)', value: '+291'},
                    { id: 'EE', text: 'Estonia (+372)', value: '+372'},
                    { id: 'ET', text: 'Ethiopia (+251)', value: '+251'},
                    { id: 'FK', text: 'Falkland Islands (Malvinas) (+500)', value: '+500'},
                    { id: 'FO', text: 'Faroe Islands (+298)', value: '+298'},
                    { id: 'FJ', text: 'Fiji (+679)', value: '+679'},
                    { id: 'FI', text: 'Finland (+358)', value: '+358'},
                    { id: 'FR', text: 'France (+33)', value: '+33'},
                    { id: 'GF', text: 'French Guiana (+594)', value: '+594'},
                    { id: 'PF', text: 'French Polynesia (+689)', value: '+689'},
                    { id: 'TF', text: 'French Southern Territories (+689)', value: '+689'},
                    { id: 'GA', text: 'Gabon (+241)', value: '+241'},
                    { id: 'GM', text: 'Gambia (+220)', value: '+220'},
                    { id: 'GE', text: 'Georgia (+7880)', value: '+7880'},
                    { id: 'DE', text: 'Germany (+49)', value: '+49'},
                    { id: 'GH', text: 'Ghana (+233)', value: '+233'},
                    { id: 'GI', text: 'Gibraltar (+350)', value: '+350'},
                    { id: 'GR', text: 'Greece (+30)', value: '+30'},
                    { id: 'GL', text: 'Greenland (+299)', value: '+299'},
                    { id: 'GD', text: 'Grenada (+1473)', value: '+1473'},
                    { id: 'GP', text: 'Guadeloupe (+590)', value: '+590'},
                    { id: 'GU', text: 'Guam (+671)', value: '+671'},
                    { id: 'GT', text: 'Guatemala (+502)', value: '+502'},
                    { id: 'GG', text: 'Guernsey (+44)', value: '+44'},
                    { id: 'GN', text: 'Guinea (+224)', value: '+224'},
                    { id: 'GW', text: 'Guinea-Bissau (+245)', value: '+245'},
                    { id: 'GY', text: 'Guyana (+592)', value: '+592'},
                    { id: 'HT', text: 'Haiti (+509)', value: '+509'},
                    { id: 'HM', text: 'Heard Island & Mcdonald Islands (+61)', value: '+61'},
                    { id: 'VA', text: 'Holy See (Vatican City State) (+39)', value: '+39'},
                    { id: 'HN', text: 'Honduras (+504)', value: '+504'},
                    { id: 'HK', text: 'Hong Kong (+852)', value: '+852'},
                    { id: 'HU', text: 'Hungary (+36)', value: '+36'},
                    { id: 'IS', text: 'Iceland (+354)', value: '+354'},
                    { id: 'IN', text: 'India(+91)', value: '+91'},
                    { id: 'ID', text: 'Indonesia (+62)', value: '+62'},
                    { id: 'IR', text: 'Iran, Islamic Republic Of (+98)', value: '+98'},
                    { id: 'IQ', text: 'Iraq (+964)', value: '+964'},
                    { id: 'IE', text: 'Ireland (+353)', value: '+353'},
                    { id: 'IM', text: 'Isle Of Man (+44)', value: '+44'},
                    { id: 'IL', text: 'Israel (+972)', value: '+975'},
                    { id: 'IT', text: 'Italy (+39)', value: '+39'},
                    { id: 'JM', text: 'Jamaica (+1876)', value: '+1876'},
                    { id: 'JP', text: 'Japan (+81)', value: '+81'},
                    { id: 'JE', text: 'Jersey (+44-1534)', value: '+44-1534'},
                    { id: 'JO', text: 'Jordan (+962)', value: '+962'},
                    { id: 'KZ', text: 'Kazakhstan (+7)', value: '+7'},
                    { id: 'KE', text: 'Kenya (+254)', value: '+254'},
                    { id: 'KI', text: 'Kiribati (+686)', value: '+686'},
                    { id: 'KP', text: 'Korea - North (+850)', value: '+850'},
                    { id: 'KR', text: 'Korea - South (+82)', value: '+82'},
                    { id: 'KW', text: 'Kuwait (+965)', value: '+965'},
                    { id: 'KG', text: 'Kyrgyzstan (+996)', value: '+996'},
                    { id: 'LA', text: 'Lao People\'s Democratic Republic (+856)', value: '+856'},
                    { id: 'LV', text: 'Latvia (+371)', value: '+371'},
                    { id: 'LB', text: 'Lebanon (+961)', value: '+961'},
                    { id: 'LS', text: 'Lesotho (+266)', value: '+266'},
                    { id: 'LR', text: 'Liberia (+231)', value: '+231'},
                    { id: 'LY', text: 'Libyan Arab Jamahiriya (+218)', value: '+218'},
                    { id: 'LI', text: 'Liechtenstein (+417)', value: '+417'},
                    { id: 'LT', text: 'Lithuania (+370)', value: '+370'},
                    { id: 'LU', text: 'Luxembourg (+352)', value: '+352'},
                    { id: 'MO', text: 'Macao (+853)', value: '+853'},
                    { id: 'MK', text: 'Macedonia (+389)', value: '+389'},
                    { id: 'MG', text: 'Madagascar (+261)', value: '+261'},
                    { id: 'MW', text: 'Malawi (+265)', value: '+265'},
                    { id: 'MY', text: 'Malaysia (+60)', value: '+60'},
                    { id: 'MV', text: 'Maldives (+960)', value: '+960'},
                    { id: 'ML', text: 'Mali (+223)', value: '+223'},
                    { id: 'MT', text: 'Malta (+356)', value: '+356'},
                    { id: 'MH', text: 'Marshall Islands (+692)', value: '+692'},
                    { id: 'MQ', text: 'Martinique (+596)', value: '+596'},
                    { id: 'MR', text: 'Mauritania (+222)', value: '+222'},
                    { id: 'MU', text: 'Mauritius (+230)', value: '+230'},
                    { id: 'YT', text: 'Mayotte (+269)', value: '+269'},
                    { id: 'MX', text: 'Mexico (+52)', value: '+52'},
                    { id: 'FM', text: 'Micronesia, Federated States Of (+691)', value: '+691'},
                    { id: 'MD', text: 'Moldova (+373)', value: '+373'},
                    { id: 'MC', text: 'Monaco (+377)', value: '+377'},
                    { id: 'MN', text: 'Mongolia (+976)', value: '+976'},
                    { id: 'ME', text: 'Montenegro (+382)', value: '+382'},
                    { id: 'MS', text: 'Montserrat (+1664)', value: '+1664'},
                    { id: 'MA', text: 'Morocco (+212)', value: '+212'},
                    { id: 'MZ', text: 'Mozambique (+258)', value: '+258'},
                    { id: 'MM', text: 'Myanmar (+95)', value: '+95'},
                    { id: 'NA', text: 'Namibia (+264)', value: '+264'},
                    { id: 'NR', text: 'Nauru (+674)', value: '+674'},
                    { id: 'NP', text: 'Nepal (+977)', value: '+977'},
                    { id: 'NL', text: 'Netherlands (+31)', value: '+31'},
                    { id: 'AN', text: 'Netherlands Antilles (+599)', value: '+599'},
                    { id: 'NC', text: 'New Caledonia (+687)', value: '+687'},
                    { id: 'NZ', text: 'New Zealand (+64)', value: '+64'},
                    { id: 'NI', text: 'Nicaragua (+505)', value: '+505'},
                    { id: 'NE', text: 'Niger (+227)', value: '+227'},
                    { id: 'NG', text: 'Nigeria (+234)', value: '+234'},
                    { id: 'NU', text: 'Niue (+683)', value: '+683'},
                    { id: 'NF', text: 'Norfolk Island (+672)', value: '+672'},
                    { id: 'MP', text: 'Northern Mariana Islands (+670)', value: '+670'},
                    { id: 'NO', text: 'Norway (+47)', value: '+47'},
                    { id: 'OM', text: 'Oman (+968)', value: '+968'},
                    { id: 'PK', text: 'Pakistan (+92)', value: '+92'},
                    { id: 'PW', text: 'Palau (+680)', value: '+680'},
                    { id: 'PS', text: 'Palestinian Territory (+970)', value: '+970'},
                    { id: 'PA', text: 'Panama (+507)', value: '+507'},
                    { id: 'PG', text: 'Papua New Guinea (+675)', value: '+675'},
                    { id: 'PY', text: 'Paraguay (+595)', value: '+595'},
                    { id: 'PE', text: 'Peru (+51)', value: '+51'},
                    { id: 'PH', text: 'Philippines (+63)', value: '+63'},
                    { id: 'PN', text: 'Pitcairn (+64)', value: '+64'},
                    { id: 'PL', text: 'Poland (+48)', value: '+48'},
                    { id: 'PT', text: 'Portugal (+351)', value: '+351'},
                    { id: 'PR', text: 'Puerto Rico (+1787)', value: '+1787'},
                    { id: 'QA', text: 'Qatar (+974)', value: '+974'},
                    { id: 'RE', text: 'Reunion (+262)', value: '+262'},
                    { id: 'RO', text: 'Romania (+40)', value: '+40'},
                    { id: 'RU', text: 'Russian Federation (+7)', value: '+7'},
                    { id: 'RW', text: 'Rwanda (+250)', value: '+250'},
                    { id: 'BL', text: 'Saint Barthelemy (+590)', value: '+590'},
                    { id: 'SH', text: 'Saint Helena (+290)', value: '+94'},
                    { id: 'KN', text: 'Saint Kitts And Nevis (+1869)', value: '+94'},
                    { id: 'LC', text: 'Saint Lucia (+1758)', value: '+94'},
                    { id: 'MF', text: 'Saint Martin (+590)', value: '+590'},
                    { id: 'PM', text: 'Saint Pierre And Miquelon (+508)', value: '+508'},
                    { id: 'VC', text: 'Saint Vincent And Grenadines (+1-784)', value: '+1-784'},
                    { id: 'WS', text: 'Samoa (+685)', value: '+685'},
                    { id: 'SM', text: 'San Marino (+378)', value: '+378'},
                    { id: 'ST', text: 'Sao Tome And Principe (+239)', value: '+239'},
                    { id: 'SA', text: 'Saudi Arabia (+966)', value: '+966'},
                    { id: 'SN', text: 'Senegal (+221)', value: '+221'},
                    { id: 'RS', text: 'Serbia (+381)', value: '+381'},
                    { id: 'SC', text: 'Seychelles (+248)', value: '+248'},
                    { id: 'SL', text: 'Sierra Leone (+232)', value: '+232'},
                    { id: 'SG', text: 'Singapore (+65)', value: '+65'},
                    { id: 'SK', text: 'Slovakia (+421)', value: '+421'},
                    { id: 'SI', text: 'Slovenia (+386)', value: '+386'},
                    { id: 'SB', text: 'Solomon Islands (+677)', value: '+677'},
                    { id: 'SO', text: 'Somalia (+252)', value: '+252'},
                    { id: 'ZA', text: 'South Africa (+27)', value: '+27'},
                    { id: 'GS', text: 'South Georgia And Sandwich Isl. (+500)', value: '+500'},
                    { id: 'ES', text: 'Spain (+34)', value: '+34'},
                    { id: 'LK', text: 'Sri Lanka (+94)', value: '+94'},
                    { id: 'SD', text: 'Sudan (+249)', value: '+249'},
                    { id: 'SR', text: 'Suriname (+597)', value: '+597'},
                    { id: 'SJ', text: 'Svalbard And Jan Mayen (+47)', value: '+47'},
                    { id: 'SZ', text: 'Swaziland (+268)', value: '+268'},
                    { id: 'SE', text: 'Sweden (+46)', value: '+46'},
                    { id: 'CH', text: 'Switzerland (+41)', value: '+41'},
                    { id: 'SY', text: 'Syrian Arab Republic (+963)', value: '+963'},
                    { id: 'TW', text: 'Taiwan (+886)', value: '+886'},
                    { id: 'TJ', text: 'Tajikistan (+992)', value: '+992'},
                    { id: 'TZ', text: 'Tanzania (+255)', value: '+255'},
                    { id: 'TH', text: 'Thailand (+66)', value: '+66'},
                    { id: 'TL', text: 'Timor-Leste (+670)', value: '+670'},
                    { id: 'TG', text: 'Togo (+228)', value: '+228'},
                    { id: 'TK', text: 'Tokelau (+690)', value: '+690'},
                    { id: 'TO', text: 'Tonga (+676)', value: '+676'},
                    { id: 'TT', text: 'Trinidad And Tobago (+1868)', value: '+1868'},
                    { id: 'TN', text: 'Tunisia (+216)', value: '+216'},
                    { id: 'TR', text: 'Turkey (+90)', value: '+90'},
                    { id: 'TM', text: 'Turkmenistan (+993)', value: '+993'},
                    { id: 'TC', text: 'Turks And Caicos Islands (+1649)', value: '+1649'},
                    { id: 'TV', text: 'Tuvalu (+688)', value: '+668'},
                    { id: 'UG', text: 'Uganda (+256)', value: '+256'},
                    { id: 'UA', text: 'Ukraine (+380)', value: '+380'},
                    { id: 'AE', text: 'United Arab Emirates (+971)', value: '+971'},
                    { id: 'GB', text: 'United Kingdom (+44)', value: '+44'},
                    { id: 'US', text: 'United States (+1)', value: '+1'},
                    { id: 'UM', text: 'United States Outlying Islands (+1-340)', value: '+1-340'},
                    { id: 'UY', text: 'Uruguay (+598)', value: '+598'},
                    { id: 'UZ', text: 'Uzbekistan (+998)', value: '+998'},
                    { id: 'VU', text: 'Vanuatu (+678)', value: '+678'},
                    { id: 'VE', text: 'Venezuela (+58)', value: '+58'},
                    { id: 'VN', text: 'Vietnam (+84)', value: '+84'},
                    { id: 'VG', text: 'Virgin Islands, British (+1)', value: '+1'},
                    { id: 'VI', text: 'Virgin Islands, U.S. (+1)', value: '+1'},
                    { id: 'WF', text: 'Wallis And Futuna (+681)', value: '+681'},
                    { id: 'EH', text: 'Western Sahara (+212)', value: '+212'},
                    { id: 'YE', text: 'Yemen (North)(+969)', value: '+969'},
                    { id: 'YE', text: 'Yemen (South)(+967)', value: '+967'},
                    { id: 'ZM', text: 'Zambia (+260)', value: '+260'},
                    { id: 'ZW', text: 'Zimbabwe (+263)', value: '+263'}
                ];
                function formatCountry (country) {
                    if (!country.id) { return country.text; }
                    var $country = $(
                        '<span class="flag-icon flag-icon-'+ country.id.toLowerCase() +' flag-icon-squared"></span>' +
                        '<span class="flag-text" style="margin-left: 5px;">'+ country.text+"</span>"
                    );
                    return $country;
                }
                function format(state) {
                    if(state.selected == true){
                        var country = $('input[name=country]');
                        country.val(state.text);
                        if(state.value != undefined){
                            var phone = state.value.replace("+","");
                            localStorage.setItem("phone", phone);
                        }
                    }
                    if (!state.id) return state.text;
                    var $state = $(
                        '<span class="flag-icon flag-icon-'+ state.id.toLowerCase() +' flag-icon-squared"></span>' +
                        '<span class="flag-text" style="margin-left: 5px;">'+ state.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\-*\s*/g,"").replace(/,/g,"").replace(/'/g,"").replace(/&/g,"") +"</span>");
                    return $state;
                }
                if(window.location.pathname != '/signin.html' || window.location.pathname != '/ru/signin.html' || window.location.pathname != '/pt/signin.html' ||
                    window.location.pathname != '/why.html' || window.location.pathname != '/ru/why.html' || window.location.pathname != '/pt/why.html' ||
                    window.location.pathname != '/terms.html' || window.location.pathname != '/ru/terms.html' || window.location.pathname != '/pt/terms.html'){
                    $.ajax({
                        url: "/hr/public/getUserLocation",
                        type: "GET",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        //beforeSend: function (xhr) {
                        //
                        //},
                        complete: function(resp){
                            $.each(isoCountries, function(index, value) {
                                if(resp.responseJSON.countryCode != undefined && resp.responseJSON.countryCode == value.id){
                                    if(window.location.pathname == '/signup.html' || window.location.pathname == '/ru/signup.html' || window.location.pathname == '/pt/signup.html'){
                                        //fb
                                        $('#signupFacebookForm').find('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\s*/g,"").replace(/,/g,"")+"</span>";
                                        $('#signupFacebookForm').find('.select2-selection__rendered')[0].title =  value.text;
                                        //end fb
                                        //google
                                        $('#signupGoogleForm').find('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\s*/g,"").replace(/,/g,"")+"</span>";
                                        $('#signupGoogleForm').find('.select2-selection__rendered')[0].title =  value.text;
                                        //end google
                                    }
                                    //our project
                                    $('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\-*\s*/g,"").replace(/,/g,"").replace(/'/g,"").replace(/&/g,"")+"</span>";
                                    $('.select2-selection__rendered')[0].title = value.text;
                                    //end our project
                                    $($('.select2-selection--single')).css('border','2px solid #61B452');
                                    var country = $('input[name=country]');
                                    country.val(value.text);
                                    var phone = $('.countryCustom');
                                    phone.value = value.value.replace("+","");
                                    localStorage.setItem("phone",  phone.value);
                                }
                            });
                        }
                    });
                }
                $("[name='countryCustom']").select2({
                    placeholder: "Select a country",
                    templateResult: formatCountry,
                    templateSelection: format,
                    data: isoCountries
                });
            });

          if (res.email === '') {
                xhr.abort();
                $('#ex1_mail').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }
            if (!mailPattern.test(res.email)) {
                xhr.abort();
                $('#ex1_mail').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }

            if (res.firstName === '') {
                xhr.abort();
                $('#ex1_firstName').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }

            if (res.lastName === '') {
                xhr.abort();
                $('#ex1_lastName').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }

            if(res.phone.length > 18) {
              xhr.abort();
              redBorder('ex1_number');
                console.log(localStorage.getItem("NG_TRANSLATE_LANG_KEY"));
              if(localStorage.getItem("NG_TRANSLATE_LANG_KEY") == 'en'){
                  $('.error-phone').html('Your phone number should be up to 15 digits');
              }else{
                  $('.error-phone').html('Вы можете ввести не более 15 символов');
              }
            }else{
                $('.error-phone').addClass('hidden');
            }

            if ($('#ex1_number').val() === '') {
                xhr.abort();
                $('#ex1_number').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }
            if (res.companyName === '') {
                xhr.abort();
                $('#ex1_orgName').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }
            if (res.numberOfRecruiters === '') {
                xhr.abort();
                $('#ex1_usersCount').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }
            if (res.numberOfVacancies === '') {
                xhr.abort();
                $('#ex1_averageNum').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }
            function contains(value , signs , id , callback) {
              if(typeof(value) !== "string") {
                value = String(value);
              }
              value = value.split('');
              signs = signs.split('');

              var checked = value.filter(function(letter){
                var errorSign = signs.filter(function(sign){
                  return String(letter) === String(sign);
                });
                if(errorSign.length) {
                  return errorSign;
                }
              });

              if(!!checked[0]) {
                callback(id);
              }
              return !!checked[0];
            }

            function redBorder(id) {
              xhr.abort();
              $('#' + id).css({
                "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                "border":"1px solid rgb(245, 19, 19)"
              });
              $('.error-phone').removeClass('hidden');
            }
        },
        complete: function(){
            $($('.select2-selection--single')).css('border','2px solid #61B452');
            $("#need-demo-modal").modal('hide');
            $("#thanks-modal").modal('show');
            $("#ex1_firstName").val('');
            $("#ex1_lastName").val('');
            $("#ex1_skype").val('');
            $("#ex1_number").val('');
            $("#ex1_mail").val('');
            $("#ex1_orgName").val('');
            $("#ex1_usersCount").val('');
            $("#ex1_averageNum").val('');
            $("#ex1_soft").val('');
            $("#ex1_keyRequirements").val('');
            $('.nameForm').css('display', 'none');
            $('.phoneForm').css('display', 'none');
            $('.emailForm').css('display', 'none');
            $('.companyForm').css('display', 'none');
            $('.usersCountForm').css('display', 'none');
            $('.softForm').css('display', 'none');
            $('.numberVacancyForm').css('display', 'none');
            $('.keyRequirementsForm').css('display', 'none');
            try {
                if (document.domain === 'cleverstaff.net') fbq('track', 'Schedule a demo');
            } catch(err) {
                console.error("Facebook Pixel" ,err);
            }
            //$('#contact').slideUp('slow');
            //$('.tyMessageQuestion').delay(800).fadeIn();
        },
        error: function (data) {
            localStorage.removeItem('phone');
        }
    });
});

$('#askQuestionSubmit3').on('click',function(e){
  var res = $("#questionForm-index").serializeObject();
    var string = res.country;
    if(string == 'null' || string == null || string == undefined){
        res.country = 'Afghanistan';
    }else{
        res.country = string.replace(/\d+/g, "").replace("(","").replace(")","").replace(" +","");
    }
    if(localStorage.getItem('phone') == null){
        res.phone = $('.select2-selection__rendered')[0].title.replace(/[A-z]/g, "").replace(/\(*\)*\+*\.*\s*/g,"").replace(/,/g,"") + res.phone;
    }else{
        res.phone = $(".countryCustom").text(localStorage.getItem('phone').replace(/-/g,"") + res.phone)[0].textContent;
    }
    delete res.countryCustom;
  $('#ex1_mail, #ex1_skype, #ex1_firstName, #ex1_lastName, #ex1_number, #ex1_orgName, #ex1_usersCount, #ex1_averageNum').css({
    "box-shadow":"none",
    "border":"1px solid #E5E5E6"
  });
    if(!res.intention) {
        res.intention = 'Request demo';
    }
  $.ajax({
    url: "/hr/public/newLead",
    type: "POST",
    data: JSON.stringify(res),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    beforeSend: function (xhr) {

      function contains(value , signs , id , callback) {
        if(typeof(value) !== "string") {
          value = String(value);
        }
        value = value.split('');
        signs = signs.split('');

        var checked = value.filter(function(letter){
          var errorSign = signs.filter(function(sign){
            return String(letter) === String(sign);
          });
          if(errorSign.length) {
            return errorSign;
          }
        });

        if(!!checked[0]) {
          callback(id);
        }
        return !!checked[0];
      }

      function redBorder(id) {
        xhr.abort();
        $('#' + id).css({
          "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
          "border":"1px solid rgb(245, 19, 19)"
        });
        $('.error-phone').removeClass('hidden');
      }

      contains(res.firstName , '!"№;%:?*()+#$^&*@1234567890' , 'ex1_firstName' , redBorder);
      contains(res.lastName , '!"№;%:?*()+#$^&*@1234567890' , 'ex1_lastName' , redBorder);
      contains(res.email , '!"№;%:?*()+#$^&*' , 'ex1_mail' , redBorder);
      contains(res.phone , '!"№;%:?*()#$^&*@_' , 'ex1_number' , redBorder);
      contains(res.companyName , '' , '#ex1_orgName' , redBorder);

      console.log(res);
        $(function() {
            var isoCountries = [
                { id: 'AF', text: 'Afghanistan (+93)', value: '+93'},
                { id: 'AX', text: 'Aland Islands (+358)', value: '+358'},
                { id: 'AL', text: 'Albania (+355)', value: '+355'},
                { id: 'DZ', text: 'Algeria (+213)', value: '+213'},
                { id: 'AS', text: 'American Samoa (+1)', value: '+1'},
                { id: 'AD', text: 'Andorra (+376)', value: '+376'},
                { id: 'AO', text: 'Angola (+244)', value: '+244'},
                { id: 'AI', text: 'Anguilla (+1264)', value: '+1264'},
                { id: 'AQ', text: 'Antarctica (+672)', value: '+672'},
                { id: 'AG', text: 'Antigua And Barbuda (+1268)', value: '+1268'},
                { id: 'AR', text: 'Argentina (+54)', value: '+54'},
                { id: 'AM', text: 'Armenia (+374)', value: '+374'},
                { id: 'AW', text: 'Aruba (+297)', value: '+297'},
                { id: 'AU', text: 'Australia (+61)', value: '+61'},
                { id: 'AT', text: 'Austria (+43)', value: '+43'},
                { id: 'AZ', text: 'Azerbaijan (+994)', value: '+994'},
                { id: 'BS', text: 'Bahamas (+1242)', value: '+1242'},
                { id: 'BH', text: 'Bahrain (+973)', value: '+973'},
                { id: 'BD', text: 'Bangladesh (+880)', value: '+880'},
                { id: 'BB', text: 'Barbados (+1246)', value: '+1246'},
                { id: 'BY', text: 'Belarus (+375)', value: '+375'},
                { id: 'BE', text: 'Belgium (+32)', value: '+32'},
                { id: 'BZ', text: 'Belize (+501)', value: '+501'},
                { id: 'BJ', text: 'Benin (+229)', value: '+229'},
                { id: 'BM', text: 'Bermuda (+1441)', value: '+1441'},
                { id: 'BT', text: 'Bhutan (+975)', value: '+975'},
                { id: 'BO', text: 'Bolivia (+591)', value: '+591'},
                { id: 'BA', text: 'Bosnia And Herzegovina (+387)', value: '+387'},
                { id: 'BW', text: 'Botswana (+267)', value: '+267'},
                { id: 'BV', text: 'Bouvet Island (+47)', value: '+47'},
                { id: 'BR', text: 'Brazil (+55)', value: '+55'},
                { id: 'IO', text: 'British Indian Ocean Territory (+246)', value: '+246'},
                { id: 'BN', text: 'Brunei Darussalam (+673)', value: '+673'},
                { id: 'BG', text: 'Bulgaria (+359)', value: '+359'},
                { id: 'BF', text: 'Burkina Faso (+226)', value: '+226'},
                { id: 'BI', text: 'Burundi (+257)', value: '+257'},
                { id: 'KH', text: 'Cambodia (+855)', value: '+855'},
                { id: 'CM', text: 'Cameroon (+237)', value: '+237'},
                { id: 'CA', text: 'Canada (+1)', value: '+1'},
                { id: 'CV', text: 'Cape Verde Islands (+238)', value: '+238'},
                { id: 'KY', text: 'Cayman Islands (+1345)', value: '+1345'},
                { id: 'CF', text: 'Central African Republic (+236)', value: '+236'},
                { id: 'TD', text: 'Chad (+235)', value: '+235'},
                { id: 'CL', text: 'Chile (+56)', value: '+56'},
                { id: 'CN', text: 'China (+86)', value: '+86'},
                { id: 'CX', text: 'Christmas Island (+672)', value: '+672'},
                { id: 'CC', text: 'Cocos (Keeling) Islands (+225)', value: '+225'},
                { id: 'CO', text: 'Colombia (+57)', value: '+57'},
                { id: 'KM', text: 'Comoros (+269)', value: '+269'},
                { id: 'CG', text: 'Congo (+242)', value: '+242'},
                { id: 'CD', text: 'Congo, Democratic Republic (+243)', value: '+243'},
                { id: 'CK', text: 'Cook Islands (+682)', value: '+682'},
                { id: 'CR', text: 'Costa Rica (+506)', value: '+506'},
                { id: 'CI', text: 'Cote D\'Ivoire (+225)', value: '+225'},
                { id: 'HR', text: 'Croatia (+385)', value: '+385'},
                { id: 'CU', text: 'Cuba (+53)', value: '+53'},
                { id: 'CY', text: 'Cyprus (+90)', value: '+90'},
                { id: 'CZ', text: 'Czech Republic (+420)', value: '+420'},
                { id: 'DK', text: 'Denmark (+45)', value: '+45'},
                { id: 'DJ', text: 'Djibouti (+253)', value: '+253'},
                { id: 'DM', text: 'Dominica (+1809)', value: '+1809'},
                { id: 'DO', text: 'Dominican Republic (+1809)', value: '+1809'},
                { id: 'EC', text: 'Ecuador (+593)', value: '+593'},
                { id: 'EG', text: 'Egypt (+20)', value: '+20'},
                { id: 'SV', text: 'El Salvador (+503)', value: '+503'},
                { id: 'GQ', text: 'Equatorial Guinea (+240)', value: '+240'},
                { id: 'ER', text: 'Eritrea (+291)', value: '+291'},
                { id: 'EE', text: 'Estonia (+372)', value: '+372'},
                { id: 'ET', text: 'Ethiopia (+251)', value: '+251'},
                { id: 'FK', text: 'Falkland Islands (Malvinas) (+500)', value: '+500'},
                { id: 'FO', text: 'Faroe Islands (+298)', value: '+298'},
                { id: 'FJ', text: 'Fiji (+679)', value: '+679'},
                { id: 'FI', text: 'Finland (+358)', value: '+358'},
                { id: 'FR', text: 'France (+33)', value: '+33'},
                { id: 'GF', text: 'French Guiana (+594)', value: '+594'},
                { id: 'PF', text: 'French Polynesia (+689)', value: '+689'},
                { id: 'TF', text: 'French Southern Territories (+689)', value: '+689'},
                { id: 'GA', text: 'Gabon (+241)', value: '+241'},
                { id: 'GM', text: 'Gambia (+220)', value: '+220'},
                { id: 'GE', text: 'Georgia (+7880)', value: '+7880'},
                { id: 'DE', text: 'Germany (+49)', value: '+49'},
                { id: 'GH', text: 'Ghana (+233)', value: '+233'},
                { id: 'GI', text: 'Gibraltar (+350)', value: '+350'},
                { id: 'GR', text: 'Greece (+30)', value: '+30'},
                { id: 'GL', text: 'Greenland (+299)', value: '+299'},
                { id: 'GD', text: 'Grenada (+1473)', value: '+1473'},
                { id: 'GP', text: 'Guadeloupe (+590)', value: '+590'},
                { id: 'GU', text: 'Guam (+671)', value: '+671'},
                { id: 'GT', text: 'Guatemala (+502)', value: '+502'},
                { id: 'GG', text: 'Guernsey (+44)', value: '+44'},
                { id: 'GN', text: 'Guinea (+224)', value: '+224'},
                { id: 'GW', text: 'Guinea-Bissau (+245)', value: '+245'},
                { id: 'GY', text: 'Guyana (+592)', value: '+592'},
                { id: 'HT', text: 'Haiti (+509)', value: '+509'},
                { id: 'HM', text: 'Heard Island & Mcdonald Islands (+61)', value: '+61'},
                { id: 'VA', text: 'Holy See (Vatican City State) (+39)', value: '+39'},
                { id: 'HN', text: 'Honduras (+504)', value: '+504'},
                { id: 'HK', text: 'Hong Kong (+852)', value: '+852'},
                { id: 'HU', text: 'Hungary (+36)', value: '+36'},
                { id: 'IS', text: 'Iceland (+354)', value: '+354'},
                { id: 'IN', text: 'India(+91)', value: '+91'},
                { id: 'ID', text: 'Indonesia (+62)', value: '+62'},
                { id: 'IR', text: 'Iran, Islamic Republic Of (+98)', value: '+98'},
                { id: 'IQ', text: 'Iraq (+964)', value: '+964'},
                { id: 'IE', text: 'Ireland (+353)', value: '+353'},
                { id: 'IM', text: 'Isle Of Man (+44)', value: '+44'},
                { id: 'IL', text: 'Israel (+972)', value: '+975'},
                { id: 'IT', text: 'Italy (+39)', value: '+39'},
                { id: 'JM', text: 'Jamaica (+1876)', value: '+1876'},
                { id: 'JP', text: 'Japan (+81)', value: '+81'},
                { id: 'JE', text: 'Jersey (+44-1534)', value: '+44-1534'},
                { id: 'JO', text: 'Jordan (+962)', value: '+962'},
                { id: 'KZ', text: 'Kazakhstan (+7)', value: '+7'},
                { id: 'KE', text: 'Kenya (+254)', value: '+254'},
                { id: 'KI', text: 'Kiribati (+686)', value: '+686'},
                { id: 'KP', text: 'Korea - North (+850)', value: '+850'},
                { id: 'KR', text: 'Korea - South (+82)', value: '+82'},
                { id: 'KW', text: 'Kuwait (+965)', value: '+965'},
                { id: 'KG', text: 'Kyrgyzstan (+996)', value: '+996'},
                { id: 'LA', text: 'Lao People\'s Democratic Republic (+856)', value: '+856'},
                { id: 'LV', text: 'Latvia (+371)', value: '+371'},
                { id: 'LB', text: 'Lebanon (+961)', value: '+961'},
                { id: 'LS', text: 'Lesotho (+266)', value: '+266'},
                { id: 'LR', text: 'Liberia (+231)', value: '+231'},
                { id: 'LY', text: 'Libyan Arab Jamahiriya (+218)', value: '+218'},
                { id: 'LI', text: 'Liechtenstein (+417)', value: '+417'},
                { id: 'LT', text: 'Lithuania (+370)', value: '+370'},
                { id: 'LU', text: 'Luxembourg (+352)', value: '+352'},
                { id: 'MO', text: 'Macao (+853)', value: '+853'},
                { id: 'MK', text: 'Macedonia (+389)', value: '+389'},
                { id: 'MG', text: 'Madagascar (+261)', value: '+261'},
                { id: 'MW', text: 'Malawi (+265)', value: '+265'},
                { id: 'MY', text: 'Malaysia (+60)', value: '+60'},
                { id: 'MV', text: 'Maldives (+960)', value: '+960'},
                { id: 'ML', text: 'Mali (+223)', value: '+223'},
                { id: 'MT', text: 'Malta (+356)', value: '+356'},
                { id: 'MH', text: 'Marshall Islands (+692)', value: '+692'},
                { id: 'MQ', text: 'Martinique (+596)', value: '+596'},
                { id: 'MR', text: 'Mauritania (+222)', value: '+222'},
                { id: 'MU', text: 'Mauritius (+230)', value: '+230'},
                { id: 'YT', text: 'Mayotte (+269)', value: '+269'},
                { id: 'MX', text: 'Mexico (+52)', value: '+52'},
                { id: 'FM', text: 'Micronesia, Federated States Of (+691)', value: '+691'},
                { id: 'MD', text: 'Moldova (+373)', value: '+373'},
                { id: 'MC', text: 'Monaco (+377)', value: '+377'},
                { id: 'MN', text: 'Mongolia (+976)', value: '+976'},
                { id: 'ME', text: 'Montenegro (+382)', value: '+382'},
                { id: 'MS', text: 'Montserrat (+1664)', value: '+1664'},
                { id: 'MA', text: 'Morocco (+212)', value: '+212'},
                { id: 'MZ', text: 'Mozambique (+258)', value: '+258'},
                { id: 'MM', text: 'Myanmar (+95)', value: '+95'},
                { id: 'NA', text: 'Namibia (+264)', value: '+264'},
                { id: 'NR', text: 'Nauru (+674)', value: '+674'},
                { id: 'NP', text: 'Nepal (+977)', value: '+977'},
                { id: 'NL', text: 'Netherlands (+31)', value: '+31'},
                { id: 'AN', text: 'Netherlands Antilles (+599)', value: '+599'},
                { id: 'NC', text: 'New Caledonia (+687)', value: '+687'},
                { id: 'NZ', text: 'New Zealand (+64)', value: '+64'},
                { id: 'NI', text: 'Nicaragua (+505)', value: '+505'},
                { id: 'NE', text: 'Niger (+227)', value: '+227'},
                { id: 'NG', text: 'Nigeria (+234)', value: '+234'},
                { id: 'NU', text: 'Niue (+683)', value: '+683'},
                { id: 'NF', text: 'Norfolk Island (+672)', value: '+672'},
                { id: 'MP', text: 'Northern Mariana Islands (+670)', value: '+670'},
                { id: 'NO', text: 'Norway (+47)', value: '+47'},
                { id: 'OM', text: 'Oman (+968)', value: '+968'},
                { id: 'PK', text: 'Pakistan (+92)', value: '+92'},
                { id: 'PW', text: 'Palau (+680)', value: '+680'},
                { id: 'PS', text: 'Palestinian Territory (+970)', value: '+970'},
                { id: 'PA', text: 'Panama (+507)', value: '+507'},
                { id: 'PG', text: 'Papua New Guinea (+675)', value: '+675'},
                { id: 'PY', text: 'Paraguay (+595)', value: '+595'},
                { id: 'PE', text: 'Peru (+51)', value: '+51'},
                { id: 'PH', text: 'Philippines (+63)', value: '+63'},
                { id: 'PN', text: 'Pitcairn (+64)', value: '+64'},
                { id: 'PL', text: 'Poland (+48)', value: '+48'},
                { id: 'PT', text: 'Portugal (+351)', value: '+351'},
                { id: 'PR', text: 'Puerto Rico (+1787)', value: '+1787'},
                { id: 'QA', text: 'Qatar (+974)', value: '+974'},
                { id: 'RE', text: 'Reunion (+262)', value: '+262'},
                { id: 'RO', text: 'Romania (+40)', value: '+40'},
                { id: 'RU', text: 'Russian Federation (+7)', value: '+7'},
                { id: 'RW', text: 'Rwanda (+250)', value: '+250'},
                { id: 'BL', text: 'Saint Barthelemy (+590)', value: '+590'},
                { id: 'SH', text: 'Saint Helena (+290)', value: '+94'},
                { id: 'KN', text: 'Saint Kitts And Nevis (+1869)', value: '+94'},
                { id: 'LC', text: 'Saint Lucia (+1758)', value: '+94'},
                { id: 'MF', text: 'Saint Martin (+590)', value: '+590'},
                { id: 'PM', text: 'Saint Pierre And Miquelon (+508)', value: '+508'},
                { id: 'VC', text: 'Saint Vincent And Grenadines (+1-784)', value: '+1-784'},
                { id: 'WS', text: 'Samoa (+685)', value: '+685'},
                { id: 'SM', text: 'San Marino (+378)', value: '+378'},
                { id: 'ST', text: 'Sao Tome And Principe (+239)', value: '+239'},
                { id: 'SA', text: 'Saudi Arabia (+966)', value: '+966'},
                { id: 'SN', text: 'Senegal (+221)', value: '+221'},
                { id: 'RS', text: 'Serbia (+381)', value: '+381'},
                { id: 'SC', text: 'Seychelles (+248)', value: '+248'},
                { id: 'SL', text: 'Sierra Leone (+232)', value: '+232'},
                { id: 'SG', text: 'Singapore (+65)', value: '+65'},
                { id: 'SK', text: 'Slovakia (+421)', value: '+421'},
                { id: 'SI', text: 'Slovenia (+386)', value: '+386'},
                { id: 'SB', text: 'Solomon Islands (+677)', value: '+677'},
                { id: 'SO', text: 'Somalia (+252)', value: '+252'},
                { id: 'ZA', text: 'South Africa (+27)', value: '+27'},
                { id: 'GS', text: 'South Georgia And Sandwich Isl. (+500)', value: '+500'},
                { id: 'ES', text: 'Spain (+34)', value: '+34'},
                { id: 'LK', text: 'Sri Lanka (+94)', value: '+94'},
                { id: 'SD', text: 'Sudan (+249)', value: '+249'},
                { id: 'SR', text: 'Suriname (+597)', value: '+597'},
                { id: 'SJ', text: 'Svalbard And Jan Mayen (+47)', value: '+47'},
                { id: 'SZ', text: 'Swaziland (+268)', value: '+268'},
                { id: 'SE', text: 'Sweden (+46)', value: '+46'},
                { id: 'CH', text: 'Switzerland (+41)', value: '+41'},
                { id: 'SY', text: 'Syrian Arab Republic (+963)', value: '+963'},
                { id: 'TW', text: 'Taiwan (+886)', value: '+886'},
                { id: 'TJ', text: 'Tajikistan (+992)', value: '+992'},
                { id: 'TZ', text: 'Tanzania (+255)', value: '+255'},
                { id: 'TH', text: 'Thailand (+66)', value: '+66'},
                { id: 'TL', text: 'Timor-Leste (+670)', value: '+670'},
                { id: 'TG', text: 'Togo (+228)', value: '+228'},
                { id: 'TK', text: 'Tokelau (+690)', value: '+690'},
                { id: 'TO', text: 'Tonga (+676)', value: '+676'},
                { id: 'TT', text: 'Trinidad And Tobago (+1868)', value: '+1868'},
                { id: 'TN', text: 'Tunisia (+216)', value: '+216'},
                { id: 'TR', text: 'Turkey (+90)', value: '+90'},
                { id: 'TM', text: 'Turkmenistan (+993)', value: '+993'},
                { id: 'TC', text: 'Turks And Caicos Islands (+1649)', value: '+1649'},
                { id: 'TV', text: 'Tuvalu (+688)', value: '+668'},
                { id: 'UG', text: 'Uganda (+256)', value: '+256'},
                { id: 'UA', text: 'Ukraine (+380)', value: '+380'},
                { id: 'AE', text: 'United Arab Emirates (+971)', value: '+971'},
                { id: 'GB', text: 'United Kingdom (+44)', value: '+44'},
                { id: 'US', text: 'United States (+1)', value: '+1'},
                { id: 'UM', text: 'United States Outlying Islands (+1-340)', value: '+1-340'},
                { id: 'UY', text: 'Uruguay (+598)', value: '+598'},
                { id: 'UZ', text: 'Uzbekistan (+998)', value: '+998'},
                { id: 'VU', text: 'Vanuatu (+678)', value: '+678'},
                { id: 'VE', text: 'Venezuela (+58)', value: '+58'},
                { id: 'VN', text: 'Vietnam (+84)', value: '+84'},
                { id: 'VG', text: 'Virgin Islands, British (+1)', value: '+1'},
                { id: 'VI', text: 'Virgin Islands, U.S. (+1)', value: '+1'},
                { id: 'WF', text: 'Wallis And Futuna (+681)', value: '+681'},
                { id: 'EH', text: 'Western Sahara (+212)', value: '+212'},
                { id: 'YE', text: 'Yemen (North)(+969)', value: '+969'},
                { id: 'YE', text: 'Yemen (South)(+967)', value: '+967'},
                { id: 'ZM', text: 'Zambia (+260)', value: '+260'},
                { id: 'ZW', text: 'Zimbabwe (+263)', value: '+263'}
            ];
            function formatCountry (country) {
                if (!country.id) { return country.text; }
                var $country = $(
                    '<span class="flag-icon flag-icon-'+ country.id.toLowerCase() +' flag-icon-squared"></span>' +
                    '<span class="flag-text" style="margin-left: 5px;">'+ country.text+"</span>"
                );
                return $country;
            }
            function format(state) {
                if(state.selected == true){
                    var country = $('input[name=country]');
                    country.val(state.text);
                    if(state.value != undefined){
                        var phone = state.value.replace("+","");
                        localStorage.setItem("phone", phone);
                    }
                }
                if (!state.id) return state.text;
                var $state = $(
                    '<span class="flag-icon flag-icon-'+ state.id.toLowerCase() +' flag-icon-squared"></span>' +
                    '<span class="flag-text" style="margin-left: 5px;">'+ state.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\-*\s*/g,"").replace(/,/g,"").replace(/'/g,"").replace(/&/g,"") +"</span>");
                return $state;
            }
            if(window.location.pathname != '/signin.html' || window.location.pathname != '/ru/signin.html' || window.location.pathname != '/pt/signin.html' ||
                window.location.pathname != '/why.html' || window.location.pathname != '/ru/why.html' || window.location.pathname != '/pt/why.html' ||
                window.location.pathname != '/terms.html' || window.location.pathname != '/ru/terms.html' || window.location.pathname != '/pt/terms.html'){
                $.ajax({
                    url: "/hr/public/getUserLocation",
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    //beforeSend: function (xhr) {
                    //
                    //},
                    complete: function(resp){
                        $.each(isoCountries, function(index, value) {
                            if(resp.responseJSON.countryCode != undefined && resp.responseJSON.countryCode == value.id){
                                if(window.location.pathname == '/signup.html' || window.location.pathname == '/ru/signup.html' || window.location.pathname == '/pt/signup.html'){
                                    //fb
                                    $('#signupFacebookForm').find('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\s*/g,"").replace(/,/g,"")+"</span>";
                                    $('#signupFacebookForm').find('.select2-selection__rendered')[0].title =  value.text;
                                    //end fb
                                    //google
                                    $('#signupGoogleForm').find('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\s*/g,"").replace(/,/g,"")+"</span>";
                                    $('#signupGoogleForm').find('.select2-selection__rendered')[0].title =  value.text;
                                    //end google
                                }
                                //our project
                                $('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\-*\s*/g,"").replace(/,/g,"").replace(/'/g,"").replace(/&/g,"")+"</span>";
                                $('.select2-selection__rendered')[0].title = value.text;
                                //end our project
                                $($('.select2-selection--single')).css('border','2px solid #61B452');
                                var country = $('input[name=country]');
                                country.val(value.text);
                                var phone = $('.countryCustom');
                                phone.value = value.value.replace("+","");
                                localStorage.setItem("phone",  phone.value);
                            }
                        });
                    }
                });
            }
            $("[name='countryCustom']").select2({
                placeholder: "Select a country",
                templateResult: formatCountry,
                templateSelection: format,
                data: isoCountries
            });
        });

      if (res.email === '') {
        xhr.abort();
        $('#ex1_mail').css({
          "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
          "border":"1px solid rgb(245, 19, 19)"
        });
      }
      if (!mailPattern.test(res.email)) {
        xhr.abort();
        $('#ex1_mail').css({
          "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
          "border":"1px solid rgb(245, 19, 19)"
        });
      }

      if (res.firstName === '') {
        xhr.abort();
        $('#ex1_firstName').css({
          "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
          "border":"1px solid rgb(245, 19, 19)"
        });
      }
      if (res.lastName === '') {
          xhr.abort();
          $('#ex1_lastName').css({
              "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
              "border":"1px solid rgb(245, 19, 19)"
          });
      }
      if(res.phone.length > 18) {
        xhr.abort();
        redBorder('ex1_number');
          if(localStorage.getItem("NG_TRANSLATE_LANG_KEY") == 'en'){
              $('.error-phone').html('Your phone number should be up to 15 digits');
          }else{
              $('.error-phone').html('Вы можете ввести не более 15 символов');
          }
      }else{
          $('.error-phone').addClass('hidden');
      }

      if ($('#ex1_number').val()  === '') {
        xhr.abort();
        $('#ex1_number').css({
          "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
          "border":"1px solid rgb(245, 19, 19)"
        });
      }
      if (res.companyName === '') {
        xhr.abort();
        $('#ex1_orgName').css({
          "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
          "border":"1px solid rgb(245, 19, 19)"
        });
      }
      if (res.numberOfRecruiters === '') {
        xhr.abort();
        $('#ex1_usersCount').css({
          "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
          "border":"1px solid rgb(245, 19, 19)"
        });
      }
      if (res.numberOfVacancies === '') {
        xhr.abort();
        $('#ex1_averageNum').css({
          "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
          "border":"1px solid rgb(245, 19, 19)"
        });
      }
    },
    complete: function(){
      $($('.select2-selection--single')).css('border','2px solid #61B452');
      $("#need-demo-modal").modal('hide');
      $("#thanks-modal").modal('show');
      $("#ex1_firstName").val('');
      $("#ex1_lastName").val('');
      $("#ex1_skype").val('');
      $("#ex1_number").val('');
      $("#ex1_mail").val('');
      $("#ex1_orgName").val('');
      $("#ex1_usersCount").val('');
      $("#ex1_averageNum").val('');
      $("#ex1_soft").val('');
      $("#ex1_country").val('');
      $("#ex1_keyRequirements").val('');
      $('.nameForm').css('display', 'none');
      $('.phoneForm').css('display', 'none');
      $('.emailForm').css('display', 'none');
      $('.companyForm').css('display', 'none');
      $('.usersCountForm').css('display', 'none');
      $('.softForm').css('display', 'none');
      $('.numberVacancyForm').css('display', 'none');
      $('.keyRequirementsForm').css('display', 'none');
        try {
            if (document.domain === 'cleverstaff.net') fbq('track', 'Schedule a demo');
        } catch(err) {
            console.error("Facebook Pixel" ,err);
        }
      //$('#contact').slideUp('slow');
      //$('.tyMessageQuestion').delay(800).fadeIn();
    },
      error: function (data) {
          localStorage.removeItem('phone');
      }
  });
});

$('#askQuestionSubmit4').on('click',function(e){
    console.log('asdf');
    var res = $("#questionForm").serializeObject();
    console.log('res', res);
    $('#emailQuestion, #nameQuestion, #textQuestion').css({
        "box-shadow":"none",
        "border":"1px solid #E5E5E6"
    });

    $.ajax({
        url: "/hr/public/question2manager",
        type: "POST",
        data: JSON.stringify(res),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function (xhr) {
            if (res.email === '') {
                xhr.abort();
                $('#emailQuestion').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }
            if (!mailPattern.test(res.email)) {
                xhr.abort();
                $('#emailQuestion').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }

            if (res.name === '') {
                xhr.abort();
                $('#nameQuestion').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }
            if (res.questionText === '') {
                xhr.abort();
                $('#textQuestion').css({
                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
                    "border":"1px solid rgb(245, 19, 19)"
                });
            }

        },
        complete: function(){
            $("#need-demo-modal").modal('hide');
            $("#thanks-modal").modal('show');
            $("#ex1_firstName").val('');
            $("#ex1_number").val('');
            $("#ex1_mail").val('');
            $("#ex1_skype").val('');
            $("#ex1_orgName").val('');
            $("#ex1_usersCount").val('');
            $("#ex1_averageNum").val('');
            $("#ex1_soft").val('');
            $("#ex1_country").val('');
            $("#ex1_keyRequirements").val('');
            $('.nameForm').css('display', 'none');
            $('.phoneForm').css('display', 'none');
            $('.emailForm').css('display', 'none');
            $('.companyForm').css('display', 'none');
            $('.softForm').css('display', 'none');
            $('.numberVacancyForm').css('display', 'none');
            $('.usersCountForm').css('display', 'none');
            $('.keyRequirementsForm').css('display', 'none');
            try {
                if (document.domain === 'cleverstaff.net') fbq('track', 'Schedule a demo');
            } catch(err) {
                console.error("Facebook Pixel" ,err);
            }
            //$('#contact').slideUp('slow');
            //$('.tyMessageQuestion').delay(800).fadeIn();
        }
    });
});

function signup_text1() {
    $(".modal_window.registration").removeClass("for_start");
    $("#signup_title").text(messages.signup_on_site);
    $("#signup_title_2").show();
    $("#signupBtn").text(messages.signup);
}
function signup_text2() {
    $(".modal_window.registration").addClass("for_start");
    $("#signup_title").text(messages.free_cleverstaff);
    $("#signup_title_2").hide();
    $("#signupBtn").text(messages.free_start);
}
function resetError() {
    $('.mail_need,.pass_need,.wrong_mail,' +
        '.reg_mail_need,.mail_occupied.wrong_mail2,.reg_name_need.need,.reg_name_need.wrong,.reg_company_need,.reg_pass_need,.reg_pass2_need,.pass_not_coincides').fadeOut();
    $('#enter_server_message').text("");
    $("#signupAndForgetDiv").show();
    $(".order_call_win_under,.subscribeText,#enter_server_message,#signup_server_message,#signup_demo_server_message,#confirmDiv").hide();
}
function authError(text) {
    $("#enter_server_message").css("color", "red").text(text).show();
}
function authSuccess(text) {
    $("#enter_server_message").css("color", "green").text(text).show();
}
function signupError(text) {
    $("#signup_server_message").css("color", "red").text(text).show();
}
function signupSuccess(text) {
    $("#signup_server_message").css("color", "green").text(text).show();
}
function signupDemoError(text) {
    $("#signup_demo_server_message").css("color", "red").text(text).show();
}
function signupDemoSuccess(text) {
    $("#signup_demo_server_message").css("color", "green").text(text).show();
}
function socialError(social, text) {
    $("#" + social + "_server_message").css("color", "red").text(text).show();
}
function socialSuccess(social, text) {
    $("#" + social + "_server_message").css("color", "green").text(text).show();
}

function sendGA(event) {
    try {
        if (document.domain === 'cleverstaff.net') {
            ga('send', 'event', 'landing', event);
        } else {
            console.log("GA doesn't work on test server");
        }
    } catch (e) {
    }
}

function enterForm(form, btn) {
    $(form + ' input').keydown(function (e) {
        if (e.keyCode == 13) {
            $(btn).click();
            return false;
        }
    });
}


function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

function downloadNewBrowser() {
    $(".modal_wrap").fadeOut(100);
    resetError();
    $("#mod_download_browser").fadeIn(100);
}
function sendGAgoal(param){
    if (document.domain === 'cleverstaff.net' && ga){
        if(param){
            ga('send', 'event', {eventCategory: param, eventAction: 'Click'});
        }else{
            ga('send', 'event', {eventCategory: 'Without_parametr', eventAction: 'Click'});
        }
    }
}
var urlParams = getUrlVars(window.location.href);

function getUrlVars(url) {
    var hash;
    var myJson = {};
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        myJson[hash[0]] = hash[1];
    }
    return myJson;
}
if(urlParams.email){
  $('[name = login]').val(urlParams.email);
}
// Create the XHR object.
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
}

//Make the actual CORS request.
function makeCorsRequestNews() {
    // All HTML5 Rocks properties support CORS.
    var url = 'https://cleverstaff.net/news3';

    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
        alert('CORS not supported');
        return;
    }

    // Response handlers.
    xhr.onload = function() {
        var text = xhr.responseText;
        var newsArray = JSON.parse(xhr.responseText);
        //var title = getTitle(text);
        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

        var differenceBetweenUpdate = Math.round((new Date().getTime() - new Date(newsArray[0].date))/(oneDay));
        $('#lastUpdated').attr('href',newsArray[0].link);
        if(differenceBetweenUpdate <= 7){
            $('#lastUpdated').css('color', '#E06351')
        }else{
            $('#lastUpdated').css('color', '#436280')
        }
        if(differenceBetweenUpdate == 0){
            $('#lastUpdated').append('Last update today');
        } else if(differenceBetweenUpdate == 1){
            $('#lastUpdated').append('Last update yesterday');
        }else{
            $('#lastUpdated').append('Last update ' + differenceBetweenUpdate + ' days ago');
        }
    };

    xhr.onerror = function() {
        $('.signin-news').css('display','none')
    };

    xhr.send();
}
// Create the XHR object.
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
}

//Make the actual CORS request.
console.log(2);
function makeCorsRequestNewsRu() {
    // All HTML5 Rocks properties support CORS.
    var url = 'https://cleverstaff.net/blog-entries3';

    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
        alert('CORS not supported');
        return;
    }

    // Response handlers.
    xhr.onload = function() {
        var text = xhr.responseText;
        var newsArray = JSON.parse(xhr.responseText);
        //var title = getTitle(text);
        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

        var differenceBetweenUpdate = Math.round((new Date().getTime() - new Date(newsArray[0].date))/(oneDay));
        $('#lastUpdated').attr('href',newsArray[0].link);
        if(differenceBetweenUpdate == 0){
            $('#lastUpdated').append('Последнее обновление сегодня');
        }else{
            if(differenceBetweenUpdate <= 7){
                $('#lastUpdated').css('color', '#E06351')
            }else{
                $('#lastUpdated').css('color', '#436280')
            }
            if(differenceBetweenUpdate == 1){
                $('#lastUpdated').append('Последнее обновление вчера');
            } else if(differenceBetweenUpdate > 1 && differenceBetweenUpdate <= 4){
                $('#lastUpdated').append('Последнее обновление ' + differenceBetweenUpdate + ' дня назад');
            } else{
                $('#lastUpdated').append('Последнее обновление ' + differenceBetweenUpdate + ' дней назад');
            }
        }
    };

    xhr.onerror = function() {
        $('.signin-news').css('display','none')
    };

    xhr.send();
}
function gup(url, name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    if (results === null)
        return "";
    else
        return results[1];
}
function resetMessage() {
    $("#error").addClass("hidden");
}

//$('.nameForm').css('display', 'none');
//window.location.pathname != '/price.html'
$('#usersCount').change(function () {
    var value11 = $('#usersCount').val();
    if(value11.length > 0){
        $('.usersCountForm').css('display', 'block');
    }else{
        $('.usersCountForm').css('display', 'none');
    }
});
$('#ex1_firstName, #ex1_number, #ex1_mail, #ex1_skype, #ex1_orgName, #ex1_password, #ex1_password2, #ex1_soft, #ex1_averageNum, #ex1_keyRequirements')
    .keyup(function() {
        var value = $('#ex1_firstName').val();
        var value2 = $('#ex1_number').val();
        var value3 = $('#ex1_mail').val();
        var value4 = $('#ex1_orgName').val();
        if(window.location.pathname != '/' && window.location.pathname != '/ru/' && window.location.pathname != '/pt/index.html' && window.location.pathname != '/ru/index.html' && window.location.pathname != '/price.html' && window.location.pathname != '/ru/price.html' && window.location.pathname != '/pt/price.html' && window.location.pathname != '/features.html' && window.location.pathname != '/ru/features.html' && window.location.pathname != '/pt/features.html'){
            var value5 = $('#ex1_password').val();
            var value6 = $('#ex1_password2').val();
        }
        var value7 = $('#ex1_soft').val();
        var value8 = $('#ex1_averageNum').val();
        var value10 = $('#ex1_keyRequirements').val();
        var value11 = $('#ex1_skype').val();


        if(value.length > 0){
            $('.nameForm').css('display', 'block');
        } else{
            $('.nameForm').css('display', 'none');
        }
        if(value2.length > 0){
            $('.phoneForm').css('display', 'block');
        }else{
            $('.phoneForm').css('display', 'none');
        }
        if(value3.length > 0){
            $('.emailForm').css('display', 'block');
        }else{
            $('.emailForm').css('display', 'none');
        }
        if(value4.length > 0){
            $('.companyForm').css('display', 'block');
        }else{
            $('.companyForm').css('display', 'none');
        }
        if(window.location.pathname != '/' && window.location.pathname != '/ru/' && window.location.pathname != '/pt/index.html' && window.location.pathname != '/index.html' && window.location.pathname != '/ru/index.html' && window.location.pathname != '/price.html' && window.location.pathname != '/pt/price.html' && window.location.pathname != '/ru/price.html' && window.location.pathname != '/features.html' && window.location.pathname != '/ru/features.html' && window.location.pathname != '/pt/features.html'){
            if(value5.length > 0){
                $('.passwordForm').css('display', 'block');
            }else{
                $('.passwordForm').css('display', 'none');
            }
            if(value6.length > 0){
                $('.password2Form').css('display', 'block');
            }else{
                $('.password2Form').css('display', 'none');
            }
        }
        if(value7.length > 0){
            $('.softForm').css('display', 'block');
        }else{
            $('.softForm').css('display', 'none');
        }
        if(window.location.pathname != '/signup.html' && window.location.pathname != '/ru/signup.html'){
            if(value8.length > 0){
                $('.numberVacancyForm').css('display', 'block');
            }else{
                $('.numberVacancyForm').css('display', 'none');
            }
            if(value10.length > 0){
                $('.keyRequirementsForm').css('display', 'block');
            }else{
                $('.keyRequirementsForm').css('display', 'none');
            }
            if(value11.length > 0){
                $('.skypeForm').css('display', 'block');
            }else{
                $('.skypeForm').css('display', 'none');
            }
        }
    })
    .keyup();

$('#ex1_country').keydown(function(e) {
  if (/^[^A-zА-яЁё -]/g.test(e.key)) {
    ex1_country.focus();
    return false;
  }
});

$('#ex1_firstName').keydown(function(e) {
  if (/^[^A-zА-яЁё -]/g.test(e.key)) {
    ex1_firstName.focus();
    return false;
  }
});

$('#ex1_lastName').keydown(function(e) {
    if (/^[^A-zА-яЁё -]/g.test(e.key)) {
        ex1_lastName.focus();
        return false;
    }
});

$('.usersCountForm').css('display', 'none');

$(document).on('change','#ex1_usersCount',function(){
    var select = $('#ex1_usersCount').val();
    if(select.length > 0) {
        $('.usersCountForm').css('display', 'block');
    }
    else {
      $('.usersCountForm').css('display', 'none');
    }
});




function checkForm(){
    var form = $("#signup").serializeObject();

    $($('input[name=firstName]')).css('border','2px solid #61B452');
    $($('input[name=login]')).css('border','2px solid #61B452');
    $($('.select2-selection--single')).css('border','2px solid #61B452');
    $($('input[name=phone]')).css('border','2px solid #61B452');
    $($('input[name=orgName]')).css('border','2px solid #61B452');
    $($('select[name=usersCount]')).css('border','2px solid #61B452');
    $($('input[name=password]')).css('border','2px solid #61B452');
    $($('input[name=password2]')).css('border','2px solid #61B452');
    $($('input[name=currentSolution]')).css('border','2px solid #61B452');


    if(form.firstName == "") {
        $($('input[name=firstName]')).css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
        $($('input[name=firstName]')).focus();
        $(".error-firstName").html(messages.enter_name);
        $(".error-firstName").removeClass("hidden");
        $('html, body').animate({scrollTop: 250}, 'slow');
        return false;
    }
    $(".error-firstName").addClass("hidden");
    if(form.phone == "") {
        $($('input[name=phone]')).css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
        $($('input[name=phone]')).focus();
        $(".error-phone").html(messages.enter_phone);
        $(".error-phone").removeClass("hidden");
        $('html, body').animate({scrollTop: 250}, 'slow');
        return false;
    }
    if(form.phone.length > 15){
        $($('input[name=phone]')).css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
        $($('input[name=phone]')).focus();
        $(".error-phone").html(messages.enter_phone_length);
        $(".error-phone").removeClass("hidden");
        $('html, body').animate({scrollTop: 250}, 'slow');
        return false;
    }
    $(".error-phone").addClass("hidden");

    var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  var email = $($('input[name=login]'));
    if(!re.test(email.val())){
        console.log(!re.test(email.val()));
        email.css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
        email.focus();
        $(".error-email").html(messages.wrong_email);
        $(".error-email").removeClass("hidden");
        $('html, body').animate({scrollTop: 350}, 'slow');
        return false;
    }
    $(".error-email").addClass("hidden");
    if(form.orgName == "") {
        $($('input[name=orgName]')).css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
        $($('input[name=orgName]')).focus();
        $(".error-orgName").html(messages.enter_company);
        $(".error-orgName").removeClass("hidden");
        $('html, body').animate({scrollTop: 450}, 'slow');
        return false;
    }
    $(".error-orgName").addClass("hidden");
    if(form.usersCount == "") {
        $($('select[name=usersCount]')).css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
        $($('select[name=usersCount]')).focus();
        $(".error-usersCount").html(messages.wrong_users_counter);
        $(".error-usersCount").removeClass("hidden");
        $('html, body').animate({scrollTop: 450}, 'slow');
        return false;
    }
    $(".error-usersCount").addClass("hidden");
    var password1 = /^(?=.*\d)(?=.*[a-zA-Z0-9!,.?%$#@*_\-+=\\|/[\]{}()]).{8,30}$/;
    var password2 = /.*[a-zA-Z].*/;
    var password3 = /.*\d.*/;
    var password = $($('input[name=password]'));
    var repeatPassword = $($('input[name=password2]'));
    console.log(password1.test(password.val()));
    console.log(password2.test(password.val()));
    console.log(password3.test(password.val()));
    if(!password1.test(password.val()) || !password2.test(password.val()) || !password3.test(password.val()) || password.val().length < 8 || password.val().length > 30){
        password.css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
        password.focus();
        $(".error-password").removeClass("hidden");
        $('html, body').animate({scrollTop: 450}, 'slow');
        if(password.val().length == 0){
            $('html, body').animate({scrollTop: 450}, 'slow');
            $(".error-password").html(messages.wrong4_password);
            $(".error-password-1").removeClass("hidden");
            $(".error-password-3").addClass("hidden");
            $(".error-password-4").addClass("hidden");
            $(".error-password-5").addClass("hidden");
            $(".error-password-6").addClass("hidden");
            return false;
        }
        if(password.val().length < 8 || password.val().length > 30){
            $(".error-password").html(messages.wrong4_password);
            $(".error-password-1").addClass("hidden");
            $(".error-password-2").addClass("hidden");
            $(".error-password-3").addClass("hidden");
            $(".error-password-4").addClass("hidden");
            $(".error-password-5").addClass("hidden");
            $(".error-password-6").removeClass("hidden");
            if(!password3.test(password.val()) == true){
                $(".error-password").html(messages.wrong4_password);
                $(".error-password-1").addClass("hidden");
                $(".error-password-2").addClass("hidden");
                $(".error-password-3").addClass("hidden");
                $(".error-password-5").removeClass("hidden");
                $(".error-password-6").addClass("hidden");
                return false;
            }
            return false;
        }else{
            $(".error-password").html(messages.wrong4_password);
            $(".error-password-2").addClass("hidden");
            $(".error-password-3").removeClass("hidden");
            $(".error-password-5").addClass("hidden");
        }
        if(!password1.test(password.val())){
            $(".error-password").html(messages.wrong3_password);
            $(".error-password-3").removeClass("hidden");
            $(".error-password-1").addClass("hidden");
            $(".error-password-4").addClass("hidden");
            return false;
        }
        if(!password2.test(password.val())){
            $(".error-password").html(messages.wrong2_password);
            $(".error-password-1").addClass("hidden");
            $(".error-password-2").removeClass("hidden");
            $(".error-password-4").addClass("hidden");
            $(".error-password-3").addClass("hidden");
            $(".error-password-6").addClass("hidden");
            return false;
        }
    }
    if(repeatPassword.val() != password.val()) {
        $($('input[name=password2]')).css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
        $($('input[name=password2]')).focus();
        $(".error-password").html(messages.wrong_password2);
        $(".error-password").removeClass("hidden");
        $(".error-password-1").addClass("hidden");
        $(".error-password-2").addClass("hidden");
        $(".error-password-3").addClass("hidden");
        $(".error-password-4").removeClass("hidden");
        $(".error-password-5").addClass("hidden");
        $(".error-password-6").addClass("hidden");
        $('html, body').animate({scrollTop: 450}, 'slow');
        return false;
    }
    if(form.currentSolution == "") {
        $($('input[name=currentSolution]')).css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
        $($('input[name=currentSolution]')).focus();
        $('html, body').animate({scrollTop: 250}, 'slow');
        return false;
    }

    if(form.terms != 'on') {
        $(".error-terms").html(messages.terms_accept);
        $(".error-terms").removeClass("hidden");
        $(".error-password").addClass("hidden");
        $(".error-password-4").addClass("hidden");
        return false;
    }
    $(".error-terms").addClass("hidden");
    $(".error-password").addClass("hidden");
    signupForm();
}
function checkFormGoogle(){
    var form = $("#signupGoogleForm").serializeObject();
    $($('input[name=login]')).css('border','2px solid #61B452');
    $($('input[name=firstName]')).css('border','2px solid #61B452');
    $($('input[name=currentSolution]')).css('border','2px solid #61B452');
    $($('input[name=orgName]')).css('border','2px solid #61B452');
    $($('input[name=phone]')).css('border','2px solid #61B452');
    $($('select[name=usersCount]')).css('border','2px solid #61B452');
    $($('input[name=password]')).css('border','2px solid #61B452');
    $($('input[name=password2]')).css('border','2px solid #61B452');

    if(form.orgName == "") {
        $($('input[name=orgName]')).css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
        $($('input[name=orgName]')).focus();
        $(".error-orgName").html(messages.enter_company);
        $(".error-orgName").removeClass("hidden");
        $('html, body').animate({scrollTop: 250}, 'slow');
        return false;
    }
    $(".error-orgName").addClass("hidden");
    if(form.phone == "") {
        console.log('emptyPhone');
        $($('input[name=phone]')).css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
        $($('input[name=phone]')).focus();
        $(".error-phone").html(messages.enter_phone);
        $(".error-phone").removeClass("hidden");
        $('html, body').animate({scrollTop: 250}, 'slow');
        return false;
    }
    $(".error-phone").addClass("hidden");
    if(form.usersCount == "") {
        $($('select[name=usersCount]')).css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
        $($('select[name=usersCount]')).focus();
        $(".error-usersCount").html(messages.wrong_users_counter);
        $(".error-usersCount").removeClass("hidden");
        $('html, body').animate({scrollTop: 250}, 'slow');
        return false;
    }
    $(".error-usersCount").addClass("hidden");
    if(form.terms != 'on') {
        $(".error-terms").html(messages.terms_accept);
        $(".error-terms").removeClass("hidden");
        return false;
    }
    $(".error-terms").addClass("hidden");
    var password1 = /^(?=.*\d)(?=.*[a-zA-Z0-9!,.?%$#@*_\-+=\\|/[\]{}()]).{8,30}$/;
    var password2 = /.*[a-zA-Z].*/;
    var password3 = /.*\d.*/;
    var password = $($('#googlePass'));
    var repeatPassword = $($('#googlePass2'));
    console.log(password1.test(password.val()));
    console.log(password2.test(password.val()));
    console.log(password3.test(password.val()));
    if(!password1.test(password.val()) || !password2.test(password.val()) || !password3.test(password.val()) || password.val().length < 8 || password.val().length > 30){
        password.css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
        password.focus();
        $(".error-password").removeClass("hidden");
        if(password.val().length == 0){
            $('html, body').animate({scrollTop: 450}, 'slow');
            $(".error-password").html(messages.wrong4_password);
            $(".error-password-1").removeClass("hidden");
            $(".error-password-3").addClass("hidden");
            $(".error-password-4").addClass("hidden");
            $(".error-password-5").addClass("hidden");
            $(".error-password-6").addClass("hidden");
            return false;
        }
        if(password.val().length < 8 || password.val().length > 30){
            $(".error-password").html(messages.wrong4_password);
            $(".error-password-1").addClass("hidden");
            $(".error-password-2").addClass("hidden");
            $(".error-password-3").addClass("hidden");
            $(".error-password-4").addClass("hidden");
            $(".error-password-5").addClass("hidden");
            $(".error-password-6").removeClass("hidden");
            if(!password3.test(password.val()) == true){
                $(".error-password").html(messages.wrong4_password);
                $(".error-password-1").addClass("hidden");
                $(".error-password-2").addClass("hidden");
                $(".error-password-3").addClass("hidden");
                $(".error-password-5").removeClass("hidden");
                $(".error-password-6").addClass("hidden");
                return false;
            }
            return false;
        }else{
            $(".error-password").html(messages.wrong4_password);
            $(".error-password-2").addClass("hidden");
            $(".error-password-3").removeClass("hidden");
            $(".error-password-5").addClass("hidden");
        }
        if(!password1.test(password.val())){
            password.css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
            password.focus();
            $(".error-password").html(messages.wrong3_password);
            $(".error-password-1").addClass("hidden");
            $(".error-password-3").removeClass("hidden");
            $(".error-password-4").addClass("hidden");
            setTimeout(function (){
                $(".error-password").addClass("hidden");
            },5000);
            return false;
        }
        if(!password2.test(password.val())){
            password.css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
            password.focus();
            $(".error-password").html(messages.wrong2_password);
            $(".error-password-1").addClass("hidden");
            $(".error-password-2").removeClass("hidden");
            $(".error-password-4").addClass("hidden");
            $(".error-password-3").addClass("hidden");
            $(".error-password-6").addClass("hidden");
            setTimeout(function (){
                $(".error-password").addClass("hidden");
            },5000);
            return false;
        }
    }
    if(repeatPassword.val() != password.val()) {
        $($('input[name=password2]')).css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
        $($('input[name=password2]')).focus();
        $(".error-password").removeClass("hidden");
        $(".error-password").html(messages.wrong_password2);
        $(".error-password-1").addClass("hidden");
        $(".error-password-2").addClass("hidden");
        $(".error-password-3").addClass("hidden");
        $(".error-password-4").removeClass("hidden");
        $(".error-password-5").addClass("hidden");
        $(".error-password-6").addClass("hidden");
        setTimeout(function (){
            $(".error-password").addClass("hidden");
        },5000);
        return false;
    }
}
function checkFormFacebook(){
    var form = $("#signupFacebookForm").serializeObject();
    $($('input[name=login]')).css('border','2px solid #61B452');
    $($('input[name=orgName]')).css('border','2px solid #61B452');
    $($('input[name=firstName]')).css('border','2px solid #61B452');
    $($('input[name=currentSolution]')).css('border','2px solid #61B452');
    $($('select[name=usersCount]')).css('border','2px solid #61B452');
    $($('input[name=phone]')).css('border','2px solid #61B452');
    $($('input[name=password]')).css('border','2px solid #61B452');
    $($('input[name=password2]')).css('border','2px solid #61B452');

    if(form.orgName == "") {
        $($('input[name=orgName]')).css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
        $($('input[name=orgName]')).focus();
        $(".error-orgName").html(messages.enter_company);
        $(".error-orgName").removeClass("hidden");
        $('html, body').animate({scrollTop: 250}, 'slow');
        return false;
    }
    $(".error-orgName").addClass("hidden");
    if(form.phone == "") {
        $($('input[name=phone]')).css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
        $($('input[name=phone]')).focus();
        $(".error-phone").html(messages.enter_phone);
        $(".error-phone").removeClass("hidden");
        $('html, body').animate({scrollTop: 250}, 'slow');
        return false;
    }
    $(".error-phone").addClass("hidden");

    if(form.usersCount == "") {
        $($('select[name=usersCount]')).css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
        $($('select[name=usersCount]')).focus();
        $(".error-usersCount").html(messages.wrong_users_counter);
        $(".error-usersCount").removeClass("hidden");
        $('html, body').animate({scrollTop: 250}, 'slow');
        return false;
    }
    $(".error-usersCount").addClass("hidden");

    if(form.terms != 'on') {
        $(".error-terms").html(messages.terms_accept);
        $(".error-terms").removeClass("hidden");
        return false;
    }
    $(".error-terms").addClass("hidden");

    var password1 = /^(?=.*\d)(?=.*[a-zA-Z0-9!,.?%$#@*_\-+=\\|/[\]{}()]).{8,30}$/;
    var password2 = /.*[a-zA-Z].*/;
    var password3 = /.*\d.*/;
    var password = $($('#facebookPass'));
    var repeatPassword = $($('#facebookPass2'));
    console.log(password1.test(password.val()));
    console.log(password2.test(password.val()));
    console.log(password3.test(password.val()));
    if(!password1.test(password.val()) || !password2.test(password.val()) || !password3.test(password.val()) || password.val().length < 8 || password.val().length > 30){
        password.css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
        password.focus();
        $(".error-password").removeClass("hidden");
        if(password.val().length == 0){
            $('html, body').animate({scrollTop: 450}, 'slow');
            $(".error-password").html(messages.wrong4_password);
            $(".error-password-1").removeClass("hidden");
            $(".error-password-3").addClass("hidden");
            $(".error-password-4").addClass("hidden");
            $(".error-password-5").addClass("hidden");
            $(".error-password-6").addClass("hidden");
            return false;
        }
        if(password.val().length < 8 || password.val().length > 30){
            $(".error-password").html(messages.wrong4_password);
            $(".error-password-1").addClass("hidden");
            $(".error-password-2").addClass("hidden");
            $(".error-password-3").addClass("hidden");
            $(".error-password-4").addClass("hidden");
            $(".error-password-5").addClass("hidden");
            $(".error-password-6").removeClass("hidden");
            if(!password3.test(password.val()) == true){
                $(".error-password").html(messages.wrong4_password);
                $(".error-password-1").addClass("hidden");
                $(".error-password-2").addClass("hidden");
                $(".error-password-3").addClass("hidden");
                $(".error-password-5").removeClass("hidden");
                $(".error-password-6").addClass("hidden");
                return false;
            }
            return false;
        }else{
            $(".error-password").html(messages.wrong4_password);
            $(".error-password-2").addClass("hidden");
            $(".error-password-3").removeClass("hidden");
            $(".error-password-5").addClass("hidden");
        }
        if(!password1.test(password.val())){
            password.css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
            password.focus();
            $(".error-password").html(messages.wrong3_password);
            $(".error-password-1").addClass("hidden");
            $(".error-password-3").removeClass("hidden");
            $(".error-password-4").addClass("hidden");
            setTimeout(function (){
                $(".error-password").addClass("hidden");
            },5000);
            return false;
        }
        if(!password2.test(password.val())){
            password.css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
            password.focus();
            $(".error-password").html(messages.wrong2_password);
            $(".error-password-1").addClass("hidden");
            $(".error-password-2").removeClass("hidden");
            $(".error-password-4").addClass("hidden");
            $(".error-password-3").addClass("hidden");
            $(".error-password-6").addClass("hidden");
            setTimeout(function (){
                $(".error-password").addClass("hidden");
            },5000);
            return false;
        }
    }
    if(repeatPassword.val() != password.val()) {
        $($('input[name=password2]')).css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
        $($('input[name=password2]')).focus();
        $(".error-password").removeClass("hidden");
        $(".error-password").html(messages.wrong_password2);
        $(".error-password-1").addClass("hidden");
        $(".error-password-2").addClass("hidden");
        $(".error-password-3").addClass("hidden");
        $(".error-password-4").removeClass("hidden");
        $(".error-password-5").addClass("hidden");
        $(".error-password-6").addClass("hidden");
        setTimeout(function (){
            $(".error-password").addClass("hidden");
        },5000);
        return false;
    }
}
function signupGoogle() {
    resetMessage();
    var win = window.open(google_url, "windowname1", getPopupParams());
    var pollTimer = window.setInterval(function() {
        try {
            console.log(win.document.URL);
            if (win.document.URL.indexOf(gup(google_url, 'redirect_uri')) !== -1) {
                window.clearInterval(pollTimer);
                var url = win.document.URL;
                var code = gup(url, 'code');
                var access_token = gup(url, 'access_token');
                win.close();
                $.ajax({
                    url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + access_token,
                    data: null,
                    success: function(user) {
                        try {
                            if (document.domain === 'cleverstaff.net') fbq('track', 'Registration');
                        } catch(err) {
                            console.error("Facebook Pixel" ,err);
                        }
                        console.log('user', user);
                        $("#google_mail").val(user.email);
                        $("#google_name").val(user.name);
                        $("#google_code").val(code);
                        $("#signupGoogle").modal('show');
                    },
                    dataType: "jsonp"
                });
            }
        } catch (e) {
        }
    }, 500);
}
function signupForm() {
    var res = $("#signup").serializeObject();
    localStorage.registerFromSocial = false;
    res.login = res.login.toLowerCase();
    res.utms = localStorage.getItem("UTMS");
    res.lang = localStorage.getItem("NG_TRANSLATE_LANG_KEY");
    res.intention =  localStorage.getItem("tarifParams");
    // res.viewedTariff = localStorage.getItem("tarifParams");
    var string = res.country;
    if(string == 'null' || string == null || string == undefined){
        res.country = 'Afghanistan';
    }else{
        res.country = string.replace(/\d+/g, "").replace("(","").replace(")","").replace(" +","");
    }
    console.log(res.phone);
    var phone = $('input[name=phone]');
    console.log(phone);
    if(localStorage.getItem('phone') == null){
        res.phone = $('.select2-selection__rendered')[0].title.replace(/[A-z]/g, "").replace(/\(*\)*\+*\.*\s*/g,"").replace(/,/g,"") + res.phone;
    }else{
        res.phone = $(".countryCustom").text(localStorage.getItem('phone').replace(/-/g,"") + res.phone)[0].textContent;
    }
    delete res.countryCustom;
    console.log(res);
    $.ajax({
        url: "/hr/person/registration",
        type: "POST",
        data: JSON.stringify(res),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function(xhr) {
            $("#signup").addClass("loading");
            $(function() {
                var isoCountries = [
                    { id: 'AF', text: 'Afghanistan (+93)', value: '+93'},
                    { id: 'AX', text: 'Aland Islands (+358)', value: '+358'},
                    { id: 'AL', text: 'Albania (+355)', value: '+355'},
                    { id: 'DZ', text: 'Algeria (+213)', value: '+213'},
                    { id: 'AS', text: 'American Samoa (+1)', value: '+1'},
                    { id: 'AD', text: 'Andorra (+376)', value: '+376'},
                    { id: 'AO', text: 'Angola (+244)', value: '+244'},
                    { id: 'AI', text: 'Anguilla (+1264)', value: '+1264'},
                    { id: 'AQ', text: 'Antarctica (+672)', value: '+672'},
                    { id: 'AG', text: 'Antigua And Barbuda (+1268)', value: '+1268'},
                    { id: 'AR', text: 'Argentina (+54)', value: '+54'},
                    { id: 'AM', text: 'Armenia (+374)', value: '+374'},
                    { id: 'AW', text: 'Aruba (+297)', value: '+297'},
                    { id: 'AU', text: 'Australia (+61)', value: '+61'},
                    { id: 'AT', text: 'Austria (+43)', value: '+43'},
                    { id: 'AZ', text: 'Azerbaijan (+994)', value: '+994'},
                    { id: 'BS', text: 'Bahamas (+1242)', value: '+1242'},
                    { id: 'BH', text: 'Bahrain (+973)', value: '+973'},
                    { id: 'BD', text: 'Bangladesh (+880)', value: '+880'},
                    { id: 'BB', text: 'Barbados (+1246)', value: '+1246'},
                    { id: 'BY', text: 'Belarus (+375)', value: '+375'},
                    { id: 'BE', text: 'Belgium (+32)', value: '+32'},
                    { id: 'BZ', text: 'Belize (+501)', value: '+501'},
                    { id: 'BJ', text: 'Benin (+229)', value: '+229'},
                    { id: 'BM', text: 'Bermuda (+1441)', value: '+1441'},
                    { id: 'BT', text: 'Bhutan (+975)', value: '+975'},
                    { id: 'BO', text: 'Bolivia (+591)', value: '+591'},
                    { id: 'BA', text: 'Bosnia And Herzegovina (+387)', value: '+387'},
                    { id: 'BW', text: 'Botswana (+267)', value: '+267'},
                    { id: 'BV', text: 'Bouvet Island (+47)', value: '+47'},
                    { id: 'BR', text: 'Brazil (+55)', value: '+55'},
                    { id: 'IO', text: 'British Indian Ocean Territory (+246)', value: '+246'},
                    { id: 'BN', text: 'Brunei Darussalam (+673)', value: '+673'},
                    { id: 'BG', text: 'Bulgaria (+359)', value: '+359'},
                    { id: 'BF', text: 'Burkina Faso (+226)', value: '+226'},
                    { id: 'BI', text: 'Burundi (+257)', value: '+257'},
                    { id: 'KH', text: 'Cambodia (+855)', value: '+855'},
                    { id: 'CM', text: 'Cameroon (+237)', value: '+237'},
                    { id: 'CA', text: 'Canada (+1)', value: '+1'},
                    { id: 'CV', text: 'Cape Verde Islands (+238)', value: '+238'},
                    { id: 'KY', text: 'Cayman Islands (+1345)', value: '+1345'},
                    { id: 'CF', text: 'Central African Republic (+236)', value: '+236'},
                    { id: 'TD', text: 'Chad (+235)', value: '+235'},
                    { id: 'CL', text: 'Chile (+56)', value: '+56'},
                    { id: 'CN', text: 'China (+86)', value: '+86'},
                    { id: 'CX', text: 'Christmas Island (+672)', value: '+672'},
                    { id: 'CC', text: 'Cocos (Keeling) Islands (+225)', value: '+225'},
                    { id: 'CO', text: 'Colombia (+57)', value: '+57'},
                    { id: 'KM', text: 'Comoros (+269)', value: '+269'},
                    { id: 'CG', text: 'Congo (+242)', value: '+242'},
                    { id: 'CD', text: 'Congo, Democratic Republic (+243)', value: '+243'},
                    { id: 'CK', text: 'Cook Islands (+682)', value: '+682'},
                    { id: 'CR', text: 'Costa Rica (+506)', value: '+506'},
                    { id: 'CI', text: 'Cote D\'Ivoire (+225)', value: '+225'},
                    { id: 'HR', text: 'Croatia (+385)', value: '+385'},
                    { id: 'CU', text: 'Cuba (+53)', value: '+53'},
                    { id: 'CY', text: 'Cyprus (+90)', value: '+90'},
                    { id: 'CZ', text: 'Czech Republic (+420)', value: '+420'},
                    { id: 'DK', text: 'Denmark (+45)', value: '+45'},
                    { id: 'DJ', text: 'Djibouti (+253)', value: '+253'},
                    { id: 'DM', text: 'Dominica (+1809)', value: '+1809'},
                    { id: 'DO', text: 'Dominican Republic (+1809)', value: '+1809'},
                    { id: 'EC', text: 'Ecuador (+593)', value: '+593'},
                    { id: 'EG', text: 'Egypt (+20)', value: '+20'},
                    { id: 'SV', text: 'El Salvador (+503)', value: '+503'},
                    { id: 'GQ', text: 'Equatorial Guinea (+240)', value: '+240'},
                    { id: 'ER', text: 'Eritrea (+291)', value: '+291'},
                    { id: 'EE', text: 'Estonia (+372)', value: '+372'},
                    { id: 'ET', text: 'Ethiopia (+251)', value: '+251'},
                    { id: 'FK', text: 'Falkland Islands (Malvinas) (+500)', value: '+500'},
                    { id: 'FO', text: 'Faroe Islands (+298)', value: '+298'},
                    { id: 'FJ', text: 'Fiji (+679)', value: '+679'},
                    { id: 'FI', text: 'Finland (+358)', value: '+358'},
                    { id: 'FR', text: 'France (+33)', value: '+33'},
                    { id: 'GF', text: 'French Guiana (+594)', value: '+594'},
                    { id: 'PF', text: 'French Polynesia (+689)', value: '+689'},
                    { id: 'TF', text: 'French Southern Territories (+689)', value: '+689'},
                    { id: 'GA', text: 'Gabon (+241)', value: '+241'},
                    { id: 'GM', text: 'Gambia (+220)', value: '+220'},
                    { id: 'GE', text: 'Georgia (+7880)', value: '+7880'},
                    { id: 'DE', text: 'Germany (+49)', value: '+49'},
                    { id: 'GH', text: 'Ghana (+233)', value: '+233'},
                    { id: 'GI', text: 'Gibraltar (+350)', value: '+350'},
                    { id: 'GR', text: 'Greece (+30)', value: '+30'},
                    { id: 'GL', text: 'Greenland (+299)', value: '+299'},
                    { id: 'GD', text: 'Grenada (+1473)', value: '+1473'},
                    { id: 'GP', text: 'Guadeloupe (+590)', value: '+590'},
                    { id: 'GU', text: 'Guam (+671)', value: '+671'},
                    { id: 'GT', text: 'Guatemala (+502)', value: '+502'},
                    { id: 'GG', text: 'Guernsey (+44)', value: '+44'},
                    { id: 'GN', text: 'Guinea (+224)', value: '+224'},
                    { id: 'GW', text: 'Guinea-Bissau (+245)', value: '+245'},
                    { id: 'GY', text: 'Guyana (+592)', value: '+592'},
                    { id: 'HT', text: 'Haiti (+509)', value: '+509'},
                    { id: 'HM', text: 'Heard Island & Mcdonald Islands (+61)', value: '+61'},
                    { id: 'VA', text: 'Holy See (Vatican City State) (+39)', value: '+39'},
                    { id: 'HN', text: 'Honduras (+504)', value: '+504'},
                    { id: 'HK', text: 'Hong Kong (+852)', value: '+852'},
                    { id: 'HU', text: 'Hungary (+36)', value: '+36'},
                    { id: 'IS', text: 'Iceland (+354)', value: '+354'},
                    { id: 'IN', text: 'India(+91)', value: '+91'},
                    { id: 'ID', text: 'Indonesia (+62)', value: '+62'},
                    { id: 'IR', text: 'Iran, Islamic Republic Of (+98)', value: '+98'},
                    { id: 'IQ', text: 'Iraq (+964)', value: '+964'},
                    { id: 'IE', text: 'Ireland (+353)', value: '+353'},
                    { id: 'IM', text: 'Isle Of Man (+44)', value: '+44'},
                    { id: 'IL', text: 'Israel (+972)', value: '+975'},
                    { id: 'IT', text: 'Italy (+39)', value: '+39'},
                    { id: 'JM', text: 'Jamaica (+1876)', value: '+1876'},
                    { id: 'JP', text: 'Japan (+81)', value: '+81'},
                    { id: 'JE', text: 'Jersey (+44-1534)', value: '+44-1534'},
                    { id: 'JO', text: 'Jordan (+962)', value: '+962'},
                    { id: 'KZ', text: 'Kazakhstan (+7)', value: '+7'},
                    { id: 'KE', text: 'Kenya (+254)', value: '+254'},
                    { id: 'KI', text: 'Kiribati (+686)', value: '+686'},
                    { id: 'KP', text: 'Korea - North (+850)', value: '+850'},
                    { id: 'KR', text: 'Korea - South (+82)', value: '+82'},
                    { id: 'KW', text: 'Kuwait (+965)', value: '+965'},
                    { id: 'KG', text: 'Kyrgyzstan (+996)', value: '+996'},
                    { id: 'LA', text: 'Lao People\'s Democratic Republic (+856)', value: '+856'},
                    { id: 'LV', text: 'Latvia (+371)', value: '+371'},
                    { id: 'LB', text: 'Lebanon (+961)', value: '+961'},
                    { id: 'LS', text: 'Lesotho (+266)', value: '+266'},
                    { id: 'LR', text: 'Liberia (+231)', value: '+231'},
                    { id: 'LY', text: 'Libyan Arab Jamahiriya (+218)', value: '+218'},
                    { id: 'LI', text: 'Liechtenstein (+417)', value: '+417'},
                    { id: 'LT', text: 'Lithuania (+370)', value: '+370'},
                    { id: 'LU', text: 'Luxembourg (+352)', value: '+352'},
                    { id: 'MO', text: 'Macao (+853)', value: '+853'},
                    { id: 'MK', text: 'Macedonia (+389)', value: '+389'},
                    { id: 'MG', text: 'Madagascar (+261)', value: '+261'},
                    { id: 'MW', text: 'Malawi (+265)', value: '+265'},
                    { id: 'MY', text: 'Malaysia (+60)', value: '+60'},
                    { id: 'MV', text: 'Maldives (+960)', value: '+960'},
                    { id: 'ML', text: 'Mali (+223)', value: '+223'},
                    { id: 'MT', text: 'Malta (+356)', value: '+356'},
                    { id: 'MH', text: 'Marshall Islands (+692)', value: '+692'},
                    { id: 'MQ', text: 'Martinique (+596)', value: '+596'},
                    { id: 'MR', text: 'Mauritania (+222)', value: '+222'},
                    { id: 'MU', text: 'Mauritius (+230)', value: '+230'},
                    { id: 'YT', text: 'Mayotte (+269)', value: '+269'},
                    { id: 'MX', text: 'Mexico (+52)', value: '+52'},
                    { id: 'FM', text: 'Micronesia, Federated States Of (+691)', value: '+691'},
                    { id: 'MD', text: 'Moldova (+373)', value: '+373'},
                    { id: 'MC', text: 'Monaco (+377)', value: '+377'},
                    { id: 'MN', text: 'Mongolia (+976)', value: '+976'},
                    { id: 'ME', text: 'Montenegro (+382)', value: '+382'},
                    { id: 'MS', text: 'Montserrat (+1664)', value: '+1664'},
                    { id: 'MA', text: 'Morocco (+212)', value: '+212'},
                    { id: 'MZ', text: 'Mozambique (+258)', value: '+258'},
                    { id: 'MM', text: 'Myanmar (+95)', value: '+95'},
                    { id: 'NA', text: 'Namibia (+264)', value: '+264'},
                    { id: 'NR', text: 'Nauru (+674)', value: '+674'},
                    { id: 'NP', text: 'Nepal (+977)', value: '+977'},
                    { id: 'NL', text: 'Netherlands (+31)', value: '+31'},
                    { id: 'AN', text: 'Netherlands Antilles (+599)', value: '+599'},
                    { id: 'NC', text: 'New Caledonia (+687)', value: '+687'},
                    { id: 'NZ', text: 'New Zealand (+64)', value: '+64'},
                    { id: 'NI', text: 'Nicaragua (+505)', value: '+505'},
                    { id: 'NE', text: 'Niger (+227)', value: '+227'},
                    { id: 'NG', text: 'Nigeria (+234)', value: '+234'},
                    { id: 'NU', text: 'Niue (+683)', value: '+683'},
                    { id: 'NF', text: 'Norfolk Island (+672)', value: '+672'},
                    { id: 'MP', text: 'Northern Mariana Islands (+670)', value: '+670'},
                    { id: 'NO', text: 'Norway (+47)', value: '+47'},
                    { id: 'OM', text: 'Oman (+968)', value: '+968'},
                    { id: 'PK', text: 'Pakistan (+92)', value: '+92'},
                    { id: 'PW', text: 'Palau (+680)', value: '+680'},
                    { id: 'PS', text: 'Palestinian Territory (+970)', value: '+970'},
                    { id: 'PA', text: 'Panama (+507)', value: '+507'},
                    { id: 'PG', text: 'Papua New Guinea (+675)', value: '+675'},
                    { id: 'PY', text: 'Paraguay (+595)', value: '+595'},
                    { id: 'PE', text: 'Peru (+51)', value: '+51'},
                    { id: 'PH', text: 'Philippines (+63)', value: '+63'},
                    { id: 'PN', text: 'Pitcairn (+64)', value: '+64'},
                    { id: 'PL', text: 'Poland (+48)', value: '+48'},
                    { id: 'PT', text: 'Portugal (+351)', value: '+351'},
                    { id: 'PR', text: 'Puerto Rico (+1787)', value: '+1787'},
                    { id: 'QA', text: 'Qatar (+974)', value: '+974'},
                    { id: 'RE', text: 'Reunion (+262)', value: '+262'},
                    { id: 'RO', text: 'Romania (+40)', value: '+40'},
                    { id: 'RU', text: 'Russian Federation (+7)', value: '+7'},
                    { id: 'RW', text: 'Rwanda (+250)', value: '+250'},
                    { id: 'BL', text: 'Saint Barthelemy (+590)', value: '+590'},
                    { id: 'SH', text: 'Saint Helena (+290)', value: '+94'},
                    { id: 'KN', text: 'Saint Kitts And Nevis (+1869)', value: '+94'},
                    { id: 'LC', text: 'Saint Lucia (+1758)', value: '+94'},
                    { id: 'MF', text: 'Saint Martin (+590)', value: '+590'},
                    { id: 'PM', text: 'Saint Pierre And Miquelon (+508)', value: '+508'},
                    { id: 'VC', text: 'Saint Vincent And Grenadines (+1-784)', value: '+1-784'},
                    { id: 'WS', text: 'Samoa (+685)', value: '+685'},
                    { id: 'SM', text: 'San Marino (+378)', value: '+378'},
                    { id: 'ST', text: 'Sao Tome And Principe (+239)', value: '+239'},
                    { id: 'SA', text: 'Saudi Arabia (+966)', value: '+966'},
                    { id: 'SN', text: 'Senegal (+221)', value: '+221'},
                    { id: 'RS', text: 'Serbia (+381)', value: '+381'},
                    { id: 'SC', text: 'Seychelles (+248)', value: '+248'},
                    { id: 'SL', text: 'Sierra Leone (+232)', value: '+232'},
                    { id: 'SG', text: 'Singapore (+65)', value: '+65'},
                    { id: 'SK', text: 'Slovakia (+421)', value: '+421'},
                    { id: 'SI', text: 'Slovenia (+386)', value: '+386'},
                    { id: 'SB', text: 'Solomon Islands (+677)', value: '+677'},
                    { id: 'SO', text: 'Somalia (+252)', value: '+252'},
                    { id: 'ZA', text: 'South Africa (+27)', value: '+27'},
                    { id: 'GS', text: 'South Georgia And Sandwich Isl. (+500)', value: '+500'},
                    { id: 'ES', text: 'Spain (+34)', value: '+34'},
                    { id: 'LK', text: 'Sri Lanka (+94)', value: '+94'},
                    { id: 'SD', text: 'Sudan (+249)', value: '+249'},
                    { id: 'SR', text: 'Suriname (+597)', value: '+597'},
                    { id: 'SJ', text: 'Svalbard And Jan Mayen (+47)', value: '+47'},
                    { id: 'SZ', text: 'Swaziland (+268)', value: '+268'},
                    { id: 'SE', text: 'Sweden (+46)', value: '+46'},
                    { id: 'CH', text: 'Switzerland (+41)', value: '+41'},
                    { id: 'SY', text: 'Syrian Arab Republic (+963)', value: '+963'},
                    { id: 'TW', text: 'Taiwan (+886)', value: '+886'},
                    { id: 'TJ', text: 'Tajikistan (+992)', value: '+992'},
                    { id: 'TZ', text: 'Tanzania (+255)', value: '+255'},
                    { id: 'TH', text: 'Thailand (+66)', value: '+66'},
                    { id: 'TL', text: 'Timor-Leste (+670)', value: '+670'},
                    { id: 'TG', text: 'Togo (+228)', value: '+228'},
                    { id: 'TK', text: 'Tokelau (+690)', value: '+690'},
                    { id: 'TO', text: 'Tonga (+676)', value: '+676'},
                    { id: 'TT', text: 'Trinidad And Tobago (+1868)', value: '+1868'},
                    { id: 'TN', text: 'Tunisia (+216)', value: '+216'},
                    { id: 'TR', text: 'Turkey (+90)', value: '+90'},
                    { id: 'TM', text: 'Turkmenistan (+993)', value: '+993'},
                    { id: 'TC', text: 'Turks And Caicos Islands (+1649)', value: '+1649'},
                    { id: 'TV', text: 'Tuvalu (+688)', value: '+668'},
                    { id: 'UG', text: 'Uganda (+256)', value: '+256'},
                    { id: 'UA', text: 'Ukraine (+380)', value: '+380'},
                    { id: 'AE', text: 'United Arab Emirates (+971)', value: '+971'},
                    { id: 'GB', text: 'United Kingdom (+44)', value: '+44'},
                    { id: 'US', text: 'United States (+1)', value: '+1'},
                    { id: 'UM', text: 'United States Outlying Islands (+1-340)', value: '+1-340'},
                    { id: 'UY', text: 'Uruguay (+598)', value: '+598'},
                    { id: 'UZ', text: 'Uzbekistan (+998)', value: '+998'},
                    { id: 'VU', text: 'Vanuatu (+678)', value: '+678'},
                    { id: 'VE', text: 'Venezuela (+58)', value: '+58'},
                    { id: 'VN', text: 'Vietnam (+84)', value: '+84'},
                    { id: 'VG', text: 'Virgin Islands, British (+1)', value: '+1'},
                    { id: 'VI', text: 'Virgin Islands, U.S. (+1)', value: '+1'},
                    { id: 'WF', text: 'Wallis And Futuna (+681)', value: '+681'},
                    { id: 'EH', text: 'Western Sahara (+212)', value: '+212'},
                    { id: 'YE', text: 'Yemen (North)(+969)', value: '+969'},
                    { id: 'YE', text: 'Yemen (South)(+967)', value: '+967'},
                    { id: 'ZM', text: 'Zambia (+260)', value: '+260'},
                    { id: 'ZW', text: 'Zimbabwe (+263)', value: '+263'}
                ];
                function formatCountry (country) {
                    if (!country.id) { return country.text; }
                    var $country = $(
                        '<span class="flag-icon flag-icon-'+ country.id.toLowerCase() +' flag-icon-squared"></span>' +
                        '<span class="flag-text" style="margin-left: 5px;">'+ country.text+"</span>"
                    );
                    return $country;
                }
                function format(state) {
                    if(state.selected == true){
                        var country = $('input[name=country]');
                        country.val(state.text);
                        if(state.value != undefined){
                            var phone = state.value.replace("+","");
                            localStorage.setItem("phone", phone);
                        }
                    }
                    if (!state.id) return state.text;
                    var $state = $(
                        '<span class="flag-icon flag-icon-'+ state.id.toLowerCase() +' flag-icon-squared"></span>' +
                        '<span class="flag-text" style="margin-left: 5px;">'+ state.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\-*\s*/g,"").replace(/,/g,"").replace(/'/g,"").replace(/&/g,"") +"</span>");
                    return $state;
                }
                if(window.location.pathname != '/signin.html' || window.location.pathname != '/ru/signin.html' || window.location.pathname != '/pt/signin.html' ||
                    window.location.pathname != '/why.html' || window.location.pathname != '/ru/why.html' || window.location.pathname != '/pt/why.html' ||
                    window.location.pathname != '/terms.html' || window.location.pathname != '/ru/terms.html' || window.location.pathname != '/pt/terms.html'){
                    $.ajax({
                        url: "/hr/public/getUserLocation",
                        type: "GET",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        //beforeSend: function (xhr) {
                        //
                        //},
                        complete: function(resp){
                            $.each(isoCountries, function(index, value) {
                                if(resp.responseJSON.countryCode != undefined && resp.responseJSON.countryCode == value.id){
                                    if(window.location.pathname == '/signup.html' || window.location.pathname == '/ru/signup.html' || window.location.pathname == '/pt/signup.html'){
                                        //fb
                                        $('#signupFacebookForm').find('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\s*/g,"").replace(/,/g,"")+"</span>";
                                        $('#signupFacebookForm').find('.select2-selection__rendered')[0].title =  value.text;
                                        //end fb
                                        //google
                                        $('#signupGoogleForm').find('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\s*/g,"").replace(/,/g,"")+"</span>";
                                        $('#signupGoogleForm').find('.select2-selection__rendered')[0].title =  value.text;
                                        //end google
                                    }
                                    //our project
                                    $('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\-*\s*/g,"").replace(/,/g,"").replace(/'/g,"").replace(/&/g,"")+"</span>";
                                    $('.select2-selection__rendered')[0].title = value.text;
                                    //end our project
                                    var country = $('input[name=country]');
                                    country.val(value.text);
                                    var phone = $('.countryCustom');
                                    phone.value = value.value.replace("+","");
                                    localStorage.setItem("phone",  phone.value);
                                }
                            });
                        }
                    });
                }
                $("[name='countryCustom']").select2({
                    placeholder: "Select a country",
                    templateResult: formatCountry,
                    templateSelection: format,
                    data: isoCountries
                });
            });
        },
        success: function(data) {
            $($('.select2-selection--single')).css('border','2px solid #61B452');
            if(data.message == "Someone already has that email, try another one"){
                $(".error-email").html(messages.Someone_already_has_that_email_try_another_one);
                $(".error-email").removeClass("hidden");
                $("#ex1_mail").css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
                $('html, body').animate({scrollTop: 350}, 'slow');
            }
            if(data.message == "Name contains invalid characters"){
                $(".error-lastName").html(messages.enter_correct_name);
                $(".error-lastName").removeClass("hidden");
                $(".error-email").addClass("hidden");
                $("#ex1_lastName").css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
                $('html, body').animate({scrollTop: 250}, 'slow');
            }
            if(data.message == "Please use your work or personal email"){
                $(".error-email").html(messages.Please_use_your_work_or_personal_email);
                $(".error-email").removeClass("hidden");
                $("#ex1_mail").css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
                $('html, body').animate({scrollTop: 350}, 'slow');
            }
            if(data.message == "Please enter your full phone number"){
                $(".error-phone").html(messages.enter_full_phone);
                $(".error-phone").removeClass("hidden");
                $("#ex1_number").css({'border': '2px solid #C62828', 'background-color': '#FFF6F7'});
                $('html, body').animate({scrollTop: 350}, 'slow');
            }
            //window.location.replace("/finishreg");
            $("#signup").removeClass("loading");
            if(data.status != 'error')
            localStorage.removeItem('phone');
            if (data.personId !== undefined) {
                sendGA('signup_success');
//                signupSuccess(messages.signup_success.replace("${login}", res.login).replace("${orgName}", res.orgName));
                $("#main_content").css('display', 'none');
                $("#after_registration_message").css('display', 'block');
                $("#reg_company_name").text(res.orgName);
                $("#reg_email").text(res.login);
                try {
                    if (document.domain === 'cleverstaff.net') fbq('track', 'Registration');
                } catch(err) {
                    console.error("Facebook Pixel" ,err);
                }

                if(res.lang == 'ru'){
                    window.location.replace("/finishreg");
                }else if(res.lang == 'en'){
                    window.location.replace("/finishregeng");
                }else if(res.lang == 'uk'){
                    window.location.replace("/finishregukr");
                }

            } else if (data.status === "error") {
                localStorage.removeItem('phone');
                $("#error").html(data.message);
                $("#error").removeClass("hidden");
                signupError(data.message);
            }
        },
        error: function(data) {
            localStorage.removeItem('phone');
            $("#signup").removeClass("loading");
            if (data.status === "error") {
                $("#error").html(data.message);
                $("#error").removeClass("hidden");
                signupError(data.message);
            }
        }
    });

}
function getPopupParams() {
    var w = 650;
    var h = 550;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    return 'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left;
}
function signupFacebook() {
    resetMessage();
    FB.login(function(response) {
        if (response.authResponse) {
            var code = response.authResponse.accessToken; //get access token
            FB.api('/me?fields=email,name', function(user) {
                try {
                    if (document.domain === 'cleverstaff.net') fbq('track', 'Registration');
                } catch(err) {
                    console.error("Facebook Pixel" ,err);
                }
                console.log(user);
                $("#facebook_mail").val(user.email);
                $("#facebook_name").val(user.name);
                $("#facebook_code").val(code);
                $("#signupFacebook").modal('show');
            });
        } else {
        }
    }, {
        scope: 'email'
    });
}
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id))
        return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=305967169564826&version=v2.9";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
$('#signup-button').click(function(){
    checkForm();
});

(function (){
    function saveEmail() {
        var email = $('#login').val();
        $('#phone_number4').val(email);
    }

    $('#forgot-pass').click(function(){
        saveEmail();
    });
})();
$(document).ready(function() {
    $('#txthdnPassword').hide();
    $("#hide").click(function(){
        $('#txtPassword').val($('#txthdnPassword').val());
        $("#show").show();
        $("#hide").hide();
        $('#txtPassword').show();
        $('#txthdnPassword').hide();
    });
    $("#show").click(function(){
        $('#txthdnPassword').val($('#txtPassword').val());
        $("#show").hide();
        $("#hide").show();
        $('#txtPassword').hide();
        $('#txthdnPassword').show();
    });
    $("#txtPassword").change(function(){
        $('#txtPassword').val() == $('#txthdnPassword').val();
    });
    $('#txthdnPassword').on('input', function () {
        var msg = $(this).val();
        $('#txtPassword').val(msg);
    });
});
function switchFunc(tabHeader){
    var allGif = $('.gif-1, .gif-2, .gif-3, .gif-4, .gif-5');
    allGif.removeClass('active');
    $(tabHeader).addClass('active');
    $(tabHeader).addClass('fade').css('opacity', '1');
}
$(window).scroll(function() {
    var scroll = $(window).scrollTop();
    if ((scroll > 1200 && scroll < 1250) || (scroll > 2000 && scroll < 2050) || scroll > 2800) {
        $('.gif-1, .gif-2, .gif-3, .gif-4, .gif-5').removeClass('active');
        $('.gif-1').addClass('in active');
    }
});
setInterval(function () {
    if(localStorage.getItem("link_redirect") != null){
        $("#registered").modal('show');
        history.pushState('', '', '/signin.html?q=inviteUsed ');
        setTimeout(function(){
            $("#registered").modal('hide');
            localStorage.removeItem('link_redirect');
            history.pushState(null, null, '/signin.html');
        }, 10000);
    }
}, 1000);
$(document).ready(function(){
    $(".signup-contact").css("top", 0);
    $(".cloud").css({"opacity": 1, "right": 0});
    $(".graf").css({"opacity": 1, "left": 15});
    $(".manGo").css({"opacity": 1, "left": 245});
    $(".chat").css({"opacity": 1, "right": 0});
    $(".tasks").css({"opacity": 1, "right": 0});
    $(".cloud-sec").css({"opacity": 1, "left": 40});
    $(".tasks-second").css({"opacity": 1,"right": 175});
    $(".puzzle-signup").css({"opacity": 1, "right": 140});
    $(".flower-signup").css({"opacity": 1, "right": 240});
    $(".calendar").css({"opacity": 1, "right": 110});
    $(".big-tittle").css({"opacity": 1, "top": 0});
    $(".arrow").css({"opacity": 1, "bottom": -35});
    $(".orangeBtn").css({"opacity": 1, "top": 0});
    $(".orangeBtnBorder").css({"opacity": 1, "top": 0});
    $(".or-index").css({'opacity' : 1, "top": 0});
    $(".animated-left").css({"opacity": 1, "left": 0});
    $(".animated-right").css({"opacity": 1, "right": 0});
    $(".teacher").css({"opacity": 1, "left": 120});
    $(".settings").css({"opacity": 1, "right": 160});
    $(".manWrite").css({"opacity": 1, "left": 125});
    $(".arrow-features").css({"opacity": 1, "left": 265});
    $(".flower-feature").css({"opacity": 1, "right": 270});
    $(".man").css({"opacity": 1, "right": 135});
    $(".priceMan").css({"opacity": 1, "left": 125});
    $(".priceFlower").css({"opacity": 1, "left": 190});
    $(".priceCheer").css({"opacity": 1, "right": -60});
    $(".priceGraf").css({"opacity": 1, "right": 135});
});
$(window).load(function(){
    $("#block_3 #addCandidate div").addClass("tab-img-features");
    $("#block_3 #menu1 div").addClass("tab-img-features2");
    $("#block_3 #menu2 div").addClass("tab-img-features3");
    $("#block_3 #menu3 div").addClass("tab-img-features4");
    $("#block_3 #menu4 div").addClass("tab-img-features5");

    $("#features #addCandidate div").addClass("tab-img-page-features-database-instantly");
    $("#features #menu1 div").addClass("tab-img-page-features-database-instantly2");
    $("#features #menu2 div").addClass("tab-img-page-features-database-instantly3");
    $("#features #menu3 div").addClass("tab-img-page-features-database-instantly4");
    $("#features #menu4 div").addClass("tab-img-page-features-database-instantly5");

    $("#features_2 #step div").addClass("tab-img-page-features-tracking-system");
    $("#features_2 #integration div").addClass("tab-img-page-features-tracking-system2");
    $("#features_2 #customizable div").addClass("tab-img-page-features-tracking-system3");

    $("#features_3 #search div").addClass("tab-img-page-features-recruitment-automation");
    $("#features_3 #reports div").addClass("tab-img-page-features-recruitment-automation2");
    $("#features_3 #funnel div").addClass("tab-img-page-features-recruitment-automation3");
});
(function($) {
    $(function selectCountries() {
        var isoCountries = [
            { id: 'AF', text: 'Afghanistan (+93)', value: '+93'},
            { id: 'AX', text: 'Aland Islands (+358)', value: '+358'},
            { id: 'AL', text: 'Albania (+355)', value: '+355'},
            { id: 'DZ', text: 'Algeria (+213)', value: '+213'},
            { id: 'AS', text: 'American Samoa (+1)', value: '+1'},
            { id: 'AD', text: 'Andorra (+376)', value: '+376'},
            { id: 'AO', text: 'Angola (+244)', value: '+244'},
            { id: 'AI', text: 'Anguilla (+1264)', value: '+1264'},
            { id: 'AQ', text: 'Antarctica (+672)', value: '+672'},
            { id: 'AG', text: 'Antigua And Barbuda (+1268)', value: '+1268'},
            { id: 'AR', text: 'Argentina (+54)', value: '+54'},
            { id: 'AM', text: 'Armenia (+374)', value: '+374'},
            { id: 'AW', text: 'Aruba (+297)', value: '+297'},
            { id: 'AU', text: 'Australia (+61)', value: '+61'},
            { id: 'AT', text: 'Austria (+43)', value: '+43'},
            { id: 'AZ', text: 'Azerbaijan (+994)', value: '+994'},
            { id: 'BS', text: 'Bahamas (+1242)', value: '+1242'},
            { id: 'BH', text: 'Bahrain (+973)', value: '+973'},
            { id: 'BD', text: 'Bangladesh (+880)', value: '+880'},
            { id: 'BB', text: 'Barbados (+1246)', value: '+1246'},
            { id: 'BY', text: 'Belarus (+375)', value: '+375'},
            { id: 'BE', text: 'Belgium (+32)', value: '+32'},
            { id: 'BZ', text: 'Belize (+501)', value: '+501'},
            { id: 'BJ', text: 'Benin (+229)', value: '+229'},
            { id: 'BM', text: 'Bermuda (+1441)', value: '+1441'},
            { id: 'BT', text: 'Bhutan (+975)', value: '+975'},
            { id: 'BO', text: 'Bolivia (+591)', value: '+591'},
            { id: 'BA', text: 'Bosnia And Herzegovina (+387)', value: '+387'},
            { id: 'BW', text: 'Botswana (+267)', value: '+267'},
            { id: 'BV', text: 'Bouvet Island (+47)', value: '+47'},
            { id: 'BR', text: 'Brazil (+55)', value: '+55'},
            { id: 'IO', text: 'British Indian Ocean Territory (+246)', value: '+246'},
            { id: 'BN', text: 'Brunei Darussalam (+673)', value: '+673'},
            { id: 'BG', text: 'Bulgaria (+359)', value: '+359'},
            { id: 'BF', text: 'Burkina Faso (+226)', value: '+226'},
            { id: 'BI', text: 'Burundi (+257)', value: '+257'},
            { id: 'KH', text: 'Cambodia (+855)', value: '+855'},
            { id: 'CM', text: 'Cameroon (+237)', value: '+237'},
            { id: 'CA', text: 'Canada (+1)', value: '+1'},
            { id: 'CV', text: 'Cape Verde Islands (+238)', value: '+238'},
            { id: 'KY', text: 'Cayman Islands (+1345)', value: '+1345'},
            { id: 'CF', text: 'Central African Republic (+236)', value: '+236'},
            { id: 'TD', text: 'Chad (+235)', value: '+235'},
            { id: 'CL', text: 'Chile (+56)', value: '+56'},
            { id: 'CN', text: 'China (+86)', value: '+86'},
            { id: 'CX', text: 'Christmas Island (+672)', value: '+672'},
            { id: 'CC', text: 'Cocos (Keeling) Islands (+225)', value: '+225'},
            { id: 'CO', text: 'Colombia (+57)', value: '+57'},
            { id: 'KM', text: 'Comoros (+269)', value: '+269'},
            { id: 'CG', text: 'Congo (+242)', value: '+242'},
            { id: 'CD', text: 'Congo, Democratic Republic (+243)', value: '+243'},
            { id: 'CK', text: 'Cook Islands (+682)', value: '+682'},
            { id: 'CR', text: 'Costa Rica (+506)', value: '+506'},
            { id: 'CI', text: 'Cote D\'Ivoire (+225)', value: '+225'},
            { id: 'HR', text: 'Croatia (+385)', value: '+385'},
            { id: 'CU', text: 'Cuba (+53)', value: '+53'},
            { id: 'CY', text: 'Cyprus (+90)', value: '+90'},
            { id: 'CZ', text: 'Czech Republic (+420)', value: '+420'},
            { id: 'DK', text: 'Denmark (+45)', value: '+45'},
            { id: 'DJ', text: 'Djibouti (+253)', value: '+253'},
            { id: 'DM', text: 'Dominica (+1809)', value: '+1809'},
            { id: 'DO', text: 'Dominican Republic (+1809)', value: '+1809'},
            { id: 'EC', text: 'Ecuador (+593)', value: '+593'},
            { id: 'EG', text: 'Egypt (+20)', value: '+20'},
            { id: 'SV', text: 'El Salvador (+503)', value: '+503'},
            { id: 'GQ', text: 'Equatorial Guinea (+240)', value: '+240'},
            { id: 'ER', text: 'Eritrea (+291)', value: '+291'},
            { id: 'EE', text: 'Estonia (+372)', value: '+372'},
            { id: 'ET', text: 'Ethiopia (+251)', value: '+251'},
            { id: 'FK', text: 'Falkland Islands (Malvinas) (+500)', value: '+500'},
            { id: 'FO', text: 'Faroe Islands (+298)', value: '+298'},
            { id: 'FJ', text: 'Fiji (+679)', value: '+679'},
            { id: 'FI', text: 'Finland (+358)', value: '+358'},
            { id: 'FR', text: 'France (+33)', value: '+33'},
            { id: 'GF', text: 'French Guiana (+594)', value: '+594'},
            { id: 'PF', text: 'French Polynesia (+689)', value: '+689'},
            { id: 'TF', text: 'French Southern Territories (+689)', value: '+689'},
            { id: 'GA', text: 'Gabon (+241)', value: '+241'},
            { id: 'GM', text: 'Gambia (+220)', value: '+220'},
            { id: 'GE', text: 'Georgia (+7880)', value: '+7880'},
            { id: 'DE', text: 'Germany (+49)', value: '+49'},
            { id: 'GH', text: 'Ghana (+233)', value: '+233'},
            { id: 'GI', text: 'Gibraltar (+350)', value: '+350'},
            { id: 'GR', text: 'Greece (+30)', value: '+30'},
            { id: 'GL', text: 'Greenland (+299)', value: '+299'},
            { id: 'GD', text: 'Grenada (+1473)', value: '+1473'},
            { id: 'GP', text: 'Guadeloupe (+590)', value: '+590'},
            { id: 'GU', text: 'Guam (+671)', value: '+671'},
            { id: 'GT', text: 'Guatemala (+502)', value: '+502'},
            { id: 'GG', text: 'Guernsey (+44)', value: '+44'},
            { id: 'GN', text: 'Guinea (+224)', value: '+224'},
            { id: 'GW', text: 'Guinea-Bissau (+245)', value: '+245'},
            { id: 'GY', text: 'Guyana (+592)', value: '+592'},
            { id: 'HT', text: 'Haiti (+509)', value: '+509'},
            { id: 'HM', text: 'Heard Island & Mcdonald Islands (+61)', value: '+61'},
            { id: 'VA', text: 'Holy See (Vatican City State) (+39)', value: '+39'},
            { id: 'HN', text: 'Honduras (+504)', value: '+504'},
            { id: 'HK', text: 'Hong Kong (+852)', value: '+852'},
            { id: 'HU', text: 'Hungary (+36)', value: '+36'},
            { id: 'IS', text: 'Iceland (+354)', value: '+354'},
            { id: 'IN', text: 'India(+91)', value: '+91'},
            { id: 'ID', text: 'Indonesia (+62)', value: '+62'},
            { id: 'IR', text: 'Iran, Islamic Republic Of (+98)', value: '+98'},
            { id: 'IQ', text: 'Iraq (+964)', value: '+964'},
            { id: 'IE', text: 'Ireland (+353)', value: '+353'},
            { id: 'IM', text: 'Isle Of Man (+44)', value: '+44'},
            { id: 'IL', text: 'Israel (+972)', value: '+975'},
            { id: 'IT', text: 'Italy (+39)', value: '+39'},
            { id: 'JM', text: 'Jamaica (+1876)', value: '+1876'},
            { id: 'JP', text: 'Japan (+81)', value: '+81'},
            { id: 'JE', text: 'Jersey (+44-1534)', value: '+44-1534'},
            { id: 'JO', text: 'Jordan (+962)', value: '+962'},
            { id: 'KZ', text: 'Kazakhstan (+7)', value: '+7'},
            { id: 'KE', text: 'Kenya (+254)', value: '+254'},
            { id: 'KI', text: 'Kiribati (+686)', value: '+686'},
            { id: 'KP', text: 'Korea - North (+850)', value: '+850'},
            { id: 'KR', text: 'Korea - South (+82)', value: '+82'},
            { id: 'KW', text: 'Kuwait (+965)', value: '+965'},
            { id: 'KG', text: 'Kyrgyzstan (+996)', value: '+996'},
            { id: 'LA', text: 'Lao People\'s Democratic Republic (+856)', value: '+856'},
            { id: 'LV', text: 'Latvia (+371)', value: '+371'},
            { id: 'LB', text: 'Lebanon (+961)', value: '+961'},
            { id: 'LS', text: 'Lesotho (+266)', value: '+266'},
            { id: 'LR', text: 'Liberia (+231)', value: '+231'},
            { id: 'LY', text: 'Libyan Arab Jamahiriya (+218)', value: '+218'},
            { id: 'LI', text: 'Liechtenstein (+417)', value: '+417'},
            { id: 'LT', text: 'Lithuania (+370)', value: '+370'},
            { id: 'LU', text: 'Luxembourg (+352)', value: '+352'},
            { id: 'MO', text: 'Macao (+853)', value: '+853'},
            { id: 'MK', text: 'Macedonia (+389)', value: '+389'},
            { id: 'MG', text: 'Madagascar (+261)', value: '+261'},
            { id: 'MW', text: 'Malawi (+265)', value: '+265'},
            { id: 'MY', text: 'Malaysia (+60)', value: '+60'},
            { id: 'MV', text: 'Maldives (+960)', value: '+960'},
            { id: 'ML', text: 'Mali (+223)', value: '+223'},
            { id: 'MT', text: 'Malta (+356)', value: '+356'},
            { id: 'MH', text: 'Marshall Islands (+692)', value: '+692'},
            { id: 'MQ', text: 'Martinique (+596)', value: '+596'},
            { id: 'MR', text: 'Mauritania (+222)', value: '+222'},
            { id: 'MU', text: 'Mauritius (+230)', value: '+230'},
            { id: 'YT', text: 'Mayotte (+269)', value: '+269'},
            { id: 'MX', text: 'Mexico (+52)', value: '+52'},
            { id: 'FM', text: 'Micronesia, Federated States Of (+691)', value: '+691'},
            { id: 'MD', text: 'Moldova (+373)', value: '+373'},
            { id: 'MC', text: 'Monaco (+377)', value: '+377'},
            { id: 'MN', text: 'Mongolia (+976)', value: '+976'},
            { id: 'ME', text: 'Montenegro (+382)', value: '+382'},
            { id: 'MS', text: 'Montserrat (+1664)', value: '+1664'},
            { id: 'MA', text: 'Morocco (+212)', value: '+212'},
            { id: 'MZ', text: 'Mozambique (+258)', value: '+258'},
            { id: 'MM', text: 'Myanmar (+95)', value: '+95'},
            { id: 'NA', text: 'Namibia (+264)', value: '+264'},
            { id: 'NR', text: 'Nauru (+674)', value: '+674'},
            { id: 'NP', text: 'Nepal (+977)', value: '+977'},
            { id: 'NL', text: 'Netherlands (+31)', value: '+31'},
            { id: 'AN', text: 'Netherlands Antilles (+599)', value: '+599'},
            { id: 'NC', text: 'New Caledonia (+687)', value: '+687'},
            { id: 'NZ', text: 'New Zealand (+64)', value: '+64'},
            { id: 'NI', text: 'Nicaragua (+505)', value: '+505'},
            { id: 'NE', text: 'Niger (+227)', value: '+227'},
            { id: 'NG', text: 'Nigeria (+234)', value: '+234'},
            { id: 'NU', text: 'Niue (+683)', value: '+683'},
            { id: 'NF', text: 'Norfolk Island (+672)', value: '+672'},
            { id: 'MP', text: 'Northern Mariana Islands (+670)', value: '+670'},
            { id: 'NO', text: 'Norway (+47)', value: '+47'},
            { id: 'OM', text: 'Oman (+968)', value: '+968'},
            { id: 'PK', text: 'Pakistan (+92)', value: '+92'},
            { id: 'PW', text: 'Palau (+680)', value: '+680'},
            { id: 'PS', text: 'Palestinian Territory (+970)', value: '+970'},
            { id: 'PA', text: 'Panama (+507)', value: '+507'},
            { id: 'PG', text: 'Papua New Guinea (+675)', value: '+675'},
            { id: 'PY', text: 'Paraguay (+595)', value: '+595'},
            { id: 'PE', text: 'Peru (+51)', value: '+51'},
            { id: 'PH', text: 'Philippines (+63)', value: '+63'},
            { id: 'PN', text: 'Pitcairn (+64)', value: '+64'},
            { id: 'PL', text: 'Poland (+48)', value: '+48'},
            { id: 'PT', text: 'Portugal (+351)', value: '+351'},
            { id: 'PR', text: 'Puerto Rico (+1787)', value: '+1787'},
            { id: 'QA', text: 'Qatar (+974)', value: '+974'},
            { id: 'RE', text: 'Reunion (+262)', value: '+262'},
            { id: 'RO', text: 'Romania (+40)', value: '+40'},
            { id: 'RU', text: 'Russian Federation (+7)', value: '+7'},
            { id: 'RW', text: 'Rwanda (+250)', value: '+250'},
            { id: 'BL', text: 'Saint Barthelemy (+590)', value: '+590'},
            { id: 'SH', text: 'Saint Helena (+290)', value: '+94'},
            { id: 'KN', text: 'Saint Kitts And Nevis (+1869)', value: '+94'},
            { id: 'LC', text: 'Saint Lucia (+1758)', value: '+94'},
            { id: 'MF', text: 'Saint Martin (+590)', value: '+590'},
            { id: 'PM', text: 'Saint Pierre And Miquelon (+508)', value: '+508'},
            { id: 'VC', text: 'Saint Vincent And Grenadines (+1-784)', value: '+1-784'},
            { id: 'WS', text: 'Samoa (+685)', value: '+685'},
            { id: 'SM', text: 'San Marino (+378)', value: '+378'},
            { id: 'ST', text: 'Sao Tome And Principe (+239)', value: '+239'},
            { id: 'SA', text: 'Saudi Arabia (+966)', value: '+966'},
            { id: 'SN', text: 'Senegal (+221)', value: '+221'},
            { id: 'RS', text: 'Serbia (+381)', value: '+381'},
            { id: 'SC', text: 'Seychelles (+248)', value: '+248'},
            { id: 'SL', text: 'Sierra Leone (+232)', value: '+232'},
            { id: 'SG', text: 'Singapore (+65)', value: '+65'},
            { id: 'SK', text: 'Slovakia (+421)', value: '+421'},
            { id: 'SI', text: 'Slovenia (+386)', value: '+386'},
            { id: 'SB', text: 'Solomon Islands (+677)', value: '+677'},
            { id: 'SO', text: 'Somalia (+252)', value: '+252'},
            { id: 'ZA', text: 'South Africa (+27)', value: '+27'},
            { id: 'GS', text: 'South Georgia And Sandwich Isl. (+500)', value: '+500'},
            { id: 'ES', text: 'Spain (+34)', value: '+34'},
            { id: 'LK', text: 'Sri Lanka (+94)', value: '+94'},
            { id: 'SD', text: 'Sudan (+249)', value: '+249'},
            { id: 'SR', text: 'Suriname (+597)', value: '+597'},
            { id: 'SJ', text: 'Svalbard And Jan Mayen (+47)', value: '+47'},
            { id: 'SZ', text: 'Swaziland (+268)', value: '+268'},
            { id: 'SE', text: 'Sweden (+46)', value: '+46'},
            { id: 'CH', text: 'Switzerland (+41)', value: '+41'},
            { id: 'SY', text: 'Syrian Arab Republic (+963)', value: '+963'},
            { id: 'TW', text: 'Taiwan (+886)', value: '+886'},
            { id: 'TJ', text: 'Tajikistan (+992)', value: '+992'},
            { id: 'TZ', text: 'Tanzania (+255)', value: '+255'},
            { id: 'TH', text: 'Thailand (+66)', value: '+66'},
            { id: 'TL', text: 'Timor-Leste (+670)', value: '+670'},
            { id: 'TG', text: 'Togo (+228)', value: '+228'},
            { id: 'TK', text: 'Tokelau (+690)', value: '+690'},
            { id: 'TO', text: 'Tonga (+676)', value: '+676'},
            { id: 'TT', text: 'Trinidad And Tobago (+1868)', value: '+1868'},
            { id: 'TN', text: 'Tunisia (+216)', value: '+216'},
            { id: 'TR', text: 'Turkey (+90)', value: '+90'},
            { id: 'TM', text: 'Turkmenistan (+993)', value: '+993'},
            { id: 'TC', text: 'Turks And Caicos Islands (+1649)', value: '+1649'},
            { id: 'TV', text: 'Tuvalu (+688)', value: '+668'},
            { id: 'UG', text: 'Uganda (+256)', value: '+256'},
            { id: 'UA', text: 'Ukraine (+380)', value: '+380'},
            { id: 'AE', text: 'United Arab Emirates (+971)', value: '+971'},
            { id: 'GB', text: 'United Kingdom (+44)', value: '+44'},
            { id: 'US', text: 'United States (+1)', value: '+1'},
            { id: 'UM', text: 'United States Outlying Islands (+1-340)', value: '+1-340'},
            { id: 'UY', text: 'Uruguay (+598)', value: '+598'},
            { id: 'UZ', text: 'Uzbekistan (+998)', value: '+998'},
            { id: 'VU', text: 'Vanuatu (+678)', value: '+678'},
            { id: 'VE', text: 'Venezuela (+58)', value: '+58'},
            { id: 'VN', text: 'Vietnam (+84)', value: '+84'},
            { id: 'VG', text: 'Virgin Islands, British (+1)', value: '+1'},
            { id: 'VI', text: 'Virgin Islands, U.S. (+1)', value: '+1'},
            { id: 'WF', text: 'Wallis And Futuna (+681)', value: '+681'},
            { id: 'EH', text: 'Western Sahara (+212)', value: '+212'},
            { id: 'YE', text: 'Yemen (North)(+969)', value: '+969'},
            { id: 'YE', text: 'Yemen (South)(+967)', value: '+967'},
            { id: 'ZM', text: 'Zambia (+260)', value: '+260'},
            { id: 'ZW', text: 'Zimbabwe (+263)', value: '+263'}
        ];
        function formatCountry (country) {
            if (!country.id) { return country.text; }
            var $country = $(
                '<span class="flag-icon flag-icon-'+ country.id.toLowerCase() +' flag-icon-squared"></span>' +
                '<span class="flag-text" style="margin-left: 5px;">'+ country.text+"</span>"
            );
            return $country;
        }
        function format(state) {
            if(state.selected == true){
                var country = $('input[name=country]');
                country.val(state.text);
                if(state.value != undefined){
                    var phone = state.value.replace("+","");
                    localStorage.setItem("phone", phone);
                }
            }
            if (!state.id) return state.text;
            var $state = $(
                '<span class="flag-icon flag-icon-'+ state.id.toLowerCase() +' flag-icon-squared"></span>' +
                '<span class="flag-text" style="margin-left: 5px;">'+ state.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\-*\s*/g,"").replace(/,/g,"").replace(/'/g,"").replace(/&/g,"") +"</span>");
            return $state;
        }
        if(window.location.pathname != '/signin.html' || window.location.pathname != '/ru/signin.html' || window.location.pathname != '/pt/signin.html' ||
            window.location.pathname != '/why.html' || window.location.pathname != '/ru/why.html' || window.location.pathname != '/pt/why.html' ||
            window.location.pathname != '/terms.html' || window.location.pathname != '/ru/terms.html' || window.location.pathname != '/pt/terms.html'){
            $.ajax({
                url: "/hr/public/getUserLocation",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                //beforeSend: function (xhr) {
                //
                //},
                complete: function(resp){
                    $.each(isoCountries, function(index, value) {
                        if(resp.responseJSON.countryCode != undefined && resp.responseJSON.countryCode == value.id){
                            if(window.location.pathname == '/signup.html' || window.location.pathname == '/ru/signup.html' || window.location.pathname == '/pt/signup.html'){
                                //fb
                                $('#signupFacebookForm').find('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\s*/g,"").replace(/,/g,"")+"</span>";
                                $('#signupFacebookForm').find('.select2-selection__rendered')[0].title =  value.text;
                                //end fb
                                //google
                                $('#signupGoogleForm').find('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\s*/g,"").replace(/,/g,"")+"</span>";
                                $('#signupGoogleForm').find('.select2-selection__rendered')[0].title =  value.text;
                                //end google
                            }
                            //our project
                            $('.select2-selection__rendered')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\-*\s*/g,"").replace(/,/g,"").replace(/'/g,"").replace(/&/g,"")+"</span>";
                            $('.select2-selection__rendered')[0].title = value.text;
                            //end our project
                            $($('.select2-selection--single')).css('border','1px solid #E5E5E6');
                            var country = $('input[name=country]');
                            country.val(value.text);
                            var phone = $('.countryCustom');
                            phone.value = value.value.replace("+","");
                            localStorage.setItem("phone",  phone.value);
                        }
                    });
                }
            });
        }
        $("[name='countryCustom']").select2({
            placeholder: "Select a country",
            templateResult: formatCountry,
            templateSelection: format,
            data: isoCountries
        });
    });
})(jQuery);