describe("karstel calendar test suite", function () {

    it('should have a default id', function () {
        var cal = new KarstelCalendar({trigger: $('<input type="text" />')});
        expect(cal.id()).to.be.equal('karstelCalendar');
    });
});
