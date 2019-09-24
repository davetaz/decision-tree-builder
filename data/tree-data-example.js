property = "Bathrooms";
value = 4;
direction = "lt"
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