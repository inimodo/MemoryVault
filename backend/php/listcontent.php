<?php
include_once  "./settings.php";

$_POST = json_decode(file_get_contents('php://input'), true);
$token = preg_replace('/[^a-zA-Z0-9\s]+/u','',$_POST['token']);

if($token != ACCESS_TOKEN)
{
  die('{"status":false}');
}

$folder = preg_replace('/[^a-zA-Z0-9_\s]+/u','',str_replace(" ","_",$_POST['folder']));
$subFolder = preg_replace('/[^a-zA-Z0-9_\s]+/u','',str_replace(" ","_",$_POST['subfolder']));

$filePath = DATA_PATH.$folder."/".$subFolder."/";
if($subFolder == "NONE")
{
  $filePath = DATA_PATH.$folder."/";
}

$first = true;
$fileList = "";
$folderContent = scandir($filePath);
for ($index=0; $index < count($folderContent); $index++)
{
  if(is_dir($folderContent[$index]))
  {
      continue;
  }
  if(!fileIsValid($folderContent[$index],VALID_FTYPE_IMG,VALID_FTYPE_VID))
  {
      continue;
  }
  if($first)
  {
    $first = false;
    $fileList .= '"'.$folderContent[$index].'"';
    continue;
  }
  $fileList .= ',"'.$folderContent[$index].'"';
}

die('{"status":true, "files":['.$fileList.']}');

 ?>
