# A simple javascript calender widget with bootstrap
## Dependencies
+ [moment.js](http://momentjs.com)
+ [bootstrap](http://getbootstrap.com)

## Documentation
KarstelCalendar(trigger, id, header, daySelectCallback, locale)
+ trigger: triggering element. Clicking this element triggers the widget. Widget appears next to the trigger element
+ id: specifiy an ID for the calender widget
+ header: specify the header text of the widget
+ daySelectCallback: provide a callback function to handle the user selection
+ locale: specify the locale (the locale stems from moment.js so the correspding language files have to be present too)

## Usage example
```javascript
var startCal = new KarstelCalendar($('#start-calendar-button'), 'start-calendar-content', 'Check-in date',
 function onDaySelect(d) {
        console.log(d.format('LLLL'));  // just log the selected date
 });
```
