jQuery(document).ready(function($) {
	
	var fillingBlocks = $('.cd-service').not('.cd-service-divider');

	
	var topValueFillingBlocks = [];
	fillingBlocks.each(function(index){
		var topValue = $(this).offset().top;
		topValueFillingBlocks[topValueFillingBlocks.length] = topValue;
	});

	
	fillingBlocks.eq(0).addClass('focus');

	$(window).on('scroll', function(){
		
		updateOnFocusItem(fillingBlocks.slice(1));
		
		// bodyBackground(topValueFillingBlocks);
	});
});

function updateOnFocusItem(items) {
	items.each(function(){
		( $(this).offset().top - $(window).scrollTop() <= $(window).height()/2 ) ? $(this).addClass('focus') : $(this).removeClass('focus');
	});
}
// function bodyBackground(itemsTopValues) {
// 	var topPosition = $(window).scrollTop() + $(window).height()/2,
// 		servicesNumber = itemsTopValues.length;
// 	$.each(itemsTopValues, function(key, value){
// 		if ( (itemsTopValues[key] <= topPosition && itemsTopValues[key+1] > topPosition) || (itemsTopValues[key] <= topPosition && key+1 == servicesNumber ) ) {
// 			$('body').removeClass('new-color-'+(key-1)+' new-color-'+(key+1)).addClass('new-color-'+key);
// 		}
// 	});
// }
