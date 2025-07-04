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

  static async listFolders(token,querry="")
  {
    return this.post("foldermanager.php",{
      token:token,
      opcode:0,
      querry:querry
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

  static async listFolderContent(token,folder,subFolder,querry)
  {
    return this.post("listcontent.php",
    {
      token:token,
      folder:folder,
      subfolder:subFolder,
      querry:querry
    });
  }

  static async getImgData(token,file,folder,subFolder)
  {
    return this.post("imgdatamanager.php",
    {
      token:token,
      opcode:0,
      file:file.fileName,
      folder:folder,
      subfolder:subFolder,
    });
  }

  static async getAddUserInImg(token,file,folder,subFolder,user)
  {
    return this.post("imgdatamanager.php",
    {
      token:token,
      user:user,
      opcode:1,
      file:file.fileName,
      folder:folder,
      subfolder:subFolder,
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

  static async getContentPreview(token,file,folder,subFolder)
  {
    const fileName = file.fileName;
    const body = {
      opcode:0,
      token:token,
      file:file.fileName,
      folder:folder,
      subfolder:subFolder
    };
    const response = await Axios({
      method:"POST",
      url:Settings.backendPath + "imgloader.php",
      responseType: "blob",
      data:body
    });
    return response;
  }
  static async getContentFull(token,file,folder,subFolder)
  {
    const fileName = file.fileName;
    const body = {
      opcode:1,
      token:token,
      file:file.fileName,
      folder:folder,
      subfolder:subFolder
    };
    const response = await Axios({
      method:"POST",
      url:Settings.backendPath + "imgloader.php",
      responseType: "blob",
      data:body
    });
    return response;
  }

  static async _getContent(token,file,folder,subFolder,quality)
  {

    const fileName = file.fileName;
    var headers = {'Content-Type': 'video/mp4'};
    if(file.isImage)
    {
      headers = {'Content-Type': 'image/jpeg'};
    }
    const body = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: headers,
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({
        token:token,
        file:file.fileName,
        folder:folder,
        subfolder:subFolder,
        quality:quality
      })
    }
    const response = await fetch(Settings.backendPath + "imgloader.php", body);
    return response;
  }

}
export default Backend;
