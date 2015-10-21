# A simple javascript calender widget with bootstrap
## Dependencies
+ [moment.js](http://momentjs.com)
+ [bootstrap](http://getbootstrap.com)

## Documentation
KarstelCalendar(trigger, id, header, daySelectCallback, locale, orientation)
+ trigger: triggering element. Clicking this element triggers the widget. Widget appears next to the trigger element
+ id: specifiy an ID for the calender widget
+ header: specify the header text of the widget
+ daySelectCallback: provide a callback function to handle the user selection
+ locale: specify the locale (the locale stems from moment.js so the correspding language files have to be present too)
+ orientation: specify on which side of the trigger, the calendar is opened

## Usage example
```javascript
var startCal = new KarstelCalendar($('#start-calendar-button'), 'start-calendar-content', 'Check-in date',
 function onDaySelect(d) {
        console.log(d.format('LLLL'));  // just log the selected date
 }, 'en', 'e');
```

## Example
![sample image](https://cloud.githubusercontent.com/assets/5033050/10052597/171af012-6228-11e5-8d14-0276a13499a2.png)
