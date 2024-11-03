<?php
include_once  "./settings.php";

$_POST = json_decode(file_get_contents('php://input'), true);
$token = preg_replace('/[^a-zA-Z0-9\s]+/u','',$_POST['token']);

if($token != ACCESS_TOKEN)
{
  die('{"status":false}');
}

$opcode = intval(preg_replace('/[^0-9\s]+/u','',$_POST['opcode']));
$folder = preg_replace('/[^a-zA-Z0-9_\s]+/u','',$_POST['folder']);
$subFolder = preg_replace('/[^a-zA-Z0-9_\s]+/u','',$_POST['subfolder']);

switch ($opcode)
{
  case 0: // List all folders
    $folders = scandir(DATA_PATH);
    $jsonFolderList = "";
    for ($folderIndex = 2; $folderIndex < count($folders); $folderIndex++)
    {
      $jsonSubFolderList = "";
      if(is_dir(DATA_PATH.$folders[$folderIndex]))
      {
        $subFolders = scandir(DATA_PATH.$folders[$folderIndex]);
        for ($subFolderIndex = 2; $subFolderIndex < count($subFolders); $subFolderIndex++)
        {
          if(is_dir(DATA_PATH.$folders[$folderIndex]."/".$subFolders[$subFolderIndex]))
          {
            $jsonSubFolderList .= '"'.$subFolders[$subFolderIndex].'"';
            if($subFolderIndex != count($subFolders)-1)
            {
              $jsonSubFolderList .= ",";
            }
          }
        }
        $jsonFolderList .= '{"folderName":"'.$folders[$folderIndex].'","subFolderNames":['.$jsonSubFolderList.']}';
        if($folderIndex != count($folders)-1)
        {
          $jsonFolderList .= ",";
        }
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
