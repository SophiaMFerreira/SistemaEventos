import * as React from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar'; 
import Typography from '@mui/material/Typography';

const drawerWidth = 253;
function Sidebar() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', displa: 'flex', WebkitFlexDirection: 'column', justifyContent: 'space-between'}}} variant="permanent" anchor="left">
        <Box>
            <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "center", pt: 2}}>
              <img src="/logo192.png" alt="Logo" style={{ width: "60px", height: "auto" }}/>
              <Typography variant='h6'>Sistema Eventos 🥂</Typography>
            </Box>
            <List>
              {['Home', 'Meus eventos', 'Faturamento'].map((text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
        </Box>
        <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                 <ListItemIcon />
                </Avatar>
              </ListItemAvatar>
             <ListItemText primary="Nome Usuário" secondary="Sair" />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}

export default Sidebar;