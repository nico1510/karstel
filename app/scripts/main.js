"use strict";

moment.locale('de');


function KarstelCalendar(trigger, id, header, daySelectCallback) {

  var date = moment();

  (function create() {
    var clone = $('#calendar-template').clone().attr('id', id);
    clone.find('h3').html(header);
    clone.find('.calendar-content .table').append(generateCalendarHeader()).append(generateCalendarCells(date));
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

  function generateCalendarCells(date) {
    var tbody = $('<tbody></tbody>');
    var trow;
    var cell;
    var hoverIn = function () {
      $(this).css('background-color', '#D9EDF7');
    };
    var hoverOut = function () {
      $(this).css('background-color', '#FFFFFF');
    };
    var onDaySelect = function(d) {
      return function() {
        daySelectCallback(d);
      };
    };

    for (var w = moment(date.startOf('month')); w <= date.endOf('month'); w.add(1, 'weeks')) {
      trow = $('<tr></tr>');
      for (var d = moment(w.startOf('isoWeek')); d <= w.endOf('isoWeek'); d.add(1, 'days')) {
        cell = $('<td></td>').html(d.format('DD'));
        cell.hover(hoverIn,hoverOut);
        cell.mousedown(onDaySelect(moment(d)));
        trow.append(cell);
      }
      tbody.append(trow);
    }
    return tbody;
  }

  function generateCalendarHeader() {
    var weekDays = moment.weekdaysMin();
    var sunday = weekDays.shift();
    weekDays.push(sunday);
    var tableHeader = $('<thead><tr></tr></thead>');
    var tableCell;
    weekDays.forEach(function (dayName) {
      tableCell = $('<td></td>').html(dayName);
      tableHeader.find('tr').append(tableCell);
    });

    return tableHeader;
  }

  trigger.click(showCalendar);
  trigger.blur(hideCalendar);
}

var startCal = new KarstelCalendar($('#start-calendar-button'), 'start-calendar-content', 'Anreisedatum', function onDaySelect(d) {
  console.log(d.format('LLLL'));
});
var endCal = new KarstelCalendar($('#end-calendar-button'), 'end-calendar-content', 'Abreisedatum', function onDaySelect(d) {
  console.log(d.format('LLLL'));
});


