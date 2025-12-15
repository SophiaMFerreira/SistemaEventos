
import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { mensagemSucesso, mensagemErro } from '../components/toastr'; 
import { Grid, Paper, Typography, TextField, Stack, Button } from "@mui/material";
import "../style/cadastro.css";

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroTipoEvento() {
  const baseURL = `${BASE_URL}/tipoEvento`;
  const { idParam } = useParams();
  const navigate = useNavigate();
  
  
  const [acao, setAcao] = useState("Cadastro");
  const [mensagem, setMensagem] = useState("Faça cadastro de novos");
  const [acaoButton, setAcaoButton] = useState("Criar");
  const [id, setIdTipoEvento] = useState("");
  const [nomeTipoEvento, setNomeTipoEvento] = useState("");
  const [descricao, setDescricaoTipoEvento] = useState("");
  
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

  async function exclude() {
      let data = JSON.stringify({ idParam });
      let url = `${baseURL}/${idParam}`;
      await axios
          .delete(url, data, {
              headers: { 'Content-Type': 'application/json' },
          })
          .then(function (response) {
              mensagemSucesso(`Tipo de evento ${nomeTipoEvento} excluído com sucesso!`);
              navigate(`/tela-principal`);
          })
          .catch(function (error) {
              mensagemErro(`Erro ao excluir ${nomeTipoEvento}`);
          });
  }

  return (
        <Grid container direction="row" p={5} overflow="auto"  fullWidth sx={{ position: "relative", justifyContent: "center"}}>
              <Paper elevation={3} sx={{ p: 4 }}>
                  <Typography component="h1" variant="h3">{acao} de Tipo de Evento</Typography>
                  <Typography variant="subtitle1" sx={{ mb: 3 }}>{mensagem} tipos de evento.</Typography>
                  <Grid container direction="row" component="form" onSubmit={save} noValidate sx={{justifyContent: "center", alignItems: "center", mt: 2}}>
                      <Grid size={10} spacing={2}>
                          <Typography variant="body1" className="label">Nome*</Typography>
                          <TextField name="nomeTipoEvento" placeholder="Nome do tipo de evento" required value={nomeTipoEvento} onChange={(e) => setNomeTipoEvento(e.target.value)} fullWidth sx={{ mb: 3, }}/>
                      </Grid>
                      <Grid size={10}>
                          <Typography variant="body1" className="label">Descrição</Typography>
                          <TextField name="descricao" placeholder="Descreva o evento" multiline rows={4} value={descricao} onChange={(e) => setDescricaoTipoEvento(e.target.value)} fullWidth sx={{ mb: 3 }}/>
                      </Grid>
                      <Grid size={10}>
                          <Stack spacing={2} direction="row" sx={{ display: "flex", justifyContent: "flex-end"}}>
                              <Button variant="outlined" onClick={() => navigate("/tela-principal")}>Voltar</Button>
                              <Button variant="contained" type="submit" >{acaoButton} Tipo de Evento</Button>
                              {idParam ? <Button variant="outlined" color="error" onClick={exclude}>Excluir</Button> : false}
                          </Stack>
                      </Grid>
                  </Grid>
              </Paper>
        </Grid>
    );
}

export default CadastroTipoEvento;