var apps = {};

function timeParser(seconds) {
	var sec = seconds % 60;
	var min = ((seconds - sec) / 60) % 60;
	var hr = Math.floor(seconds / 3600);
	
	return [hr, min, sec];
}

function loopOverApps(apps) {
	var ary = [];
	for (var key in apps) {
		if (apps.hasOwnProperty(key)) {
			var parsedTime = timeParser(apps[key].sumTime);
			ary.push({domain: key, sumTime: apps[key].sumTime, hr: parsedTime[0], min: parsedTime[1], sec: parsedTime[2]});
		}
	}
	return ary;
}

function update() {
	apps = loopOverApps(JSON.parse(localStorage["apps"]));
	apps.sort(function(a,b) { return b.sumTime - a.sumTime });
	apps = apps.slice(0, 15);
}

function showDate() {
	if(localStorage.getItem('start')) {
		document.getElementById('start').innerHTML = localStorage.getItem('start');
	}
}
showDate()
update();

function reset() {
  var d = new Date();
  console.log(d);
  localStorage.setItem('start', d);
  localStorage.setItem('apps', JSON.stringify({}));
  console.log(localStorage.getItem('apps'));
  console.log(localStorage.getItem('d'));  
  apps = {};
  var bgPage = chrome.extension.getBackgroundPage();
  bgPage.initial();
  location.reload();

}

document.getElementById('reset').addEventListener('click', function() {
  reset();
})
var x = d3.scale.linear()
    .domain([0, d3.max(apps, function(d) { return d.sumTime })])
    .range([0, 700]);

var body = d3.select('body').style({'background-color': '#21231f'})


var svg = d3.select('#infographic').append('svg').attr({'width': 1024, 'height': 500}).style({'margin': '0 auto', 'margin-top': '10px'});

svg.selectAll('rect').data(apps).enter()
	.append('rect')
	.attr({'x': 190,
				 'y': function(d, i) { return i * 28 + 6},
				 'width': function(d, i) { return x(d.sumTime) },
				 'height': 10,
				 'rx': 5,
				 'ry': 5,
				 'fill': function(d, i){ return 'hsl(216, 100%, ' + (76 - 3 * i) + '%)'},
				 'class': function(d, i) { return 'data' + i }
	})
	.on('click', function (d, i) {
		window.location = 'http://' + d.domain;
	})
	.on('mouseover', function(d, i) {
			d3.select(this)
				.transition()
				.duration(50)
				.attr('fill', 'hsl(216, 100%, ' + (90 - 3 * i) + '%)');
		})
	.on('mouseout', function(d, i) {
		d3.select(this)
			.transition()
			.duration(50)
			.attr('fill', 'hsl(216, 100%, ' + (76 - 3 * i) + '%)');
	});

svg.selectAll('text.domain').data(apps).enter()
	.append('text')
	.text( function(d) { return d.domain })
	.attr({
		'x': 170,
		'y': function(d, i) {return i * 28 + 16},
		'fill': '#858585',
		'font-size': '13px',
		'text-anchor': 'end',
		'class': function(d, i) { return 'data' + i }
	})
	.on('click', function (d, i) {
		window.location = 'http://' + d.domain;
	})
	.on('mouseover', function(d, i) {
			d3.select(this)
				.transition()
				.duration(50)
				.attr('fill', '#ccc');
		})
	.on('mouseout', function(d, i) {
		d3.select(this)
			.transition()
			.duration(50)
			.attr('fill', '#858585');
	});

svg.selectAll('text.sum-time').data(apps).enter()
	.append('text')
	.text( function(d) { 
		var hh = d.hr > 0 ? d.hr + ' hr ' : '';
		var mm = d.min > 0 ? d.min + ' min ' : '';
		var ss = d.sec > 0 ? d.sec + ' sec ' : '';
		return  hh + mm + ss
	})
	.attr({
		'x': function(d, i) {return x(d.sumTime) + 200},
		'y': function(d, i) {return i * 28 + 16},
		'fill': '#595959',
		'font-size': '13px',
		'class': function(d, i) { return 'data' + i }
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-41951304-8']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();