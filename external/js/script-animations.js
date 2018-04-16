var mailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
$(document).ready(function(){
    $(".oneRecrTable img").click(function(e){
        var clicked = $(".clickedOneRecr");
        clicked.animate({opacity: '1'}, "slow");
        //console.log($(this));
        $('body').on("touchstart", function(e) {
            if (clicked.has(e.target).length === 0) {
                clicked.css('opacity', '0');
                $(document).off('mouseup');
            }
        });
    });
    $(".teamWorkTable img").click(function(e){
        var clicked = $(".clickedTeamWork");
        clicked.animate({opacity: '1'}, "slow");
        //console.log($(this));
        $('body').on("touchstart", function(e) {
            if (clicked.has(e.target).length === 0) {
                clicked.css('opacity', '0');
                $(document).off('mouseup');
            }
        });
    });
    $(".corporateTable img").click(function(e){
        var clicked = $(".clickedCorporate");
        clicked.animate({opacity: '1'}, "slow");
        //console.log($(this));
        $('body').on("touchstart", function(e) {
            if (clicked.has(e.target).length === 0) {
                clicked.css('opacity', '0');
                $(document).off('mouseup');
            }
        });
    });
    $(".enterPrizeTable img").click(function(e){
        var clicked = $(".clickedEnterPrize");
        clicked.animate({opacity: '1'}, "slow");
        //console.log($(this));
        $('body').on("touchstart", function(e) {
            if (clicked.has(e.target).length === 0) {
                clicked.css('opacity', '0');
                $(document).off('mouseup');
            }
        });
    });
    $(".potokTable img").click(function(e){
        var clicked = $(".clickedPotok");
        clicked.css({'display': 'inline-block', 'z-index': 1});
        clicked.animate({opacity: '1'}, "slow");
        $('body').on("touchstart", function(e) {
            if (clicked.has(e.target).length === 0) {
                clicked.css({'opacity': 0, 'z-index': -1});
                clicked.hide();
                $(document).off('mouseup');
            }
        });
    });
    //$(".clickedCs").style('display', 'none');
    //$(".clickedPotok").style('display', 'none');
    //$(".clickedPayFree").style('display', 'none');
    //$(".clickedSaveClient").style('display', 'none');
    //$(".clickedWithoutIntegration").style('display', 'none');
    $(".csTable img").click(function(e){
        var clicked = $(".clickedCs");
        clicked.css({'display': 'inline-block', 'z-index': 1});
        clicked.animate({opacity: 1}, "slow");
        $('body').on("touchstart", function(e) {
            if (clicked.has(e.target).length === 0) {
                clicked.css({'opacity': 0, 'z-index': -1});
                //clicked.hide();
                $(document).off('mouseup');
            }
        });
    });
    if($( window ).width() < 768){
        $(".four-pay-1-free").click(function(e){
            var clicked = $(".clickedPayFree");
            clicked.css({'display': 'inline-block', 'z-index': 1});
            clicked.animate({opacity: 1}, "slow");
            $('body').on("touchstart", function(e) {
                if (clicked.has(e.target).length === 0) {
                    clicked.css({'opacity': 0, 'z-index': -1});
                    //clicked.hide();
                    $(document).off('mouseup');
                }
            });
        });
        $(".saveClientInSystem").click(function(e){
            var clicked = $(".clickedSaveClient");
            clicked.css({'display': 'inline-block', 'z-index': 1});
            clicked.animate({opacity: 1}, "slow");
            $('body').on("touchstart", function(e) {
                if (clicked.has(e.target).length === 0) {
                    clicked.css({'opacity': 0, 'z-index': -1});
                    //clicked.hide();
                    $(document).off('mouseup');
                }
            });
        });
        $(".withoutIntegration").click(function(e){
            var clicked = $(".clickedWithoutIntegration");
            clicked.css({'display': 'inline-block', 'z-index': 1});
            clicked.animate({opacity: 1}, "slow");
            $('body').on("touchstart", function(e) {
                if (clicked.has(e.target).length === 0) {
                    clicked.css({'opacity': 0, 'z-index': -1});
                    //clicked.hide();
                    $(document).off('mouseup');
                }
            });
        });
        $(".search-criteria-for-friendwork").click(function(e){
            var clicked = $(".clickedStyleSearchCriteriaForFriendWork");
            clicked.css({'display': 'inline-block', 'z-index': 1});
            clicked.animate({opacity: 1}, "slow");
            $('body').on("touchstart", function(e) {
                if (clicked.has(e.target).length === 0) {
                    clicked.css({'opacity': 0, 'z-index': -1});
                    //clicked.hide();
                    $(document).off('mouseup');
                }
            });
        });
        $(".search-criteria-for-cs").click(function(e){
            var clicked = $(".clickedStyleSearchCriteriaForCs");
            clicked.css({'display': 'inline-block', 'z-index': 1});
            clicked.animate({opacity: 1}, "slow");
            $('body').on("touchstart", function(e) {
                if (clicked.has(e.target).length === 0) {
                    clicked.css({'opacity': 0, 'z-index': -1});
                    //clicked.hide();
                    $(document).off('mouseup');
                }
            });
        });
        $(".export-excel").click(function(e){
            var clicked = $(".clickedStyleExportExcel");
            clicked.css({'display': 'inline-block', 'z-index': 1});
            clicked.animate({opacity: 1}, "slow");
            $('body').on("touchstart", function(e) {
                if (clicked.has(e.target).length === 0) {
                    clicked.css({'opacity': 0, 'z-index': -1});
                    //clicked.hide();
                    $(document).off('mouseup');
                }
            });
        });
        $(".setting-stage").click(function(e){
            var clicked = $(".clickedStyleSettingStage");
            clicked.css({'display': 'inline-block', 'z-index': 1});
            clicked.animate({opacity: 1}, "slow");
            $('body').on("touchstart", function(e) {
                if (clicked.has(e.target).length === 0) {
                    clicked.css({'opacity': 0, 'z-index': -1});
                    //clicked.hide();
                    $(document).off('mouseup');
                }
            });
        });
    }
	$(".menu").on("click","a", function (event) {
		
		event.preventDefault();

		var id  = $(this).attr('href'),

			top = $(id).offset().top;
		
		$('body,html').animate({scrollTop: top}, 1500);
	});
    $('#knowMore').on('click',function(){
        var resVal = $("#knowMoreInput").val();
        resetError();
        $.ajax({
            url: "/hr/public/emailUniqueProcesses",
            type: "GET",
            data: "email=" + resVal,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function(xhr){
                if (resVal == 0) {
                    xhr.abort();
                    $('.emptyMailSpecial').fadeIn();
                    enter_loading = false;
                    return false;
                }
                if (!mailPattern.test(resVal)) {
                    xhr.abort();
                    $('.wrongMailSpecial').fadeIn();
                    enter_loading = false;
                    return false;
                }
            },
            success: function(){
                console.log(2);
            },
            complete: function(){
                $('#formUnique').fadeOut(500);
                $('.tyMessage').delay(500).fadeIn();
            }
        });
    });
    $('.corner-ribbon').on('mouseenter', function () {
       $('.corner-ribbon-info').show()
           .animate({
               opacity: 1,
           }, 500);
    });
    $('.corner-ribbon').on('mouseleave', function () {
        $('.corner-ribbon-info')
            .animate({
                opacity: 0,
            }, 500, function () {
                $('.corner-ribbon-info').hide();
            });
    });
    $('.rusIcon').on('mouseenter', function () {
        $('.useRusServers').show()
            .animate({
                opacity: 1,
            }, 500);
    });
    $('.rusIcon').on('mouseleave', function () {
        $('.useRusServers')
            .animate({
                opacity: 0,
            }, 500, function () {
                $('.useRusServers').hide();
            });
    });
    $('#blog').on('click', function() {
       window.open('https://cleverstaff.net/blog/', '_blank');
    });
    $('#downloadTermsEng').on('click', function () {
        var link = document.createElement("a");
        link.download = '';
        link.href = 'https://cleverstaff.net/CleverStaff_Public_offer_of_service_agreement.pdf';
        link.click();
    });
    $('#downloadTermsRu').on('click', function () {
        var link = document.createElement("a");
        link.download = '';
        link.href = 'https://cleverstaff.net/CleverStaff_ДОГОВОР_ПУБЛИЧНОЙ_ОФЕРТЫ.pdf';
        link.click();
    });
    //$('#menuFunc').click(function() {
    //    $('.menuLanding').show("slow");
    //    $('body').mouseup(function (e) {
    //        if ($('.menuLanding').has(e.target).length === 0) {
    //            $('.menuLanding').slideUp();
    //            $(document).off('mouseup');
    //        }
    //    });
    //});
    $('#menuFunc').click(function() {
        $('.menuLanding').toggle("slide");
    });

    $(window).scroll(function(){
        var sticky = $('.prices-block'),
            scroll = $(window).scrollTop();
        console.log(scroll);
        var pc = 1200;
        var big_tablet = 991;
        var tablet = 767;
        var phone_or_tablet = 600;
        var phone = 440;
        var iphone8Plus = 414;
        var iphone7 = 375;
        var mini_phone = 320;
        if(window.location.pathname == '/ru/compare-potok.html' || window.location.pathname == '/ru/compare-friendwork.html'){
            var tablet_690 = 697;
            phone_or_tablet = 650;
            var phone_or_tablet_600 = 600;
            phone = 550;
            var mini_phone_457 = 457;
            mini_phone = 440;
            var mini_phone_428 = 428;
            var mini_phone_375 = 375;
            var mini_phone_367_friendwork = 367;
            var mini_phone_335 = 335;
            var mini_phone_329 = 329;
            if(big_tablet >= $( window ).width() || pc >= $( window ).width()){
                $('.titleTable').css('width', '100%');
            }
            if(tablet >= $( window ).width()){
                $('.titleTable .widthChild').css('width', $('.content .border-radius-first')[0].offsetWidth);
                $('.lastTable .width').css('width', $('.content .border-radius-first')[0].offsetWidth);
                $('.lastTable .greyColor').css('width', 'inherit');
                $('.lastTable .greenColor').css('width', 'inherit');
                $('.titleTable .potokTable').css('width', 'inherit');
                $('.titleTable .csTable').css('width', 'inherit');
                $('.titleTable').css('width', $('.content')[0].offsetWidth);
                $('.lastTable').css('width', $('.content')[0].offsetWidth);
                if (scroll >= 276){
                    $('.hideTab').removeClass('hidden');
                    $('.titleTable').addClass('fixed-tab');
                } else{
                    $('.titleTable').removeClass('fixed-tab');
                    $('.hideTab').addClass('hidden');
                }
                if(window.location.pathname == '/ru/compare-potok.html'){
                    if (scroll >= 722) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }else if(window.location.pathname == '/ru/compare-friendwork.html'){
                    if (scroll >= 844) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }
            }
            if(tablet_690 >= $( window ).width()){
                //$('.titleTable .widthChild').css('width', $('.content .border-radius-first')[0].offsetWidth + 40);
                $('.titleTable').css('width', $('.content')[0].offsetWidth);
                $('.lastTable').css('width', $('.content')[0].offsetWidth);
                if (scroll >= 274){
                    $('.hideTab').removeClass('hidden');
                    $('.titleTable').addClass('fixed-tab');
                } else{
                    $('.titleTable').removeClass('fixed-tab');
                    $('.hideTab').addClass('hidden');
                }
                if(window.location.pathname == '/ru/compare-potok.html'){
                    if (scroll >= 723) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }else if(window.location.pathname == '/ru/compare-friendwork.html'){
                    if (scroll >= 863) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }
            }
            if(phone_or_tablet >= $( window ).width()){
                //$('.titleTable .widthChild').css('width', $('.content .border-radius-first')[0].offsetWidth);
                $('.titleTable').css('width', $('.content')[0].offsetWidth);
                $('.lastTable').css('width', $('.content')[0].offsetWidth);
                if (scroll >= 274){
                    $('.hideTab').removeClass('hidden');
                    $('.titleTable').addClass('fixed-tab');
                } else{
                    $('.titleTable').removeClass('fixed-tab');
                    $('.hideTab').addClass('hidden');
                }
                if(window.location.pathname == '/ru/compare-potok.html'){
                    if (scroll >= 780) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }else if(window.location.pathname == '/ru/compare-friendwork.html'){
                    if (scroll >= 908) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }
            }
            if(phone_or_tablet_600 >= $( window ).width()){
                $('.titleTable .potokTable').css('width', $('.content .active')[0].offsetWidth);
                $('.titleTable .csTable').css('width', $('.content .success')[0].offsetWidth);
                $('.lastTable .greyColor').css('width', $('.content .active')[0].offsetWidth);
                $('.lastTable .greenColor').css('width', $('.content .success')[0].offsetWidth);
                $('.titleTable .widthChild').css('width', $('.content .border-radius-first')[0].offsetWidth);
                $('.lastTable .width').css('width', $('.content .border-radius-first')[0].offsetWidth);
                $('.titleTable').css('width', $('.content')[0].offsetWidth);
                $('.lastTable').css('width', $('.content')[0].offsetWidth);
                if(window.location.pathname == '/ru/compare-potok.html'){
                    if (scroll >= 274){
                        $('.hideTab').removeClass('hidden');
                        $('.titleTable').addClass('fixed-tab');
                    } else{
                        $('.titleTable').removeClass('fixed-tab');
                        $('.hideTab').addClass('hidden');
                    }
                }else if(window.location.pathname == '/ru/compare-friendwork.html'){
                    if (scroll >= 322){
                        $('.hideTab').removeClass('hidden');
                        $('.titleTable').addClass('fixed-tab');
                    } else{
                        $('.titleTable').removeClass('fixed-tab');
                        $('.hideTab').addClass('hidden');
                    }
                }
                if(window.location.pathname == '/ru/compare-potok.html'){
                    if (scroll >= 723) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }else if(window.location.pathname == '/ru/compare-friendwork.html'){
                    if (scroll >= 875) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }
            }
            if(phone >= $( window ).width()){
                $('.titleTable').css('width', $('.content')[0].offsetWidth);
                if (scroll >= 322){
                    $('.hideTab').removeClass('hidden');
                    $('.titleTable').addClass('fixed-tab');
                } else{
                    $('.titleTable').removeClass('fixed-tab');
                    $('.hideTab').addClass('hidden');
                }
                if(window.location.pathname == '/ru/compare-potok.html'){
                    if (scroll >= 772) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }else if(window.location.pathname == '/ru/compare-friendwork.html'){
                    if (scroll >= 1050) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }
            }
            if(mini_phone_457 >= $( window ).width()){
                $('.titleTable').css('width', $('.content')[0].offsetWidth);
                if (scroll >= 368){
                    $('.hideTab').removeClass('hidden');
                    $('.titleTable').addClass('fixed-tab');
                } else{
                    $('.titleTable').removeClass('fixed-tab');
                    $('.hideTab').addClass('hidden');
                }
                if(window.location.pathname == '/ru/compare-potok.html'){
                    if (scroll >= 895) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }else if(window.location.pathname == '/ru/compare-friendwork.html'){
                    if (scroll >= 1095) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }
            }
            if(mini_phone >= $( window ).width()){
                $('.titleTable').css('width', $('.content')[0].offsetWidth);
                if (scroll >= 368){
                    $('.hideTab').removeClass('hidden');
                    $('.titleTable').addClass('fixed-tab');
                } else{
                    $('.titleTable').removeClass('fixed-tab');
                    $('.hideTab').addClass('hidden');
                }
                if(window.location.pathname == '/ru/compare-potok.html'){
                    if (scroll >= 876) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }else if(window.location.pathname == '/ru/compare-friendwork.html'){
                    if (scroll >= 1031) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }
            }
            if(mini_phone_428 >= $( window ).width()){
                $('.titleTable').css('width', $('.content')[0].offsetWidth);
                if (scroll >= 366){
                    $('.hideTab').removeClass('hidden');
                    $('.titleTable').addClass('fixed-tab');
                } else{
                    $('.titleTable').removeClass('fixed-tab');
                    $('.hideTab').addClass('hidden');
                }
                if(window.location.pathname == '/ru/compare-potok.html'){
                    if (scroll >= 884) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }else if(window.location.pathname == '/ru/compare-friendwork.html'){
                    if (scroll >= 1090) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }
            }
            if(mini_phone_375 >= $( window ).width()){
                $('.titleTable').css('width', $('.content')[0].offsetWidth);
                if (scroll >= 367){
                    $('.hideTab').removeClass('hidden');
                    $('.titleTable').addClass('fixed-tab');
                } else{
                    $('.titleTable').removeClass('fixed-tab');
                    $('.hideTab').addClass('hidden');
                }
                if(window.location.pathname == '/ru/compare-potok.html'){
                    if (scroll >= 986) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }else if(window.location.pathname == '/ru/compare-friendwork.html'){
                    if (scroll >= 1234) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }
            }

            if(mini_phone_335 >= $( window ).width()){
                $('.titleTable .widthChild').css('width', $('.content .border-radius-first')[0].offsetWidth);
                $('.lastTable .width').css('width', $('.content .border-radius-first')[0].offsetWidth);
                $('.titleTable').css('width', $('.content')[0].offsetWidth);
                if (scroll >= 367){
                    $('.hideTab').removeClass('hidden');
                    $('.titleTable').addClass('fixed-tab');
                } else{
                    $('.titleTable').removeClass('fixed-tab');
                    $('.hideTab').addClass('hidden');
                }
                if(window.location.pathname == '/ru/compare-potok.html'){
                    if (scroll >= 1028) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }else if(window.location.pathname == '/ru/compare-friendwork.html'){
                    if (scroll >= 1235) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }
            }
            if(mini_phone_329 >= $( window ).width()){
                $('.titleTable .widthChild').css('width', $('.content .border-radius-first')[0].offsetWidth);
                $('.lastTable .width').css('width', $('.content .border-radius-first')[0].offsetWidth);
                $('.titleTable').css('width', $('.content')[0].offsetWidth);
                if (scroll >= 368){
                    $('.hideTab').removeClass('hidden');
                    $('.titleTable').addClass('fixed-tab');
                } else{
                    $('.titleTable').removeClass('fixed-tab');
                    $('.hideTab').addClass('hidden');
                }
                if(window.location.pathname == '/ru/compare-potok.html'){
                    if (scroll >= 1027) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }else if(window.location.pathname == '/ru/compare-friendwork.html'){
                    if (scroll >= 1265) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }
            }
            if(window.location.pathname == '/ru/compare-friendwork.html'){
                if(mini_phone_367_friendwork >= $( window ).width()){
                    $('.titleTable').css('width', $('.content')[0].offsetWidth);
                    if (scroll >= 415){
                        $('.hideTab').removeClass('hidden');
                        $('.titleTable').addClass('fixed-tab');
                    } else{
                        $('.titleTable').removeClass('fixed-tab');
                        $('.hideTab').addClass('hidden');
                    }
                    if (scroll >= 1152) {
                        $('.hideTab').addClass('hidden');
                        $('.titleTable').removeClass('fixed-tab');
                    }
                }
            }
        }
        if(window.location.pathname == '/ru/price.html'){
            $('.titleTable2 .plans').css('width', $('.active')[2].offsetWidth);
            $('.titleTable .plans').css('width', $('.active')[2].offsetWidth);
            $('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth);
            $('.titleTable2 td:first-child').css('width', $('.customWidth')[0].offsetWidth);
            if (scroll >= 1291){
                //console.log('under > 1200');
                $('.table-before-support-block td:first-child').css('width', $('.support td:first-child')[0].offsetWidth);
                $('.support td:first-child').css('width', $('.table-before-support-block td:first-child')[0].offsetWidth);
                sticky.addClass('fixed-plans');
                sticky.removeClass('hidden');
            } else{
                $('.titleTable').css({'display': 'block', 'width': '100%'});
                sticky.removeClass('fixed-plans');
                sticky.addClass('hide-block');
                $('hide-block').css("height", "50px");
            }

            if (scroll >= 3120) {
                sticky.removeClass('fixed-plans');
            }
            if(scroll){
                $('.plans').css('visibility', 'visible');
            }
            if(pc >= $( window ).width()){
                //console.log('pc');
                $('.table-before-support-block td:first-child').css('width', $('.support td:first-child')[0].offsetWidth);
                $('.support td:first-child').css('width', $('.table-before-support-block td:first-child')[0].offsetWidth);
                if (scroll >= 1502){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 3800) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(big_tablet >= $( window ).width()){
                $('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth + 2);
                $('.table td:not(:first-child)').css('width', 120);
                if (scroll >= 1810){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 4030) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(tablet >= $( window ).width()){
                //console.log('tablet');
                $('.support td:not(:first-child)').css('width', $('.active')[2].offsetWidth);
                $('.support td:first-child').css('width', $('.customWidth')[0].offsetWidth);
                $('.titleTable .plans').css('width', $('.active')[2].offsetWidth + 1);
                $('.titleTable2 .plans').css('width', $('.active')[2].offsetWidth);
                $('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth + 10);
                if (scroll >= 2697){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block').css('height', '50px');
                }

                if (scroll >= 4820) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(phone_or_tablet >= $( window ).width()){
                //console.log('phone_or_tablet');
                $('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth + 5);
                if (scroll >= 2686){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block').css('height', '50px');
                }
                if (scroll >= 5157) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(phone >= $( window ).width()){
                //console.log('phone');
                $('.hide-block').css('height', '60px');
                //$('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth + 10);
                if (scroll >= 2861){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 5711) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(iphone8Plus == $( window ).width()){
                //console.log('iphone8Plus');
                if (scroll >= 2881){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 6102) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(iphone7 == $( window ).width()){
                //console.log('iphone7');
                if (scroll >= 2881){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 6321) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(mini_phone == $( window ).width()){
                //console.log('mini_phone ==');
                $('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth + 80);
                if (scroll >= 2884){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 6548) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(mini_phone > $( window ).width()){
                $('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth + 50);
                if (scroll >= 2881){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 6445) {
                    sticky.removeClass('fixed-plans');
                }
            }
        }else if(window.location.pathname == '/price.html'){
            if (scroll >= 1291){
                //console.log('under > 1200');
                $('.titleTable2 .plans').css('width', $('.active')[2].offsetWidth);
                $('.titleTable .plans').css('width', $('.active')[2].offsetWidth);
                $('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth);
                $('.titleTable2 td:first-child').css('width', $('.customWidth')[0].offsetWidth);
                $('.table-before-support-block td:first-child').css('width', $('.support td:first-child')[0].offsetWidth);
                $('.support td:first-child').css('width', $('.table-before-support-block td:first-child')[0].offsetWidth);
                sticky.addClass('fixed-plans');
                sticky.removeClass('hidden');
            } else{
                $('.titleTable').css({'display': 'block', 'width': '100%'});
                sticky.removeClass('fixed-plans');
                sticky.addClass('hide-block');
                $('hide-block').css("height", "50px");
            }

            if (scroll >= 3071) {
                sticky.removeClass('fixed-plans');
            }
            if(scroll){
                $('.plans').css('visibility', 'visible');
            }
            if(pc >= $( window ).width()){
                //console.log('pc');
                $('.table-before-support-block td:first-child').css('width', $('.support td:first-child')[0].offsetWidth);
                $('.support td:first-child').css('width', $('.table-before-support-block td:first-child')[0].offsetWidth);
                if (scroll >= 1472){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }
                if (scroll >= 3529) {
                    //console.log('remove pc');
                    sticky.removeClass('fixed-plans');
                }
            }
            if(big_tablet >= $( window ).width()){
                //console.log('big_tablet');
                $('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth + 2);
                $('.table td:not(:first-child)').css('width', 120);
                if (scroll >= 1812){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 3861) {
                    console.log('remove big_tablet');
                    sticky.removeClass('fixed-plans');
                }
            }
            if(tablet >= $( window ).width()){
                //console.log('tablet');
                $('.support td:not(:first-child)').css('width', $('.active')[2].offsetWidth);
                $('.support td:first-child').css('width', $('.customWidth')[0].offsetWidth);
                $('.titleTable .plans').css('width', $('.active')[2].offsetWidth + 1);
                $('.titleTable2 .plans').css('width', $('.active')[2].offsetWidth);
                $('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth + 15);
                if (scroll >= 2701){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }
                if (scroll >= 4858) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(phone_or_tablet >= $( window ).width()){
                //console.log('phone_or_tablet');
                $('.titleTable td:first-child').css('width',  $('.customWidth')[0].offsetWidth + 5);
                $('.table-before-support-block td:first-child').css('width',  $('.customWidth')[0].offsetWidth);
                if (scroll >= 2701){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block').css('height', '50px');
                }
                if (scroll >= 4740) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(phone >= $( window ).width()){
                //console.log('phone');
                $('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth + 10);
                $('.hide-block').css('height', '60px');
                if (scroll >= 2800){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 5377) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(iphone8Plus == $( window ).width()){
                //console.log('iphone8Plus');
                if (scroll >= 2881){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 5527) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(iphone7 == $( window ).width()){
                //console.log('iphone7');
                if (scroll >= 2881){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 5726) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(mini_phone == $( window ).width()){
                //console.log('mini_phone ==');
                if (scroll >= 2758){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 6135) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(mini_phone > $( window ).width()){
                //console.log('mini_phone');
                $('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth + 45);
                if (scroll >= 2758){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 6370) {
                    sticky.removeClass('fixed-plans');
                }
            }
        }
    });
    new WOW().init();
    //$('#askQuestionSubmit').on('click',function(){
    //    var res = $("#questionForm").serializeObject();
    //    $('#emailQuestion, #nameQuestion, #textQuestion').css({
    //        "box-shadow":"none",
    //        "border":"1px solid rgba(255,255,255, 0.8)"
    //    });
    //    $.ajax({
    //        url: "/hr/public/question2Manager",
    //        type: "POST",
    //        data: JSON.stringify(res),
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        beforeSend: function (xhr) {
    //            if (res.email === '') {
    //                xhr.abort();
    //                $('#emailQuestion').css({
    //                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
    //                    "border":"1px solid rgb(245, 19, 19)"
    //                });
    //            }
    //            if (!mailPattern.test(res.email)) {
    //                xhr.abort();
    //                $('#emailQuestion').css({
    //                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
    //                    "border":"1px solid rgb(245, 19, 19)"
    //                });
    //            }
    //            if (res.name === '') {
    //                xhr.abort();
    //                $('#nameQuestion').css({
    //                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
    //                    "border":"1px solid rgb(245, 19, 19)"
    //                });
    //            }
    //            if (res.question === '') {
    //                xhr.abort();
    //                $('#textQuestion').css({
    //                    "box-shadow":"rgb(245, 19, 19) 0px 0px 10px",
    //                    "border":"1px solid rgb(245, 19, 19)"
    //                });
    //            }
    //        },
    //        complete: function(){
    //            $('#contact').slideUp('slow');
    //            $('.tyMessageQuestion').delay(800).fadeIn();
    //        }
    //    });
    //});
});