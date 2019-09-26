
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
queryTree();

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
	hideSubSections();
	queryTree();
}

function fitBounds() {
	hideSubSections();
	myBuilder.fitBounds(0.70, 500);
}

function pruneNode(node){
	myBuilder.pruneNode(node);
	hideSubSections();

}

function addRootNode() {
	myBuilder.destroy();
	property = $('#root-property').val();
	value = $('#root-boundary').val();
	direction = $('#root-direction').val();
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
	hideSubSections();
	queryTree();
}

function serialise(){
	var tree = myBuilder.serialiseTreeToJSON();
	console.log(tree);
	alert(tree);
}

function updateDecisionNodeData(node){
	var children = [
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
	];
	var newData = node.data;
	newData.children = children;
	myBuilder.updateDecisionNodeData(node, newData);
}

function queryTree(){
	hideSubSections();
	var timestamp = Date.now();
	$.each(houses, function(key, object) {
		myBuilder.queryDecisionTree(object).then((result) => {
			node = result.node;
			data = node.data;
			if (data.timestamp != timestamp) {
				data.timestamp = timestamp;
				data.SF = 0;
				data.NY = 0;
			}
			data[result.target] = data[result.target] + 1;
			myBuilder.updateNodeData(node,data);
		});
	});
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
        $('#root-property')
          .append($('<option>', { value : key })
          .text(value));
	});
}

function hideSubSections() {
	$('subsection').css('display','none');
}

function expandSection(section) {
	hideSubSections();
	sectionName = section + "SubSection";
	radio = section + "Radio";
	$('#'+radio).prop("checked", true);
	$('#'+sectionName).show();
}

$( document ).ready(function() {
    populateData();
});
