<?php
include_once  "./settings.php";
require VENDOR_PATH.'autoload.php';

$_POST = json_decode(file_get_contents('php://input'), true);
$token = preg_replace('/[^a-zA-Z0-9\s]+/u','',$_POST['token']);

if($token != ACCESS_TOKEN)
{
  die('{"status":false}');
}

$opcode = intval(preg_replace('/[^0-9\s]+/u','',$_POST['opcode']));
$file = preg_replace('/[^a-zA-Z0-9._\s]+/u','',$_POST['file']);
$filePath = MOV_PATH.$file;

switch ($opcode)
{
  case 0: // Load thumbnail
    echo file_get_contents($filePath.".JPG");
    break;
  case 1:// Load Movie
    echo file_get_contents($filePath.".mp4");
  break;
  case 2: // Get fsize
    die('{"status":true,"size":'.filesize($filePath.".mp4").'}');
    break;
}
 ?>
