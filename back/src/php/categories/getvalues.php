<?php
include_once '../connection.php';


/* Read */
function getCategoryName() {
    $sql = "SELECT name FROM categories";
    $result = Connection::connect()->prepare($sql);
    $result->execute();

    $data = [];
    while($row = $result->fetch(PDO::FETCH_ASSOC)) {
        $data[] = $row;
    }

    echo json_encode($data);
};

getCategoryName();

?>