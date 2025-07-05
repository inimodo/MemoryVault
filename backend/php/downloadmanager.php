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
$querry = preg_replace('/[^0-9#!\s]+/u','',$_POST['querry']);

$filePath = DATA_PATH.$folder."/".$subFolder."/";
$zipName = $folder.".".$subFolder.".zip";
if($subFolder == "NONE")
{
  $zipName = $folder.".zip";
  $filePath = DATA_PATH.$folder."/";
}

$zipPath = DL_PATH.$zipName;
if(is_file($zipPath))
{
    unlink($zipPath);
}

$zip = new ZipArchive;
if($zip -> open($zipPath, ZipArchive::CREATE ) !== TRUE)
{
  die('{"status":false}');
}
$fileCount=0;
$folderContent = scandir($filePath);
for ($index=0; $index < count($folderContent); $index++)
{
  if(is_dir($folderContent[$index]))continue;
  if(!fileIsValid($folderContent[$index],VALID_FTYPE_IMG,VALID_FTYPE_VID))continue;
  if(!imgQuerryCheck($filePath.$folderContent[$index],$querry))continue;
  $zip -> addFile($filePath.$folderContent[$index], $folderContent[$index]);
  $fileCount++;
}
$zip ->close();
if($fileCount == 0)
{
  die('{"status":false}');
}
die('{"status":true,"link":"https://memoryvault.at/dl/'.$zipName.'"}');
 ?>
