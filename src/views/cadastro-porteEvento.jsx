import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { mensagemSucesso, mensagemErro } from '../components/toastr'; 
import Sidebar from "../components/sidebar";
import Paper from '@mui/material/Paper';
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroPorteEvento() {
  const baseURL = `${BASE_URL}/porteEvento`;
  const { idParam } = useParams();
  const navigate = useNavigate();
  
  
  const [acao, setAcao] = React.useState("Cadastro");
  const [mensagem, setMensagem] = React.useState("Faça cadastro de novos");
  const [acaoButton, setAcaoButton] = React.useState("Criar");
  const [id, setIdPorteEvento] = React.useState("");
  const [nomePorteEvento, setNomePorteEvento] = React.useState("");
  const [numeroMinimoParticipantes, setNumeroMinimoParticipantesPorteEvento] = React.useState(0);
  const [numeroMaximoParticipantes, setNumeroMaximoParticipantesPorteEvento] = React.useState(0);
  const [tempoMinimoCancelamento, setTempoMinimoCancelamentoPorteEvento] = React.useState("");
  const [descricao, setDescricaoPorteEvento] = React.useState("");

  useEffect(() => {
    if (!idParam) return;

    axios.get(`${baseURL}/${idParam}`).then((response) => {
      const dados = response.data;
      setIdPorteEvento(dados.id);
      setNomePorteEvento(dados.nomePorteEvento);
      setNumeroMinimoParticipantesPorteEvento(dados.numeroMinimoParticipantes);
      setNumeroMaximoParticipantesPorteEvento(dados.numeroMaximoParticipantes);
      setTempoMinimoCancelamentoPorteEvento(dados.tempoMinimoCancelamento);
      setDescricaoPorteEvento(dados.descricao);

      setAcao("Edição");
      setMensagem("Faça edição dos");
      setAcaoButton("Editar");
    });
  }, [idParam, baseURL]);

  async function save(e) {
    e.preventDefault();
    const data = { id, nomePorteEvento, numeroMinimoParticipantes, numeroMaximoParticipantes, tempoMinimoCancelamento,  descricao };

    try {
      if (!idParam) {
        await axios.post(baseURL, data);
          mensagemSucesso(`Novo porte ${nomePorteEvento} criado com sucesso!`);
          navigate(`/tela-principal`);
      } else {
        await axios.put(`${baseURL}/${idParam}`, data);
          mensagemSucesso(`Porte ${nomePorteEvento} alterado com sucesso!`);
          navigate(`/tela-principal`);
      }
      navigate("/tela-principal");
    } catch (error) {
      mensagemErro(error.response.data);
    }
  }

  async function exclude() {
    let data = JSON.stringify({ idParam });
    let url = `${baseURL}/${idParam}`;
    await axios
      .delete(url, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(function (response) {
        mensagemSucesso(`Porte de evento ${nomePorteEvento} excluído com sucesso!`);
        navigate(`/tela-principal`);
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir ${nomePorteEvento}`);
      });
  }
    
  return (
    <Box display="flex" height="100vh" bgcolor="background.default">
      <Box>
        <Sidebar />
      </Box>

      <Box flex={1} p={5} overflow="auto" sx={{ position: "relative", backgroundColor: "background.default", display: "flex", flexDirection: "column", justifyContent: "space-between", }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h3">{acao} de Porte de Evento</Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>{mensagem} portes de evento.</Typography>
          <Grid container direction="row" component="form" onSubmit={save} noValidate sx={{justifyContent: "center", alignItems: "center", mt: 2}}>
            <Grid size={10}>
                <Typography variant="h6">Nome*</Typography>
                <TextField name="nomePorteEvento" placeholder="Nome do porte de evento" value={nomePorteEvento} onChange={(e) => setNomePorteEvento(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
            </Grid>
            <Grid size={10}>
              <Grid container sx={{ position: "relative", backgroundColor: "background.default", display: "flex", flexDirection: "column", justifyContent: "space-between", }}>
                <Grid size={6}>
                  <Typography variant="h6">Número mínimo de participantes*</Typography>
                  <TextField name="numeroMinimoParticipantes" placeholder="0" min="0" type="number" value={numeroMinimoParticipantes} onChange={(e) => setNumeroMinimoParticipantesPorteEvento(e.target.value)} required fullWidth sx={{ mb: 3 }}/>
                </Grid>
                <Grid size={6}>
                  <Typography variant="h6">Número máximo de participantes*</Typography>
                  <TextField name="numeroMaximoParticipantes" placeholder="0" min="1" type="number" value={numeroMaximoParticipantes} onChange={(e) => setNumeroMaximoParticipantesPorteEvento(e.target.value)} required fullWidth sx={{ mb: 3 }} />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={10} spacing={2}>
                <Typography variant="h6">Tempo minimo de cancelamento*</Typography>
                <TextField name="tempoMinimoCancelamento" placeholder="Tempo mínimo de cancelamento em dias" value={tempoMinimoCancelamento} onChange={(e) => setTempoMinimoCancelamentoPorteEvento(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
            </Grid>
            <Grid size={10}>
                <Typography variant="h6">Descrição</Typography>
                <TextField name="descricao" placeholder="Descreva o porte do evento" value={descricao} onChange={(e) => setDescricaoPorteEvento(e.target.value)} multiline rows={4} fullWidth sx={{ mb: 3 }}/>
            </Grid>
            <Grid size={10}>
                <Stack spacing={2} direction="row">
                    <Button variant="outlined" onClick={() => navigate("/tela-principal")}>Voltar</Button>
                    <Button variant="contained" type="submit">{acaoButton} Porte de Evento</Button>
                    {idParam ? <Button variant="outlined" color="error" onClick={() => exclude()}>Excluir</Button> : false}
                </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}

export default CadastroPorteEvento;
