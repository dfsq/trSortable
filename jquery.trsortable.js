/**
 * Based on the original idea:
 * http://www.lukedingle.com/2009/06/23/sortable-table-rows-with-jquery-draggable-rows/
 *
 * Options:
 * onDragClass: [String:'trs-ondrag'] Class added to the row being draged.
 * onDragStart: [Function:null] Function which is called dragging is started.
 * onDrop: [Function:null] Callback to be called on row drop. Takes 2 parameters: the tbody
 * and the row that was dropped.
 * dragHandler: [String:null] CSS selector of the drag handler element within TR. If not specified then the whole row is dragable.
 */
(function($) {

	// Mouse y positions and direction of movement.
	var mouseY, lastY = 0;

	// This function captures the x and y positions anytime the mouse moves in the document.
	$(document).mousemove(function(e) {
		mouseY = e.pageY;
	});

	// Stop selecting text when mousedown returns false if onselect start exists.
	var hasOnSelect = typeof $(document).attr('onselectstart') != 'undefined';

	$.fn.trSortable = function(settings) {

		var settings = $.extend({
			onDragClass: 'trs-ondrag',
			onDrop: null,
			onDragStart: null,
			dragHandler: null
		}, settings);

		return this.each(function() {

			var $tbody = $(this);

			// Do we have a drag handler or whole row is dragable.
			$(settings.dragHandler || 'tr', $tbody).live('mousedown', function(e) {

				// Remember current row.
				var $tr = settings.dragHandler ? $(this).closest('tr') : $(this);

				// Prevent from dragging rows with class .nodrag.
				if ($tr.hasClass('nodrag')) {
					return false;
				}

				// Fire onDragStart function if any.
				settings.onDragStart && settings.onDragStart($tbody, $tr);

				// Store the current location Y axis position of the mouse at the time the mouse
				// button was pushed down. This will determine which direction to move the table row.
				lastY = mouseY;

				// Add class name to style row being moved.
				$tr.addClass(settings.onDragClass);

				// Check mouse coordinates to see whether to pop this before or after
				// If mouseY has decreased, we are moving UP the page and insert tr before $(this) tr where
				// $(this) is the tr that is being hovered over. If mouseY has decreased, we insert after.
				$('tr', $tbody).not($tr).not('.nodrop').mouseenter(function() {
					if (mouseY > lastY) {
						$(this).after($tr);
					}
					else {
						$(this).before($tr);
					}

					// Store the current location of the mouse for next time a mouseenter event triggers
					lastY = mouseY;
				});

				// Now, bind a function that runs on the very next mouseup event that occurs on the page.
				// This checks for a mouse up *anywhere*, not just on table rows so that the function runs even
				// if the mouse is dragged outside of the table.
				$('body').mouseup(function () {

					// Remove drag class.
					$tr.removeClass(settings.onDragClass);

					// Remove the mouseenter events from the tbody so that the TR element stops being moved.
					$('tr', $tbody).unbind('mouseenter');

					// Remove this mouseup function until next time.
					$('body').unbind('mouseup');

					// Make text selectable for IE again with
					// The workaround for IE based browsers
					if (hasOnSelect) $(document).unbind('selectstart');

					// Fire drop callback if any.
					settings.onDrop && settings.onDrop($tbody, $tr);
				});

				// Stop text from being highlighted.
				e.preventDefault();

				// The workaround for IE based browers.
				if (hasOnSelect) {
					$(document).bind('selectstart', function () {
						return false;
					});
				}

				return false;
			});
		});
	};
})(jQuery);