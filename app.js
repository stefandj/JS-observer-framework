var App = {
    modules: {},
    app: function (event) {
        var event = event || {};
        var modules = {};
        var local_data = {
            ready_modules: {},
        };
        var config = {
            debug: event.debug || true,
            ready: false,
            repeater_id: 0,
            replace_delimiter: event.replace_delimiter || '__',
            name: event.name || 'myApp',
            initialized: false
        };
        var helpers = {
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
            error: function (event) {
                throw new Error(event);
            },
            check: function () {
                if (config.ready === false) {
                    if (config.debug == true) {
                        for (var key in modules) {
                            if (typeof (data.ready_modules[key]) == 'undefined' || data.ready_modules[key] == false) {
                                console.log(key + ' module not ready');
                            };
                        };
                    };

                    helpers.error("Error. App not initialized properly.");
                }
            },
            execute: function (event) {
                for (var module_name in modules) {
                    var module = modules[module_name];
                    var fn = event.type;
                    if (typeof (module.functions[fn]) == 'function') {
                        module.functions[fn](event);
                    };
                };
            },
            repeater_create_object: function (template, object) {
                var element = document.createElement(template.tagName);
                if (typeof (object['data-repeater_element_id']) != 'undefined') {
                    element.setAttribute('data-repeater_element_id', object['data-repeater_element_id']);
                    delete object['data-repeater_element_id'];
                };
                if (typeof (object['data-app']) != 'undefined') {
                    element.setAttribute('data-app', object['data-app']);
                    delete object['data-app'];
                };
                for (var i = 0; i < template.children.length; i++) {
                    var child = template.children[i];
                    var clone = helpers.repeater_create_object(child, object);
                    element.appendChild(clone);
                };
                //change inner html if element has no children
                if (template.childElementCount == 0) {
                    var innerText = template.innerText;
                    for (var key in object) {
                        innerText = helpers.replace_all(innerText,
                            config.replace_delimiter + key + config.replace_delimiter, object[key]);
                    };
                    element.innerText = innerText;
                };
                //add attributes
                for (var i = 0; i < template.attributes.length; i++) {
                    var attr = template.attributes[i];
                    var attr_name = attr.name;
                    if (attr_name == 'id') {
                        helpers.error("Error: template can not contain ID attribute.");
                    };
                    var attr_val = object[attr_name] || attr.value;
                    element.setAttribute(attr_name, attr_val);
                };


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
                    status = status && helpers.check_replace_params(data[key]);
                    if (status == false) return status;
                };
                return status;
            }
        };

        this.init = function () {
        	if(config.initialized==true){
        		helpers.error('Error: ' + config.name + ' already initialized');
        	};
        	config.initialized=true;
            helpers.prototypes_init();

            var local_modules = [];
            for (var module_name in modules) {
                var module = modules[module_name];
                local_modules.push(module);
            };
            local_modules.forEach(function (module, index) {
                module.init();
            });
        };
        this.notify = function (event) {
            if (typeof (event) == 'undefined' || typeof (event.type) == 'undefined') {
                helpers.error('Error. App.notify can\'t proccess this request.');
            };
            if (event.type == 'module_ready') {
                if (typeof (event.data) == 'undefined') {
                    helpers.error('Error. App.notify can\'t proccess this request.');
                };
                local_data.ready_modules[event.data] = 'ready';
                if (Object.size(local_data.ready_modules) == Object.size(modules)) {
                    config.ready = true;
                    this.log('app ready');
                };
                return;
            };

            if (event.type == 'module_not_ready') {
                delete local_data.ready_modules[event.data];
                config.ready = false;
                return;
            };

            helpers.check();
            helpers.execute(event);
        };
        this.log = function (event) {
            helpers.check();
            window.console.log(event);
        };
        this.register_module = function (event) {
            if (typeof (event) != 'string') {
                helpers.error('Unable to add module ' + event);
                return;
            }
            if(typeof(App.modules[event]) == 'undefined'){
            	helpers.error("Error: Module not found.");
            	return;
            };
            var module = new App.modules[event](this);
            var required_data = {
                'init': 'function',
                'functions': 'object'
            };
            for (var key in required_data) {
                if (typeof (module[key]) == typeof (required_data[key])) {
                    helpers.error('Unable to add module ' + event + '. ' + key + ' not found or malformed.');
                    return;
                }
            };
            modules[event] = module;

        };
        this.repeater = function (event) {
            if (typeof (event) == 'undefined' ||
                typeof (event.template) == 'undefined' ||
                typeof (event.parent) == 'undefined') {
                helpers.error("Error: unable to initialize repeater. Check your parameters.");
            };
            if (document.getElementById(event.template) == null)
                helpers.error("Error: template not found.");
            var data = {
                template: document.getElementById(event.template).children[0],
                parent: document.getElementById(event.parent),
                elements: [],
                repeater_id: config.repeater_id++,
                repeater_element_id: 0
            };
            if (data.template == null) {
                helpers.error("Error: template not found.");
            };
            if (typeof (data.template) == 'undefined' || data.template.parentNode.childElementCount != 1) {
                helpers.error("Error: template doesn't contain only one child.");
            };
            if (data.parent == null) {
                helpers.error("Error: parent not found.");
            };

            this.addData = function (new_data, retElem) {
                helpers.check();
                if (typeof (new_data) != 'object') {
                    helpers.error("Error: parameter is not an object.")
                };
                if (typeof (new_data.repeater_element_id) != 'undefined' || typeof(new_data.app) !='undefined') {
                    helpers.error("Error: use of reserved data (repeater_element_id, app)");
                };
                if (helpers.check_replace_params(new_data) == false) {
                    helpers.error("Error: parameters are not right.");
                };
                new_data['data-repeater_element_id'] = data.repeater_element_id++;
                new_data['data-app'] = config.name;
                var element = helpers.repeater_create_object(data.template, new_data);
                data.elements.push(element);
                if (retElem !== true)
                    data.parent.appendChild(element);
                else
                    return element;
            };
            this.removeData = function (elm) {
                helpers.check();
                if (typeof (elm) == 'number' || typeof (elm) == 'string') {
                    for (var i = 0; i < data.elements.length; i++) {
                        var el = data.elements[i];
                        if (el.attributes['data-repeater_element_id'].value == elm) {
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
        };
    }
};
