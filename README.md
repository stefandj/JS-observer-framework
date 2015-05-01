# JS-observer-framework

####About this framework:
It is based on observer pattern.<br />
Very usable for single page applications.<br />
Example: <br />
your app has enabled facebook and google logins.<br />
You want to execute some code which differ depending on user's login.<br />
What do you do?<br />
You create two modules, and create functions in them to execute your code.<br />
Both functions get called, and you check if you need to do anything in that module or let the other one do the job.


####How to use?
1. Copy app.js file in your js folder `<script type="text/javascript" src="app.js"></script>`
2. Create modules and put them in modules folder
3. Include your modules in the html file `<script type="text/javascript" src="modules\app.js"></script>`
4. Create new app instance `var app = new App.app();`
5. Register modules with the app `app.register_module('my_module');`
6. Initialize app `app.init();`
7. App is ready to use

####How to call a method 
1. Every method is called with `app.notify(event)`
2. Event parameter contains `type` which is name of the function to call in each module
3. Event parameter can contain `data` which is on object, can be any data you want to pass


####Application doesn't seem to be working
1. Check your console, an error with description should be thrown

####Application is not initialized
1. Your modules need to contain a function `init` which will be called on `app.init()`
2. When your module is initialized, it must notify the app with `app.notify({type: 'module_ready',data:{module: 'my_module'}})`

####Application config
1. Application config is an object passed when initializing the app
2. Config can contain `debug (boolean), replace_delimiter (string), name (string)`
3. To initialize app with custom config `var app = new App.app({debug: true, replace_delimiter: '__', name: 'my-app'});`

####What is repeater and how to use it?
Repeater is a simple object returned when called function `var repeater = new app.repeater({template:'template-id', parent: 'parent-id'});`<br />
Template-id is a DOM element id, which must contain only one child.<br />
Parent-id is id of DOM element where new elements created by the repeater will be put.<br/>
Take a look at [module2 initialization](https://github.com/PavlovicDzFilip/JS-observer-framework/blob/master/modules/module2.js) for an example.<br/>
<br/>
`repeater.addData(event);` will create a new element and put it to the end of parent element automatically. <br/>
Repeater will add `data-app` and `data-repeater-element-id` parameters to the element added.<br/>
Any property in event will be added to the element except those whose value was inserted in the html itself.<br/>
To insert some html into element, some conditions must be met:
1. Element has no children
2. Element html needs to be in proper format, default: `Hello, my name is __name__`. `__` is configurable with application config
3. Event must contain the property, `repeater.addData({name: 'Filip'});` which will result in `Hello, my name is Filip`

When calling addData function, parameters should not contain:
1. `data-repeater-element-id`
2. `data-app`



Check the example, it is very easy to start working with this framework<br />
If you got any questions, feel free to ask me and I will update this readme

