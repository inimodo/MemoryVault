import React from 'react';
import ContentLister from './pages/contentlister.js';
import FolderManager from './pages/foldermanager.js';
import UploadContent from './pages/uploadcontent.js';
import UserSelect from './content/userselect.js';
import UserList from './userimages/userlist.js';
import Backend from './misc/websocket.js';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderTree, faCloudArrowUp} from '@fortawesome/free-solid-svg-icons'
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

class MemoryVault extends React.Component{

  constructor(props)
  {
    super(props);
    const params = new URLSearchParams(window.location.search);
    this.state =
    {
      refetch:0,
      allowAccess:false,
      token: params.get("token"),
      user:-1,
      showUploadMenu:false,
      showSettingsMenu:false,
      querry:""
    };

    this.selectUser = this.selectUser.bind(this);
    this.selectPage = this.selectPage.bind(this);
    this.closeMenues = this.closeMenues.bind(this);
    this.forceRefetch = this.forceRefetch.bind(this);
  }

  componentDidMount()
  {
    Backend.checkToken(this.state.token).then( (data) => {
      if(data.status === true)
      {
        this.setState({
          allowAccess:true
        });
      }
    });
  }

  forceRefetch()
  {
      this.setState({
        refetch:Math.random()
      });
  }

  selectUser(selUser)
  {
    this.setState({
      user:selUser
    });
  }

  selectPage(page)
  {
    this.setState({
      page:page
    });
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
      <Dialog
        open={true}
        maxWidth="xl"
      >
        <DialogTitle>
          Warte auf Zugriffsrechte...
        </DialogTitle>
      </Dialog>
    );
  }

  return (
      <React.Fragment>
        <UserSelect
          selectUser={this.selectUser}
          user={this.state.user}
        />
        <FolderManager
          show={this.state.showSettingsMenu}
          close={this.closeMenues}
          token={this.state.token}
          refetch={this.state.refetch}
          forceRefetch={this.forceRefetch}
        />
        <UploadContent
          show={this.state.showUploadMenu}
          close={this.closeMenues}
          token={this.state.token}
          user={this.state.user}
          refetch={this.state.refetch}
          forceRefetch={this.forceRefetch}
        />
        <ContentLister
          token={this.state.token}
          user={this.state.user}
          refetch={this.state.refetch}
          forceRefetch={this.forceRefetch}
          querry={this.state.querry}
        />
        <Fab
          sx={{position:'fixed', bottom: 15, right: 15, width: 50, height: 50, boxShadow:"0px 0px 10px 5px #121212"}}
          onClick={()=>{
            this.setState({
              showUploadMenu:true
            })}
          }
        >
          <FontAwesomeIcon
            icon={faCloudArrowUp}
            size="xl"
          />
        </Fab>
        <Fab
          sx={{position:'fixed', bottom: 15, right: 80 , width: 50, height: 50 , boxShadow:"0px 0px 10px 5px #121212"}}
          onClick={()=>{
            this.setState({
              showSettingsMenu:true
            })}
          }
        >
          <FontAwesomeIcon
            icon={faFolderTree}
            size="xl"
          />
        </Fab>
        <Fab
          sx={{position:'fixed', bottom: 15, left: 15 ,width: 50, height: 50 , boxShadow:"0px 0px 10px 5px #121212"}}
          onClick={()=>{this.setState({user:-1})}}>
          <Avatar sx={{ width: 50, height: 50 }} src={UserList.Icons[this.state.user]}/>
        </Fab>
        <Box sx={{
            position:'fixed',
            bottom: 15,
            left: 80,
            width: 150,
            height: 50
          }}
        >
          <Autocomplete
            freeSolo
            sx ={{
              backgroundColor: "#121212",
              borderRadius: "50px",
              boxShadow:"0px 0px 10px 5px #121212"
            }}
            options={UserList.QuerryText.map((querry) => querry)}
            renderInput={(params) =>
              <TextField
                {...params}
                sx={{"& .MuiOutlinedInput-root": {borderRadius: "50px"}}}
                label="Filter"
              />}
            onChange={(event, newValue) => {
              if(UserList.QuerryText.includes(newValue))
              {
                this.setState({
                  querry:UserList.QuerryCode[UserList.QuerryText.indexOf(newValue)]
                });
              }
              if(newValue === null)
              {
                this.setState({
                  querry:""
                });
              }
            }}
          />
        </Box>
      </React.Fragment>
    );
  }
}

export default MemoryVault;
