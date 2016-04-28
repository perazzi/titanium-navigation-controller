//---------------------------------------------------------
// Creates the Navigation Stack
//---------------------------------------------------------
exports.NavigationController = function() {
    this.windowStack = [];
    if(Ti.Platform.osname == 'android') {
        // this.closer = Ti.UI.createWindow({
           // fullscreen:false,
           // exitOnClose:true,
           // navBarHidden:true
        // });
        // this.closer.open();
    }
};
//---------------------------------------------------------
// Returns the current window in the stack
//---------------------------------------------------------
exports.NavigationController.prototype.getCurrentWindow = function(){
    return this.windowStack[this.windowStack.length-1];
};
//---------------------------------------------------------
// Controls the navigation, opens the windows
//---------------------------------------------------------
exports.NavigationController.prototype.open = function(/*Ti.UI.Window*/windowToOpen) {
    //Add the window to the stack of windows managed by the controller
    this.windowStack.push(windowToOpen);
    
    //Ti.API.info(this.windowStack.length);

    //grab a copy of the current nav controller for use in the callback
    /*var that = this;
    windowToOpen.addEventListener('close', function() {
        that.windowStack.pop();
    });*/

    //Gack - setting this property ensures the window is "heavyweight" (associated with an Android activity)
    windowToOpen.navBarHidden = windowToOpen.navBarHidden || false;

    //This is the first window
    if(this.windowStack.length == 1) {
        if(Ti.Platform.osname == 'android') {
            // windowToOpen.exitOnClose = true;
            windowToOpen.open();
        } else {
            this.navGroup = Ti.UI.iPhone.createNavigationGroup({
                window : windowToOpen
            });
            this.containerWindow = Ti.UI.createWindow();
            this.containerWindow.add(this.navGroup);
            this.containerWindow.open();
        }
    } else {//All subsequent windows
        if(Ti.Platform.osname === 'android') {
            windowToOpen.open();
        } else {
            this.navGroup.open(windowToOpen);
        }
    }
};
//---------------------------------------------------------
// Goes back to home window and closes all of the others
//---------------------------------------------------------
exports.NavigationController.prototype.home = function() {
    //Store a copy of all the current windows on the stack
    for(var i = 1, l = this.windowStack.length; i < l; i++) {
        (this.navGroup) ? this.navGroup.close(this.windowStack[i]) : this.windowStack[i].close();
    }
    //Ti.API.info('Tamanho Atual:'+this.windowStack.length);
    if(this.windowStack.length > 1){
        while(this.windowStack.length > 1){
            this.windowStack.pop();
        }
    }
    //Checks if there's an onFocus function to call.
    if(this.windowStack[this.windowStack.length-1] && this.windowStack[this.windowStack.length-1].onFocus){
        this.windowStack[this.windowStack.length-1].onFocus();
    }
    //Ti.API.info('Após POP:'+this.windowStack.length);
    //this.windowStack = [this.windowStack[0]]; //reset stack
};
//---------------------------------------------------------
// Closes all the windows and cleans the stack
//---------------------------------------------------------
exports.NavigationController.prototype.closeAll = function() {
    //store a copy of all the current windows on the stack
    //var windows = this.windowStack.concat([]);
    for(var i = 0, l = this.windowStack.length; i < l; i++) {
        (this.navGroup) ? this.navGroup.close(this.windowStack[i]) : this.windowStack[i].close();
    }
    if(this.windowStack.length > 0){
        while(this.windowStack.length > 0){
            this.windowStack.pop();
        }
    }
    //this.windowStack = [];
    //this.windowStack = null;
    //this.containerWindow.close();
    //this.containerWindow = null
};
//---------------------------------------------------------
// Goes 1 window back
//---------------------------------------------------------
exports.NavigationController.prototype.back = function(_btnClicado,_window) {
    //Windows array
    //Current window position
    var i = this.windowStack.length - 1.0;
    //if the previous window is the loading window, doesn't close the current one
    if(this.windowStack[i-1] && (!this.windowStack[i-1].bgType || this.windowStack[i-1].bgType != 'wtbg.png')){
	    //Picks the last window from the stack
	    (this.navGroup) ? this.navGroup.close(this.windowStack[i]) : this.windowStack[i].close();
	    this.windowStack.pop();
	    //Checks if there's an onFocus function to call.
	    if(this.windowStack.length > 0 && this.windowStack[this.windowStack.length - 1.0] && this.windowStack[this.windowStack.length - 1.0].onFocus){
	        this.windowStack[this.windowStack.length - 1.0].onFocus();
	    }
    }
};
//---------------------------------------------------------
// Closes the previous N pages from the stack
//---------------------------------------------------------
exports.NavigationController.prototype.closeLastN = function(numberOfWindows,params) {
    //params is optional { callback, callbackParams }
	while(numberOfWindows--){
        //Current window position
		var i = this.windowStack.length - 1.0;
		//if the previous window is the loading window, doesn't close the current one
		if(this.windowStack[i-1] && (!this.windowStack[i-1].bgType || this.windowStack[i-1].bgType != 'wtbg.png')){
			if(numberOfWindows == 0){//Closes all with no animation.
				if(params && params.callback){
					(this.navGroup) ? this.navGroup.close(this.windowStack[i],{animated:false}) : this.windowStack[i].close();
					this.windowStack.pop(); 
					(params.callbackParams) ? params.callback(params.callbackParams) : params.callback();
				}else{
					(this.navGroup) ? this.navGroup.close(this.windowStack[i],{animated:true}) : this.windowStack[i].close();
					this.windowStack.pop(); 
				}
			}else{//Just animates the last one, in case there's no callback
	       		(this.navGroup) ? this.navGroup.close(this.windowStack[i],{animated:false}) : this.windowStack[i].close();
				this.windowStack.pop(); 
			}
		}
	}
   //Checks if there's an onFocus function to call.
	if(this.windowStack[this.windowStack.length - 1.0] && this.windowStack[this.windowStack.length - 1.0].onFocus){
        this.windowStack[this.windowStack.length - 1.0].onFocus();
    }
};
//---------------------------------------------------------
// Destroys itself to avoid windows to be opened in the background
//---------------------------------------------------------
exports.NavigationController.prototype.destroy = function() {
    this.closeAll();
    if(this.navGroup){
        this.navGroup = null;
        this.windowStack = null;
    }else{
        this.windowStack = null;
    }
    return null;
};


