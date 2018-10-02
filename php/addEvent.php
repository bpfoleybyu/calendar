<?php
  header('Content-Type: application/json');
  DEFINE('DB_USERNAME', 'root');
  DEFINE('DB_PASSWORD', 'root');
  DEFINE('DB_HOST', 'localhost');
  DEFINE('DB_DATABASE', 'my_db');

  $mysqli = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE);

  $event = $_POST["event"];
  $month = $_POST["month"];
  $day = $_POST["day"];
  $time = $_POST["time"];
  $holiday = $_POST["holiday"];
  $owner = $_POST["owner"];
  $year = $_POST["year"];
  
  $myResult = array(
    "success" => "false",
  );

  if ($mysqli->connect_errno) { 
    die('Connect Error ('.mysqli_connect_errno().') '.mysqli_connect_error());
  }

  $sql = "INSERT INTO Events (event, month, day, time, holiday, owner, year) VALUES($event,$month,$day,$time,$holiday,$owner, $year)";
  $myResult['sql'] = $sql;

  if($mysqli->query($sql) === TRUE){
    $myResult['success'] = 'Success';
  }
  else{
    $myResult['error'] = 'INSERT FAILED';
  }

  $mysqli->close();

  header('Content-Type: json');
  echo json_encode($myResult);
?>