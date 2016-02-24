[![Build Status](https://travis-ci.org/nico1510/karstel.svg?branch=master)](https://travis-ci.org/nico1510/karstel)

# A simple javascript calender widget with bootstrap
## Dependencies
+ [moment.js](http://momentjs.com)
+ [bootstrap](http://getbootstrap.com)

## Documentation
use `new KarstelCalendar(options)` to create a new calendar, where options can contain the following properties: 

| property  | description           | default  |
| ----- |--------|-------------|-----|
| triggerObject| This property is mandatory. It defines the triggering element. Clicking this element triggers the widget. Widget appears next to the trigger element | |
| daySelectCallback  | provide a callback function to handle the user selection. A moment date object with the selected date is passed to the callback and can be handled there | `function noop() {}` |
| id | specify an ID for the calender widget | 'karstelCalendar' |
| header | specify the header text of the widget | 'Select date' |
| locale | specify the locale. The locale stems from moment.js, so the corresponding language files have to be present too! | 'en' |
| orientation | specify on which side of the triggerObject, the calendar is opened. Possible values: 'e' (east), 'w' (west), 'n' (north), 's' (south) | 'e' |
| startYear | year where the calendar starts  | current year |
| endYear | year where the calendar ends | current year + 4 |
| hideAfterSelect | determines whether the calendar should be closed after the user has selected a date | `true` |

## Usage example
For an example of how to use the calendar in a html page see [usage-example.html](https://github.com/nico1510/karstel/blob/master/usage-example.html). If you are using [RequireJS](http://requirejs.org/) you can also require the calendar as an AMD module. The following code snippet creates a new calendar with some optional settings. Note that only the `triggerObject` property is required.

```javascript
 var options = {
     triggerObject: $('#myButtonId'),
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

options can also be changed via setters after the object is instantiated: 

```javascript
 startCal.locale('de');
 startCal.header('Datum');
  
 // or with chainable setters
 startCal.locale('de').header('Datum');
```

to get an option property use

```javascript
 startCal.header();
 // 'Select date'
```

to show or close the calendar explicitly

```javascript
 startCal.showCalendar();
 // or respectively
 startCal.hideCalendar();
```


## Example
![sample image](https://cloud.githubusercontent.com/assets/5033050/10052597/171af012-6228-11e5-8d14-0276a13499a2.png)
