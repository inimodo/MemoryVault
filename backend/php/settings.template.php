<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true ");
header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");

define("ACCESS_TOKEN","! TOKEN HERE !");
define("DATA_PATH",$_SERVER['DOCUMENT_ROOT']."/derh/data/");
define("FTP_PATH",$_SERVER['DOCUMENT_ROOT']."/derh/ftp/");
define("DL_PATH",$_SERVER['DOCUMENT_ROOT']."/derh/dl/");
define("VENDOR_PATH",$_SERVER['DOCUMENT_ROOT']."/derh/vendor/");

define("VALID_FTYPE_IMG",array('jpg','jpeg','png'));
define("VALID_FTYPE_VID",array('mp4','mov','wmv'));

function fileIsValid($file,$valid_img,$valid_vid)
{
  $type = strtolower(pathinfo($file,PATHINFO_EXTENSION));
  return in_array($type,$valid_img) || in_array($type,$valid_vid);
}

function fileIsImg($file,$valid_img)
{
  $type = strtolower(pathinfo($file,PATHINFO_EXTENSION));
  return in_array($type,$valid_img);
}

function getFileEnd($file)
{
  return strtolower(pathinfo($file,PATHINFO_EXTENSION));
}

function imgQuerryCheck($file,$querry)
{
  if($querry == "") return true;

  $user = intval(preg_replace('/[^0-9\s]+/u','',$querry));
  $jsonData = json_decode(file_get_contents($file.".json"));

  if(str_contains($querry,"!"))
  {
    if($jsonData->user == $user) return true;
  }
  if(str_contains($querry,"#"))
  {
    if(in_array($user,$jsonData->inimg)) return true;
  }
  return false;
}
 ?>
