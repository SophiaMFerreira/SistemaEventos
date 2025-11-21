import React from "react";
import Paper from '@mui/material/Paper';
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputsEndereco from "../components/form-inputsEndereco";
import InputsSenha from "../components/form-inputsSenha";

function CadastroAdministrador() {

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Formulário enviado!");
  };

  return (
    <Box display="flex" height="100vh" bgcolor="background.default">
      <Box>
        
      </Box>

      <Box flex={1} p={5} overflow="auto" sx={{ position: "relative", backgroundColor: "background.default", display: "flex", flexDirection: "column", justifyContent: "space-between", }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h3">Cadastro de Administrador</Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>Faça cadastro de novos administradores.</Typography>
          <Grid container direction="row" component="form" onSubmit={handleSubmit} noValidate sx={{justifyContent: "center", alignItems: "center", mt: 2}}>
            <Grid item size={10}>
                <Typography variant="h6">Nome*</Typography>
                <TextField name="nomeAdm" placeholder="Nome do administrador" required fullWidth sx={{ mb: 3, }}/>
            </Grid>
            <Grid item size={10}>
                <Typography variant="h6">CPF*</Typography>
                <TextField name="cpfAdm" placeholder="000.000.000-00" required fullWidth sx={{ mb: 3, }}/>
            </Grid>
            <Grid item size={10}>
                <Typography variant="h6">Email para contato*</Typography>
                <TextField name="cpfAdm" placeholder="administrador@email.com" type="email" required fullWidth sx={{ mb: 3, }}/>
            </Grid>
            <Grid item size={10}>
                <Typography variant="h6">Celular para contato*</Typography>
                <TextField name="cpfAdm" placeholder="55 (00) 00000-0000" required fullWidth sx={{ mb: 3, }}/>
            </Grid>
            <InputsEndereco/>
            <InputsSenha/>
            <Grid item size={10}>
                <Stack spacing={2} direction="row">
                    <Button variant="outlined">Voltar</Button>
                    <Button variant="contained" type="submit">Criar administrador</Button>
                </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}

export default CadastroAdministrador;
