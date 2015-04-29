var app = {
    modules: {},
    local_data: {
        ready_modules: {},
        event_listeners: []
    },
    config: {
        debug: true,
        ready: false,
        repeater_id: 0,
        replace_delimiter: '__'
    },
    init: function () {
        app.helpers.prototypes_init();
        var required_data = {
            'data': 'object',
            'cache': 'object',
            'handlers': 'object',
            'init': 'function',
            'functions': 'object'
        };
        for (var module_name in app.modules) {
            var module = app.modules[module_name];
            var found_count = 0;
            for (var key in required_data) {
                if (typeof (module[key]) != required_data[key]) {
                    app.helpers.error("Error: " + module_name + ' not loaded,' + key + ' not found.');
                };
            };
        };
        var modules = [];
        for (var module_name in app.modules) {
            var module = app.modules[module_name];
            modules.push(module);
        };
        modules.forEach(function (module, index) {
            module.init();
        });

    },
    notify: function (event) {
        if (typeof (event) == 'undefined' || typeof (event.type) == 'undefined') {
            app.helpers.error('Error. App.notify can\'t proccess this request.');
        };
        if (event.type == 'module_ready') {
            if (typeof (event.data) == 'undefined') {
                app.helpers.error('Error. App.notify can\'t proccess this request.');
            };
            app.local_data.ready_modules[event.data] = 'ready';
            if (Object.size(app.local_data.ready_modules) == Object.size(app.modules)) {
                app.config.ready = true;
                app.log('app ready');
            };
            return;
        };

        if (event.type == 'module_not_ready') {
            delete app.local_data.ready_modules[event.data];
            app.config.ready = false;
            return;
        };

        app.helpers.check();
        app.helpers.execute(event);
    },
    log: function (event) {
        app.helpers.check();
        if (app.config.debug == true)
            window.console.log(event);
    },
    data: function (event) {
        app.helpers.check();
        if (typeof (event) == 'undefined' ||
			typeof (event.type) == 'undefined' ||
			typeof (event.data) == 'undefined') {
            app.helpers.error('App.data can not proccess this request. Missing parameters.');
        }
        var module_name = event.type;
        var data_name = event.data;
        var data = null;
        if (typeof (app.modules[module_name]) == 'undefined') {
            app.helpers.error('App.data can not proccess this request. Module does not exist.');
        };
        if (typeof (app.modules[module_name].data[data_name]) != 'undefined') {
            data = app.modules[module_name].data[data_name];
        };
        return data;
    },
    helpers: {
        prototypes_init: function () {
            Object.size = function (obj) {
                var size = 0, key;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) size++;
                };
                return size;
            };
            Element.prototype.remove = function () {
                this.parentElement.removeChild(this);
            };
            NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
                for (var i = 0, len = this.length; i < len; i++) {
                    if (this[i] && this[i].parentElement) {
                        this[i].parentElement.removeChild(this[i]);
                    }
                }
            };
        },
        error: function(event, hidden){
        	hidden = hidden || false;
        	if(hidden == false){
        		throw new Error(event);
        	}
        	else if(app.config.debug===true){
        		throw new Error(event);
        	}
        },
        check: function () {
            if (app.config.ready === false) {
            	if(app.config.debug==true){
            		for(var key in app.modules){
            			if(typeof(app.data.ready_modules[key]) == 'undefined' || app.data.ready_modules[key] == false){
            				console.log(key + ' module not ready');
            			};
            		};
            	};
            	
                app.helpers.error("Error. App not initialized properly.");
            }
        },
        execute: function (event) {
            for (var module_name in app.modules) {
                var module = app.modules[module_name];
                var fn = event.type;
                if (typeof (module.functions[fn]) == 'function') {
                    module.functions[fn](event);
                };
            };
        },
        repeater_create_object: function (template, object) {
            var element = document.createElement(template.tagName);
            if (typeof (object.repeater_element_id) != 'undefined') {
                element.setAttribute('repeater_element_id', object.repeater_element_id);
                delete object.repeater_element_id;
            };
            for (var i = 0; i < template.children.length; i++) {
                var child = template.children[i];
                var clone = app.helpers.repeater_create_object(child, object);
                element.appendChild(clone);
            };
            //change inner html if element has no children
            if (template.childElementCount == 0) {
                var innerText = template.innerText;
                for (var key in object) {
                    innerText = app.helpers.replace_all(innerText, app.config.replace_delimiter + key + app.config.replace_delimiter, object[key]);
                };
                element.innerText = innerText;
            };
            //add attributes
            for (var i = 0; i < template.attributes.length; i++) {
                var attr = template.attributes[i];
                var attr_name = attr.name;
                if (attr_name == 'id') {
                    app.helpers.error("Error: template can not contain ID attribute.");
                };
                var attr_val = object[attr_name] || attr.value;
                element.setAttribute(attr_name, attr_val);
            };

            //copy event listeners
            /*
			var eventListeners = getEventListeners(template);
			for(var key in eventListeners){
				var listeners = eventListeners[key];
				for(var listener in listeners){
					element.addEventListener(listener.type,listener.listener);
				};
			};
			//*/

            return element;
        },
        replace_all: function (template, find, replace) {
            while (template.indexOf(find) > -1) {
                template = template.replace(find, replace);
            }
            return template;
        },
        check_replace_params: function (data) {
            var type = typeof (data);
            if (type == 'number' || type == 'string') return true;
            if (type != 'object') return false;
            var status = true;
            for (var key in data) {
                status = status && app.helpers.check_replace_params(data[key]);
                if (status == false) return status;
            };
            return status;
        }
    },
    repeater: function (event) {
        if (typeof (event) == 'undefined' ||
			typeof (event.template) == 'undefined' ||
			typeof (event.parent) == 'undefined') {
            app.helpers.error("Error: unable to initialize repeater. Check your parameters.");
        };
        if (document.getElementById(event.template) == null)
            app.helpers.error("Error: template not found.");
        var data = {
            template: document.getElementById(event.template).children[0],
            parent: document.getElementById(event.parent),
            elements: [],
            repeater_id: app.config.repeater_id++,
            repeater_element_id: 0
        };
        if (data.template == null) {
            app.helpers.error("Error: template not found.");
        };
        if (typeof (data.template) == 'undefined' || data.template.parentNode.childElementCount != 1) {
            app.helpers.error("Error: template doesn't contain only one child.");
        };
        if (data.parent == null) {
            app.helpers.error("Error: parent not found.");
        };

        this.addData = function (new_data, retElem) {
            app.helpers.check();
            if (typeof (new_data) != 'object') {
                app.helpers.error("Error: parameter is not an object.")
            };
            if (typeof (new_data.repeater_element_id) != 'undefined') {
                app.helpers.error("Error: use of reserved data (repeater_element_id)");
            };
            if (app.helpers.check_replace_params(new_data) == false) {
                app.helpers.error("Error: parameters are not right.");
            };
            new_data['repeater_element_id'] = data.repeater_element_id++;
            var element = app.helpers.repeater_create_object(data.template, new_data);
            data.elements.push(element);
            if (retElem !== true)
                data.parent.appendChild(element);
            else
                return element;
        };
        this.removeData = function (elm) {
            app.helpers.check();
            if (typeof (elm) == 'number' || typeof (elm) == 'string') {
                for (var i = 0; i < data.elements.length; i++) {
                    var el = data.elements[i];
                    if (el.attributes['repeater_element_id'].value == elm) {
                        el.remove();
                        data.elements.splice(i, 1);
                        return;
                    }
                }
            };
            if (typeof (elm) == 'object') {
                for (var i = 0; i < data.elements.length; i++) {
                    if (data.elements[i].isSameNode(elm)) {
                        data.elements[i].remove();
                        data.elements.splice(i, 1);
                        return;
                    };
                };
            };
        };
    }

};
