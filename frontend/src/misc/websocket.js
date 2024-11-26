import Settings from "./settings.js"
import Axios from 'axios';

class WebSocket {
  static headers(body)
  {
    var header = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'},
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    }
    header.body = JSON.stringify(body)
    return header;
  }

  static async post(url,body)
  {
    const response = await fetch(Settings.backendPath + url, this.headers(body));
    return response.json();
  }
}
class Backend extends WebSocket
{

  static async checkToken(token)
  {
    return this.post("checktoken.php",{
      token:token
    });
  }

  static async listFolders(token)
  {
    return this.post("foldermanager.php",{
      token:token,
      opcode:0
    });
  }
  static async addFolder(token,folder)
  {
    return this.post("foldermanager.php",{
      token:token,
      opcode:1,
      folder:folder
    });
  }
  static async addSubFolder(token,folder,subfolder)
  {
    return this.post("foldermanager.php",{
      token:token,
      opcode:2,
      folder:folder,
      subfolder:subfolder
    });
  }
  static async listImportFiles(token)
  {
    return this.post("importhandler.php",
    {
      token:token,
      opcode:0
    });
  }
  static async importFiles(token, folder,user, progressEvent)
  {
    var folderStruct = folder.split('/');
    if(!folder.includes('/')) folderStruct[1] = "NONE";
    return this.post("importhandler.php",
    {
      token:token,
      opcode:1,
      folder:folderStruct[0],
      subfolder:folderStruct[1],
      user:user
    });
  }
  static async listFolderContent(token,folder,subFolder)
  {
    return this.post("listcontent.php",
    {
      token:token,
      folder:folder,
      subfolder:subFolder
    });
  }
  static async uploadFile(token, file, folder,user, progressEvent)
  {
    var formData = new FormData();
    var folderStruct = folder.split('/');
    if(!folder.includes('/')) folderStruct[1] = "NONE";
    formData.append("file", file);
    formData.append("token", token);
    formData.append("cdate", file.lastModified);
    formData.append("folder", folderStruct[0]);
    formData.append("subFolder", folderStruct[1]);
    formData.append("user", user);
    return Axios.post(Settings.backendPath + 'uploadhandler.php', formData, {
     onUploadProgress: progressEvent,
     headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
  static getFile(token,file,folder,subFolder)
  {
   var getRandomInt = ((min, max) => {
      const minCeiled = Math.ceil(min);
      const maxFloored = Math.floor(max);
      return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    });
    return Settings.backendPath + 'imgloader.php?token='+token
                                              +'&file='+file
                                              +'&quality='+Settings.prevImgQual
                                              +'&folder='+folder
                                              +'&subfolder='+subFolder
                                              +'&'+getRandomInt(10000,99999);
  }
}
export default Backend;
