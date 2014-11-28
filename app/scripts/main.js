"use strict";

moment.locale('de');


function KarstelCalendar(trigger, id, header, daySelectCallback) {

  // todays date and time (initialized as soon as new KarstelCalendar() is created)
  this.date = moment();

  // create a clone from the html element with id calendar-template with a new id
  // and fill the calendar content table with table header and table body
  // this method is invoked as soon as new KarstelCalendar() is created
  (function init() {
    var clone = $('#calendar-template').clone().attr('id', id);
    clone.find('h3').html(header);
    clone.find('.calendar-content .table').append(generateCalendarHeader()).append(generateCalendarCells(this.date));
    clone.appendTo('body');
    this.calendar = clone;
  }).bind(this)();

  // this handler function is invoked when the calendar-button (trigger) is pressed
  var showCalendar = function(ev) {
    // change position to absolute and compute the position so that it is next to the calendar-button (trigger)
    this.calendar.css({
      position: 'absolute',
      left: trigger.offset().left + trigger.outerWidth() + 'px',
      top: trigger.offset().top + (0.5 * trigger.outerHeight()) - (0.5 * this.calendar.outerHeight()) + 'px',
      display : 'block'
    });
    this.calendar.focus();
  }.bind(this);

  // this handler function is invoked when the calendar looses focus (e.g. a click on another component other than
  // the calendar. Display 'none' makes the calendar invisible
  var hideCalendar = function(ev) {
    // this (the use of setTimeout) is an ugly hack but it's not possible any other way...
    setTimeout(function() {
      var target = document.activeElement;
      if (target !== null) {
        if (this.calendar.get(0) !== target && this.calendar.has(target).length === 0) {
          this.calendar.css('display', 'none');
        }
      }
    }.bind(this), 1);
  }.bind(this);

  // generate the cells of a calendar (the individual days) based on a specific date
  function generateCalendarCells(date) {

    //++++++ generation of various handler functions which are used for the cells ++++++

    // event handler which changes the background of a component when a user is hovering over it (with the mouse)
    var hoverIn = function () {
      $(this).css('background-color', '#D9EDF7');
    };
    // event handler which changes the background of a component when a user stops hovering over it
    var hoverOut = function () {
      $(this).css('background-color', '#FFFFFF');
    };
    // helper function which takes a date as input and returns an anonymous function which executes the
    // daySelectCallback-handler with this date as soon as it is invoked
    var onDaySelect = function(d) {
      return function() {
        daySelectCallback(d);
      };
    };

    // ++++ actual generation of table cells ++++
    var tbody = $('<tbody></tbody>');
    var trow;
    var cell;

    for (var w = moment(date.startOf('month')); w <= date.endOf('month'); w.add(1, 'weeks')) {
      // for every week add a new table row
      trow = $('<tr></tr>');
      for (var d = moment(w.startOf('isoWeek')); d <= w.endOf('isoWeek'); d.add(1, 'days')) {
        // for every day in the week create a new table cell
        cell = $('<td></td>').html(d.format('DD'));
        // now assign the handler functions which are defined above to the cell
        cell.hover(hoverIn,hoverOut);
        cell.click(onDaySelect(moment(d)));
        trow.append(cell);
      }
      tbody.append(trow);
    }
    return tbody;
  }

  function generateCalendarHeader() {
    // get abbreviations for weekdays
    var weekDays = moment.weekdaysMin();
    // sunday is defined here as the start of the week but we want monday to be the start
    // therefore remove sunday from the array (shift removes the first element) and push it on the end of the array
    var sunday = weekDays.shift();
    weekDays.push(sunday);
    var tableHeader = $('<thead><tr></tr></thead>');
    var tableCell;
    // for each dayName in the array create a table cell and fill its html with the dayName
    // then append the table cell to the header row
    weekDays.forEach(function (dayName) {
      tableCell = $('<td></td>').html(dayName);
      tableHeader.find('tr').append(tableCell);
    });

    return tableHeader;
  }
  // When the calendar looses focus invoke the hideCalendar handler which is defined above
  this.calendar.focusout(hideCalendar);

  // trigger stands for the calendar-button. Register the showCalendar event handler with the click event of this button
  trigger.click(showCalendar);
}


// create two test objects of KarstelCalendar. The function onDaySelect corresponds to the daySelectCallback function
// in the KarstelCalendar object and is executed as soon a day in the calendar is clicked.
var startCal = new KarstelCalendar($('#start-calendar-button'), 'start-calendar-content', 'Anreisedatum', function onDaySelect(d) {
  console.log(d.format('LLLL'));
});
var endCal = new KarstelCalendar($('#end-calendar-button'), 'end-calendar-content', 'Abreisedatum', function onDaySelect(d) {
  console.log(d.format('LLLL'));
});
