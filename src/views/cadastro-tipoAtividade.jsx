
import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { mensagemSucesso, mensagemErro } from '../components/toastr'; 
import { Grid, Paper, Typography, TextField, Stack, Button } from "@mui/material";
import "../style/cadastro.css";

import {api }from '../config/axios';

export default function CadastroTipoAtividade() {
  const baseURL = '/tipoAtividade';
  const { idParam } = useParams();
  const navigate = useNavigate();
  
  const [acao, setAcao] = useState("Cadastro");
  const [mensagem, setMensagem] = useState("Faça cadastro de novos");
  const [acaoButton, setAcaoButton] = useState("Criar");
  const [navegacao, setNavegacao] = useState("/");

  const [id, setIdTipoAtividade] = useState("");
  const [nomeTipoAtividade, setNomeTipoAtividade] = useState("");
  
  useEffect(() => {
    if (!idParam) return;

    api.get(`${baseURL}/${idParam}`).then((response) => {
      const dados = response.data;
      setIdTipoAtividade(dados.id);
      setNomeTipoAtividade(dados.nome);

      setAcao("Edição");
      setMensagem("Faça edição dos");
      setAcaoButton("Editar");
    });
  }, [idParam]);

  async function save(e) {
    e.preventDefault();
    const data = {id, nomeTipoAtividade};

    try {
      if(!nomeTipoAtividade?.trim()){
        mensagemErro("Atividade precisa de um nome que não seja vazio.");
        return;
      }

      if (!idParam) {
        await api.post(baseURL, data);
          mensagemSucesso(`Novo tipo ${nomeTipoAtividade} criado com sucesso!`);
          navigate(`/listagem-eventos`);
      } else {
        await api.put(`${baseURL}/${idParam}`, data);
          mensagemSucesso(`Tipo ${nomeTipoAtividade} alterado com sucesso!`);
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
              mensagemSucesso(`Tipo de atividade ${nomeTipoAtividade} excluído com sucesso!`);
              navigate(`/listagem-eventos`);
          })
          .catch(function (error) {
              mensagemErro(`Erro ao excluir ${nomeTipoAtividade}`);
          });
  }

  return (
        <Grid container direction="column" sx={{ mt: 6, minHeight: "100vh", width: "100%", overflow: "hidden", justifyContent: "center", alignItems: "center", px: { xs: 1, sm: 3 } }} >
            <Paper elevation={3} sx={{ width: "100%", maxWidth: 900, maxHeight: "90vh", overflowY: "auto", p: { xs: 2, sm: 4 }}}>
                  <Typography component="h1" variant="h3">{acao} de Tipo de Atividade</Typography>
                  <Typography variant="subtitle1" sx={{ mb: 3 }}>{mensagem} tipos de atividade.</Typography>
                  <Grid container component="form" onSubmit={save} noValidate spacing={2} >
                       <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                          <Typography variant="body1" className="label">Nome*</Typography>
                          <TextField name="nomeTipoAtividade" placeholder="Nome do tipo de atividade" required value={nomeTipoAtividade} onChange={(e) => setNomeTipoAtividade(e.target.value)} fullWidth/>
                      </Grid>
                      <Grid item xs={12} justifyContent="flex-end">
                          <Stack spacing={2} direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" >
                              <Button variant="outlined" onClick={() => navigate("/listagem-eventos")}>Voltar</Button>
                              <Button variant="contained" type="submit" >{acaoButton} Tipo de Atividade</Button>
                              {idParam ? <Button variant="outlined" color="error" onClick={exclude}>Excluir</Button> : false}
                          </Stack>
                      </Grid>
                  </Grid>
              </Paper>
        </Grid>
    );
}