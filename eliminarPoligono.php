<?php


$id                = $_GET['idPoligono']; 

$response = array();

// include db connect class
require_once __DIR__ . '/require/connectbd.php';

// connecting to db
$db = new DB_CONNECT();

//get all products from products table
$result = mysql_query("delete from poligono where id='$id'") or die(mysql_error());


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