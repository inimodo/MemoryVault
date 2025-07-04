import React from 'react';
import ImageListItem from '@mui/material/ImageListItem';
import Skeleton from '@mui/material/Skeleton';
import Fab from '@mui/material/Fab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVideo, faCamera} from '@fortawesome/free-solid-svg-icons'

class Content extends React.Component{

  constructor(props)
  {
    super(props);
    this.state={
      image: null,
      height:Math.random() * (20 - 8) + 8
    };
  }

  render()
  {
    if(this.props.img == null)
    {
      return (
        <ImageListItem>
          <Skeleton
            animation="wave"
            variant="rectangular"
            sx={{w:"100%",height:this.state.height+"vh",borderRadius:"4px"}}
          />
        </ImageListItem>
      );
    }
    let icon = faCamera;
    if(!this.props.file.isImage)
    {
        icon = faVideo;
    }
    return (
      <ImageListItem
        onClick={
          ()=>this.props.onClick(
          this.props.file,
          this.props.folder,
          this.props.subFolder,
          this.props.index
        )}
      >
      <img
        alt=""
        src={this.props.img}
        style={{borderRadius:"4px",position:"relative"}}
      />
      <FontAwesomeIcon
        style={{
          position:"absolute",
          bottom: "1vh",
          left: "1vh" ,
          fontSize:"1.5vh",
          color:"white",
        }}
        icon={icon}
        size="xl"
      />
      </ImageListItem>
    );

  }
}
export default Content;
