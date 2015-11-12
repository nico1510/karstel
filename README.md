# A simple javascript calender widget with bootstrap
## Dependencies
+ [moment.js](http://momentjs.com)
+ [bootstrap](http://getbootstrap.com)

## Documentation
use `KarstelCalendar(options)` to create a new calendar, where options can contain the following properties
+ trigger (mandatory): triggering element. Clicking this element triggers the widget. Widget appears next to the trigger element
+ daySelectCallback (mandatory): provide a callback function to handle the user selection
+ id (optional): specifiy an ID for the calender widget
+ header (optional): specify the header text of the widget
+ locale (optional): specify the locale (default is english, the locale stems from moment.js so the correspding language files have to be present too)
+ orientation (optional): specify on which side of the trigger, the calendar is opened. Possible values: 'e' (east), 'w' (west), 'n' (north), 's' (south)

## Usage example
```javascript
 var options = {
     trigger: $('#myButtonId'),
     daySelectCallback: function onDaySelect(d) {
         console.log(d.format('dddd, LL'));
     },
     id: 'myCalenderId',
     header: 'Check-in date',
     locale: 'en',
     orientation: 'e'
     };

 var startCal = new KarstelCalendar(options);
```

## Example
![sample image](https://cloud.githubusercontent.com/assets/5033050/10052597/171af012-6228-11e5-8d14-0276a13499a2.png)
