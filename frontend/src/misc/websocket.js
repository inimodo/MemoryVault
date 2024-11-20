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
    return this.post("checktoken.php",{token:token});
  }

  static async listFolders(token)
  {
    return this.post("foldermanager.php",{token:token,opcode:0});
  }
  static async addFolder(token,folder)
  {
    return this.post("foldermanager.php",{token:token,opcode:1,folder:folder});
  }
  static async addSubFolder(token,folder,subfolder)
  {
    return this.post("foldermanager.php",{token:token,opcode:2,folder:folder,subfolder:subfolder});
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
}
export default Backend;
