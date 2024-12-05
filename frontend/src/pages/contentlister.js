import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Button from '@mui/material/Button';
import Settings from "../misc/settings.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCloudArrowUp,
  faPhotoFilm,
  faFolder,
  faGear,
  faFolderPlus,
  faTriangleExclamation,
  faCircleExclamation,
  faCircleCheck,
  faFileExcel,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons'
import Backend from './../misc/websocket.js';
import Content from './subpages/content.js';
import ContentViewer from './subpages/contentviewer.js';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Dimensions } from "react-native";
import Container from '@mui/material/Container';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

class ContentLister extends React.Component{

  constructor(props)
  {
    super(props);
    this.state = {
      folders:[],
      files:[],
      showViewer:false,
      showFolder:"",
      showSubFolder:"",
      showFile:{},
      showFilePath:"",
      showFileIndex:0
    };
    this.loadFolderList = this.loadFolderList.bind(this);
    this.loadFolder = this.loadFolder.bind(this);
    this.openView = this.openView.bind(this);
    this.closeView = this.closeView.bind(this);
    this.recLoadContent = this.recLoadContent.bind(this);
    this.openNext = this.openNext.bind(this);
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
        var files = {}
        for (var index = 0; index < data.folders.length; index++)
        {
          files[data.folders[index].folderName] = {
            files:[],
            content:[],
            index:0
           };
          for (var subIndex = 0; subIndex < data.folders[index].subFolders.length; subIndex++)
          {
            files[data.folders[index].folderName][data.folders[index].subFolders[subIndex].subFolderName] = {
              files:[],
              content:[],
              index:0
            };
          }
        }
        this.setState({
          folders: data.folders,
          files:files
        });
      }
    });
  }

  loadFolder(isExpanded,folder,subFolder)
  {
    if(isExpanded === false) return;
    if(subFolder === "NONE")
    {
      if(this.state.files[folder].files.length !== 0) return;
    }else
    {
      if(this.state.files[folder][subFolder].files.length !== 0) return;
    }
    Backend.listFolderContent(this.props.token,folder,subFolder).then( (data) => {
      console.log(data);
      if(data.status == true)
      {
        var files = {...this.state.files};
        if(subFolder === "NONE")
        {
          files[folder].files = data.files;
          files[folder].content = Array(data.files.length).fill(null);
        }else
        {
          files[folder][subFolder].files = data.files;
          files[folder][subFolder].content = Array(data.files.length).fill(null);
        }
        this.setState({files:files}, ()=> {
          console.log(this.state.files);
          this.recLoadContent(folder,subFolder);
        });
      }
    });
  }

  recLoadContent(folder,subFolder)
  {
    var file = null;
    if(subFolder === "NONE")
    {
      if(this.state.files[folder].files.length == this.state.files[folder].index) return;
      file = this.state.files[folder].files[this.state.files[folder].index];
    }else
    {
      if(this.state.files[folder][subFolder].files.length == this.state.files[folder][subFolder].index) return;
      file = this.state.files[folder][subFolder].files[this.state.files[folder][subFolder].index];
    }

    Backend.getContent(this.props.token,file,folder,subFolder,Settings.prevImgQual)
      .then(response => { return response.blob();})
      .then( (blob) =>{
        var files = {...this.state.files};
        if(subFolder === "NONE")
        {
          files[folder].content[files[folder].index] = URL.createObjectURL(blob);
          files[folder].index++;
        }else
        {
          files[folder][subFolder].content[files[folder][subFolder].index] = URL.createObjectURL(blob);
          files[folder][subFolder].index++;
        }
        this.setState({files:files},()=>{
          this.recLoadContent(folder,subFolder);
        });
    }).catch((error)=>{
      console.log("failed");
      console.log(error);
      console.log(error.message);
    });
  }

  closeView()
  {
    this.setState({
      showViewer:false,
      showFolder:"",
      showSubFolder:"",
      showFile:{},
      showFilePath:"",
      showFileIndex:-1
    });
  }

  openNext(folder,subFolder,index)
  {
    console.log(folder+" "+subFolder+" "+index);
    console.log(this.state.files);
    var newIndex = index;
    var maxIndex = 0;
    if(subFolder === "NONE")
    {
      maxIndex = this.state.files[folder].files.length;
    }else
    {
      maxIndex = this.state.files[folder][subFolder].files.length;
    }
    if(index == -1)
    {
      newIndex = maxIndex-1;
    }
    if(index === maxIndex)
    {
      newIndex = 0;
    }
    var newFile = {};
    if(subFolder === "NONE")
    {
      newFile = this.state.files[folder].files[newIndex];
    }else
    {
      newFile = this.state.files[folder][subFolder].files[newIndex];
    }

    this.openView(newFile,folder,subFolder,newIndex);
  }

  openView(file,folder,subFolder,index)
  {
    this.setState({
      showViewer:true,
      showFolder:folder,
      showSubFolder:subFolder,
      showFile:file,
      showFilePath:"",
      showFileIndex:index
    },()=>{
      Backend.getContent(this.props.token,file,folder,subFolder,Settings.viewImgQual)
        .then(response => { return response.blob();})
        .then( (blob) =>{
          console.log(blob);
          this.setState({
            showFilePath : URL.createObjectURL(blob)
          });
        }).catch((error)=>{
          console.log("failed");
          console.log(error);
          console.log(error.message);
        });
    });
  }

  render()
  {
    const window = Dimensions.get("window");
    var cols = 9;
    if(window.width < 1000)
    {
      cols = 6;
    }
    if(window.width < 500)
    {
      cols = 3;
    }

    const files = this.state.folders.map( (folder,index) => (
      <Accordion disableGutters key={folder.folderName} onChange={
        (e,expand) => {this.loadFolder(expand,folder.folderName,"NONE")}
      }>
        <AccordionSummary
          expandIcon={<FontAwesomeIcon icon={faChevronDown} size="sm"/>}
        >
          <Typography variant="h6" sx={{ display: 'block', width:"50%"}}>
            <FontAwesomeIcon icon={faFolder} size="sm"/> {folder.folderName}
          </Typography>
          <Typography variant="subtitle1" sx={{ color:"gray" ,mr:"1%", width:"49%", textAlign:"right"}}>
            {folder.fileCount} <FontAwesomeIcon icon={faPhotoFilm} size="sm"/>
          </Typography>

        </AccordionSummary>
        <AccordionDetails>
        {
          folder.subFolders.map( (subFolder,index) =>
          (
            <Accordion disableGutters key={subFolder.subFolderName} onChange={
              (e,expand) => {this.loadFolder(expand,folder.folderName,subFolder.subFolderName);}
            }>
              <AccordionSummary
                expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
              >
              <Typography variant="h6" sx={{ display: 'block', width:"50%"}}>
                <FontAwesomeIcon icon={faFolder} size="sm"/> {subFolder.subFolderName}
              </Typography>
              <Typography variant="subtitle1" sx={{ color:"gray" ,mr:"1%", width:"49%", textAlign:"right"}}>
                {subFolder.fileCount} <FontAwesomeIcon icon={faPhotoFilm} size="sm"/>
              </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ImageList variant="masonry" cols={cols} gap={8}>
                  {this.state.files[folder.folderName][subFolder.subFolderName].content.map((img,index) =>
                    (
                      <Content
                        key={index}
                        img={img}
                        file={this.state.files[folder.folderName][subFolder.subFolderName].files[index]}
                        folder={folder.folderName}
                        subFolder={subFolder.subFolderName}
                        index={index}
                        onClick={this.openView}
                        />
                    )
                  )}
                </ImageList>
              </AccordionDetails>
            </Accordion>
          ))
        }

        <ImageList variant="masonry" cols={cols} gap={8}>
          {this.state.files[folder.folderName].content.map((img,index) =>
            (
              <Content
                key={index}
                img={img}
                file={this.state.files[folder.folderName].files[index]}
                folder={folder.folderName}
                subFolder={"NONE"}
                index={index}
                onClick={this.openView}
                />
            )
          )}
          </ImageList>
        </AccordionDetails>
      </Accordion>
    ));

    return(
      <React.Fragment>
        <ContentViewer
          showViewer={this.state.showViewer}
          showFile={this.state.showFile}
          showFilePath={this.state.showFilePath}
          showFolder={this.state.showFolder}
          showSubFolder={this.state.showSubFolder}
          showFileIndex={this.state.showFileIndex}
          openNext={this.openNext}
          closeView={this.closeView}
          />
        {files}
      </React.Fragment>
    );
  }
}
export default ContentLister;
