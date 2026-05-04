<?php
    /**
     * How to use this file:
     * 1) Duplicate this file and name it as dbconfig.php; this will serve as the local database configuration file
     * 2) Update the necessary values if needed for the setup
     */

    $db_host = "localhost";
    $db_user = "root";
    $db_pass = "";
    $db_name = "student_management_system";

    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

    if ($conn->connect_error) {
        die("Database connection failed: " . $conn->connect_error);
    }
?>
