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

class ContentLister extends React.Component{

  constructor(props)
  {
    super(props);
    this.state = {
      folders:[]
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
        this.setState({folders: data.folders});
      }
    });
  }

  loadFolder(isExpanded,folder,subFolder)
  {
    Backend.listFolderContent(this.props.token,folder,subFolder).then( (data) => {
      if(data.status == true)
      {
        console.log(data);
      }
    });
  }


  render()
  {
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                malesuada lacus ex, sit amet blandit leo lobortis eget.
              </AccordionDetails>
            </Accordion>
          ))
        }
        </AccordionDetails>
      </Accordion>
    ));
  }
}
export default ContentLister;
/*
<ImageList variant="masonry" cols={3} gap={8}>
  {itemData.map((item) => (
    <ImageListItem key={item.img}>
      <img
        src={`${item.img}?w=248&fit=crop&auto=format`}
        alt={item.title}
        loading="lazy"
      />
    </ImageListItem>
  ))}
</ImageList>
*/
