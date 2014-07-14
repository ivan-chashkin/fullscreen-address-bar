var eventTransmitter = function(e){
	switch( e.eventType ){
	case 'mousemove':
		window.onmousemove(e);
	break;
	case 'keydown':
		window.onkeydown(e);
	break;
	case 'keyup':
		window.onkeyup(e);
	break;
	}
}

/* Flash editer */
var flashes = document.getElementsByTagName('object');
for ( var i = 0; i < flashes.length; i++ ){
	var params = flashes[i].querySelectorAll('param[name="wmode"]');
	if( params.length == 0 ){
		var param = document.createElement('param');
		param.setAttribute('name', 'wmode');
		param.setAttribute('value', 'opaque');
		if( flashes[i].firstChild ){
			flashes[i].insertBefore(param, flashes[i].firstChild);
		}else{
			flashes[i].appendChild(param);
		}
	}else{
		if( params[0].getAttribute('value') == 'window' ){
			params[0].setAttribute('value', 'opaque');
		}
	}
}
var embeds = document.getElementsByTagName('embed');
for ( var i = 0; i < embeds.length; i++ ){
	if( embeds[i].getAttribute('wmode') == 'window' || !embeds[i].getAttribute('wmode') ){
		embeds[i].setAttribute('wmode', 'opaque');
	}
}
/* Flash editer */

if( window === window.parent ){

var FS433_state = false;
var FS433_fullscreen = false;
var FS433_ready = false;
var FS433_interval = false;
var FS433_timer = false;
var FS433_laststate = 'hide';
var FS433_topOffset = 20;
var FS433_Favs_Obj = {};
var FS433_tabs = [];
var FS433_reg=/^(http|https|ftp|file){1}:\/\/(([0-9a-zA-Z\-]*\.)*)*(aero|biz|com|coop|edu|eu|gov|info|int|mil|museum|name|net|org|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)(\/){1}.*$/

var FS433_KEY_ACTIVATE = 190;
var FS433_KEY_ACTIVATE2 = 192;
var FS433_KEY_CTRL = 17;
var FS433_KEY_ESC = 27;
var FS433_KEY_UP = 38;
var FS433_KEY_DOWN = 40;
var FS433_KEY_ENTER = 13;

/* Favorites */
FS433_renderFavorites = function(tree) {
	var treeList = {};
	treeList.level = function(tree){
		var ul = document.createElement('ul');
		for( var i = 0; i < tree.length; i++ ){
			if( tree[i].children ){
				var li = document.createElement('li');
				var span = document.createElement('span');
				var text = document.createTextNode( tree[i].title );
				li.className = 'category close';
				span.appendChild( text );
				span.className = 'toggler';
				(function(span, li){ 
					span.onclick = function(){
						var className = li.className;
						if( className == 'category close' ){
							li.className = 'category open';
						}else{
							li.className = 'category close';
						}
					}
				})(span, li)
				li.appendChild( span );
				li.appendChild( (function(tree){return treeList.level(tree);})(tree[i].children) );
			}else{
				var li = document.createElement('li');
				var a = document.createElement('a');
				var text = document.createTextNode( tree[i].title );
				a.setAttribute('href', tree[i].url);
				a.appendChild(text);
				li.appendChild(a);
			}
			ul.appendChild( li );
		}
		return ul;
	};
	ul = treeList.level(tree[0].children);
	FS433_Favs_Obj.ul.appendChild(ul);
};
FS433_toggleFavorites = function(){
	if( FS433_Favs_Obj.div.style.display != 'block' ){
		if( !FS433_Favs_Obj.load ){
			chrome.extension.sendMessage({query: 'favorites'}, null);
			FS433_Favs_Obj.load = true;
		}
		FS433_Favs_Obj.div.style.display = 'block';
	}else{
		FS433_Favs_Obj.div.style.display = 'none';
	}
}
FS433_hideFavorites = function(){
	FS433_Favs_Obj.div.style.display = 'none';
}
/* Favorites */

var FS433_wnd = {
	obj: false,
	search: false,
	tpl: function(){
		var t1 = document.createElement('div');
		t1.setAttribute('id', 'fullScreener_Bar');
		var t2 = document.createElement('div');
		t2.setAttribute('class', 'backGrd');
		// back
		var back = document.createElement('div');
		back.setAttribute('id', 'fullScreener_back');
		// forward
		var forward = document.createElement('div');
		forward.setAttribute('id', 'fullScreener_forward');
		// reload
		var reload = document.createElement('div');
		reload.setAttribute('id', 'fullScreener_reload');
		// tabs
		var tabs = document.createElement('div');
		tabs.setAttribute('id', 'fullScreener_tabs_btn');
		// favorites
		FS433_Favs_Obj.button = document.createElement('div');
		FS433_Favs_Obj.button.setAttribute('id', 'fullScreener_favorites');
		// close
		var close = document.createElement('div');
		close.setAttribute('id', 'fullScreener_closetab');
		// supported <a href="http://zenmoney.ru/" id="fullScreener_supported"></a>
		
		var t5 = document.createElement('input');
		t5.setAttribute('id', 'fullScreener_search');
		t5.setAttribute('type', 'text');
		t5.setAttribute('size', '20');
		
		var t7 = document.createElement('div');
		t7.setAttribute('id', 'fullScreener_newtab');
		
		/* + back|forward|close|favorites */
		FS433_Favs_Obj.div = document.createElement('div');
		FS433_Favs_Obj.div.setAttribute('id','fullScreener_Favorites_div');
		var favsBg = document.createElement('div');
		favsBg.className = 'fullScreener_Favorites_bg';
		
		FS433_Favs_Obj.ul = document.createElement('div');
		FS433_Favs_Obj.ul.setAttribute('id', 'fullScreener_tree');
		
		FS433_Favs_Obj.div.appendChild(favsBg);
		FS433_Favs_Obj.div.appendChild(FS433_Favs_Obj.ul);
		
		document.documentElement.appendChild(FS433_Favs_Obj.div);
		
		var bar = t1;
		FS433_Favs_Obj.ul.addEventListener('click', function(e){ e.stopPropagation(); });
		bar.addEventListener('click', function(e){ e.stopPropagation(); });
		window.addEventListener('click', function(){ FS433_hideFavorites(); });
		FS433_Favs_Obj.load = false;
		
		if( window.history.length > 1 ){
			back.className = '';
			forward.className = '';
			back.onclick = function(){
				window.history.back();
			}
			forward.onclick = function(){
				window.history.forward();
			}
		}
		reload.onclick = function(){
			window.location.reload();
		}
		close.onclick = function(){
			window.close();
		}
		tabs.onclick = function(){
			
			chrome.extension.sendMessage({query: 'list'});

		}
		FS433_Favs_Obj.button.onclick = FS433_toggleFavorites;
		/* + back|forward|close|favorites */
		
		
		//<div id="fullScreener_Bar"><div class="backGrd"></div><div id="fullScreener_button"><span class="fullScreener_buttonText">F11</span></div><input id="fullScreener_search" type="text"><div id="fullScreener_newtab"></div></div>
		t1.appendChild(t2);
		t1.appendChild(t5);
		t1.appendChild(t7);
		
		t1.appendChild(back);
		t1.appendChild(forward);
		t1.appendChild(reload);
		t1.appendChild(tabs);
		t1.appendChild(FS433_Favs_Obj.button);
		t1.appendChild(close);
		//t1.appendChild(t13);
		
		t5.setAttribute('value', window.location.href);
		t5.addEventListener('focus', function(){
			FS433_state = false;
			clearTimeout( FS433_timer );
			FS433_laststate = 'show';
		});
		t5.addEventListener('blur', function(){
			FS433_state = true;
			FS433_hide();
		});
		t5.addEventListener('keydown', function(e){
			if( ( e.keyCode == 13 ) && ( FS433_wnd.search.value != window.location.href ) ){
				var value = FS433_wnd.search.value;
				var vArr = String(value).split(':');
				var protocols = 'http,https,file';
				var protocol = '';
				if( protocols.indexOf( vArr[0] ) == -1 ) protocol = 'http://';
				if( FS433_reg.test( protocol+FS433_wnd.search.value+'/' ) ){
					window.location.href = protocol+FS433_wnd.search.value;
				}else{
					window.location.href = 'http://www.google.com/search?q='+encodeURI(FS433_wnd.search.value);
				}
				FS433_wnd.search.blur();
			}
			if ( e.keyCode == 27 ){
				FS433_wnd.search.value = window.location.href;
				FS433_wnd.search.blur();
			}
		});
		t7.addEventListener('click', function(){
			chrome.extension.sendMessage({query: 'newtab'});
		});
		
		this.obj = t1;
		this.search = t5;
		document.documentElement.appendChild(this.obj);
		
		return true;
	},
	top:-46
}
var FS433_TabHeight = 28;
var FS433_TabListHeight = 0;

var FS433_show = function(){
	/*
	clearInterval( FS433_interval );
	if( FS433_wnd.top < 0 ){
		FS433_interval = setInterval(function(){
			FS433_show_int();
		}, 30);
	}
	*/
	FS433_wnd.top = 0;
	FS433_topOffset = 46 + FS433_wnd.top;
	FS433_wnd.obj.style.top = FS433_wnd.top+'px';
}
var FS433_hide = function(){
	/*
	clearInterval( FS433_interval );
	if( FS433_wnd.top > -46 ){
		FS433_interval = setInterval(function(){
			FS433_hide_int();
		}, 30);
	}
	*/
	clearTimeout(FS433_focus_timeout);
	FS433_wnd.top = -46;
	FS433_topOffset = 49 + FS433_wnd.top;
	FS433_wnd.obj.style.top = FS433_wnd.top+'px';
}
var FS433_show_int = function(){
	if( FS433_wnd.top < -4 ){
		FS433_wnd.top += 4;
		FS433_topOffset = ( 46 + FS433_wnd.top ) + 4;
		FS433_wnd.obj.style.top = FS433_wnd.top+'px';
	}else{
		FS433_wnd.top = 0;
		FS433_topOffset = 46 + FS433_wnd.top;
		FS433_wnd.obj.style.top = FS433_wnd.top+'px';
		//clearInterval( FS433_interval );
		clearTimeout(FS433_focus_timeout);
	}
}
var FS433_show_go = function(){
	clearTimeout( FS433_timer );
	FS433_timer = setTimeout(function(){ FS433_hide(); }, 2000);
	FS433_wnd.top = 0;
	FS433_topOffset = ( 46 + FS433_wnd.top ) + 4;
	FS433_wnd.obj.style.top = FS433_wnd.top+'px';
}
var FS433_hide_int = function(){
	if( FS433_wnd.top > -44 ){
		FS433_wnd.top -= 2;
		FS433_topOffset = 49 + FS433_wnd.top;
		FS433_wnd.obj.style.top = FS433_wnd.top+'px';
	}else{
		FS433_wnd.top = -46;
		FS433_topOffset = 49 + FS433_wnd.top;
		FS433_wnd.obj.style.top = FS433_wnd.top+'px';
		clearInterval( FS433_interval );
	}
}

var FS433_init = function(){
	FS433_wnd.tpl();
	window.addEventListener('mousemove', function(e){
		if( FS433_state ){
			if( e.screenY <= FS433_topOffset ){
				if( FS433_laststate == 'hide' ){
					FS433_laststate = 'show';
					clearTimeout( FS433_timer );
					FS433_timer = setTimeout(function(){ FS433_hide(); }, 3000);
					FS433_show();
				}
			}else{
				if( FS433_laststate == 'show' ){
					FS433_laststate = 'hide';
					clearTimeout( FS433_timer );
					FS433_hide();
				}
			}
		}
	});
	FS433_ready = true;
};
chrome.extension.onMessage.addListener(function(data, sender, sendResponse) {
	if ((data.query == 'list')&&FS433_state) {
		FS433_tabs = data.body; 
		FS433_suggested = data.suggest; 
		FS433_showTabs();
		FS433_Tabs_Obj.table.style.display = 'table';

		FS433_Tabs_Obj.suggest.focus();
	} else if (data.query == 'fullscreen') {
		FS433_fullscreen_change(data.status);
	} else if ((data.query == 'favorites')&&FS433_state) {
		FS433_renderFavorites(data.body);
	}
});
var FS433_fullscreen_change = function(fullscreen){
	if( fullscreen ){
		if ( !FS433_state ) {
			FS433_hideTabs();
		}
		FS433_state = true;
		FS433_fullscreen = fullscreen;
		if( !document.getElementById('fullScreener_Bar') ){
			FS433_ready = false;
			FS433_init();
		}else{
			FS433_show_go();
		}
	} else {
		if ( FS433_state ) {
			FS433_hideTabs();
		}
		FS433_state = false;
	}
};
var FS433_resize_timer = undefined;
var FS433_resize_query = function(){
	chrome.extension.sendMessage({query: 'check_window_state'});
};
var FS433_resize = function(){
	clearTimeout(FS433_resize_timer);
	FS433_resize_timer = setTimeout(FS433_resize_query, 500);
};
window.addEventListener('resize', FS433_resize);
FS433_resize();

/* Tabs code */
var FS433_tabstatus = false;
var FS433_tabsready = false;
var FS433_tabtimer = undefined;
var FS433_Tabs_Obj = {
	init: false
}

var FS433_initTabs = function(){
	if( !FS433_Tabs_Obj.init ){
		FS433_Tabs_Obj.table = document.createElement('table');
		FS433_Tabs_Obj.table.setAttribute('id', 'fullScreener_Tabs_Table');
		var tbody = document.createElement('tbody');
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		
		var div1 = document.createElement('div');
		div1.setAttribute('id', 'fullScreener_Tabs');
		
		var div2 = document.createElement('div');
		div2.setAttribute('id', 'fullScreener_Tabs_Bg');

		var form = document.createElement('form');
		form.setAttribute('id', 'fullScreener_Tabs_Form');

		form.innerHTML = '<input id="fullScreener_Tabs_Suggest" type="text" placeholder="'+chrome.i18n.getMessage("placeholderSuggest")+'" />';

		FS433_Tabs_Obj.form = form;
		FS433_Tabs_Obj.suggest = form.querySelector('input[type="text"]');

		FS433_Tabs_Obj.ul = document.createElement('ul');
		
		FS433_Tabs_Obj.ul.onclick = function(e){
			if( e.target.tagName == 'LI' ){
				FS433_hideTabs();
				var tab = e.target.getAttribute('rel');
				chrome.extension.sendMessage({query: 'tab', id:tab});
			}
		}
		FS433_Tabs_Obj.init = true;

		FS433_Tabs_Obj.form.addEventListener('submit', function(evt){
			evt.preventDefault();
			evt.stopPropagation();
			FS433_hideTabs();
			var li = FS433_Tabs_Obj.ul.querySelector('.fullScreener_hover');
			FS433_Tabs_Obj.suggest.value = '';
			if (li){
				var tab = li.getAttribute('rel');
				chrome.extension.sendMessage({query: 'tab', id:tab});
			}
		});
		FS433_Tabs_Obj.suggest.addEventListener('keydown', function(evt){
			switch (evt.keyCode) {
				case FS433_KEY_DOWN:
					evt.stopPropagation();
					evt.preventDefault();
					FS433_Tabs_Down();
				break;
				case FS433_KEY_UP:
					evt.stopPropagation();
					evt.preventDefault();
					FS433_Tabs_Up();
				break;
			}
		});
		FS433_Tabs_Obj.suggest.addEventListener('input', function(evt){
			chrome.extension.sendMessage({query: 'list', suggest:FS433_Tabs_Obj.suggest.value});
		});
		
		FS433_Tabs_Obj.table.appendChild(tbody);
		tbody.appendChild(tr);
		tr.appendChild(td);
		td.appendChild(div1);
		div1.appendChild(div2);
		div1.appendChild(form);
		div1.appendChild(FS433_Tabs_Obj.ul);
		//div1.appendChild(t13);
		
		FS433_Tabs_Obj.table.onclick = function(){
			FS433_tabstatus = false;
			FS433_hideTabs();
		}
		div1.onclick = function(e){
			e.stopPropagation();
		}
		
		document.documentElement.appendChild(FS433_Tabs_Obj.table);
		
		FS433_TabListHeight = FS433_Tabs_Obj.ul.offsetHeight;
	}
	FS433_Tabs_Obj.ul.innerHTML = '';
	FS433_Tabs_Obj.li = [];
	FS433_Tabs_Obj.liKey = {};
	var windowId = -1;
	if (FS433_tabs.length) {
		windowId = FS433_tabs[0].windowId;
	}
	for ( var i = 0; i < FS433_tabs.length; i++ ){
		FS433_Tabs_Obj.li[i] = document.createElement('li');
		if( FS433_tabs[i].selected && !FS433_suggested ){
			FS433_Tabs_Obj.li[i].setAttribute('id', 'fullScreener_ActiveTab');
			FS433_Tabs_Obj.active = i;
			FS433_Tabs_Obj.hover = i;
		}
		if(windowId!=FS433_tabs[i].windowId) {
			windowId=FS433_tabs[i].windowId;
			FS433_Tabs_Obj.li[i].style.borderTop = '2px solid #ffffff';
		}
		FS433_Tabs_Obj.li[i].setAttribute('rel', FS433_tabs[i].id);
		FS433_Tabs_Obj.liKey[ FS433_tabs[i].id ] = {
			id: i,
			li: FS433_Tabs_Obj.li[i],
		}
		// <li><span class="fullScreener_favicon" style="background-image:url(images/icon16.png);"></span> Дзен-мани транзакции</li>
		var span = document.createElement('span');
		span.className = 'fullScreener_favicon';
		if( FS433_tabs[i].favIconUrl ) span.style.backgroundImage = 'url('+FS433_tabs[i].favIconUrl+')';
		var title = document.createTextNode(FS433_tabs[i].title);
		
		FS433_Tabs_Obj.li[i].appendChild(span);
		FS433_Tabs_Obj.li[i].appendChild(title);
		
		FS433_Tabs_Obj.ul.appendChild(FS433_Tabs_Obj.li[i]);
	}

	if (FS433_suggested) {
		FS433_Tabs_Obj.hover = 0;
		FS433_Tabs_Obj.li[0].className = 'fullScreener_hover';
	}
	
	// FS433_Tabs_Obj.table.style.display = 'table';
	/*  */
	var tabTop = FS433_TabHeight * FS433_Tabs_Obj.hover;
	var scrollTop = FS433_Tabs_Obj.ul.scrollTop;
	if( tabTop < scrollTop ){
		FS433_Tabs_Obj.ul.scrollTop = FS433_Tabs_Obj.ul.scrollTop - 300;
	}
	if( tabTop > FS433_Tabs_Obj.ul.scrollTop + FS433_TabListHeight ){
		FS433_Tabs_Obj.ul.scrollTop = tabTop - FS433_TabHeight * 2;
	}
	/*  */
}
var FS433_showTabs = function(){
	FS433_initTabs();
	FS433_tabsready = true;
}
var FS433_hideTabs = function(){
	if( FS433_Tabs_Obj.init ){
		FS433_Tabs_Obj.table.style.display = 'none';
		FS433_Tabs_Obj.suggest.value = '';
	}
	FS433_tabsready = false;
	FS433_tabstatus = false;
}
var FS433_Tabs_Up = function(){
	if( FS433_Tabs_Obj.table.style.display != 'table' ){
		FS433_Tabs_Obj.table.style.display = 'table';
	}else{
		FS433_Tabs_Obj.li[ FS433_Tabs_Obj.hover ].className = '';
		FS433_Tabs_Obj.hover--;
		if( FS433_Tabs_Obj.hover == -1 ){
			FS433_Tabs_Obj.hover = FS433_Tabs_Obj.li.length-1;
		}
		FS433_Tabs_Obj.li[ FS433_Tabs_Obj.hover ].className = 'fullScreener_hover';
		/*  */
		var tabTop = FS433_TabHeight * FS433_Tabs_Obj.hover;
		var scrollTop = FS433_Tabs_Obj.ul.scrollTop;
		if( tabTop < scrollTop ){
			FS433_Tabs_Obj.ul.scrollTop = FS433_Tabs_Obj.ul.scrollTop - 300;
		}
		if( tabTop > FS433_Tabs_Obj.ul.scrollTop + FS433_TabListHeight ){
			FS433_Tabs_Obj.ul.scrollTop = tabTop - FS433_TabHeight * 2;
		}
		/*  */
	}
}
var FS433_Tabs_Down = function(){
	if( FS433_Tabs_Obj.table.style.display != 'table' ){
		FS433_Tabs_Obj.table.style.display = 'table';
	}else{
		FS433_Tabs_Obj.li[ FS433_Tabs_Obj.hover ].className = '';
		FS433_Tabs_Obj.hover++;
		if( FS433_Tabs_Obj.hover == FS433_Tabs_Obj.li.length ){
			FS433_Tabs_Obj.hover = 0;
		}
		FS433_Tabs_Obj.li[ FS433_Tabs_Obj.hover ].className = 'fullScreener_hover';
		/*  */
		var tabTop = FS433_TabHeight * FS433_Tabs_Obj.hover;
		var scrollTop = FS433_Tabs_Obj.ul.scrollTop;
		if( tabTop < scrollTop ){
			FS433_Tabs_Obj.ul.scrollTop = FS433_Tabs_Obj.ul.scrollTop - 300;
		}
		if( tabTop > FS433_Tabs_Obj.ul.scrollTop + FS433_TabListHeight ){
			FS433_Tabs_Obj.ul.scrollTop = tabTop - FS433_TabHeight * 2;
		}
		/*  */
	}
}
/* Tabs code */

var FS433_focus_timeout = undefined;
window.addEventListener('keydown', function(e){
	if( ( e.keyCode == 117 ) && FS433_state ){
	//if( ( e.keyCode == 117 ) ){
		if( !FS433_ready ){
			FS433_init();
		}
		FS433_show_go();
		FS433_focus_timeout = setTimeout(function(){
			FS433_wnd.search.focus();
			FS433_wnd.search.select();
		}, 400);
		e.stopPropagation();
		return false;
	}
	if( ( e.keyCode == FS433_KEY_CTRL ) && FS433_state ){
	//if( ( e.keyCode == 17 ) ){
		if( !FS433_tabstatus ){
			FS433_tabstatus = true;
			FS433_tabtimer = setTimeout(function(){ chrome.runtime.sendMessage({query: 'list'}, function(tabsList){ FS433_tabs = tabsList; FS433_showTabs(); }); }, 100);
		}
	}
	if (FS433_tabstatus && FS433_tabsready) {
	//if( e.ctrlKey ){
		switch( e.keyCode ){
		case FS433_KEY_UP: // up
			e.preventDefault();
			FS433_Tabs_Up();
		break;
		case FS433_KEY_DOWN: // down
			e.preventDefault();
			FS433_Tabs_Down();
		break;
		}
	}
	if( ((e.keyCode == FS433_KEY_ACTIVATE)||(e.keyCode == FS433_KEY_ACTIVATE2)) && e.metaKey && (e.keyIdentifier!="U+0060") ){
		if( !FS433_tabstatus ){
			FS433_tabstatus = true;
			FS433_state = true;
			chrome.extension.sendMessage({query: 'list'}, null);
		}
	}
	if (e.keyCode == FS433_KEY_ESC) {
		if (FS433_tabstatus) {
			e.preventDefault();
		}
		FS433_tabstatus = false;
		FS433_hideTabs();
	}
});

window.addEventListener('keyup', function(e){
	if( e.keyCode == FS433_KEY_CTRL ){
		if( FS433_tabstatus && FS433_fullscreen ){
			FS433_tabstatus = false;
			clearTimeout(FS433_tabtimer);
			if( 
				FS433_tabsready && 
				FS433_tabs && 
				(FS433_Tabs_Obj.hover != -1)
			){
				var li = FS433_Tabs_Obj.ul.querySelector('.fullScreener_hover');
				if (li){ 
					var id = parseInt(li.getAttribute('rel'));
					if (id){
						chrome.extension.sendMessage({query: 'tab', id:id});
					}
				}
			}
			FS433_hideTabs();
		}
	}
});

}else{
	window.onmousemove = function(e){
		chrome.extension.sendMessage({query: 'event', e: {eventType: 'mousemove', screenX: e.screenX, screenY: e.screenY}});
	}
	window.onkeydown = function(e){
		chrome.extension.sendMessage({query: 'event', e: {eventType: 'keydown', keyCode: e.keyCode, ctrlKey: e.ctrlKey}});
	}
	window.onkeyup = function(e){
		chrome.extension.sendMessage({query: 'event', e: {eventType: 'keyup', keyCode: e.keyCode, ctrlKey: e.ctrlKey}});
	}
}