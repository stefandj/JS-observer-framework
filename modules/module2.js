App.modules.module2 = function(App){
	var app = App;
	var data={};
	var cache={};
	var handlers= {};
	this.init= function(){
		data.repeater = new app.repeater({template:'template-button', parent:'buttons-parent'});
		app.notify({type:'module_ready',data:'module2'});
	};
	this.functions={
		addButton: function(event){
			data.repeater.addData({clickme:event.data, 'data-myparam':'my-value'});
		},
		removeButton: function(event){
			data.repeater.removeData(event.data);
		}
	}
};