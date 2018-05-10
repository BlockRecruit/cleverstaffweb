window.onload = function () {
    var bodyElement = $("body");
    var translatedText = setTranslates();

    if(getCookie("consentCookies") !== "yes") {
        appendCockiesBlock();
    }


    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }


    function appendCockiesBlock() {
        var cookieElementText = "<div class='cookie-wrapper' id='cookie-block'>" +
            "<span class='inner-text'>" +
            "<span class='first-sentence'>" +
            "<span>" + translatedText.bestExp +  "</span>" +
            "</span>" +
            "<span class='second-sentence'>" +
            "<span>" + translatedText.findMore +  "</span>" +
            "<a href='https://cleverstaff.net/privacy.html' target='_blank'>" + translatedText.findMoreLink +  "</a>" +
            "</span>" +
            "</span>" +
            "</div>";
        var closeIconElement = $("<i class='close-icon'>" +
            "<svg aria-hidden=\"true\" data-prefix=\"far\" data-icon=\"times\" role=\"img\" width=\"12px\" height=\"12px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 384 512\" class=\"svg-inline--fa fa-times fa-w-12 fa-2x\"><path fill=\"currentColor\" d=\"M231.6 256l130.1-130.1c4.7-4.7 4.7-12.3 0-17l-22.6-22.6c-4.7-4.7-12.3-4.7-17 0L192 216.4 61.9 86.3c-4.7-4.7-12.3-4.7-17 0l-22.6 22.6c-4.7 4.7-4.7 12.3 0 17L152.4 256 22.3 386.1c-4.7 4.7-4.7 12.3 0 17l22.6 22.6c4.7 4.7 12.3 4.7 17 0L192 295.6l130.1 130.1c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17L231.6 256z\" class=\"\"></path></svg>" +
            "</i>");
        closeIconElement.on("click", function() {
            console.log("click close");
            cookieElement.remove();
        });
        var cookieElement = $(cookieElementText);
        var agreeButtonElement = $("<button>" + translatedText.iAgree + "</button>");
        agreeButtonElement.on("click", function () {
            setCookies("consentCookies", "yes");
            cookieElement.remove();
        });
        cookieElement.append(closeIconElement);
        cookieElement.find(".first-sentence").append(agreeButtonElement);
        bodyElement.append(cookieElement);
    }


    function setTranslates() {
        var textsEn = {
            iAgree: "I agree",
            bestExp: "To give you the best possible experience, this site uses cookies. If you agree with cookie usage, press ",
            findMore: "Should you want to find out more about our cookie policy - press ",
            findMoreLink: "read more"
        };
        var textsRu = {
            iAgree: "Согласен",
            bestExp: "Чтобы предоставить вам наилучший опыт, на этом сайте используются cookie. Если вы согласны с использованием cookie, нажмите кнопку ",
            findMore: "Если вы хотите ознакомиться с  нашей политикой cookie, нажмите ",
            findMoreLink: "узнать больше"
        };
        var currentLang = localStorage.getItem("NG_TRANSLATE_LANG_KEY");
        if(currentLang === null){
            if(window.location.href.indexOf("/ru/") !== -1)
                return textsRu;
            return textsEn;
        } else {
            if(currentLang == "ru")
                return textsRu;
            return textsEn;
        }
    }

    function setCookies(key, value) {
        document.cookie = key + "=" + value + "; expires=Thu, 18 Dec 2033 12:00:00 UTC";
    }
};