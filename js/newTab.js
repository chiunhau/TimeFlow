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
	apps = apps.slice(0, 20);
}

update();

var x = d3.scale.linear()
    .domain([0, d3.max(apps, function(d) { return d.sumTime })])
    .range([0, 900]);

var body = d3.select('body').style({'background-color': '#333'})


var svg = d3.select('body').append('svg').attr({'width': 1250, 'height': 600}).style({'margin': '50px'});

svg.selectAll('rect').data(apps).enter()
	.append('rect')
	.attr({'x': 200,
				 'y': function(d, i) { return i * 25 },
				 'width': function(d, i) { return x(d.sumTime) },
				 'height': 22,
				 'fill': 'steelblue',
				 'class': function(d, i) { return 'data' + i }
	})
	.on('mouseover', function(d, i) {
		d3.select(this)
			.transition()
			.duration(50)
			.attr('fill', '#4499da');

		d3.select('text.data' + i)
			.transition()
			.duration(50)
			.attr('fill', 'white')
	})
	.on('mouseout', function(d, i) {
		d3.select(this)
			.transition()
			.duration(50)
			.attr('fill', 'steelblue');

		d3.select('text.data' + i)
			.transition()
			.duration(50)
			.attr('fill', '#bbb')
	});

svg.selectAll('text.domain').data(apps).enter()
	.append('text')
	.text( function(d) { return d.domain })
	.attr({
		'x': 10,
		'y': function(d, i) {return i * 25 + 14},
		'fill': '#bbb',
		'font-size': '12px',
		'class': function(d, i) { return 'data' + i }
});

svg.selectAll('text.sum-time').data(apps).enter()
	.append('text')
	.text( function(d) { 
		var hh = d.hr > 0 ? d.hr + 'hr ' : '';
		var mm = d.min > 0 ? d.min + 'min ' : '';
		var ss = d.sec > 0 ? d.sec + ' sec ' : '';
		return  hh + mm + ss
	})
	.attr({
		'x': function(d, i) {return x(d.sumTime) + 205},
		'y': function(d, i) {return i * 25 + 14},
		'fill': 'white',
		'font-size': '12px',
		'class': function(d, i) { return 'data' + i }
});
