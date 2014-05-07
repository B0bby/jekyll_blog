/**
 * A menu that lets a user delete a selected vertex of a path.
 * @constructor
 */
function DeleteMenu() {
  this.div_ = document.createElement('div');
  this.div_.className = 'delete-menu';
  this.div_.innerHTML = 'Delete';

  var menu = this;
  google.maps.event.addDomListener(this.div_, 'click', function() {
    menu.removeVertex();
  });
}
DeleteMenu.prototype = new google.maps.OverlayView();

DeleteMenu.prototype.onAdd = function() {
  var deleteMenu = this;
  var map = this.getMap();
  this.getPanes().floatPane.appendChild(this.div_);

  // mousedown anywhere on the map except on the menu div will close the
  // menu.
  this.divListener_ = google.maps.event.addDomListener(map.getDiv(), 'mousedown', function(e) {
    if (e.target != deleteMenu.div_) {
      deleteMenu.close();
    }
  }, true);
};

DeleteMenu.prototype.onRemove = function() {
  google.maps.event.removeListener(this.divListener_);
  this.div_.parentNode.removeChild(this.div_);

  // clean up
  this.set('position');
  this.set('path');
  this.set('vertex');
};

DeleteMenu.prototype.close = function() {
  this.setMap(null);
};

DeleteMenu.prototype.draw = function() {
  var position = this.get('position');
  var projection = this.get('projection');
  var vertex = this.get('vertex');

  if (!position || !projection) {
    return;
  }

  var point = projection.fromLatLngToDivPixel(position);
  this.div_.style.top = point.y + 'px';
  this.div_.style.left = point.x + 'px';
};

/**
 * Opens the menu at a vertex of a given path.
 */
DeleteMenu.prototype.open = function(map, path, vertex) {
  this.set('position', path.getAt(vertex));
  this.set('path', path);
  this.set('vertex', vertex);
  this.setMap(map);
  this.draw();
};

/**
 * Deletes the vertex from the path.
 */
DeleteMenu.prototype.removeVertex = function() {
  var path = this.get('path');
  var vertex = this.get('vertex');

  if (!path || vertex == undefined) {
    this.close();
    return;
  }

  path.removeAt(vertex);
  this.close();
};

function initialize() {

        /* ****************
         * GLOBAL VARIABLES
         * **************** */
         var uploadFile = "";
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
              color: vectors[selectedVectorID].fillColor,
              change: function( color ) {
                var selectedVector = getVectorByID( selectedVectorID );
                vectors[selectedVectorID].fillColor = color.toHexString();
                selectedVector.setOptions( {
                  fillColor: color.toHexString()
                });
                updateVectorList();
              }
          });

          $("#strokeColor").spectrum({
              color: vectors[selectedVectorID].strokeColor,
              change: function( color ) {
                var selectedVector = getVectorByID( selectedVectorID );
                vectors[selectedVectorID].strokeColor = color.toHexString();
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
                strokeColor: vectors[selectedVectorID].strokeColor,
                fillColor: vectors[selectedVectorID].fillColor,
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

            var fColor = filteredVectors[index].fillColor;
            var sColor = filteredVectors[index].strokeColor;
            var opacity = filteredVectors[index].opacity;
            var vectorID = filteredVectors[index].vectorID;
            var vectorName = filteredVectors[index].name;

            $( ".vectorList" ).append( "<div class='vectorBox' ><div class='vectorID' style='color: " 
                                        + sColor + "'>" 
                                        + vectorName + "</div><div class='bg' style='background-color: " 
                                        + fColor + "; opacity: " 
                                        + opacity + "' id='" 
                                        + vectorID + "'></div></div>" );

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
              $( this ).parent().addClass( "active" );

              selectedVectorID = index;

              if (lastSelectionID === -1){
                lastSelectionID = selectedVectorID;
              }

              filteredVectors[lastSelectionID].vector.setOptions( {
                  strokeColor: filteredVectors[lastSelectionID].strokeColor,
                  fillColor: filteredVectors[lastSelectionID].fillColor,
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

              lastSelectionID = index;

              callPropertiesDropdown();

            });

            $( "#" + vectorID + " .deleteBtn" ).click( function() {
              var parent = $( this ).parent().parent();
              var id = $( this ).parent().attr( "id" );
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
            { "name":"edit",      "object": document.createElement('div'), "cssClass":"custom-button", "container":controlDiv, "href":"#" }, 
            { "name":"marker",    "object": document.createElement('div'), "cssClass":"custom-button", "container":controlDiv, "href":"#" },
            { "name":"line",      "object": document.createElement('div'), "cssClass":"custom-button", "container":controlDiv, "href":"#" },
            { "name":"polygon",   "object": document.createElement('div'), "cssClass":"custom-button", "container":controlDiv, "href":"#" },
            { "name":"rectangle", "object": document.createElement('div'), "cssClass":"custom-button", "container":controlDiv, "href":"#" },
            { "name":"circle",    "object": document.createElement('div'), "cssClass":"custom-button", "container":controlDiv, "href":"#" },
            { "name":"export",    "object": document.createElement('div'), "cssClass":"custom-button", "container":controlDiv, "href":"#test" },
            { "name":"import",    "object": document.createElement('div'), "cssClass":"custom-button", "container":controlDiv, "href":"#" },
            { "name":"markers",   "object": document.createElement('div'), "cssClass":"filter-button", "container":filters, "href":"#" }, 
            { "name":"lines",     "object": document.createElement('div'), "cssClass":"filter-button", "container":filters, "href":"#" },
            { "name":"shapes",    "object": document.createElement('div'), "cssClass":"filter-button", "container":filters, "href":"#" },
            { "name":"all",       "object": document.createElement('div'), "cssClass":"filter-button", "container":filters, "href":"#" }
            ];


          // FILL HTML WITH CUSTOM BUTTONS
          for ( var obj in customButtons ) {
            var control = customButtons[obj].object;
            var name = customButtons[obj].name;
            var cssClass = customButtons[obj].cssClass;
            var container = customButtons[obj].container;
            var href = customButtons[obj].href;
            control.className = cssClass + " " + name;
            $( control ).attr( "href", href );
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
          google.maps.event.addDomListener( getObjectByName( customButtons, "line" ).object, 'click', function() {
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
            importVectors( e );
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
            updateVectorInfo(marker, "marker", vectorIDCounter++, "", "" );
          });
          google.maps.event.addDomListener(drawingManager, 'polylinecomplete', function(polyline) {
            updateVectorInfo(polyline, "line", vectorIDCounter++, "#280671", "" );
          });
          google.maps.event.addDomListener(drawingManager, 'polygoncomplete', function(polygon) {
            updateVectorInfo(polygon, "polygon", vectorIDCounter++, "#0D8800", "#329D27" );
          });
          google.maps.event.addDomListener(drawingManager, 'rectanglecomplete', function(rectangle) {
            updateVectorInfo(rectangle, "rectangle", vectorIDCounter++, "#280671", "#472B83" );
          });
          google.maps.event.addDomListener(drawingManager, 'circlecomplete', function(circle) {
            updateVectorInfo(circle, "circle", vectorIDCounter++, "#043A6B", "#26537C" );
          });


          // PUSH CUSTOM HTML TO MAP OVERLAY
          properties.index = 1;
          map.controls[google.maps.ControlPosition.TOP_RIGHT].push(properties);
          controlDiv.index = 2;
          map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlDiv);
          rightPanel.index = 4;
          map.controls[google.maps.ControlPosition.RIGHT].push(rightPanel);
        }


        function updateVectorInfo( newVector, vectorType, vectorID, strokeColor, fillColor ) {
          vectors.push( { "vector": newVector, 
                          "vectorType": vectorType, 
                          "vectorID": vectorID,
                          "strokeColor": strokeColor,
                          "fillColor": fillColor,
                          "opacity": 0.5,
                          "name": vectorType.substring(0,3).toUpperCase() + vectorID
                        } );
          updateVectorList();

          google.maps.event.addListener( newVector, 'rightclick', function(e) {
            // Check if click was on a vertex control point
            if ( e.vertex == undefined ) {
              return;
            }
            var deleteMenu = new DeleteMenu();
            deleteMenu.open( map, newVector.getPath(), e.vertex );
          });

        }


        function exportVectors( event ) {
          var vectorData = "vectors : [ \n";
          var markerData = "  markers : [ \n";
          var lineData   = "  lines : [ \n";
          var polyData   = "  polygons : [ \n";
          var rectData   = "  rectangles : [ \n";
          var circData   = "  circles : [ \n";


          $( vectors ).each( function() {
            var vectorType = this.vectorType;
            var vector     = this.vector;
            var vectorID   = this.vectorID;
            var vectorName = this.name;
            var fillColor  = this.fillColor;
            var strokeColor= this.strokeColor;
            var opacity    = this.opacity;

            if ( vectorType === "marker" ) {
              markerData = markerData + "    " + vectorName + " : [ \n";
              markerData = markerData + "      position : " + vector.getPosition().toString() + " ] \n";
            }
            if ( vectorType === "line" ) {
              lineData = lineData + "    " + vectorName + " : [\n";
              lineData = lineData + "      strokeColor : " + strokeColor + "\n"
                                  + "      opacity : " + opacity + "\n";
              for ( path in vector.getPath().getArray() ) {
                lineData = lineData + "      position : " +  vector.getPath().getArray()[path].toString() + "\n";
              }
            }
            if ( vectorType === "polygon" ) {
              polyData = polyData + "    " + vectorName + " : [\n";
              polyData = polyData + "      fillColor : " + fillColor + "\n"
                                  + "      strokeColor : " + strokeColor + "\n"
                                  + "      opacity : " + opacity + "\n";
              for ( path in vector.getPath().getArray() ) {
                polyData = polyData + "      path_" + path + ": " +  vector.getPath().getArray()[path].toString() + "\n";
              }
            }
            if ( vectorType === "rectangle" ) {
              rectData = rectData + "    " + vectorName + " : [ \n";
              rectData = rectData + "      fillColor : " + fillColor + "\n"
                                  + "      strokeColor : " + strokeColor + "\n"
                                  + "      opacity : " + opacity + "\n";
              rectData = rectData + "      bounds : " + vector.getBounds().toString() + "\n"
                                  + "    ]\n";
            }
            if ( vectorType === "circle" ) {
              circData = circData + "    " + vectorName + " : [ \n";
              circData = circData + "      fillColor : " + fillColor + "\n"
                                  + "      strokeColor : " + strokeColor + "\n"
                                  + "      opacity : " + opacity + "\n";
              circData = circData + "      center : " + vector.getCenter().toString() + "\n" 
                                  + "      radius : " + vector.getRadius().toString() + "\n";
              circData = circData + "    ]\n";
            }
          })

          vectorData += markerData + "\n\t ] \n";
          vectorData += lineData + "\n\t ] \n";
          vectorData += polyData + "\n\t ] \n";
          vectorData += rectData + "\n\t ] \n";
          vectorData += circData + "\n\t ] \n";
          vectorData +=  "]";

          // vectordata = JSON.stringify( vectors );

          $( "#export" ).find( "pre" ).text( vectorData );
          var base64File = "data:application/octet-stream;charset=utf-8;base64," + window.btoa( vectorData );
          $( "#export" ).find( "a" ).attr( "href", base64File );
          $( "#export" ).find( "a" ).attr( "download", "json_output.txt" );

          $( "a[rel*=exportModal]" ).leanModal();
          $( "a[rel*=exportModal]" ).click();
        }


        function importVectors() {
          var fileInput = document.getElementById('fileInput');
          var fileDisplayArea = document.getElementById('fileDisplayArea');

          fileInput.addEventListener('change', function(e) {
            var file = fileInput.files[0];
            var textType = /text.*/;

            if (file.type.match(textType)) {
              var reader = new FileReader();

              reader.onload = function(e) {
                fileDisplayArea.innerText = reader.result;
                uploadFile = reader.result;
                var result = jQuery.parseJSON( uploadFile );
                console.log( result );
              }

              reader.readAsText(file);  
            } else {
              fileDisplayArea.innerText = "File not supported!"
            }
          });

          $( "a[rel*=importModal]" ).leanModal();
          $( "a[rel*=importModal]" ).click();

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