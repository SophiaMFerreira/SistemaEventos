
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { successMessage, errorMessage, mensagemSucesso, mensagemErro } from '../components/toastr'; 
import Box from "@mui/material/Box";
import Sidebar from "../components/sidebar";
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

  function CadastroTipoEvento() {
  const baseURL = `${BASE_URL}/tipoEvento`;
  const { idParam } = useParams();
  const navigate = useNavigate();
  
  
  const [acao, setAcao] = React.useState("Cadastro");
  const [mensagem, setMensagem] = React.useState("Faça cadastro de novos");
  const [acaoButton, setAcaoButton] = React.useState("Criar");
  const [id, setIdTipoEvento] = React.useState("");
  const [nomeTipoEvento, setNomeTipoEvento] = React.useState("");
  const [descricao, setDescricaoTipoEvento] = React.useState("");
  
  useEffect(() => {
    if (!idParam) return;

    axios.get(`${baseURL}/${idParam}`).then((response) => {
      const dados = response.data;
      setIdTipoEvento(dados.id);
      setNomeTipoEvento(dados.nomeTipoEvento);
      setDescricaoTipoEvento(dados.descricao);

      setAcao("Edição");
      setMensagem("Faça edição dos");
      setAcaoButton("Editar");
    });
  }, [idParam, baseURL]);

  async function save(e) {
    e.preventDefault();
    const data = { id, nomeTipoEvento, descricao };

    try {
      if (!idParam) {
        await axios.post(baseURL, data);
          mensagemSucesso(`Novo tipo ${nomeTipoEvento} criado com sucesso!`);
          navigate(`/tela-principal`);
      } else {
        await axios.put(`${baseURL}/${idParam}`, data);
          mensagemSucesso(`Tipo ${nomeTipoEvento} alterado com sucesso!`);
          navigate(`/tela-principal`);
      }
      navigate("/tela-principal");
    } catch (error) {
      mensagemErro(error.response.data);
    }
  }

  return (
    <Box display="flex" height="100vh" bgcolor="background.default">
      <Box>
        <Sidebar />
      </Box>

      <Box flex={1} p={5} overflow="auto" sx={{ position: "relative", backgroundColor: "background.default", display: "flex", flexDirection: "column", justifyContent: "space-between", }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h3">{acao}  de Tipo de Evento</Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>{mensagem} tipos de evento.</Typography>
          <Grid container direction="row" component="form" onSubmit={save} noValidate sx={{justifyContent: "center", alignItems: "center", mt: 2}}>
            <Grid size={10} spacing={2}>
                <Typography variant="h6">Nome*</Typography>
                <TextField name="nomeTipoEvento" placeholder="Nome do tipo de evento" required value={nomeTipoEvento} onChange={(e) => setNomeTipoEvento(e.target.value)} fullWidth sx={{ mb: 3, }}/>
            </Grid>
            <Grid size={10}>
                <Typography variant="h6">Descrição</Typography>
                <TextField name="descricao" placeholder="Descreva o evento" multiline rows={4} value={descricao} onChange={(e) => setDescricaoTipoEvento(e.target.value)} fullWidth sx={{ mb: 3 }}/>
            </Grid>
            <Grid size={10}>
                <Stack spacing={2} direction="row">
                    <Button variant="outlined" onClick={() => navigate("/tela-principal")}>Voltar</Button>
                    <Button variant="contained" type="submit" >{acaoButton} Tipo de Evento</Button>
                </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}

export default CadastroTipoEvento;