import Alina from './Alina.png';
import Berkay from './Berkay.png';
import Bernd from './Bernd.png';
import Consti from './Consti.png';
import Danir from './Danir.png';
import Hermann from './Hermann.png';
import Keusch from './Keusch.png';
import Liam from './Liam.png';
import Markus from './Markus.png';
import Tobias from './Tobias.png';
import Adam from './Adam.png';
import Sarah from './Sarah.png';
import Mitija from './Mitija.png';
import Niklas from './Niklas.png';
import Simon from './Simon.png';

const UserIcons = [Alina,Berkay,Bernd,Consti,Danir,Hermann,Keusch,Liam,Markus,Tobias,Adam,Sarah,Mitija,Niklas,Simon];
const UserNames = ["Alina","Berkay","Bernd","Consti","Danir","Hermann","Keusch","Liam","Markus","Tobias","Adam","Sarah","Mitja","Niki","Simon"];

const UserData = {
  Icons:UserIcons,
  Names:UserNames,
  QuerryText:UserNames.map((name)=>"Von "+name).
  concat(UserNames.map((name)=>"Mit "+name)),
  QuerryCode:UserNames.map((name,index)=>"!"+index).
  concat(UserNames.map((name,index)=>"#"+index))
};
export default UserData;
