describe("karstel calendar test suite", function () {

    var cal;

    before(function () {
        $('body').append($('<input type="text" id="triggerElement"/>'));
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
        $('.btn, .btn-default, .dropdown-toggle').first().trigger('click');
        expect($('ul.dropdown-menu').first().is(":visible")).to.be.true;
        $('.btn, .btn-default, .dropdown-toggle').last().trigger('click');
        expect($('ul.dropdown-menu').last().is(":visible")).to.be.true;
    });


    //TODO: startYear endYear, daySelectCallback,
});
