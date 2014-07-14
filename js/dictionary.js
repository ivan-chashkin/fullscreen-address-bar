/**
* < disctionary >
**/

var dictionary = (function(){

var dictionary = {};

var translit = function(source){
	var _translit = {
		' ':' ','.':' ',
		'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'jo','ж':'zh','з':'z','и':'i','й':'jj','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'c','ч':'ch','ш':'sh','щ':'shh','ъ':'"','ы':'y','ь':"'",'э':'eh','ю':'ju','я':'ja',
		"a":"а","b":"б","v":"в","g":"г","d":"д","e":"е","jo":"ё","zh":"ж","z":"з","i":"и","jj":"й","k":"к","l":"л","m":"м","n":"н","o":"о","p":"п","r":"р","s":"с","t":"т","u":"у","f":"ф","kh":"х","c":"ц","ch":"ч","sh":"ш","shh":"щ","\"":"ъ","y":"ы","'":"ь","eh":"э","ju":"ю","ja":"я",
		"h":"х","q":"к","w":"в","j":"ж","x":"кс"
	};
	var target = '';
	_.each(String(source).split(''), function(item, index){ target+=_translit[item.toLowerCase()]?_translit[item.toLowerCase()]:''; });
	return target;
};
var punto = function(source){
	var _punto = {
		"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","ё":"`","-":"-","=":"=","й":"q","ц":"w",
		"у":"e","к":"r","е":"t","н":"y","г":"u","ш":"i","щ":"o","з":"p","х":"[","ъ":"]","ф":"a","ы":"s","в":"d","а":"f","п":"g",
		"р":"h","о":"j","л":"k","д":"l","ж":";","э":"'","\\":"\\","я":"z","ч":"x","с":"c","м":"v","и":"b","т":"n","ь":"m","б":",",
		"ю":".",".":"/","0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","`":"ё","-":"-","=":"=",
		"q":"й","w":"ц","e":"у","r":"к","t":"е","y":"н","u":"г","i":"ш","o":"щ","p":"з","[":"х","]":"ъ","a":"ф","s":"ы","d":"в",
		"f":"а","g":"п","h":"р","j":"о","k":"л","l":"д",";":"ж","'":"э","\\":"\\","z":"я","x":"ч","c":"с","v":"м","b":"и","n":"т",
		"m":"ь",",":"б",".":"ю","/":"."
	};
	var target = '';
	_.each(String(source).split(''), function(item, index){ target+=_punto[item.toLowerCase()]?_punto[item.toLowerCase()]:''; });
	return target;
};

dictionary._index = {}; // Индекс запрос - совпадения
dictionary._tabsList = {}; // Индекс запрос - совпадения
dictionary._indexIds = {}; // На будущее, обратный индекс
dictionary.update = function(params){
	dictionary._index = {};
	
	var indexLength = 0;

	dictionary._tabsList = params.array;

	for (var i = 0; i < params.array.length; i++) {
		var splitKeys = [];
		for (var j=0; j < params.keys.length; j++) {
			var key = i;
			var value = String(params.array[key][params.keys[j]]||'').toLowerCase();

			splitKeys.push( value.split(/[\s\-\#\_\\\/\[\]\(\)\&\?\=]/) );
			splitKeys.push( value.split(/[\s\\\/\(\)\&\?\=]/) );
		}
		var arrForPunto = [];
		for ( var m = 0; m < splitKeys.length; m++ ) {
			for ( var n = 0; n < splitKeys[m].length; n++ ) {
				arrForPunto.push( splitKeys[m][n] );
			}
		}
		var _punto = _.map(arrForPunto, punto);
		for ( var k = 0; k < _punto.length; k++ ) {
			splitKeys.push(_punto[k]);
		}
		
		var keys = _.union.apply(null, splitKeys );
		for (var k=0;k < keys.length;k++) {
			var length = keys[k].length;
			for( var m = 0; m < length; m++ ){
				var key = keys[k].substr(0, m+1);
				if( !dictionary._index[key] ){
					dictionary._index[key] = [];
					indexLength++;
				}
				dictionary._index[key].push(i);
			}
		}
	}
};
dictionary.suggest = function(query){
	var result = [];
	if ( query ) {
		query = String(query).toLowerCase()
	} else {
		return dictionary._tabsList;
	}
	if ( dictionary._index[query] ) {
		for (var i = 0; i < dictionary._index[query].length; i++) {
			var key = dictionary._index[query][i];
			result.push( dictionary._tabsList[key] );
		} 
	} else {
		result = dictionary._tabsList;
	}
	return result;
};

return dictionary;

})();

/**
* </ disctionary >
**/