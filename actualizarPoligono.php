<?php


$id                = $_GET['idPoligono']; 
$nuevasCoordenadas = $_GET['nuevasCoordenadas'];
$numVertices       = $_GET['vertices'];


$response = array();

// include db connect class
require_once __DIR__ . '/require/connectbd.php';

// connecting to db
$db = new DB_CONNECT();

//echo "=========";

$strquery="update poligono set geom=GeomFromText('POLYGON(($nuevasCoordenadas))'), vertices = '$numVertices' where id='$id'";
echo $strquery;



//get all products from products table
$result = mysql_query($strquery) or die(mysql_error());



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
//$db.close();


?>