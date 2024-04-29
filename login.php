<?php
// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Database connection
    $servername = "localhost";
    $username = "root"; 
    $password = "";
    $dbname = "s_series";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $password = $conn->real_escape_string($_POST['password']);
    $email = $conn->real_escape_string($_POST['email']);

    $sql = "SELECT * FROM register WHERE password='$password' AND email='$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0)
     {
        session_start();
        $_SESSION['email'] = $email;
        header("Location: sseries.html");
        exit();
    }
     else 
    {
        echo "Invalid email or password";
        
    }

    $conn->close();
}
?>
