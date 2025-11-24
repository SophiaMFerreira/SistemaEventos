import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';

function InputsEndereco({cep, setCep,
                        logradouro, setLogradouro,
                        bairro, setBairro, 
                        cidade, setCidade,
                        estado, setEstado,
                        numero, setNumero,
                        complemento, setComplemento}) {
    return (
    <Grid container direction="row" sx={{justifyContent: "center", alignItems: "center", mt: 2}}>
        <Grid item size={10}>
              <Grid container spacing={2} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                  <Grid item size={6}>
                      <Typography variant="h6">CEP*</Typography>
                      <TextField name="cep" placeholder="00000000" value={cep} onChange={(e) => setCep(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
                  </Grid>
                  <Grid item size={6}>
                      <Typography variant="h6">Logradouro*</Typography>
                      <TextField name="logradouro" placeholder="Rua/Avenida/Estrada dos Jaspes" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
                  </Grid>
              </Grid>
        </Grid>
        <Grid item size={10}>
              <Grid container spacing={2} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                  <Grid item size={4}>
                      <Typography variant="h6">Bairro*</Typography>
                      <TextField name="bairro" placeholder="Centro" value={bairro} onChange={(e) => setBairro(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
                  </Grid>
                  <Grid item size={4}>
                      <Typography variant="h6">Cidade*</Typography>
                      <TextField name="cidade" placeholder="Juiz de Fora" value={cidade} onChange={(e) => setCidade(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
                  </Grid>
                  <Grid item size={4}>
                      <Typography variant="h6">Estado*</Typography>
                      <TextField name="estado" placeholder="Minas Gerais" value={estado} onChange={(e) => setEstado(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
                  </Grid>
              </Grid>
        </Grid>
        <Grid item size={10}>
              <Grid container spacing={2} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                  <Grid item size={2}>
                      <Typography variant="h6">Número*</Typography>
                      <TextField name="numero" placeholder="180" value={numero} onChange={(e) => setNumero(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
                  </Grid>
                  <Grid item size={10}>
                      <Typography variant="h6">Complemento</Typography>
                      <TextField name="complemento" placeholder="Casa A" value={complemento} onChange={(e) => setComplemento(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
                  </Grid>
              </Grid>
        </Grid>
    </Grid>
  );
}

export default InputsEndereco;
