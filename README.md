# Page Quick Add


The goal of this extension is to make adding CE to pages easier and faster.

It replaces the "new content element" wizard with a faster ajax popup.

![screenshot of ajax popup](https://raw.githubusercontent.com/lipsumar/typo3_page_quick_add/master/Documentation/screenshot.png)

In addition to the usual tabs and elements, it allows to define a set of Content Elements to quickly paste in pages in a single click.



## Configuration

Define elements to paster in page TSconfig as such:

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


## Bugs

Report bugs to piremmanuel@gmail.com

