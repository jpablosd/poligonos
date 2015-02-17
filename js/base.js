/*
capturar los polygonos creados en la base de datos y mostrarlos en un select, en donde al ascoger uno,me despliegue opciones o 
tome botones pre-definidos (modificar, guardar, eliminar), al modificarlo, saber cuando esta modificando uno antes de empezar a modificar otro,
luego de eso actualizarlo en la bd



guardar en zonas,zona general y subgeneral, luego editar,y mover los poligonos, y asignar el subgeneral a una persona


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
    });



    //click sobre el poligono edit
    google.maps.event.addListener(polygonEdit, 'click', function() {
        alert("click sobre el elemento");
    });


    //boton editar polygon cargado
    $("#editarPoligono").click(function(){
        polygonEdit.setEditable(true);
    });


    $("#cancelarEdicion").click(function(){
        polygonEdit.setMap(null);
        polygonEdit.setOptions({
            paths: poligonoCoordenadas
        });
        polygonEdit.setMap(map);//aca lo agrego al mapa
    });

    //boton editar polygon cargado
    $("#guardarPoligono").click(function(){
        alert("guardar Poligono editado");
    });

    //boton editar polygon cargado
    $("#eliminarPoligono").click(function(){
        alert("eliminar poligono editado");
    });


    /*
    $("#listaPoligonos").onchange(function(){
        if( polygonEditInsertAt == true || polygonEditSetAt == true){
            console.log("entra al if");
            $("#dialogoCerrar").dialog({
                width: 590,
                height: 350,
                show: "blind",
                hide: "shake",
                resizable: "false",
                position: "center"		
            });
        } 
        else{
            console.log("entra al if");
            $("#dialogoCerrar").dialog({
                width: 590,
                height: 350,
                show: "blind",
                hide: "shake",
                resizable: "false",
                position: "center"		
            });
        }
    });
    */








}//inicialize

function cleanMapa(){
    initialize();
}



function clickPoligono(id){
    if(polygonEditInsertAt == true || polygonEditSetAt == true){
        if(confirm('¿Seguro que desea perder los datos?'))this.form.submit();
    }else{
        polygonEditInsertAt = false;
        polygonEditSetAt = false;
    }





    poligonoCoordenadas = [];
    polygonEdit.setMap(null);


    $("#guardarPoligono").hide();
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
            var coordinates = (polygonEdit.getPath().getArray());//coordenadas
            var vertices = (polygonEdit.getPath());//objeto
            var numVertices = (vertices.getLength());
            console.log("coordenadas: "+coordinates);
            console.log("vertices: "+vertices);
            console.log("numero de vertices: "+numVertices);

            polygonEditInsertAt = true;
            $("#guardarPoligono").show();
            $("#eliminarPoligono").show();
            $("#cancelarEdicion").show();

            $("#editarPoligono").hide();

            //console.log(polygonEdit);

        });

        //set_at es para cuando modfico un vertice que ya estaba como referencia.
        google.maps.event.addListener(polygonEdit.getPath(), 'set_at', function() {
            console.log('set_at');
            var coordinates = (polygonEdit.getPath().getArray());//coordenadas
            var vertices = (polygonEdit.getPath());//objeto
            var numVertices = vertices.getLength();
            console.log("coordenadas: "+coordinates);
            console.log("vertices: "+vertices);
            console.log("numero de vertices: "+numVertices);

            polygonEditSetAt = true;
            $("#guardarPoligono").show();
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
    //console.log("guardarPoligono.php?nombrePoligono="+nombre+"coordenadas="+coordenadas);
    conexion.open("GET","guardarPoligono.php?nombrePoligono="+nombrePoligono+"&coordenadas="+coordenadas+"&vertices="+numVertices,true);
    conexion.send();

    nombrePoligono = null;
    coordenadas = null;
    numVertices=null;
}//guardarPoligono


