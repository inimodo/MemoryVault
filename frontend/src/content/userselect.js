import React from 'react';
import UserList from './../userimages/userlist.js';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid2';
import Settings from './../misc/settings.js';

function UserSelect(props){

  const columns  = Settings.userSelectColumns;
  var columnData = Array(columns);
  UserList.Icons.map((user, id) => {
    if(!columnData[id % columns]){
      columnData[id % columns] = [];
    }
    columnData[id % columns].push((
      <ListItem disableGutters key={id}>
        <ListItemButton
          key={id}
          onClick={() => {
            props.selectUser(id)
          }}
          sx={{padding:0}}
        >
          <ListItemAvatar sx={{minWidth:24}}>
            <Avatar src={user} sx={{width:24,height:24,marginRight:"0.5vh"}}/>
          </ListItemAvatar>
          <ListItemText primary={UserList.Names[id]} />
        </ListItemButton>
      </ListItem>
    ));
    return null;
  });

  return(
    <Dialog open={props.user==-1} maxWidth="xl">
      <DialogTitle>Wer bist du?</DialogTitle>
      <Grid container spacing={0}>
        {columnData.map((column,index)=>(
          <Grid size={12/columns} key={index}>
            <List sx={{ pt: 0 }} dense={true} sx={{padding:0,paddingLeft:"2vh",paddingRight:"2vh",paddingBottom:"2vh"}}>
              {column.map((userField) => (userField))}
            </List>
          </Grid>
        ))}
      </Grid>
    </Dialog>
  );
}

export default UserSelect;
