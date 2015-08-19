# User Behavior Library

A collection of procedures that can provide valuable information on how the user behaves in a website. The library records things like:

- General user information
- Time spent on site
- Clicks
  - Click count
  - Node clicked (html representation of the node)
  - Click position
- Mouse movement
- Whenever the site goes out of context, like changing to another tab
- Key Logger that detects key presses and pasted data information

## Getting Started
Add userbehavior.js to your site

```html
<script src="userbehavior.js"></script>
```

and init with defaults

```javascript
userLog.init();
```

## Usage

The init function receives one object with custom settings:
- Services Used (by default all of them are activated), if you want to deactivate one set it to false
  - clickCount
  - clickDetails
  - mouseMovement
  - context
  - keyLogger
- [actionItem](## What to do with the information acquired)
  - processOnAction: true/false
  - selector: CSS syntax selector
  - event: JS Event
- processTime: interval in which processData function is called
- processData: function to process results

```javascript
userLog.init({
    mouseMovement: false,
    processTime: 0,
    processData: function(results){
        console.log(JSON.stringify(results));
    },
    actionItem: {
        processOnAction: true,
        selector: '#myActionItem',
        event: 'click'
    },
});
```

If these values are not provided, defaults are used:
```javascript
{
    // Available functionality
    clickCount: true,
    clickDetails: true,
    mouseMovement: true,
    context: true,
    keyLogger: true,

    // Action Item
    actionItem: {
        processOnAction: false,
        selector: '',
        event: ''
    },
    processTime: 15,
    processData: function(results){
        console.log(results);
    },
}
```
### What to do with the information acquired
You will need to provide in the init object a processData function, this function can contain an AJAX call to a back end service that can do further processing with the information acquired.
```javascript
{
    processData: function(results){
        var xmlhttp = new XMLHttpRequest();
        // Send results
    }
}
```

#### When to send this information?
processData function can be called in two ways:
  1. Every certain period of time "processTime" in seconds (set to 0 if you don't want to processData like this)

    ```javascript
    {
        processTime: 15, //seconds
    }
    ```

  2. Using an action item. An action item is an element in your website that is the main point of interest, Action Items are the conversion point that you want to achieve in that specific page e.g. click on the buy button

    ```javascript
    {
        actionItem: {
            processOnAction: true,
            selector: '#myActionItem',
            event: 'click'
        },
    }
    ```

## Result Object
The results object contains detailed information of the requested information, the sections are

|Field   |Description   |
|---|---|
|userInfo   | Details of the    |
|time   | Time spent on the site in seconds  |
|Mouse Movement   | Array of X,Y values with timestamps  |
|contextChange   | Array with timestamp and type: if the user hid the page "hidden" or came back to it "visible"  |
|keyLogger   | Array with objects that collect the timestamp, character pressed and if the user pasted the infromation  |

```
{
    "userInfo": {
        "appCodeName": "Mozilla",
        "appName": "Netscape",
        "vendor": "Google Inc.",
        "platform": "MacIntel",
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36"
    },
    "time": {
        "totalTime": 27,
        "timeOnPage": 19
    },
    "clicks": {
        "clickCount": 4,
        "clickDetails": [
            {
                "timestamp": 1440001422756,
                "node": "<input type=\"text\" name=\"email\" placeholder=\"E-mail address\">",
                "x": 849,
                "y": 206
            },
            {
                "timestamp": 1440001438535,
                "node": "<div class=\"ui fluid large teal submit button\" id=\"myActionItem\">Login</div>",
                "x": 893,
                "y": 312
            },
            {
                "timestamp": 1440001454767,
                "node": "<input type=\"text\" name=\"email\" placeholder=\"E-mail address\">",
                "x": 853,
                "y": 198
            },
            {
                "timestamp": 1440001457409,
                "node": "<div class=\"ui fluid large teal submit button\" id=\"myActionItem\">Login</div>",
                "x": 880,
                "y": 321
            }
        ]
    },
    "mouseMovements": [],
    "contextChange": [
        {
            "timestamp": 1440001429041,
            "type": "hidden"
        },
        {
            "timestamp": 1440001436778,
            "type": "visible"
        },
        {
            "timestamp": 1440001445557,
            "type": "hidden"
        },
        {
            "timestamp": 1440001453543,
            "type": "visible"
        }
    ],
    "keyLogger": [
        {
            "timestamp": 1440001423813,
            "data": "a",
            "type": "keypress"
        },
        {
            "timestamp": 1440001423900,
            "data": "l",
            "type": "keypress"
        },
        {
            "timestamp": 1440001423985,
            "data": "a",
            "type": "keypress"
        },
        {
            "timestamp": 1440001424084,
            "data": "n",
            "type": "keypress"
        },
        {
            "timestamp": 1440001455500,
            "data": "@gmail.com",
            "type": "paste"
        }
    ]
}
```
