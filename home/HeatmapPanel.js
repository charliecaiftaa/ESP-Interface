// define(['./Transformation',
//     '../csvToGrid/Converter',
//     '../../thirdparty/simpleheat'], function (Transformation, Converter) {

define(['./Transformation',
    './simpleheat'], function (Transformation) {

    var HeatmapPanel = function (wwd, navigator, controller, controls) {
    // var HeatmapPanel = function (wwd, controls) {

        this.wwd = wwd;
        this.navigator = navigator;
        this.controller = controller;
        this.controls = controls;
        this.myHeatmap = {};
        this.heats = {};
        var self = this;
        this.index = 0;


        this.fileTypeHeatmap = 1;
        $("#fileTypeHeatmap").change(function () {
            var val = $("#fileTypeHeatmap").val();
            if (val == "0") {
                $("#csv-heatmap").show();
                $("#HeatmapTxtArea").hide();
                self.fileTypeHeatmap = 0;
            } else if (val == "1") {
                $("#csv-heatmap").hide();
                $("#HeatmapTxtArea").show();
                self.fileTypeHeatmap = 1;
            }

        });
        $("#loadHeatmapBtn").on("click", function () {
            alert("SSS");
            self.requestData();
        })

    };

    HeatmapPanel.prototype.requestData = function () {

        $("#loading").show();
        var self = this;

        $.ajax({
            url: 'http://localhost:8091/heatmap',
            type: 'GET',
            dataType: 'json',
            async: false,
            // data: querystr,
            success: function (resp) {
                console.log(resp);
                var heatMapData = [];
                var intensities = [];
                for (var i = 0; i < resp.length; i++) {

                    heatMapData[i] = [];
                    heatMapData[i][1] = resp[i].LatiDecimal;
                    heatMapData[i][0] = resp[i].LongDecimal;
                    intensities[i] = 1;

                    if (i === resp.length - 1) {
                        $("#loading").hide();
                        // alert("Success");
                        self.addHeatmap(heatMapData, intensities);
                    }

                }
            }
        });
    };

    HeatmapPanel.prototype.addHeatmap = function (points, intensities) {

        var self = this;
        var wwd = this.wwd;

        var canvas = document.createElement("canvas");

        var c = wwd.canvas;
        canvas.width = c.width;
        canvas.height = c.height;
        var heat = simpleheat(canvas);


        heat.points = points;
        heat.intensities = intensities;
        heat.canvas = canvas;
        heat.max(5);

        console.log(heat.points);

        var heatmap = new WorldWind.SurfaceImage(new WorldWind.Sector(-90, 90, -180, 180),
            new WorldWind.ImageSource(canvas));


        var heatmapLayer = new WorldWind.RenderableLayer();


        this.heats[this.index] = heat;

        heatmapLayer.index = this.index++;
        heat.index = this.index;

        this.myHeatmap[this.index] = heatmapLayer;
        heatmapLayer.displayName = "Heatmap";
        heatmapLayer.enabled = true;
        heatmapLayer.addRenderable(heatmap);
        wwd.addLayer(heatmapLayer);

        console.log(wwd.layers);

        var navigator = this.navigator;
        var controller = this.controller;

        wwd.redraw();

        self.createInterface(wwd);

        controller.handleWheelEvent = function (event) {

            // this.worldWindow.navigator.getAsLookAt(this.worldWindow.globe, this.lookAt);

            var normalizedDelta;
            if (event.deltaMode == WheelEvent.DOM_DELTA_PIXEL) {
                normalizedDelta = event.deltaY;
            } else if (event.deltaMode == WheelEvent.DOM_DELTA_LINE) {
                normalizedDelta = event.deltaY * 40;
            } else if (event.deltaMode == WheelEvent.DOM_DELTA_PAGE) {
                normalizedDelta = event.deltaY * 400;
            }
            // var scale = 1 + (normalizedDelta * 2 / 1000);
            var scale = 1 + (normalizedDelta / 1000);

            // Apply the scale to this navigator's properties.
            // this.lookAt.range *= scale;
            navigator.range *= scale;
            this.applyLimits();
            // this.worldWindow.navigator.setAsLookAt(this.worldWindow.globe, this.lookAt);
            this.wwd.redraw();
            self.drawHeatmap(navigator.range);
        };

        this.controls.heatmap = this.drawHeatmap.bind(this);

        wwd.goTo(new WorldWind.Position(points[0][1], points[0][0]), function () {
            console.log(navigator.range);
            self.drawHeatmap(navigator.range);
        });
    };

    HeatmapPanel.prototype.drawHeatmap = function (range) {
        var wwd = this.wwd;
        var heats = this.heats;
        var canvas = wwd.canvas;

        for (var key in heats) {
            if (heats[key].canvas.height != canvas.height || heats[key].canvas.width != canvas.width) {
                heats[key].canvas.height = canvas.height;
                heats[key].canvas.width = canvas.width;
            }
        }
        var center = wwd.pickTerrain(new WorldWind.Vec2(canvas.width / 2, canvas.height / 2));

        if (!center.objects || !center.objects[0])
            return;
        center = center.objects[0].position;
        if (range > 10000000) {
            range = 10000000;
        }

        var l = range / Math.cos(Math.PI / 8);
        var base = Math.sqrt(Math.pow(l, 2) - Math.pow(range, 2));

        base = base / 100000;

        var minLat = center.latitude - base;
        var maxLat = center.latitude + base;
        var minLng = center.longitude - base;
        var maxLng = center.longitude + base;


        var ratio = canvas.width / canvas.height;

        while (ratio > ((maxLng - minLng) / (maxLat - minLat))) {

            maxLng += 0.1;
            minLng -= 0.1;
        }

        while (ratio < ((maxLng - minLng) / (maxLat - minLat))) {
            maxLat += 0.1;
            minLat -= 0.1;
        }

        var bufferLng = (maxLng - minLng) / 5;
        var bufferLat = (maxLat - minLat) / 5;

        var minLat = minLat - bufferLat,
            minLng = minLng - bufferLng,
            maxLat = maxLat + bufferLat,
            maxLng = maxLng + bufferLng;


        var bbox = {
            minLat: minLat,
            minLng: minLng,
            maxLat: maxLat,
            maxLng: maxLng
        };

        for (var key in this.myHeatmap) {
            var layerH = this.myHeatmap[key];
            layerH.renderables[0].sector.minLatitude = minLat;
            layerH.renderables[0].sector.minLongitude = minLng;
            layerH.renderables[0].sector.maxLatitude = maxLat;
            layerH.renderables[0].sector.maxLongitude = maxLng;
        }

        for (key in heats) {
            var heat = heats[key];

            var t = new Transformation();
            t.setPoints([[0, canvas.height], [0, 0], [canvas.width, 0], [canvas.width, canvas.height]],
                [[bbox.minLng, bbox.minLat], [bbox.minLng, bbox.maxLat], [bbox.maxLng, bbox.maxLat], [bbox.maxLng, bbox.minLat]]);

            heat.clear();
            heat.points.forEach(function (p, i) {
                if (bbox.minLat <= p[1] && p[1] <= bbox.maxLat && bbox.minLng <= p[0] && p[0] <= bbox.maxLng) {
                    var out = t.transform(p);
                    var x = out[0];
                    var y = out[1];
                    if (heat.intensities[i]) {
                        var int = heat.intensities[i];
                    } else {
                        int = 80;
                    }
                    heat.add([x, y, int]);
                }

            });
            heat.draw(0);
        }


        for (key in this.myHeatmap) {
            layerH = this.myHeatmap[key];
            layerH.renderables[0].imageSourceWasUpdated = true;
        }

    };

    HeatmapPanel.prototype.createInterface = function (wwd) {
        $("#HeatmapList").html("");
        var self = this;
        for (var key in self.myHeatmap) {
            var name = self.myHeatmap[key].displayName + " " + key;
            var myDiv = $("<div key=" + key + " class='listJson'>&#10060;" + name + "</div>");
            $("#HeatmapList").append(myDiv);
            myDiv.on('click', function () {
                var myKey = $(this).attr("key");
                wwd.removeLayer(self.myHeatmap[myKey]);
                wwd.redraw();
                $(this).remove();
                delete(self.myHeatmap[myKey]);
                delete(self.heats[myKey]);
            })

        }
    };

    return HeatmapPanel;
})
;
