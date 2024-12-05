import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Button from '@mui/material/Button';
import Settings from "../../misc/settings.js"
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
import Backend from '../../misc/websocket.js';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Dimensions } from "react-native";
import Container from '@mui/material/Container';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';

class ContentViewer extends React.Component{

  constructor(props)
  {
    super(props);
  }

  render()
  {
    var viewerContent=(
      <img
        style={{
          maxWidth:"100%",
          maxHeight:"80vh",
          display:"block",
          marginLeft:"auto",
          marginRight:"auto"
        }}
        src={this.props.showFilePath}
      />
    );
    if(!this.props.showFile.isImage)
    {
      viewerContent = (
        <video style={{
          maxWidth:"100%",
          maxHeight:"80vh",
          display:"block",
          marginLeft:"auto",
          marginRight:"auto"
        }} controls>
          <source src={this.props.showFilePath} type="video/mp4"/>
          <source src={this.props.showFilePath} type="video/mov"/>
        </video>
      );
    }
    if(this.props.showFilePath==="")
    {
      viewerContent = (
        <CircularProgress
          sx={{marginLeft:"50%"}}
          color="inherit" />
      );
    }

    return(
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={this.props.showViewer}
        >
          <Grid container spacing={0} sx={{width:"100%"}}>
            <Grid
              size={2}
              onClick={
                ()=>{this.props.openNext(
                  this.props.showFolder,
                  this.props.showSubFolder,
                  this.props.showFileIndex-1
                )}}
            >
            </Grid>
            <Grid
              size={8}
              onClick={
                ()=>{this.props.openNext(
                  this.props.showFolder,
                  this.props.showSubFolder,
                  this.props.showFileIndex+1
                )}}
              >
              {viewerContent}
            </Grid>
            <Grid
              size={2}
              onClick={
                ()=>{this.props.openNext(
                  this.props.showFolder,
                  this.props.showSubFolder,
                  this.props.showFileIndex+1
                )}}
              >
            </Grid>
            <Grid size={12}>

            </Grid>
            <Grid size={12}>
              <Box
                sx={{width:"100%",height:"20vh"}}
                onClick={this.props.closeView}
                ></Box>
            </Grid>
          </Grid>
      </Backdrop>
    );
  }
}

export default ContentViewer;
