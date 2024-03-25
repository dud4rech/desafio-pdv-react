<?php
include_once '../connection.php';
include_once '../getmethod.php';

/* Insert */
function insertData() {
    $data = file_get_contents("php://input");
    $decode = json_decode($data, true);

    $name=$decode["name"];
    $amount=$decode["amount"];
    $price=$decode["price"];
    $categoryName=$decode["categoryName"];
    $categoryCode=$decode["categoryCode"];
    $categoryTax=$decode["categoryTax"];
   
    $sql = "INSERT INTO products (name, amount, price, category_name, category_code, category_tax) VALUES (:name, :amount, :price, :category_name, :category_code, :category_tax)";
    $result = Connection::connect()->prepare($sql);
 
    $result->bindParam(':name', $name, PDO::PARAM_STR);
    $result->bindParam(':amount', $amount, PDO::PARAM_INT);
    $result->bindParam(':price', $price, PDO::PARAM_INT);
    $result->bindParam(':category_name', $categoryName, PDO::PARAM_STR);
    $result->bindParam(':category_code', $categoryCode, PDO::PARAM_INT);
    $result->bindParam(':category_tax', $categoryTax, PDO::PARAM_INT);
    $result->execute();

    return json_encode($result);
}
    
    