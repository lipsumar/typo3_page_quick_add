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
		$copyElementsConfig = $TSconfig['tx_pagequickadd.']['elements.'];
		$wizardItems = $TSconfig['mod.']['wizards.']['newContentElement.']['wizardItems.'];

		$tabs = [];
		$elements = [];

		// add the usual wizard tabs and elements
		foreach($wizardItems as $group => $groupConf){
			if($groupConf['show']){
				$toShow = array_map('trim', explode(',', $groupConf['show']));
				$tabs[] = [
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
						'tab' => $group
					];
				}

			}
		}

		// add predefined content in its own tab
		foreach($copyElementsConfig as $key => $conf){
			$record = BackendUtility::getRecord('tt_content', (int) $conf['uid']);
			if($record){
				$elements[] = [
					'title' => $conf['title'] ? : $record['header'],
					'uid' => $record['uid'],
					'tab' => 'predefined'
				];
			}

		}

		$ajaxObj->setContentFormat('jsonbody');
		$ajaxObj->addContent('page_requested', $pageUid);
		$ajaxObj->addContent('data', [
			'elements'=>$elements,
			'tabs'=>$tabs
		]);
	}


}

