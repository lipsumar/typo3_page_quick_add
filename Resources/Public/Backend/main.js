(function(window, top, Ext){

	var dropZoneID;

	var backdropEl, popupEl, popupContentEl;

	function init(){

		addButtons();

	}

	function buttonClicked(e){
		e.preventDefault();

		dropZoneID = e.currentTarget.parentNode.querySelectorAll('a')[1].rel;

		openOverlay();
	}

	function elementClicked(e){
		e.preventDefault();
		var uidToCopy = e.currentTarget.getAttribute('data-uid');
		var url = top.pasteTpl.replace('DD_REFYN', '0').replace('DD_DRAG_UID', uidToCopy).replace('DD_DROP_UID', dropZoneID);
		hidePageLoader();
		ajaxThenReload(url);
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
		if(resp){
			if(resp.elements && resp.elements.length){
				popupHtml = renderElements(resp.elements);
			}else{
				popupHtml = 'No element to display for this page.';
			}
		}else{
			popupHtml = 'Woops, an error occured !';
		}

		if(popupContentEl){
			popupContentEl.innerHTML = popupHtml;
			[].forEach.call(popupContentEl.querySelectorAll('.tx_pagequickadd_element'), function(el){
				el.addEventListener('click', elementClicked);
			});
		}
	}

	function renderElements(elements){
		var html = '';
		for (var i = 0; i < elements.length; i++) {
			html+= '<div class="tx_pagequickadd_element" data-uid="'+elements[i].uid+'">'+elements[i].title+'</div>';
		}
		return html;
	}

	function addButtons(){
		var targetEls = document.querySelectorAll('.t3-page-ce-wrapper-new-ce');
		[].forEach.call(targetEls, addButton);
	}

	function addButton(targetEl){
		var btnEl = document.createElement('a');
		btnEl.innerHTML = '<span class="t3-icon t3-icon-extensions t3-icon-extensions-page_quick_add t3-icon-extensions-page_quick_add-add">+</span>';
		btnEl.addEventListener('click', buttonClicked);
		targetEl.appendChild(btnEl);
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


	window.addEventListener('load', init);

}(window, window.top, window.Ext));