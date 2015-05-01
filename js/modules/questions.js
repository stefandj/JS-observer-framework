App.modules.questions = function(App){
	var app = App;
	var data={
		questions:[
			{
				question:'What color was the arrow which killed Smaug in The Hobbit?',
				answers:['Black','Green','White','Red']
			},
			{
				question:'Luke, I am your ____.',
				answers:['Father','Uncle','Roommate','Son']
			},
			{
				question:'Commander Cody, the time has come. Execute Order __.',
				answers:['66','69','72','84']
			}
		]
	};
	var cache={};
	var handlers={
		start_quiz_btn:function(event){
			this.remove();
			document.getElementById('quiz').style.display='inherit';
			app.notify({type:'display_question'});
		}
	};
	
	this.init= function(){
		//lets create a repeater
		data.repeater = new app.repeater({template:'question-template', parent: 'quiz-question'});
		var quiz_question = document.getElementById('quiz-question');
		data.parent = quiz_question;
		app.notify({type:'module_ready', data:{module:'questions'}});
		var start_quiz_btn = document.getElementById('start-quiz');
		start_quiz_btn.addEventListener('click',handlers.start_quiz_btn);
	};
	this.functions = {
		display_question: function(event){
			if(data.questions.length==0){
				var container = document.getElementById('quiz-question');
				for(var i=container.children.length-1;i>=0;i--){
					container.children[i].remove();
				}
				var notification = document.createElement('div');
				notification.className = 'alert alert-success';
				notification.innerText = 'You have completed this quiz. Congratulations.';
				container.appendChild(notification);
				return;
			}
			var question = data.questions.pop();
			//prepare the data to be the same format as our template
			var parsedQuestion = {
				question_text:question.question,
				answer1:question.answers[0],
				answer2:question.answers[1],
				answer3:question.answers[2],
				answer4:question.answers[3],
			};
			var element = data.repeater.addData(parsedQuestion);
			//send the element to the answers module to hook up the handlers
			app.notify({type:'attach_answer_hook',data:{element:element}});
			//remove first child from the quiz-question, we want to display only one question
			if(data.parent.children.length>1){
				data.parent.children[0].remove();
			}
		}
	}
};