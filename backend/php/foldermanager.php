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
$querry = preg_replace('/[^0-9#!\s]+/u','',$_POST['querry']);

function countFiles($folder,$querry)
{
  include_once  "./settings.php";
  $folderContent = scandir($folder);
  $counter = 0;
  for ($index=0; $index < count($folderContent); $index++)
  {
    if(is_dir($folder."/".$folderContent[$index])) continue;
    if(!fileIsValid($folderContent[$index],VALID_FTYPE_IMG,VALID_FTYPE_VID)) continue;
    if(imgQuerryCheck($folder."/".$folderContent[$index],$querry))
    {
      $counter++;
    }
  }
  return $counter;
}

switch ($opcode)
{
  case 0: // List all folders
    $folders = scandir(DATA_PATH);
    $jsonFolderList = "";
    $foldersAdded = 0;
    for ($folderIndex = 2; $folderIndex < count($folders); $folderIndex++)
    {
      $jsonSubFolderList = "";
      if(is_dir(DATA_PATH.$folders[$folderIndex]))
      {
        $subFolders = scandir(DATA_PATH.$folders[$folderIndex]);
        $subFoldersAdded = 0;
        for ($subFolderIndex = 2; $subFolderIndex < count($subFolders); $subFolderIndex++)
        {
          if(is_dir(DATA_PATH.$folders[$folderIndex]."/".$subFolders[$subFolderIndex]))
          {

            if($subFoldersAdded != 0)
            {
              $jsonSubFolderList .= ",";
            }

            $fileCount = countFiles(DATA_PATH.$folders[$folderIndex]."/".$subFolders[$subFolderIndex], $querry);
            //$fileCount = (count(scandir(DATA_PATH.$folders[$folderIndex]."/".$subFolders[$subFolderIndex]))-2)/2;
            $jsonSubFolderList .= '{"subFolderName":"'.str_replace("_"," ",$subFolders[$subFolderIndex]).'","fileCount":'.$fileCount.'}';
            $subFoldersAdded++;
          }
        }
        if($foldersAdded  != 0)
        {
          $jsonFolderList .= ",";
        }
        $fileCount = countFiles(DATA_PATH.$folders[$folderIndex], $querry);
        //$fileCount = (count($subFolders)-2-$subFoldersAdded)/2;
        $jsonFolderList .= '{"folderName":"'.str_replace("_"," ",$folders[$folderIndex]).'","fileCount":'.$fileCount.',"subFolders":['.$jsonSubFolderList.']}';
        $foldersAdded++;
      }
    }
    die('{"status":true, "folders": ['.$jsonFolderList.']}');
    break;
  case 1: // Add folder
    if(mkdir(DATA_PATH.$folder))
    {
      die('{"status":true,"msg":"Ordner wurde erfolgreich erstellt."}');
    }
    die('{"status":false,"msg":"Ordner konnte nicht erstellt werden."}');
  case 2: // Add subfolder
      if(mkdir(DATA_PATH.$folder."/".$subFolder))
      {
        die('{"status":true,"msg":"Unter Ordner wurde erfolgreich erstellt."}');
      }
      die('{"status":false,"msg":"Unter Ordner  konnte nicht erstellt werden."}');

  default:
    die('{"status":false}');
    break;
}
 ?>
