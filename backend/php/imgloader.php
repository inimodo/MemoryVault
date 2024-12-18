<?php
include_once  "./settings.php";

$_POST = json_decode(file_get_contents('php://input'), true);
$token = preg_replace('/[^a-zA-Z0-9\s]+/u','',$_POST['token']);

if($token != ACCESS_TOKEN)
{
  die('{"status":false}');
}

$quality = intval(preg_replace('/[^0-9\s]+/u','',$_POST['quality']));
$folder = preg_replace('/[^a-zA-Z0-9_\s]+/u','',str_replace(" ","_",$_POST['folder']));
$subFolder = preg_replace('/[^a-zA-Z0-9_\s]+/u','',str_replace(" ","_",$_POST['subfolder']));
$file = preg_replace('/[^a-zA-Z0-9\-\ ()._\s]+/u','',$_POST['file']);

if($quality <= 0 || $quality > 100 || !fileIsValid($file,VALID_FTYPE_IMG,VALID_FTYPE_VID))
{
  die('{"status":false}');
}

$filePath = DATA_PATH.$folder."/".$subFolder."/";
if($subFolder == "NONE")
{
  $filePath = DATA_PATH.$folder."/";
}
$filePath .= $file;

if(fileIsImg($file,VALID_FTYPE_IMG))
{
  $image = NULL;
  switch (getFileEnd($file)) {
    case 'png':
    $image = imagecreatefrompng($filePath);
      break;
    case 'jpeg':
    case 'jpg':
    $image = imagecreatefromjpeg($filePath);
      break;
  }
  imagejpeg($image, NULL, $quality) ;
}else
{
  echo file_get_contents($filePath);
}
 ?>
