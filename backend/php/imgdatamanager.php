<?php
include_once  "./settings.php";

$_POST = json_decode(file_get_contents('php://input'), true);
$token = preg_replace('/[^a-zA-Z0-9\s]+/u','',$_POST['token']);

if($token != ACCESS_TOKEN)
{
  die('{"status":false}');
}

$op = intval(preg_replace('/[^0-9\s]+/u','',$_POST['opcode']));
$user = intval(preg_replace('/[^0-9\s]+/u','',$_POST['user']));
$folder = preg_replace('/[^a-zA-Z0-9_\s]+/u','',str_replace(" ","_",$_POST['folder']));
$subFolder = preg_replace('/[^a-zA-Z0-9_\s]+/u','',str_replace(" ","_",$_POST['subfolder']));
$file = preg_replace('/[^a-zA-Z0-9\-\ ()._\s]+/u','',$_POST['file']);

if(!fileIsValid($file,VALID_FTYPE_IMG,VALID_FTYPE_VID))
{
  die('{"status":false}');
}

$filePath = DATA_PATH.$folder."/".$subFolder."/";
if($subFolder == "NONE")
{
  $filePath = DATA_PATH.$folder."/";
}
$filePath .= $file.".json";

switch ($op) {
  case 0: // List img data
    $imgData = json_decode(file_get_contents($filePath));
    $imgData->status = true;
    echo json_encode($imgData);
    break;
  case 1: // Add user
    $imgData = json_decode(file_get_contents($filePath));
    if(in_array($user,$imgData->inimg))
    {
      die('{"status":false}');
    }
    array_push($imgData->inimg,$user);
    file_put_contents($filePath,json_encode($imgData));
    $imgData->status = true;
    echo json_encode($imgData);
    break;
  case 2:
    break;

}


 ?>
