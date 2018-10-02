<?php
  header('Content-Type: application/json');
  DEFINE('DB_USERNAME', 'root');
  DEFINE('DB_PASSWORD', 'root');
  DEFINE('DB_HOST', 'localhost');
  DEFINE('DB_DATABASE', 'my_db');

  $mysqli = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
  $owner = $_POST["owner"];
  $month = $_POST["month"];
  $day = $_POST["day"];
  $year = $_POST["year"];  
  
  $myResult = [];

  if ($mysqli->connect_errno) { 
    die('Connect Error ('.mysqli_connect_errno().') '.mysqli_connect_error());
  }

  //pull event, time, holiday when its the same day and owned by current logged in person OR default holiday.
  $sql = "SELECT Event, Time, Holiday FROM EVENTS 
        WHERE month = $month and day = $day and ((owner = $owner and year=$year) or (holiday = 1 and year = 0))";
  $myResult['sql'] = $sql;
  if($result = $mysqli->query($sql)){
    if(mysqli_num_rows($result) <=0){
      $myResult['error'] = 'Empty';
    }
    else
    {
        $arrayResults = [];
      while($row = $result->fetch_assoc()){
          $arrayResult['event'] = $row['Event'];
          $arrayResult['time'] = $row['Time'];
          $arrayResult['holiday'] = $row['Holiday'];
          array_push($arrayResults, $arrayResult);
      }
      $myResult['events'] = $arrayResults;
      $myResult['success'] = true;
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