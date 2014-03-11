(function($){
	$.fn.floatDiv = function(){
		var config.selector = this;
		var top = $(config.selector).offset().top;
		function historyScroll(){
		   var diff = $(document).scrollTop();
		   if(diff > top){
		       $(config.selector).offset({top:diff});
		   }else{
		     $(config.selector).offset().top > top ? $(config.selector).offset({top:top}): '';
		   }
		   
		}
		$(document).bind("scroll", historyScroll);
	}

})(jQuery)
