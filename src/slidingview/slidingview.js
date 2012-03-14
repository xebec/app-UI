
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

var SlidingView = function( sidebarId, bodyId ) {
	
	window.slidingView = this;
	
	this.gestureStarted = false;
	this.bodyOffset = 0;
	
	this.sidebarWidth = 250;
	
	this.sidebar = $("#"+sidebarId);
	this.body = $("#"+bodyId);
	
	this.sidebar.addClass( "slidingview_sidebar" );
	this.body.addClass( "slidingview_body" );
		
	var self = this;
	$(window).resize( function(event){ self.resizeContent() } );
	$(this.parent).resize( function(event){ self.resizeContent() } );
	
	if ( "onorientationchange" in window ) {
		$(window).bind( "onorientationchange", function(event){ self.resizeContent() } )
	}
	this.resizeContent();
	this.setupEventHandlers();
}

SlidingView.prototype.setupEventHandlers = function() {

	this.touchSupported =  ('ontouchstart' in window);
	
	this.START_EVENT = this.touchSupported ? 'touchstart' : 'mousedown';
	this.MOVE_EVENT = this.touchSupported ? 'touchmove' : 'mousemove';
	this.END_EVENT = this.touchSupported ? 'touchend' : 'mouseup';

	var self = this;
	this.body.get()[0].addEventListener( this.START_EVENT, function( event ){ self.onTouchStart(event), true } );
}

SlidingView.prototype.onTouchStart = function(event) {
	//console.log( event.type );
	
	this.gestureStartPosition = this.getTouchCoordinates( event );
	
	var self = this;
	this.touchMoveHandler = function( event ){ self.onTouchMove(event) };
	this.touchUpHandler = function( event ){ self.onTouchEnd(event) };
	
	this.body.get()[0].addEventListener( this.MOVE_EVENT, this.touchMoveHandler );
	this.body.get()[0].addEventListener( this.END_EVENT, this.touchUpHandler );
	this.body.stop();
}

SlidingView.prototype.onTouchMove = function(event) {
	var currentPosition = this.getTouchCoordinates( event );
	
	if ( this.gestureStarted ) {
		event.preventDefault();
		event.stopPropagation();
		this.updateBasedOnTouchPoints( currentPosition );
		return;
	}
	else {
		//console.log( Math.abs( currentPosition.x - this.gestureStartPosition.x ) );
		//detect the gesture
		if ( Math.abs( currentPosition.y - this.gestureStartPosition.y ) > 50 ) {
			
			//dragging veritcally - ignore this gesture
			this.unbindEvents();
			return;
		}
		else if ( Math.abs( currentPosition.x - this.gestureStartPosition.x ) > 50 ) {
			
			//dragging horizontally - let's handle this
			this.gestureStarted = true;
			event.preventDefault();
			event.stopPropagation();
			this.updateBasedOnTouchPoints( currentPosition );
			return;
		}
	}
}

SlidingView.prototype.onTouchEnd = function(event) {
	if ( this.gestureStarted ) {
		this.snapToPosition();
	}
	this.gestureStarted = false;
	this.unbindEvents();
}



SlidingView.prototype.updateBasedOnTouchPoints = function( currentPosition ) {
	
	var deltaX = (currentPosition.x - this.gestureStartPosition.x);
	var targetX = this.bodyOffset + deltaX;
	
	targetX = Math.max( targetX, 0 );
	targetX = Math.min( targetX, this.sidebarWidth );
	
	this.bodyOffset = targetX;
	
	//console.log( targetX );
	//this.body.css("left", targetX );
	console.log( this.body.css("left") );
	if ( this.body.css("left") != "0px" );
	this.body.css("left", "0px" );
	this.body.css("-webkit-transform", "translate3d(" + targetX + "px,0,0)" );
	
	/*if ( currentPosition != targetX ) {
	
		this.body.stop(true,false).animate({
				left:targetX,
				avoidTransforms:false,
				useTranslate3d: true
			}, 100);
	}*/
	
	this.gestureStartPosition = currentPosition;
}

SlidingView.prototype.snapToPosition = function() {

	//this.body.css("-webkit-transform", "translate3d(0,0,0)" );
	this.body.css("left", "0px" );
	var currentPosition = this.bodyOffset;
	var halfWidth = this.sidebarWidth / 2;
	var targetX;
	if ( currentPosition < halfWidth ) {
		targetX = 0;
	}
	else {
		targetX = this.sidebarWidth;
	}
	this.bodyOffset = targetX;
	
	//console.log( currentPosition, halfWidth, targetX );

	if ( currentPosition != targetX ) {
	
		this.body.stop(true, false).animate({
				left:targetX,
				avoidTransforms:false,
				useTranslate3d: true
			}, 100);
	}
}

SlidingView.prototype.unbindEvents = function() {
	this.body.get()[0].removeEventListener( this.MOVE_EVENT, this.touchMoveHandler );
	this.body.get()[0].removeEventListener( this.END_EVENT, this.touchUpHandler );
}



SlidingView.prototype.getTouchCoordinates = function(event) {
	if ( this.touchSupported ) {
		var touchEvent = event.touches[0];
		return { x:touchEvent.pageX, y:touchEvent.pageY }
	}
	else {
		return { x:event.screenX, y:event.screenY };
	}
}

SlidingView.prototype.resizeContent = function() {

	var $window = $(window)
    var w = $window.width();
    var h = $window.height();
    
    this.body.width( w );
}

	