var mailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
$(document).ready(function(){
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
        console.log($('.active'));
        console.log($('.active')[2].offsetWidth);
        var pc = 1200;
        var big_tablet = 991;
        var tablet = 767;
        var phone_or_tablet = 600;
        var phone = 440;
        var mini_phone = 320;
        if(window.location.pathname == '/ru/price.html'){
            $('.titleTable2 .plans').css('width', $('.active')[2].offsetWidth);
            $('.titleTable .plans').css('width', $('.active')[2].offsetWidth);
            //$('.title').css('width', $('.customWidth')[0].offsetWidth);
            //$('.superFunc td:not(:first-child)').css('width', $('.firstTable td:nth-child(2)')[0].offsetWidth);
            //$('.support td:not(:first-child)').css('width', $('.firstTable td:nth-child(2)')[0].offsetWidth);
            $('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth);
            $('.titleTable2 td:first-child').css('width', $('.customWidth')[0].offsetWidth);
            if (scroll >= 1291){
                console.log('under > 1200');
                //$('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth);
                //$('.support td:first-child').css('width', $('.customWidth')[0].offsetWidth);
                $('.table-before-support-block td:first-child').css('width', $('.support td:first-child')[0].offsetWidth);
                $('.support td:first-child').css('width', $('.table-before-support-block td:first-child')[0].offsetWidth);
                //$('.table-before-support-block td:not(:first-child)').css('width', $('.support td:not(:first-child)')[0].offsetWidth);
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
                //console.log($('.support td:first-child')[0].offsetWidth);
                //console.log($('.support td:not(:first-child)')[0].offsetWidth);
                console.log('pc');
                //$('.titleTable td:first-child').css('width', $('.support td:first-child')[0].offsetWidth + 1);
                //$('.titleTable .plans').css('width', $('.active')[2].offsetWidth + 4);
                $('.table-before-support-block td:first-child').css('width', $('.support td:first-child')[0].offsetWidth);
                $('.support td:first-child').css('width', $('.table-before-support-block td:first-child')[0].offsetWidth);
                //$('.table-before-support-block td:not(:first-child)').css('width', $('.support td:not(:first-child)')[0].offsetWidth);
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
                //console.log('big_tablet');
                //$('.titleTable2 .plans').css('width', $('.superFunc td:not(:first-child)')[0].offsetWidth);
                //$('.titleTable .plans').css('width', $('.superFunc td:not(:first-child)')[0].offsetWidth);
                //$('.support td:first-child').css('width', $('.table-before-support-block td:first-child')[0].offsetWidth + 18);
                //$('.support td:not(:first-child)').css('width', $('.table-before-support-block td:not(:first-child)')[0].offsetWidth);
                //$('.table td:first-child').css('width', 216);
                $('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth + 2);
                //$('.table td:first-child').css('width', 'inherit');
                $('.table td:not(:first-child)').css('width', 120);
                //$('.titleTable td:first-child').css('width', $('.support td:first-child')[0].offsetWidth + 50);
                //$('.titleTable td:first-child').attr('style', 'width:'+$('.support td:first-child')[0].offsetWidth+'px!important');
                //$('.table-before-support-block td:not(:first-child)').css('width', $('.support td:not(:first-child)')[0].offsetWidth);
                //$('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth);
                //$('.titleTable2 td:first-child').css('width', $('.customWidth')[0].offsetWidth);
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
                console.log('tablet');
                //$('.table-before-support-block td:first-child').css('width', $('.support td:first-child')[0].offsetWidth);
                //$('.firstTable td:first-child').css('width', 138);
                //$('.table-before-support-block td:not(:first-child)').css('width', $('.support td:not(:first-child)')[0].offsetWidth);
                //$('.support td:not(:first-child)').css('width', $('.firstTable td:nth-child(2)')[0].offsetWidth);
                $('.support td:not(:first-child)').css('width', $('.active')[2].offsetWidth);
                $('.support td:first-child').css('width', $('.customWidth')[0].offsetWidth);
                //$('.table td:first-child').css('width',  $('.titleTable td:first-child')[0].offsetWidth);
                //console.log($('.table td:first-child'));
                //$('.table-before-support-block  td:first-child').css('width', '');
                //$('.table td:not(:first-child)').css('width', 120);
                //$('.titleTable td:first-child').css('width', $('.support td:first-child')[0].offsetWidth);
                $('.titleTable .plans').css('width', $('.active')[2].offsetWidth + 1);
                $('.titleTable2 .plans').css('width', $('.active')[2].offsetWidth);
                $('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth);
                if (scroll >= 2697){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block').css('height', '50px');
                }

                if (scroll >= 5145) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(phone_or_tablet >= $( window ).width()){
                console.log('phone_or_tablet');
                if (scroll >= 2714){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block').css('height', '50px');
                }

                if (scroll >= 5584) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(phone >= $( window ).width()){
                console.log('phone');
                $('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth);
                $('.support td:first-child').css('width', $('.table-before-support-block td:first-child')[0].offsetWidth);
                $('.hide-block').css('height', '60px');
                if (scroll >= 2861){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 6250) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(mini_phone >= $( window ).width()){
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
        }else{
            //$('.titleTable2 .plans').css('width', $('.active')[2].offsetWidth);
            //$('.titleTable .plans').css('width', $('.active')[2].offsetWidth);
            //$('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth);
            //$('.titleTable2 td:first-child').css('width', $('.customWidth')[0].offsetWidth);
            if (scroll >= 1291){
                console.log('under > 1200');
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
                console.log('pc');
                $('.table-before-support-block td:first-child').css('width', $('.support td:first-child')[0].offsetWidth);
                $('.support td:first-child').css('width', $('.table-before-support-block td:first-child')[0].offsetWidth);
                if (scroll >= 1472){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 3291) {
                    console.log('remove pc');
                    sticky.removeClass('fixed-plans');
                }
            }
            if(big_tablet >= $( window ).width()){
                console.log('big_tablet');
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
                console.log('tablet');
                $('.support td:not(:first-child)').css('width', $('.active')[2].offsetWidth);
                $('.support td:first-child').css('width', $('.customWidth')[0].offsetWidth);
                $('.titleTable .plans').css('width', $('.active')[2].offsetWidth + 1);
                $('.titleTable2 .plans').css('width', $('.active')[2].offsetWidth);
                $('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth);
                if (scroll >= 2697){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 4746) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(phone_or_tablet >= $( window ).width()){
                console.log('phone_or_tablet');
                if (scroll >= 2675){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block').css('height', '50px');
                }

                if (scroll >= 6100) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(phone >= $( window ).width()){
                console.log('phone');
                $('.titleTable td:first-child').css('width', $('.customWidth')[0].offsetWidth);
                $('.support td:first-child').css('width', $('.table-before-support-block td:first-child')[0].offsetWidth);
                $('.hide-block').css('height', '60px');
                if (scroll >= 2675){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 6136) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(mini_phone >= $( window ).width()){
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