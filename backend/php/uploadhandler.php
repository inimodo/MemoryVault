<?php
include_once  "./settings.php";

$token = preg_replace('/[^a-zA-Z0-9\s]+/u','',$_POST['token']);

if($token != ACCESS_TOKEN)
{
  die('{"status":false}');
}

$opcode = intval(preg_replace('/[^0-9\s]+/u','',$_POST['opcode']));
$cdate = intval(preg_replace('/[^0-9\s]+/u','',$_POST['cdate']));
$user = intval(preg_replace('/[^0-9\s]+/u','',$_POST['user']));
$folder = preg_replace('/[^a-zA-Z0-9_\s]+/u','',str_replace(" ","_",$_POST['folder']));
$subFolder = preg_replace('/[^a-zA-Z0-9_\s]+/u','',str_replace(" ","_",$_POST['subFolder']));

function fileIsValid($file)
{
  include_once  "./settings.php";
  $type = strtolower(pathinfo($file,PATHINFO_EXTENSION));
  return in_array($type,VALID_FTYPE);
}

if(!fileIsValid($_FILES['file']['name']))
{
  die('{"status":false ,"code":1, "msg":"Datei besitzt einen ungültigen Dateitypen"}');
}

$filePath = DATA_PATH.$folder."/".$subFolder."/".$_FILES["file"]["name"];
if($subFolder == "NONE")
{
  $filePath = DATA_PATH.$folder."/".$_FILES["file"]["name"];
}
$jsonData = '{"user":'.$user.',"cdate":'.$cdate.'}';
$jsonDataPath = $filePath.".json";

if (move_uploaded_file($_FILES["file"]["tmp_name"],$filePath))
{
  file_put_contents($jsonDataPath, $jsonData);
  die('{"status":true , "msg":"Datei wurde erfolgreich Hochgeladen."}');
}
die('{"status":false ,"code":0, "msg":"Datei konnte nicht Hochgeladen werden."}');

 ?>
