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
$user = intval(preg_replace('/[^0-9\s]+/u','',$_POST['user']));

switch ($opcode) {
  case 0: // List
    $found = count(scandir(FTP_PATH))-2;
    die('{"status":true,"found":'.$found.'}');
    break;
  case 1: // Import
    $movedFiles = 0;
    $failedFiles = 0;
    $files = scandir(FTP_PATH);
    for ($index=2; $index < count($files); $index++)
    {
      if(is_dir($files[$index]))
      {
        $failedFiles++;
        continue;
      }

      if(!fileIsValid($files[$index]))
      {
        $failedFiles++;
        continue;
      }

      $filePath = DATA_PATH.$folder."/".$subFolder."/".$files[$index];
      if($subFolder == "NONE")
      {
        $filePath = DATA_PATH.$folder."/".$files[$index];
      }
      $jsonData = '{"user":'.$user.',"cdate":'.filectime(FTP_PATH.$files[$index]).',"hashtags":[]}';
      $jsonDataPath = $filePath.".json";

      rename(FTP_PATH.$files[$index],$filePath);
      file_put_contents($jsonDataPath, $jsonData);
      $movedFiles++;
    }
    die('{"status":true,"moved":'.$movedFiles.',"failed":'.$failedFiles.'}');
    break;
}

 ?>
