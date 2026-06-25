
import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { mensagemSucesso, mensagemErro } from '../components/toastr'; 
import { Grid, Paper, Typography, TextField, Stack, Button } from "@mui/material";
import "../style/cadastro.css";

import {api} from '../config/axios';

function CadastroTipoEvento() {
  const baseURL = '/tipoEvento';
  const { idParam } = useParams();
  const navigate = useNavigate();
  
  const [acao, setAcao] = useState("Cadastro");
  const [mensagem, setMensagem] = useState("Faça cadastro de novos");
  const [acaoButton, setAcaoButton] = useState("Criar");

  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  
  useEffect(() => {
    if (!idParam) return;

    api.get(`${baseURL}/${idParam}`).then((response) => {
      const dados = response.data;
      setId(dados.id);
      setNome(dados.nome);
      setDescricao(dados.descricao);

      setAcao("Edição");
      setMensagem("Faça edição dos");
      setAcaoButton("Editar");
    });
  }, [idParam]);

  async function save(e) {
    e.preventDefault();
    const payload = {
            nome: nome, 
            descricao: descricao 
    };

    try {
      if (!idParam) {      
        await api.post(baseURL, payload);
          mensagemSucesso(`Novo tipo ${nome} criado com sucesso!`);
          navigate(`/listagem-eventos`);
      } else {
        await api.put(`${baseURL}/${idParam}`, payload);
          mensagemSucesso(`Tipo ${nome} alterado com sucesso!`);
          navigate(`/listagem-eventos`);
      }
      navigate("/listagem-eventos");
    } catch (error) {
      mensagemErro(error?.response?.data || "Erro ao salvar os dados.");
    }
  }

  async function exclude() {
      let data = JSON.stringify({ idParam });
      let url = `${baseURL}/${idParam}`;
      await api
          .delete(url, data, {
              headers: { 'Content-Type': 'application/json' },
          })
          .then(function (response) {
              mensagemSucesso(`Tipo de evento ${nome} excluído com sucesso!`);
              navigate(`/listagem-eventos`);
          })
          .catch(function (error) {
              mensagemErro(`Erro ao excluir ${nome}`);
          });
  }

  return (
        <Grid container direction="column" sx={{ mt: 6, minHeight: "100vh", width: "100%", overflow: "hidden", justifyContent: "center", alignItems: "center", px: { xs: 1, sm: 3 } }} >
            <Paper elevation={3} sx={{ width: "100%", maxWidth: 900, maxHeight: "90vh", overflowY: "auto", p: { xs: 2, sm: 4 }}}>
                  <Typography component="h1" variant="h3">{acao} de Tipo de Evento</Typography>
                  <Typography variant="subtitle1" sx={{ mb: 3 }}>{mensagem} tipos de evento.</Typography>
                  <Grid container component="form" onSubmit={save} noValidate spacing={2} >
                       <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                          <Typography variant="body1" className="label">Nome*</Typography>
                          <TextField name="nome" placeholder="Nome do tipo de evento" required value={nome} onChange={(e) => setNome(e.target.value)} fullWidth/>
                      </Grid>
                       <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                          <Typography variant="body1" className="label">Descrição</Typography>
                          <TextField name="descricao" placeholder="Descreva o evento" multiline rows={4} value={descricao} onChange={(e) => setDescricao(e.target.value)} fullWidth/>
                      </Grid>
                      <Grid item xs={12} justifyContent="flex-end">
                          <Stack spacing={2} direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" >
                              <Button variant="outlined" onClick={() => navigate("/listagem-eventos")}>Voltar</Button>
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