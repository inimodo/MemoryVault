import React from 'react';
import ImageListItem from '@mui/material/ImageListItem';
import Skeleton from '@mui/material/Skeleton';

class Content extends React.Component{

  constructor(props)
  {
    super(props);
    this.state={
      image: null,
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
            sx={{w:"100%",height:"10vh"}}
          />
        </ImageListItem>
      );
    }
    if(this.props.file.isImage)
    {
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
        />
        </ImageListItem>
      );
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
        <video
          style={{width:"100%"}}
        >
          <source
            src={this.props.img}
            type="video/mp4"
          />
          <source
            src={this.props.img}
            type="video/mov"
          />
        </video>
      </ImageListItem>
    );

  }
}
export default Content;
