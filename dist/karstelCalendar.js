// module pattern copied from https://github.com/umdjs/umd/blob/master/templates/amdWebGlobal.js

;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', '../bower_components/moment/moment', 'bootstrap'], factory);
    } else {
        // Browser globals
        root.KarstelCalendar = factory(root.jQuery, root.moment);
    }
}(this, function ($, moment, bootstrap) {

    'use strict';

    function KarstelCalendar(options) {
        var self = this;
        var triggerObject = options.triggerObject;
        var daySelectCallback = options.daySelectCallback || function noop() {
            };
        var id = options.id || 'karstelCalendar';
        var header = options.header || 'Select date';
        var locale = options.locale || 'en';
        var orientation = options.orientation || 'e';
        var startYear = options.startYear || moment().year();
        var endYear = options.endYear || moment().year() + 4;
        var hideAfterSelect = (options.hideAfterSelect === undefined) || options.hideAfterSelect;

        // the calendar jquery object
        var calendar;
        moment.locale(locale);
        // todays date and time (initialized as soon as new KarstelCalendar() is created
        var date = moment().set('year', startYear).set('month', (options.startYear) ? 0 : moment().month());
        render();

        self.triggerObject = function (val) {
            if (val !== undefined) {
                triggerObject = val;
                return self;
            } else {
                return triggerObject;
            }
        };


        self.daySelectCallback = function (val) {
            if (val !== undefined) {
                daySelectCallback = val;
                updateCalendar();
                return self;
            } else {
                return daySelectCallback;
            }
        };

        self.id = function (val) {
            if (val !== undefined) {
                id = val;
                calendar.attr('id', val);
                return self;
            } else {
                return id;
            }
        };

        self.header = function (val) {
            if (val !== undefined) {
                header = val;
                calendar.find('h3').html(header);
                return self;
            } else {
                return header;
            }
        };

        self.locale = function (val) {
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
        };

        self.orientation = function (val) {
            if (val !== undefined) {
                var oldClass = getArrowPos(orientation);
                var newClass = getArrowPos(val);
                orientation = val;
                calendar.removeClass(oldClass).addClass(newClass);
                if (calendar.is(":visible")) {
                    self.showCalendar();
                }
                return self;
            } else {
                return orientation;
            }
        };

        self.startYear = function (val) {
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
        };

        self.endYear = function (val) {
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
        };

        self.hideAfterSelect = function (val) {
            if (val !== undefined) {
                hideAfterSelect = val;
                return self;
            } else {
                return hideAfterSelect;
            }
        };

        self.date = function (val) {
            if (val !== undefined) {
                date = val;
                updateCalendar();
                return self;
            } else {
                return date;
            }
        };

        self.hideCalendar = function () {
            calendar.css('display', 'none');
        };

        // this handler function is invoked when the calendar-button (triggerObject) is pressed
        self.showCalendar = function (ev) {
            // change position to absolute and compute the position so that it is next to the calendar-button (triggerObject)
            switch (orientation) {
                case 'e':
                    calendar.css({
                        position: 'absolute',
                        left: triggerObject.offset().left + triggerObject.outerWidth() + 'px',
                        top: triggerObject.offset().top + (0.5 * triggerObject.outerHeight()) - (0.5 * calendar.outerHeight()) + 'px',
                        display: 'block'
                    });
                    break;

                case 'w':
                    calendar.css({
                        position: 'absolute',
                        left: triggerObject.offset().left - calendar.outerWidth() + 'px',
                        top: triggerObject.offset().top + (0.5 * triggerObject.outerHeight()) - (0.5 * calendar.outerHeight()) + 'px',
                        display: 'block'
                    });
                    break;

                case 'n':
                    calendar.css({
                        position: 'absolute',
                        left: triggerObject.offset().left - (0.5 * calendar.outerWidth()) + (0.5 * triggerObject.outerWidth()) + 'px',
                        top: triggerObject.offset().top - calendar.outerHeight() + 'px',
                        display: 'block'
                    });
                    break;

                case 's':
                    calendar.css({
                        position: 'absolute',
                        left: triggerObject.offset().left - (0.5 * calendar.outerWidth()) + (0.5 * triggerObject.outerWidth()) + 'px',
                        top: triggerObject.offset().top + triggerObject.outerHeight() + 'px',
                        display: 'block'
                    });
                    break;
            }
            calendar.focus();
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

            var w = moment(date).startOf('month');

            for (var weekCount = 0; weekCount < 6; weekCount++) {
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
                    cell.click(function executeCallbackAndHideCalendar(day, ev) {
                        daySelectCallback.bind(this)(day, ev);
                        if (hideAfterSelect) {
                            self.hideCalendar();
                        }
                    }.bind(cell, moment(d)));
                    trow.append(cell);
                }
                tbody.append(trow);
                w.add(1, 'weeks');
            }
            return tbody;
        }


        function getArrowPos(orientation) {
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

            var templateString = "<div id='calendar-template' tabindex='0' class='popover " + arrowPos + "' role='tooltip' style='display: none; outline: none'> " + "<div class='arrow'></div><h3 class='popover-title'></h3><div class='dropdown month-dropdown pull-left'><button class='btn btn-default dropdown-toggle' style='border: none; background-color: #fff' type='button' data-toggle='dropdown' aria-expanded='true'><span class='current-month'></span><span class='caret'></span></button><ul class='dropdown-menu' role='menu'></ul></div><div class='dropdown year-dropdown pull-right'><button class='btn btn-default dropdown-toggle' style='border: none; background-color: #fff' type='button' data-toggle='dropdown' aria-expanded='true'><span class='current-year'></span><span class='caret'></span></button><ul class='dropdown-menu' role='menu'></ul></div><div class='calendar-content popover-content'><table class='table calendar-table'><thead></thead><tbody></tbody></table></div></div>";

            calendar = $($.parseHTML(templateString));
            calendar.attr('id', id);
            calendar.find('h3').html(header);
            calendar.find('.month-dropdown ul').css('min-width', '0px').html(generateMonthDropdown());
            calendar.find('.year-dropdown ul').css({
                'min-width': '0px',
                'height': 'auto',
                'max-height': '200px',
                'overflow-x': 'hidden',
                'padding-right': '10px'
            }).html(generateYearDropdown(startYear, endYear));
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
                        self.hideCalendar();
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

        // triggerObject stands for the calendar-button. Register the showCalendar event handler with the click event of this button
        triggerObject.click(self.showCalendar);
    }

    return KarstelCalendar;
}));
