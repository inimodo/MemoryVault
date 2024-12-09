import Alina from './Alina.png';
import Berkay from './Berkay.png';
import Bernd from './Bernd.png';
import Consti from './Consti.png';
import Danir from './Danir.png';
import Herman from './Herman.png';
import Keusch from './Keusch.png';
import Liam from './Liam.png';
import Markus from './Markus.png';
import Tobias from './Tobias.png';

const UserIcons = [Alina,Berkay,Bernd,Consti,Danir,Herman,Keusch,Liam,Markus,Tobias];
const UserNames = ["Alina","Berkay","Bernd","Consti","Danir","Herman","Keusch","Liam","Markus","Tobias"];

const UserData = {
  Icons:UserIcons,
  Names:UserNames,
  QuerryText:UserNames.map((name)=>"Von "+name).
  concat(UserNames.map((name)=>"Mit "+name)),
  QuerryCode:UserNames.map((name,index)=>"!"+index).
  concat(UserNames.map((name,index)=>"#"+index))
};
export default UserData;
