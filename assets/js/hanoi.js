config = {
	"circles": 0,
	'colors' : [
		'#913448',
		'#EB00FE',
		'#0700FE',
		'#00A3FE',
		'#00FEFC',
		'#00FE7D',
		'#00FE07',
		'#9AFE00',
		'#FEDA00',
		'#FE7D00',
		'#FE0700',
		'#5A4F51',
		'#000000',
	]
}

lastChosen = false;
solutionMoves = [];
timeouts = [];

function setPositions() {
	height = Math.min(30,$("#hanoi-a").height()*0.9/config.circles);
	width = $("#hanoi-a").parent().width();
	maxWidth = width*0.9;

	$("#hanoi-a .hanoi-circle").each(function(i, el) {
		$(el).css({
			"bottom": ($('#hanoi-a .hanoi-circle').length - i - 1)*height,
			"left"	: (width - $(el).width()) / 2
		});
	});

	$("#hanoi-b .hanoi-circle").each(function(i, el) {
		$(el).css({
			"bottom": ($('#hanoi-b .hanoi-circle').length - i - 1)*height,
			"left"	: (width - $(el).width()) / 2
		});
	});

	$("#hanoi-c .hanoi-circle").each(function(i, el) {
		$(el).css({
			"bottom": ($('#hanoi-c .hanoi-circle').length - i - 1)*height,
			"left"	: (width - $(el).width()) / 2
		});
	});
}

function solveHanoi(n, a, b, c) {

  	if (n==0) {
  		return;
	}

	solveHanoi(n-1, a, c, b);

	solutionMoves.push([a,b]);

	solveHanoi(n-1, c, b, a);

}

function start() {
	$('.hanoi-tube').each(function(i, el){
		$(el).empty();
	});

	for (var i = 1; i <= config.circles; i++) {
		$("#hanoi-a").append("<div class='hanoi-circle'id='circle-"+i+"'></div>")
	};

	height = Math.min(30,$("#hanoi-a").height()*0.9/config.circles);
	width = $("#hanoi-a").parent().width();
	maxWidth = width*0.9;
	
	var colorId = 0;
	$("#hanoi-a .hanoi-circle").each(function(i, el) {
		var color = config.colors[(colorId++)%config.colors.length];
		elWidth = maxWidth * (i+1) / config.circles
		$(el).height(height);
		$(el).width(elWidth);
		$(el).data('color', color);
		$(el).css({
			"background-color": color,
			"bottom": (config.circles - i - 1)*height,
			"left"	: (width - elWidth) / 2
		});
	});
}

function move(x, y) {
	el = $('#hanoi-'+x+' div:first-child');

	yChildren = $('#hanoi-'+y+' div:first-child');

	if((yChildren.length > 0 && yChildren.width() > el.width()) || yChildren.length == 0) {
		el.remove();
		$('#hanoi-'+y).prepend(el);
		setPositions();
		console.log('Moving '+x+' -> '+y);
		return true;
	}

	alert('Invalid move');

	return false;
}

$(function(){
	$("#automate").click(function() {
		
		timeouts.forEach(function(i, timeout){
			clearTimeout(timeout);
		});

		config.circles = $('input[name="circles"]').val();
		
		start();
		solveHanoi(config.circles, 'a', 'c', 'b');

		j = 0;
		
		solutionMoves.forEach(function(solution, i){
			timeouts.push(setTimeout(function(){  move(solutionMoves[j][0], solutionMoves[j][1]); j++; }, i*1000 + 500));
		})
	});
});