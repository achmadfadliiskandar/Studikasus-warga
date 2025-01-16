<?php
function getConnection()
{
    $host = "localhost";
    $db_name = "pert4_50422069_db";
    $username = "root";
    $password = "Fadli#177";

    $conn = new mysqli($host, $username, $password, $db_name);
    if ($conn->connect_error) {
        die("Connection failed" . $conn->connect_error);
    }
    return $conn;
}
