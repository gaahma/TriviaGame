var game = {

/*
	initialize the game by creating game variables, and creating a array of 
	question objects, randomizing the order of that array, then running
	the game.
*/
	init: function(){
		this.correct = 0;
		this.incorrect = 0;
		this.questionList = [];
		this.unanswered = 0;
		this.currentQuestion = undefined;
		this.answered = false;
		for (var i = 0; i < QandAs.length; i++){
			game.questionList.push(game.question(QandAs[i][0],
												 QandAs[i][1],
												 QandAs[i][2],
												 QandAs[i][3],
												 QandAs[i][4]));
		}
		this.scramble(this.questionList);
		game.run();
	},
/*
	First check if there is a question object still in questionList.
	If not, the game is over

	Otherwise, load and display the next question, and begin the timer
*/
	run: function(){
		game.resetButtons();
		if(game.questionList.length === 0){
			game.displayFinalScore();
			return;
		}
		game.nextQuestion();
		game.displayQuestion();
		game.timer.tick();
		
	},
/*
	runs a function after a delay.
*/
	runAfterTimeout: function(){
		setTimeout(function(){
			game.run()
		}, 3000);
	},

	timer: {
		countdown: 10,
		intervalId: undefined,
		isTicking: false,

		tick: function(){
			var time = game.timer.countdown;
			game.timer.isTicking = true;
			$("#timer").html(time);
			this.intervalId = setInterval(function(){
				time--;
				$("#timer").html(time);
				if(time === 0){
					game.timer.clear();
					game.answered = true;
					game.unanswered++;
					game.showCorrectAnswer();
					game.runAfterTimeout();
				}
			}, 1000);
		},

		clear: function(){
			clearInterval(game.timer.intervalId);
			game.timer.isTicking = false;
		}
	},
/*
	Returns a question object containing a trivia question, the correct
	answer, and 3 incorrect answers.  
*/
	question: function(question, answer, wrong1, wrong2, wrong3){
		var question = {
			question: question,
			answer: answer,
			mixedAnswers: [answer, wrong1, wrong2, wrong3],	
		}
		game.scramble(question.mixedAnswers);
		return question;
	},
/*
	Destructively loads the next question from questionList
*/
	nextQuestion: function(){
		game.currentQuestion = game.questionList.pop();	
	},

	displayQuestion: function(){
		$("#question").html(this.currentQuestion.question);
		var answers = $("#answers").children();
		for(var i = 0; i < 4; i++){
			if(i < 2){
				answers
				.eq(0)
				.children()
				.eq(i)
				.text(game.currentQuestion.mixedAnswers[i]);
			} else {
				answers
				.eq(1)
				.children()
				.eq(i-2)
				.text(game.currentQuestion.mixedAnswers[i]);
			}

		}
	},

	displayFinalScore: function(){
		$("#timer").empty();
		$("#correct").html("Correct: " + game.correct);
		$("#incorrect").html("Incorrect: " + game.incorrect);
		$("#unanswered").html("Unanswered: " + game.unanswered);
		$("#playAgain").append("<button id='replay'>Play Again?</button>");
	},

	displayCorrectAnswer: function(correctness){
		$("#question").html(correctness + '!! The answer was "' + game.currentQuestion.answer + '"');
	},

	flashRed: function(button){
		if (game.answered)
			return;
		answered = true;		
		button.stop()
		.animate({"border-color": "#222"}, 150)
		.animate({"border-color": "red"}, 150)
		.animate({"border-color": "#222"}, 150)
		.animate({"border-color": "red"}, 150)
		.animate({"border-color": "#222"}, 150)
		.animate({"border-color": "red"}, 150)
		.animate({"border-color": "#222"}, 150)
		.animate({"border-color": "red"}, 150);
	},

	flashGreen: function(button){
		answered = true;
		button.stop()
		.animate({"border-color": "#29ff00"}, 1500);
	},

	resetButtons: function(){
		
		$(".answer").each(function(){	
			$(this).stop().animate({
				"border-color": "blue",
				opacity: 1 	
			}, "fast");
			});
		game.answered = false;
	},

	showCorrectAnswer: function(){
		$(".answer").each(function(){
			if($(this).html() === game.currentQuestion.answer){
				game.flashGreen($(this));
			} else {
				$(this).animate({
					opacity: 0,
				}, "slow");
			}
		})
	},



/*
	There are two instances in this project where I need an array scrambled.
	This function does it nicely, apparently called the Durstenfeld shuffle.
	
*/
	scramble: function(array){
		for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
		}
	}
}



$(document).ready(function(){
	$("#question").html("<div class='answer' id='replay'>Start</div>");

	$(".answer").on("click", function(){
		if(!game.timer.isTicking)	//if game.timer is not ticking
			return;						//ignore answer clicks

		game.timer.clear();									//otherwise stop the timer
		var correctness;							
		if($(this).html() === game.currentQuestion.answer){	//compare user answer to the correct answer
			game.correct++;									//if right, incrememt correct
			game.flashGreen($(this));
			game.showCorrectAnswer();		
		} else {
			game.incorrect++;								//else increment incorrect
			game.flashRed($(this));
			game.showCorrectAnswer();
		}
		game.answered = true;
		game.runAfterTimeout();								//call game.run() after a delay
	});
/*
	
*/
	$(document).on("click", "#replay", function(){
		$("#playAgain").empty();
		$("#correct").empty();
		$("#incorrect").empty();
		$("#unanswered").empty();

		game.init();
	});

	function on(){
		if(!game.answered)
			$(this).stop().animate({"border-color": "white"}, "slow");
	}

	function off(){
		if(!game.answered)
			$(this).stop().animate({"border-color": "blue"}, "slow");
	}


	$(".answer").hover(on, off);
});