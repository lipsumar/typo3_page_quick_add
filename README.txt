Page Quick Add
--------------

The goal of this extension is to add existing elements quickly.

It allows to define a set of Content Elements (par page).

Once these elements are configured (see Configuration), a new button will apear in the mode "Page".
This button will open a selector for the configured elements, and they can copied on the page with a single click.


Configuration
-------------

Configure the page TSconfig as such:

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


Bugs
----

Report bugs to piremmanuel@gmail.com

