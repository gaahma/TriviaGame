var game = {
/*
	initialize the game by creating game variables, and creating a array of 
	question objects, randomizing the order of that array, then running
	the game.
*/
	init: function(){
		this.correct = 0;
		this.incorrect = 0;
		this.unanswered = 0;
		this.questionList = [];
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
		game.hideButtons(false);
		game.run();
	},
/*
	First check if there is a question object still in questionList.
	If not, the game is over

	Otherwise, load and display the next question, and begin the timer
*/
	run: function(){
		game.resetButtons();
		game.answered = false;
		if(game.questionList.length === 0){
			game.displayFinalScore();
			game.hideButtons(true);
			return;
		}
		game.loadNextQuestion();
		game.displayQuestion();
		console.log(this.currentQuestion.answer);
		game.timer.tick();
	},
/*
	runs game.run() after a delay.
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
			var time = this.countdown;
			this.isTicking = true;
			$("#timer").html(time);
			this.intervalId = setInterval(function(){
				time--;
				$("#timer").html(time);
				if(time === 5){
					$("#timer").animate({"color": "red"}, time*1000);
				}
				if(time === 0){
					game.timer.clear();
					game.timerFlash();
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
	loadNextQuestion: function(){
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
				.attr("answer", game.currentQuestion.mixedAnswers[i])
				.text(game.currentQuestion.mixedAnswers[i]);
			} else {
				answers
				.eq(1)
				.children()
				.eq(i-2)
				.attr("answer", game.currentQuestion.mixedAnswers[i])
				.text(game.currentQuestion.mixedAnswers[i]);
			}
		}
	},

	displayFinalScore: function(){
		$("#question").empty();
		var finalScore = $("<div>");
		var correct = $("<p>").text("Correct: " + game.correct);
		var incorrect = $("<p>").text("Incorrect: " + game.incorrect);
		var unanswered = $("<p>").text("Unanswered: " + game.unanswered);
		var playAgain = $("<div>").addClass("answer").attr("id", "play").text("Play Again");
		finalScore.append(correct, incorrect, unanswered, playAgain);
		$("#question").append(finalScore);
		$("#timer").empty();
	},
/*
	If there's a cleaner way to do this, I couldn't find it.  Loops wouldn't work
*/
	timerFlash: function(){
		$("#timer").stop()
		.animate({"color": "#222"}, 125)
		.animate({"color": "red"}, 125)
		.animate({"color": "#222"}, 125)
		.animate({"color": "red"}, 125)
		.animate({"color": "#222"}, 125)
		.animate({"color": "red"}, 125);
	},
/*
	If there's a cleaner way to do this, I couldn't find it.  Loops wouldn't work
*/
	flashRed: function(button){	
		button.stop()
		.animate({"border-color": "#222"}, 125)
		.animate({"border-color": "red"}, 125)
		.animate({"border-color": "#222"}, 125)
		.animate({"border-color": "red"}, 125)
		.animate({"border-color": "#222"}, 125)
		.animate({"border-color": "red"}, 125)
		.animate({"border-color": "#222"}, 125)
		.animate({"border-color": "red"}, 125);
	},
/*
	I kept encountering bugs getting all the answer buttons to properly reset.
	Sometimes the mouseenter/mouseleave events would cause them to stay 
	totally or partially opacified.  This function solved it
*/
	resetButtons: function(){	
		$(".answer").each(function(){	
			$(this).css({
				"opacity": 1,
				"border-color": "blue"	
			});
		});
		$("#timer").stop().css({"color":"white"});		
	},
/*
	Gives the correct answer a green border, and makes the other answers invisible
*/
	showCorrectAnswer: function(){
		$(".answer").each(function(){
			if($(this).attr("answer") === game.currentQuestion.answer){
				game.flashGreen($(this));
			} else {
				$(this).stop().animate({
					opacity: 0,
				}, "slow");
			}
		});
	},

	flashGreen: function(button){
		button.stop().animate({"border-color": "#29ff00"}, 1500);
	},

/*
	If passed true, this will hide buttons, 
	if false, it will make them visible again.

	Note: this targets the div that contains the answers, not each individual
	answer div
*/
	hideButtons: function(hide){
		if(hide){
			$("#answers").css(
				{"opacity": 0});
		} else {
			$("#answers").css(
				{"opacity": 1});			
		}
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
	game.hideButtons(true);
	$("#question").html("<div class='answer' id='play'>Start</div>");

	$(document).on("click", "#play", function(){
		$("#question").empty();
		game.init();
	});

	$(".answer").on("click", function(){
		if(!game.timer.isTicking)	//if game.timer is not ticking
			return;						//ignore answer clicks

		game.timer.clear();											//otherwise stop the timer							
		if($(this).attr("answer") === game.currentQuestion.answer){	//compare user answer to the correct answer
			game.correct++;											//if right, incrememt correct								
			$("#timer").stop().css({"color":"white"});				//change timer back to white
		} else {
			game.incorrect++;								//else increment incorrect
			game.flashRed($(this));							//flash the button red						
		}
		game.showCorrectAnswer();							//green highlight correct answer
		game.answered = true;
		game.runAfterTimeout();								//call game.run() after a delay
	});
/*
	These last few functions handle the color changes when user hovers over
	an .answer div
*/
	function on(){
		if(!game.answered)
			$(this).stop().animate({"border-color": "white"}, "slow");
	}

	function off(){
		if(!game.answered)
			$(this).stop().animate({"border-color": "blue"}, "slow");
	}

	$(document).on("mouseenter", ".answer", on);
	$(document).on("mouseleave", ".answer", off);
});
