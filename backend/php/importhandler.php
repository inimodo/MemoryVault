<?php

include_once  "./settings.php";

$_POST = json_decode(file_get_contents('php://input'), true);
$token = preg_replace('/[^a-zA-Z0-9\s]+/u','',$_POST['token']);

if($token != ACCESS_TOKEN)
{
  die('{"status":false}');
}

$opcode = intval(preg_replace('/[^0-9\s]+/u','',$_POST['opcode']));
$folder = preg_replace('/[^a-zA-Z0-9_\s]+/u','',str_replace(" ","_",$_POST['folder']));
$subFolder = preg_replace('/[^a-zA-Z0-9_\s]+/u','',str_replace(" ","_",$_POST['subfolder']));

switch ($opcode) {
  case 0: // List
    $found = count(scandir(FTP_PATH))-2;
    die('{"status":true,"found":'.$found.'}');
    break;
  case 1: // Import

    break;
}

 ?>
