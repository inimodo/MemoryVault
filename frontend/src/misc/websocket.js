
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
    const response = await fetch(url,this.headers(body));
    return response.json();
  }
}
class Backend extends WebSocket
{

  static async access(email,captcha_token)
  {
    return this.post("https://www.ini02.xyz/access.php",{email:email,"g-recaptcha-response":captcha_token});
  }

}
export default Backend;
