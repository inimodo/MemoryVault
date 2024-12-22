import React from 'react';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserPlus,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons'
import Backend from '../../misc/websocket.js';
import Typography from '@mui/material/Typography';
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

    var datetime = padding(date.getUTCDate())+"."+
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
        alt=""
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
          marginRight:"auto",
          borderRadius:"4px"
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
          marginRight:"auto",
          borderRadius:"4px"
        }} controls>
          <source
            src={this.props.showFilePath}
            type="video/mp4"
          />
          <source
            src={this.props.showFilePath}
            type="video/mov"
          />
        </video>
      );
    }
    if(this.props.showFilePath==="")
    {
      viewerContent = (
        <CircularProgress
          sx={{marginLeft:"calc( 50% - 20px)",marginTop:"20vh",marginBottom:"20vh"}}
          color="inherit"
        />
      );
    }

    var viewerImgData = (
      <Box
        sx={{marginTop:"0.5vh"}}
      >
        <Typography
          variant="caption"
          sx={{
            float: "left",
            ml:'0vh',
            display: 'block',
            color:"Gray"
          }}
        >
          <FontAwesomeIcon
            icon={faCircleInfo}
            size="sm"
            style={{marginRight:"0.5vh"}}
          />
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
        userAddButton = (
          <Button
            variant="text"
            sx={{
              color:"white",
              float:"right",
              marginLeft: "25px",
              marginTop: "4px"
            }}
            endIcon={
              <FontAwesomeIcon
                icon={faUserPlus}
                size="lg"
              />
            }
            onClick={this.addMe}
          >
          </Button>
        );
      }
    }

    var viewerInImg = (
      <Box
        sx={{marginTop:"1vh"}}
      >
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
          <Grid
            container
            spacing={0}
            sx={{width:"100%"}}
          >
            <Grid
              size={1}
              onClick={
                ()=>{this.props.openNext(
                  this.props.showFolder,
                  this.props.showSubFolder,
                  this.props.showFileIndex-1
                )}}
            >
            </Grid>
            <Grid
              size={10}
              sx={{
                border: "solid",
                borderColor: "#121212",
                backgroundColor: "#121212",
                borderWidth: "2vh",
                borderRadius:"4px"
              }}
              >
              <Stack>
                {viewerContent}
                {viewerImgData}
                {viewerInImg}
              </Stack>

            </Grid>
            <Grid
              size={1}
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
              >
              </Box>
            </Grid>
          </Grid>
      </Backdrop>
    );
  }
}

export default ContentViewer;
