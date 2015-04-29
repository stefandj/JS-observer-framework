app.modules.module1 = {
	data:{},
	cache:{},
	handlers: {},
	init: function(){
		app.notify({type:'module_ready', data:'module1'});
	},
	functions: {
		test: function(event){
			app.log('m1 tmp');
		}
	}
};