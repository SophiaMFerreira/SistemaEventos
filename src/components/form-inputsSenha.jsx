import React from "react";
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';

function InputsSenha() {

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Formulário enviado!");
  };

  return (
    <Grid item size={10}> 
        <Grid item size={12} spacing={2}>
              <Typography variant="h6">Senha*</Typography>
              <TextField name="senha" type="password" placeholder="********" required fullWidth sx={{ mb: 3, }}/>
        </Grid>
        <Grid item size={12} spacing={2}>
              <Typography variant="h6">Confirmar senha*</Typography>
              <TextField name="ConfirmarSenha" type="password" placeholder="********" required fullWidth sx={{ mb: 3, }}/>
        </Grid>
    </Grid>
  );
}

export default InputsSenha;
