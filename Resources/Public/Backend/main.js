(function(window, top, Ext){

	// popup stuff
	var backdropEl, popupEl, popupContentEl;

	// needed to paste an item
	var dropZoneID;

	// needed to link to new content
	var pid, sys_language_uid, colPos;

	var serverData;

	function init(){
		addEvents();
	}

	function newContentElClicked(e){
		e.preventDefault();

		dropZoneID = e.currentTarget.parentNode.querySelectorAll('a')[1].rel;

		pid = top.DDpid;
		sys_language_uid = e.currentTarget.getAttribute('data-onclick').match(/sys_language_uid=([0-9]+)/)[1];
		colPos = e.currentTarget.getAttribute('data-onclick').match(/colPos=([0-9]+)/)[1];

		openOverlay();
	}



	function elementClicked(e){
		e.preventDefault();
		var uidToCopy = e.currentTarget.getAttribute('data-uid');
		if(!uidToCopy){
			// regular element
			var index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
			var element = serverData.elements[index];
			if(element){
				var defValuesStrings = [];
				for(var field in element.tt_content_defValues){
					if(element.tt_content_defValues.hasOwnProperty(field)){
						defValuesStrings.push('defVals[tt_content]['+field+']='+element.tt_content_defValues[field]);
					}
				}
				//document.editForm.defValues.value = defValuesStrings.join('&');
				goToalt_doc(defValuesStrings.join('&'));
			}


		}else{
			var url = top.pasteTpl.replace('DD_REFYN', '0').replace('DD_DRAG_UID', uidToCopy).replace('DD_DROP_UID', dropZoneID);
			hidePageLoader();
			ajaxThenReload(url);
		}


	}

	function openOverlay(){
		backdropEl = document.createElement('div');
		backdropEl.className = 'tx_pagequickadd_overlay';

		popupEl = document.createElement('div');
		popupEl.className = 'tx_pagequickadd_popup';

		popupContentEl = document.createElement('div');
		popupContentEl.className = 'tx_pagequickadd_popup__content';

		var closeEl = document.createElement('a');
		closeEl.innerHTML = '×';
		closeEl.className = 'tx_pagequickadd_popup__close';
		closeEl.addEventListener('click', closeOverlay);
		popupEl.appendChild(closeEl);
		popupEl.appendChild(popupContentEl);


		document.body.appendChild(backdropEl);
		document.body.appendChild(popupEl);

		fetchElements();
	}

	function closeOverlay(e){
		e.preventDefault();
		backdropEl.parentNode.removeChild(backdropEl);
		popupEl.parentNode.removeChild(popupEl);
	}

	function fetchElements(){
		Ext.Ajax.request({
			url: window.TYPO3.settings.ajaxUrls['tx_pagequickadd::ajax::main']+'&pageUid='+top.DDpid,
			success: fetchSuccess,
			failure: console.log.bind(console, 'fail')
		});
	}

	function fetchSuccess(res){
		var resp = JSON.parse(res.responseText);
		var popupHtml = '';
		if(resp && resp.data){
			if(resp.data.elements){
				/*for (var i = 0; i < resp.data.elements.length; i++) {
					resp.data.elements[i].index = i;
				}*/
				serverData = resp.data;
				popupHtml = renderSearch() + renderGrid() + renderElements(resp.data);
			}else{
				popupHtml = 'No element to display for this page.';
			}
		}else{
			popupHtml = 'Woops, an error occured !';
		}

		if(popupContentEl){
			popupContentEl.innerHTML = popupHtml;
			[].forEach.call(popupContentEl.querySelectorAll('.tx_pagequickadd_element-js-target'), function(el){
				el.addEventListener('click', elementClicked);
			});
			popupContentEl.querySelector('input[type="search"]').addEventListener('keyup', searchFieldKeyUp);
			setTimeout(function(){
				popupContentEl.querySelector('input[type="search"]').focus();
			}, 100);
		}
	}

	function searchFieldKeyUp(e){
		var str = e.currentTarget.value;
		[].forEach.call(popupContentEl.querySelectorAll('.tx_pagequickadd_element__txt'), function(el){

			el.parentNode.style.display = el.innerHTML.toLowerCase().match(str.toLowerCase()) ? '' : 'none';

		});
	}

	function renderSearch(){
		return '<div class="tx_pagequickadd_search">'
		+ '<svg width="20" height="20" viewBox="0 0 416 448"><path d="M288 208q0-46.25-32.875-79.125t-79.125-32.875-79.125 32.875-32.875 79.125 32.875 79.125 79.125 32.875 79.125-32.875 32.875-79.125zM416 416q0 13-9.5 22.5t-22.5 9.5q-13.5 0-22.5-9.5l-85.75-85.5q-44.75 31-99.75 31-35.75 0-68.375-13.875t-56.25-37.5-37.5-56.25-13.875-68.375 13.875-68.375 37.5-56.25 56.25-37.5 68.375-13.875 68.375 13.875 56.25 37.5 37.5 56.25 13.875 68.375q0 55-31 99.75l85.75 85.75q9.25 9.25 9.25 22.5z"></path></svg>'
		+ '<input type="search" class="tx_pagequickadd_search__field">'
		+ '</div>';
	}

	function renderGrid(){
		var html = '';
		if(serverData.gridElementsIndex && serverData.gridElementsIndex.length){
			html+='<div class="tx_pagequickadd_element-group">';
			html+='<div class="tx_pagequickadd_element-group__title">Grid</div>';
			html+='<div class="tx_pagequickadd_element-group__body">';
			var element;
			for (var i = 0; i < serverData.gridElementsIndex.length; i++) {
				element = serverData.elements[serverData.gridElementsIndex[i]];
				html+='<div class="tx_pagequickadd_element-grid tx_pagequickadd_element-js-target" data-index="'+element.index+'">'+element.title;
				if(element._children){
					html+='<div class="tx_pagequickadd_element-grid__children">';
					element._children.forEach(function(child){
						html+='<div class="tx_pagequickadd_element-grid__child tx_pagequickadd_element-js-target" data-index="'+child.index+'">'+child.title+'</div>';
					});
					html+='</div>';
				}
				html+='</div>';
			}
			html+='</div></div>';
		}
		return html;
	}

	function renderElements(data){
		var html = '';
		var elementsByTab = getElementsByTab(data);

		for (var i = 0; i < data.tabs.length; i++) {
			html+= '<div class="tx_pagequickadd_element-group">';
			html+= '	<div class="tx_pagequickadd_element-group__title">'+data.tabs[i].title+'</div>';
			html+= '	<div class="tx_pagequickadd_element-group__body">'+renderElementGroup(elementsByTab[data.tabs[i].key])+'</div>';
			html+= '</div>';
		}
		html+= '';

		return html;
	}

	function renderElementGroup(elements){
		var html = '';
		for (var i = 0; i < elements.length; i++) {
			html+='<div class="tx_pagequickadd_element tx_pagequickadd_element-js-target" data-index="'+elements[i].index+'">'+(elements[i].icon ? '<img src="../../../'+elements[i].icon+'" class="tx_pagequickadd_element__img">' : '')+'<span class="tx_pagequickadd_element__txt">'+elements[i].title+'</span></div>';
		}
		return html;
	}

	function getElementsByTab(data){
		var byTab = {};
		for (var i = 0; i < data.elements.length; i++) {
			if(!byTab[data.elements[i].tab]){
				byTab[data.elements[i].tab] = [];
			}
			byTab[data.elements[i].tab].push(data.elements[i]);
		}
		return byTab;
	}

	function addEvents(){
		var newContentEls = document.querySelectorAll('.t3-page-ce-wrapper-new-ce a:first-child');
		[].forEach.call(newContentEls, function(newContentEl){
			newContentEl.setAttribute('data-onclick', newContentEl.onclick);
			newContentEl.onclick = '';
			newContentEl.addEventListener('click', newContentElClicked);
		});
	}




	//////  Utilities

	function ajaxThenReload(actionUrl){
		showPageLoader();
		Ext.Ajax.request({
			url: actionUrl,
			success: window.location.reload.bind(window.location),
			failure: function(){
				console.log('ERROR', arguments);
				hidePageLoader();
			}
		});
	}


	function showPageLoader(){
		top.TYPO3.Backend.ContentContainer.setMask();
	}

	function hidePageLoader(){
		top.TYPO3.Backend.ContentContainer.removeMask();
	}

	function goToalt_doc(appendGet) {
		appendGet = appendGet || '';
		window.location.href = '../../../alt_doc.php?edit[tt_content]['+pid+']=new&defVals[tt_content][colPos]='+colPos+'&defVals[tt_content][sys_language_uid]='+sys_language_uid+'&returnUrl=%2Ftypo3%2Fsysext%2Fcms%2Flayout%2Fdb_layout.php%3Fid%3D'+pid+'%26&'+appendGet;
	}


	window.addEventListener('load', init);

}(window, window.top, window.Ext));