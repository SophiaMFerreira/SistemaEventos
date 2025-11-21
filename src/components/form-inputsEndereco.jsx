import React from "react";
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';

function InputsEndereco() {

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Formulário enviado!");
  };

  return (
    <Grid container direction="row" sx={{justifyContent: "center", alignItems: "center", mt: 2}}>
        <Grid item size={10}>
              <Grid container spacing={2} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                  <Grid item size={6}>
                      <Typography variant="h6">CEP*</Typography>
                      <TextField name="nome" placeholder="00000000" required fullWidth sx={{ mb: 3, }}/>
                  </Grid>
                  <Grid item size={6}>
                      <Typography variant="h6">Logradouro*</Typography>
                      <TextField name="nome" placeholder="Rua/Avenida/Estrada dos Jaspes" required fullWidth sx={{ mb: 3, }}/>
                  </Grid>
              </Grid>
        </Grid>
        <Grid item size={10}>
              <Grid container spacing={2} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                  <Grid item size={4}>
                      <Typography variant="h6">Bairro*</Typography>
                      <TextField name="nome" placeholder="Centro" required fullWidth sx={{ mb: 3, }}/>
                  </Grid>
                  <Grid item size={4}>
                      <Typography variant="h6">Cidade*</Typography>
                      <TextField name="nome" placeholder="Juiz de Fora" required fullWidth sx={{ mb: 3, }}/>
                  </Grid>
                  <Grid item size={4}>
                      <Typography variant="h6">Estado*</Typography>
                      <TextField name="nome" placeholder="Minas Gerais" required fullWidth sx={{ mb: 3, }}/>
                  </Grid>
              </Grid>
        </Grid>
        <Grid item size={10}>
              <Grid container spacing={2} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                  <Grid item size={2}>
                      <Typography variant="h6">Número*</Typography>
                      <TextField name="nome" placeholder="180" type="number" required fullWidth sx={{ mb: 3, }}/>
                  </Grid>
                  <Grid item size={10}>
                      <Typography variant="h6">Complemento</Typography>
                      <TextField name="nome" placeholder="Casa A" required fullWidth sx={{ mb: 3, }}/>
                  </Grid>
              </Grid>
        </Grid>
    </Grid>
  );
}

export default InputsEndereco;
