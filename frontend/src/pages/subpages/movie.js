import React from 'react';
import ImageListItem from '@mui/material/ImageListItem';
import Skeleton from '@mui/material/Skeleton';
import Fab from '@mui/material/Fab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faCircleNotch} from '@fortawesome/free-solid-svg-icons'
import Container from '@mui/material/Container';
import Backend from './../../misc/websocket.js';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';


class Movie extends React.Component{

  constructor(props)
  {
    super(props);
    this.state={
      moviePath:"",
      moviePreviewPath:"",
      isLoading:false,
      isLoaded:false,
      dlProgress:0,
      filesize:0
    };
    this.loadMovie = this.loadMovie.bind(this);

  }

  componentDidMount()
  {
    Backend.getMoviePreview(this.props.token,this.props.movie).then( (blob) =>{
        this.setState({
          moviePreviewPath : URL.createObjectURL(blob.data)
        });
    }).catch((error)=>{});
    Backend.getMovieSize(this.props.token,this.props.movie).then( (data) =>{
      if(data.status === true)
      {
        this.setState({
          filesize:data.size
        });
      }
    }).catch((error)=>{});
  }

  loadMovie()
  {
    this.setState({
      isLoading:true
    });
    Backend.getMovie(
      this.props.token,
      this.props.movie,
      (progressEvent)=>{
        const { loaded, total } = progressEvent;
        var fprog = Math.floor((loaded * 100) / this.state.filesize);
        this.setState({
          dlProgress: fprog
        });
      }
      ).then( (blob) =>{
        this.setState({
          moviePath : URL.createObjectURL(blob.data),
          isLoading:false,
          isLoaded:true
        });
      }).catch((error)=>{
    });
  }

  render()
  {
    var display = (
      <React.Fragment>
        <img
          alt=""
          src={this.state.moviePreviewPath}
          style={{width:"100%",position:"relative",borderRadius:"5px"}}
        />
        <FontAwesomeIcon
          onClick ={()=>this.loadMovie()}
          style={{
            position:"absolute",
            width:"50%",
            top: "18vh",
            left: "25%" ,
            fontSize:"9vh",
            color:"white",
          }}
          icon={faPlay}
          size="xl"
        />
      </React.Fragment>
    );
    if(this.state.isLoading)
    {
      display = (
        <React.Fragment>
          <img
            alt=""
            src={this.state.moviePreviewPath}
            style={{width:"100%",position:"relative",borderRadius:"5px"}}
          />
          <FontAwesomeIcon
            style={{
              position:"absolute",
              width:"50%",
              top: "18vh",
              left: "25%" ,
              fontSize:"9vh",
              color:"white",
            }}
            spin
            icon={faCircleNotch}
            size="xl"
          />
          <LinearProgress
            variant="determinate"
            value={this.state.dlProgress}
          />
        </React.Fragment>
      );
    }
    if(this.state.isLoaded)
    {
      display=(
        <React.Fragment>
          <video style={{width:"100%",position:"relative",borderRadius:"5px"}} controls>
            <source
              src={this.state.moviePath}
              type="video/mp4"
            />
          </video>
        </React.Fragment>
      );
    }
    return (
      <Container maxWidth="sm" sx={{borderRadius:"5px",position:"relative",marginTop:"2vh"}} >
        <Typography
          variant="h4"
          sx={{ display: 'block', width:"100%",marginBottom:"0.5vh"}}
        >
          {this.props.movie.replaceAll("_"," ").replaceAll("Oe","Ö")}
        </Typography>
        {display}
      </Container>
    );

  }
}
export default Movie;
