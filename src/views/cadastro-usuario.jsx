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
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

function CadastroUsuario() {

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Formulário enviado!");
  };

  const [genero, setGenero] = React.useState('');
    
  const handleChange = (event) => {
        setGenero(event.target.value);
    };

  return (
    <Box display="flex" height="100vh" bgcolor="background.default">
      <Box>
        
      </Box>

      <Box flex={1} p={5} overflow="auto" sx={{ position: "relative", backgroundColor: "background.default", display: "flex", flexDirection: "column", justifyContent: "space-between", }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h3">Cadastro de Usuários</Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>Faça cadastro com seus dados, promova e participe de eventos incríveis!</Typography>

          <FormControlLabel control={<Checkbox />} label="Sou CNPJ" />

          <Grid container direction="row" component="form" onSubmit={handleSubmit} noValidate sx={{justifyContent: "center", alignItems: "center", mt: 2}}>
            <Grid item size={10}>
                <Typography variant="h6">Nome*</Typography>
                <TextField name="nomeUsuario" placeholder="Nome do usuário" required fullWidth sx={{ mb: 3, }}/>
            </Grid>
            <Grid item size={10}>
                <Typography variant="h6">CPF*</Typography>
                <TextField name="cpfUsuario" placeholder="000.000.000-00" required fullWidth sx={{ mb: 3, }}/>
            </Grid>
            <Grid item size={10}>
                <Grid container spacing={2} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                   <Grid item size={6} spacing={2}>
                        <Typography variant="h6">Data de nascimento*</Typography>
                        <TextField name="dataNascimentoUsuario" type="date" required fullWidth sx={{ mb: 3, }}/>
                    </Grid>
                    <Grid item size={6} spacing={2}>
                        <Typography variant="h6">Gênero</Typography>
                        <Select name="generoUsuario" id="generoUsuario" value={genero} onChange={handleChange} required fullWidth>
                            <MenuItem value={"femenino"}>Femenino</MenuItem>
                            <MenuItem value={"masculino"}>Masculino</MenuItem>
                            <MenuItem value={"lgbtqia+"}>LGBTQIA+</MenuItem>
                            <MenuItem value={"naoDeclarar"}>Prefiro não declarar</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item size={10}>
                <Typography variant="h6">Email para contato*</Typography>
                <TextField name="cpfAdm" placeholder="administrador@email.com" type="email" required fullWidth sx={{ mb: 3, }}/>
            </Grid>
            <Grid item size={10}>
                <Typography variant="h6">Celular para contato*</Typography>
                <TextField name="cpfAdm" placeholder="+00 (00) 00000-0000" required fullWidth sx={{ mb: 3, }}/>
            </Grid>
            <InputsEndereco/>
            <InputsSenha/>
            <Grid item size={10}>
                <Stack spacing={2} direction="row">
                    <Button variant="outlined">Voltar</Button>
                    <Button variant="contained" type="submit">Criar conta</Button>
                </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}

export default CadastroUsuario;
