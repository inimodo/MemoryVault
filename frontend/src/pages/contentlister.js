import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Button from '@mui/material/Button';
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
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Dimensions } from "react-native";

class ContentLister extends React.Component{

  constructor(props)
  {
    super(props);
    this.state = {
      folders:[],
      files:[]
    };
    this.loadFolderList = this.loadFolderList.bind(this);
    this.loadFolder = this.loadFolder.bind(this);
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
          files[data.folders[index].folderName] = { files:[] };
          for (var subIndex = 0; subIndex < data.folders[index].subFolders.length; subIndex++)
          {
            files[data.folders[index].folderName][data.folders[index].subFolders[subIndex].subFolderName] = { files:[] };
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
    Backend.listFolderContent(this.props.token,folder,subFolder).then( (data) => {
      if(data.status == true)
      {
        var files = {...this.state.files};
        if(subFolder === "NONE")
        {
          files[folder].files = data.files;
        }else
        {
          files[folder][subFolder].files = data.files;
        }
        this.setState({files:files});
      }
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

    return this.state.folders.map( (folder,index) => (
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
                  {this.state.files[folder.folderName][subFolder.subFolderName].files.map((img) =>
                    (
                      <ImageListItem key={img}>
                        <img
                          src={Backend.getFile(this.props.token,img,folder.folderName,subFolder.subFolderName)}
                        />
                      </ImageListItem>
                    )
                  )}
                </ImageList>
              </AccordionDetails>
            </Accordion>
          ))
        }

        <ImageList variant="masonry" cols={cols} gap={8}>
          {this.state.files[folder.folderName].files.map((img) =>
            (
              <ImageListItem key={img}>
                <img
                  src={Backend.getFile(this.props.token,img,folder.folderName,"NONE")}
                />
              </ImageListItem>
            )
          )}
          </ImageList>
        </AccordionDetails>
      </Accordion>
    ));
  }
}
export default ContentLister;
/*

<img
  src={Backend.getFile(this.props.token,img,folder.folderName,"NONE")}
/>
*/
