<?php
include_once '../connection.php';

function getMethod() {
    $method = $_SERVER['REQUEST_METHOD'];
    

    if($method == 'GET') {
        return selectData();
    } else 
        if($method == 'POST') {
            insertData();
    } else
        if($method == 'DELETE') {
            deleteData();
    } else
        if($method == 'PUT') {
            updateValues();
    } 
echo $method;
};
getMethod();

?>