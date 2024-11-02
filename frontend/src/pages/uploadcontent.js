import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

class UploadContent extends React.Component{

  constructor(props)
  {
    super(props);

    this.state = {
      page: 1,
    };
    this.setPage = this.setPage.bind(this);
  }

  setPage(e,value)
  {
    this.setState({ page: value});
  }
  render()
  {
    return (
      <Dialog open={this.props.show} onClose={this.props.close} maxWidth="xl">
        <DialogTitle>Bilder und Fotos Hochladen</DialogTitle>
        <Container fixed>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs  value={this.state.page+""} onChange={this.setPage} >
                <Tab label="Lokaler Upload"  value="1"/>
                <Tab label="FTP Import"  value="2"/>
              </Tabs>
            </Box>
            <Box hidden={this.state.page!=1}>
              <DialogTitle>1</DialogTitle>
            </Box>
            <Box hidden={this.state.page!=2}>
              <DialogTitle>2</DialogTitle>
            </Box>
          </Box>
        </Container>
      </Dialog>

      );
  }
}

export default UploadContent;
