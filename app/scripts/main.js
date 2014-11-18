"use strict";


function daysInMonthToHtml(date) {
  var htmlString = '';
  for (var w = moment(date.startOf('month')); w.isBefore(date.endOf('month')); w.add(1, 'weeks')) {
    htmlString += '<tr>';
    for(var d = moment(w.startOf('week')); d.isBefore(w.endOf('week')); d.add(1, 'days')) {
      htmlString += '<td>' + d.format('DD') + '</td>';
    }
    htmlString += '</tr>';
  }
  return htmlString;
}

function calendarClosure(newId) {
  var clone = $('#calendar-template').clone().attr('id', newId);
  clone.insertBefore($('#calendar-template'));
  var date = moment();
  $('#' + newId + ' .calendar-content .table' ).html(daysInMonthToHtml(date));

  return function toggleListener(ev) {
      clone.css({
        position: 'absolute',
        left: $(this).offset().left + $(this).outerWidth() + 'px',
        top: $(this).offset().top + (0.5* $(this).outerHeight()) - (0.5 * clone.outerHeight()) + 'px',
        display: 'block'
      });
  };
}

function hideCalendar(id) {
  return function() {
    $('#' + id).css('display', 'none');
  };
}


$('#start-calendar-button').on('click', calendarClosure('start-calendar-content'));
$('#end-calendar-button').on('click', calendarClosure('end-calendar-content'));

$('#start-calendar-button').on('blur', hideCalendar('start-calendar-content'));
$('#end-calendar-button').on('blur', hideCalendar('end-calendar-content'));
