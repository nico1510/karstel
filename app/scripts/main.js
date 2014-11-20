"use strict";

moment.locale('de');


function KarstelCalendar(trigger, id, header, daySelectCallback) {

  var date = moment();

  (function create() {
    var clone = $('#calendar-template').clone().attr('id', id);
    clone.find('h3').html(header);
    clone.find('.calendar-content .table').html(generateCalendarHeader() + daysInMonthToHtml(date));
    clone.appendTo('body');
  })();

  function showCalendar(ev) {
    $('#' + id).css({
      position: 'absolute',
      left: trigger.offset().left + trigger.outerWidth() + 'px',
      top: trigger.offset().top + (0.5 * trigger.outerHeight()) - (0.5 * $('#' + id).outerHeight()) + 'px',
      display : 'block'
    });
  }

  function hideCalendar(ev) {
    $('#' + id).css('display', 'none');
  }

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

  function generateCalendarHeader() {
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

  trigger.on('click', showCalendar);
  trigger.on('blur', hideCalendar);

  // hovering effect of table cells
  $('#' + id + ' .calendar-content .table > tbody > tr > td').hover(function () {
    $(this).css('background-color', '#D9EDF7');
  }, function () {
    $(this).css('background-color', '#FFFFFF');
  });
}



var startCal = new KarstelCalendar($('#start-calendar-button'), 'start-calendar-content', 'Anreisedatum');
var endCal = new KarstelCalendar($('#end-calendar-button'), 'end-calendar-content', 'Abreisedatum');


