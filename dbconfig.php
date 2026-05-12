<?php
    $db_host = "localhost";
    $db_user = "root";
    $db_pass = "";
    $db_name = "student_management_system";

    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

    if ($conn->connect_error) {
        die("Database connection failed: " . $conn->connect_error);
    }
?>
