<?php
namespace PageQuickAdd;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Backend\Utility\BackendUtility;

class Ajax {

	/**
	 * Main method
	 *
	 * @param    array $params not used yet
	 * @param    AjaxRequestHandler $ajaxObj the parent ajax object
	 *
	 * @return void
	 */
	public function main($params, &$ajaxObj){

		$pageUid = (int) GeneralUtility::_GP('pageUid');
		$TSconfig = BackendUtility::getPagesTSconfig($pageUid);
		$copyElementsConfig = null;
		$gridElementsConfig = null;
		if($TSconfig['tx_pagequickadd.']){
			$copyElementsConfig = $TSconfig['tx_pagequickadd.']['elements.'];
			$gridElementsConfig = $TSconfig['tx_pagequickadd.']['grid.'];
		}
		$wizardItems = $TSconfig['mod.']['wizards.']['newContentElement.']['wizardItems.'];
		$gridItems = $TSconfig['mod.']['wizards.']['newContentElement.']['wizardItems.']['layout.'];

		$allTabs = [];
		$elements = [];
		$gridItemsByGridelementType = [];

		// add the usual wizard tabs and elements
		foreach($wizardItems as $group => $groupConf){
			if($groupConf['show']){
				$toShow = array_map('trim', explode(',', $groupConf['show']));
				$allTabs[] = [
					'title' => $groupConf['header'],
					'key' => $group
				];
				$uniqueItems = [];
				foreach($toShow as $itemKey){
					if($uniqueItems[$itemKey]) continue;
					$uniqueItems[$itemKey] = true;

					$item = $groupConf['elements.'][$itemKey.'.'];
					$elements[] = [
						'title' => $GLOBALS['LANG']->sL($item['title']),
						'icon' => $item['icon'],
						'tt_content_defValues' => $item['tt_content_defValues.'],
						'tab' => $group,
						'index'=>count($elements)
					];
					$gridItemsByGridelementType[$item['tt_content_defValues.']['tx_gridelements_backend_layout']] = $elements[count($elements)-1]['index'];
				}

			}
		}
//die(print_r($gridItemsByGridelementType,1));
		// add predefined content in its own tab
		if($copyElementsConfig){
			foreach($copyElementsConfig as $key => $conf){
				$record = BackendUtility::getRecord('tt_content', (int) $conf['uid']);
				if($record){
					$elements[] = [
						'title' => $conf['title'] ? : $record['header'],
						'uid' => $record['uid'],
						'tab' => 'predefined',
						'index'=>count($elements)
					];
				}
			}
		}


		// add special grid configuration
		$gridElementsIndex = [];
		if($gridElementsConfig){
			foreach($gridElementsConfig as $key => $conf){

				if(is_array($conf)){
					$element = [
						'title' => substr($key,0,-1),
						'_children' => []
					];

					foreach($conf as $k=>$v){
						$element['_children'][] = [
							'title'=> $GLOBALS['LANG']->sL($gridItems['elements.'][$v.'.']['title']),
							'index'=> $gridItemsByGridelementType[$v]
						];
					}

				}else{

					$element = [
						'title' => $key.'',
						'index' => $gridItemsByGridelementType[$conf]
					];
				}
				$elements[] = $element;
				$gridElementsIndex[] = count($elements)-1;
			}
		}


		// keep only tabs defined by tx_pagequickadd.tabs
		$tabs = $allTabs;
		if($TSconfig['tx_pagequickadd.']['tabs']){
			$tabs = [];
			$toShow = array_map('trim', explode(',', $TSconfig['tx_pagequickadd.']['tabs']));
			foreach($toShow as $tabToShow){
				$tabs[] = [
					'title' => $wizardItems[$tabToShow.'.']['header'],
					'key'=>$tabToShow.'.'
				];
			}
		}

		$ajaxObj->setContentFormat('jsonbody');
		$ajaxObj->addContent('page_requested', $pageUid);
		$ajaxObj->addContent('data', [
			'elements'=>$elements,
			'tabs'=>$tabs,
			'gridElementsIndex'=>$gridElementsIndex
		]);
	}


}

