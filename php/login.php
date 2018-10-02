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

  if ($mysqli->connect_errno) { 
    die('Connect Error ('.mysqli_connect_errno().') '.mysqli_connect_error());
  }

    $sql = "SELECT * FROM USERS WHERE username = $user_name and password = $password";
    $myResult['sql'] = $sql;

    if($result = $mysqli->query($sql)){
       if(mysqli_num_rows($result) <=0){
       $myResult['error'] = 'Login Failed';
      }
      else
     {
       $row = $result->fetch_assoc();
       $userInfo['username'] = $row["username"];
       $userInfo['password'] = $row["password"];
       $myResult['result'] = $userInfo;
       $result->close();
     }
  }
  else{
    $myResult['error'] = 'Query Failed';
  }
  
  $mysqli->close();

  header('Content-Type: json');
  echo json_encode($myResult);
?>