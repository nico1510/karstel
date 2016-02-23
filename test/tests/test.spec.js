describe("karstel calendar test suite", function () {

    var cal;

    before(function(){
        $('body').append($('<input type="text" id="triggerElement"/>'));
        cal = new KarstelCalendar({trigger: $('#triggerElement')});
    });

    it('should have a default id', function () {
        expect(cal.id()).to.be.equal('karstelCalendar');
    });

    it('should be present but invisible in dom', function () {
        expect($('#karstelCalendar')[0]).to.not.be.empty;
        expect($('#karstelCalendar').is(":visible")).to.be.false;
    });

    it('should show and hide itself', function () {
        expect($('#karstelCalendar').is(":visible")).to.be.false;
        cal.showCalendar();
        expect($('#karstelCalendar').is(":visible")).to.be.true;
        cal.hideCalendar();
        expect($('#karstelCalendar').is(":visible")).to.be.false;
    });
});
