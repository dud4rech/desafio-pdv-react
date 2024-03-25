<?php
include_once '../connection.php';
include_once '../getmethod.php';

/* Insert */
function insertData() {
    $data = file_get_contents("php://input");
    $decode = json_decode($data, true);

    $date=$decode["date"];
    $total=$decode["total"];
    $tax=$decode["tax"];

    $sql = "INSERT INTO orders (date, total, tax) VALUES (:date, :total, :tax)";
    $result = Connection::connect()->prepare($sql);
    $result->bindParam(':date', $date, PDO::PARAM_STR);
    $result->bindParam(':total', $total, PDO::PARAM_INT);
    $result->bindParam(':tax', $tax, PDO::PARAM_INT);
    $result->execute();

    echo json_encode($result);
}
    
    