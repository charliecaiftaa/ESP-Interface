/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Standard WorldWind layers
        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialLayer(null), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: false},
            {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);

        // Web Map Service information from NASA's Near Earth Observations WMS
        var serviceAddress = "http://cs.aworldbridgelabs.com:8080/geoserver/ows?service=WMS&request=GetCapabilities&version=1.1.1";
        // Named layer displaying Average Temperature data
        // var layerName = ["Yellow Polygon","City_Smart:KEAParcelMap_Layer"];
        var layerName = ["City_Smart:Circuit_Direction","City_Smart:BaseRoad_Layer"];
        var Title = ["EXAMPLE0","EXAMPLE1"];

        // console.log("layerName: " + layerName);
        // console.log("title: " + Title);
    //
            // console.log("layerN: " + layerN);
                var createLayer = function (xmlDom) {

                    // Create a WmsCapabilities object from the XML DOM
                    var wms = new WorldWind.WmsCapabilities(xmlDom);
                    // Retrieve a WmsLayerCapabilities object by the desired layer name
                    for (var n = 0; n < layerName.length; n++) {
                        var NA = layerName[n];
                        var T = Title[n];
                        var wmsLayerCapabilities = wms.getNamedLayer(NA);
                        console.log(n + ": " + NA);
                        // Form a configuration object from the WmsLayerCapability object
                        var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
                        // Modify the configuration objects title property to a more user friendly title
                        wmsConfig.title = T;
                        console.log(n + ": " + T);
                        // Create the WMS Layer from the configuration object
                        var wmsLayer = new WorldWind.WmsLayer(wmsConfig);
                        console.log(wmsConfig);
                        console.log(wmsLayer);

                        // Add the layers to WorldWind and update the layer manager
                        wwd.addLayer(wmsLayer);
                        layerManager.synchronizeLayerList();
                    }

                };


        // // Called asynchronously to parse and create the WMS layer
        // var createLayer = function (xmlDom) {
        //     // Create a WmsCapabilities object from the XML DOM
        //     var wms = new WorldWind.WmsCapabilities(xmlDom);
        //     // Retrieve a WmsLayerCapabilities object by the desired layer name
        //     var wmsLayerCapabilities = wms.getNamedLayer(layerName[1]);
        //     console.log(layerName[0]);
        //     // Form a configuration object from the WmsLayerCapability object
        //     var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
        //     // Modify the configuration objects title property to a more user friendly title
        //     wmsConfig.title = Title[1];
        //      // Create the WMS Layer from the configuration object
        //     var wmsLayer = new WorldWind.WmsLayer(wmsConfig);
        //
        //     // Add the layers to WorldWind and update the layer manager
        //     wwd.addLayer(wmsLayer);
        //     layerManager.synchronizeLayerList();
        // };

        // Called if an error occurs during WMS Capabilities document retrieval
        var logError = function (jqXhr, text, exception) {
            console.log("There was a failure retrieving the capabilities document: " + text + " exception: " + exception);
        };

        $.get(serviceAddress).done(createLayer).fail(logError);



    });
