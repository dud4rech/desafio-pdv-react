<?php
include_once '../connection.php';
include_once '../getmethod.php';

/* Insert */
function insertData() {    
    $data = file_get_contents("php://input");
    $decode = json_decode($data, true);

    $name=$decode["name"];
    $orderCode=$decode["orderCode"];
    $productCode=$decode["code"];
    $amount=$decode["amount"];
    $price=$decode["itemPrice"];
    $tax=$decode["itemTax"];
  
    $sql = "INSERT INTO order_item (order_code, name, product_code, amount, price, tax) VALUES (:order_code, :name, :product_code, :amount, :price, :tax)";
    $result = Connection::connect()->prepare($sql);
    $result->bindParam(':order_code', $orderCode, PDO::PARAM_INT);
    $result->bindParam(':name', $name, PDO::PARAM_STR);
    $result->bindParam(':product_code', $productCode, PDO::PARAM_INT);
    $result->bindParam(':amount', $amount, PDO::PARAM_INT);
    $result->bindParam(':price', $price, PDO::PARAM_INT);
    $result->bindParam(':tax', $tax, PDO::PARAM_INT);
    $result->execute();

    echo json_encode($result);
}
    
    