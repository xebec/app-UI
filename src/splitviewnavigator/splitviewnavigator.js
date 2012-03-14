var SplitViewNavigator = function( target ) {
	
	this.animating = false;
	this.animationDuration = 350;
	this.animationPerformed = false;
	
	this.uniqueId = this.guid();
	this.parent = $( target );
	
	var regexp = new RegExp("Windows Phone OS 7");	
	this.winPhone = (navigator.userAgent.search(regexp) >= 0);
	
	this.rootElement = $('<div class="splitViewNavigator_root"></div>');
	this.sidebarContainer = $('<div class="splitViewNavigator_sidebar"></div>');
	this.contentOverlay = $('<div class="content_overlay_hidden" id="overlay'+this.uniqueId+'"></div>');
	this.bodyContainer = $('<div class="splitViewNavigator_body"></div>');
	
	this.sidebarViewNavigator = new ViewNavigator( this.sidebarContainer.get()[0] );	
	
	this.bodyViewNavigator = new ViewNavigator( this.bodyContainer.get()[0] );
	
	/*
	this.bodyHeader = $('<div class="viewNavigator_header"></div>');
	this.bodyContent = $('<div class="viewNavigator_content" id="contentRoot"></div>');
	this.bodyContainer.append( this.bodyHeader );
	this.bodyContainer.append( this.bodyContent );
	
	this.bodyHeaderContent = $('<div class="viewNavigator_headerContent"></div>');
	this.bodyHeaderTitle = $("<div class='viewNavigator_header_title'></div>");
	this.bodyHeaderContent.append( this.bodyHeaderTitle );
	this.bodyHeader.append( this.bodyHeaderContent );
	*/
	
	this.toggleSidebarButton = $('<li class="viewNavigator_header_backlink backLinkButton hidden" id="toggle' + this.uniqueId + '" onclick="window.splitViewNavigator.showSidebar()">toggle</li>');
	
	
	this.rootElement.append( this.bodyContainer );
	this.rootElement.append( this.contentOverlay );
	
	this.rootElement.append( this.sidebarContainer );
	
	var self = this;
	$(window).resize( function(event){ self.resizeContent() } );
	$(this.parent).resize( function(event){ self.resizeContent() } );
	
	if ( "onorientationchange" in window ) {
		$(window).bind( "onorientationchange", function(event){ self.resizeContent() } )
	}
	
	this.resizeContent();
	
	this.parent.append( this.rootElement );
	
	this.contentOverlay.click( function(event){ self.hideSidebar() } );
	
	new NoClickDelay( this.contentOverlay.get()[0] );
	new NoClickDelay( this.toggleSidebarButton.get()[0] );
	window.splitViewNavigator = this;
}


SplitViewNavigator.prototype.resizeContent = function() {

	this.applyStylesByOrientation();
	
	/*
	var targetWidth = this.bodyContainer.width();
	console.log( targetWidth );
	if ( this.bodyHeaderContent )
		this.bodyHeaderContent.width( targetWidth );
	if ( this.bodyHeaderContent )
		this.bodyHeaderContent.width( targetWidth );
		*/
}

SplitViewNavigator.prototype.applyStylesByOrientation = function() {
	var $window = $(window)
    var w = $window.width();
    var h = $window.height();
   
    
    var orientation = (w >= h) ? "landscape" : "portrait";
    this.contentOverlay.removeClass( "content_overlay_visible" ).addClass( "content_overlay_hidden" );
    
    //landscape
    if ( orientation == "landscape" && this.orientation != orientation ) {
    	this.sidebarContainer.removeClass( "sidebar_portrait" ).addClass( "sidebar_landscape" );
    	this.bodyViewNavigator.setHeaderPadding( 0 );
    	this.toggleSidebarButton.remove();
    	if ( this.animationPerformed ) {
    		this.sidebarContainer.css( "left", 0 );
    	}
    	this.bodyContainer.removeClass( "body_portrait" ).addClass( "body_landscape" );
    }
    
    //portrait
    else if ( this.orientation != orientation ) {
    	this.sidebarContainer.removeClass( "sidebar_landscape" ).addClass( "sidebar_portrait" );
    	this.bodyViewNavigator.setHeaderPadding( "70px" );
		this.bodyContainer.append( this.toggleSidebarButton );
    	if ( this.animationPerformed ) {
    		this.sidebarContainer.css( "left", -this.sidebarContainer.width() );
    	}
    	this.bodyContainer.removeClass( "body_landscape" ).addClass( "body_portrait" );
    }
    
    this.orientation = orientation;
}

SplitViewNavigator.prototype.showSidebar = function() {
	this.animationPerformed = true;
	if ( this.orientation == "portrait" ) {
    	this.contentOverlay.removeClass( "content_overlay_hidden" ).addClass( "content_overlay_visible" );
		this.animating = true;
		this.sidebarContainer.animate({
			left:0,
			avoidTransforms:false,
			useTranslate3d: true
		}, this.animationDuration, this.animationCompleteHandler());
    		
	}
}

SplitViewNavigator.prototype.hideSidebar = function() {
	if ( this.orientation == "portrait" ) {
    	this.contentOverlay.removeClass( "content_overlay_visible" ).addClass( "content_overlay_hidden" );
		this.animating = true;
		this.sidebarContainer.animate({
			left:-this.sidebarContainer.width(),
			avoidTransforms:false,
			useTranslate3d: true
		}, this.animationDuration, this.animationCompleteHandler());
    		
	}
}

SplitViewNavigator.prototype.animationCompleteHandler = function() {
	var self = this;
	return function() {
		self.animating = false;
        //self.resetScroller();
	}
}

SplitViewNavigator.prototype.pushSidebarView = function( viewDescriptor ) {
	this.sidebarViewNavigator.pushView( viewDescriptor );
}

SplitViewNavigator.prototype.popSidebarView = function() {
	this.sidebarViewNavigator.popView();
}

SplitViewNavigator.prototype.replaceSidebarView = function( viewDescriptor ) {
	this.sidebarViewNavigator.replaceView( viewDescriptor );
}

SplitViewNavigator.prototype.pushBodyView = function( viewDescriptor ) {
	this.bodyViewNavigator.pushView( viewDescriptor );
}

SplitViewNavigator.prototype.popBodyView = function() {
	this.bodyViewNavigator.popView();
}

SplitViewNavigator.prototype.replaceBodyView = function( viewDescriptor ) {
	this.bodyViewNavigator.replaceView( viewDescriptor );
}

/*
SplitViewNavigator.prototype.setBodyView = function( viewDescriptor ) {
	
	this.bodyHeaderTitle.text( viewDescriptor.title );
	this.bodyContent.empty();
	this.bodyContent.append( viewDescriptor.view );
}*/



//GUID logic from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript

SplitViewNavigator.prototype.S4 = function() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 
SplitViewNavigator.prototype.guid = function() {
	return (this.S4() + this.S4() + "-" + this.S4() + "-4" + this.S4().substr(0,3) + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()).toLowerCase();
}