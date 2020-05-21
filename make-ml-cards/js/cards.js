function processInput() {
    val = $('#number').val();
    console.log(val);
    if (redCount >= maxRedCount) {
        alert("You have reached your limit of " + maxRedCount + " cards!");
    }
    if (redDone[val]) {
        alert("You already have that card");
    } else {
        getRedCard(val);
    }
}

function getRedCard(card) {
    var index = 1;
    d3.csv('data/red_cards.csv', function(data) {
        if (index == card && redCount < maxRedCount) {
            data.city = "?";
            renderRedCard(data,index,'red');
            redCount += 1;
            redDone[index] = true;
        }
        index += 1;
    });
}


function getPurpleCards() {
    var count = 1;
    d3.csv('data/houses_20.csv', function(data) {
    	renderCard(data,count,'purple');
    	count += 1;	
    });
}

function getBlueCards(group,card) {
    var count = 1;
    var index = 1;
    d3.csv('data/houses.csv', function(data) {
    	if (data.group == group) {
    		renderCard(data,index,'blue');
    		count += 1;
    	}
    	index += 1;
    });
}

function getRandomNumbers(count,min,max) {
    var random = [];
    var i = 0;
    while (i<count) {
        random[Math.floor((Math.random() * max) + min)] = true;
        i = ObjectLength(random);
        console.log(i);
    } 
    return random;
}

function ObjectLength( object ) {
    var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
};

function getRedCards(random) {
    var index = 1;
    d3.csv('data/red_cards.csv', function(data) {
        if (random[index]) {
            data.city = "?";
            renderRedCardNormal(data,index,'red');
        }
        index += 1;
    });
}

function removeCard(id){
    $('#red-'+id).remove();
    redCount = redCount - 1;
    redDone[id] = false;
}

function renderCard(data,count,color) {
	$('body').append('<card><h1 class="target">'+data.city+'</h1><h1 class="number">#'+count+'</h1><image src="img/house.png"></image><table class="'+color+'"><tr><td class="attribute">Bathrooms</td><td class="value">'+data.bath+'</td></tr><tr><td class="attribute">Bedrooms</td><td class="value">'+data.beds+'</td></tr><tr><td class="attribute">Year built</td><td class="value">'+data.year_built+'</td></tr><tr><td class="attribute">Elevation</td><td class="value">'+formatNumber(data.elevation)+'ft</td></tr><tr><td class="attribute">Square Footage</td><td class="value">'+formatNumber(data.sqft)+'</td></tr><tr><td class="attribute">Price</td><td class="value">$'+formatNumber(data.price)+'</td></tr><tr><td class="attribute">Price per sqft</td><td class="value">$'+formatNumber(data.price_per_sqft)+'</td></tr></table></card>');
}

function renderRedCardNormal(data,count,color) {
    $('body').append('<card id="red-'+count+'"><h1 class="target">'+data.city+'</h1><h1 class="number">#'+count+'</h1><image src="img/house.png"></image><table class="'+color+'"><tr><td class="attribute">Bathrooms</td><td class="value">'+data.bath+'</td></tr><tr><td class="attribute">Bedrooms</td><td class="value">'+data.beds+'</td></tr><tr><td class="attribute">Year built</td><td class="value">'+data.year_built+'</td></tr><tr><td class="attribute">Elevation</td><td class="value">'+formatNumber(data.elevation)+'ft</td></tr><tr><td class="attribute">Square Footage</td><td class="value">'+formatNumber(data.sqft)+'</td></tr><tr><td class="attribute">Price</td><td class="value">$'+formatNumber(data.price)+'</td></tr><tr><td class="attribute">Price per sqft</td><td class="value">$'+formatNumber(data.price_per_sqft)+'</td></tr></table></card>');
}

function renderRedCard(data,count,color) {
    $('cards').append('<card id="red-'+count+'"><h1 class="target">'+data.city+'</h1><h1 class="number">#'+count+'</h1><image src="img/house.png"></image><table class="'+color+'"><tr><td class="attribute">Bathrooms</td><td class="value">'+data.bath+'</td></tr><tr><td class="attribute">Bedrooms</td><td class="value">'+data.beds+'</td></tr><tr><td class="attribute">Year built</td><td class="value">'+data.year_built+'</td></tr><tr><td class="attribute">Elevation</td><td class="value">'+formatNumber(data.elevation)+'ft</td></tr><tr><td class="attribute">Square Footage</td><td class="value">'+formatNumber(data.sqft)+'</td></tr><tr><td class="attribute">Price</td><td class="value">$'+formatNumber(data.price)+'</td></tr><tr><td class="attribute">Price per sqft</td><td class="value">$'+formatNumber(data.price_per_sqft)+'</td></tr></table><div><button onClick="removeCard(\''+count+'\');">Remove card</button></card>');
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
