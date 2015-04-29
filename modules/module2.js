app.modules.module2 = {
	data:{},
	cache:{},
	handlers: {},
	init: function(){
		app.modules.module2.data.repeater = new app.repeater({template:'template-button', parent:'buttons-parent'});
		app.notify({type:'module_ready',data:'module2'});
	},
	functions:{
		addButton: function(event){
			app.modules.module2.data.repeater.addData({clickme:event.data, data_nesto:'nesto'});
		},
		removeButton: function(event){
			app.modules.module2.data.repeater.removeData(event.data);
		}
	}
};