<?php
// array for JSON response
$response = array();

// include db connect class
require_once __DIR__ . '/require/connectbd.php';

// connecting to db
$db = new DB_Connect();

//get all products from products table
$result = mysql_query("SELECT id, nombre, astext(geom) as geom, vertices FROM poligono") or die(mysql_error());

	
// check for empty result
if (mysql_num_rows($result) > 0) {

    $response = array();
    
    while ($row = mysql_fetch_array($result)) {
        // temp user array
        $poligono = array();
		
        $poligono["id"] = $row["id"];
        $poligono["nombre"] = $row["nombre"];
		$poligono["poligono"] = $row["geom"];
		$poligono["vertices"] = $row["vertices"];

       // $cliente_cc["Geom"] = $row["Geom"];

        // push single product into final response array
        array_push($response, $poligono);
    }
    // success
    //$response["success"] = 1;

    // echoing JSON response
    echo json_encode($response);

} else {
    // no products found
    $response["success"] = 0;
    $response["message"] = "No se encontraron poligonos";

    // echo no users JSON
    echo json_encode($response);
}
$db.close();


?>