import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';

function InputsSenha({senha, setSenha, confirmarSenha, setConfirmarSenha}) {
  const validacao = (senha !== confirmarSenha && confirmarSenha !== "");

  return (
    <Grid item size={10}> 
        <Grid item size={12} spacing={2}>
              <Typography variant="h6">Senha*</Typography>
              <TextField name="senha" type="password" placeholder="********" value={senha} error={validacao} onChange={(e) => setSenha(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
        </Grid>
        <Grid item size={12} spacing={2}>
              <Typography variant="h6">Confirmar senha*</Typography>
              <TextField name="confirmarSenha" type="password" placeholder="********" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} error={validacao} helperText={validacao ? "As senhas não coincidem" : ""} required fullWidth sx={{ mb: 3, }}/>
        </Grid>
    </Grid>
  );
}

export default InputsSenha;
