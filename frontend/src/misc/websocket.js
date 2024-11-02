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

  static async checktoken(_token)
  {
    return this.post("checktoken.php",{token:_token});
  }

}
export default Backend;
