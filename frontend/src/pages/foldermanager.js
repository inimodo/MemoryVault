import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Backend from './../misc/websocket.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFolderTree,
  faFolderPlus,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
class FolderManager extends React.Component{

  constructor(props)
  {
    super(props);
    this.state = {
      folders:[],
      showCreateMenu:false,
      createMenuFolder:"",
      newFolderName:"",
      folderAddOpStatus:false,
      folderAddOpMsg:"",
      showError:false
    };
    this.loadFolderList = this.loadFolderList.bind(this);
    this.addFolder = this.addFolder.bind(this);
    this.addSubFolder = this.addSubFolder.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.createMenuContent = this.createMenuContent.bind(this);
  }

  componentDidUpdate(prevProps)
  {
    if(this.props.refetch !== prevProps.refetch)
    {
      this.loadFolderList();
    }
  }

  componentDidMount()
  {
    this.loadFolderList();
  }

  loadFolderList()
  {
    Backend.listFolders(this.props.token).then( (data) => {
      if(data.status === true)
      {
        this.setState({folders: data.folders});
      }
    });
  }

  addFolder(folder)
  {
    Backend.addFolder(this.props.token,folder).then( (data) => {
      this.setState({
        folderAddOpStatus:data.status,
        folderAddOpMsg:data.msg,
        showError:true
      });
      if(data.status === true)
      {
        this.props.forceRefetch();
      }
    });
  }

  addSubFolder(folder,subFolder)
  {
    Backend.addSubFolder(this.props.token,folder,subFolder).then( (data) => {
      this.setState({
        folderAddOpStatus:data.status,
        folderAddOpMsg:data.msg,
        showError:true
      });
      if(data.status === true)
      {
        this.props.forceRefetch();
      }
    });
  }

  handleSelection(event, itemId, isSelected)
  {
    if(isSelected && itemId.includes('#'))
    {
      const op = itemId.split('#');
      if(op[0] === "createSubFolder")
      {
        this.setState({
          showCreateMenu:true,
          createMenuFolder:op[1]
        });
      }
    }else if(isSelected && itemId ===  "createFolder")
    {
      this.setState({
        showCreateMenu:true,
        createMenuFolder:""
      });
    }
  }

  createMenuContent()
  {
    var header = " Neuen Ordner Erstellen";
    if(this.state.createMenuFolder !== "")
    {
      header = " Neuen Unterordner Erstellen";
    }
    const isValidName = (text) =>{
      if(text === "")return false;
      return text.replace(/([^A-Za-z0-9 ])/g,"") === text;
    };
    return  (
      <React.Fragment>
        <DialogTitle>
          <FontAwesomeIcon
            icon={faFolderPlus}
            size="sm"
          />
          {header}
        </DialogTitle>
        <DialogContentText
          sx={{ml:"24px",mr:"24px"}}
        >
          <Typography
            variant="subtitle2"
            sx={{color:"#f44336",backgroundColor:"#212121",padding:"1.5vh",borderRadius:"4px"}}
          >
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              size="sm"
              style={{marginRight:"1vh"}}
            />
            Achtung! Ordner können nicht unbenannt oder gelöscht werden.
          </Typography>
        </DialogContentText>

        <TextField
          error={!isValidName(this.state.newFolderName)}
          helperText={!isValidName(this.state.newFolderName)
            && "Ordnernamen dürfen nur Buchtstaben oder Zahlen beinhalten."}
          sx={{m:"24px"}}
          label={this.state.createMenuFolder+"/"+this.state.newFolderName}
          onChange={(event) => {
            this.setState({newFolderName:event.target.value});
          }}
        />

        <DialogActions>
          <Button
            onClick={()=>{
              this.setState({
                showCreateMenu:false,
                newFolderName:""
              })}}
          >
            Abbrechen
          </Button>
          <Button
            disabled={!isValidName(this.state.newFolderName)}
            onClick={()=>{
              if(isValidName(this.state.newFolderName))
              {
                  if(this.state.createMenuFolder === "")
                  {
                    this.addFolder(this.state.newFolderName);
                  }else
                  {
                    this.addSubFolder(this.state.createMenuFolder,this.state.newFolderName);
                  }
              }
              this.setState({showCreateMenu:false, newFolderName:""})
            }}
          >
            Erstellen
          </Button>
        </DialogActions>

      </React.Fragment>
    );
  }
  render()
  {
    var severity = "success";
    if(this.state.folderAddOpStatus === false)
    {
      severity = "error";
    }
    return (
      <React.Fragment>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={this.state.showError}
        autoHideDuration={3000}
        onClose={()=>this.setState({showError:false})}
      >
        <Alert
          onClose={()=>this.setState({showError:false})}
          severity= {severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {this.state.folderAddOpMsg}
        </Alert>
      </Snackbar>
        <Dialog
          open={this.props.show}
          onClose={this.props.close}
          maxWidth="xl"
          sx={{borderRadius:"1vh"}}
        >
          <DialogTitle>
            <FontAwesomeIcon
              icon={faFolderTree}
              size="sm"
              style={{paddingRight:"1vh"}}
            />
            Ordner Verwaltung
          </DialogTitle>
          <Container
            sx={{ mb:"2vh", minWidth:"30vh",paddingLeft:"24px",paddingRight:"24px" }}
          >
            <SimpleTreeView
              onItemSelectionToggle={this.handleSelection}
            >
            {
              this.state.folders.map( (folder) => (
                <TreeItem
                  key={folder.folderName}
                  itemId={folder.folderName}
                  label={folder.folderName}
                >
                  {
                    folder.subFolders.map( (subFolder,index) =>
                    (
                      <TreeItem
                        key={subFolder}
                        itemId={subFolder.subFolderName}
                        label={subFolder.subFolderName}
                      />
                    ))
                  }
                <TreeItem
                  sx={{color:'text.secondary',padding:0}}
                  itemId={"createSubFolder#"+folder.folderName}
                  label={
                    <>
                      <FontAwesomeIcon
                        icon={faFolderPlus}
                        size="sm"
                        style={{paddingRight:"1vh"}}
                      />
                      Unterordner Erstellen
                    </>
                  }
                />
                </TreeItem>
              ))
            }
            <TreeItem
              sx={{color:'text.secondary'}}
              itemId={"createFolder"}
              label={
                <>
                  <FontAwesomeIcon
                    icon={faFolderPlus}
                    size="sm"
                    style={{paddingRight:"1vh"}}
                  />
                  Ordner Erstellen
                </>
              }
            />
            </SimpleTreeView>
          </Container>
        </Dialog>
        <Dialog
          open={this.state.showCreateMenu}
          maxWidth="xl"
        >
          {this.createMenuContent()}
        </Dialog>
      </React.Fragment>
    );
  }
}
export default FolderManager;
