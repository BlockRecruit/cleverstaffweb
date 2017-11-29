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

// Helper method to parse the title tag from the response.
//function getTitle(text) {
//    return text.match('<title>(.*)?</title>')[1];
//}

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
        var formatedData1 = $.format.date(newsArray[0].date, "dd.MM.yyyy");
        var formatedData2 = $.format.date(newsArray[1].date, "dd.MM.yyyy");
        var formatedData3 = $.format.date(newsArray[2].date, "dd.MM.yyyy");
        $('#article-title1').append(newsArray[0].title);
        $('#article-title2').append(newsArray[1].title);
        $('#article-title3').append(newsArray[2].title);
        $('#article-subtitle1').append(newsArray[0].excerpt);
        $('#article-subtitle2').append(newsArray[1].excerpt);
        $('#article-subtitle3').append(newsArray[2].excerpt);
        $('#newsDate1').append(formatedData1);
        $('#newsDate2').append(formatedData2);
        $('#newsDate3').append(formatedData3);
        $('#newsLink1,#article-title1').attr('href',newsArray[0].link);
        $('#newsLink2,#article-title2').attr('href',newsArray[1].link);
        $('#newsLink3,#article-title3').attr('href',newsArray[2].link);
    };

    xhr.onerror = function() {
        $('.signin-news').css('display','none')
    };

    xhr.send();
}
makeCorsRequestNews();

