(function($){
	$.fn.floatDiv = function(){
		var selector = this;
		var top = $(selector).offset().top;
		function historyScroll(){
		   var diff = $(window).scrollTop();
		   if(diff > top){
		       $(selector).offset({top:diff});
		   }else{
		     $(selector).offset().top > top ? $(selector).offset({top:top}): '';
		   }
		   
		}
		$(window).bind("scroll", historyScroll);
	}

})(jQuery)
