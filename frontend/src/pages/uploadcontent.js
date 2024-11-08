import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Backend from './../misc/websocket.js';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCloudArrowUp,
  faPhotoFilm,
  faFolder,
  faFolderPlus,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons'
import DialogContentText from '@mui/material/DialogContentText';
import axios from 'axios';


class UploadContent extends React.Component{

  constructor(props)
  {
    super(props);

    this.state = {
      page: 1,
      folderList: [],
      selectedFolder:'',
      selectedFiles:[]
    };

    this.setPage = this.setPage.bind(this);
    this.loadFolderList = this.loadFolderList.bind(this);
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
        var folderList = [];
        for (var index = 0; index < data.folders.length; index++)
        {
          folderList.push(data.folders[index].folderName);
          for (var subIndex = 0; subIndex < data.folders[index].subFolderNames.length; subIndex++)
          {
            folderList.push(
              data.folders[index].folderName+"/"+data.folders[index].subFolderNames[subIndex]
            );
          }
        }
        this.setState({folderList: folderList});
      }
    });
  }

  setPage(e,value)
  {
    this.setState({ page: value});
  }

  render()
  {
    return (
      <Dialog open={this.props.show} onClose={this.props.close} maxWidth="xl">
        <DialogTitle>
          <FontAwesomeIcon icon={faCloudArrowUp} size="sm"/> Bilder und Fotos Hochladen
        </DialogTitle>
        <Container fixed>
            <Tabs  value={this.state.page+""} onChange={this.setPage} >
              <Tab label="Lokaler Upload"  value="1"/>
              <Tab label="FTP Import"  value="2"/>
            </Tabs>
          <Box hidden={this.state.page!=1}>
            <Button
              fullWidth
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<FontAwesomeIcon icon={faPhotoFilm} size="sm"/> }
              sx={{mb:"0vh",mt:"2vh"}}
            >
              Dateien Auswählen
              <input style={{display:"none"}}
                type="file"
                onChange={(event)=>{ this.setState({selectedFiles:event.target.files});}}
                multiple
              />
            </Button>
            <Typography variant="subtitle2" component="h2">
              {this.state.selectedFiles.length!==0
                && this.state.selectedFiles.length+" Dateien Ausgewählt."}
            </Typography>
          </Box>
          <Box hidden={this.state.page!=2}>
            <DialogTitle>2</DialogTitle>
          </Box>
          <FormControl fullWidth sx={{mb:"2vh",mt:"2vh"}}>
            <InputLabel id="selFolder">Ordner</InputLabel>
            <Select
              value={this.state.selectedFolder}
              label="Ordner"
              labelId="selFolder"
              onChange={(event)=>{ this.setState({selectedFolder:event.target.value});}}
            >
              {this.state.folderList.map( (folder, index) =>
                (<MenuItem key={index} value={folder}>{folder}</MenuItem>))
              }
            </Select>
          </FormControl>
          <DialogActions>
            <Button
            disabled={this.state.selectedFiles.length === 0
              || this.state.selectedFolder === ''}
            onClick={()=>{
              console.log(this.state.selectedFiles[0]);
              Backend.uploadFile(
                this.props.token,
                this.state.selectedFiles[0],
                this.state.selectedFolder,
                this.props.user,
                (progressEvent)=>{
                  const { loaded, total } = progressEvent;
                  let precentage = Math.floor((loaded * 100) / total);
                  console.log(precentage);
              });

            }}
            >Hochladen</Button>


          </DialogActions>
        </Container>
      </Dialog>
    );
  }
}

export default UploadContent;
/*     <img src={URL.createObjectURL(this.state.selectedFiles[0])} />   */
