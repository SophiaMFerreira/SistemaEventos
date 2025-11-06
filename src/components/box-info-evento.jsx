import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StarsIcon from '@mui/icons-material/Stars';
import Grid from "@mui/material/Grid";


import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/evento`;

 

function BoxInfoEvento() {
    const [dados, setDados] = React.useState(null);

    React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setDados(response.data);
    });
  }, []);

  if(!dados) return null;

const idEvento = 2;
const evento = dados.find(dado => dado.id == idEvento);

    return (
        <Box sx={{px: 6, py: 2, boxSizing: 'border-box'}}>
            <Typography variant="h5" sx={{m: 2}}>{dados.nomeEvento}</Typography>
            <Grid container direction="row" spacing={1} sx={{justifyContent: "center", alignItems: "center", px: 3, py: 1}}>
                <Grid size="auto">
                    <StarsIcon/>
                </Grid>
                <Grid size="auto">
                    <Typography>{evento.dataInicio} - {evento.horaInicio} ~  {evento.dataFim} - {evento.horaFim}</Typography>
                </Grid>
                <Grid size="grow"/>
                <Grid size="auto">
                    <Typography>{evento.lotacao}</Typography>
                </Grid>
            </Grid>
            <Grid container direction="row" spacing={1} sx={{justifyContent: "center", alignItems: "center", px: 3, py: 1}}>
                <Grid size="auto">
                    <StarsIcon/>
                </Grid>
                <Grid size="auto">
                    <Typography>CEP:{evento.cep} ~ {evento.Estado}, {evento.logradouro} {evento.numero}</Typography>
                </Grid>
                <Grid size="grow"/>
                <Grid size="auto">
                    <Typography>{evento.lotacaoMaxima}</Typography>
                </Grid>
            </Grid>
        </Box>
    );
}

export default BoxInfoEvento;
