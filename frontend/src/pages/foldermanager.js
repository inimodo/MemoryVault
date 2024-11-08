import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Backend from './../misc/websocket.js';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFolderTree,
  faCaretDown,
  faFolder,
  faFolderPlus,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

class FolderManager extends React.Component{

  constructor(props)
  {
    super(props);
    this.state = {
      folders:[],
      showCreateMenu:false,
      createMenuFolder:"",
      newFolderName:""
    };
    this.loadFolderList = this.loadFolderList.bind(this);
    this.addFolder = this.addFolder.bind(this);
    this.addSubFolder = this.addSubFolder.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.createMenuContent = this.createMenuContent.bind(this);
  }
  componentDidMount()
  {
    this.loadFolderList();
  }

  loadFolderList()
  {
    Backend.listFolders(this.props.token).then( (data) => {
      if(data.status == true)
      {
        this.setState({folders: data.folders});
      }
    });
  }

  addFolder(folder)
  {
    Backend.addFolder(this.props.token,folder).then( (data) => {
      console.log(data);
      if(data.status == true)
      {
        this.loadFolderList();
      }
    });
  }

  addSubFolder(folder,subFolder)
  {
    Backend.addSubFolder(this.props.token,folder,subFolder).then( (data) => {
      console.log(data);
      if(data.status == true)
      {
        this.loadFolderList();
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
          <FontAwesomeIcon icon={faFolderPlus} size="sm"/> {header}
        </DialogTitle>
        <DialogContentText sx={{ml:"2vh",mr:"2vh"}}>
          <FontAwesomeIcon icon={faTriangleExclamation} size="sm"/> Achtung!
          Ordner können nicht unbenannt oder gelöscht werden.<br/>
        </DialogContentText>

        <TextField
          error={!isValidName(this.state.newFolderName)}
          helperText={!isValidName(this.state.newFolderName)
            && "Ordnernamen dürfen nur Buchtstaben oder Zahlen beinhalten."}
          sx={{m:"2vh"}}
          label={this.state.createMenuFolder+"/"+this.state.newFolderName}
          onChange={(event) => {
            this.setState({newFolderName:event.target.value});
          }}
        />

        <DialogActions>
          <Button onClick={()=>{
            this.setState({showCreateMenu:false, newFolderName:""})
          }}>Abbrechen</Button>
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
          }}>Erstellen</Button>
        </DialogActions>

      </React.Fragment>
    );
  }
  render()
  {
    return (
      <React.Fragment>
        <Dialog open={this.props.show} onClose={this.props.close} maxWidth="xl" >
          <DialogTitle>
            <FontAwesomeIcon icon={faFolderTree} size="sm"/> Ordner Manager
          </DialogTitle>
          <Container fixed sx={{ mb:"2vh", width:"30vh" }}>
            <SimpleTreeView onItemSelectionToggle={this.handleSelection}>
            {
              this.state.folders.map( (folder) => (
                <TreeItem key={folder.folderName} itemId={folder.folderName}  label={folder.folderName}>
                  {
                    folder.subFolderNames.map( (subFolder,index) =>
                    (
                      <TreeItem key={subFolder} itemId={subFolder}  label={subFolder}/>
                    ))
                  }
                  <TreeItem sx={{color:'text.secondary'}} itemId={"createSubFolder#"+folder.folderName}
                    label={<><FontAwesomeIcon icon={faFolderPlus} size="sm"/> Unterordner Erstellen</>}/>
                </TreeItem>
              ))
            }
            <TreeItem sx={{color:'text.secondary'}} itemId={"createFolder"}
              label={<><FontAwesomeIcon icon={faFolderPlus} size="sm"/> Ordner Erstellen</>}/>

            </SimpleTreeView>

          </Container>
        </Dialog>
        <Dialog open={this.state.showCreateMenu}  maxWidth="xl" >
            {this.createMenuContent()}
        </Dialog>

      </React.Fragment>
    );
  }
}
export default FolderManager;
