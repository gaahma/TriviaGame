var game = {
	currentQuestion: undefined,

	init: function(){
		this.correct = 0;
		this.incorrect = 0;
		this.questionList = [];
		this.unanswered = 0;
		for (var i = 0; i < QandAs.length; i++){
			game.questionList.push(game.question(QandAs[i][0],QandAs[i][1],
												 QandAs[i][2],QandAs[i][3],
												 QandAs[i][4]));
		}
		this.scramble(this.questionList);
		game.run();
	},

	run: function(){
		if(game.questionList.length === 0){
			game.displayScore();
			game.endGame();
			return;
		}
		game.nextQuestion();
		game.displayQuestion();
		game.timer.tick();
		
	},

	runAfterTimeout: function(){
		setTimeout(function(){
			game.run();
		}, 2500);
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
					game.unanswered++;
					game.displayCorrectAnswer();
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

	nextQuestion: function(){
		game.currentQuestion = game.questionList.splice(0,1)[0];	
	},

	displayQuestion: function(){
		$("#question").html(this.currentQuestion.question);
		var answers = $("#answers").children()
		for(var i = 0; i < answers.length; i++){
			answers.eq(i).text(game.currentQuestion.mixedAnswers[i]);
		}	
	},

	displayScore: function(){
		$("#timer").empty();
		$("#correct").html("Correct: " + game.correct);
		$("#incorrect").html("Incorrect: " + game.incorrect);
		$("#unanswered").html("Unanswered: " + game.unanswered);
	},

	displayCorrectAnswer: function(){
		$("#question").html("The correct answer was " + game.currentQuestion.answer);
	},

	endGame: function(){
		$("#playAgain").append("<button id='replay'>Play Again?</button>");
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
	$("#question").html("<button id='replay'>Start</button>");

	$(".answer").on("click", function(){
		if(!game.timer.isTicking)
			return;
		game.timer.clear();
		if($(this).html() === game.currentQuestion.answer){
			game.correct++;
		} else {
			game.incorrect++;
		}
		game.displayCorrectAnswer();
		game.runAfterTimeout();
	});

	$(document).on("click", "#replay", function(){
		$("#playAgain").empty();
		$("#correct").empty();
		$("#incorrect").empty();
		$("#unanswered").empty();

		game.init();
	});
});