<?php

if (!defined('TYPO3_MODE')) {
	die ('Access denied.');
}

$TYPO3_CONF_VARS['BE']['AJAX']['tx_pagequickadd::ajax::main'] =
	\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::extPath($_EXTKEY) . 'Classes/Ajax.php:Lipsumar\\PageQuickAdd\\Ajax->main';