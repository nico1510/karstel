function KarstelCalendar(options) {
    var self = this;
    self.trigger = options.trigger;
    self.daySelectCallback = options.daySelectCallback || function noop() {};
    self.id = options.id || 'karstelCalendar';
    self.header = options.header || 'Select date';
    self.locale = options.locale || 'en';
    self.orientation = options.orientation || 'e';
    self.startYear = options.startYear || moment().year();
    self.endYear = options.endYear || moment().add(4, 'years').year();

    // the calendar jquery object
    var calendar;
    moment.locale(self.locale);
    // todays date and time (initialized as soon as new KarstelCalendar() is created
    var date = moment().set('year', self.startYear).set('month', (options.startYear) ? 0 : moment().month());
    render(true);

    self.setTrigger = function (trigger) {
        self.trigger = trigger;
        return self;
    };

    self.setDaySelectCallback = function (daySelectCallback) {
        self.daySelectCallback = daySelectCallback;
        updateCalendar();
        return self;
    };

    self.setId = function (id) {
        self.id = id;
        calendar.attr('id', self.id);
        return self;
    };

    self.setHeader = function (header) {
        self.header = header;
        calendar.find('h3').html(self.header);
        return self;
    };

    self.setLocale = function (locale) {
        self.locale = locale;
        date.locale(self.locale);
        moment.locale(self.locale);
        calendar.find('.month-dropdown ul').html(generateMonthDropdown());
        updateCalendar();
        return self;
    };

    self.setOrientation = function (orientation) {
        //FIXME: doesn't work yet
        self.orientation = orientation;
        render(false);
        return self;
    };

    self.setStartYear = function (startYear) {
        self.startYear = startYear;
        if (date.get('year') < startYear) {
            date.set('year', startYear);
            calendar.find('.year-dropdown .current-year').html(date.year());
        }
        calendar.find('.year-dropdown ul').html(generateYearDropdown(self.startYear, self.endYear));
        return self;
    };

    self.setEndYear = function (endYear) {
        self.endYear = endYear;
        if (date.get('year') > endYear) {
            date.set('year', endYear);
            calendar.find('.year-dropdown .current-year').html(date.year());
        }
        calendar.find('.year-dropdown ul').html(generateYearDropdown(self.startYear, self.endYear));
        return self;
    };

    // generate the cells of a calendar (the individual days) based on a specific date
    function generateCalendarCells() {
        //++++++ generation of various handler functions which are used for the cells ++++++

        // event handler which changes the background of a component when a user is hovering over it (with the mouse)
        var hoverIn = function (ev) {
            $(ev.target).css('background-color', '#D9EDF7');
        };
        // event handler which changes the background of a component when a user stops hovering over it
        var hoverOut = function (color) {
            return function hoverOutHandler(ev) {
                $(ev.target).css('background-color', color);
            };
        };
        var hoverOutFunction;

        var unselectableText = {
            '-moz-user-select': '-moz-none',
            '-khtml-user-select': 'none',
            '-webkit-user-select': 'none',
            '-ms-user-select': 'none',
            'user-select': 'none',
            'cursor': 'pointer'
        };

        // ++++ actual generation of table cells ++++
        var tbody = $('<tbody></tbody>').css(unselectableText);
        var trow;
        var cell;
        var w = moment(date.startOf('month'));
        var firstWeek = true;
        while (w < date.endOf('month')) {
            if (firstWeek) {
                firstWeek = false;
            } else {
                w.add(1, 'weeks');
            }
            // for every week add a new table row
            trow = $('<tr></tr>');
            for (var d = moment(w.startOf('isoWeek')); d <= w.endOf('isoWeek'); d.add(1, 'days')) {
                // for every day in the week create a new table cell
                cell = $('<td></td>').html(d.format('DD'));
                if (d < date.startOf('month') || d > date.endOf('month')) {
                    cell.css('color', 'Gainsboro');
                } else if (d.isSame(new Date(), "day")) {
                    cell.css({
                        'font-weight': 'bold',
                        'color': 'Maroon'
                    });
                }
                // now assign the handler functions which are defined above to the cell
                hoverOutFunction = hoverOut('White');
                cell.hover(hoverIn, hoverOutFunction);
                (function (theCallBack) {
                    cell.click(function executeCallbackAndHideCalendar(calendarCell, day) {
                        theCallBack(calendarCell, day);
                        calendar.css('display', 'none');
                    }.bind(cell, moment(d)));
                })(self.daySelectCallback);
                trow.append(cell);
            }
            tbody.append(trow);
        }
        return tbody;
    }

    // create a clone from the html element with id calendar-template with a new id
    // and fill the calendar content table with table header and table body
    // this method is invoked as soon as new KarstelCalendar() is created
    function render(init) {
        var arrowPos;
        switch (self.orientation) {
            case 'e':
                arrowPos = 'right';
                break;
            case 'w':
                arrowPos = 'left';
                break;
            case 'n':
                arrowPos = 'top';
                break;
            case 's':
                arrowPos = 'bottom';
                break;

        }

        /*jshint multistr: true */
        var templateString = "<div id='calendar-template' tabindex='0' class='popover " + arrowPos + "' role='tooltip' style='display: none; outline: none'> "
            + "<div class='arrow'></div>                                                                                                   \
                    <h3 class='popover-title'></h3>                                                                                             \
                    <div class='dropdown month-dropdown pull-left'>                                                                             \
                    <button class='btn btn-default dropdown-toggle' type='button' data-toggle='dropdown' aria-expanded='true'>                  \
                    <span class='current-month'></span>                                                                                         \
                    <span class='caret'></span>                                                                                                 \
                    </button>                                                                                                                   \
                    <ul class='dropdown-menu' role='menu'></ul>                                                                                 \
                    </div>                                                                                                                      \
                    <div class='dropdown year-dropdown pull-right'>                                                                             \
                    <button class='btn btn-default dropdown-toggle' type='button' data-toggle='dropdown' aria-expanded='true'>                  \
                    <span class='current-year'></span>                                                                                          \
                    <span class='caret'></span>                                                                                                 \
                    </button>                                                                                                                   \
                    <ul class='dropdown-menu' role='menu'></ul>                                                                                 \
                    </div>                                                                                                                      \
                    <div class='calendar-content popover-content'>                                                                              \
                    <table class='table calendar-table'>                                                                                        \
                    <thead></thead>                                                                                                             \
                    <tbody></tbody>                                                                                                             \
                    </table>                                                                                                                    \
                    </div>                                                                                                                      \
                    </div>";

        calendar = $($.parseHTML(templateString));
        calendar.attr('id', self.id);
        calendar.find('h3').html(self.header);
        calendar.find('.month-dropdown ul').append(generateMonthDropdown());
        calendar.find('.year-dropdown ul').append(generateYearDropdown(self.startYear, self.endYear));
        calendar.find('.calendar-content .table thead').replaceWith(generateCalendarHeader());
        if (init) {
            calendar.appendTo('body');
        }
        updateCalendar();
    }

    // updates the calendar cells based on the value of this.date
    function updateCalendar() {
        calendar.find('.calendar-content .table tbody').replaceWith(generateCalendarCells());
        calendar.find('.month-dropdown .current-month').html(date.format('MMMM'));
        calendar.find('.year-dropdown .current-year').html(date.year());
    }

    function generateMonthDropdown() {
        var monthList = $();
        moment.months().forEach(function (monthName, index) {
            monthList = monthList.add($('<li />', {
                    role: 'presentation'
                }).append($('<a />', {
                        role: 'menuitem'
                    }).html(monthName)
                        .click(function selectMonth() {
                        date.month(index);
                        updateCalendar();
                    })
                )
            );
        });

        return monthList;
    }

    // returns a closed interval from start to end
    function getClosedInterval(start, end) {
        var interval = new Array(end - start);

        for (var i = start; i <= end; i++) {
            interval[i - start] = i;
        }
        return interval;
    }


    function generateYearDropdown(startYear, endYear) {
        if (startYear > endYear) {
            throw Error('startYear must be smaller than endYear');
        }
        var yearList = $();
        var nextYears = getClosedInterval(startYear, endYear);

        nextYears.forEach(function (year) {
            yearList = yearList.add($('<li />', {
                role: 'presentation'
            }).append($('<a />', {
                role: 'menuitem'
            }).html(year).click(function selectYear() {
                date.year(year);
                updateCalendar();
            })));
        });
        return yearList;
    }

    // this handler function is invoked when the calendar-button (trigger) is pressed
    function showCalendar(ev) {
        // change position to absolute and compute the position so that it is next to the calendar-button (trigger)
        switch (self.orientation) {
            case 'e':
                calendar.css({
                    position: 'absolute',
                    left: self.trigger.offset().left + self.trigger.outerWidth() + 'px',
                    top: self.trigger.offset().top + (0.5 * self.trigger.outerHeight()) - (0.5 * calendar.outerHeight()) + 'px',
                    display: 'block'
                });
                break;

            case 'w':
                calendar.css({
                    position: 'absolute',
                    left: self.trigger.offset().left - calendar.outerWidth() + 'px',
                    top: self.trigger.offset().top + (0.5 * self.trigger.outerHeight()) - (0.5 * calendar.outerHeight()) + 'px',
                    display: 'block'
                });
                break;

            case 'n':
                calendar.css({
                    position: 'absolute',
                    left: self.trigger.offset().left - (0.5 * calendar.outerWidth()) + (0.5 * self.trigger.outerWidth()) + 'px',
                    top: self.trigger.offset().top - calendar.outerHeight() + 'px',
                    display: 'block'
                });
                break;

            case 's':
                calendar.css({
                    position: 'absolute',
                    left: self.trigger.offset().left - (0.5 * calendar.outerWidth()) + (0.5 * self.trigger.outerWidth()) + 'px',
                    top: self.trigger.offset().top + self.trigger.outerHeight() + 'px',
                    display: 'block'
                });
                break;
        }
        calendar.focus();
    }

    // this handler function is invoked when the calendar looses focus (e.g. a click on another component other than
    // the calendar. Display 'none' makes the calendar invisible
    function hideCalendar(ev) {
        // this (the use of setTimeout) is an ugly hack but it's not possible any other way...
        setTimeout(function () {
            var target = document.activeElement;
            if (target !== null) {
                if (calendar.get(0) !== target && calendar.has(target).length === 0) {
                    calendar.css('display', 'none');
                }
            }
        }, 1);
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
    calendar.focusout(hideCalendar);

    // trigger stands for the calendar-button. Register the showCalendar event handler with the click event of this button
    self.trigger.click(showCalendar);
}
