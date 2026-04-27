<?php
/**
 * Copy this file to dbconfig.php and update values if needed.
 * Example:
 * 1) Duplicate this file as dbconfig.php
 * 2) Keep host as localhost for XAMPP
 * 3) Update username/password/database if your setup is different
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
