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
import { faFolderTree, faCaretDown, faFolder ,faFolderPlus} from '@fortawesome/free-solid-svg-icons'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import IconButton from '@mui/material/IconButton';

class FolderManager extends React.Component{

  constructor(props)
  {
    super(props);
    this.state = {
      folders:[]
    };
    this.loadFolderList = this.loadFolderList.bind(this);
    this.addFolder = this.addFolder.bind(this);
    this.addSubFolder = this.addSubFolder.bind(this);
    this.openFolderAddMenu = this.openFolderAddMenu.bind(this);
    this.openSubFolderAddMenu = this.openSubFolderAddMenu.bind(this);
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
        console.log(data.folders);
        this.setState({folders:data.folders});
      }
    });
  }

  addFolder(folder)
  {
    Backend.addFolder(this.props.token,folder).then( (data) => {
      console.log(data);
      if(data.status == true)
      {
      }
    });
  }

  addSubFolder(folder,subFolder)
  {
    Backend.addFolder(this.props.token,folder,subFolder).then( (data) => {
      console.log(data);
      if(data.status == true)
      {
      }
    });
  }

  openFolderAddMenu()
  {

  }
  openSubFolderAddMenu(folder)
  {
    console.log("asdas");
  }
  render()
  {
    return (
      <Dialog open={this.props.show} onClose={this.props.close} maxWidth="xl" >
        <DialogTitle><FontAwesomeIcon icon={faFolderTree} size="md"/> Ordner Manager</DialogTitle>
        <Container fixed sx={{ m: 2, width:"30vh" }}>
          <SimpleTreeView>
          {
            this.state.folders.map( (folder) => (
              <TreeItem itemId={folder.folderName} label={
                <>
                {folder.folderName}
                <IconButton
                          size="small"
                          onClick={this.openSubFolderAddMenu(folder.folderName)}
                          sx={{ color: 'text.secondary' ,float:'right'}}
                        >
                          <FontAwesomeIcon icon={faFolderPlus} size="md"/>
                </IconButton>
                </>
              }>
              {
                folder.subFolderNames.map( (subFolder,index) =>
                (
                    <TreeItem itemId={subFolder+index} label={folder.folderName}/>
                ))
              }
              </TreeItem>
            ))
          }
          </SimpleTreeView>
          <IconButton
                    size="small"
                    onClick={this.openFolderAddMenu}
                    sx={{ color: 'text.secondary' }}
                  >
                    <FontAwesomeIcon icon={faFolderPlus} size="md"/>
          </IconButton>
        </Container>
      </Dialog>
    );
  }
}
export default FolderManager;
