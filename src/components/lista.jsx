import React from 'react';
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL_S}/ingresso`;

    React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setDados(response.data);
    });
  }, []);

  if(!dados) return null;

const idEvento = 2;
function popularLista(dados) {
  return dados.map((dado) =>
    {if(idEvento == dado.idEvento){
      <ListItem key={dado.id}>
      <ListItemText primary={dado.nome}/>
          <Chip label={dado.nome ? 'Pago' : 'A pagar'} color={dado.nome ? 'default' : 'success'}/>
      </ListItem>
    }}
  );
}

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.background.paper,
}));

function Lista() {
  return (
      <Grid size={{ xs: 12, md: 6, }} sx={{px: 7, py: 2, boxSizing: 'border-box'}}>
        <Demo>
          <List>
            {popularLista(dado)}
          </List>
        </Demo>
      </Grid>
  );
}

export default Lista;