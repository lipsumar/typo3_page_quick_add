<?php
namespace Lipsumar\PageQuickAdd\Hooks;

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class PageRenderer {

	/**
	 * wrapper function called by hook (\TYPO3\CMS\Core\Page\PageRenderer->render-preProcess)
	 *
	 * @param    array $parameters : An array of available parameters
	 * @param    \TYPO3\CMS\Core\Page\PageRenderer $pageRenderer : The parent object that triggered this hook
	 *
	 * @return    void
	 */
	public function addJSCSS($parameters, &$pageRenderer) {
		$TSconfig = BackendUtility::getPagesTSconfig(intval(GeneralUtility::_GP('id')));

		if ($GLOBALS['MCONF']['name'] === 'web_layout') {
			$pageRenderer->addJsFile($GLOBALS['BACK_PATH'] . ExtensionManagementUtility::extRelPath('page_quick_add') . 'Resources/Public/Backend/main.js');
			$pageRenderer->addCssFile($GLOBALS['BACK_PATH'] . ExtensionManagementUtility::extRelPath('page_quick_add') . 'Resources/Public/Backend/style.css');
		}

	}


}

