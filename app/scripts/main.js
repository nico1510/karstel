"use strict";

moment.locale('de');

function daysInMonthToHtml(date) {
  var htmlString = '';
  for (var w = moment(date.startOf('month')); w <= date.endOf('month'); w.add(1, 'weeks')) {
    htmlString += '<tr>';
    for (var d = moment(w.startOf('isoWeek')); d <= w.endOf('isoWeek'); d.add(1, 'days')) {
      htmlString += '<td>' + d.format('DD') + '</td>';
    }
    htmlString += '</tr>';
  }
  return htmlString;
}

function generateCalendarHeader(date) {
  var weekDays = moment.weekdaysMin();
  var sunday = weekDays.shift();
  weekDays.push(sunday);

  var htmlString = '<thead><tr>';
  weekDays.forEach(function (dayName) {
    htmlString += '<td>' + dayName + '</td>';
  });
  htmlString += '</tr></thead>';
  return htmlString;
}

function calendarClosure(newId) {
  var clone = $('#calendar-template').clone().attr('id', newId);
  clone.insertBefore($('#calendar-template'));
  var date = moment();
  $('#' + newId + ' .calendar-content .table').html(generateCalendarHeader(date) + daysInMonthToHtml(date));

  return function toggleListener(ev) {
    clone.css({
      position: 'absolute',
      left: $(this).offset().left + $(this).outerWidth() + 'px',
      top: $(this).offset().top + (0.5 * $(this).outerHeight()) - (0.5 * clone.outerHeight()) + 'px',
      display: 'block'
    });
  };
}

function hideCalendar(id) {
  return function () {
    $('#' + id).css('display', 'none');
  };
}


$('#start-calendar-button').on('click', calendarClosure('start-calendar-content'));
$('#end-calendar-button').on('click', calendarClosure('end-calendar-content'));

$('#start-calendar-button').on('blur', hideCalendar('start-calendar-content'));
$('#end-calendar-button').on('blur', hideCalendar('end-calendar-content'));

// calendar header labels
$('#start-calendar-content > h3').html('Anreisedatum');
$('#end-calendar-content > h3').html('Abreisedatum');

// hovering effect of table cells
$('table.calendar-table > tbody > tr > td').hover(function () {
  $(this).css('background-color', '#D9EDF7');
}, function () {
  $(this).css('background-color', '#FFFFFF');
});
