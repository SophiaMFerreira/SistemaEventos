
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

  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (!idParam) return;
    axios.get(`${baseURL}/${idParam}`).then((response) => {
      const dados = response.data;
      setId(dados.id);
      setNome(dados.nome);
      setDescricao(dados.descricao);
      setAcao("Edição");
      setMensagem("Faça edição dos");
      setAcaoButton("Editar");
    });
  }, [idParam, baseURL]);

  async function save(e) {
    e.preventDefault();

    if (!descricao || descricao.trim() === "") {
      mensagemErro("O campo Descrição é obrigatório. Por favor, preencha a descrição do tipo de evento.");
      return;
    }

    const payload = { nome, descricao };

    try {
      if (!idParam) {
        await axios.post(baseURL, payload);
        mensagemSucesso(`Novo tipo ${nome} criado com sucesso!`);
      } else {
        await axios.put(`${baseURL}/${idParam}`, payload);
        mensagemSucesso(`Tipo ${nome} alterado com sucesso!`);
      }
      navigate("/listagem-eventos");
    } catch (error) {
      mensagemErro(error?.response?.data || "Erro ao salvar os dados.");
    }
  }

  async function exclude() {
    let url = `${baseURL}/${idParam}`;
    await axios
      .delete(url, JSON.stringify({ idParam }), { headers: { 'Content-Type': 'application/json' } })
      .then(() => { mensagemSucesso(`Tipo de evento ${nome} excluído com sucesso!`); navigate(`/listagem-eventos`); })
      .catch(() => { mensagemErro(`Erro ao excluir ${nome}`); });
  }

  return (
    <Grid container direction="column" sx={{ mt: 10, mb: 6, width: "100%", justifyContent: "center", alignItems: "center", px: { xs: 1, sm: 3 } }}>
      <Paper elevation={2} sx={{ width: "100%", maxWidth: 900, p: { xs: 2, sm: 4 } }}>
        <Typography component="h1" variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
          {acao} de Tipo de Evento
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {mensagem} tipos de evento.
        </Typography>
        <Grid container component="form" onSubmit={save} noValidate spacing={2}>
          <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%" }}>
            <Typography variant="body1" className="label">Nome*</Typography>
            <TextField name="nome" placeholder="Nome do tipo de evento" required value={nome} onChange={(e) => setNome(e.target.value)} fullWidth />
          </Grid>
          <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%" }}>
            <Typography variant="body1" className="label">Descrição*</Typography>
            <TextField
              name="descricao"
              placeholder="Descreva o tipo de evento"
              multiline rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              fullWidth
              helperText={!descricao ? "Campo obrigatório" : ""}
              error={descricao !== undefined && descricao.trim() === ""}
            />
          </Grid>
          {/* Botões centralizados */}
          <Grid
            size={12}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              mt: 2,
            }}
          >
            <Stack
              spacing={2}
              direction={{ xs: "column", sm: "row" }}
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <Button variant="outlined" onClick={() => navigate("/listagem-eventos")}>Voltar</Button>
              <Button variant="contained" type="submit">{acaoButton} Tipo de Evento</Button>
              {idParam ? <Button variant="outlined" color="error" onClick={exclude}>Excluir</Button> : false}
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default CadastroTipoEvento;
