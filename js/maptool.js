function initialize() {

        /* ****************
         * GLOBAL VARIABLES
         * **************** */

         var vectorIDCounter = 0;
         var selectedVectorID = -1;
         var selectedFilter = "all";
         var filteredVectors = [];

         var lastStrokeColor = "";
         var lastFillColor = "";
         var lastSelectionID = -1;
         var fillColorHolder = "";
         var strokeColorHolder = "";

         $( "#exportModal" ).easyModal();

        var vectors = new function() {
          this.markers = []; 
          this.polylines = []; 
          this.polygons = []; 
          this.rectangles = []; 
          this.circles  = [];
          this.active = [];

          // Get an array with all vector data
          this.getVectorArrays = function() {
            var arrays = [];
            arrays.push(this.polylines);
            arrays.push(this.polygons);
            arrays.push(this.rectangles);
            arrays.push(this.circles);

            return arrays;
          }

          // 
          this.getVectors = function() {
            var objects = [];

            if ( this.polylines.length !=0 ) { 
              for ( index in this.polylines) {
                objects.push( this.polylines[index] );
              }
            }
            if ( this.polygons.length !=0 ) { 
              for ( index in this.polygons) {
                objects.push( this.polygons[index] );
              }
            }
            if ( this.rectangles.length !=0 ) { 
              for ( index in this.rectangles) {
                objects.push( this.rectangles[index] );
              }
            }
            if ( this.circles.length !=0 ) { 
              for ( index in this.circles) {
                objects.push( this.circles[index] );
              }
            }

            return objects;
          }
        }

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
          }
          catch ( err ){}


          map.panTo( center );

        }


        function range(start, stop, step){
          var a=[start], b=start;
          while(b<stop){b+=step;a.push(b)}
          return a;
        };

        function setUpRightPanel() {
          var rightPanel = document.createElement('div');
          $( rightPanel ).addClass( "rightPanel" );

          var vectorList = document.createElement('div');
          $( vectorList ).addClass( "vectorList" );

          var filterButtons = [
            { "name":"markers", "object": document.createElement('div') }, 
            { "name":"lines",   "object": document.createElement('div') },
            { "name":"shapes",  "object": document.createElement('div') },
            { "name":"all",     "object": document.createElement('div') }
            ];

          var filters = document.createElement('div');
          $( filters ).addClass( "filters" );
          filters.innerHTML = '<strong> Filters </strong>';

          for ( var obj in filterButtons ) {
            var control = filterButtons[obj].object;
            var name = filterButtons[obj].name;
            control.className = "filter-button " + name;
            control.style.cursor = 'pointer';
            filters.appendChild(control);

            var controlText = document.createElement('div');
            controlText.innerHTML = '<strong>' + name + '</strong>';
            control.appendChild(controlText);
          }

          // Filter Markers 
          google.maps.event.addDomListener( filterButtons[0].object, 'click', function() {
            selectedFilter = "markers";
            toolChangeUpdate();
            updateVectorList();
          });
          // Filter Lines 
          google.maps.event.addDomListener( filterButtons[1].object, 'click', function() {
            selectedFilter = "lines";
            toolChangeUpdate();
            updateVectorList();
          });
          // Filter Shapes 
          google.maps.event.addDomListener( filterButtons[2].object, 'click', function() {
            selectedFilter = "shapes";
            toolChangeUpdate();
            updateVectorList();
          });
          // Filter All 
          google.maps.event.addDomListener( filterButtons[3].object, 'click', function() {
            selectedFilter = "all";
            toolChangeUpdate();
            updateVectorList();
          });

          rightPanel.appendChild(filters);
          rightPanel.appendChild(vectorList);

          rightPanel.index = 4;
          map.controls[google.maps.ControlPosition.RIGHT].push(rightPanel);
        }

        function toolChangeUpdate() {
          if ( selectedVectorID !== -1 ){
            lastSelectionID = -1;
            vectors.active[selectedVectorID][0].setOptions( {
                strokeColor: lastFillColor,
                fillColor: lastStrokeColor,
                editable: false
            });
          }
          $( ".vectorBox" ).removeClass( "active" );
        }

        // A lot of things happen here. If this comment is 
        //   left vague, I apologize.
        function updateVectorList() {

          filteredVectors = [];

          $( ".vectorList" ).empty();

          if ( selectedFilter !== "all" ){
            for ( id in vectors.active ){
              var vectorType = vectors.active[id][1];
              var vector = vectors.active[id][0];

              if ( vectorType === selectedFilter ){
                filteredVectors.push( vectors.active[id] );
                vector.setVisible( true );
              }
              else {
                vector.setVisible( false );
              }
            }
          }
          else {
            filteredVectors = vectors.active;
            for ( id in vectors.active ){
              var vector = vectors.active[id][0];
              vector.setVisible( true );
            }
          }

          for ( vector in filteredVectors ) {
            var fColor = filteredVectors[vector][0].fillColor;
            var sColor = filteredVectors[vector][0].strokeColor;
            var opacity = filteredVectors[vector][0].fillOpacity;
            var vectorID = filteredVectors[vector][2];
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

                  fillColorHolder = filteredVectors[index][0].fillColor;
                  strokeColorHolder = filteredVectors[index][0].strokeColor;

                  filteredVectors[index][0].setOptions( {
                    strokeColor: "#FFF",
                    fillColor: "#EC0033"
                  });
                }
              }, function() {
                if ( !$( this ).hasClass( "active" )){
                  var id = $( this ).attr( "id" );
                  var index = getFilteredArrayPositionFromID( id );

                  filteredVectors[index][0].setOptions( {
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

              filteredVectors[lastSelectionID][0].setOptions( {
                  strokeColor: lastFillColor,
                  fillColor: lastStrokeColor,
                  editable: false
              });

              filteredVectors[index][0].setOptions( {
                strokeColor: "#FFF",
                fillColor: "#EC0033",
                editable: true
              });

              $( ".custom-button" ).removeClass( "active" );
              $( ".custom-button.edit" ).addClass( "active" );

              drawingManager.setDrawingMode(null);

              centerOnElement( filteredVectors[index][0]);

              lastFillColor = fillColorHolder;
              lastStrokeColor = strokeColorHolder;
              lastSelectionID = index;
            });

            $( "#" + vectorID + " .deleteBtn" ).click( function() {
              var parent = $( this ).parent();
              var id = parent.attr( "id" );
              var index = getFilteredArrayPositionFromID( id );
              var aIndex = getActiveArrayPositionFromID( id );
              var varA = filteredVectors[index][0];
              filteredVectors[index][0].setMap(null);
              filteredVectors.splice(index, 1);
              vectors.active.splice(aIndex, 1);
              // parent.nextUntil( "div:not(.vectorBox)" ).each( function() {
              //   var thisID = $( this ).attr( "id" );
              //   $( this ).attr( "id", thisID -1 );
              // });
              parent.remove();
            });

          } // END for x in vectors
        }

        function getFilteredArrayPositionFromID( id ){
          for ( index in filteredVectors ){
            if ( id === filteredVectors[index][2].toString() ){
              return index;
            }
          }
          return -1;
        }

        function getActiveArrayPositionFromID( id ){
          for ( index in vectors.active ){
            if ( id === vectors.active[index][2].toString() ){
              return index;
            }
          }
          return -1;
        }

        function setUpTools() {

          // Generate custom buttons

          var customButtons = [
            { "name":"edit",      "object": document.createElement('div') }, 
            { "name":"marker",    "object": document.createElement('div') },
            { "name":"polyline",  "object": document.createElement('div') },
            { "name":"polygon",   "object": document.createElement('div') },
            { "name":"rectangle", "object": document.createElement('div') },
            { "name":"circle",    "object": document.createElement('div') },
            { "name":"export",    "object": document.createElement('div') },
            { "name":"import",    "object": document.createElement('div') }
            ];

          var controlDiv = document.createElement('div');
          $( controlDiv ).addClass( "buttonHolder" );

          for ( var obj in customButtons ) {
            var control = customButtons[obj].object;
            var name = customButtons[obj].name;
            control.className = "custom-button " + name;
            control.style.cursor = 'pointer';
            controlDiv.appendChild(control);

            var controlText = document.createElement('div');
            controlText.innerHTML = '<strong>' + name + '</strong>';
            control.appendChild(controlText);
          }

          // Select Edit 
          google.maps.event.addDomListener( customButtons[0].object, 'click', function() {
            drawingManager.setDrawingMode( null );
            toolChangeUpdate();
          });
          // Select Marker
          google.maps.event.addDomListener( customButtons[1].object, 'click', function() {
            drawingManager.setDrawingMode( google.maps.drawing.OverlayType.MARKER );
            toolChangeUpdate();
          });
          // Select Polyline
          google.maps.event.addDomListener( customButtons[2].object, 'click', function() {
            drawingManager.setDrawingMode( google.maps.drawing.OverlayType.POLYLINE );
            toolChangeUpdate();
          });
          // Select Polygon
          google.maps.event.addDomListener( customButtons[3].object, 'click', function() {
            drawingManager.setDrawingMode( google.maps.drawing.OverlayType.POLYGON );
            toolChangeUpdate();
          });
          // Select Rectangle
          google.maps.event.addDomListener( customButtons[4].object, 'click', function() {
            drawingManager.setDrawingMode( google.maps.drawing.OverlayType.RECTANGLE );
            toolChangeUpdate();
          });
          // Select Circle
          google.maps.event.addDomListener( customButtons[5].object, 'click', function() {
            drawingManager.setDrawingMode( google.maps.drawing.OverlayType.CIRCLE );
            toolChangeUpdate();
          });
          // Export JSON
          google.maps.event.addDomListener( customButtons[6].object, 'click', function( e ) {
            exportVectors( e );
            toolChangeUpdate();
          });
          // import JSON
          google.maps.event.addDomListener( customButtons[7].object, 'click', function( e ) {
            exportVectors( e );
            toolChangeUpdate();
          });

          // Update path data when an element is done being drawn.
          google.maps.event.addDomListener(drawingManager, 'markercomplete', function(marker) {
            updateVectorInfo(marker, "markers", vectorIDCounter++ );
          });
          google.maps.event.addDomListener(drawingManager, 'polylinecomplete', function(polyline) {
            updateVectorInfo(polyline, "lines", vectorIDCounter++ );
          });
          google.maps.event.addDomListener(drawingManager, 'polygoncomplete', function(polygon) {
            updateVectorInfo(polygon, "shapes", vectorIDCounter++ );
          });
          google.maps.event.addDomListener(drawingManager, 'rectanglecomplete', function(rectangle) {
            updateVectorInfo(rectangle, "shapes", vectorIDCounter++ );
          });
          google.maps.event.addDomListener(drawingManager, 'circlecomplete', function(circle) {
            updateVectorInfo(circle, "shapes", vectorIDCounter++ );
          });

          var toolOptions = document.createElement('div');
          $( toolOptions ).addClass( "toolOptions" );

          // TODO



          toolOptions.index = 1;
          map.controls[google.maps.ControlPosition.TOP_RIGHT].push(toolOptions);
          controlDiv.index = 2;
          map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlDiv);
        }


        function updateVectorInfo( newVector, vectorType, vectorID ) {
  
          if (vectorType === "marker")
            {vectors.markers.push(newVector);}
          if (vectorType === "polyline")
            {vectors.polylines.push(newVector);}
          if (vectorType === "polygon")
            {vectors.polygons.push(newVector);}
          if (vectorType === "rectangle")
            {vectors.rectangles.push(newVector);}
          if (vectorType === "circle")
            {vectors.circles.push(newVector);}

          vectors.active.push( [ newVector, vectorType, vectorID ] );
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

        setUpTools();
        setUpRightPanel();

      }

      google.maps.event.addDomListener(window, 'load', initialize);
