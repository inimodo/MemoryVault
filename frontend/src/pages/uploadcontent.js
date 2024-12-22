import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Backend from './../misc/websocket.js';
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
  faGear,
  faTriangleExclamation,
  faCircleExclamation,
  faCircleCheck,
  faFileExcel
} from '@fortawesome/free-solid-svg-icons'
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid2';
import Avatar from '@mui/material/Avatar';


class UploadContent extends React.Component{

  constructor(props)
  {
    super(props);

    this.state = {
      page: 1,
      folderList: [],
      selectedFolder:'',
      selectedFiles:[],
      isUploading:false,
      doneUploading:false,
      fileUploadProgress:[],
      fileUploadStatus:[],
      fileIndex:0,
      filesToImport: 0,
      movedFiles: 0,
      failedFiles: 0
    };

    this.setPage = this.setPage.bind(this);
    this.loadFolderList = this.loadFolderList.bind(this);
    this.uploadAllFiles = this.uploadAllFiles.bind(this);
    this.importAllFiles = this.importAllFiles.bind(this);
    this.getFileUploadInfo = this.getFileUploadInfo.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.cleanUpFileUpload = this.cleanUpFileUpload.bind(this);
    this.decodeStatus = this.decodeStatus.bind(this);
    this.loadImportFiles = this.loadImportFiles.bind(this);
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
        var folderList = [];
        for (var index = 0; index < data.folders.length; index++)
        {
          folderList.push(data.folders[index].folderName);
          for (var subIndex = 0; subIndex < data.folders[index].subFolders.length; subIndex++)
          {
            folderList.push(
              data.folders[index].folderName+"/"+data.folders[index].subFolders[subIndex].subFolderName
            );
          }
        }
        this.setState({folderList: folderList});
      }
    });
  }

  cleanUpFileUpload()
  {
    this.setState({
      page: 1,
      selectedFolder:'',
      selectedFiles:[],
      isUploading:false,
      doneUploading:false,
      fileUploadProgress:[],
      fileUploadStatus:[],
      fileIndex:0,
    });
  }

  setPage(e,value)
  {
    this.setState({
      page: value
    });
  }

  decodeStatus(response)
  {
    if(response.data.status)
    {
      return (
        <Typography
          variant="caption"
          sx={{ml:'1vh', display: 'block',color:"lightgreen"}}
        >
          <FontAwesomeIcon
            icon={faCircleCheck}
            size="sm"
          />
            Erfolgreich Hochgeladen.
        </Typography>);
    }else
    {
      switch (response.data.code) {
        case 0:
        return (
          <Typography
            variant="caption"
            sx={{ml:'1vh', display: 'block',color:"indianred"}}
          >
            <FontAwesomeIcon
              icon={faCircleExclamation}
              size="sm"
            />
              Hochladen fehlgeschlagen.
          </Typography>
        );
        case 1:
        return (
          <Typography
            variant="caption"
            sx={{ml:'1vh', display: 'block',color:"indianred"}}
          >
            <FontAwesomeIcon
              icon={faFileExcel}
              size="sm"
            />
              Verbotener Dateityp.
          </Typography>
        );

        default:
        return (
          <Typography
            variant="caption"
            sx={{ml:'1vh', display: 'block',color:"indianred"}}
          >
            <FontAwesomeIcon
              icon={faCircleExclamation}
              size="sm"
            />
              Unbekannter Fehler.
          </Typography>
        );
      }
    }
  }

  uploadFile()
  {
    if(this.state.fileIndex === this.state.selectedFiles.length)
    {
      this.setState({
        doneUploading:true
      });
      this.props.forceRefetch();
      return;
    }

    Backend.uploadFile(
      this.props.token,
      this.state.selectedFiles[this.state.fileIndex],
      this.state.selectedFolder,
      this.props.user,
      (progressEvent)=>{
        const { loaded, total } = progressEvent;
        var fprog = [...this.state.fileUploadProgress];
        fprog[this.state.fileIndex] = Math.floor((loaded * 100) / total);;
        this.setState({
          fileUploadProgress: fprog
        });

    }).then((res) =>{
      var fstatus = [...this.state.fileUploadStatus];
      fstatus[this.state.fileIndex] = this.decodeStatus(res);
      this.setState({
        fileUploadStatus: fstatus,
        fileIndex: this.state.fileIndex+1
      }, () => this.uploadFile());
    });
  }

  importAllFiles()
  {
    Backend.importFiles(
      this.props.token,
      this.state.selectedFolder,
      this.props.user
    ).then((data) =>{
        if(data.status === true)
        {
          this.setState({
            failedFiles: data.failed,
            movedFiles: data.moved
          });
          this.props.forceRefetch();
        }
    });
  }

  loadImportFiles()
  {
    Backend.listImportFiles(this.props.token).then( (data) => {
      if(data.status === true)
      {
        this.setState({
          filesToImport: data.found
        });
      }
    });
  }

  uploadAllFiles()
  {
    this.setState({
      isUploading:true,
      fileUploadProgress: Array(this.state.selectedFiles.length).fill(0),
      fileUploadStatus: Array(this.state.selectedFiles.length).fill(<></>),
      fileIndex:0
    });
    this.uploadFile();
  }

  getFileUploadInfo()
  {
    return Array.from(this.state.selectedFiles).map( (obj , index) =>{
      var linProg = (
        <LinearProgress
          sx={{ml:'1vh'}}
          variant="determinate"
          value={this.state.fileUploadProgress[index]}
        />
      );
      if(index !== this.state.fileIndex)
      {
        linProg = (<></>);
      }
      return (
        <Grid
          container
          sx={{m:"2vh",mt:"0.2vh",mb:"0.2vh"}}
          key={index}
        >
          <Grid
            size={10}
          >
            <Typography
              variant="caption"
              sx={{ml:'1vh', lineHeight: 1.5, display: 'block' }}
            >
              {obj.name}
            </Typography>
            {this.state.fileUploadStatus[index]}

            {linProg}
          </Grid>
          <Grid
            size={2}
          >
            <Avatar
              src={URL.createObjectURL(this.state.selectedFiles[index])}
              sx={{width:"3.5vh",height:"3.5vh",float:"right"}}
            />
          </Grid>
        </Grid>
      );
    });
  }

  render()
  {
    const FolderSelect = (()=>(
      <FormControl
        fullWidth
        sx={{mb:"2vh",mt:"2vh"}}
      >
        <InputLabel
          id="selFolder"
        >
          Ordner
        </InputLabel>
        <Select
          value={this.state.selectedFolder}
          label="Ordner"
          labelId="selFolder"
          onChange={(event)=>{
            this.setState({
              selectedFolder:event.target.value
            });
          }}
        >
          {this.state.folderList.map( (folder, index) =>
            (<MenuItem
                key={index}
                value={folder}
              >
                {folder}
              </MenuItem>
            ))
          }
        </Select>
      </FormControl>
    ));
    return (
      <React.Fragment>
        <Dialog
          disableEnforceFocus
          maxWidth="sm"
          open={this.state.isUploading}
        >
          <DialogTitle>
            <FontAwesomeIcon
              icon={faGear}
              size="sm"
              spin
              style={{marginRight: "0.5vh"}}
            />
            {this.state.fileIndex}/{this.state.selectedFiles.length} Dateien wurden Hochgeladen
            <LinearProgress
              sx={{width:"100%"}}
              variant="determinate"
              value={this.state.fileIndex/this.state.selectedFiles.length*100}
            />
          </DialogTitle>
          {this.getFileUploadInfo()}
          <DialogActions>
            <Button
              disabled={!this.state.doneUploading}
              onClick={this.cleanUpFileUpload}
            >
              Fertig
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          disableEnforceFocus
          open={this.props.show}
          onClose={this.props.close}
          maxWidth="sm"
        >
          <DialogTitle>
            <FontAwesomeIcon
              icon={faCloudArrowUp}
              size="sm"
              style={{marginRight:"0.5vh"}}
            />
            Dateien Hochladen
          </DialogTitle>
          <Container fixed>
              <Tabs
                value={this.state.page+""}
                onChange={this.setPage}
              >
                <Tab
                  label="Von Gerät Hochladen"
                  value="1"
                />
                <Tab
                  label="Von FTP Importieren"
                  value="2"
                />
              </Tabs>
            <Box
              hidden={this.state.page != 1}
            >
              <Button
                fullWidth
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={
                  <FontAwesomeIcon
                    icon={faPhotoFilm}
                    size="sm"
                  />
               }
                sx={{mb:"0vh",mt:"2vh"}}
              >
                Dateien Auswählen
                <input
                  style={{display:"none"}}
                  type="file"
                  onChange={(event)=>{
                    this.setState({
                      selectedFiles:event.target.files
                    });
                  }}
                  multiple
                />
              </Button>
              <Typography
                variant="subtitle2"
                component="h2"
              >
                {this.state.selectedFiles.length!==0
                  && this.state.selectedFiles.length+" Dateien Ausgewählt."}
              </Typography>
              {FolderSelect()}
              <DialogActions>
                <Button
                  disabled={this.state.selectedFiles.length === 0 || this.state.selectedFolder === ''}
                  onClick={this.uploadAllFiles}
                >
                  Hochladen
                </Button>
              </DialogActions>
            </Box>
            <Box
              hidden={this.state.page != 2}
            >
              <Typography
                variant="subtitle2"
                sx={{color:"#f44336",backgroundColor:"#212121",padding:"1.5vh",marginTop:"2vh",borderRadius:"1vh"}}
              >
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  size="sm"
                /> Achtung! Nur ausgewählten Personen stehen die FTP Zugangsdaten zur verfügung.
                Wenn du nicht in den FTP Import eingewiesen wurdest, bitte ich dich hier nichts anzufassen, danke.
                Falls du große Mengen an Fotos/Videos Hochladen möchtest, melde dich bitte bei mir.
                Grüße Markus.
              </Typography>
              <Button
                fullWidth
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={
                  <FontAwesomeIcon
                    icon={faPhotoFilm}
                    size="sm"
                  />
                }
                sx={{mb:"0vh",mt:"2vh"}}
                onClick={this.loadImportFiles}
              >
                Nach Dateien am Server Suchen
              </Button>

              <Typography
                variant="subtitle2"
                component="h2"
              >
                {this.state.filesToImport !== 0 && this.state.filesToImport+" Dateien wurden gefunden."}
              </Typography>
              <Typography
                variant="subtitle2"
                component="h2"
              >
                {(this.state.movedFiles !== 0 || this.state.failedFiles !== 0)
                  && this.state.movedFiles+" Dateien wurden Importiert. "
                  +this.state.failedFiles+" Dateien konnten nicht importiert werden."}
              </Typography>
              {FolderSelect()}
              <DialogActions>
                <Button
                  disabled={this.state.selectedFolder === '' || this.state.filesToImport === 0}
                  onClick={this.importAllFiles}
                >
                  Importieren
                </Button>
              </DialogActions>
            </Box>
          </Container>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default UploadContent;
