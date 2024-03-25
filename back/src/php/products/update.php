<?php
include_once '../connection.php';
include_once '../getmethod.php';

/* Update */
function updateValues() {
    $data = file_get_contents("php://input");
    $decode = json_decode($data, true);

    $amount=$decode['amount'];
    

    $sql = "UPDATE products SET amount=:amount WHERE code=:code";
    $result = Connection::connect()->prepare($sql);
    $result->bindParam(':amount', $amount, PDO::PARAM_INT);
    $result->bindParam(':code', $code);
    $code = $_GET['id'];
    $result->execute();
    
    $data = [];
    while($row = $result->fetch(PDO::FETCH_ASSOC)) {
        $data[] = $row;
    }

    echo json_encode($data);
};


?>