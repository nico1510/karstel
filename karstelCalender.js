function KarstelCalendar(options) {
    var self = this;
    var trigger = options.trigger;
    var daySelectCallback = options.daySelectCallback || function noop() {};
    var id = options.id || 'karstelCalendar';
    var header = options.header || 'Select date';
    var locale = options.locale || 'en';
    var orientation = options.orientation || 'e';
    var startYear = options.startYear || moment().year();
    var endYear = options.endYear || moment().add(4, 'years').year();
    var hideAfterSelect = options.hideAfterSelect || true;

    // the calendar jquery object
    var calendar;
    moment.locale(locale);
    // todays date and time (initialized as soon as new KarstelCalendar() is created
    var date = moment().set('year', startYear).set('month', (options.startYear) ? 0 : moment().month());
    render();

    self.hideCalendar = function() {
        calendar.css('display', 'none');
    };

    // this handler function is invoked when the calendar-button (trigger) is pressed
    self.showCalendar = function (ev) {
        // change position to absolute and compute the position so that it is next to the calendar-button (trigger)
        switch (orientation) {
            case 'e':
                calendar.css({
                    position: 'absolute',
                    left: trigger.offset().left + trigger.outerWidth() + 'px',
                    top: trigger.offset().top + (0.5 * trigger.outerHeight()) - (0.5 * calendar.outerHeight()) + 'px',
                    display: 'block'
                });
                break;

            case 'w':
                calendar.css({
                    position: 'absolute',
                    left: trigger.offset().left - calendar.outerWidth() + 'px',
                    top: trigger.offset().top + (0.5 * trigger.outerHeight()) - (0.5 * calendar.outerHeight()) + 'px',
                    display: 'block'
                });
                break;

            case 'n':
                calendar.css({
                    position: 'absolute',
                    left: trigger.offset().left - (0.5 * calendar.outerWidth()) + (0.5 * trigger.outerWidth()) + 'px',
                    top: trigger.offset().top - calendar.outerHeight() + 'px',
                    display: 'block'
                });
                break;

            case 's':
                calendar.css({
                    position: 'absolute',
                    left: trigger.offset().left - (0.5 * calendar.outerWidth()) + (0.5 * trigger.outerWidth()) + 'px',
                    top: trigger.offset().top + trigger.outerHeight() + 'px',
                    display: 'block'
                });
                break;
        }
        calendar.focus();
    };

    self.__defineGetter__("trigger", function () {
        return setTrigger;
    });

    function setTrigger(val) {
        if (val !== undefined) {
            trigger = val;
            return self;
        } else {
            return trigger;
        }
    }

    self.__defineSetter__("trigger", function (val) {
        setTrigger(val);
    });

    self.__defineGetter__("daySelectCallback", function () {
        return setDaySelectCallback;
    });

    function setDaySelectCallback(val) {
        if (val !== undefined) {
            daySelectCallback = val;
            updateCalendar();
            return self;
        } else {
            return daySelectCallback;
        }
    }

    self.__defineSetter__("daySelectCallback", function (val) {
        setDaySelectCallback(val);
    });

    self.__defineGetter__("id", function () {
        return setId;
    });

    function setId(val) {
        if (val !== undefined) {
            id = val;
            calendar.attr('id', val);
            return self;
        } else {
            return id;
        }
    }

    self.__defineSetter__("id", function (val) {
        setId(val);
    });

    self.__defineGetter__("header", function () {
        return setHeader;
    });

    function setHeader(val) {
        if (val !== undefined) {
            header = val;
            calendar.find('h3').html(header);
            return self;
        } else {
            return header;
        }
    }

    self.__defineSetter__("header", function (val) {
        setHeader(val);
    });

    self.__defineGetter__("locale", function () {
        return setLocale;
    });

    function setLocale(val) {
        if (val !== undefined) {
            locale = val;
            date.locale(locale);
            moment.locale(locale);
            calendar.find('.month-dropdown ul').html(generateMonthDropdown());
            calendar.find('.calendar-content .table thead').replaceWith(generateCalendarHeader());
            updateCalendar();
            return self;
        } else {
            return locale;
        }
    }

    self.__defineSetter__("locale", function (val) {
        setLocale(val);
    });

    self.__defineGetter__("orientation", function () {
        return setOrientation;
    });

    function setOrientation(val) {
        if (val !== undefined) {
            var oldClass = getArrowPos(orientation);
            var newClass = getArrowPos(val);
            orientation = val;
            calendar.removeClass(oldClass).addClass(newClass);
            if(calendar.is(":visible")) {
                self.showCalendar();
            }
            return self;
        } else {
            return orientation;
        }
    }

    self.__defineSetter__("orientation", function (val) {
        setOrientation(val);
    });

    self.__defineGetter__("startYear", function () {
        return setStartYear;
    });

    function setStartYear(val) {
        if (val !== undefined) {
            startYear = val;
            if (date.get('year') < startYear) {
                date.set('year', startYear);
                calendar.find('.year-dropdown .current-year').html(date.year());
            }
            calendar.find('.year-dropdown ul').html(generateYearDropdown(startYear, endYear));
            return self;
        } else {
            return startYear;
        }
    }

    self.__defineSetter__("startYear", function (val) {
        setStartYear(val);
    });

    self.__defineGetter__("endYear", function () {
        return setEndYear;
    });

    function setEndYear(val) {
        if (val !== undefined) {
            endYear = val;
            if (date.get('year') > endYear) {
                date.set('year', endYear);
                calendar.find('.year-dropdown .current-year').html(date.year());
            }
            calendar.find('.year-dropdown ul').html(generateYearDropdown(startYear, endYear));
            return self;
        } else {
            return endYear;
        }
    }

    self.__defineSetter__("endYear", function (val) {
        setEndYear(val);
    });

    self.__defineGetter__("hideAfterSelect", function () {
        return setHideAfterSelect;
    });

    function setHideAfterSelect(val) {
        if (val !== undefined) {
            hideAfterSelect = val;
            return self;
        } else {
            return hideAfterSelect;
        }
    }

    self.__defineSetter__("hideAfterSelect", function (val) {
        setHideAfterSelect(val);
    });

    self.__defineGetter__("date", function () {
        return setDate;
    });

    function setDate(val) {
        if (val !== undefined) {
            date = val;
            updateCalendar();
            return self;
        } else {
            return date;
        }
    }

    self.__defineSetter__("date", function (val) {
        setDate(val);
    });

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

        var w = moment(date).startOf('month');

        var firstWeek = true;
        while (w < moment(date).endOf('month')) {
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
                if (d < moment(date).startOf('month') || d > moment(date).endOf('month')) {
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
                    cell.click(function executeCallbackAndHideCalendar(calendarCell, day) {
                        daySelectCallback(calendarCell, day);
                        if(hideAfterSelect) {
                            self.hideCalendar();
                        }
                    }.bind(cell, moment(d)));
                trow.append(cell);
            }
            tbody.append(trow);
        }
        return tbody;
    }


    function getArrowPos (orientation) {
        var arrowPos;

        switch (orientation) {
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

        return arrowPos;
    }

    // create a clone from the html element with id calendar-template with a new id
    // and fill the calendar content table with table header and table body
    // this method is invoked as soon as new KarstelCalendar() is created
    function render() {
        var arrowPos = getArrowPos(orientation);

        /*jshint multistr: true */
        var templateString = "<div id='calendar-template' tabindex='0' class='popover " + arrowPos + "' role='tooltip' style='display: none; outline: none'> "
            + "<div class='arrow'></div>                                                                                                   \
                    <h3 class='popover-title'></h3>                                                                                             \
                    <div class='dropdown month-dropdown pull-left'>                                                                             \
                    <button class='btn btn-default dropdown-toggle' style='border: none; background-color: #fff' type='button' data-toggle='dropdown' aria-expanded='true'>                  \
                    <span class='current-month'></span>                                                                                         \
                    <span class='caret'></span>                                                                                                 \
                    </button>                                                                                                                   \
                    <ul class='dropdown-menu' role='menu'></ul>                                                                                 \
                    </div>                                                                                                                      \
                    <div class='dropdown year-dropdown pull-right'>                                                                             \
                    <button class='btn btn-default dropdown-toggle' style='border: none; background-color: #fff' type='button' data-toggle='dropdown' aria-expanded='true'>                  \
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
        calendar.attr('id', id);
        calendar.find('h3').html(header);
        calendar.find('.month-dropdown ul').css('min-width', '0px').html(generateMonthDropdown());
        calendar.find('.year-dropdown ul').css('min-width', '0px').html(generateYearDropdown(startYear, endYear));
        calendar.find('.calendar-content .table thead').replaceWith(generateCalendarHeader());
        calendar.appendTo('body');

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

    // this handler function is invoked when the calendar looses focus (e.g. a click on another component other than
    // the calendar. Display 'none' makes the calendar invisible
    function hideCalendarOnFocusOut(ev) {
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

    // When the calendar looses focus invoke the hideCalendarOnFocusOut handler which is defined above
    calendar.focusout(hideCalendarOnFocusOut);

    // trigger stands for the calendar-button. Register the showCalendar event handler with the click event of this button
    trigger.click(self.showCalendar);
}
