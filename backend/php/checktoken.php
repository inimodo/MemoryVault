<?php
include_once  "./settings.php";

$_POST = json_decode(file_get_contents('php://input'), true);
$token = preg_replace('/[^a-zA-Z0-9\s]+/u','',$_POST['token']);

if($token == ACCESS_TOKEN)
{
  die('{"status":true}');
}
die('{"status":false}');

 ?>
