# Page Quick Add


The goal of this extension is to make adding CE to pages easier and faster.

It replaces the "new content element" wizard with a faster ajax popup.

![screenshot of ajax popup](https://raw.githubusercontent.com/lipsumar/typo3_page_quick_add/master/Documentation/screenshot_1.1.png)

In addition to the **usual tabs and elements**, it allows to define **grids** and a set of **CEs to quickly paste** in pages in a single click.



## Configuration

All config is done in page TSconfig.

### Define tabs to show

```typoscript
tx_pagequickadd.tabs = common, plugins, foo
```

### Define existing elements to paste

```typoscript
tx_pagequickadd.elements {

	elem1{
		uid = 123
	}

	elem2{
		uid = 456
		title = Override tt_content.header
		image = path/to/thumbnail.jpg
	}
}
```


### Define special grid tab

You can define some [gridelements](https://typo3.org/extensions/repository/view/gridelements) as being "grid items". They will appear in a special tab at the top of the popup. A sub-menu will open on hover for items configured for more than one.

```typoscript
tx_pagequickadd.grid{
	1{
		default = column_1
		1 = column_1_foo
		2 = column_1_bar
	}
	2{
		default = column_2
		1 = column_2_5
		2 = column_5_2
	}
	3 = column_3
	4 = column_4
	5 = column_5
}
```


## Bugs

Report bugs in [github issues](https://github.com/lipsumar/typo3_page_quick_add/issues)

