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
  faFileExcel,
  faFilm,
  faHourglassStart,
  faCircleNotch
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
          sx={{ml:'0', display: 'block',color:"lightgreen"}}
        >
          <FontAwesomeIcon
            icon={faCircleCheck}
            size="sm"
            style={{marginRight:'0.5vh'}}
          />
            Erfolgreich!
        </Typography>);
    }else
    {
      switch (response.data.code) {
        case -2:
        return (
          <Typography
            variant="caption"
            sx={{ml:'0', display: 'block',color:"gray"}}
          >
            <FontAwesomeIcon
              icon={faGear}
              spin
              size="sm"
              style={{marginRight:'0.5vh'}}
            />
              Wird hochgeladen...
          </Typography>
        );
        case 0:
        case -1:
        return (
          <Typography
            variant="caption"
            sx={{ml:'0', display: 'block',color:"gray"}}
          >
            <FontAwesomeIcon
              icon={faHourglassStart}
              size="sm"
              style={{marginRight:'0.5vh'}}
            />
              Wartet auf upload...
          </Typography>
        );
        case 0:
        return (
          <Typography
            variant="caption"
            sx={{ml:'0', display: 'block',color:"indianred"}}
          >
            <FontAwesomeIcon
              icon={faCircleExclamation}
              size="sm"
              style={{marginRight:'0.5vh'}}
            />
              Fehler: Datei zu groß.
          </Typography>
        );
        case 1:
        return (
          <Typography
            variant="caption"
            sx={{ml:'0', display: 'block',color:"indianred"}}
          >
            <FontAwesomeIcon
              icon={faFileExcel}
              size="sm"
              style={{marginRight:'0.5vh'}}
            />
              Fehler: Verbotener Dateityp.
          </Typography>
        );

        default:
        return (
          <Typography
            variant="caption"
            sx={{ml:'0', display: 'block',color:"indianred"}}
          >
            <FontAwesomeIcon
              icon={faCircleExclamation}
              size="sm"
              style={{marginRight:'0.5vh'}}
            />
              Fehler: Unbekannt.
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
        fprog[this.state.fileIndex] = Math.floor((loaded * 100) / total);
        var fstatus = [...this.state.fileUploadStatus];
        fstatus[this.state.fileIndex] = this.decodeStatus({data:{status:false,code:-2}});
        this.setState({
          fileUploadProgress: fprog,
          fileUploadStatus: fstatus
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
      fileUploadStatus: Array(this.state.selectedFiles.length).fill(this.decodeStatus({data:{status:false,code:-1}})),
      fileIndex:0
    });
    this.uploadFile();
  }

  getFileUploadInfo()
  {
    return Array.from(this.state.selectedFiles).map( (obj , index) =>{
      var linProg = (
        <LinearProgress
          sx={{
            ml:'0',
            backgroundColor:"gray",
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'white'
            }
          }}
          variant="determinate"
          value={this.state.fileUploadProgress[index]}
        />
      );
      if(index !== this.state.fileIndex)
      {
        linProg = (<></>);
      }
      let avatar = (
        <Avatar
          src={URL.createObjectURL(this.state.selectedFiles[index])}
          sx={{width:"3.5vh",height:"3.5vh",float:"right"}}
        />
      );
      if(this.state.selectedFiles[index].type.includes("video"))
      {
        avatar = (
          <Avatar
            sx={{width:"3.5vh",height:"3.5vh",float:"right"}}
          >
            <FontAwesomeIcon
              icon={faFilm}
              size="sm"
            />
          </Avatar>
        );
      }
      return (
        <Grid
          container
          sx={{m:"24px",mt:"0.2vh",mb:"0.2vh"}}
          key={index}
        >
          <Grid
            size={10}
          >
            <Typography
              variant="caption"
              sx={{ml:'0', lineHeight: 1.5, display: 'block' }}
            >
              {obj.name}
            </Typography>
            {this.state.fileUploadStatus[index]}

            {linProg}
          </Grid>
          <Grid
            size={2}
          >
            {avatar}
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
          sx={{borderRadius:"1vh"}}
        >
          <DialogTitle>
            <FontAwesomeIcon
              icon={faCircleNotch}
              size="sm"
              spin
              style={{marginRight: "1vh"}}
            />
            {this.state.fileIndex}/{this.state.selectedFiles.length} Dateien Hochgeladen
            <LinearProgress
              sx={{
                width:"100%",
                backgroundColor:"gray",
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'white'
                }
              }}
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
          sx={{borderRadius:"1vh"}}
        >
          <DialogTitle>
            <FontAwesomeIcon
              icon={faCloudArrowUp}
              size="sm"
              style={{marginRight:"1vh"}}
            />
            Dateien Hochladen
          </DialogTitle>
          <Container
            sx={{paddingLeft:"24px",paddingRight:"24px"}}
            fixed
          >
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
                sx={{color:"#f44336",backgroundColor:"#212121",padding:"1.5vh",marginTop:"2vh",borderRadius:"4px"}}
              >
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  size="sm"
                  style={{paddingRight:"1vh"}}
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
