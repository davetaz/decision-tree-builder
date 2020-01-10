var variables = [
	{ "Bathrooms": 2 },
	{ "Bedrooms": 2 },
	{ "Year built": 1900 },
	{ "Elevation": 75 },
	{ "Square Footage": 3816 },
	{ "Price": 2650000 },
	{ "Price per sqft": 694 }
];

var table;

$( document ).ready(function() {
	table = $('#output-table').DataTable( {
        columns: [
            { title: "Bathrooms" },
            { title: "Bedrooms" },
            { title: "Year built" },
            { title: "Elevation" },
            { title: "Square Footage" },
            { title: "Price" },
            { title: "Price per sqft" },
            { title: "Classification" }
        ]
	});
	variables.forEach(function(val,idx) {
		for (var key in val) {
			idkey = key.replace(/ /g,"_");
			$("#varables-table").append("<tr id='input'><td>" + key + "</td><td><input type='text' id='"+idkey+"' value='"+val[key]+"'></input></td>"+"<td><input type='checkbox' id='check_"+idkey+"' name='"+key+"'></input></td><td><input type='text'  id='low_"+idkey+"'></input></td><td><input type='text' id='high_"+idkey+"'></input></td><td><input type='text' id='interval_"+idkey+"'></input></td></div>");
		}
	});
});

function runEvaluator(){
	data = [];
	variables.forEach(function(val,idx) {
		for (var key in val) {
			idkey = key.replace(/ /g,"_");
			if ($('#check_'+idkey).is(":checked")) {
				
				low = parseFloat($('#low_'+idkey).val());
				high = parseFloat($('#high_'+idkey).val());
				interval = parseFloat($('#interval_'+idkey).val());

				if (!$.isNumeric(low)) { alert('missing minimum value for ' + key); return; }
				if (!$.isNumeric(high)) { alert('missing maximum value for ' + key); return; }
				if (!$.isNumeric(interval)) { alert('missing invertal value for ' + key); return; }

				if (low == high) { alert(key + ": Min and Max can't be the same value"); return; }
				if (low > high) { alert(key + ": Min " + low + " cannot be greater than Max " + high); return; }

				local = {};
				local.name = key;
				local.low = low;
				local.high = high;
				local.interval = interval;
				data.push(local);

			} else {

				local = {};
				local.name = key;
				local.value = parseFloat($('#'+idkey).val());
				data.push(local);
			}
		}
	});
	output = [];
	createData(data,output);
	drawTable(evaluateTree(output));
	$('#output-section').show();
}


function drawTable(outputData) {
	table.clear();
	outputData.forEach(function(val,idx) {
		if (val["Bathrooms"] == undefined || val["Bedrooms"] == undefined || val["Year built"] == undefined || val["Elevation"] == undefined || val["Square Footage"] == undefined || val["Price"] == undefined || val["Price per sqft"] == undefined || val["Classification"] == undefined) {

		} else {
			console.log(val);
			table.row.add([val["Bathrooms"],val["Bedrooms"],val["Year built"],val["Elevation"],val["Square Footage"],val["Price"],val["Price per sqft"], val["Classification"]]).draw();
		}
	});
}

function createData(data,output) {
	
	data.forEach(function(val,idx) {
		if ($.isNumeric(val.low)) {
			flag = true;
			for(let i = parseFloat(val.low);i<=parseFloat(val.high);i+=parseFloat(val.interval)) {
				var temp = JSON.parse(JSON.stringify(data));
				console.log(i);
				temp[idx].name = val.name;
				temp[idx].value = i;
				delete temp[idx].low;
				delete temp[idx].high;
				delete temp[idx].interval;
				createData(temp,output);
			}
		}
	});
	output.push(getSingle(data));
}

function getFlag(data) {
	data.forEach(function(val,idx) {
		if ($.isNumeric(val.low)) {
			console.log('in here');
			return true;
		}
		if (idx === data.length) {
			return false;
		}
	});
}

function getSingle(data) {
	record = {};
	data.forEach(function(val,idx) {
		record[val.name] = val.value;
	});
	return record;
}

function evaluateTree(testData) {
	testData.forEach(function(val,idx) {
		if (val["Bedrooms"] % 1 != 0) {
			testData[idx].Classification = "New York";
		} else {
			if ((val["Year built"] > 1939) && (val["Year built"] < 1961)) {
				testData[idx].Classification = "San Francisco";
			} else {
				if (val["Elevation"] > 73) {
					testData[idx].Classification = "San Francisco";
				} else {
					if (val["Price per sqft"] < 1000) {
						testData[idx].Classification = "San Francisco";
					} else {
						testData[idx].Classification = "New York";
					}
				}
			}
		}
	});
	return testData;
}