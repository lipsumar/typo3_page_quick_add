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
		$elementsconfig = $TSconfig['tx_pagequickadd.']['elements.'];

		$elements = [];
		foreach($elementsconfig as $key => $conf){
			$record = BackendUtility::getRecord('tt_content', (int) $conf['uid']);
			if($record){
				$elements[] = [
					'title' => $conf['title'] ? : $record['header'],
					'uid' => $record['uid']
				];
			}

		}

		$ajaxObj->setContentFormat('jsonbody');
		$ajaxObj->addContent('page_requested', $pageUid);
		$ajaxObj->addContent('elements', $elements);
	}


}

