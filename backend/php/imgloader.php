<?php
include_once  "./settings.php";

$_POST = json_decode(file_get_contents('php://input'), true);
$token = preg_replace('/[^a-zA-Z0-9\s]+/u','',$_POST['token']);

if($token != ACCESS_TOKEN)
{
  //die('{"status":false}');
}

$quality = intval(preg_replace('/[^0-9\s]+/u','',$_GET['quality']));
$folder = preg_replace('/[^a-zA-Z0-9_\s]+/u','',str_replace(" ","_",$_GET['folder']));
$subFolder = preg_replace('/[^a-zA-Z0-9_\s]+/u','',str_replace(" ","_",$_GET['subfolder']));
$file = preg_replace('/[^a-zA-Z0-9\-._\s]+/u','',$_GET['file']);

if($quality <= 0 || $quality > 100 || !fileIsValid($file))
{
  die('{"status":false}');
}

$filePath = DATA_PATH.$folder."/".$subFolder."/";
if($subFolder == "NONE")
{
  $filePath = DATA_PATH.$folder."/";
}
$filePath .= $file;

header('Content-Type: image/jpeg');
header('Content-Length: ' . filesize($filePath));
header('Content-Disposition: inline; filename="'.$filePath.'"');
$image = imagecreatefromjpeg($filePath);
imagejpeg($image, NULL, $quality) ;
//echo file_get_contents($location);
 ?>
