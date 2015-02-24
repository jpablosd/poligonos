/*
[X]capturar los polygonos creados en la base de datos y mostrarlos en un select, en donde al ascoger uno,me despliegue opciones o 
tome botones pre-definidos (modificar, guardar, eliminar), al modificarlo, saber cuando esta modificando uno antes de empezar a modificar otro,
[X]luego de eso actualizarlo en la bd



[]guardar en zonas,zona general y subgeneral, luego editar,y mover los poligonos, y asignar el subgeneral a una persona

[]asignar un poligono a un usuario, y a su vez a un administrador, para luego en el mapa mostrar muchos poligonos (hacer bosquejo)

[]dependiendo de los datos, eje 20%se cambie el color a rojo o naranjo (colores material?)

[X]luego al pasar el mouse por ensima del poligono mostrar el nombre

[X]Al guardar el poligonose debe borrar el nombre del input, y ojala borrar del mapa, antes de esto se debe poder modificar (un solo objeto) 

X[]al cargar un poligono, al apretar editar poligono debe mostrar las opciones modificar, mover, y eliminar, y si lo muevo automaticamente debe detectar si lo modifique para cuando seleccione otro me avise si quiero guardar los datos anteriores

X[]al actualizar poligono, se actualiza mas de una vez, eso esta mal ademas de no guardarlo, al guardar se esconden lo botones, pero no se quita el editable=true del poligono

[X]al limpiar el mapa, no se esconde el guardar poligono (div)

[]al tener el poligono dibujdo (negro) y cargar un poligono (rojo) al entrar a editarlo no se puede

[]al guardar un poligono, pueden existir muchos con el mismo nombre,

[X]al recargar la pagina, hay que apretar el boton para cargar los poligonos, lo ideal es que se carguen automaticamente al recargar la pagina, aun asi se puede volver a cargar al apretar el boton


[X] al limpiar mapa, y luego al editar un poligono, al momento de guardarlo se ejecuta muchas veces, (limpiar variables y objetos)

[] cuando cargo un poligono que no esta en el centro del mapa, este no se ve y hay que buscarlo.

[X] al eliminar poligono, se debe actualizar la pagina o al menos cargar los poligonos en el select

[X] al guardar un poligono se debe actualizar el mapa

*/
var map;
var nombrePoligono;
var numVertices;
var coordenadas;

var polygonEdit = new google.maps.Polygon({});
var idPolygonEdit;
var polygonEditInsertAt = false;
var polygonEditSetAt = false;
var poligonoCoordenadas = [];
var numVerticesPoligonEdit;
var nombrePolygonEdit;


function initialize() {

    var mapDiv = document.getElementById('googft-mapCanvas');
    mapDiv.style.width = '100% !important';
    mapDiv.style.height ='720px';

    map = new google.maps.Map(mapDiv, {
        center: new google.maps.LatLng(-33.444, -70.678),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                //google.maps.drawing.OverlayType.MARKER,
                //google.maps.drawing.OverlayType.CIRCLE,
                google.maps.drawing.OverlayType.POLYGON,
                //google.maps.drawing.OverlayType.POLYLINE,
                //google.maps.drawing.OverlayType.RECTANGLE
            ]
        }
    });
    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon){
        console.log('polygoncomplete');

        var coordinates = (polygon.getPath().getArray());//coordenadas
        //console.log(polygon.getLength());
        var vertices = (polygon.getPath());//objeto
        numVertices = vertices.getLength();
        coordenadas = "";
        //console.log(coordinates.length);

        //capturo las coordenadas de los vertices para dejarlos en formato -33.0 -70.0,-30.1 -70.2 ademas de cerrar el poligono con el primer vertice

        for (var i=0; i<numVertices; i++){
            if (coordenadas == ""){
                coordenadas = vertices.getAt(i).lat() + " " + vertices.getAt(i).lng() + ",";
            }
            else{
                if (i == (numVertices-1)){
                    coordenadas = coordenadas + vertices.getAt(i).lat() + " " + vertices.getAt(i).lng() + ",";
                    coordenadas = coordenadas + vertices.getAt(0).lat() + " " + vertices.getAt(0).lng();
                }
                else{
                    coordenadas = coordenadas + vertices.getAt(i).lat() + " " + vertices.getAt(i).lng() + ",";
                }
            }
        }
        //console.log(coordenadas);

        $("#divGuardar").show();

        google.maps.event.addListener(polygon.getPath(), 'set_at', function() {
            console.log(polygon.getPath());
            console.log('set_at');
            //captura puntos o coordenadas guardar el poligono en BD con nombre, luego listar
        });
    });



    $("#cargarPoligonos").click(function(){
        //alert("cargarPoligono");
        cargarPoligonos();
    });



    //click sobre el poligono edit
    google.maps.event.addListener(polygonEdit, 'click', function() {
        alert("click sobre el elemento");
    });
    
    var infowindowLevel = 0
    var infowindow = new google.maps.InfoWindow(
    { 
        content: nombrePolygonEdit
    });
    google.maps.event.addListener(polygonEdit, 'mouseover', function() {
        //console.log("mouseover sobre el elemento");

        //infowindow.setZIndex(++infowindowLevel);
        //console.log(nombrePolygonEdit);
        /*
        polygonEdit.setOptions({
            strokeColor: "#D32F2F",
            strokeOpacity: 0.80,
            strokeWeight: 2,
            fillColor: "#D32F2F",
            fillOpacity: 0.80
        });
        */
        //infowindow.open(map,polygonEdit);
    });
    google.maps.event.addListener(polygonEdit, 'mouseout', function() {
        //console.log("mouseout sobre el elemento");
        /*
        polygonEdit.setOptions({
            paths: poligonoCoordenadas,
            editable: false,
            draggable: false,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35
        });
        */
        //infowindow.setZIndex(++infowindowLevel);
        //infowindow.close();
    });


    //boton editar polygon cargado
    $("#editarPoligono").click(function(){
        polygonEdit.setEditable(true);
        $("#actualizarPoligono").show();
        $("#eliminarPoligono").show();
        $("#cancelarEdicion").show();
        $("#editarPoligono").hide();
    });


    $("#cancelarEdicion").click(function(){
        polygonEdit.setMap(null);
        polygonEdit.setOptions({
            paths: poligonoCoordenadas
        });
        polygonEdit.setMap(map);//aca lo agrego al mapa
    });

    //boton editar polygon cargado
    //ACTUALIZAR POLIGONO EDITADO
    $("#actualizarPoligono").click(function(){
        //alert("guardar Poligono editado");                
        $("#actualizarPoligono").hide();
        $("#eliminarPoligono").hide();
        $("#cancelarEdicion").hide();
        $("#editarPoligono").show();
        
        polygonEditInsertAt = false;
        polygonEditSetAt = false;
        
        actualizarPoligono();

        
    });

    //boton editar polygon cargado
    $("#eliminarPoligono").click(function(){
        eliminarPoligono();
        $("#actualizarPoligono").hide();
        $("#eliminarPoligono").hide();
        $("#cancelarEdicion").hide();
        $("#editarPoligono").show();
        cleanMapa();
        
        
    });

    cargarPoligonos();
}//inicialize

function cleanMapa(){
    $("#divGuardar").hide();
    
    
    map;
    nombrePoligono;
    numVertices;
    coordenadas;
    polygonEdit = new google.maps.Polygon({});
    polygonEditInsertAt = false;
    polygonEditSetAt = false;

    
    nombrePolygonEdit = null;
    idPolygonEdit = null;
    poligonoCoordenadas = null;
    numVerticesPoligonEdit = null;
    
    
    initialize();
}


function cargarPoligonos(){
    var xmlhttp = new XMLHttpRequest();
    var url = "cargarPoligonos.php";

    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            myFunction(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    function myFunction(response) {
        var arr = JSON.parse(response);
        var i;
        var out = "";

        for(i = 0; i < arr.length; i++) {
            out += "<option value='"+arr[i].id  +"'"+">"+arr[i].nombre+"</option>";
            //lista
        }
        document.getElementById("listaPoligonos").innerHTML = out;
    }
}


//cuando selecciono un poligono
function clickPoligono(id){
    if(polygonEditInsertAt == true || polygonEditSetAt == true){
        
        if(confirm('¿Seguro que desea perder los datos?')){
            //this.form.submit();
            polygonEditInsertAt = false;
            polygonEditSetAt = false;
        }
        else{
            return false;
        }
    }

    poligonoCoordenadas = [];
    polygonEdit.setMap(null);


    $("#actualizarPoligono").hide();
    $("#eliminarPoligono").hide();
    $("#cancelarEdicion").hide();
    $("#editarPoligono").show();


    var xmlhttp = new XMLHttpRequest();
    var url = "buscarPoligono.php?idPoligono="+id;

    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            myFunction(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    function myFunction(response) {
        var arr = JSON.parse(response);
        var i;

        var id          = arr[0].id;
        var nombre      = arr[0].nombre;
        var coordenadas = arr[0].poligono;
        var vertices    = arr[0].vertices;
        
        nombrePolygonEdit = arr[0].nombre;
        
        if(!coordenadas){
            return false;
        }
        var geom = coordenadas.replace("POLYGON","");
        //console.log(geom);
        geom = geom.replace("((","");
        geom = geom.replace("))","");

        var strtxt=geom.split(',');
        var arrlatlng=[];


        idPolygonEdit = arr[0].id;

        for(i=0;i<strtxt.length;i++)
        {
            var strsplit=strtxt[i].split(' ');
            //console.log(strsplit);
            pointpaso=new google.maps.LatLng(strsplit[0],strsplit[1]);
            poligonoCoordenadas.push(pointpaso);
        }

        polygonEdit.setOptions({
            paths: poligonoCoordenadas,
            editable: false,
            draggable: false,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35
        });
        polygonEdit.setMap(map);//aca lo agrego al mapa

        //-- ESCUCHO SI SE MODIFICO EL POLIGONO

        //insert_at es para cuando ingreso un punto entre las coordenadas (ingreso un vertice)
        google.maps.event.addListener(polygonEdit.getPath(), 'insert_at', function() {
            console.log('insert_at');
            poligonoCoordenadas = (polygonEdit.getPath().getArray());//coordenadas
            console.log(poligonoCoordenadas);

            var vertices = (polygonEdit.getPath());//objeto
            numVerticesPoligonEdit = (vertices.getLength());
            //console.log("coordenadas: "+coordinates);
            //console.log("vertices: "+vertices);
            //console.log("numero de vertices: "+numVerticesPoligonEdit);

            polygonEditInsertAt = true;
            $("#actualizarPoligono").show();
            $("#eliminarPoligono").show();
            $("#cancelarEdicion").show();

            $("#editarPoligono").hide();

            //console.log(polygonEdit);

        });

        //set_at es para cuando modfico un vertice que ya estaba como referencia.
        google.maps.event.addListener(polygonEdit.getPath(), 'set_at', function() {
            console.log('set_at');
            poligonoCoordenadas = (polygonEdit.getPath().getArray());//coordenadas
            console.log(poligonoCoordenadas);
            var vertices = (polygonEdit.getPath());//objeto
            numVerticesPoligonEdit = vertices.getLength();
            //console.log("coordenadas: "+coordinates);
            //console.log("vertices: "+vertices);
            //console.log("numero de vertices: "+numVerticesPoligonEdit);

            polygonEditSetAt = true;
            $("#actualizarPoligono").show();
            $("#eliminarPoligono").show();
            $("#cancelarEdicion").show();

            $("#editarPoligono").hide();

            //console.log(polygonEdit);

        });
        //-- ESCUCHO SI SE MODIFICO EL POLIGONO



    }//myfunction

}//clickPoligono





//funcion ajax que envia datos a php y guarda el poligono
function guardarPoligono(){
    nombrePoligono = document.getElementById("nombrePoligono").value;
    numVertices = parseInt(numVertices)+1;

    //alert("nombre: "+nombrePoligono+" numVertices: "+numVertices+" coordenadas: "+coordenadas);

    var conexion;
    if (window.XMLHttpRequest){
        conexion = new XMLHttpRequest();
    }
    else{
        conexion = new ActiveXObject("Microsoft.XMLHTTP");
    }
    conexion.onreadystatechange=function(){
        if (conexion.readyState==4 && conexion.status==200){
            //document.getElementById("midiv").innerHTML=conexion.responseText; 
            alert("poligono guardado");
        }
    }
    //console.log("guardarPoligono.php?nombrePoligono="+nombrePoligono+"&coordenadas="+poligonoCoordenadas+"&vertices="+numVertices);
    
    conexion.open("GET","guardarPoligono.php?nombrePoligono="+nombrePoligono+"&coordenadas="+coordenadas+"&vertices="+numVertices,true);
    conexion.send();

    nombrePoligono = null;
    coordenadas = null;
    numVertices=null;
    cleanMapa();
}//guardarPoligono


//actualizar poligono editado
function actualizarPoligono(){
    
    console.log("id: "+idPolygonEdit+" coordenadas: "+poligonoCoordenadas+" vertices: "+numVerticesPoligonEdit);
    //console.log(poligonoCoordenadas.length);
    var poligonoCoordenadas2=[];
    for(var i=0; i<poligonoCoordenadas.length; i++){
       //console.log(poligonoCoordenadas[i].toString().replace(",",""));
        poligonoCoordenadas2.push(poligonoCoordenadas[i].toString().replace(",","").replace("(","").replace(")","")); 
    }  
    var conexion;
    if (window.XMLHttpRequest){
        conexion = new XMLHttpRequest();
    }
    else{
        conexion = new ActiveXObject("Microsoft.XMLHTTP");
    }
    conexion.onreadystatechange=function(){
        if (conexion.readyState==4 && conexion.status==200){
            //document.getElementById("midiv").innerHTML=conexion.responseText; 
            alert("poligono actualizado");
        }
    }

    
    var strpaso=poligonoCoordenadas2.toString();
    
    //console.log("actualizarPoligono.php?idPoligono="+idPolygonEdit+"&nuevasCoordenadas="+strpaso+"&vertices="+numVerticesPoligonEdit);
    conexion.open("GET","actualizarPoligono.php?idPoligono="+idPolygonEdit+"&nuevasCoordenadas="+strpaso+"&vertices="+numVerticesPoligonEdit,true);
    conexion.send();
    
    idPolygonEdit = null;
    poligonoCoordenadas = null;
    numVerticesPoligonEdit = null;
    
    cleanMapa();
    
}


//eliminar poligono editado
function eliminarPoligono(){
    var conexion;
    if (window.XMLHttpRequest){
        conexion = new XMLHttpRequest();
    }
    else{
        conexion = new ActiveXObject("Microsoft.XMLHTTP");
    }
    conexion.onreadystatechange=function(){
        if (conexion.readyState==4 && conexion.status==200){
            //document.getElementById("midiv").innerHTML=conexion.responseText; 
            alert("poligono eliminado");
        }
    } 
    conexion.open("GET","eliminarPoligono.php?idPoligono="+idPolygonEdit,true);
    conexion.send();
}

