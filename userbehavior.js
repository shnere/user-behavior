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
    // End results, what is shown to the user
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

    // Helper Functions
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

    /**
     * Merge defaults with options
     * @private
     * @param {Object} default settings
     * @param {Object} user options
     * @returns {Object} merged object
     */
    function getSettings(defaults, options){
        var option;
        for(option in options){
            if(options.hasOwnProperty(option)){
                defaults[option] = options[option];
            }
        }
        return defaults;
    }

    /**
     * Initialize the event listeners
     * @public
     * @param {Object} user options
     */
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

    /**
     * Calls provided function with results as parameter
     * @public
     */
    function processResults(){
        if(settings.hasOwnProperty('processData')){
            return settings.processData.call(undefined, results);
        }
        return false;
    }

    // Module pattern, only expose necessary methods
    return {
        init: init,
        processResults: processResults,
    };

})();
