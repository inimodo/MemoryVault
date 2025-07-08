import React from 'react';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserPlus,
  faCircleInfo,
  faSquareCaretRight,
  faSquareCaretLeft,
  faCalendar,
  faUser
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
    };
    this.getDateString = this.getDateString.bind(this);
    this.addMe = this.addMe.bind(this);
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
        onClick={(event)=>{
          event.stopPropagation();
        }}
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
          size="10vh"
          color="primary"
          sx={{
            marginLeft:"calc( 50% - 20px)",
            marginTop:"20vh",
            marginBottom:"20vh",
            '& .MuiCircularProgress-circle': {
              color: 'white'
            }}}
          variant="determinate"
          value={this.props.showFileProg}
        />
      );
    }

    var viewerImgData = (
      <Box
        sx={{marginTop:"0.5vh"}}
      >

          <FontAwesomeIcon
            icon={faSquareCaretLeft}
            size="2x"
            style={{width:"10%",float: "left"}}
            onClick={
              (event)=>{
                this.props.openNext(
                  this.props.showFolder,
                  this.props.showSubFolder,
                  this.props.showFileIndex-1
                );
                event.stopPropagation();
              }}
          />
          <Typography
            variant="caption"
            sx={{
              float: "left",
              textAlign:"center",
              width:'80%',
              display: 'block',
            }}
          >
            <FontAwesomeIcon
              icon={faUser}
              size="sm"
              style={{marginRight:"0.5vh"}}
            />
            {UserList.Names[this.props.showFileData.user]}<br/>
            <FontAwesomeIcon
              icon={faCalendar}
              size="sm"
              style={{marginRight:"0.5vh"}}
            />
            {this.getDateString(this.props.showFileData.cdate)}
          </Typography>
          <FontAwesomeIcon
            icon={faSquareCaretRight}
            size="2x"
            style={{width:"10%",float: "left"}}
            onClick={
              (event)=>{
                this.props.openNext(
                  this.props.showFolder,
                  this.props.showSubFolder,
                  this.props.showFileIndex+1
                );
                event.stopPropagation();
              }}
          />

      </Box>
    );

    var userAddButton = (<></>);
    var userAvatars = (<></>);
    if(this.props.showFileData.inimg !== undefined)
    {
      userAvatars = this.props.showFileData.inimg.map((user,index)=>
      (
        <Avatar
          key={index}
          src={UserList.Icons[user]}
          sx={{float:"left",marginRight:"-15px"}}
          size="sm"
        />
      ));

      if(!this.props.showFileData.inimg.includes(this.props.user))
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
            onClick={(event)=>{
              this.addMe();
              event.stopPropagation();
            }}
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
      viewerImgData=(<></>);
      viewerInImg=(<></>);
    }
    return(
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={this.props.showViewer}
        onClick={()=>{
          this.props.closeView();
        }}
        >

          <Stack sx={{width:"90%"}}>
            {viewerContent}
            {viewerImgData}
            {viewerInImg}
          </Stack>

      </Backdrop>
    );
  }
}

export default ContentViewer;

/*



  this.props.closeView
*/
