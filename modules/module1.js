App.modules.module1 = function(App){
	var app = App;
	var data={};
	var cache={};
	var handlers={};
	
	this.init= function(){
		app.notify({type:'module_ready', data:'module1'});
	};
	this.functions = {
		test: function(event){
			app.log('m1 tmp');
		}
	}
};