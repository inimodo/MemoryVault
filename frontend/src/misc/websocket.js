import Settings from "./settings.js"
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
}
export default Backend;
