var gInterface; //testing variables
var appConstructor;
var tourStarted = 0;

define([
        './GlobeInterface',
        './Globe',
        './Controls',
        './HeatmapPanel'
    ],

    function (
        GlobeInterface,
        Globe,
        Controls,
        HeatmapPanel) {

        var ESTWA;
        ESTWA = function (options) {

            var globe = new Globe({id: options.globe});
            var controls = new Controls(globe);
            // console.log(globe.worldWindowController);
            gInterface = new GlobeInterface(globe);
            // console.log(gInterface.globe.worldWindowController);
            // console.log(gInterface.globe);

            this.HeatmapPanel = new HeatmapPanel(globe, gInterface.globe.navigator, gInterface.globe.worldWindowController, controls);
            // this.HeatmapPanel = new HeatmapPanel(globe, controls);
        };

        return ESTWA;

    }
);

