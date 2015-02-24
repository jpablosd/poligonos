<?php
$nombre 		 = $_GET['nombrePoligono'];
$coordenadas = $_GET['coordenadas'];
$vertices    = $_GET['vertices'];

//$nombre 		 = "nombrePoligono";
//$coordenadas = "-33.23639027157905 -70.98953247070312,-33.56199537293026 -71.11312866210938,-33.42227225886604 -70.83023071289062,-33.23639027157905 -70.98953247070312";

$response = array();

// include db connect class
require_once __DIR__ . '/require/connectbd.php';

// connecting to db
$db = new DB_CONNECT();

echo "INSERT INTO poligono (nombre, geom, vertices) VALUES ('$nombre' ,GeomFromText('POLYGON(($coordenadas))'),'$vertices')";

//get all products from products table
$result = mysql_query("INSERT INTO poligono (nombre, geom, vertices) VALUES ('$nombre' ,GeomFromText('POLYGON(($coordenadas))'),'$vertices')") or die(mysql_error());

// check for empty result
if (mysql_num_rows($result) > 0) {
    // success
    $response["success"] = 1;
	$response["message"] = "poligono guardado";
    // echoing JSON response
    echo json_encode($response);

} else {
    // no products found
    $response["success"] = 0;
    $response["message"] = "error";

    // echo no users JSON
    echo json_encode($response);
}
$db.close();
?>