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
        var pc = 1200;
        var big_tablet = 991;
        var tablet = 768;
        var phone = 440;
        var mini_phone = 320;
        if(window.location.pathname == '/ru/price.html'){
            if (scroll >= 1278){
                sticky.addClass('fixed-plans');
            } else{
                sticky.removeClass('fixed-plans');
                sticky.addClass('hide-block');
                $('hide-block').css("height", "50px");
            }

            if (scroll >= 2959) {
                sticky.removeClass('fixed-plans');
            }
            if(scroll){
                $('.plans').css('visibility', 'visible');
            }
            if(pc >= $( window ).width()){
                if (scroll >= 1402){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 3520) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(big_tablet >= $( window ).width()){
                if (scroll >= 1785){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 4733) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(tablet >= $( window ).width()){
                if (scroll >= 2671){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block').css('height', '50px');
                }

                if (scroll >= 5666) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(phone >= $( window ).width()){
                $('.hide-block').css('height', '60px');
                if (scroll >= 2728){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 5660) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(mini_phone >= $( window ).width()){
                if (scroll >= 2830){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 5825) {
                    sticky.removeClass('fixed-plans');
                }
            }
        }else{
            if (scroll >= 1275){
                sticky.addClass('fixed-plans');
            } else{
                sticky.removeClass('fixed-plans');
                sticky.addClass('hide-block');
            }

            if (scroll >= 2943) {
                sticky.removeClass('fixed-plans');
            }
            if(scroll){
                $('.plans').css('visibility', 'visible');
            }
            if(pc >= $( window ).width()){
                if (scroll >= 1405){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 3235) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(big_tablet >= $( window ).width()){
                if (scroll >= 1785){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 4672) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(tablet >= $( window ).width()){
                if (scroll >= 2675){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 5557) {
                    sticky.removeClass('fixed-plans');
                }
            }
            if(phone >= $( window ).width()){
                if (scroll >= 2675){
                    sticky.addClass('fixed-plans');
                } else{
                    sticky.removeClass('fixed-plans');
                    sticky.addClass('hide-block');
                }

                if (scroll >= 5536) {
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

                if (scroll >= 5670) {
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