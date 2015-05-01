App.modules.answers = function(App){
	var app = App;
	var data={};
	var cache={};
	var handlers= {
		answer_click: function(event){
			var elem = this;
			//replace all buttons first, to disable more clicks
			var buttons = document.querySelectorAll('.answer');
			for(var i=buttons.length-1;i>=0;i--){
				var btn = buttons[i].cloneNode(true);
				if(elem==buttons[i]){
					elem=btn;
				}
				buttons[i].parentNode.replaceChild(btn,buttons[i]);
			}
			//if answer is correct, add 10 points
			var msg;
			if(typeof(elem.attributes['data-correct'])!== 'undefined' && 
				elem.attributes['data-correct'].value ==='true'){
				msg = 'Answer is correct!';
				elem.className += ' btn-success';
				app.notify({type:'answer_correct',data:{points:10}});
			}
			else{
				msg = 'Answer is incorrect!';
				elem.className += ' btn-danger';
			}
			//wait for a few seconds before displaying the new question
			setTimeout(function(){
				app.notify({type:'display_question'});
			},3000);
		}
	};
	this.init= function(){
		app.notify({type:'module_ready',data:{module:'answers'}});
	};
	this.functions={
		attach_answer_hook: function(event){
			var element = event.data.element;
			for(var i=0;i<element.children.length;i++){
				var child = element.children[i];
				if(child.tagName.toLowerCase() == 'button'){
					child.addEventListener('click',handlers.answer_click);
				}
			}
		}
	}
};