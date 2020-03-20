$( document ).ready(function() {
	var color = getUrlParam('color','blue');
	var group = getUrlParam('group',"1");
	var card = getUrlParam('card',"1");

	if (color == "purple") {
		getPurpleCards();
	} 

	if (color == "blue") {
		getBlueCards(group,card);
	} 

});

function getPurpleCards() {
	var count = 1;
    d3.csv('data/houses_20.csv', function(data) {
    	renderCard(data,count);
    	count += 1;	
    });
}

function getBlueCards(group,card) {
	var count = 1;
	var index = 1;
    d3.csv('data/houses.csv', function(data) {
    	if (data.group == group) {
    		if (card == count) {
    			renderCard(data,index);
    		}
    		count += 1;
    	}
    	index += 1;
    });
}

function renderCard(data,count) {
	console.log(data);
	$('body').append('<card><h1 class="target">'+data.city+'</h1><h1 class="number">#'+count+'</h1><image src="img/house.png"></image><table><tr><td class="attribute">Bathrooms</td><td class="value">'+data.bath+'</td></tr><tr><td class="attribute">Bedrooms</td><td class="value">'+data.beds+'</td></tr><tr><td class="attribute">Year built</td><td class="value">'+data.year_built+'</td></tr><tr><td class="attribute">Elevation</td><td class="value">'+formatNumber(data.elevation)+'ft</td></tr><tr><td class="attribute">Square Footage</td><td class="value">'+formatNumber(data.sqft)+'</td></tr><tr><td class="attribute">Price</td><td class="value">$'+formatNumber(data.price)+'</td></tr><tr><td class="attribute">Price per sqft</td><td class="value">$'+formatNumber(data.price_per_sqft)+'</td></tr></table></card>');
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}