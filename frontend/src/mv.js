import React from 'react';
import ContentLister from './pages/contentlister.js';
import FolderManager from './pages/foldermanager.js';
import UploadContent from './pages/uploadcontent.js';
import UserSelect from './content/userselect.js';
import UserList from './userimages/userlist.js';
import Backend from './misc/websocket.js';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderTree, faPhotoFilm, faCloudArrowUp} from '@fortawesome/free-solid-svg-icons'
import Fab from '@mui/material/Fab';

class MemoryVault extends React.Component{

  constructor(props)
  {
    super(props);
    const params = new URLSearchParams(window.location.search);
    this.state =
    {
      allowAccess:false,
      token: params.get("token"),
      user:-1,
      showUploadMenu:false,
      showSettingsMenu:false
    };

    this.selectUser = this.selectUser.bind(this);
    this.selectPage = this.selectPage.bind(this);
    this.closeMenues = this.closeMenues.bind(this);
  }

  componentDidMount()
  {
    Backend.checkToken(this.state.token).then( (data) => {
      if(data.status == true)
      {
        this.setState({ allowAccess:true });
      }
    });
  }
  selectUser(selUser)
  {
    this.setState({user:selUser});
  }

  selectPage(page)
  {
    this.setState({page:page});
  }

  closeMenues()
  {
    this.setState({
      showUploadMenu:false,
      showSettingsMenu:false
    });
  }

  render(){
  if(!this.state.allowAccess)
  {
    return (
      <Dialog open={true} maxWidth="xl">
        <DialogTitle>Warte auf Zugriffsrechte...</DialogTitle>
      </Dialog>
    );
  }

  return (
      <>
        <UserSelect selectUser={this.selectUser} user={this.state.user}/>
        <FolderManager
          show={this.state.showSettingsMenu}
          close={this.closeMenues}
          token={this.state.token}/>
        <UploadContent
          show={this.state.showUploadMenu}
          close={this.closeMenues}
          token={this.state.token}
          user={this.state.user}
          />

        <Fab sx={{position:'absolute', bottom: 15, right: 15, width: 50, height: 50 }}
          onClick={()=>{this.setState({showUploadMenu:true})}}>
          <FontAwesomeIcon icon={faCloudArrowUp} size="xl"/>
        </Fab>
        <Fab sx={{position:'absolute', bottom: 15, right: 80 , width: 50, height: 50 }}
          onClick={()=>{this.setState({showSettingsMenu:true})}}>
          <FontAwesomeIcon icon={faFolderTree} size="xl"/>
        </Fab>
        <Fab sx={{position:'absolute', bottom: 15, left: 15 ,width: 50, height: 50 }}
          onClick={()=>{this.setState({user:-1})}}>
          <Avatar sx={{ width: 50, height: 50 }} src={UserList.Icons[this.state.user]}/>
        </Fab>
      </>
    );
  }
}

export default MemoryVault;
