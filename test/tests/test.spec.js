describe("karstel calendar test suite", function () {

    var cal;

    before(function () {
        $('body').append($('<input type="text" id="triggerElement" style=" position: fixed; top: 50%; left: 50%" />'));
        cal = new KarstelCalendar({triggerObject: $('#triggerElement')});
    });

    it('should have a default id', function () {
        expect(cal.id()).to.not.be.undefined;
    });

    it('should have a default daySelectCallback', function () {
        expect(cal.daySelectCallback()).to.not.be.undefined;
    });

    it('should have a default header', function () {
        expect(cal.header()).to.not.be.undefined;
    });

    it('should have a default locale', function () {
        expect(cal.locale()).to.not.be.undefined;
    });

    it('should have a default orientation', function () {
        expect(cal.orientation()).to.not.be.undefined;
    });

    it('should have a default startYear', function () {
        expect(cal.startYear()).to.not.be.undefined;
    });

    it('should have a default endYear', function () {
        expect(cal.endYear()).to.not.be.undefined;
    });

    it('should have a default hideAfterSelect', function () {
        expect(cal.hideAfterSelect()).to.not.be.undefined;
    });

    it('should be present but invisible in dom', function () {
        expect($('#' + cal.id())[0]).to.not.be.empty;
        expect($('#' + cal.id()).is(":visible")).to.be.false;
    });

    it('should show and hide itself', function () {
        expect($('#' + cal.id()).is(":visible")).to.be.false;
        cal.showCalendar();
        expect($('#' + cal.id()).is(":visible")).to.be.true;
        cal.hideCalendar();
        expect($('#' + cal.id()).is(":visible")).to.be.false;
    });

    it('should show or hide itself after selecting a day based on the hideAfterSelect property', function () {
        // first test the option where it stays visible
        cal.hideAfterSelect(false);
        expect($('#' + cal.id()).is(":visible")).to.be.false;
        cal.showCalendar();
        expect($('#' + cal.id()).is(":visible")).to.be.true;
        $('.calendar-table > tbody >> td:eq(10)').trigger('click');
        expect($('#' + cal.id()).is(":visible")).to.be.true;

        // now test the option where the calendar hides after selecting a day
        cal.hideCalendar();
        cal.hideAfterSelect(true);
        expect($('#' + cal.id()).is(":visible")).to.be.false;
        cal.showCalendar();
        expect($('#' + cal.id()).is(":visible")).to.be.true;
        $('.calendar-table > tbody >> td:eq(10)').trigger('click');
        expect($('#' + cal.id()).is(":visible")).to.be.false;
    });

    it('should open when the triggerObject is clicked', function () {
        expect($('#' + cal.id()).is(":visible")).to.be.false;
        cal.triggerObject().trigger('click');
        expect($('#' + cal.id()).is(":visible")).to.be.true;
    });

    it('should close after a short delay when it looses focus to another element', function (done) {
        $('body').append('<input id="anotherElement" type="text" />');
        cal.showCalendar();
        $('#anotherElement').focus();
        $('#' + cal.id()).focusout();
        setTimeout(function () {
            expect($('#' + cal.id()).is(":visible")).to.be.false;
            done();
        }, 10);
    });

    it('should open at the correct position', function () {
        cal.orientation('e');
        cal.showCalendar();
        expect($('#' + cal.id()).position().left).to.be.above(cal.triggerObject().position().left);
        cal.hideCalendar();
        cal.orientation('w');
        cal.showCalendar();
        expect($('#' + cal.id()).position().left).to.be.below(cal.triggerObject().position().left);
        cal.hideCalendar();
        cal.orientation('n');
        cal.showCalendar();
        expect($('#' + cal.id()).position().top).to.be.below(cal.triggerObject().position().top);
        cal.hideCalendar();
        cal.orientation('s');
        cal.showCalendar();
        expect($('#' + cal.id()).position().top).to.be.above(cal.triggerObject().position().top);
    });

    it('should change its header text', function () {
        var headerText = 'testHeader';
        cal.header(headerText);
        expect($('#' + cal.id() + ' .popover-title').html()).to.be.equal(headerText);
    });

    it('should have working dropdowns', function () {
        expect($('ul.dropdown-menu').first().is(":visible")).to.be.false;
        expect($('ul.dropdown-menu').last().is(":visible")).to.be.false;

        $('.year-dropdown > .btn').trigger('click');
        expect($('.year-dropdown > ul.dropdown-menu').is(":visible")).to.be.true;
        $('.month-dropdown > .btn').trigger('click');
        expect($('.month-dropdown > ul.dropdown-menu').is(":visible")).to.be.true;
    });

    it('should change its start and end year', function () {
        function testPair(startYear, endYear) {
            cal.startYear(startYear);
            cal.endYear(endYear);
            var currentYear = startYear;
            $('.year-dropdown > ul.dropdown-menu >> a').each(function (index, value) {
                currentYear = startYear + index;
                expect(parseInt($(value).html())).to.be.equal(currentYear);
            });
        }

        testPair(2001, 2001);
        testPair(2000, 2020);
        testPair(1900, 2100);
    });

    it('should change its locale', function () {
        var englishMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var englishWeekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

        var germanMonths = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
        var germanWeekDays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

        // lowercase is intentional
        var spanishMonths = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        var spanishWeekDays = ["do", "lu", "ma", "mi", "ju", "vi", "sá"];

        var japaneseMonths = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
        var japaneseWeekDays = ["日", "月", "火", "水", "木", "金", "土"];


        function testLocale(locale, months, weekDays) {
            cal.locale(locale);
            $('.month-dropdown > ul.dropdown-menu >> a').each(function (index, value) {
                expect(months).to.contain($(value).html());
            });
            $('.calendar-table > thead > tr > td').each(function (index, value) {
                expect(weekDays).to.contain($(value).html());
            });
        }

        testLocale('de', germanMonths, germanWeekDays);
        testLocale('en', englishMonths, englishWeekDays);
        testLocale('es', spanishMonths, spanishWeekDays);
        testLocale('ja', japaneseMonths, japaneseWeekDays);
    });


    it('should have a working callback function', function (done) {
        cal.startYear(1900);
        cal.locale('en');

        function testCallbackForSpecificDay(dayObject, done) {
            cal.showCalendar();
            var momentObject = moment(dayObject.year + '-' + dayObject.month + '-' + dayObject.day);

            cal.daySelectCallback(function (day, ev) {
                expect(this[0]).to.be.a('HTMLTableCellElement');
                expect(ev.target === this[0]).to.be.true;
                expect(day.isSame(momentObject, 'day')).to.be.true;
                if (done) {
                    done();
                }
            });
            // click on year label in year dropdown
            $('.year-dropdown > ul.dropdown-menu >> a').each(function (index, element) {
                if ($(element).html() === String(dayObject.year)) {
                    $(element).trigger('click');
                }
            });
            // click on month in month dropdown
            $('.month-dropdown > ul.dropdown-menu >> a:eq(' + String(dayObject.month - 1) + ')').trigger('click');

            $('.calendar-table > tbody >> td').each(function (index, element) {
                if ($(element).html() === String(dayObject.day) && $(element).css('color') !== 'rgb(220, 220, 220)') {
                    $(element).trigger('click');
                }
            });
        }

        testCallbackForSpecificDay({'year': '1989', 'month': '10', 'day': '15'});
        testCallbackForSpecificDay({'year': '1940', 'month': '01', 'day': '20'});
        testCallbackForSpecificDay({'year': '1955', 'month': '03', 'day': '10'});
        testCallbackForSpecificDay({'year': '1989', 'month': '02', 'day': '02'});
        testCallbackForSpecificDay({'year': '1999', 'month': '04', 'day': '01'});
        testCallbackForSpecificDay({'year': '1905', 'month': '11', 'day': '30'});
        testCallbackForSpecificDay({'year': '2000', 'month': '08', 'day': '04'});
        testCallbackForSpecificDay({'year': '2010', 'month': '12', 'day': '31'});
        testCallbackForSpecificDay({'year': '2015', 'month': '09', 'day': '11'}, done);

    });
});
