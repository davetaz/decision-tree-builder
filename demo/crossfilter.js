console.log(houses);

var cf = crossfilter(houses);
var all = cf.groupAll();

var targetChart = dc.pieChart('#target-chart');
var elevationChart = dc.barChart('#elevation-chart')

var target = cf.dimension(function (d) {
	return d.label;
});

var targetGroup = target.group();

var elevation = cf.dimension(function (d) {
	return d.Elevation;
});

var elevationGroup = elevation.group();

targetChart
	.width(180)
	.height(180)
	.radius(80)
	.dimension(target)
	.group(targetGroup);


elevationChart
	.width(420)
	.height(180)
	.dimension(elevation)
	.group(elevationGroup)
	.x(d3.scaleLinear().domain([0, 100]));

dc.renderAll();

