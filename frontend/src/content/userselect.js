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
  const [open, setOpen] = React.useState(true);

  const columns  = Settings.userSelectColumns;
  var columnData = Array(columns);
  UserList.Icons.map((user, id) => {
    if(!columnData[id % columns]){
      columnData[id % columns] = [];
    }
    columnData[id % columns].push((
      <ListItem disableGutters key={id}>
        <ListItemButton key={id} onClick={() => {
          setOpen(false);
          props.selectUser(id)}}>
          <ListItemAvatar>
            <Avatar src={user}/>
          </ListItemAvatar>
          <ListItemText primary={UserList.Names[id]} />
        </ListItemButton>
      </ListItem>
    ));
    return null;
  });

  return(
    <Dialog open={open} maxWidth="xl">
      <DialogTitle>Wer bist du?</DialogTitle>
      <Grid container spacing={0}>
        {columnData.map((column,index)=>(
          <Grid size={12/columns} key={index}>
            <List sx={{ pt: 0 }} dense={true}>
              {column.map((userField) => (userField))}
            </List>
          </Grid>
        ))}
      </Grid>
    </Dialog>
  );
}

export default UserSelect;
