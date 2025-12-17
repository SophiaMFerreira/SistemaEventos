import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { mensagemSucesso, mensagemErro } from '../components/toastr'; 
import { Grid, Paper, Typography, TextField, Stack, Button } from "@mui/material";
import "../style/cadastro.css";

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroPorteEvento() {
  const baseURL = `${BASE_URL}/porteEvento`;
  const { idParam } = useParams();
  const navigate = useNavigate();
  
  
  const [acao, setAcao] = useState("Cadastro");
  const [mensagem, setMensagem] = useState("Faça cadastro de novos");
  const [acaoButton, setAcaoButton] = useState("Criar");
  const [id, setIdPorteEvento] = useState("");
  const [nomePorteEvento, setNomePorteEvento] = useState("");
  const [numeroMinimoParticipantes, setNumeroMinimoParticipantesPorteEvento] = useState(0);
  const [numeroMaximoParticipantes, setNumeroMaximoParticipantesPorteEvento] = useState(0);
  const [tempoMinimoCancelamento, setTempoMinimoCancelamentoPorteEvento] = useState("");
  const [descricao, setDescricaoPorteEvento] = useState("");

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
          navigate(`/listagem-eventos`);
      } else {
        await axios.put(`${baseURL}/${idParam}`, data);
          mensagemSucesso(`Porte ${nomePorteEvento} alterado com sucesso!`);
          navigate(`/listagem-eventos`);
      }
      navigate("/listagem-eventos");
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
        navigate(`/listagem-eventos`);
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir ${nomePorteEvento}`);
      });
  }
    
  return (
      <Grid container direction="column" sx={{ mt: 6, minHeight: "100vh", width: "100%", overflow: "hidden", justifyContent: "center", alignItems: "center", px: { xs: 1, sm: 3 } }} >
          <Paper elevation={3} sx={{ width: "100%", maxWidth: 900, maxHeight: "90vh", overflowY: "auto", p: { xs: 2, sm: 4 }}}>
            <Typography component="h1" variant="h3">{acao} de Porte de Evento</Typography>
            <Typography variant="subtitle1" sx={{ mb: 3 }}>{mensagem} portes de evento.</Typography>
            <Grid container component="form" onSubmit={save} noValidate spacing={2} >
              <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                  <Typography variant="body1" className="label">Nome*</Typography>
                  <TextField name="nomePorteEvento" placeholder="Nome do porte de evento" value={nomePorteEvento} onChange={(e) => setNomePorteEvento(e.target.value)} required fullWidth/>
              </Grid>
              <Grid container size={12} sx={{ mb: 2, mx: 2, width: "100%", justifyContent: "space-between"}} direction={"row"}>
                <Grid size={6} sx={{ width: "48%", boxSizing: "border-box", maxWidth: "50%"}}>
                    <Typography variant="body1" className="label">Número mínimo de participantes*</Typography>
                    <TextField name="numeroMinimoParticipantes" placeholder="0" min="0" type="number" value={numeroMinimoParticipantes} onChange={(e) => setNumeroMinimoParticipantesPorteEvento(e.target.value)} required fullWidth/>
                  </Grid>
                <Grid size={6} sx={{ width: "48%", boxSizing: "border-box", maxWidth: "50%"}}>
                    <Typography variant="body1" className="label">Número máximo de participantes*</Typography>
                    <TextField name="numeroMaximoParticipantes" placeholder="0" min="1" type="number" value={numeroMaximoParticipantes} onChange={(e) => setNumeroMaximoParticipantesPorteEvento(e.target.value)} required fullWidth/>
                  </Grid>
              </Grid>
              <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                  <Typography variant="body1" className="label">Tempo minimo de cancelamento*</Typography>
                  <TextField name="tempoMinimoCancelamento" placeholder="Tempo mínimo de cancelamento em dias" value={tempoMinimoCancelamento} onChange={(e) => setTempoMinimoCancelamentoPorteEvento(e.target.value)} required fullWidth/>
              </Grid>
              <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                  <Typography variant="body1" className="label">Descrição</Typography>
                  <TextField name="descricao" placeholder="Descreva o porte do evento" value={descricao} onChange={(e) => setDescricaoPorteEvento(e.target.value)} multiline rows={4} fullWidth/>
              </Grid>
              <Grid item xs={12} justifyContent="flex-end">
                  <Stack spacing={2} direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" >
                      <Button variant="outlined" onClick={() => navigate("/listagem-eventos")}>Voltar</Button>
                      <Button variant="contained" type="submit">{acaoButton} Porte de Evento</Button>
                      {idParam ? <Button variant="outlined" color="error" onClick={exclude}>Excluir</Button> : false}
                  </Stack>
              </Grid>
            </Grid>
          </Paper>
      </Grid>
  );
}

export default CadastroPorteEvento;