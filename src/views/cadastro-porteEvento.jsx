import React from "react";
import Sidebar from "../components/sidebar";
import Paper from '@mui/material/Paper';
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function CadastroPorteEvento() {

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Formulário enviado!");
  };

  return (
    <Box display="flex" height="100vh" bgcolor="background.default">
      <Box>
        <Sidebar />
      </Box>

      <Box flex={1} p={5} overflow="auto" sx={{ position: "relative", backgroundColor: "background.default", display: "flex", flexDirection: "column", justifyContent: "space-between", }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h3">Cadastro de Porte de Evento</Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>Faça cadastro de novos portes de evento.</Typography>
          <Grid container direction="row" component="form" onSubmit={handleSubmit} noValidate sx={{justifyContent: "center", alignItems: "center", mt: 2}}>
            <Grid item size={10}>
                <Typography variant="h6">Nome*</Typography>
                <TextField name="nome" placeholder="Nome do porte de evento" required fullWidth sx={{ mb: 3, }}/>
            </Grid>
            <Grid item size={10}>
              <Grid container sx={{ position: "relative", backgroundColor: "background.default", display: "flex", flexDirection: "column", justifyContent: "space-between", }}>
                <Grid item size={6}>
                  <Typography variant="h6">Número mínimo de participantes*</Typography>
                  <TextField name="numeroMinParticipantes" placeholder="0" min="0" type="number" required fullWidth sx={{ mb: 3 }}/>
                </Grid>
                <Grid item size={6}>
                  <Typography variant="h6">Número máximo de participantes*</Typography>
                  <TextField name="numeroMaxParticipantes" placeholder="0" min="1" type="number" required fullWidth sx={{ mb: 3 }} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item size={10} spacing={2}>
                <Typography variant="h6">Tempo minimo de cancelamento*</Typography>
                <TextField name="nome" placeholder="Tempo mínimo de cancelamento em dias" type="number" required fullWidth sx={{ mb: 3, }}/>
            </Grid>
            <Grid item size={10}>
                <Typography variant="h6">Descrição</Typography>
                <TextField name="descricao" placeholder="Descreva o porte do evento" multiline rows={4} fullWidth sx={{ mb: 3 }}/>
            </Grid>
            <Grid item size={10}>
                <Stack spacing={2} direction="row">
                    <Button variant="outlined">Voltar</Button>
                    <Button variant="contained" type="submit">Criar Tipo de Evento</Button>
                </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}

export default CadastroPorteEvento;
