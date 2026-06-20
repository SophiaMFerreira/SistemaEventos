import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mensagemSucesso, mensagemErro } from "../components/toastr";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Stack,
  Button,
} from "@mui/material";
import "../style/cadastro.css";

import axios from "axios";
import { BASE_URL } from "../config/axios";
import { validarQuantidades } from "../utils/validacoes";

function CadastroPorteEvento() {
  const baseURL = `${BASE_URL}/porteEvento`;
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [acao, setAcao] = useState("Cadastro");
  const [mensagem, setMensagem] = useState("Faça cadastro de novos");
  const [acaoButton, setAcaoButton] = useState("Criar");

  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [minParticipantes, setMinParticipantes] = useState(0);
  const [maxParticipantes, setMaxParticipantes] = useState(1);
  const [tempoMinimoCancelamento, setTempoMinimoCancelamento] = useState(0);
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (!idParam) return;

    axios.get(`${baseURL}/${idParam}`).then((response) => {
      const dados = response.data;

      setId(dados.id);
      setNome(dados.nome);
      setMinParticipantes(dados.minParticipantes);
      setMaxParticipantes(dados.maxParticipantes);
      setTempoMinimoCancelamento(dados.tempoMinimoCancelamento);
      setDescricao(dados.descricao);

      setAcao("Edição");
      setMensagem("Faça edição dos");
      setAcaoButton("Editar");
    });
  }, [idParam, baseURL]);

  async function save(e) {
    e.preventDefault();
    const intMinParticipantes = parseInt(minParticipantes, 10);
    const intMaxParticipantes = parseInt(maxParticipantes, 10);
    const intTempoMinimoCancelamento = parseInt(tempoMinimoCancelamento, 10);

    if (
      isNaN(intMinParticipantes) ||
      isNaN(intMaxParticipantes) ||
      isNaN(intTempoMinimoCancelamento)
    ) {
      mensagemErro("Preencha todos os campos numéricos.");
      return;
    }

    if (intMaxParticipantes > 10000) {
      mensagemErro("O máximo permitido é 10000 participantes.");
      return;
    }

    if (intMinParticipantes > intMaxParticipantes) {
      mensagemErro("A quantidade mínima não pode ser maior que a máxima.");
      return;
    }

    if (intTempoMinimoCancelamento < 1 || intTempoMinimoCancelamento > 17568) {
      mensagemErro(
        "Tempo mínimo de cancelamento deve estar entre 1 e 17568 horas.",
      );
      return;
    }

    const data = {
      id,
      nome,
      minParticipantes: intMinParticipantes,
      maxParticipantes: intMaxParticipantes,
      tempoMinimoCancelamento: intTempoMinimoCancelamento,
      descricao,
    };

    try {
      if (!idParam) {
        if (!validarQuantidades(intMinParticipantes, intMaxParticipantes)) {
          return;
        }

        console.log("Dados enviados:", {
          id,
          nome,
          minParticipantes: intMinParticipantes,
          maxParticipantes: intMaxParticipantes,
          tempoMinimoCancelamento: intTempoMinimoCancelamento,
          descricao,
        });
        await axios.post(baseURL, data);
        mensagemSucesso(`Novo porte ${nome} criado com sucesso!`);
        navigate(`/listagem-eventos`);
      } else {
        await axios.put(`${baseURL}/${idParam}`, data);
        mensagemSucesso(`Porte ${nome} alterado com sucesso!`);
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
        headers: { "Content-Type": "application/json" },
      })
      .then(function (response) {
        mensagemSucesso(`Porte de evento ${nome} excluído com sucesso!`);
        navigate(`/listagem-eventos`);
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir ${nome}`);
      });
  }

  return (
    <Grid
      container
      direction="column"
      sx={{
        mt: 6,
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        px: { xs: 1, sm: 3 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 900,
          maxHeight: "90vh",
          overflowY: "auto",
          p: { xs: 2, sm: 4 },
        }}
      >
        <Typography component="h1" variant="h3">
          {acao} de Porte de Evento
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          {mensagem} portes de evento.
        </Typography>
        <Grid container component="form" onSubmit={save} noValidate spacing={2}>
          <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%" }}>
            <Typography variant="body1" className="label">
              Nome*
            </Typography>
            <TextField
              name="nome"
              placeholder="Nome do porte de evento"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              fullWidth
            />
          </Grid>
          <Grid
            container
            size={12}
            sx={{
              mb: 2,
              mx: 2,
              width: "100%",
              justifyContent: "space-between",
            }}
            direction={"row"}
          >
            <Grid
              size={6}
              sx={{ width: "48%", boxSizing: "border-box", maxWidth: "50%" }}
            >
              <Typography variant="body1" className="label">
                Número mínimo de participantes*
              </Typography>
              <TextField
                name="minParticipantes"
                placeholder="0"
                min="0"
                type="number"
                value={minParticipantes}
                onChange={(e) => setMinParticipantes(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid
              size={6}
              sx={{ width: "48%", boxSizing: "border-box", maxWidth: "50%" }}
            >
              <Typography variant="body1" className="label">
                Número máximo de participantes*
              </Typography>
              <TextField
                name="maxParticipantes"
                placeholder="0"
                min="1"
                type="number"
                value={maxParticipantes}
                onChange={(e) => setMaxParticipantes(e.target.value)}
                required
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%" }}>
            <Typography variant="body1" className="label">
              Tempo minimo de cancelamento*
            </Typography>
            <TextField
              name="tempoMinimoCancelamento"
              placeholder="Tempo mínimo de cancelamento em horas"
              type="number"
              inputProps={{ min: 1, max: 17568 }}
              value={tempoMinimoCancelamento}
              onChange={(e) => setTempoMinimoCancelamento(e.target.value)}
              required
              fullWidth
            />
          </Grid>
          <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%" }}>
            <Typography variant="body1" className="label">
              Descrição
            </Typography>
            <TextField
              name="descricao"
              placeholder="Descreva o porte do evento"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              multiline
              rows={4}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} justifyContent="flex-end">
            <Stack
              spacing={2}
              direction={{ xs: "column", sm: "row" }}
              justifyContent="flex-end"
            >
              <Button
                variant="outlined"
                onClick={() => navigate("/listagem-eventos")}
              >
                Voltar
              </Button>
              <Button variant="contained" type="submit">
                {acaoButton} Porte de Evento
              </Button>
              {idParam ? (
                <Button variant="outlined" color="error" onClick={exclude}>
                  Excluir
                </Button>
              ) : (
                false
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default CadastroPorteEvento;
