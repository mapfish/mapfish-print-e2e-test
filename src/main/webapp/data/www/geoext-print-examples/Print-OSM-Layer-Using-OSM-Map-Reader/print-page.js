/*
 * Copyright (c) 2008-2014 The Open Source Geospatial Foundation
 * 
 * Published under the BSD license.
 * See https://github.com/geoext/geoext2/blob/master/license.txt for the full
 * text of the license.
 */

/** api: example[print-page]
 *  Print Your Map
 *  --------------
 *  Print the visible extent of a MapPanel with PrintPage and MapfishPrintProvider.
 */

Ext.require([
    'Ext.layout.container.Border',
    'Ext.form.field.Checkbox',
    'GeoExt.data.MapfishPrintProvider',
    'GeoExt.data.PrintPage',
    'GeoExt.panel.Map',
    'GeoExt.panel.Legend',
    'GeoExt.container.WmsLegend',
    'GeoExt.container.UrlLegend',
    'GeoExt.container.VectorLegend'
]);

var mapPanel, printPage, printProvider;
var matrixIds = new Array(31);
for (var i=0; i<matrixIds.length; ++i) {
    matrixIds[i] = "EPSG:900913:" + i;
}

Ext.application({
    name: 'PrintPage and PrintProvider - GeoExt2',
    launch: function() {
    // The MapfishPrintProvider that connects us to the print service
    printProvider = Ext.create('GeoExt.data.MapfishPrintProvider', {
        method: "POST", // "POST" recommended for production use
        capabilities: printCapabilities, // from the info.json script in the html
        customParams: {
            mapTitle: "Printing Demo",
            comment: "This is a simple map printed from GeoExt."
        }
    });
    // Our print page. Tells the printProvider about the scale and center of
    // our page.
    printPage = Ext.create('GeoExt.data.PrintPage', {
        printProvider: printProvider
    });
    // If tile matrix identifiers differ from zoom levels (0, 1, 2, ...)
    // then they must be explicitly provided.

    // The map we want to print
    mapPanel = Ext.create('GeoExt.panel.Map', {
        region: "center",
        layers: [
             new OpenLayers.Layer.OSM(),
            new OpenLayers.Layer.WMS(
                Env.layers.nyRoads.name,
                Env.wmsUrl,
                { layers: [Env.layers.nyRoads.id], format:"image/png", TRANSPARENT:"true", STYLES:Env.layers.nyRoads.style },
                { singleTile: true, isBaseLayer: false }
            )
        ],
        map: {
               projection: "EPSG:900913"
        },
        center: [-8236566.427097, 4976131.070529],
        zoom: 12
    });
    // The legend to optionally include on the printout
    var legendPanel = Ext.create('GeoExt.panel.Legend',{
        region: "west",
        width: 150,
        bodyStyle: "padding:5px",
        layerStore: mapPanel.layers
    });
    
    var includeLegend; // controlled by the "Include legend?" checkbox
     
    // The main panel
    Ext.create('Ext.Panel', {
        renderTo: "content",
        layout: "border",
        width: 780,
        height: 330,
        items: [mapPanel, legendPanel],
        bbar: ["->", {
            text: "Print",
            handler: function() {
                // convenient way to fit the print page to the visible map area
                printPage.fit(mapPanel, true);
                // print the page, optionally including the legend
                printProvider.print(mapPanel, printPage, includeLegend && {legend: legendPanel});
            }
        }, {
            xtype: "checkbox",
            boxLabel: "Include legend?",
            handler: function() {
                includeLegend = this.checked;
            }
        }]
    });
    }
});