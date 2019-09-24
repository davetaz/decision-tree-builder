
var options = {

	colors: {
		nodeHighlight: "#2199e8"
	},
	layout: {
		divId: "tree-panel",
		svgWidth: 1200,
		svgHeight: 1000,
		svgMargin: {
			top: 20,
			right: 90,
			bottom: 30,
			left: 90
		},
		nodeWidth: 250,
		nodeHeight: 250,
		nodeMargin: {
			x: 100,
			y: 250
		},
		zoomScale: [-1, 100],
		transitionDuration: 750
	},

	operatorFunctions: {
		equal: function(a, b){
			return new Promise((resolve, reject) => {
				resolve(a == b);
			});
		},
		greater_than: function(a, b){
			return new Promise((resolve, reject) => {
				resolve(a > b);
			});
		},
		greater_than_equals: function(a, b){
			return new Promise((resolve, reject) => {
				resolve(a >= b);
			});
		}
	}
};

var myBuilder = new DecisionTreeBuilder(treeData, options);

function addNodes(node){
	property = $('#property').val();
	value = $('#boundary').val();
	direction = $('#direction').val();
	operator = "greater_than";
	if (direction == "gt") {
		name = property + " >= " + value;
		operator = "greater_than_equals"
	} else {
		name = property + " > " + value;
	}
	var newNodesData = [
		//false
		{
			"name": "False",
			"classification": "False"
		},
		//true
		{
			"name": "True",
			"classification": "True"
		}
	];
	myBuilder.addChildNodes(node, newNodesData);

	var decisionNodeData = {
		"name": name,
		"rules": [
			{
				"property": property,
				"operator": operator,
				"value":value
			}
		],
		"children": newNodesData
	};

	myBuilder.updateDecisionNodeData(node, decisionNodeData);
}

function pruneNode(node){
	myBuilder.pruneNode(node);
}

function addRootNode() {
	myBuilder.destroy();
	property = $('#property').val();
	value = $('#boundary').val();
	direction = $('#direction').val();
	operator = "greater_than";
	if (direction == "gt") {
		name = property + " >= " + value;
		operator = "greater_than_equals"
	} else {
		name = property + " > " + value;
	}
	var treeData = {
		"name": name,
		"rules": [
			{
				"property": property,
				"operator": operator,
				"value":value
			}
		],
		"children": [
		//false
		{
			"name": "False",
			"SF": 0,
			"NY": 0,
			"classification": "False"
		},
		//true
		{
			"name": "True",
			"SF": 0,
			"NY": 0,
			"classification": "True"
		}
		]
	};
	myBuilder = new DecisionTreeBuilder(treeData, options);
}

function serialise(){
	var tree = myBuilder.serialiseTreeToJSON();
	console.log(tree);
	alert(tree);
}

function updateDecisionNodeData(node){

	var newData = {
		"name": "newData #1",
		"rules": [
			{
				"property": "isFoo",
				"operator": "equals",
				"value": true
			}
		],
		"children": [
			{
				"name": "Falsey child",
				"classification": "FALSE"
			},
			{
				"name": "Truthy child",
				"classification": "TRUE"
			}
		]
	};

	myBuilder.updateDecisionNodeData(node, newData);
}

function queryTree(){

	var data = [
	{
		"id": 184,
		"label": "SF",
		"Bathrooms": 4,
		"Bedrooms": 4,
		"Year built": 1900,
		"Elevation": 75,
		"Square Footage": 3816,
		"Price": 2650000,
		"Price per sqft": 694
	},
	{
		"id": 87,
		"label": "SF",
		"Bathrooms": 1,
		"Bedrooms": 1,
		"Year built": 1900,
		"Elevation": 70,
		"Square Footage": 811,
		"Price": 725000,
		"Price per sqft": 894
	},
	{
		"id": 191,
		"label": "NY",
		"Bathrooms": 2,
		"Bedrooms": 2,
		"Year built": 1973,
		"Elevation": 10,
		"Square Footage": 1400,
		"Price": 1599000,
		"Price per sqft": 1142
	},
	{
		"id": 123,
		"label": "NY",
		"Bathrooms": 1,
		"Bedrooms": 1,
		"Year built": 1900,
		"Elevation": 10,
		"Square Footage": 1093,
		"Price": 1195000,
		"Price per sqft": 1093
	}];

	$.each(data, function(key, object) {
		myBuilder.queryDecisionTree(object).then((result) => {
			node = result.node;
			data = node.data;
			data[result.target] = data[result.target] + 1;
			myBuilder.updateNodeData(node,data);
		});
	});
	/*
	*/

}

window.addEventListener('nodeClick', function (e) {

	var node = e.detail;
	var action = $("input:radio[name ='nodeAction']:checked").val();
	$('.nodeAction').prop('checked', false);

	console.log('nodeClick');
	console.log(e.detail);
	console.log('action '+action);

	switch(action){

		case "addChildNodes":
			addNodes(node);
			break;

		case "pruneNode":
			pruneNode(node);
			break;

		case "updateDecisionNodeData":
			updateDecisionNodeData(node);
			break;

	}
});


function populateData() {
	$.each(categories, function(key, value) {
     	$('#property')
          .append($('<option>', { value : key })
          .text(value));
	});
}

$( document ).ready(function() {
    populateData();
});
