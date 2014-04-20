function initialize() {

        /* ****************
         * GLOBAL VARIABLES
         * **************** */

         var vectorIDCounter = 0;
         var selectedVectorID = -1;
         var selectedFilter = "all";
         var vectors = [];
         var filteredVectors = [];

         var lastStrokeColor = "";
         var lastFillColor = "";
         var lastSelectionID = -1;
         var fillColorHolder = "";
         var strokeColorHolder = "";

         $( "#exportModal" ).easyModal();

        /* ***************************
         * CREATE A BUNCH OF FUNCTIONS
         * *************************** */

        function centerOnElement( element ){
          var bounds = new google.maps.LatLngBounds();
          var center = new google.maps.LatLng();

          try {
            center = element.getPosition();
          }
          catch ( err ){}
          try {
            var paths = element.getPaths();

            for ( point in paths ){
              bounds.extend( point );
            }
          }
          catch ( err ){}
          try {
            var bounds = element.getBounds();
            center = bounds.getCenter();
          }
          catch ( err ){}
          try {

            for ( var x = 0; x < element.getPath().getArray().length; x++ ){
              var pt = element.getPath().getArray()[x];
              bounds.extend( pt );
            }
            center = bounds.getCenter();

          }
          catch ( err ){}


          map.panTo( center );

        }


        function filterIncludesVector( vectorType ){
          filterTable = [
          { "filterName":"markers", "includes":[ "marker" ] },
          { "filterName":"lines",   "includes":[ "line" ] },
          { "filterName":"shapes",  "includes":[ "polygon", "rectangle", "circle" ] },
          { "filterName":"all",     "includes":[ "marker", "line", "polygon", "rectangle", "circle" ] }
          ]

          for ( filter in filterTable ) {
            if ( filterTable[filter].filterName == selectedFilter ) {
              for ( type in filterTable[filter].includes ){
                if ( filterTable[filter].includes[type] === vectorType ) {
                  return true;
                }
              }
            }
          }
          return false;
        }


        function getObjectByName( json, name ){
          for ( index in json ) {
            if ( json[index].name === name ){
              return json[index];
            }
          }
          return -1;
        }


        function getVectorTypeByID( id ){
          for ( index in vectors ) {
            if ( id === vectors[index].vectorID.toString() ){
              return vectors[index].vectorType;
            }
          }
          return -1;
        }


        function getVectorByID( id ) {
          for ( index in vectors ) {
            if ( id === vectors[index].vectorID.toString() ){
              return vectors[index].vector;
            }
          }
          return -1;
        }


        function getFilteredArrayPositionFromID( id ){
          for ( index in filteredVectors ){
            if ( id === filteredVectors[index].vectorID.toString() ){
              return index;
            }
          }
          return -1;
        }


        function getVectorIndexFromListID( id ){
          for ( index in vectors ){
            if ( id === vectors[index].vectorID.toString() ){
              return index;
            }
          }
          return -1;
        }


        function range(start, stop, step){
          var a=[start], b=start;
          while(b<stop){b+=step;a.push(b)}
          return a;
        };


        function filterVectors() {
          filteredVectors = [];

          for ( index in vectors ){
            vectorType = vectors[index].vectorType;

            if ( filterIncludesVector( vectorType ) ){
              var indess = this.index;
              var length = vectors.length;
              filteredVectors.push( vectors[index] );
              vectors[index].vector.setVisible( true );
            }
            else {
              vectors[index].vector.setVisible( false );
            }
          }
          return filteredVectors;
        }


        function callPropertiesDropdown() {

          var vectorType = getVectorTypeByID( selectedVectorID );

          $( ".propList" ).empty();

          $( ".propCloseBtn" ).click( function() {
            $( ".properties" ).slideUp();
            toolChangeUpdate();
          });

          $( ".propList" ).append( "<h1>Properties</h1>" );
          $( ".propList" ).append( "<div class='fillSelectAnchor'><input type='text' id='fillColor'/> Fill color</div>" );
          $( ".propList" ).append( "<div class='strokeSelectAnchor'><input type='text' id='strokeColor'/> Stroke color</div>" );


          $("#fillColor").spectrum({
              color: lastFillColor,
              change: function( color ) {
                var selectedVector = getVectorByID( selectedVectorID );
                lastFillColor = color.toHexString();
                selectedVector.setOptions( {
                  fillColor: color.toHexString()
                });
                updateVectorList();
              }
          });

          $("#strokeColor").spectrum({
              color: lastStrokeColor,
              change: function( color ) {
                var selectedVector = getVectorByID( selectedVectorID );
                lastStrokeColor = color.toHexString();
                selectedVector.setOptions( {
                  strokeColor: color.toHexString()
                });
                updateVectorList();
              }
          });

          if ( vectorType === "marker" ) {
            $("#fillColor").spectrum("disable");
            $("#strokeColor").spectrum("disable");
          }
          if ( vectorType === "line" ) {
            $("#fillColor").spectrum("disable");
          }

          $( ".properties" ).slideDown();
        }


        function toolChangeUpdate() {
          if ( selectedVectorID !== -1 ){
            lastSelectionID = -1;
            vectors[selectedVectorID].vector.setOptions( {
                strokeColor: lastStrokeColor,
                fillColor: lastFillColor,
                editable: false
            });
          }
          $( ".vectorBox" ).removeClass( "active" );
          $( ".properties" ).slideUp();
        }


        // A lot of things happen here. If this comment is 
        //   left vague, I apologize.
        function updateVectorList() {

          filteredVectors = filterVectors();

          $( ".vectorList" ).empty();

          for ( index in filteredVectors ) {
            var thisVector = filteredVectors[index].vector;

            var fColor = thisVector.fillColor;
            var sColor = thisVector.strokeColor;
            var opacity = thisVector.fillOpacity;
            var vectorID = filteredVectors[index].vectorID;

            if (opacity === 'undefined')
              { opacity = 0.5; }

            $( ".vectorList" ).append( "<div style='background-color: " 
                                        + fColor + "; opacity: " 
                                        + opacity + "' class='vectorBox' id='" 
                                        + vectorID + "'></div>" );

            $( "#" + vectorID ).append( "<div class='deleteBtn'></div>" );

            $( "#" + vectorID ).hover( 
              function() {
                if ( !$( this ).hasClass( "active" )){
                  var id = $( this ).attr( "id" );
                  var index = getFilteredArrayPositionFromID( id );

                  fillColorHolder = filteredVectors[index].vector.fillColor;
                  strokeColorHolder = filteredVectors[index].vector.strokeColor;

                  filteredVectors[index].vector.setOptions( {
                    strokeColor: "#FFF",
                    fillColor: "#EC0033"
                  });
                }
              }, function() {
                if ( !$( this ).hasClass( "active" )){
                  var id = $( this ).attr( "id" );
                  var index = getFilteredArrayPositionFromID( id );

                  filteredVectors[index].vector.setOptions( {
                    strokeColor: strokeColorHolder,
                    fillColor: fillColorHolder
                  });
                }
              });

            // Selecting an element from the right list
            $( "#" + vectorID ).click( function() {

              var id = $( this ).attr( "id" );
              var index = getFilteredArrayPositionFromID( id );

              $( ".vectorBox" ).removeClass( "active" );
              $( this ).addClass( "active" );

              selectedVectorID = index;

              if (lastSelectionID === -1){
                lastSelectionID = selectedVectorID;
                lastFillColor = fillColorHolder;
                lastStrokeColor = strokeColorHolder;
              }

              filteredVectors[lastSelectionID].vector.setOptions( {
                  strokeColor: lastStrokeColor,
                  fillColor: lastFillColor,
                  editable: false
              });

              filteredVectors[index].vector.setOptions( {
                strokeColor: "#FFF",
                fillColor: "#EC0033",
                editable: true
              });

              $( ".custom-button" ).removeClass( "active" );
              $( ".custom-button.edit" ).addClass( "active" );

              drawingManager.setDrawingMode(null);

              centerOnElement( filteredVectors[index].vector );

              lastFillColor = fillColorHolder;
              lastStrokeColor = strokeColorHolder;
              lastSelectionID = index;

              callPropertiesDropdown();

            });

            $( "#" + vectorID + " .deleteBtn" ).click( function() {
              var parent = $( this ).parent();
              var id = parent.attr( "id" );
              var index = getFilteredArrayPositionFromID( id );
              var aIndex = getVectorIndexFromListID( id );
              filteredVectors[index].vector.setMap(null);
              filteredVectors.splice(index, 1);
              vectors.splice(aIndex, 1);

              parent.remove();
            });

          } // END for x in vectors
        }


        function createCustomUI() {

          // CREATE HTML FOR CUSTOM UI
          var rightPanel = document.createElement('div');
          $( rightPanel ).addClass( "rightPanel" );

          var filters = document.createElement('div');
          $( filters ).addClass( "filters" );
          filters.innerHTML = '<strong> Filters </strong>';

          var vectorList = document.createElement('div');
          $( vectorList ).addClass( "vectorList" );

          var controlDiv = document.createElement('div');
          $( controlDiv ).addClass( "buttonHolder" );

          var properties = document.createElement('div');
          $( properties ).addClass( "properties" );

          var closeProperties = document.createElement('div');
          $( closeProperties ).addClass( "propCloseBtn" );
          $( closeProperties ).text( "Close" );
          closeProperties.style.cursor = 'pointer';

          var propList = document.createElement('div');
          $( propList ).addClass( "propList" );

          properties.appendChild(propList);
          properties.appendChild(closeProperties);
          rightPanel.appendChild(filters);
          rightPanel.appendChild(vectorList);


          var customButtons = [
            { "name":"edit",      "object": document.createElement('div'), "cssClass":"custom-button", "container":controlDiv }, 
            { "name":"marker",    "object": document.createElement('div'), "cssClass":"custom-button", "container":controlDiv },
            { "name":"polyline",  "object": document.createElement('div'), "cssClass":"custom-button", "container":controlDiv },
            { "name":"polygon",   "object": document.createElement('div'), "cssClass":"custom-button", "container":controlDiv },
            { "name":"rectangle", "object": document.createElement('div'), "cssClass":"custom-button", "container":controlDiv },
            { "name":"circle",    "object": document.createElement('div'), "cssClass":"custom-button", "container":controlDiv },
            { "name":"export",    "object": document.createElement('div'), "cssClass":"custom-button", "container":controlDiv },
            { "name":"import",    "object": document.createElement('div'), "cssClass":"custom-button", "container":controlDiv },
            { "name":"markers",   "object": document.createElement('div'), "cssClass":"filter-button", "container":filters }, 
            { "name":"lines",     "object": document.createElement('div'), "cssClass":"filter-button", "container":filters },
            { "name":"shapes",    "object": document.createElement('div'), "cssClass":"filter-button", "container":filters },
            { "name":"all",       "object": document.createElement('div'), "cssClass":"filter-button", "container":filters }
            ];


          // FILL HTML WITH CUSTOM BUTTONS
          for ( var obj in customButtons ) {
            var control = customButtons[obj].object;
            var name = customButtons[obj].name;
            var cssClass = customButtons[obj].cssClass;
            var container = customButtons[obj].container;
            control.className = cssClass + " " + name;
            control.style.cursor = 'pointer';
            container.appendChild(control);

            var controlText = document.createElement('div');
            controlText.innerHTML = '<strong>' + name + '</strong>';
            control.appendChild(controlText);
          }


          // BIND FUNCTIONS TO DRAWING BUTTONS
          // Select Edit 
          google.maps.event.addDomListener( getObjectByName( customButtons, "edit" ).object, 'click', function() {
            drawingManager.setDrawingMode( null );
            toolChangeUpdate();
          });
          // Select Marker
          google.maps.event.addDomListener( getObjectByName( customButtons, "marker" ).object, 'click', function() {
            drawingManager.setDrawingMode( google.maps.drawing.OverlayType.MARKER );
            toolChangeUpdate();
          });
          // Select Polyline
          google.maps.event.addDomListener( getObjectByName( customButtons, "polyline" ).object, 'click', function() {
            drawingManager.setDrawingMode( google.maps.drawing.OverlayType.POLYLINE );
            toolChangeUpdate();
          });
          // Select Polygon
          google.maps.event.addDomListener( getObjectByName( customButtons, "polygon" ).object, 'click', function() {
            drawingManager.setDrawingMode( google.maps.drawing.OverlayType.POLYGON );
            toolChangeUpdate();
          });
          // Select Rectangle
          google.maps.event.addDomListener( getObjectByName( customButtons, "rectangle" ).object, 'click', function() {
            drawingManager.setDrawingMode( google.maps.drawing.OverlayType.RECTANGLE );
            toolChangeUpdate();
          });
          // Select Circle
          google.maps.event.addDomListener( getObjectByName( customButtons, "circle" ).object, 'click', function() {
            drawingManager.setDrawingMode( google.maps.drawing.OverlayType.CIRCLE );
            toolChangeUpdate();
          });
          // Export JSON
          google.maps.event.addDomListener( getObjectByName( customButtons, "import" ).object, 'click', function( e ) {
            exportVectors( e );
            toolChangeUpdate();
          });
          // import JSON
          google.maps.event.addDomListener( getObjectByName( customButtons, "export" ).object, 'click', function( e ) {
            exportVectors( e );
            toolChangeUpdate();
          });


          // BIND FUNCTIONS TO FILTER BUTTONS
          // Filter Markers 
          google.maps.event.addDomListener( getObjectByName( customButtons, "markers" ).object, 'click', function() {
            selectedFilter = "markers";
            toolChangeUpdate();
            updateVectorList();
          });
          // Filter Lines 
          google.maps.event.addDomListener( getObjectByName( customButtons, "lines" ).object, 'click', function() {
            selectedFilter = "lines";
            toolChangeUpdate();
            updateVectorList();
          });
          // Filter Shapes 
          google.maps.event.addDomListener( getObjectByName( customButtons, "shapes" ).object, 'click', function() {
            selectedFilter = "shapes";
            toolChangeUpdate();
            updateVectorList();
          });
          // Filter All 
          google.maps.event.addDomListener( getObjectByName( customButtons, "all" ).object, 'click', function() {
            selectedFilter = "all";
            toolChangeUpdate();
            updateVectorList();
          });


          // BIND FUNCTIONS TO DRAWING COMPLETION EVENTS
          google.maps.event.addDomListener(drawingManager, 'markercomplete', function(marker) {
            updateVectorInfo(marker, "marker", vectorIDCounter++ );
          });
          google.maps.event.addDomListener(drawingManager, 'polylinecomplete', function(polyline) {
            updateVectorInfo(polyline, "line", vectorIDCounter++ );
          });
          google.maps.event.addDomListener(drawingManager, 'polygoncomplete', function(polygon) {
            updateVectorInfo(polygon, "polygon", vectorIDCounter++ );
          });
          google.maps.event.addDomListener(drawingManager, 'rectanglecomplete', function(rectangle) {
            updateVectorInfo(rectangle, "rectangle", vectorIDCounter++ );
          });
          google.maps.event.addDomListener(drawingManager, 'circlecomplete', function(circle) {
            updateVectorInfo(circle, "circle", vectorIDCounter++ );
          });


          // PUSH CUSTOM HTML TO MAP OVERLAY
          properties.index = 1;
          map.controls[google.maps.ControlPosition.TOP_RIGHT].push(properties);
          controlDiv.index = 2;
          map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlDiv);
          rightPanel.index = 4;
          map.controls[google.maps.ControlPosition.RIGHT].push(rightPanel);
        }


        function updateVectorInfo( newVector, vectorType, vectorID ) {
          vectors.push( { "vector": newVector, "vectorType": vectorType, "vectorID": vectorID } );
          updateVectorList();
        }


        function exportVectors( event ) {
          var vectorData = "map : [ \n";

          if ( vectors.markers.length !=0 ) {
            vectorData = vectorData + "\t markers : [ \n";
            for ( var i=0; i < vectors.markers.length; i++ ){
              vectorData = vectorData + "\t\t marker_" + i + " : [ \n";
              vectorData = vectorData + "\t\t position : " + vectors.markers[i].getPosition().toString() + " ]";
              if ( i != vectors.markers.length - 1 ) {
                vectorData = vectorData + ", \n";
              }
            }
            vectorData = vectorData + "\n\t ] \n";
          }
          if ( vectors.polylines.length !=0 ) {
            vectorData = vectorData + "polylines : [ ";
            for ( var i=0; i < vectors.markers.length; i++ ){
              vectorData = vectorData + "polyline_" + i + " : [ ";
              vectorData = vectorData + vectors.markers[i].getPosition().toString() + "\n";
            }
          }
          if ( vectors.polygons.length !=0 ) {
            vectorData = vectorData + "polygons : [ ";
            for ( var i=0; i < vectors.markers.length; i++ ){
              vectorData = vectorData + "polygon_" + i + " : [ ";
              vectorData = vectorData + vectors.markers[i].getPosition().toString() + "\n";
            }
          }
          if ( vectors.rectangles.length !=0 ) {
            vectorData = vectorData + "\t rectangles : [ \n";
            for ( var i=0; i < vectors.rectangles.length; i++ ){
              vectorData = vectorData + "\t\t rectangle" + i + " : [ \n";
              vectorData = vectorData + "\t\t bounds : " + vectors.rectangles[i].getBounds().toString() + " ]";
              if ( i != vectors.rectangles.length - 1 ) {
                vectorData = vectorData + ", \n";
              }
            }
            vectorData = vectorData + "\n\t ] \n";
          }
          if ( vectors.circles.length !=0 ) {
            vectorData = vectorData + "\t circles : [ \n";
            for ( var i=0; i < vectors.circles.length; i++ ){
              vectorData = vectorData + "circle_" + i + " : [ \n";
              vectorData = vectorData + "center : " + vectors.circles[i].getCenter().toString() + "," +
                                        "radius : " + vectors.circles[i].getRadius().toString() + "\n";
              vectorData = vectorData + "]]";
            }
          }
          vectorData = vectorData + "]";
          $( "#exportModal" ).trigger( 'openModal' );
        }


        function ImportVectors() {

        }

      /* *******************************
       * MAP STARTS GETTING PUT TOGETHER
       * ******************************* */

      /* Custom Reggie icon */
        var image = {
          url: 'images/reggie.png',
          size: new google.maps.Size(20, 27),
          origin: new google.maps.Point(0,0),
          anchor: new google.maps.Point(8, 27)
        };

      /* Center map on ISU campus */
        var mapOptions = {
          center: new google.maps.LatLng(40.508297, -88.991114),
          zoom: 17,
          disableDefaultUI: true
        };

      /* Initialize map */
        var map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);

        var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.MARKER,
          drawingControl: false,
          markerOptions: {
            icon: image,
            draggable: true
          },
          circleOptions: {
            fillColor: '#26537C',
            strokeColor: '#043A6B',
            fillOpacity: 0.5,
            strokeWeight: 2
          },
          polygonOptions: {
            fillColor: '#329D27',
            strokeColor: '#0D8800',
            fillOpacity: 0.5,
            strokeWeight: 2
          },
          polylineOptions: {
            strokeColor: '#280671'
          },
          rectangleOptions: {
            fillColor: '#472B83',
            strokeColor: '#280671',
            fillOpacity: 0.5,
            strokeWeight: 2
          }
        });

        drawingManager.setMap(map);

        createCustomUI();
      }

      google.maps.event.addDomListener(window, 'load', initialize);

      $( window ).load( function() {
        setTimeout( function() {

          $( ".custom-button.marker" ).addClass( "active" );
          $( ".custom-button" ).on( 'click', function(e) {
            e.preventDefault();
            $( ".custom-button" ).removeClass( "active" );
            $( this ).addClass( "active" );
          });
        }, 500);
      });