(function($){
	$.fn.floatDiv = function(){
		var selector = this;
		var top = $(selector).offset().top;
		function historyScroll(){
		   var diff = $(document).scrollTop();
		   if(diff > top){
		       $(selector).offset({top:diff});
		   }else{
		     $(selector).offset().top > top ? $(selector).offset({top:top}): '';
		   }
		   
		}
		$(document).bind("scroll", historyScroll);
	}

})(jQuery)
