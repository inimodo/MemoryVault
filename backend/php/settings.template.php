<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true ");
header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");

define("ACCESS_TOKEN","[TOKEN HERE]");
define("DATA_PATH",$_SERVER['DOCUMENT_ROOT']."/derh/data/");
define("FTP_PATH",$_SERVER['DOCUMENT_ROOT']."/derh/ftp/");
define("VALID_FTYPE",array('jpg','jpeg','png','mp4','mov','wmv'));
//define("USERS",array("Alina","Berkay","Bernd","Consti","Danir","Herman","Keusch","Liam","Markus","Tobias"));

 ?>
