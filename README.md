# titanium-navigation-controller
A Navigation Controller module for Titanium

This module should be used in Titanium Mobile, and it makes it easier to control the navigation between pages in the app.
The module is confirmed to work on Android and IOS

#Usage
Put the module in your libs folder and require it in your code
```
var NavigationController = require('libs/NavigationController').NavigationController;
```

###getCurrentWindow
Returns the current window in the stack.

###open
Open a new window and adds it to the stack

###home
Goes back to home window (1st in the stack) and closes all of the others

###closeAll
Closes all the windows and cleans the stack

###back
Goes back 1 window and closes the current

###closeLastN
Closes the previous N pages from the stack

###destroy
Destroys itself to avoid windows to be opened in the background