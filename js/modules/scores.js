App.modules.scores = function(App){
	var app = App;
	var data={
		score:0,
		DOMelement: document.getElementById('quiz-score')
	};
	var cache={};
	var handlers={
	};
	this.init= function(){
		app.notify({type:'module_ready', data:{module:'scores'}});
	};
	this.functions = {
		answer_correct:function(event){
			var points = event.data.points;
			data.DOMelement.innerHTML = points + ' points';
		}
	}
};