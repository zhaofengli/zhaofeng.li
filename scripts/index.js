$( ".scroll-to-top" ).click( function () {
	$( "html,body" ).animate( {
		scrollTop: 0
	}, 500 );
	return false;
} );

$( ".scroll-to-aboutme" ).click( function() {
	$( "html,body" ).animate( {
		scrollTop: $( "#aboutme" ).offset().top
	}, 300 );
	return false
} );

var s = skrollr.init();
