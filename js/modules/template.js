App.modules.my_module = function(App){
	var app = App;
	var data={
		currentStep:1
	};
	var cache={};
	var handlers={
	};
	this.init= function(){
		app.notify({type:'module_ready', data:{module:'my_module'}});
	};
	this.functions = {
	}
};