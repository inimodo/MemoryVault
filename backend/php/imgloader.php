<?php
include_once  "./settings.php";

$_POST = json_decode(file_get_contents('php://input'), true);
$token = preg_replace('/[^a-zA-Z0-9\s]+/u','',$_POST['token']);

if($token != ACCESS_TOKEN)
{
  die('{"status":false}');
}


$op = intval(preg_replace('/[^0-9\s]+/u','',$_POST['opcode']));
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
$filePath .= $file;

function createVideoThumbnail($filePath)
{
  include_once  "./settings.php";
  require VENDOR_PATH.'autoload.php';
  $ffmpeg = FFMpeg\FFMpeg::create();
  $video = $ffmpeg->open($filePath);
  $frame = $video->frame(FFMpeg\Coordinate\TimeCode::fromSeconds(0.1));
  $frame->save($filePath.".thumb");
}

switch ($op) {
  case 1: // 100% Quality
    if(fileIsImg($file,VALID_FTYPE_IMG))
    {
      $image = NULL;
      switch (getFileEnd($file))
      {
        case 'png':
        $image = imagecreatefrompng($filePath);
          break;
        case 'jpeg':
        case 'jpg':
        $image = imagecreatefromjpeg($filePath);
          break;
      }

      imagejpeg($image, NULL, 100) ;
    }else
    {
      echo file_get_contents($filePath);
    }
    break;

  case 0: // 10% Preview:
  if(fileIsImg($file,VALID_FTYPE_IMG))
  {
      $image = NULL;
      switch (getFileEnd($file))
      {
        case 'png':
        $image = imagecreatefrompng($filePath);
          break;
        case 'jpeg':
        case 'jpg':
        $image = imagecreatefromjpeg($filePath);
          break;
      }

      imagejpeg($image, NULL, 15) ;
    }else
    {
      if(!file_exists($filePath.".thumb"))
      {
        createVideoThumbnail($filePath);
      }
      imagejpeg(imagecreatefromjpeg($filePath.".thumb"), NULL, 15) ;
    }
    break;
}

 ?>
