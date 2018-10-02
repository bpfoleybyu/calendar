<?php
  header('Content-Type: application/json');
  DEFINE('DB_USERNAME', 'root');
  DEFINE('DB_PASSWORD', 'root');
  DEFINE('DB_HOST', 'localhost');
  DEFINE('DB_DATABASE', 'my_db');

  $mysqli = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
  $user_name = $_POST["user_name"];
  $password = $_POST["password"];

  $myResult = [];
  $myResult["register"] = 'true';

  if ($mysqli->connect_errno) { 
    die('Connect Error ('.mysqli_connect_errno().') '.mysqli_connect_error());
  }

  $sql = "INSERT INTO Users Values ($user_name, $password)";
  $myResult['sql'] = $sql;
  //$sql = "INSERT INTO Users Values ('a','a')";

  if($mysqli->query($sql) === TRUE){
    $myResult['result'] = 'Success';
  }
  else{
    $myResult['error'] = 'User Already Exists';
  }
  $mysqli->close();

  header('Content-Type: json');
  echo json_encode($myResult);
?>