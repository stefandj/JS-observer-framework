App.modules.steps = function(App){
	var app = App;
	var data={
		currentStep:1
	};
	var cache={};
	var handlers={
		next_step_click:function(event){
			app.notify({type:'next_step'});
		},
		prev_step_click:function(event){
			app.notify({type:'prev_step'});
		},
		display_all_steps_click:function(event){
			app.notify({type:'display_all_steps'});
		}
	};
	this.init= function(){
		var buttons = document.querySelectorAll('button.next-step');
		for(var i =0;i<buttons.length;i++){
			buttons[i].addEventListener('click',handlers.next_step_click);
		}
		buttons = document.querySelectorAll('button.prev-step');
		for(var i =0;i<buttons.length;i++){
			buttons[i].addEventListener('click',handlers.prev_step_click);
		}
		var btn = document.querySelector('button.display-all-steps');
		btn.addEventListener('click',handlers.display_all_steps_click);
		var documents = document.querySelectorAll('div[data-step');
		documents = Array.prototype.slice.call(documents,1);
		for(var i =0;i<documents.length;i++){
			documents[i].style.display='none';
		}
		app.notify({type:'module_ready', data:{module: 'steps'}});
	};
	this.functions = {
		next_step: function(event){
			var currentStepDocument = document.querySelector('div[data-step="'+data.currentStep++ +'"]');
			currentStepDocument.style.display='none';
			var nextStepDocument = document.querySelector('div[data-step="'+data.currentStep +'"]');
			nextStepDocument.style.display='inherit';
		},
		prev_step: function(event){
			var currentStepDocument = document.querySelector('div[data-step="'+data.currentStep-- +'"]');
			currentStepDocument.style.display='none';
			var nextStepDocument = document.querySelector('div[data-step="'+data.currentStep +'"]');
			nextStepDocument.style.display='inherit';
		},
		display_all_steps:function(event){
			var documents = document.querySelectorAll('div[data-step');
			for(var i=0;i<documents.length;i++){
				documents[i].style.display='inherit';
			}
			var buttons = document.querySelectorAll('button.next-step');
			for(var i =buttons.length-1;i>=0;i--){
				buttons[i].remove();
			}
			buttons = document.querySelectorAll('button.prev-step');
			for(var i =buttons.length-1;i>=0;i--){
				buttons[i].remove();
			}
			var btn = document.querySelector('button.display-all-steps');
			btn.remove();
		}
	}
};