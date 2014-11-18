"use strict";

function calendarClosure(newId) {
  var visible;
  var clone = $('#calendar-template').clone().attr('id', newId);
  clone.insertBefore($('#calendar-template'));
  return function toggleListener(ev) {
    visible = !visible;
    clone.css({
      position : 'absolute',
      left: $(this).offset().left + $(this).outerWidth()+'px',
      top: $(this).offset().top +'px',
      display : visible ? 'block' : 'none'
    });
  };
}

$('#start-calendar-button').on('click', calendarClosure('start-calendar-content'));
$('#end-calendar-button').on('click', calendarClosure('end-calendar-content'));
