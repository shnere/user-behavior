var userLog = (function(){
    // Private variables
    var defaults = {
        timeCalculations: true,
        clickCount: true,
        clickDetails: true,
        mouseMovement: true,
        context: true,

        processData: function(results){
            console.log(results);
        }
    },

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

    },

    support = !!document.querySelector && !!document.addEventListener,
    settings;

    // Private Functions
    var helperActions = {
        timer: function(){
            window.setInterval(function(){
                if(document['visibilityState'] === 'visible'){
                    results.time.timeOnPage++;
                }
                results.time.totalTime++;
            },1000);
        },
        mouseMovement: function(){
            document.addEventListener('mousemove', function(){
                results.mouseMovements.push({
                    timestamp: Date.now(),
                    x: event.pageX,
                    y: event.pageY
                });
            });
        },
        contextChange: function(){
            document.addEventListener('visibilitychange', function(){
                results.contextChange.push({
                    timestamp: Date.now(),
                    type: document['visibilityState']
                });
            });
        },

    }


    function init(options){
        if(!support) return;

        // Extend default options
        if (options && typeof options === "object") {
            settings = getSettings(defaults, options);
        }

        document.addEventListener('DOMContentLoaded', function() {
            // Countdown Timer
            if(settings.timeCalculations){
                helperActions.timer();
            }

            // Click registration, increment click counter and save click time+position
            if(settings.clickCount || settings.clickDetails){
                document.addEventListener('mouseup', function(){
                    if(settings.clickCount){
                        results.clicks.clickCount++;
                    }
                    if(settings.clickDetails){
                        results.clicks.clickDetails.push({
                            timestamp: Date.now(),
                            node: event.target.outerHTML,
                            x: event.pageX,
                            y: event.pageY
                        });
                    }
                });
            }

            // Mouse movements
            if(settings.mouseMovement){
                helperActions.mouseMovement();
            }

            // Check context change
            if(settings.context){
                helperActions.contextChange();
            }

            document.addEventListener('paste', function(){
                return true;
            });
        });

    }

    function getSettings(defaults, options){
        var option;
        for(option in options){
            if(options.hasOwnProperty(option)){
                defaults[option] = options[option];
            }
        }
        return defaults;
    }

    function setOptions(opt){
        if (opt && typeof opt === "object") {
            options = opt;
            return true;
        }
        return false;
    }

    function processResults(){
        if(settings.hasOwnProperty('processData')){
            return settings.processData.call(undefined, results);
        }
        return false;
    }

    // Module pattern, only expose necessary methods
    return {
        init: init,
        setOptions: setOptions,
        results: results,
        processResults: processResults,
    };

})();
