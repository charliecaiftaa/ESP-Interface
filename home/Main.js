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
        './LayerManager',
        './GlobeInterface',
        './Globe',
        './Controls',
        './HeatmapPanel'],
    function (WorldWind,
              LayerManager,
              GlobeInterface,
              Globe,
              Controls,
              HeatmapPanel) {
        "use strict";

        var globeID = "canvasOne";

        // new ESTWA({globe: globeID});

        var globe = new Globe({id: globeID});
        var controls = new Controls(globe);
        var gInterface = new GlobeInterface(globe);

        var heatmapPanel = new HeatmapPanel(globe, gInterface.globe.navigator, gInterface.globe.worldWindowController, controls);

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // var wwd = new WorldWind.WorldWindow("canvasOne");
        //
        // // Standard WorldWind layers
        // var layers = [
        //     {layer: new WorldWind.BMNGLayer(), enabled: true},
        //     {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
        //     {layer: new WorldWind.BingAerialLayer(null), enabled: false},
        //     {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: false},
        //     {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
        //     {layer: new WorldWind.CompassLayer(), enabled: true},
        //     {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
        //     {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        // ];
        //
        // for (var l = 0; l < layers.length; l++) {
        //     layers[l].layer.enabled = layers[l].enabled;
        //     wwd.addLayer(layers[l].layer);
        // }

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(globe);

        // Web Map Service information from NASA's Near Earth Observations WMS
        var serviceAddress = "http://cs.aworldbridgelabs.com:8080/geoserver/ows?service=WMS&request=GetCapabilities&version=1.1.1";
        // Named layer displaying Average Temperature data

        // var layerName = ["City_Smart:KEAGridMap_Layer","City_Smart:OHC_3","City_Smart:Overhead_Transformers","City_Smart:OHC_1","City_Smart:OHC_2","City_Smart:UGC_1","City_Smart:UGC_2","City_Smart:UGC_3","City_Smart:Wire_Transmission_Kodiak","City_Smart:Kodiak_Large_Transformers","City_Smart:Kodiak_Small_Transformers","City_Smart:Airport_Substation","City_Smart:K_Subs","City_Smart:Kodiak_Substations","City_Smart:FUSE_line_Kodiak","City_Smart:power","City_Smart:power2","City_Smart:Line_WMS_Kodiak_Trident","City_Smart:Polygon_WMS_Kodiak_Trident","City_Smart:MANHOLE_line","City_Smart:MANHOLE_polygon","City_Smart:water2c_FTAA","City_Smart:water3_FTAA","City_Smart:water1c_FTAA","City_Smart:water2_FTAA","City_Smart:water3c_FTAA","City_Smart:water1_FTAA","City_Smart:BaseRoad_Layer","City_Smart:Kodiak_Road_System","City_Smart:KEAParcelMap_Layer"];
        var layerName = [];

        var layers = globe.layers;
        // var layer2 = [];
        $(document).ready(function () {

            $(".switch_right").each(function (i) {

                layerName[i] = $(this).val();

            });
            // (layerName2).push(layer2);
            var strs = layerName+'';

            var res = strs.split(",");

            layerName = res.slice(0);
            // console.log(layerName);
        });


        // function splitString(stringToSplit, separator) {
        //     var arrayOfStrings = stringToSplit.(separator);
        //
        //     console.log('The original string is: "' + stringToSplit + '"');
        //     console.log('The separator is: "' + separator + '"');
        //     console.log('The array has ' + arrayOfStrings.length + ' elements: ' + arrayOfStrings.join(' / '));
        // }
        // var comma = ',';
        //
        // splitString(layerName, comma);



        var createLayer = function (xmlDom) {
            // Create a WmsCapabilities object from the XML DOM
            var wms = new WorldWind.WmsCapabilities(xmlDom);
            // Retrieve a WmsLayerCapabilities object by the desired layer name
            for (var n = 0; n < layerName.length; n++) {
                var NA = layerName[n];

                var wmsLayerCapabilities = wms.getNamedLayer(NA);
                // console.log(wmsLayerCapabilities);
                // Form a configuration object from the WmsLayerCapability object
                var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
                // Modify the configuration objects title property to a more user friendly title
                wmsConfig.title = NA;
                // Create the WMS Layer from the configuration object
                var wmsLayer = new WorldWind.WmsLayer(wmsConfig);
                // Add the layers to WorldWind and update the layer manager
                globe.addLayer(wmsLayer);
                // layerManager.synchronizeLayerList();
            }

        };

        $(function(){
            $('.switch_right').click(function(){
                var val = [];
                if ($('.switch_right').is(":checkbox:checked")) {

                    // console.log("true"+val);

                    $(':checkbox:checked').each(function () {
                        val = $(this).val();
                        var str = val+'';
                        val = str.split(",");

                        for (var a = 0; a < layers.length; a++) {
                            for(var i = 0; i < val.length; i++) {
                                if (layers[a].displayName === val[i]) {

                                    layers[a].enabled = true;

                                } else if (val.length < 1 ) {
                                    console.log("error");
                                }
                            }
                        }

                    });
                }

                if($('.switch_right').is(":not(:checked)")) {
                    // console.log("enable:false");
                    var layer = [];
                    $(":checkbox:not(:checked)").each(function (i) {
                        layer = $(this).val();
                        var str = layer+'';
                        layer = str.split(",");
                        // console.log(str);
                        // console.log(layer[i]);


                        // console.log(val);
                        // console.log("s"+layers[a].displayName);

                        for (var a = 0; a < layers.length; a++) {
                            for(var l = 0; l < layer.length; l++) {
                                if (layers[a].displayName === layer[l]) {

                                    layers[a].enabled = false;
                                    console.log("str: " + layers[a].displayName);
                                    // console.log(layers[a]);
                                }
                            }
                        }

                    });
                }
                // $.get(serviceAddress).done(createLayer).fail(logError);
            });
        });

        //


        // Called if an error occurs during WMS Capabilities document retrieval
        var logError = function (jqXhr, text, exception) {
            console.log("There was a failure retrieving the capabilities document: " + text + " exception: " + exception);
        };

        $.get(serviceAddress).done(createLayer).fail(logError);

        // console.log(layers);

        var layers = globe.layers;
    });
