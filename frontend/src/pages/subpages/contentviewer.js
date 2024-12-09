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
  faUserPlus,
  faCircleInfo
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
import UserList from '../../userimages/userlist.js';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

class ContentViewer extends React.Component{

  constructor(props)
  {
    super(props);
    this.state={
      imgData:{}
    };
    this.getDateString = this.getDateString.bind(this);
    this.addMe = this.addMe.bind(this);
  }

  componentDidUpdate(prevProps)
  {
    if (this.props.showFile !== prevProps.showFile
    &&  this.props.showFile.fileName !== undefined )
    {
      Backend.getImgData(this.props.token,this.props.showFile,this.props.showFolder,this.props.showSubFolder).then( (data) => {
        console.log(data);
        if(data.status === true)
        {
          this.setState({
            imgData:data
          });
        }
      });
    }
  }

  addMe()
  {
    Backend.getAddUserInImg(this.props.token,this.props.showFile,this.props.showFolder,this.props.showSubFolder,this.props.user).then( (data) => {
      console.log(data);
      if(data.status === true)
      {
        this.setState({
          imgData:data
        });
      }
    });
  }

  getDateString(stamp)
  {
    const date = new Date(stamp);
    const padding = ((value)=>{
      if(value < 10) return "0"+value;
      return value
    });

    var datetime = padding(date.getUTCDay())+"."+
                   padding(date.getUTCMonth())+"."+
                   padding(date.getUTCFullYear())+" "+
                   padding(date.getUTCHours())+":"+
                   padding(date.getUTCMinutes())+":"+
                   padding(date.getUTCSeconds());
    return datetime;
  }

  render()
  {
    var viewerContent=(
      <img
        onClick={
        ()=>{this.props.openNext(
          this.props.showFolder,
          this.props.showSubFolder,
          this.props.showFileIndex+1
        )}}
        style={{
          maxWidth:"100%",
          maxHeight:"65vh",
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
          maxHeight:"65vh",
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

    var viewerImgData = (
      <Box sx={{marginTop:"1vh"}}>
        <Typography
          variant="subtitle1"
          sx={{
            float: "left",
            ml:'1vh',
            display: 'block',
            color:"Gray"
          }}
        >
           Von {UserList.Names[this.state.imgData.user]} aufgenommen am {this.getDateString(this.state.imgData.cdate)}
        </Typography>
      </Box>
    );

    var userAddButton = (<></>);
    var userAvatars = (<></>);
    if(this.state.imgData.inimg !== undefined)
    {
      userAvatars = this.state.imgData.inimg.map((user,index)=>
      (
        <Avatar
          key={index}
          src={UserList.Icons[user]}
          sx={{float:"left",marginRight:"-15px"}}
          size="sm"
        />
      ));

      if(!this.state.imgData.inimg.includes(this.props.user))
      {
        var buttonText = "Ich bin zu sehen!";
        if(this.state.imgData.inimg.length !== 0)
        {
          buttonText = "Ich bin auch zu sehen!";
        }
        userAddButton = (
          <Button
            variant="outlined"
            sx={{
              color:"white",
              float:"left",
              marginLeft: "25px",
              marginTop: "4px"
            }}
            startIcon={<FontAwesomeIcon icon={faUserPlus} size="lg"/>}
            onClick={this.addMe}
          >
            {buttonText}
          </Button>
        );
      }
    }

    var viewerInImg = (
      <Box sx={{marginTop:"1vh"}}>
        {userAvatars}
        {userAddButton}
      </Box>
    );

    if(this.props.showFilePath==="")
    {
      viewerImgData = (<></>);
      viewerInImg = (<></>);
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
              sx={{
                border: "solid",
                borderColor: "#121212",
                backgroundColor: "#121212",
                borderWidth: "2vh",
              }}
              >
              <Stack>
                {viewerContent}
                {viewerImgData}
                {viewerInImg}
              </Stack>

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
