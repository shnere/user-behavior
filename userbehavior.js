var userLog = (function(){
    // Private variables
    var options = {},

    results = {
        time: {
            totalTime: 0,
            timeOnPage: 0,
        },
        clicks: {
            clickCount:0,
            clickDetails: []
        },
        mouseMovements: [],
        pastedText: {},
        contextChange: []

    };

    // Private Functions
    function start(){
        document.addEventListener('DOMContentLoaded', function() {
            // Countdown Timer
            window.setInterval(function(){
                if(document['visibilityState'] === 'visible'){
                    results.time.timeOnPage++;
                }
                results.time.totalTime++;
            },1000);

            // Click registration, increment click counter and save click time+position
            document.addEventListener('mouseup', function(){
                results.clicks.clickCount++;
                results.clicks.clickDetails.push({
                    timestamp: Date.now(),
                    node: event.target.outerHTML,
                    x: event.pageX,
                    y: event.pageY
                });
            });

            // Check tab change
            document.addEventListener('visibilitychange', function(){
                results.contextChange.push({
                    timestamp: Date.now(),
                    type: document['visibilityState']
                });
            });

            // Mouse movements
            document.addEventListener('mousemove', function(){
                results.mouseMovements.push({
                    timestamp: Date.now(),
                    x: event.pageX,
                    y: event.pageY
                });
            });

            document.addEventListener('paste', function(){
                return true;
            });
        });

    }

    function setOptions(opt){
        if (opt && typeof opt === "object") {
            options = opt;
            return true;
        }
        return false;
    }

    function processResults(){
        if(options.hasOwnProperty('processData')){
            return options.processData.call(undefined, results);
        }
        return false;
    }

    // Module pattern, only expose necessary methods
    return {
        start: start,
        setOptions: setOptions,
        results: results,
        processResults: processResults,
    };

})();
