/*------------Show and Hide the Menu---------------*/
$(document).ready(function () {
	var timeID;
	$(".menu").click(function () {
		clearTimeout(timeID);
		$(".more").fadeToggle("fast");
		timeID = setTimeout(function () {$(".more").fadeOut("fast"); }, 3000);
	});
	$(".more").click(function () {
		$(".more").fadeOut("fast");
    });
	if(localStorage.getItem("Name")!=null)
	{
		setUserName();
		window.location = "#welcome";
	}
	timer(0,0);
	setPercentage(0);
});
/*--------------------------------------------------*/


/*--------------Global Variables---------------*/
var i, k = 0, cQuestion, score = 0;
var qTimeID, fTimeID, eTimeID, interval, time=10;
var checkArray = new Array();
var sQuestions = new Queue();
/*---------------------------------------------*/


function setUserName() {
	if(localStorage.getItem("Name")==null)
	{
		var userName = document.getElementById("Name").value;
		if (userName == "" ) {
			$("#userN").html("User");
		} else {
			$("#userN").html(userName);
			localStorage.setItem("Name", userName);
		}	
	}
	else
	{
		$("#userN").html(localStorage.getItem("Name"));
	}
}

function setI(temp)
{
	resetArray();
	resetQueue();
	cQuestion = undefined;
	score = 0;
	$("#score").html(score);
	document.getElementById("timerSound").pause();
	document.getElementById("timerSound").currentTime = 0;
	clearInterval(interval);
	clearTimeout(qTimeID);
	clearTimeout(fTimeID);
	clearTimeout(eTimeID);
	qTimeID = undefined;
	fTimeID = undefined;
	eTimeID = undefined;
	interval = undefined;
	removeClasses();
	time = 10;
	timer(0,0);
	i = temp;
	$("#ready").addClass("ui-page-active");
	$("#ready").css("opacity", "1").css("display", "block");
	setTimeout(function (){ $("#ready").fadeOut("fast", function (){$("#ready").removeClass("ui-page-active"); $("#ready").css("display", "none");})}, 4000);
	startQuiz();
}

function check(t)
{
	var limit = checkArray.length;
	var l, flag=0;
	
	for(l=0; l<limit; l++)
	{
		if(checkArray[l]==t)
		{
			flag =1;
			break;
		}
	}
	
	if(flag==0)
	{
		checkArray[k] = t;
		k++;
		return true;
	}
	else
	{
		return false;
	}
}

function randomGen (m)
{
	if(m<=checkArray.length)
	{
		console.log("Reset the Check Array as you reached the maximum");
	}
	else
	{
		while(true)
		{
			var n = Math.floor(Math.random()*m);
			var p = check(n);
			if (p==true)
			{
				return n;
			}
		}
	}		
}

function quizInit () 
{
	var s, j;
	for(s=0; s<15; s++)
	{
		j = randomGen(data[i].length);
		sQuestions.enqueue(data[i][j]);
	}
}

function updateQuestions() 
{
	$("#qNo").html("");
	$("#qNo").html(15-sQuestions.size());
	$("#question").html("");
	$("#question").html(cQuestion.question);
	$("#option1").html("");
	$("#option1").html(cQuestion.option1);
	$("#option2").html("");
	$("#option2").html(cQuestion.option2);
	$("#option3").html("");
	$("#option3").html(cQuestion.option3);
	$("#option4").html("");
	$("#option4").html(cQuestion.option4);
}

function removeClasses()
{
	$("#one").removeClass();
	$("#two").removeClass();
	$("#three").removeClass();
	$("#four").removeClass();
}

function disableOnClick()
{
	$("#one").css("pointer-events", "none");
	$("#two").css("pointer-events", "none");
	$("#three").css("pointer-events", "none");
	$("#four").css("pointer-events", "none");
}

function enableOnClick()
{
	$("#one").css("pointer-events", "auto");
	$("#two").css("pointer-events", "auto");
	$("#three").css("pointer-events", "auto");
	$("#four").css("pointer-events", "auto");
}

function showCorrectOption () 
{
	switch(cQuestion.answer)
	{
			case 1:
			$("#one").addClass("correctO");
			break;

			case 2:
			$("#two").addClass("correctO");
			break;

			case 3:
			$("#three").addClass("correctO");
			break;

			case 4:
			$("#four").addClass("correctO");
			break;
	}
}

function timer (time, animate)
{
	$('.timer').circleProgress({
		value: time,
		size: '60',
		startAngle: -1.57079633,
		fill: {
		  color: 'rgba(0, 0, 0, 0.3)'
		},
		animation: {
			duration: animate,
			easing: 'linear'
		},
		emptyFill: '#7EFF64',
		thickness: '10',
	});
}

function startTimer()
{
	enableOnClick();
	time = 10;
	$("#time").html(time);
	timer(1,10000);
	document.getElementById("timerSound").play();
	interval = setInterval(function () {
		time--;
		$("#time").html(time);
		if(time==0)
		{
			clearInterval(interval);
			disableOnClick();
			showCorrectOption();
		}
	}, 1000);
}

function nextQuestion()
{
	clearTimeout(fTimeID);
	clearTimeout(qTimeID);
	clearInterval(interval);
	timer((10.5-time)/10.0, 0);
	disableOnClick();
	showCorrectOption();
	document.getElementById("timerSound").pause();
	document.getElementById("timerSound").currentTime = 0;
	eTimeID = setTimeout(function () {
		hideAnimation();
		setTimeout(function () {
			removeClasses();
			cQuestion = sQuestions.dequeue();
			updateQuestions(); 
			startTimer();
			qTimeID = setTimeout(function () {
				if(sQuestions.size()!=0)
				{
					nextQuestion();	
				}
				else
				{
					setTimeout(function() {
						window.location = "#results";
						showResults();
					},3000);
				}
			},10100);
		},200)	
	},3000);
}

function hideAnimation()
{
	$("#hideAnim").css("display", "none");
	$("#hideAnim").addClass("ui-page-active");
	$("#hideAnim").fadeIn("fast", function () {
		setTimeout(function (){
			$("#hideAnim").fadeOut("fast", function (){
				$("#hideAnim").removeClass("ui-page-active"); 
			})
		}, 300);
	});
}

function startQuiz()
{
	quizInit();
	cQuestion = sQuestions.dequeue();
	updateQuestions(); 
	setTimeout(function () {
		startTimer();
		fTimeID = setTimeout(function () { nextQuestion(); },10300);
	}, 4000);
}

function restartQuiz()
{
	setI(i);
}

function setScore (option)
{
	if(sQuestions.size()!=0)
	{
		nextQuestion();	
	}
	else
	{
		clearTimeout(qTimeID);
		clearInterval(interval);
		timer((10.5-time)/10.0, 0);
		disableOnClick();
		document.getElementById("timerSound").pause();
		document.getElementById("timerSound").currentTime = 0;
		setTimeout(function() {
			window.location = "#results";
			showResults();
		},3000);
	}
	if(cQuestion.answer == option)
	{
		document.getElementById("correctSound").play();
		switch(cQuestion.answer)
		{
				case 1:
				$("#one").addClass("correct");
				break;

				case 2:
				$("#two").addClass("correct");
				break;

				case 3:
				$("#three").addClass("correct");
				break;

				case 4:
				$("#four").addClass("correct");
				break;
		}
		score = score + 20;
		$("#score").html(score);
	}
	else
	{
		showCorrectOption();
		switch(option)
		{
				case 1:
				$("#one").addClass("wrong");
				break;

				case 2:
				$("#two").addClass("wrong");
				break;

				case 3:
				$("#three").addClass("wrong");
				break;

				case 4:
				$("#four").addClass("wrong");
				break;
		}
		score = score - 5;
		$("#score").html(score);
	}
}

function setPercentage (percent)
{
	percent = percent/100;
	if(percent<0)
	{
		percent = 0;
	}
	$('.percentBar').circleProgress({
		value: percent,
		size: '250',
		startAngle: -1.57079633,
		fill: {
		  color: '#f1c40f'
		},
		animation: {
			duration: 1000
		},
		emptyFill: 'rgba(0, 0, 0, 0.3)',
		thickness: '20',
	});
}

function getAvg(choice)
{
	switch(choice)
	{
			
		case 0:
			if(localStorage.getItem("Avg0")==null)
			{
				return null;
			}
			else
			{
				return Number(localStorage.getItem("Avg0"));
			}
			break;

		case 1:
			if(localStorage.getItem("Avg1")==null)
			{
				return null;
			}
			else
			{
				return Number(localStorage.getItem("Avg1"));
			}
			break;
			
		case 2:
			if(localStorage.getItem("Avg2")==null)
			{
				return null;
			}
			else
			{
				return Number(localStorage.getItem("Avg2"));
			}
			break;
			
		case 3:
			if(localStorage.getItem("Avg3")==null)
			{
				return null;
			}
			else
			{
				return Number(localStorage.getItem("Avg3"));
			}
			break;
			
		case 4:
			if(localStorage.getItem("Avg4")==null)
			{
				return null;
			}
			else
			{
				return Number(localStorage.getItem("Avg4"));
			}
			break;
			
		case 5:
			if(localStorage.getItem("Avg5")==null)
			{
				return null;
			}
			else
			{
				return Number(localStorage.getItem("Avg5"));
			}
			break;
			
		case 6:
			if(localStorage.getItem("Avg6")==null)
			{
				return null;
			}
			else
			{
				return Number(localStorage.getItem("Avg6"));
			}
			break;
			
		case 7:
			if(localStorage.getItem("Avg7")==null)
			{
				return null;
			}
			else
			{
				return Number(localStorage.getItem("Avg7"));
			}
			break;
	}
}

function getTotalPercentage()
{
	var percent0 = localStorage.getItem("Avg0");
	var percent1 = localStorage.getItem("Avg1");
	var percent2 = localStorage.getItem("Avg2");
	var percent3 = localStorage.getItem("Avg3");
	var percent4 = localStorage.getItem("Avg4");
	var percent5 = localStorage.getItem("Avg5");
	var percent6 = localStorage.getItem("Avg6");
	var percent7 = localStorage.getItem("Avg7");
	return Math.floor((Number(percent0)+Number(percent1)+Number(percent2)+Number(percent3)+Number(percent4)+Number(percent5)+Number(percent6)+Number(percent7))/8);
}

function showResults()
{
	var cPercent;
	percent = Math.floor((score/300)*100);
	switch(i)
	{
			case 0:
				cPercent = getAvg(0);
				if(cPercent==null)
				{
					cPercent = percent;
				}
				else
				{
					cPercent = Math.floor((cPercent + percent)/2);	
				}
				localStorage.setItem("Avg0", cPercent);
				break;
			
			case 1:
				cPercent = getAvg(1);
				if(cPercent==null)
				{
					cPercent = percent;
				}
				else
				{
					cPercent = Math.floor((cPercent + percent)/2);	
				}
				localStorage.setItem("Avg1", cPercent);
				break;
			
			case 2:
				cPercent = getAvg(2);
				if(cPercent==null)
				{
					cPercent = percent;
				}
				else
				{
					cPercent = Math.floor((cPercent + percent)/2);	
				}
				localStorage.setItem("Avg2", cPercent);
				break;
			
			case 3:
				cPercent = getAvg(3);
				if(cPercent==null)
				{
					cPercent = percent;
				}
				else
				{
					cPercent = Math.floor((cPercent + percent)/2);	
				}
				localStorage.setItem("Avg3", cPercent);
				break;
			
			case 4:
				cPercent = getAvg(4);
				if(cPercent==null)
				{
					cPercent = percent;
				}
				else
				{
					cPercent = Math.floor((cPercent + percent)/2);	
				}
				localStorage.setItem("Avg4", cPercent);
				break;
			
			case 5:
				cPercent = getAvg(5);
				if(cPercent==null)
				{
					cPercent = percent;
				}
				else
				{
					cPercent = Math.floor((cPercent + percent)/2);	
				}
				localStorage.setItem("Avg5", cPercent);
				break;
			
			case 6:
				cPercent = getAvg(6);
				if(cPercent==null)
				{
					cPercent = percent;
				}
				else
				{
					cPercent = Math.floor((cPercent + percent)/2);	
				}
				localStorage.setItem("Avg6", cPercent);
				break;
			
			case 7:
				cPercent = getAvg(7);
				if(cPercent==null)
				{
					cPercent = percent;
				}
				else
				{
					cPercent = Math.floor((cPercent + percent)/2);	
				}
				localStorage.setItem("Avg7", cPercent);
				break;
	}
	cPercent = getTotalPercentage();
	localStorage.setItem("Avg", cPercent);
	setPercentage(percent);
	$("#percent").html(percent+"%");
	$("#userScore").html(score);
	var comment;
	comment = score + 75;
	comment = Math.floor(comment/25);
	switch(comment)
	{
		case 0:
			$("#commentLine").html("Ohh No!! I don't like these type of scores.");
			break;

		case 1:
			$("#commentLine").html("This is really bad. Think before you answer.");
			break;

		case 2:
			$("#commentLine").html("Negative! I never expected this from you.");
			break;

		case 3:
			$("#commentLine").html("Uff, Really bad score but not a big deal you can score more.");
			break;

		case 4:
			$("#commentLine").html("Study hard, Better luck next time!");
			break;

		case 5:
			$("#commentLine").html("Not a good score, but don't worry you can improve.");
			break;

		case 6:
			$("#commentLine").html("I think you are not concentrated.");
			break;

		case 7:
			$("#commentLine").html("Good, But I know you can score better.");
			break;

		case 8:
			$("#commentLine").html("Nice Score! Don't repeat the mistakes from the next time.");
			break;

		case 9:
			$("#commentLine").html("Very Good! Smart Answers! Avoid the mistakes from next time.");
			break;

		case 10:
			$("#commentLine").html("Great Buddy! Keep it Up!");
			break;

		case 11:
			$("#commentLine").html("Extraordinary! Now try other topics.");
			break;	

		case 12:
			$("#commentLine").html("Excellent! You are the best!");
			break;

		case 13:
			$("#commentLine").html("Brilliant Score! You are having a smart brain!");
			break;

		case 14:
			$("#commentLine").html("Awesome! You are a master in Data Structures I think.");
			break;

		case 15:
			$("#commentLine").html("Unbelievable, I think no one can beat you!");
			break;
	}
}

function setStatsPercentage ()
{
	var percent = getTotalPercentage(); 
	percent = percent / 100;
	if(percent<0)
	{
		percent = 0;
	}
	$('.sPercentBar').circleProgress({
		value: percent,
		size: '250',
		startAngle: -1.57079633,
		fill: {
		  color: '#f1c40f'
		},
		animation: {
			duration: 1000
		},
		emptyFill: 'rgba(0, 0, 0, 0.3)',
		thickness: '20',
	});
}

function showStatistics ()
{
	setStatsPercentage();
	$("#sPercent").html(getTotalPercentage()+"%");
	$("#mP0").html(Number(getAvg(0))+"%");
	document.getElementById("m0").setAttribute("value", getAvg(0)/100);
	$("#mP1").html(Number(getAvg(1))+"%");
	document.getElementById("m1").setAttribute("value", getAvg(1)/100);
	$("#mP2").html(Number(getAvg(2))+"%");
	document.getElementById("m2").setAttribute("value", getAvg(2)/100);
	$("#mP3").html(Number(getAvg(3))+"%");
	document.getElementById("m3").setAttribute("value", getAvg(3)/100);
	$("#mP4").html(Number(getAvg(4))+"%");
	document.getElementById("m4").setAttribute("value", getAvg(4)/100);
	$("#mP5").html(Number(getAvg(5))+"%");
	document.getElementById("m5").setAttribute("value", getAvg(5)/100);
	$("#mP6").html(Number(getAvg(6))+"%");
	document.getElementById("m6").setAttribute("value", getAvg(6)/100);
	$("#mP7").html(Number(getAvg(7))+"%");
	document.getElementById("m7").setAttribute("value", getAvg(7)/100);
}

function resetArray ()
{
	while(checkArray.length > 0) {
		checkArray.pop();
	}
	k=0;
}

function resetQueue()
{
	while(sQuestions.size() > 0) {
		sQuestions.dequeue();
	}
}

function reset()
{
	resetArray();
	resetQueue();
	cQuestion = undefined;
	score = 0;
	$("#score").html(score);
	document.getElementById("timerSound").pause();
	document.getElementById("timerSound").currentTime = 0;
	disableOnClick();
	clearInterval(interval);
	clearTimeout(qTimeID);
	clearTimeout(fTimeID);
	clearTimeout(eTimeID);
	qTimeID = undefined;
	fTimeID = undefined;
	eTimeID = undefined;
	interval = undefined;
	removeClasses();
	time = 10;
	timer(0,0);
}


/*-----------------------------------QUEUE-----------------------------------*/
function Queue(){
	this.head = -1;
	this.tail = -1;
	this.queueData = new Array();
	this.count =0;
}

Queue.prototype.enqueue = function(temp) {	
	if(this.head==-1 && this.tail==-1){
		this.head = 0;
		this.tail = 0;
		this.queueData[this.tail] = temp;
		this.count++;
	}
	else {
		this.tail++;
		this.queueData[this.tail] =temp;
		this.count++;
	}
};

Queue.prototype.dequeue = function() {
	if((this.head==-1 && this.tail==-1) || (this.head == this.tail + 1))
	{
		console.log("Nothing to Dequeue, Queue is already empty");
	}
	else {
		var returnNode = this.queueData[this.head];
		this.queueData[this.head] = undefined;
		this.head++;
		this.count--;
		return returnNode;
	}
};

Queue.prototype.size = function () {
	return this.count;
};

Queue.prototype.displayAll = function () {
	if((this.head==-1 && this.tail==-1) || (this.head == this.tail + 1))
	{
		console.log("Nothing to Display, Queue is empty");
	}
	else {
		var c = this.head;
		for( ; c<=this.tail; c++)
		{
			console.log(this.queueData[c]);
		}
	}
};
/*--------------------------------------------------------------------------*/