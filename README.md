# jQuery trSortable plugin #

jQuery plugin for reordering rows within a table with drag and drop.

## Available options ##

* onDragClass: [String:'trs-ondrag'] Class added to the row being draged.
* onDragStart: [Function:null] Function which is called dragging is started.
* onDrop: [Function:null] Callback to be called on row drop. Takes 2 parameters: the tbody and the row that was dropped.
* dragHandler: [String:null] CSS selector of the drag handler element within TR. If not specified then the whole row is dragable.