<?php

$EM_CONF[$_EXTKEY] = array (
	'title' => 'Page quick add',
	'description' => '',
	'category' => 'be',
	'shy' => false,
	'version' => '1.1.0',
	'priority' => 'bottom',
	'loadOrder' => '',
	'module' => '',
	'state' => 'alpha',
	'uploadfolder' => true,
	'createDirs' => '',
	'modify_tables' => 'tt_content',
	'clearcacheonload' => true,
	'lockType' => '',
	'author' => 'Emmanuel Pire',
	'author_email' => 'piremmanuel@gmail.com',
	'author_company' => '',
	'CGLcompliance' => NULL,
	'CGLcompliance_note' => NULL,
	'constraints' =>
	array (
		'depends' =>
		array (
			'typo3' => '6.2.17-6.2.18',
			'gridelements' => '3.3.4'
		),
		'conflicts' =>
		array (
		),
		'suggests' =>
		array (
		),
	)
);

?>